import { expect, test } from '@playwright/test'

test('debug: elementFromPoint is inside dialog panel', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '搜尋' }).first().click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible({ timeout: 15000 })

  await dialog.getByPlaceholder('搜尋文章…').fill('pancreas')
  await page.waitForResponse((response) => response.url().includes('/api/search') && response.ok())

  const resultLink = dialog.locator('ul li a').first()
  await expect(resultLink).toBeVisible()

  const hitTest = await resultLink.evaluate((link) => {
    const rect = link.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const top = document.elementFromPoint(x, y)

    return {
      tag: top?.tagName ?? null,
      insideLink: top instanceof Element ? Boolean(top.closest('a[href]')) : false,
      panelPointerEvents: link.closest('.pointer-events-auto')
        ? getComputedStyle(link.closest('.pointer-events-auto')!).pointerEvents
        : null,
    }
  })

  console.log(JSON.stringify(hitTest, null, 2))
  expect(hitTest.insideLink).toBe(true)
  expect(hitTest.panelPointerEvents).toBe('auto')
})
