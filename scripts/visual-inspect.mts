import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('test-results/visual-inspect')

type StyleSample = {
  page: string
  selector: string
  label: string
  color: string
  backgroundColor: string
  fontSize: string
  fontFamily: string
  padding: string
  margin: string
}

async function sampleStyles(page: import('@playwright/test').Page, pageName: string): Promise<StyleSample[]> {
  const selectors: Array<{ selector: string; label: string }> = [
    { selector: 'section', label: 'first-section' },
    { selector: 'h1', label: 'h1' },
    { selector: 'h2', label: 'h2' },
    { selector: 'p', label: 'first-p' },
    { selector: 'blockquote p', label: 'quote' },
    { selector: 'article', label: 'article-card' },
    { selector: 'header', label: 'header' },
    { selector: 'button', label: 'first-button' },
    { selector: 'a.inline-flex', label: 'read-more-link' },
  ]

  const samples: StyleSample[] = []

  for (const { selector, label } of selectors) {
    const el = page.locator(selector).first()
    if ((await el.count()) === 0) continue

    const styles = await el.evaluate((node) => {
      const cs = getComputedStyle(node)
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        padding: cs.padding,
        margin: cs.margin,
      }
    })

    samples.push({ page: pageName, selector, label, ...styles })
  }

  return samples
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT, { recursive: true })

  const browser = await chromium.launch({ channel: 'chrome' })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const routes = [
    { url: 'http://localhost:3000/theme-preview', name: 'theme-preview' },
    { url: 'http://localhost:3000/', name: 'home' },
  ]

  const allSamples: StyleSample[] = []

  for (const route of routes) {
    await page.goto(route.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(OUT, `${route.name}-desktop.png`), fullPage: true })

    const mobile = await browser.newPage()
    await mobile.setViewportSize({ width: 375, height: 812 })
    await mobile.goto(route.url, { waitUntil: 'networkidle' })
    await mobile.waitForTimeout(500)
    await mobile.screenshot({ path: path.join(OUT, `${route.name}-mobile.png`), fullPage: true })
    await mobile.close()

    allSamples.push(...(await sampleStyles(page, route.name)))

    const sectionCount = await page.locator('section').count()
    const sectionVariants = await page.locator('section').evaluateAll((nodes) =>
      nodes.map((node, i) => ({
        index: i,
        className: node.className,
        bg: getComputedStyle(node).backgroundColor,
        py: getComputedStyle(node).paddingTop,
      })),
    )

    fs.writeFileSync(
      path.join(OUT, `${route.name}-sections.json`),
      JSON.stringify(sectionVariants, null, 2),
    )
  }

  fs.writeFileSync(path.join(OUT, 'style-samples.json'), JSON.stringify(allSamples, null, 2))

  await browser.close()
  console.log(`Visual inspect output written to ${OUT}`)
}

void main()
