import { execSync } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ClientPostDefinition, ClientPostSection } from '../src/endpoints/seed/build-client-post.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const POSTS_REVISED_DIR = path.resolve(dirname, '../materials/posts-revised')
const OUTPUT_PATH = path.resolve(dirname, 'seed-data/client-posts.json')
const ORIGINAL_PATH = path.resolve(dirname, 'seed-data/client-posts.original.json')
const CATEGORY_MAP_PATH = path.resolve(dirname, 'seed-data/post-category-map.json')
const LEGACY_FOLDERS = new Set(['PB影像報告名詞', 'PB胰臟也能凍齡減齡？認識胰臟回春的關鍵'])

const SEO_MARKER = /Information for Blog Post|Information for blog post/i
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const INLINE_PATTERN = /投影片/i

type CategoryMap = Record<string, string>

function extractDocxParagraphs(docxPath: string): string[] {
  const xml = execSync(`unzip -p ${JSON.stringify(docxPath)} word/document.xml`, {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  })

  return xml
    .split(/<w:p[^>]*>/)
    .slice(1)
    .map((chunk) =>
      chunk
        .replace(/<w:tab[^>]*\/?>/g, '\t')
        .replace(/<w:br[^>]*\/?>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\r/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)
}

async function findDocx(folderPath: string): Promise<string | null> {
  const entries = await readdir(folderPath, { withFileTypes: true, recursive: true })

  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (!entry.name.endsWith('.docx')) continue
    if (entry.name.includes('.~tmp')) continue

    const parent = entry.parentPath ?? entry.path
    return path.join(parent, entry.name)
  }

  return null
}

function isInlineImage(name: string): boolean {
  return INLINE_PATTERN.test(name)
}

function isImageFile(name: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase())
}

async function collectImages(folderPath: string): Promise<{ covers: string[]; inlines: string[] }> {
  const entries = await readdir(folderPath, { withFileTypes: true, recursive: true })
  const allImages: Array<{ path: string; depth: number; isSlide: boolean; isCoverCandidate: boolean }> = []

  for (const entry of entries) {
    if (!entry.isFile() || !isImageFile(entry.name)) continue

    const parent = entry.parentPath ?? entry.path
    const relativePath = path.relative(folderPath, path.join(parent, entry.name))
    const normalized = relativePath.split(path.sep).join('/')
    const depth = normalized.split('/').length - 1
    const isSlide = isInlineImage(entry.name)
    const isCoverCandidate =
      !isSlide &&
      (depth === 0 ||
        /^bb/i.test(entry.name) ||
        /^recover/i.test(entry.name) ||
        /^cover/i.test(entry.name))

    allImages.push({ path: normalized, depth, isSlide, isCoverCandidate })
  }

  const coverPredicates = [
    (img: { depth: number; isCoverCandidate: boolean }) => img.depth === 0 && img.isCoverCandidate,
    (img: { isCoverCandidate: boolean }) => img.isCoverCandidate,
    (img: { depth: number; isSlide: boolean }) => img.depth === 0 && !img.isSlide,
    (img: { depth: number; isSlide: boolean }) => img.depth === 0 && img.isSlide,
  ]

  let cover: string | undefined
  for (const predicate of coverPredicates) {
    const match = allImages.find(predicate)
    if (match) {
      cover = match.path
      break
    }
  }

  if (!cover && allImages[0]) cover = allImages[0].path

  const covers = cover ? [cover] : []
  const inlines = allImages
    .filter((img) => img.path !== cover && img.isSlide)
    .map((img) => img.path)
    .sort()

  return { covers, inlines }
}

function findSeoIndex(paragraphs: string[]): number {
  return paragraphs.findIndex(
    (p) =>
      SEO_MARKER.test(p) ||
      /^1\.\s*H1/i.test(p) ||
      /^H1 標題/.test(p) ||
      /^H1 標題（給讀者）/.test(p),
  )
}

function cleanupHeading(value: string): string {
  return value
    .replace(/^[０-９0-9①②③④⑤⑥⑦⑧⑨⑩]+[、.．]\s*/, '')
    .replace(/最新醫學證據/g, '醫學證據')
    .trim()
}

