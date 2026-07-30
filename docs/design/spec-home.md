# 胰探究竟 — 首頁設計規格

**Home Page Design Spec** · Sub-spec of [整合設計參考 v1.1](spec.md)

| 項目 | 值 |
|------|-----|
| 狀態 | Draft — 待審核 |
| 版型參考 | [`assets/home.png`](assets/home.png)（結構 only） |
| 視覺規範 | [spec.md v1.1](spec.md)（**不**採用 home.png 的 charcoal/gold 配色） |
| CMS 模型 | Payload Pages collection — **區塊驅動** |
| 路由 | `/` → `pages` slug `home`（[`page.tsx`](../src/app/(frontend)/page.tsx) re-export） |

---

## 一、概述與成功標準

### 1.1 定位

首頁是「暖白色醫療雜誌風」的 landing page：建立品牌信任、導流至精選/最新文章、推動電子報訂閱。版型對照 home.png 的 **9 段垂直節奏**，視覺完全遵循 v1.1 token（暖白、鼠尾草綠、深綠 inverse、微圓角）。

### 1.2 成功標準（Definition of Done）

- [ ] 首頁依序呈現 7 個 CMS layout blocks + Hero + Header/Footer，順序與 §二一致
- [ ] 各 section 使用正確 `Section` variant（default / muted / inverse）
- [ ] 視覺與 v1.1 theme 元件一致（非 legacy `Card`、非 `bg-black/45` hero overlay）
- [ ] Payload Admin 可編輯各 block 文案、連結、文章關聯
- [ ] Header 在 Hero / Questions / Footer 等 inverse 區域上方時為 light-on-dark 樣式
- [ ] Mobile（`< md`）各 section 可讀、可點、無水平溢出
- [ ] Seed `home.ts` 提供完整繁中 placeholder，新環境 `pnpm seed` 後 `/` 即可預覽

### 1.3 實作策略

採 **漸進 block**（一次新增/改版一個 block + seed 更新，每步可 deploy、可 review）。

---

## 二、Section 總覽

對照 home.png 與 [spec.md §六](spec.md)：

| # | Section | `Section` variant | `spacing` | Payload 來源 | Theme 元件 |
|---|---------|-------------------|-----------|--------------|------------|
| — | Header | — | — | Global `header` | 現有 [`Header`](../src/Header/Component.tsx) |
| 1 | Hero | `inverse` | `lg` | Page `hero`（`highImpact` 改版） | `DisplayHeading`, `BodyText`, `ReadMoreLink` |
| 2 | Quote | `muted` | `default` | **`quoteBlock`**（新） | `QuoteBlock`, `BodyText` |
| 3 | Featured | `default` | `default` | **`featuredPostsBlock`**（新） | `SectionNumber`, `SectionHeading`, `ArticleCard` |
| 4 | Questions | `inverse` | `default` | **`categoryNavBlock`**（新） | `NumberedHeading`, Lucide arrow |
| 5 | Latest Articles | `default` | `default` | **`archiveBlock`**（改版） | `SectionHeading`, `ArticleCard`, `ReadMoreLink` |
| 6 | About | `default` | `default` | **`aboutTeaserBlock`**（新） | `SectionHeading`, `BodyText`, `ReadMoreLink` |
| 7 | Newsletter | `muted` | `default` | **`newsletterBlock`**（新） | `SectionHeading`, `NewsletterForm` |
| — | Footer | `inverse` | `none` | Global `footer` | 現有 [`Footer`](../src/Footer/Component.tsx) |

預設 seed layout 順序：`quoteBlock` → `featuredPostsBlock` → `categoryNavBlock` → `archiveBlock` → `aboutTeaserBlock` → `newsletterBlock`（Hero 在 page.hero，非 layout）。

---

## 三、各 Section 詳細規格

### 3.1 Header（既有）

- **位置：** [`layout.tsx`](../src/app/(frontend)/layout.tsx) 全域
- **行為：** sticky、`backdrop-blur`；依 HeaderTheme 切換 `data-theme`
- **導覽：** Global `header.navItems`（CMS 可編輯）
- **Mobile：** 現有 hamburger / mobile menu 保留

### 3.2 Hero（Section 1 — 改版 `highImpact`）

#### 現況問題

- [`HighImpact/index.tsx`](../src/heros/HighImpact/index.tsx) 使用 `bg-black/45`，非 v1.1 深綠 inverse
- 單欄置中，非 home.png 左右分欄
- [`[slug]/page.client.tsx`](../src/app/(frontend)/[slug]/page.client.tsx) 強制 `setHeaderTheme('light')`，與 Hero 的 dark 衝突

