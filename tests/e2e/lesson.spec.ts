import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function expandCatalogToBerakhotChapter1(page: Page) {
  await page.getByRole('button', { name: /Zeraim/i }).click()
  await page.getByRole('button', { name: /^Berakhot\b/i }).click()
  await page.getByRole('button', { name: /Berakhot Chapter 1/i }).click()
}

test('lesson smoke: home to lesson flow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Web Mishnah' }).first()).toBeVisible()
  await expandCatalogToBerakhotChapter1(page)
  await page.getByRole('link', { name: /Mishnah Berakhot 1:1/i }).click()
  await expect(page).toHaveURL(/\/learn\/zeraim\/berakhot\/1\/1$/)
  await expect(page.getByRole('heading', { name: 'Mishnah Berakhot 1:1' })).toBeVisible({
    timeout: 10000,
  })
  const practiceBtn = page.getByRole('button', { name: /Practice/i }).first()
  await practiceBtn.scrollIntoViewIfNeeded()
  await practiceBtn.focus()
  await page.keyboard.press('Enter')
})

test('nested nav: lesson → chapter → home', async ({ page }) => {
  await page.goto('/learn/zeraim/berakhot/1/1')
  await expect(page.getByRole('heading', { name: 'Mishnah Berakhot 1:1' })).toBeVisible({
    timeout: 10000,
  })
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(breadcrumb).toBeVisible()
  await breadcrumb.getByRole('link', { name: 'Berakhot Chapter 1' }).click()
  await expect(page).toHaveURL(/\/learn\/zeraim\/berakhot\/1$/)
  await expect(breadcrumb).toBeVisible()
  await breadcrumb.getByRole('link', { name: 'Web Mishnah' }).click()
  await expect(page).toHaveURL('/')
})

test('header home link returns to catalog', async ({ page }) => {
  await page.goto('/learn/moed/sukkah/1/5')
  await expect(page.getByRole('heading', { name: 'Mishnah Sukkah 1:5' })).toBeVisible({
    timeout: 10000,
  })
  await page.locator('header').getByRole('link', { name: 'Web Mishnah' }).click()
  await expect(page).toHaveURL('/')
})

test('lesson page a11y', async ({ page }) => {
  await page.goto('/learn/zeraim/berakhot/1/1')
  await expect(page.getByRole('heading', { name: 'Mishnah Berakhot 1:1' })).toBeVisible({
    timeout: 10000,
  })
  const results = await new AxeBuilder({ page }).analyze()
  expect(
    results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toHaveLength(0)
})

test('@visual home page snapshot', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Web Mishnah' }).first()).toBeVisible()
  await expect(page).toHaveScreenshot('home.png', { maxDiffPixels: 200 })
})