function isListItemLine(line: string): boolean {
  return (line.endsWith('？') || line.endsWith('?')) && line.length <= 40 && !line.includes('｜')
}

function isStandaloneHeading(line: string): boolean {
  if (line.includes('｜')) return false
  if (line.startsWith('（') || line.startsWith('「章醫師')) return false
  if (isListItemLine(line)) return false
  if (/^章醫師(怎麼|畫重點|提醒|臨床)/.test(line)) return true
  if (/^(診間故事|今天要回答的問題|為什麼大家容易誤解)/.test(line)) return true
  if (line.startsWith('「') && line.length >= 15 && line.length <= 80 && !line.includes('？')) return true
  if (line.length <= 60 && !line.endsWith('。') && !line.endsWith('：') && line.endsWith('？')) {
    return line.length >= 15
  }
  return false
}

function isPipeHeading(line: string): boolean {
  if (!line.includes('｜')) return false
  const before = line.split('｜')[0]?.trim() ?? ''
  if (before.length < 2) return false
  if (/^[A-Z]$/.test(before)) return false
  if (/^[TIGARO]$/.test(before)) return false
  if (/^[TIGARO]｜/.test(line) && before.length <= 2) return false
  return before.length >= 2
}

function headingFromPipeLine(line: string): string {
  return cleanupHeading(line.split('｜')[0]?.trim() ?? line)
}

function parseBodySections(paragraphs: string[], title: string): ClientPostSection[] {
  const seoIndex = findSeoIndex(paragraphs)
  const bodyParagraphs = (seoIndex >= 0 ? paragraphs.slice(0, seoIndex) : paragraphs).slice(1)

  const sections: ClientPostSection[] = []
  let current: ClientPostSection = { h: null, p: '' }

  const flush = () => {
    if (!current.h && !current.p.trim()) return
    sections.push({ h: current.h, p: current.p.trim() })
  }

  for (let i = 0; i < bodyParagraphs.length; i++) {
    const line = bodyParagraphs[i]?.trim() ?? ''
    if (!line || line === '｜') continue

    if (line === '診間故事' || line === '今天要回答的問題' || line === '為什麼大家容易誤解？') {
      flush()
      current = { h: cleanupHeading(line), p: '' }
      continue
    }

    if (/^章醫師(怎麼|畫重點|提醒|臨床)/.test(line) && !line.includes('。')) {
      flush()
      current = { h: cleanupHeading(line.split('｜')[0]?.trim() ?? line), p: '' }
      continue
    }

    if (isPipeHeading(line)) {
      flush()
      current = { h: headingFromPipeLine(line), p: '' }
      const afterPipe = line.split('｜').slice(1).join('｜').trim()
      if (afterPipe && afterPipe !== '｜') {
        current.p = afterPipe
      }
      continue
    }

    if (isStandaloneHeading(line)) {
      flush()
      current = { h: cleanupHeading(line), p: '' }
      continue
    }

    current.p = current.p ? `${current.p}\n${line}` : line
  }

  flush()

  if (sections.length === 0 && title) {
    sections.push({ h: null, p: title })
  }

  return sections
}

function extractField(block: string, pattern: RegExp): string {
  const match = block.match(pattern)
  return match?.[1]?.replace(/\s+/g, ' ').trim() ?? ''
}