#### 目標 layout

```
┌─────────────────────────────────────────────────────┐
│  inverse Section (bg-brand-inverse-bg)              │
│  ┌──────────────────┬──────────────────────────┐  │
│  │  DisplayHeading  │  Media 16:9              │  │
│  │  BodyText        │  (optional)              │  │
│  │  ReadMoreLink(s) │                          │  │
│  └──────────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="inverse" spacing="lg"`；**移除** `-mt-[10.4rem]` 黑底 overlay 模式 |
| Grid | `container` 內 `grid lg:grid-cols-2 gap-8 lg:gap-12 items-center` |
| 左欄 | `richText` → `DisplayHeading` + `BodyText`（prose 或手動映射 h1/p） |
| 右欄 | `media` 16:9 `aspect-video rounded-md overflow-hidden`；無 media 時 sage 淡色 placeholder |
| CTA | `links[]` max 2 → `ReadMoreLink` 或 `Button variant="cta"` |
| 文字色 | `text-brand-inverse-fg` |
| Mobile | 單欄 stack：標題 → 內文 → CTA → 圖 |

#### CMS fields（沿用 hero group）

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `type` | select | yes | 首頁固定 `highImpact` |
| `richText` | richText | yes | H1 + 摘要段 |
| `links` | array (link) | no | max 2 |
| `media` | upload | no | 建議 16:9 hero 圖 |

#### HeaderTheme

Hero mount 時 `setHeaderTheme('dark')`；配合 §七 scroll observer。

---

### 3.3 Quote（Section 2 — `quoteBlock`）

對照 home.png：大引文左欄 + 說明文字右欄。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="muted" spacing="default"` |
| Grid | `container max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-start` |
| 左欄 | `QuoteBlock` — serif 「」引文，`text-2xl md:text-3xl tracking-wide` |
| 右欄 | `sideText` richText → `BodyText` |
| Mobile | stack，引文在上 |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `quote` | textarea | yes |
| `attribution` | text | no |
| `sideText` | richText | no |

#### Empty state

若 `quote` 空，block 不渲染（return null）。

---

### 3.4 Featured（Section 3 — `featuredPostsBlock`）

對照 home.png「01 本期精選」：section 編號 + 2 張並排精選卡。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="default"` |
| Header row | `flex justify-between items-end`：`SectionHeading` 左、`SectionNumber` 右（如 `01`） |
| Cards | `grid md:grid-cols-2 gap-6` |
| Card 1 | `ArticleCard featured` — 可選 inverse 風格邊框/背景（左卡，home.png 深色卡對應 inverse 語意） |
| Card 2 | `ArticleCard` default |
| Mobile | 單欄 stack |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `"01"` |
| `heading` | text | yes，default `"本期精選"` |
| `posts` | relationship → posts | yes，min 1 max 2 |

#### Empty state

`posts` 空 → 不渲染。

---

### 3.5 Questions（Section 4 — `categoryNavBlock`）

對照 home.png Section 02：inverse 底、4 欄分類導覽，每格含編號、標題、箭頭。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="inverse" spacing="default"` |
| Header | `NumberedHeading variant="badge"` + section 標題（或 `SectionNumber` + `SectionHeading`） |
| Grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Item | 可點擊 card：`border border-brand-inverse-border rounded-md p-6`；左上 badge 編號；標題 serif；右下 Lucide `ArrowUpRight` |
| Link | 整卡為 `<Link>` |
| Mobile | 2-col 或 1-col（`sm:grid-cols-2`） |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `"02"` |
| `heading` | text | no，default `"從這裡開始"` |
| `items` | array | yes，min 1 max 4 |
| `items[].number` | text | yes，如 `"01"` |
| `items[].title` | text | yes |
| `items[].link` | link | yes |

#### Empty state

`items` 空 → 不渲染。

---

### 3.6 Latest Articles（Section 5 — 改版 `archiveBlock`）

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="default"` |
| Header | `introContent` → `SectionHeading` + optional `BodyText` |
| Grid | `grid md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Card | **`ArticleCard`**（替換 legacy [`Card`](../src/components/Card/index.tsx)） |
| Footer link | `ReadMoreLink href="/posts"` |
| 資料 | 沿用現有 `populateBy` / `limit` / `categories` / `selectedDocs` |

#### CMS fields

保留 [`ArchiveBlock/config.ts`](../src/blocks/ArchiveBlock/config.ts) 全部 fields，不新增。

#### 預設 seed

`limit: 6`（home.png 6 卡）或 `3`（MVP 3 卡）— **實作時採 6**，mobile 2-col / desktop 3-col。

---

### 3.7 About（Section 6 — `aboutTeaserBlock`）

對照 home.png 醫師介紹：左圖右文。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="default"` |
| Grid | `container grid md:grid-cols-2 gap-8 items-center` |
| 左欄 | `image` media，`aspect-square max-w-sm rounded-md overflow-hidden`；無圖時 placeholder |
| 右欄 | `heading` → `SectionHeading`；`body` richText → `BodyText`；`link` → `ReadMoreLink` |
| Mobile | 圖在上 |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `heading` | text | yes |
| `body` | richText | yes |
| `image` | upload | no |
| `link` | link | no，default `/about` |

