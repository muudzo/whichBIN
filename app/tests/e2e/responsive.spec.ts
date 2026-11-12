import { expect, test, type Page } from '@playwright/test'
import rawCatalog from '../../src/data/items.json' with { type: 'json' }

// The responsive check (9 Nov, notes/plans/2026-11-09-responsive-devices.md). One whole round at every size in the
// matrix, in Chrome's engine and Safari's (the responsive-chromium and responsive-webkit projects in playwright.config.ts):
// - every screen: no sideways scrolling, every button at least 44 × 44px, and it opens at the top;
// - the round: fits without scrolling at the start, after each "Right!" and with "Not quite" open, and an open bin
//   doesn't overlap its neighbour;
// - both sheets over the round have their buttons on screen.
// Plus text at 200% on a 375 × 667 phone, where the round may scroll but nothing may run off the side or overlap.

type CatalogItem = (typeof rawCatalog.items)[number]
type Box = { x: number; y: number; width: number; height: number }

const SIZES = [
  // phones
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  // phones held sideways; 800 × 304 is a 360 × 800 Android phone with Chrome's address bar showing
  { width: 568, height: 320 },
  { width: 667, height: 375 },
  { width: 800, height: 304 },
  { width: 844, height: 390 },
  // tablets, both ways up
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1024, height: 1366 },
  // laptops and desktops
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const

// A fixed round, so every size sees the same items: Math.random is seeded before the app loads (mulberry32).
// Seed 4 deals the items with the longest explanations: the wine glass ("Right!") and batteries and frying oil,
// which are answered wrong so their "Not quite" cards are checked.
const SEED = 4
const ANSWER_WRONG = new Set(['batteries', 'frying-oil'])

function seedRandom(seed: number) {
  let state = seed >>> 0
  Math.random = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// "Fully on screen". 0.99, not 1: an element that starts at a fraction of a pixel measures 0.9999999 (smoke.spec.ts).
const FULLY = 0.99
const MIN_TARGET = 44

const itemFigure = (page: Page) => page.getByRole('region', { name: 'Item to sort' }).getByRole('figure')

async function currentItem(page: Page): Promise<CatalogItem> {
  const name = (await itemFigure(page).innerText()).trim()
  const item = rawCatalog.items.find((candidate) => candidate.name === name)
  if (!item) throw new Error(`Unknown item on screen: "${name}"`)
  return item
}

function binButton(page: Page, binId: string) {
  const bin = rawCatalog.bins.find((candidate) => candidate.id === binId)
  return page.getByRole('group', { name: 'Bins' }).getByRole('button', { name: new RegExp(`^${bin?.name}:`) })
}

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

async function expectNoSideways(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, 'sideways scrolling').toBeLessThanOrEqual(0)
}

async function expectOpensAtTop(page: Page) {
  expect(await page.evaluate(() => window.scrollY), 'opened scrolled down').toBe(0)
}

// Every button on screen at least 44 × 44px (WCAG 2.5.5, Apple's minimum for touch). Lists the ones that aren't.
async function expectTargets(page: Page) {
  const small = await page.locator('button').evaluateAll(
    (buttons, min) =>
      buttons
        .map((button) => ({ button, box: button.getBoundingClientRect() }))
        .filter(({ box }) => box.width > 0 && box.height > 0)
        .filter(({ box }) => Math.round(box.width) < min || Math.round(box.height) < min)
        .map(({ button, box }) => `${button.getAttribute('aria-label') ?? button.textContent?.trim()} ${Math.round(box.width)}×${Math.round(box.height)}`),
    MIN_TARGET,
  )
  expect(small, 'buttons under 44px').toEqual([])
}

// The round fits the screen: nothing scrolls, and the status bar, the lives and all six bins are fully on screen.
async function expectRoundFits(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  expect(overflow, 'the round scrolls').toBeLessThanOrEqual(0)
  await expect(page.locator('main header')).toBeInViewport({ ratio: FULLY })
  await expect(page.getByRole('img', { name: /lives left/ })).toBeInViewport({ ratio: FULLY })
  for (const bin of rawCatalog.bins) await expect(binButton(page, bin.id)).toBeInViewport({ ratio: FULLY })
}

// Under "Not quite" the right bin opens and grows 6%; it must not run into the bin next to it.
async function expectBinsApart(page: Page) {
  const boxes: Box[] = await page.locator('[data-bin-id]').evaluateAll((bins) => bins.map((bin) => bin.getBoundingClientRect().toJSON()))
  for (const [i, a] of boxes.entries()) {
    for (const b of boxes.slice(i + 1)) expect(overlaps(a, b), 'two bins overlap').toBe(false)
  }
}

// A sheet over the round, opened from the status bar: its buttons fully on screen. The first button closes it.
async function checkSheet(page: Page, opener: string, title: string, buttons: readonly string[]) {
  await page.getByRole('button', { name: opener, exact: true }).click()
  const sheet = page.getByRole('dialog', { name: title })
  for (const name of buttons) await expect(sheet.getByRole('button', { name, exact: true })).toBeInViewport({ ratio: FULLY })
  await expectTargets(page)
  await sheet.getByRole('button', { name: buttons[0], exact: true }).click()
  await expect(sheet).toBeHidden()
}