function extractSlug(seoText: string): string {
  const blockMatch = seoText.match(/4\.\s*URL Slug\s*\n+([\s\S]*?)(?=\n\s*5\.|\n\s*Primary Keyword|$)/i)
  if (blockMatch?.[1]) {
    const slug = blockMatch[1]
      .split('\n')
      .map((line) => line.trim().replace(/^\//, ''))
      .filter((line) => line && !/^\d+\./.test(line))
      .join('')
      .replace(/-+$/, '')
    if (slug) return slug
  }

  const inlineMatch =
    seoText.match(/4\.\s*URL Slug\s*\n+\s*\/?([a-z0-9-]+)/i) ??
    seoText.match(/URL Slug\s*\n+\s*\/?([a-z0-9-]+)/i) ??
    seoText.match(/URL Slug\s*\n+\s*([a-z0-9-]+)/i)

  return inlineMatch?.[1]?.trim().replace(/-+$/, '') ?? ''
}

function parseSeoBlock(seoText: string) {
  const title =
    extractField(seoText, /1\.\s*H1[^\n]*\n([\s\S]*?)(?=\n2\.|\nSEO Title|\nMeta Description|$)/) ||
    extractField(seoText, /H1 標題[^\n]*\n([\s\S]*?)(?=\nSEO Title|\nMeta Description|$)/)

  const seoTitle =
    extractField(seoText, /2\.\s*SEO Title[^\n]*\n([\s\S]*?)(?=\n3\.|\nMeta Description|$)/) ||
    extractField(seoText, /SEO Title[^\n]*\n([\s\S]*?)(?=\nMeta Description|$)/)

  const metaDescription =
    extractField(seoText, /3\.\s*Meta Description[^\n]*\n([\s\S]*?)(?=\n4\.|\nURL Slug|$)/) ||
    extractField(seoText, /Meta Description[^\n]*\n([\s\S]*?)(?=\nURL Slug|$)/)

  const altBlock =
    extractField(seoText, /7\.\s*圖片 ALT 文字[^\n]*\n([\s\S]*?)(?=\n8\.|\n封面圖設計說明|$)/) ||
    extractField(seoText, /圖片 ALT 文字[^\n]*\n([\s\S]*?)(?=\n封面圖設計說明|$)/)

  const alts = altBlock
    .split('\n')
    .map((line) =>
      line
        .replace(/^封面圖 ALT[：:]\s*/, '')
        .replace(/^圖\s*\d+[：:]\s*/, '')
        .replace(/^圖\s*\d+\s*ALT[：:]\s*/, '')
        .trim(),
    )
    .filter(Boolean)

  const coverDesignNotes =
    extractField(seoText, /8\.\s*封面圖設計說明[^\n]*\n([\s\S]*?)(?=\n9\.|\nFAQ|$)/) ||
    extractField(seoText, /封面圖設計說明[^\n]*\n([\s\S]*?)(?=\nFAQ|$)/)

  const faqBlock =
    extractField(seoText, /9\.\s*FAQ[^\n]*\n([\s\S]*?)(?=\n10\.|\nYouTube 標題|$)/) ||
    extractField(seoText, /FAQ[^\n]*\n([\s\S]*?)(?=\nYouTube 標題|$)/)

  const faqFromQ = Array.from(
    faqBlock.matchAll(/Q\d+[.:：]?\s*([^?\n]+[?？]?)\s*A[：:]\s*([\s\S]*?)(?=Q\d+[.:：]|\n\d+\.\s|$)/g),
  ).map((match) => ({
    question: match[1]?.trim().replace(/[?？]$/, '') ?? '',
    answer: match[2]?.replace(/\s+/g, ' ').trim() ?? '',
  }))

  const faqFromNumber = Array.from(
    faqBlock.matchAll(/\d+\.\s*([^\n]+?[?？])\s*\n([\s\S]*?)(?=\n\d+\.\s|$)/g),
  ).map((match) => ({
    question: match[1]?.trim().replace(/[?？]$/, '') ?? '',
    answer: match[2]?.replace(/\s+/g, ' ').trim() ?? '',
  }))

  const faq = faqFromQ.length > 0 ? faqFromQ : faqFromNumber

  const youtubeTitle =
    extractField(seoText, /10\.\s*YouTube 標題[^\n]*\n([\s\S]*?)(?=\n11\.|\nYouTube 說明欄|$)/) ||
    extractField(seoText, /YouTube 標題[^\n]*\n([\s\S]*?)(?=\nYouTube 說明欄|$)/)

  const youtubeDescription =
    extractField(seoText, /11\.\s*YouTube 說明欄[^\n]*\n([\s\S]*?)(?=\n12\.|\nFacebook|$)/) ||
    extractField(seoText, /YouTube 說明欄[^\n]*\n([\s\S]*?)(?=\nFacebook|$)/)

  const socialPost =
    extractField(seoText, /12\.\s*Facebook[^\n]*\n([\s\S]*?)(?=\n13\.|\n電子報摘要|$)/) ||
    extractField(seoText, /Facebook[^\n]*\n([\s\S]*?)(?=\n電子報摘要|$)/)

  const newsletterSummary =
    extractField(seoText, /13\.\s*電子報摘要[^\n]*\n([\s\S]*?)(?=\n補充|$)/) ||
    extractField(seoText, /電子報摘要[^\n]*\n([\s\S]*?)(?=\n補充|$)/)

  return {
    title,
    seoTitle,
    metaDescription,
    slug: extractSlug(seoText),
    alts,
    faq,
    marketingNotes: {
      coverDesignNotes,
      youtubeTitle,
      youtubeDescription,
      socialPost,
      newsletterSummary,
    },
  }
}

function resolveCategories(
  folder: string,
  slug: string,
  categoryMap: CategoryMap,
  existingByFolder: Map<string, ClientPostDefinition>,
): string[] {
  if (categoryMap[folder]) return [categoryMap[folder]]
  const existing = existingByFolder.get(folder)
  if (existing?.categories?.length) return existing.categories
  throw new Error(`Missing category for ${folder} (${slug})`)
}

async function parseFolder(
  folder: string,
  categoryMap: CategoryMap,
  existingByFolder: Map<string, ClientPostDefinition>,
): Promise<ClientPostDefinition> {
  const folderPath = path.join(POSTS_REVISED_DIR, folder)
  const docxPath = await findDocx(folderPath)
  if (!docxPath) throw new Error(`No docx in ${folder}`)

  const paragraphs = extractDocxParagraphs(docxPath)
  const seoIndex = findSeoIndex(paragraphs)
  const seoText = (seoIndex >= 0 ? paragraphs.slice(seoIndex) : []).join('\n')
  const seo = parseSeoBlock(seoText)

  const title = seo.title || paragraphs[0] || folder
  const sections = parseBodySections(paragraphs, title)
  const { covers, inlines } = await collectImages(folderPath)
  if (!covers.length) throw new Error(`No cover in ${folder}`)

  const existing = existingByFolder.get(folder)
  const slug = seo.slug || existing?.slug || ''
  if (!slug) throw new Error(`Missing slug in ${folder}`)

  const excerpt = seo.metaDescription || sections.find((s) => s.p)?.p.slice(0, 200) || title

  return {
    folder,
    slug,
    categories: resolveCategories(folder, slug, categoryMap, existingByFolder),
    title,
    seoTitle: seo.seoTitle || title,
    metaDescription: seo.metaDescription || excerpt,
    excerpt,
    faq: seo.faq,
    marketingNotes: seo.marketingNotes,
    alts: seo.alts,
    covers,
    inlines,
    sections,
  }
}

async function main(): Promise<void> {
  let originalPosts: ClientPostDefinition[] = []
  try {
    originalPosts = JSON.parse(await readFile(ORIGINAL_PATH, 'utf-8')) as ClientPostDefinition[]
  } catch {
    originalPosts = JSON.parse(await readFile(OUTPUT_PATH, 'utf-8')) as ClientPostDefinition[]
  }

  const categoryMap = JSON.parse(await readFile(CATEGORY_MAP_PATH, 'utf-8')) as CategoryMap
  const existingByFolder = new Map(originalPosts.map((post) => [post.folder, post]))

  const folderEntries = await readdir(POSTS_REVISED_DIR, { withFileTypes: true })
  const folders = folderEntries.filter((e) => e.isDirectory()).map((e) => e.name).sort()

  const parsed: ClientPostDefinition[] = []
  for (const folder of folders) {
    parsed.push(await parseFolder(folder, categoryMap, existingByFolder))
    console.log(`✓ ${folder}`)
  }

  const legacy = originalPosts.filter((p) => LEGACY_FOLDERS.has(p.folder))
  const merged = [...parsed, ...legacy]

  await writeFile(OUTPUT_PATH, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8')
  console.log(`\nWrote ${merged.length} posts`)
}

void main()
