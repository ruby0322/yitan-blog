/**
 * One-time merge: keep hand-curated originals for revised posts,
 * add 14 new posts with cleaned parsed content + FAQ from docx.
 */
import { execSync } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ClientPostDefinition } from '../src/endpoints/seed/build-client-post.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_REVISED = path.resolve(dirname, '../materials/posts-revised')
const ORIGINAL = path.resolve(dirname, 'seed-data/client-posts.original.json')
const PARSED = path.resolve(dirname, 'seed-data/client-posts.json')
const OUTPUT = PARSED

const NEW_ONLY_FOLDERS = new Set([
  'PB CA19-9超標就是胰臟癌嗎',
  'PB IPMN 是什麼？為什麼這種胰臟水泡是癌前病變？',
  'PB 有胰臟水泡要盯整顆胰臟看',
  'PB 胰臟在哪裡？一次看懂胰臟位置、構造與功能',
  'PB 胰臟水泡是癌症嗎？會不會變胰臟癌？ 章醫師完整解析',
  'PBblog 健檢最常發現的胰臟問題',
  'PB一公分，決定一生：搶在癌細胞遠行之前',
  'PB市售酵素百百種，哪一種才是胰臟真正需要的？',
  'PB治療30年',
  'PB等待的重量：走在胰臟癌篩檢路上，那些藏在心底的不安',
  'PB胰臟水泡有多常見？為什麼五十歲後很多人都有卻不知道',
  'PB胰臟癌也可能看起來像水泡？破解腫瘤中心壞死與黏液分泌的真相',
  'PB胰臟癌基因有哪些？',
  'PB識破胰臟水泡尺寸迷思',
])

function ws(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function docxText(folder: string): string {
  const folderPath = path.join(POSTS_REVISED, folder)
  const entries = execSync(`find ${JSON.stringify(folderPath)} -name "*.docx" ! -name "*.~tmp*"`, {
    encoding: 'utf-8',
  })
    .trim()
    .split('\n')
    .filter(Boolean)
  const docx = entries[0]
  if (!docx) return ''
  const xml = execSync(`unzip -p ${JSON.stringify(docx)} word/document.xml`, { encoding: 'utf-8' })
  return xml
    .replace(/<w:br[^>]*\/?>/g, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\r/g, '')
}

function extractFaq(text: string): Array<{ question: string; answer: string }> {
  const faqStart = text.search(/9\.\s*FAQ|FAQ（/i)
  if (faqStart < 0) return []
  const block = text.slice(faqStart, faqStart + 8000)
  const end = block.search(/\n10\.\s*YouTube|\nYouTube 標題/)
  const faqBlock = end >= 0 ? block.slice(0, end) : block

  const items: Array<{ question: string; answer: string }> = []

  const qPattern = /Q(\d+)[.:：]?\s*([\s\S]*?)\s*A[：:]\s*([\s\S]*?)(?=Q\d+[.:：]|\n\d+\.\s|\n10\.|$)/g
  for (const m of faqBlock.matchAll(qPattern)) {
    items.push({ question: ws(m[2] ?? ''), answer: ws(m[3] ?? '') })
  }

  if (items.length === 0) {
    const numPattern = /(\d+)\.\s*([^\n]+?[?？])\s*\n([\s\S]*?)(?=\n\d+\.\s|\n10\.|\nYouTube|$)/g
    for (const m of faqBlock.matchAll(numPattern)) {
      items.push({
        question: ws(m[2] ?? '').replace(/[?？]$/, ''),
        answer: ws(m[3] ?? ''),
      })
    }
  }

  return items.filter((i) => i.question && i.answer)
}

function cleanSections(post: ClientPostDefinition): ClientPostDefinition['sections'] {
  const out: ClientPostDefinition['sections'] = []
  for (const section of post.sections) {
    const h = section.h ? ws(section.h) : null
    const p = ws(section.p.replace(/\n+/g, '\n'))

    if (!p && h) {
      const prev = out[out.length - 1]
      if (prev && prev.p) {
        prev.p = `${prev.p}\n\n${h}`
        continue
      }
    }

    if (!p && !h) continue

    if (h && h.length > 80) {
      out.push({ h: null, p: h + (p ? `\n\n${p}` : '') })
      continue
    }

    out.push({ h, p })
  }
  return out.filter((s) => s.p || s.h)
}

function cleanPost(post: ClientPostDefinition): ClientPostDefinition {
  const text = docxText(post.folder)
  const faq = extractFaq(text)

  return {
    ...post,
    title: ws(post.title),
    seoTitle: ws(post.seoTitle),
    metaDescription: ws(post.metaDescription),
    excerpt: ws(post.excerpt || post.metaDescription),
    faq: faq.length > 0 ? faq : post.faq,
    marketingNotes: {
      coverDesignNotes: ws(post.marketingNotes.coverDesignNotes),
      youtubeTitle: ws(post.marketingNotes.youtubeTitle),
      youtubeDescription: ws(post.marketingNotes.youtubeDescription.replace(/\n+/g, '\n')),
      socialPost: ws(post.marketingNotes.socialPost),
      newsletterSummary: ws(post.marketingNotes.newsletterSummary.split('補充：')[0] ?? post.marketingNotes.newsletterSummary),
    },
    sections: cleanSections(post),
  }
}

async function main() {
  const original = JSON.parse(await readFile(ORIGINAL, 'utf-8')) as ClientPostDefinition[]
  const parsed = JSON.parse(await readFile(PARSED, 'utf-8')) as ClientPostDefinition[]
  const parsedByFolder = new Map(parsed.map((p) => [p.folder, p]))

  const merged: ClientPostDefinition[] = [...original]

  for (const folder of NEW_ONLY_FOLDERS) {
    const post = parsedByFolder.get(folder)
    if (!post) {
      console.warn('Missing parsed post for', folder)
      continue
    }
    merged.push(cleanPost(post))
    console.log('Added', post.slug)
  }

  // cystic post included in NEW_ONLY_FOLDERS

  merged.sort((a, b) => a.slug.localeCompare(b.slug))

  await writeFile(OUTPUT, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8')
  console.log(`\nWrote ${merged.length} posts (15 original + ${merged.length - 15} new)`)
}

void main()