---

### 3.8 Newsletter（Section 7 — `newsletterBlock`）

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="muted" spacing="default"` |
| Layout | `container max-w-2xl mx-auto text-center` |
| 標題 | `SectionHeading` |
| 說明 | optional `description` → `BodyText` |
| 表單 | `NewsletterForm`（underline input + CTA） |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `heading` | text | yes，default `"每月一封，陪您看懂胰臟。"` |
| `description` | textarea | no |

#### 後端整合

**Phase 1（本 PR）：** UI only — `onSubmit` 顯示 console / toast placeholder。

**Phase 2（後續）：** 接入 Payload `formBlock` 或外部 ESP API。spec 不阻塞首頁視覺上線。

---

### 3.9 Footer（既有）

- 已使用 `Section variant="inverse"` — 無需改版
- 滾動至 footer 時 HeaderTheme 應切 dark（§七）

---

## 四、Payload 區塊註冊

### 4.1 新增 blocks

| slug | 目錄 | 註冊於 |
|------|------|--------|
| `quoteBlock` | `src/blocks/QuoteBlock/` | `Pages/index.ts`, `RenderBlocks.tsx`, `payload.config.ts` |
| `featuredPostsBlock` | `src/blocks/FeaturedPostsBlock/` | 同上 |
| `categoryNavBlock` | `src/blocks/CategoryNavBlock/` | 同上 |
| `aboutTeaserBlock` | `src/blocks/AboutTeaserBlock/` | 同上 |
| `newsletterBlock` | `src/blocks/NewsletterBlock/` | 同上 |

每 block 標準結構：`config.ts` + `Component.tsx`（參考 [`ArchiveBlock`](../src/blocks/ArchiveBlock/)）。

### 4.2 改版 blocks

| slug | 變更 |
|------|------|
| `archive` | Component 改用 `Section` + `ArticleCard` |
| `highImpact` hero | 視覺改版（§3.2） |

### 4.3 RenderBlocks 調整

[`RenderBlocks.tsx`](../src/blocks/RenderBlocks.tsx)：

- **移除**外層 `<div className="my-16">` — spacing 由各 block 的 `Section` 負責
- 新增 block 對照表 entries
- 各 block Component **自行** wrap `Section`（variant 見 §二）

### 4.4 Page wrapper 調整

[`[slug]/page.tsx`](../src/app/(frontend)/[slug]/page.tsx)：

- 移除或縮小 `<article className="pb-16 pt-16">` 對 home 的全局 padding，避免 inverse hero 上方白邊
- Home 建議：Hero full-bleed，blocks 無額外 `pt-16`

---

## 五、HeaderTheme 策略

### 5.1 選定方案：IntersectionObserver（Option A）

| 觸發區 | Header theme |
|--------|--------------|
| Hero（inverse）可見 | `dark` |
| Questions（inverse）可見 | `dark` |
| Footer（inverse）可見 | `dark` |
| 其餘 scroll 位置 | `light` |

### 5.2 實作

新增 `src/hooks/useHeaderThemeOnScroll.ts`（或 `providers/HeaderTheme/observer.tsx`）：

- 在 home page client component mount
- 以 `data-header-theme="dark"` 標記 inverse sections（Hero wrapper、categoryNavBlock Section、Footer）
- `IntersectionObserver` `rootMargin: '-64px 0px 0px 0px'`（header 高度）`threshold: 0`
- 任一 dark sentinel intersecting → `setHeaderTheme('dark')`，否則 `light`

### 5.3 必須修正

- **刪除** [`[slug]/page.client.tsx`](../src/app/(frontend)/[slug]/page.client.tsx) 無條件 `setHeaderTheme('light')`
- Home 改用 dedicated `HomePageClient.tsx` 掛載 scroll observer
- 非 home 的 slug pages 維持現有 light default（或依各自 hero 類型）

---

## 六、響應式與無障礙

| 項目 | 規格 |
|------|------|
| Breakpoints | Tailwind `sm` 640px、`md` 768px、`lg` 1024px |
| 圖片 | `aspect-video`（文章卡）、hero media 16:9 |
| Touch target | 按鈕 / nav item min 44px 高 |
| 對比 | inverse 區 `#FAF8F5` on `#6F8D7A` — WCAG AA |
| Focus | 沿用 shadcn focus ring |
| 動效 | 尊重 `prefers-reduced-motion`（現有 tw-animate 即可） |

