import { execSync } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ClientPostDefinition, ClientPostSection } from '../src/endpoints/seed/build-client-post.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const POSTS_REVISED_DIR = path.resolve(dirname, '../materials/posts-revised')
const OUTPUT_PATH = path.resolve(dirname, 'seed-data/client-posts.json')
const CATEGORY_MAP_PATH = path.resolve(dirname, 'seed-data/post-category-map.json')
const LEGACY_FOLDERS = new Set(['PB影像報告名詞', 'PB胰臟也能凍齡減齡？認識胰臟回春的關鍵'])

const SEO_MARKER = /Information for Blog Post/i

function findSeoIndex(paragraphs: string[]): number {
  return paragraphs.findIndex(
    (p) =>
      SEO_MARKER.test(p) ||
      /^1\.\s*H1/i.test(p.trim()) ||
      /^1\.\s*H1 標題/.test(p.trim()) ||
      /^H1 標題/.test(p.trim()),
  )
}
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
        .replace(/<w:br[^>]*\/?>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\r/g, '')
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

  if (!cover && allImages[0]) {
    cover = allImages[0].path
  }

  const covers = cover ? [cover] : []
  const inlines = allImages
    .filter((img) => img.path !== cover && img.isSlide)
    .map((img) => img.path)
    .sort()

  return { covers, inlines }
}

function cleanupHeading(value: string): string {
  return value
    .replace(/^[０-９0-9①②③④⑤⑥⑦⑧⑨⑩]+[、.．]\s*/, '')
    .replace(/最新醫學證據/g, '醫學證據')
    .trim()
}

function isSectionHeading(line: string): boolean {
  if (line.startsWith('（') || line.startsWith('「')) return false
  if (line.endsWith('：') || line.endsWith(':')) return false

  if (!line.includes('｜')) {
    if (line.length > 120) return false
    if (/^[A-Z]｜/.test(line)) return false
    if (/^[TIGARO]｜/.test(line)) return false
    if (line.startsWith('章醫師') && (line.endsWith('？') || line.endsWith('?'))) return true
    if (/^(診間故事|今天要回答的問題|為什麼大家容易誤解)/.test(line)) return true
    if (line.endsWith('？') || line.endsWith('?')) return line.length <= 80
    return false
  }

  const beforePipe = line.split('｜')[0]?.trim() ?? ''
  if (beforePipe.length < 2) return false
  if (/^[A-Z]$/.test(beforePipe)) return false
  if (/^[TIGARO]$/.test(beforePipe)) return false
  return true
}

function headingFromLine(line: string): string {
  if (line.includes('｜')) {
    return cleanupHeading(line.split('｜')[0]?.trim() ?? line)
  }
  return cleanupHeading(line)
}

function parseBodySections(paragraphs: string[], title: string): ClientPostSection[] {
  const bodyParagraphs = paragraphs.filter((p) => !SEO_MARKER.test(p))
  const contentParagraphs = bodyParagraphs.slice(1)

  const sections: ClientPostSection[] = []
  let current: ClientPostSection = { h: null, p: '' }

  for (const line of contentParagraphs) {
    if (isSectionHeading(line)) {
      if (current.h || current.p.trim()) {
        sections.push({ h: current.h, p: current.p.trim() })
      }
      current = { h: headingFromLine(line), p: '' }
      continue
    }

    current.p = current.p ? `${current.p}\n${line}` : line
  }

  if (current.h || current.p.trim()) {
    sections.push({ h: current.h, p: current.p.trim() })
  }

  if (sections.length === 0 && title) {
    sections.push({ h: null, p: title })
  }

  return sections
}

function normalizeSeoText(value: string): string {
  return value.replace(/\s*\n+\s*/g, ' ').trim()
}

function extractField(block: string, pattern: RegExp): string {
  const match = block.match(pattern)
  return match?.[1]?.trim() ?? ''
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
    seoText.match(/4\.\s*URL Slug\s*\/?([a-z0-9-]+)/i) ??
    seoText.match(/URL Slug\s*\n+\s*\/?([a-z0-9-]+)/i) ??
    seoText.match(/URL Slug\s*\/?([a-z0-9-]+)/i)

  return inlineMatch?.[1]?.trim().replace(/-+$/, '') ?? ''
}

