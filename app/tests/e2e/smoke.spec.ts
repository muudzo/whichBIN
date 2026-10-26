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

type Box = { x: number; y: number; width: number; height: number }
const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

// Design review 26 Oct: the round fills the screen without scrolling or overlapping, at the start and once
// a "Right!" card has appeared. On upright screens the bins are in the middle and the item sits below them, in thumb reach.
async function expectRoundLayout(page: Page, isUpright: boolean) {
  const scroll = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - window.innerWidth,
    y: document.documentElement.scrollHeight - window.innerHeight,
  }))
  expect(scroll.x).toBeLessThanOrEqual(0)
  expect(scroll.y).toBeLessThanOrEqual(0)
  await expectRoundFits(page)
  await expect(itemFigure(page)).toBeInViewport({ ratio: 1 })

  const item = await itemFigure(page).boundingBox()
  const bins = await page.getByRole('group', { name: 'Bins' }).boundingBox()
  if (!item || !bins) throw new Error('Item or bins not on screen')
  expect(overlaps(item, bins)).toBe(false)
  if (isUpright) expect(item.y).toBeGreaterThanOrEqual(bins.y + bins.height)
}

for (const { width, height } of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`the round fits ${width} × ${height} without scrolling or overlapping, also after "Right!"`, async ({ page }) => {
    // Reduced motion, so the boxes are measured at rest: mid-entrance, the turning item's box is briefly bigger.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width, height })
    await startRound(page)
    await expectRoundLayout(page, height > width)

    const item = await currentItem(page)
    await binButton(page, item.bin).click()
    await expect(page.getByText('Right!')).toBeVisible()
    await expect(itemFigure(page)).not.toHaveText(item.name)
    await expectRoundLayout(page, height > width)
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

// Design review 26 Oct: the drop zone must be easy to recognise. The bin under the item opens its lid; the others stay shut.
test('while the item is dragged over a bin, that bin opens and no other', async ({ page }) => {
  await startRound(page)
  const item = await currentItem(page)
  const from = await itemFigure(page).boundingBox()
  const bin = await binButton(page, item.bin).boundingBox()
  if (!from || !bin) throw new Error('Item or bin not on screen')

  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(bin.x + bin.width / 2, bin.y + bin.height / 2, { steps: 12 })

  await expect(binButton(page, item.bin)).toHaveAttribute('data-open', 'true')
  await expect(page.locator('[data-bin-id][data-open]')).toHaveCount(1)
  await page.mouse.up()
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

// Forgiving targets: a drop just past a bin's edge still lands in it. (The gaps between bins are
// covered by the nearestTarget unit tests.) The drop is just outside the bin's outer edge, where no other bin competes.
test('dropping the item just beside its bin still sorts it there', async ({ page }) => {
  await startRound(page)
  const item = await currentItem(page)
  const bin = await binButton(page, item.bin).boundingBox()
  const grid = await page.getByRole('group', { name: 'Bins' }).boundingBox()
  if (!bin || !grid) throw new Error('No bins on screen')
  const centre = { x: bin.x + bin.width / 2, y: bin.y + bin.height / 2 }
  // Left column: drop to its left; right column: to its right; middle column: above or below, away from the grid's centre.
  const fromMiddle = centre.x - (grid.x + grid.width / 2)
  const across = Math.abs(fromMiddle) < bin.width / 2 ? 0 : Math.sign(fromMiddle)
  const down = across === 0 ? Math.sign(centre.y - (grid.y + grid.height / 2)) : 0

  await dragItemTo(page, {
    x: centre.x + across * (bin.width / 2 + 8),
    y: centre.y + down * (bin.height / 2 + 8),
  })

  await expect(page.getByText('Right!')).toBeVisible()
  await expect(page.getByText('Item 2 of 10')).toBeVisible()
})

// Heuristic fix F1 (H3): the browser's or phone's Back button doesn't leave the game; in a round it asks first.
test("the Back button in a round asks before leaving, and Leave goes to the start", async ({ page }) => {
  await startRound(page)
  const sheet = page.getByRole('dialog', { name: 'Leave this round?' })

  await page.goBack()
  await expect(sheet).toBeVisible()
  await sheet.getByRole('button', { name: 'Keep playing' }).click()
  await expect(sheet).toBeHidden()
  await expect(page.getByText('Item 1 of 10')).toBeVisible()

  await page.goBack()
  await sheet.getByRole('button', { name: 'Leave' }).click()
  await expect(page.getByRole('heading', { name: /Which\s*Bin\?/ })).toBeVisible()
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
