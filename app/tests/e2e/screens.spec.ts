import { expect, test, type Page } from '@playwright/test'
import rawCatalog from '../../src/data/items.json' with { type: 'json' }

// Screenshots of every screen at iPhone SE size, for the work log and process book: npm run screens
const OUT = '../design/screens'

async function currentItem(page: Page) {
  const name = (await page.getByRole('region', { name: 'Item to sort' }).getByRole('figure').innerText()).trim()
  return rawCatalog.items.find((item) => item.name === name) as (typeof rawCatalog.items)[number]
}

function bin(page: Page, binId: string) {
  const name = rawCatalog.bins.find((candidate) => candidate.id === binId)?.name
  return page.getByRole('group', { name: 'Bins' }).getByRole('button', { name: new RegExp(`^${name}:`) })
}

async function answer(page: Page, isRight: boolean) {
  const item = await currentItem(page)
  await bin(page, isRight ? item.bin : item.bin === 'sortibak' ? 'biobak' : 'sortibak').click()
  return item
}

async function waitForNext(page: Page, previousName: string) {
  await expect(page.getByRole('region', { name: 'Item to sort' }).getByRole('figure')).not.toHaveText(previousName)
}

test.describe('screens', () => {
  test('every screen', async ({ page }) => {
    test.skip(test.info().project.name !== 'iphone-se', 'Screenshots at one size only')
    await page.goto('/')
    await page.screenshot({ path: `${OUT}/01-welcome.png` })

    await page.getByRole('button', { name: 'Play' }).click()
    await page.screenshot({ path: `${OUT}/02-how-to-play.png`, fullPage: true })

    await page.getByRole('button', { name: 'Start round' }).click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/03-round.png` })

    const first = await answer(page, true)
    await waitForNext(page, first.name)
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/04-right-answer.png` })

    await answer(page, false)
    await expect(page.getByRole('dialog').getByText('Not quite')).toBeVisible()
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/05-not-quite.png` })
    await page.getByRole('button', { name: 'Got it' }).click()

    for (let i = 0; i < 8; i += 1) {
      const item = await answer(page, true)
      if (i < 7) await waitForNext(page, item.name)
    }
    await expect(page.getByRole('heading', { name: 'Round 1 complete' })).toBeVisible()
    await page.screenshot({ path: `${OUT}/06-score.png`, fullPage: true })

    await page.getByRole('button', { name: 'Save score' }).click()
    await expect(page.getByRole('heading', { name: /Leaderboard/ })).toBeVisible()
    await page.screenshot({ path: `${OUT}/07-leaderboard.png`, fullPage: true })
  })
})
