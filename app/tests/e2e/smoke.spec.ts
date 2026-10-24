import { expect, test, type Page } from '@playwright/test'
import rawCatalog from '../../src/data/items.json' with { type: 'json' }

type CatalogItem = (typeof rawCatalog.items)[number]

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

async function expectNoSideways(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

// The lives bar and all six bins must be on screen without scrolling, on every phone.
async function expectRoundFits(page: Page) {
  await expect(page.getByRole('img', { name: /lives left/ })).toBeInViewport()
  for (const bin of rawCatalog.bins) {
    await expect(binButton(page, bin.id)).toBeInViewport({ ratio: 1 })
  }
}

async function startRound(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play' }).click()
  await page.getByRole('button', { name: 'Start round' }).click()
  await expect(itemFigure(page)).toBeVisible()
}

test('the welcome screen says what the game is, with Play on screen', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Which\s*Bin\?/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play' })).toBeInViewport({ ratio: 1 })
  await expectNoSideways(page)
})

test('no sideways scrolling on a 320px-wide phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await startRound(page)
  await expectNoSideways(page)
  await expectRoundFits(page)
})

// UI 102 grid: on a phone held sideways the round goes side by side, so nothing scrolls out of sight.
test('on a landscape phone the lives, the item and all six bins fit without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await startRound(page)
  await expectNoSideways(page)
  await expectRoundFits(page)
  await expect(itemFigure(page)).toBeInViewport({ ratio: 1 })
})

test('on a landscape phone the "Not quite" sheet fits, with Got it on screen', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await startRound(page)
  const item = await currentItem(page)
  await binButton(page, item.bin === 'sortibak' ? 'biobak' : 'sortibak').click()

  const sheet = page.getByRole('dialog')
  await expect(sheet.getByText('Not quite')).toBeVisible()
  await expect(sheet.getByRole('button', { name: 'Got it' })).toBeInViewport({ ratio: 1 })
})

for (const { width, height } of [
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`no sideways scrolling, and the round fits, at ${width}px wide`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await startRound(page)
    await expectNoSideways(page)
    await expectRoundFits(page)
  })
}

test('a right answer scores, a wrong answer explains why with the source', async ({ page }) => {
  await startRound(page)
  await expectRoundFits(page)

  const first = await currentItem(page)
  await binButton(page, first.bin).click()
  await expect(page.getByText(/Right!/)).toBeVisible()
  await expectRoundFits(page)

  // Wait until the first sticker has gone, like a person would, before reading the next item.
  await expect(itemFigure(page)).not.toHaveText(first.name)
  const second = await currentItem(page)
  await binButton(page, second.bin === 'sortibak' ? 'biobak' : 'sortibak').click()

  const sheet = page.getByRole('dialog')
  await expect(sheet.getByText('Not quite')).toBeVisible()
  await expect(sheet.getByText(second.why)).toBeVisible()
  await expect(sheet.getByText(/Source: Omrin waste guide 2026/)).toBeVisible()
  await expect(sheet.getByRole('button', { name: 'Got it' })).toBeInViewport()

  await sheet.getByRole('button', { name: 'Got it' }).click()
  await expect(page.getByText('Item 3 of 10')).toBeVisible()
  await expect(page.getByRole('img', { name: '2 of 3 lives left' })).toBeVisible()
})

// Press on the sticker, move in small steps like a finger, and let go at `to`.
async function dragItemTo(page: Page, to: { x: number; y: number }) {
  const from = await itemFigure(page).boundingBox()
  if (!from) throw new Error('No item on screen to drag')
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  await page.mouse.up()
}

test('dragging the item onto its bin sorts it', async ({ page }) => {
  await startRound(page)
  const item = await currentItem(page)
  const bin = await binButton(page, item.bin).boundingBox()
  if (!bin) throw new Error(`Bin ${item.bin} not on screen`)

  await dragItemTo(page, { x: bin.x + bin.width / 2, y: bin.y + bin.height / 2 })

  await expect(page.getByText(/Right!/)).toBeVisible()
  await expect(page.getByText('Item 2 of 10')).toBeVisible()
})

test('dropping the item outside the bins puts it back without answering', async ({ page }) => {
  await startRound(page)
  const item = await currentItem(page)
  const lives = page.getByRole('img', { name: '3 of 3 lives left' })

  await dragItemTo(page, { x: 10, y: 10 })

  await expect(itemFigure(page)).toHaveText(item.name)
  await expect(page.getByText('Item 1 of 10')).toBeVisible()
  await expect(lives).toBeVisible()
})

test('the score screen fits sideways after a full round', async ({ page }) => {
  await startRound(page)
  for (let i = 0; i < 10; i += 1) {
    const item = await currentItem(page)
    await binButton(page, i === 0 ? (item.bin === 'sortibak' ? 'biobak' : 'sortibak') : item.bin).click()
    if (i === 0) await page.getByRole('button', { name: 'Got it' }).click()
    if (i < 9) await expect(itemFigure(page)).not.toHaveText(item.name)
  }

  await expect(page.getByRole('heading', { name: 'Round 1 complete' })).toBeVisible()
  await expectNoSideways(page)
})
