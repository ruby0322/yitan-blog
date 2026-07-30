import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const htmlPath = path.join(root, 'docs/design/spec-client.html')
const version = process.env.SPEC_VERSION || 'v1.1'
const outputDir = path.join(root, 'docs/design/snapshots', version)
const outputPath = path.join(outputDir, 'spec-client.png')

/** 6 ≈ ~576dpi on 210mm-wide sheet; override with EXPORT_SCALE */
const DEVICE_SCALE = Number(process.env.EXPORT_SCALE) || 6

fs.mkdirSync(outputDir, { recursive: true })

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
})
const context = await browser.newContext({
  deviceScaleFactor: DEVICE_SCALE,
  viewport: { width: 960, height: 1400 },
})
const page = await context.newPage()

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' })
await page.waitForFunction(() => document.fonts.ready)
await page.waitForTimeout(500)

const target = page.locator('#export-target')
await target.screenshot({
  path: outputPath,
  type: 'png',
  animations: 'disabled',
  omitBackground: false,
})

await browser.close()

console.log(`Exported (${DEVICE_SCALE}x): ${outputPath}`)
