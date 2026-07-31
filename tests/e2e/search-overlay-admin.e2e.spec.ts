import { expect, test } from '@playwright/test'

test.describe('Search overlay with admin bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: '1', email: 'admin@test.com' } }),
      })
    })
  })

  test('result click navigates above admin bar', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await expect(page.locator('#payload-admin-bar')).toBeVisible()

    await page.getByRole('button', { name: '搜尋' }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const dialogZ = await dialog.evaluate((el) => getComputedStyle(el).zIndex)
    const adminZ = await page.locator('#payload-admin-bar').evaluate((el) => getComputedStyle(el).zIndex)
    expect(Number(dialogZ)).toBeGreaterThan(Number(adminZ))

    await dialog.getByPlaceholder('搜尋文章…').fill('pancreas')
    await page.waitForResponse((response) => response.url().includes('/api/search') && response.ok())

    const resultLink = dialog.locator('ul li a').first()
    await expect(resultLink).toBeVisible()

    const box = await resultLink.boundingBox()
    expect(box).toBeTruthy()
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)

    await expect(page).toHaveURL(/\/posts\//)
  })
})
