# Post Page + Seeded Posts — Design Spec

**Date:** 2026-07-31  
**Project:** yitan-blog  
**Status:** Approved for implementation

---

## Purpose

Scaffold content-shaped article page infrastructure and replace 6 demo posts with 15 client posts from `materials/posts/`.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Scope | Option B — excerpt, brand hero, FAQ, marketing notes; no CTA/prev-next/slides gallery |
| Cover image | Root-level image in each post folder |
| Inline figures | Subfolder images as `mediaBlock` in body |
| Title/SEO/slug/FAQ/ALT | docx 發佈配套 |
| Body | docx text before 配套 |
| Excerpt | Author-written (not meta description copy) |
| Categories | Provisional table in `materials/文章分類確認.xlsx` (assumed correct) |
| Related posts | Same category, max 3 |
| Marketing 8/10–13 | Admin-only `marketingNotes`, not on frontend |
| Seed | Hand-written TS modules |
| Demo posts | Deleted; seed only 15 client posts |
| Gate | Visual companion sign-off before PostHero/FAQ UI code |

## CMS schema additions

**Posts collection** — new fields:

- `excerpt` (textarea, required) — hero summary below H1
- `faq` (array) — `question` (text), `answer` (textarea)
- `marketingNotes` (group, admin only on frontend) — `coverDesignNotes`, `youtubeTitle`, `youtubeDescription`, `socialPost`, `newsletterSummary`

## Frontend page order

1. PostHero — categories, H1, 16:9 heroImage, excerpt, author/date (warm-white, no full-bleed dark overlay)
2. RichText — body with inline mediaBlocks; typography via `postPageProseClassName` (sans body `leading-[1.9]`, serif h2 with sage bar, links/strong per spec.md §三)
3. PostFaq — if faq.length > 0
4. PostLegalNotice
5. RelatedPosts — same category, max 3

Header theme: light (remove forced dark on article pages).

## Body cleanup rules

- Section headings: text only, no circled 一、二、三 numbering
- Rename「最新醫學證據」→「醫學證據」

## Category mapping (provisional)

| Slug | Category |
|------|----------|
| tigar-o-chronic-pancreatitis-causes | 胰臟發炎 |
| brca2-hereditary-cancer-pancreatic-risk | 胰臟癌 |
| is-your-pancreas-aging-early | 基礎知識 |
| stage0-micro-pancreatic-cancer-under-1cm | 胰臟癌 |
| pancreas-three-questions | 基礎知識 |
| pancreas-head-neck-body-tail-imaging-report-terms | 健檢判讀 |
| autoimmune-pancreatitis-aip-mimic-cancer | 胰臟發炎 |
| idiopathic-pancreatitis-genetic-truth | 胰臟發炎 |
| pancreas-diet-fat-or-no-fat | 飲食保健 |
| pancreatic-cancer-screening-steps | 健檢判讀 |
| pancreas-anti-aging-rejuvenation-key | 基礎知識 |
| daraxonrasib-pancreatic-cancer | 胰臟癌 |
| pancreatic-cancer-early-symptoms-6-warning-signs | 胰臟癌 |
| who-should-watch-pancreas-health | 基礎知識 |
| osteoporosis-vitamin-d-pancreatic-function | 飲食保健 |

Note: `你的胰臟初老了嗎？` lacks 發佈配套 — slug `is-your-pancreas-aging-early` invented at seed time.

## Out of scope

Article CTA, prev/next navigation, dedicated slides gallery, pixel-perfect PDF layout, auto docx parser in production, public marketing copy, category taxonomy changes, ArticleCard on list/related this cycle.
