import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('lesson smoke: home to lesson flow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Web Mishnah' }).first()).toBeVisible()
  await page.getByText('Mishnah 1').first().click()
  await expect(page.getByText('Mishnah Berakhot 1:1')).toBeVisible({ timeout: 10000 })
  await page
    .getByRole('button', { name: /Practice/i })
    .first()
    .click()
})

test('lesson page a11y', async ({ page }) => {
  await page.goto('/learn/zeraim/berakhot/1/1')
  await expect(page.getByText('Mishnah Berakhot 1:1')).toBeVisible({ timeout: 10000 })
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
