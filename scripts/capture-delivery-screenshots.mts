import { chromium, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import 'dotenv/config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.delivery', override: true })

const BASE_URL = process.env.DELIVERY_BASE_URL ?? 'https://pancreasblog.com'
const OUT = path.resolve('docs/delivery-screenshots')
const ADMIN_EMAIL = process.env.DELIVERY_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.DELIVERY_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 375, height: 812 }

async function ensureDir() {
  fs.mkdirSync(OUT, { recursive: true })
}

async function launchBrowser() {
  return chromium.launch({ channel: 'chrome' })
}

async function screenshot(page: Page, filename: string, fullPage = false) {
  const filePath = path.join(OUT, filename)
  await page.screenshot({ path: filePath, fullPage })
  console.log(`  ✓ ${filename}`)
}

async function scrollToText(page: Page, text: string) {
  const el = page.getByText(text, { exact: false }).first()
  try {
    await el.scrollIntoViewIfNeeded({ timeout: 5000 })
  } catch {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2))
  }
  await page.waitForTimeout(400)
}

async function captureFrontend() {
  const browser = await launchBrowser()
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()

  console.log('\nFrontend (desktop)…')
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
  await screenshot(page, '01-home-hero-desktop.png')

  await scrollToText(page, '四大特色')
  await screenshot(page, '02-home-features-desktop.png')

  await scrollToText(page, '依主題閱讀')
  await screenshot(page, '03-home-categories-desktop.png')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75))
  await page.waitForTimeout(500)
  await screenshot(page, '04-home-book-desktop.png')

  await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle' })
  await screenshot(page, '05-about-desktop.png', true)

  await page.goto(`${BASE_URL}/posts`, { waitUntil: 'networkidle' })
  await screenshot(page, '06-posts-list-desktop.png')

  await page.goto(`${BASE_URL}/posts/pancreatic-cancer-treatment-30-years`, {
    waitUntil: 'networkidle',
  })
  await screenshot(page, '07-post-detail-desktop.png', true)

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '搜尋' }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible' })
  await dialog.getByPlaceholder('搜尋文章…').fill('胰臟')
  await page.waitForResponse(
    (response) => response.url().includes('/api/search') && response.ok(),
    { timeout: 10000 },
  )
  await page.waitForTimeout(500)
  await screenshot(page, '08-search-overlay-desktop.png')

  await page.goto(`${BASE_URL}/terms`, { waitUntil: 'networkidle' })
  await screenshot(page, '11-terms-desktop.png', true)

  await browser.close()

  const mobileBrowser = await launchBrowser()
  const mobileContext = await mobileBrowser.newContext({ viewport: MOBILE })
  const mobilePage = await mobileContext.newPage()

  console.log('\nFrontend (mobile)…')
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
  await screenshot(mobilePage, '09-home-mobile.png', true)

  await mobilePage.goto(`${BASE_URL}/posts/pancreatic-cancer-treatment-30-years`, {
    waitUntil: 'networkidle',
  })
  await screenshot(mobilePage, '10-post-mobile.png', true)

  await mobileBrowser.close()
}

async function captureAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('\nSkipping admin screenshots: set DELIVERY_ADMIN_EMAIL / DELIVERY_ADMIN_PASSWORD')
    return
  }

  const browser = await launchBrowser()
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()

  console.log('\nAdmin…')
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle' })
  await screenshot(page, '12-admin-login.png')

  const emailInput = page.locator('input[type="email"]').first()
  const passwordInput = page.locator('input[type="password"]').first()
  await emailInput.waitFor({ state: 'visible' })
  await emailInput.fill(ADMIN_EMAIL)
  await passwordInput.fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: '登入' }).click()

  try {
    await page.waitForURL(
      (url) => url.pathname === '/admin' || (url.pathname.startsWith('/admin/') && !url.pathname.includes('login')),
      { timeout: 20000 },
    )
  } catch {
    console.warn('  Admin login failed — saving login page only')
    await browser.close()
    return
  }

  await page.waitForTimeout(1500)
  await screenshot(page, '13-admin-dashboard.png')

  await page.goto(`${BASE_URL}/admin/collections/posts`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const postLink = page.locator('a[href*="/admin/collections/posts/"]').first()
  if ((await postLink.count()) > 0) {
    const href = await postLink.getAttribute('href')
    if (href) {
      await page.goto(href.startsWith('http') ? href : `${BASE_URL}${href}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      await screenshot(page, '14-admin-post-edit.png')
    }
  }

  await page.goto(`${BASE_URL}/admin/collections/pages`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const pageLink = page.locator('a[href*="/admin/collections/pages/"]').first()
  if ((await pageLink.count()) > 0) {
    const href = await pageLink.getAttribute('href')
    if (href) {
      await page.goto(href.startsWith('http') ? href : `${BASE_URL}${href}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      await screenshot(page, '15-admin-page-home.png')
    }
  }

  await page.goto(`${BASE_URL}/admin/collections/media`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await screenshot(page, '16-admin-media.png')

  await browser.close()
}

async function main() {
  ensureDir()
  console.log(`Capturing delivery screenshots from ${BASE_URL}`)
  console.log(`Output: ${OUT}`)

  const adminOnly = process.env.CAPTURE_ADMIN_ONLY === '1'

  if (!adminOnly) {
    await captureFrontend()
  }
  await captureAdmin()

  const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.png'))
  console.log(`\nDone: ${files.length} screenshots`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