---

## 七、不在本 spec 範圍

- 文章內頁 FAQ、投影片、上下篇導覽（另開 spec-post）
- Payload Admin UI 主題
- Newsletter 後端 / ESP 整合（Phase 2）
- home.png charcoal/gold 配色
- 全站 user-facing dark mode toggle
- 搜尋、分類 archive 頁改版

---

## 八、Seed 資料

更新 [`src/endpoints/seed/home.ts`](../src/endpoints/seed/home.ts)：

```text
hero: highImpact（改版後視覺）
layout:
  1. quoteBlock      — 品牌引語 + 側欄說明
  2. featuredPostsBlock — 2 篇精選
  3. categoryNavBlock   — 4 分類入口
  4. archiveBlock       — limit 6
  5. aboutTeaserBlock   — 章醫師簡介
  6. newsletterBlock    — 訂閱 CTA
```

移除現有 seed 中的 generic `content`、`mediaBlock`、legacy `cta`（若與 newsletter 重複）。

---

## 九、驗證清單

### 視覺

- [ ] `/` section 順序與 §二一致
- [ ] 各 variant 背景色符合 v1.1 token
- [ ] Hero 為深綠 inverse + 雙欄（desktop）
- [ ] 文章卡為 `ArticleCard` 非 legacy Card

### CMS

- [ ] Admin → Pages → Home 可編輯各 block
- [ ] 新增/刪除 block 後前端正確渲染

### HeaderTheme

- [ ] 首屏 Hero：header 淺色字
- [ ] 滾至 Latest Articles：header 深色字
- [ ] 滾至 Questions：header 淺色字
- [ ] 滾至 Footer：header 淺色字

### 技術

- [ ] `pnpm exec tsc --noEmit` 通過
- [ ] `pnpm dev` → `/` 無 console error
- [ ] Mobile 375px 無水平 scroll

---

## 附錄 A：檔案變更預估

| 動作 | 路徑 |
|------|------|
| 改版 | `src/heros/HighImpact/index.tsx` |
| 改版 | `src/blocks/ArchiveBlock/Component.tsx` |
| 改版 | `src/blocks/RenderBlocks.tsx` |
| 改版 | `src/app/(frontend)/[slug]/page.tsx`, `page.client.tsx` |
| 新增 | `src/blocks/QuoteBlock/` |
| 新增 | `src/blocks/FeaturedPostsBlock/` |
| 新增 | `src/blocks/CategoryNavBlock/` |
| 新增 | `src/blocks/AboutTeaserBlock/` |
| 新增 | `src/blocks/NewsletterBlock/` |
| 新增 | `src/hooks/useHeaderThemeOnScroll.ts`（或等效） |
| 改版 | `src/collections/Pages/index.ts` |
| 改版 | `src/endpoints/seed/home.ts` |
| 改版 | `src/payload-types.ts`（generate） |

---

## 附錄 B：與 home.png 結構對照

| home.png 區塊 | 本 spec section | 配色備註 |
|---------------|-----------------|----------|
| Hero 黑底雙欄 | Hero inverse | 改 v1.1 深綠 |
| Quote 米色雙欄 | Quote muted | 改 v1.1 米白 card |
| 01 Featured 雙卡 | Featured default | 左卡 inverse 語意 |
| 02 四格分類 黑底 | Questions inverse | 改 v1.1 深綠 |
| Latest 6 卡 grid | Latest default | sage metadata |
| About 雙欄 | About default | — |
| Subscribe 居中 | Newsletter muted | — |
| Footer 黑底 | Footer inverse | 改 v1.1 深綠 |