// Answers the item on screen (wrong for ANSWER_WRONG) and checks the round in the state that follows.
// Returns true if it checked a "Not quite" card.
async function answerAndCheck(page: Page, itemNumber: number) {
  const item = await currentItem(page)
  const isWrong = ANSWER_WRONG.has(item.id)
  await binButton(page, isWrong ? (item.bin === 'sortibak' ? 'biobak' : 'sortibak') : item.bin).click()

  if (isWrong) {
    const gotIt = page.getByRole('region', { name: 'Not quite' }).getByRole('button', { name: 'Got it' })
    await expect(gotIt).toBeInViewport({ ratio: FULLY })
    await expectRoundFits(page)
    await expectBinsApart(page)
    await gotIt.click()
  }
  if (itemNumber === 10) return isWrong

  // The next item is up: the count has moved on and the previous sticker has gone
  await expect(page.getByText(`Item ${itemNumber + 1} of 10`)).toBeVisible()
  await expect(itemFigure(page)).not.toHaveText(item.name)
  await expect(itemFigure(page)).toBeInViewport({ ratio: FULLY })
  if (!isWrong) await expect(page.locator('main [aria-live]')).toBeInViewport({ ratio: FULLY }) // the "Right!" card
  await expectRoundFits(page)
  return isWrong
}

test.use({ reducedMotion: 'reduce' }) // boxes measured at rest, not mid-animation

for (const { width, height } of SIZES) {
  test.describe(`${width} × ${height}`, () => {
    test.use({ viewport: { width, height } })

    test('every screen fits, every button is at least 44px, and every screen opens at the top', async ({ page }) => {
      await page.addInitScript(seedRandom, SEED)
      await page.goto('/')

      // Start screen: Play and both links on screen without scrolling
      await expect(page.getByRole('heading', { name: /Which\s*Bin\?/ })).toBeVisible()
      for (const name of ['Play', 'How to play', 'See the leaderboard']) {
        await expect(page.getByRole('button', { name, exact: true })).toBeInViewport({ ratio: FULLY })
      }
      await expectNoSideways(page)
      await expectTargets(page)

      // How to play (the first Play of a visit shows it); a page to read, so it may scroll
      await page.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(page.getByRole('heading', { name: 'How to play' })).toBeVisible()
      await expectOpensAtTop(page)
      await expectNoSideways(page)
      await expectTargets(page)
      await page.getByRole('button', { name: 'Start round' }).click()

      // The round, and both sheets over it
      await expect(itemFigure(page)).toBeInViewport({ ratio: FULLY })
      await expectOpensAtTop(page)
      await expectRoundFits(page)
      await expectNoSideways(page)
      await expectTargets(page)
      await checkSheet(page, 'How to play', 'How to play', ['Back to the round'])
      await checkSheet(page, 'Leave round', 'Leave this round?', ['Keep playing', 'Leave'])

      let notQuiteChecked = 0
      for (let itemNumber = 1; itemNumber <= 10; itemNumber += 1) {
        if (await answerAndCheck(page, itemNumber)) notQuiteChecked += 1
      }
      expect(notQuiteChecked, 'the seeded round no longer deals batteries or frying oil').toBeGreaterThan(0)

      // Score
      await expect(page.getByRole('heading', { name: 'Round 1 complete' })).toBeVisible()
      await expectOpensAtTop(page)
      await expectNoSideways(page)
      await expectTargets(page)

      // Leaderboard, opened from the score screen's last button: its title in view
      await page.getByRole('button', { name: 'See the leaderboard' }).click()
      await expect(page.getByRole('heading', { name: /Leaderboard/ })).toBeInViewport({ ratio: FULLY })
      await expectOpensAtTop(page)
      await expectNoSideways(page)
      await expectTargets(page)
    })
  })
}

// Every bin's name and hint stay inside the bin (measured on the text itself, not its box).
async function expectLabelsInsideBins(page: Page) {
  const outside = await page.locator('[data-bin-id]').evaluateAll((bins) =>
    bins.flatMap((bin) => {
      const box = bin.getBoundingClientRect()
      const walker = document.createTreeWalker(bin, NodeFilter.SHOW_TEXT)
      const problems: string[] = []
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.trim() || node.parentElement?.closest('kbd')) continue // the 1–6 key hint
        const range = document.createRange()
        range.selectNodeContents(node)
        const text = range.getBoundingClientRect()
        if (text.left < box.left || text.right > box.right || text.bottom > box.bottom) problems.push(node.textContent.trim())
      }
      return problems
    }),
  )
  expect(outside, 'bin labels outside their bin').toEqual([])
}

test.describe('375 × 667, text at 200%', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('nothing runs off the side, bin names stay in their bins, and the sheets’ buttons are on screen', async ({ page }) => {    await page.addInitScript(seedRandom, SEED)
    await page.goto('/')
    // Twice the text size: everything measured in rem doubles, as with the phone's largest text setting
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })

    await expect(page.getByRole('heading', { name: /Which\s*Bin\?/ })).toBeVisible()
    await expectNoSideways(page)
    await page.getByRole('button', { name: 'Play', exact: true }).click()
    await page.getByRole('button', { name: 'Start round' }).click()

    // The round scrolls at this size (plan: "Not changing"), but it opens at the top and nothing overlaps
    await expect(itemFigure(page)).toBeVisible()
    await expectOpensAtTop(page)
    await expectNoSideways(page)
    await expectLabelsInsideBins(page)
    await expectBinsApart(page)
    await expectTargets(page)
    await checkSheet(page, 'How to play', 'How to play', ['Back to the round'])
    await checkSheet(page, 'Leave round', 'Leave this round?', ['Keep playing', 'Leave'])

    // The leaderboard's title is one long word: it must not push the page sideways either
    await page.getByRole('button', { name: 'Leave round' }).click()
    await page.getByRole('dialog', { name: 'Leave this round?' }).getByRole('button', { name: 'Leave', exact: true }).click()
    await page.getByRole('button', { name: 'See the leaderboard' }).click()
    await expect(page.getByRole('heading', { name: /Leaderboard/ })).toBeVisible()
    await expectNoSideways(page)
  })
})