function parseSeoBlock(seoText: string) {
  const title =
    extractField(seoText, /1\.\s*H1[^\n]*\n([\s\S]*?)(?=\n2\.|\n3\.|\nSEO Title|\nMeta Description|$)/) ||
    extractField(seoText, /H1 標題[^\n]*\n([\s\S]*?)(?=\nSEO Title|\nMeta Description|$)/) ||
    extractField(seoText, /H1[^\n]*\n([^\n]+)/)

  const seoTitle =
    extractField(seoText, /2\.\s*SEO Title[^\n]*\n([\s\S]*?)(?=\n3\.|\nMeta Description|$)/) ||
    extractField(seoText, /SEO Title[^\n]*\n([\s\S]*?)(?=\nMeta Description|$)/) ||
    extractField(seoText, /SEO Title[^\n]*\n([^\n]+)/)

  const metaDescription =
    extractField(seoText, /3\.\s*Meta Description[^\n]*\n([\s\S]*?)(?=\n4\.|\nURL Slug|$)/) ||
    extractField(seoText, /Meta Description[^\n]*\n([\s\S]*?)(?=\nURL Slug|$)/) ||
    extractField(seoText, /Meta Description[^\n]*\n([^\n]+)/)

  const slug = extractSlug(seoText)
  const altBlock =
    extractField(seoText, /7\.\s*圖片 ALT 文字[^\n]*\n([\s\S]*?)(?=\n8\.|\n封面圖設計說明|$)/) ||
    extractField(seoText, /圖片 ALT 文字[^\n]*\n([\s\S]*?)(?=\n封面圖設計說明|$)/) ||
    extractField(seoText, /圖片 ALT 文字[^\n]*\n([\s\S]*?)(?=\n8\.|$)/)

  const alts = altBlock
    .split(/\n/)
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
    extractField(seoText, /封面圖設計說明[^\n]*\n([\s\S]*?)(?=\nFAQ|$)/) ||
    extractField(seoText, /封面圖設計說明[^\n]*\n([\s\S]*?)(?=\n9\.|$)/)

  const faqBlock =
    extractField(seoText, /9\.\s*FAQ[^\n]*\n([\s\S]*?)(?=\n10\.|\nYouTube 標題|$)/) ||
    extractField(seoText, /FAQ[^\n]*\n([\s\S]*?)(?=\nYouTube 標題|$)/) ||
    extractField(seoText, /FAQ[^\n]*\n([\s\S]*?)(?=\n10\.|$)/)

  const faqFromQ = Array.from(
    faqBlock.matchAll(/Q\d+[.:：]?\s*([^A\n]+?)\s*A[：:]\s*([\s\S]*?)(?=Q\d+[.:：]|$)/g),
  ).map((match) => ({
    question: match[1]?.trim().replace(/\?$/, '') ?? '',
    answer: match[2]?.trim() ?? '',
  }))

  const faqFromNumber = Array.from(
    faqBlock.matchAll(/\d+\.\s*([^\n]+?\?)\s*\n([\s\S]*?)(?=\n\d+\.\s|$)/g),
  ).map((match) => ({
    question: match[1]?.trim().replace(/\?$/, '') ?? '',
    answer: match[2]?.trim() ?? '',
  }))

  const faq = faqFromQ.length > 0 ? faqFromQ : faqFromNumber

  const youtubeTitle =
    extractField(seoText, /10\.\s*YouTube 標題[^\n]*\n([\s\S]*?)(?=\n11\.|\nYouTube 說明欄|$)/) ||
    extractField(seoText, /YouTube 標題[^\n]*\n([\s\S]*?)(?=\nYouTube 說明欄|$)/) ||
    extractField(seoText, /YouTube 標題[^\n]*\n([^\n]+)/)

  const youtubeDescription =
    extractField(seoText, /11\.\s*YouTube 說明欄[^\n]*\n([\s\S]*?)(?=\n12\.|\nFacebook|$)/) ||
    extractField(seoText, /YouTube 說明欄[^\n]*\n([\s\S]*?)(?=\nFacebook|$)/) ||
    extractField(seoText, /YouTube 說明欄[^\n]*\n([\s\S]*?)(?=\n12\.|$)/)

  const socialPost =
    extractField(seoText, /12\.\s*Facebook[^\n]*\n([\s\S]*?)(?=\n13\.|\n電子報摘要|$)/) ||
    extractField(seoText, /Facebook[^\n]*\n([\s\S]*?)(?=\n電子報摘要|$)/) ||
    extractField(seoText, /Facebook[^\n]*\n([\s\S]*?)(?=\n13\.|$)/)

  const newsletterSummary =
    extractField(seoText, /13\.\s*電子報摘要[^\n]*\n([\s\S]*?)$/) ||
    extractField(seoText, /電子報摘要[^\n]*\n([\s\S]*?)$/)

  return {
    title: normalizeSeoText(title),
    seoTitle: normalizeSeoText(seoTitle),
    metaDescription: normalizeSeoText(metaDescription),
    slug,
    alts,
    coverDesignNotes: coverDesignNotes.trim(),
    faq,
    marketingNotes: {
      coverDesignNotes: coverDesignNotes.trim(),
      youtubeTitle: youtubeTitle.trim(),
      youtubeDescription: youtubeDescription.trim(),
      socialPost: socialPost.trim(),
      newsletterSummary: newsletterSummary.trim(),
    },
  }
}

