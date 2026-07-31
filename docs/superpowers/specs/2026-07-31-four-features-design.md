# 四大特色 Section — Design Spec

**Date:** 2026-07-31  
**Project:** yitan-blog homepage  
**Status:** Approved for implementation

---

## Purpose

Insert a brand value-proposition section (四大特色) between the Quote block and Featured Posts on the homepage. Establishes clinical credibility before article discovery.

## Design Decisions

| Decision | Choice |
|----------|--------|
| Layout | Bar-variant titles (`NumberedHeading variant="bar"`) + body text per item |
| Desktop grid | 2 columns × 2 rows (`md:grid-cols-2`) |
| Mobile grid | 1 column × 4 rows (`grid-cols-1`) |
| Item numbering | None — title + description only |
| Section header | Kicker「四大特色」+ magazine section number `01`; no subhead |
| CMS | Full Payload block — heading + 4 editable items |
| Section renumbering | Cascade: Featured→02, CategoryNav→03, About→04, BookSales→05 |
| Interactivity | Static — no links or hover cards |

## Section Order (after change)

| # | Block | variant | sectionNumber |
|---|-------|---------|---------------|
| — | Hero | default | — |
| — | Quote | muted | — |
| 3 | featuresBlock | default | 01 |
| 4 | featuredPostsBlock | muted | 02 |
| 5 | categoryNavBlock | default | 03 |
| 6 | aboutTeaserBlock | muted | 04 |
| 7 | bookSalesBlock | default | 05 |

Background alternation: muted → default → muted → default → muted → default.

## Content (seed defaults)

| title | description |
|-------|-------------|
| 近 30 年臨床經驗 | 近 30 年專注胰臟疾病臨床診療與研究，從門診到病房、從個案到長期追蹤，累積豐富而紮實的第一線經驗，持續投入胰臟健康的守護。 |
| 完整疾病光譜 | 從急、慢性胰臟炎、脂肪胰、胰臟水泡（囊腫）、良性腫瘤到胰臟癌，串聯不同疾病之間的關聯與演變，從細微變化中辨識風險。 |
| 早期發現 | 結合胰臟癌早期篩檢、腫瘤標記研究、影像追蹤與風險辨識，從蛛絲馬跡中發現異常，協助把握早期診斷的關鍵時機。 |
| 理解，而不是恐懼 | 相信正確的知識是健康管理的起點，陪伴每位讀者理解疾病、降低恐慌，從被動等待走向主動管理。 |

## Implementation

- Block slug: `featuresBlock`
- Files: `src/blocks/FeaturesBlock/config.ts`, `Component.tsx`
- Register in `Pages/index.ts`, `RenderBlocks.tsx`
- Update downstream block variants and section numbers
- Update `docs/design/spec-home.md`

## Out of Scope

- Icons/illustrations per feature item
- Clickable links on feature cards
- HeaderTheme observer changes
- Production CMS migration (manual Admin edit if not re-seeding)
