import { expect, test } from '@playwright/test'

test.describe('Search overlay', () => {
  test('result click navigates to post', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('button', { name: '搜尋' }).first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const input = dialog.getByPlaceholder('搜尋文章…')
    await input.fill('pancreas')
    await page.waitForResponse((response) => response.url().includes('/api/search') && response.ok())

    const resultLink = dialog.locator('ul li a').first()
    await expect(resultLink).toBeVisible()

    const box = await resultLink.boundingBox()
    expect(box).toBeTruthy()
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)

    await expect(page).toHaveURL(/\/posts\//)
  })

  test('view-all click navigates to posts search', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('button', { name: '搜尋' }).first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await page.route('**/api/search?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalDocs: 20,
          docs: [
            {
              title: '測試文章',
              slug: 'who-should-watch-pancreas-health',
              meta: { description: 'stub' },
              categories: [{ title: '基礎知識' }],
            },
          ],
        }),
      })
    })

    const input = dialog.getByPlaceholder('搜尋文章…')
    await input.fill('pancreas')
    await page.waitForResponse((response) => response.url().includes('/api/search') && response.ok())

    const viewAll = dialog.getByRole('link', { name: /查看全部 20 筆結果/ })
    await expect(viewAll).toBeVisible()

    const box = await viewAll.boundingBox()
    expect(box).toBeTruthy()
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)

    await expect(page).toHaveURL(/\/posts\?.*q=/)
  })
})