function resolveCategory(
  folder: string,
  slug: string,
  categoryMap: CategoryMap,
  existingByFolder: Map<string, ClientPostDefinition>,
): string {
  if (categoryMap[folder]) return categoryMap[folder]
  const existing = existingByFolder.get(folder)
  if (existing?.category) return existing.category
  throw new Error(`Missing category mapping for folder: ${folder} (${slug})`)
}

async function parseFolder(
  folder: string,
  categoryMap: CategoryMap,
  existingByFolder: Map<string, ClientPostDefinition>,
): Promise<ClientPostDefinition> {
  const folderPath = path.join(POSTS_REVISED_DIR, folder)
  const docxPath = await findDocx(folderPath)

  if (!docxPath) {
    throw new Error(`No docx found in ${folder}`)
  }

  const paragraphs = extractDocxParagraphs(docxPath)
  const seoIndex = findSeoIndex(paragraphs)
  const bodyParagraphs = seoIndex >= 0 ? paragraphs.slice(0, seoIndex) : paragraphs
  const seoParagraphs = seoIndex >= 0 ? paragraphs.slice(seoIndex) : []
  const seoText = seoParagraphs.join('\n')

  const seo = parseSeoBlock(seoText)
  const title = seo.title || bodyParagraphs[0] || folder
  const sections = parseBodySections(bodyParagraphs, title)
  const { covers, inlines } = await collectImages(folderPath)

  if (covers.length === 0) {
    throw new Error(`No cover image found in ${folder}`)
  }

  const slug = seo.slug || existingByFolder.get(folder)?.slug || ''
  if (!slug) {
    throw new Error(`Missing slug in ${folder}`)
  }

  const excerpt = seo.metaDescription || sections.find((section) => section.p.trim())?.p.slice(0, 200) || title

  return {
    folder,
    slug,
    category: resolveCategory(folder, slug, categoryMap, existingByFolder),
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
  const [existingRaw, categoryMapRaw] = await Promise.all([
    readFile(OUTPUT_PATH, 'utf-8'),
    readFile(CATEGORY_MAP_PATH, 'utf-8'),
  ])

  const existingPosts = JSON.parse(existingRaw) as ClientPostDefinition[]
  const categoryMap = JSON.parse(categoryMapRaw) as CategoryMap
  const existingByFolder = new Map(existingPosts.map((post) => [post.folder, post]))

  const folderEntries = await readdir(POSTS_REVISED_DIR, { withFileTypes: true })
  const folders = folderEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

  const parsedPosts: ClientPostDefinition[] = []
  const errors: string[] = []

  for (const folder of folders.sort()) {
    try {
      parsedPosts.push(await parseFolder(folder, categoryMap, existingByFolder))
      console.log(`✓ ${folder}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push(`${folder}: ${message}`)
      console.error(`✗ ${folder}: ${message}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Failed to parse ${errors.length} folder(s):\n${errors.join('\n')}`)
  }

  const legacyPosts = existingPosts.filter((post) => LEGACY_FOLDERS.has(post.folder))
  const merged = [...parsedPosts, ...legacyPosts]

  await writeFile(OUTPUT_PATH, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8')

  console.log(`\nWrote ${merged.length} posts to ${OUTPUT_PATH}`)
  console.log(`  ${parsedPosts.length} from posts-revised`)
  console.log(`  ${legacyPosts.length} legacy posts preserved`)
}

void main()
