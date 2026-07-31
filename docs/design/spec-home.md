# 胰探究竟 — 首頁設計規格

**Home Page Design Spec** · Sub-spec of [整合設計參考 v1.1](spec.md)

| 項目 | 值 |
|------|-----|
| 狀態 | Implemented — v1.1 home page |
| 版型參考 | [`assets/home.png`](assets/home.png)（結構 only） |
| 視覺規範 | [spec.md v1.1](spec.md)（**不**採用 home.png 的 charcoal/gold 配色） |
| CMS 模型 | Payload Pages collection — **區塊驅動** |
| 路由 | `/` → `pages` slug `home`（[`page.tsx`](../src/app/(frontend)/page.tsx) re-export） |

---

## 一、概述與成功標準

### 1.1 定位

首頁是「暖白色醫療雜誌風」的 landing page：建立品牌信任、導流至精選/最新文章、推動書籍購買。版型對照 home.png 的 **9 段垂直節奏**，視覺遵循 v1.1 token；**區段以暖白 / 米白交替**，深綠僅保留 CTA 按鈕。

### 1.2 成功標準（Definition of Done）

- [x] 首頁依序呈現 8 個 CMS layout blocks + Hero + Header/Footer，順序與 §二一致
- [x] 各 section 以暖白 / 米白 variant 交替（無 inverse 大色塊）
- [x] 視覺與 v1.1 theme 元件一致（非 legacy `Card`、非 `bg-black/45` hero overlay）
- [x] Payload Admin 可編輯各 block 文案、連結、文章關聯
- [x] Header 全頁維持 light-on-light
- [x] Mobile（`< md`）各 section 可讀、可點、無水平溢出
- [x] Seed `home.ts` 提供完整繁中 placeholder，新環境 `pnpm setup` 或 `pnpm seed` 後 `/` 即可預覽

### 1.3 實作策略

採 **漸進 block**（一次新增/改版一個 block + seed 更新，每步可 deploy、可 review）。

---

## 二、Section 總覽

對照 home.png 與 [spec.md §六](spec.md)：

| # | Section | `Section` variant | 背景色票 |
|---|---------|-------------------|----------|
| — | Header | — | 暖白 sticky |
| 1 | Hero | `default` | 暖白 `#FAF8F5` |
| 2 | Quote | `muted` | 米白 `#F5F3EF` |
| 3 | 四大特色 | `default` | 暖白 |
| 4 | Featured | `muted` | 米白 |
| 5 | 依主題閱讀 | `default` | 暖白 |
| 6 | About | `muted` | 米白 |
| 7 | Book Sales | `default` | 暖白 |
| — | Footer | `inverse` | 深綠 `#6F8D7A`（全站唯一 inverse 大色塊） |

> **用色原則：** 首頁主內容區以暖白 / 米白交替；深綠 `#6F8D7A` 用於 CTA 按鈕與 Footer。

預設 seed layout 順序：`quoteBlock` → `featuresBlock` → `featuredPostsBlock` → `categoryNavBlock` → `aboutTeaserBlock` → `bookSalesBlock`（Hero 在 page.hero，非 layout）。

---

## 三、各 Section 詳細規格

### 3.0 Section header（全站統一）

所有 layout blocks 共用 [`SectionHeader`](../src/components/theme/section-header.tsx)：

| 元素 | 規格 |
|------|------|
| Wrapper | `<header>` 全寬，`border-b border-brand-sage/25 pb-4 mb-6 lg:mb-8 lg:pb-6` |
| Kicker（左） | `heading` CMS 欄位 → `font-sans text-sm md:text-base tracking-[0.28em] text-brand-sage uppercase` |
| 編號（右） | `sectionNumber` → `SectionNumber`（`text-3xl md:text-4xl lg:text-5xl`） |
| 僅編號 | 無 kicker 時（如 quote）→ `justify-end`，只顯示編號 |

---

### 3.1 Header（既有）

- **位置：** [`layout.tsx`](../src/app/(frontend)/layout.tsx) 全域
- **行為：** sticky、`backdrop-blur`；依 HeaderTheme 切換 `data-theme`
- **導覽：** Global `header.navItems`（CMS 可編輯）
- **Mobile：** 現有 hamburger / mobile menu 保留

### 3.2 Hero（Section 1 — 改版 `highImpact`）

#### 目標 layout

```
┌─────────────────────────────────────────────────────┐
│  default Section (bg-brand-bg) + HeroDecor 裝飾層   │
│  ┌──────────────────┬──────────────────────────┐  │
│  │  DisplayHeading  │  OrganRingMark     │  │
│  │  BodyText        │  (內建 SVG，非 CMS 圖片)  │  │
│  │  ReadMoreLink(s) │  aspect-square max-h420  │  │
│  └──────────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="lg"` + `relative overflow-hidden` |
| 裝飾 | `HeroDecor` — 僅 hero section：grain overlay、diagonal editorial lines |
| Grid | `container` 內 `grid lg:grid-cols-2 gap-8 lg:gap-12 items-center` |
| 左欄 | `richText` → theme prose（`DisplayHeading` + `BodyText` 色票） |
| 右欄 | **`OrganRingMark`** — 內建胰臟環形 SVG（sage `#8DAA91`），**不使用 CMS media** |
| CTA | `links[]` → primary 用 `Button variant="cta"`，secondary 用 `outline` |
| 文字色 | `text-brand-heading` / `text-brand-body` |
| Mobile | 單欄 stack：標題 → 內文 → CTA → 環形 graphic |

#### 品牌視覺元件（`src/components/brand/`）

| 元件 | 用途 |
|------|------|
| `OrganRingMark` | 傾斜橢圓環形 stroke + 左上 soft glow hotspot；v1.1 sage 色票 |
| `HeroDecor` | 絕對定位裝飾層：diagonal lines（10–12% opacity）、`.hero-grain` CSS noise |
| `HeroRingStage` | Hero 右欄 wrapper：`OrganRingMark` + optional float animation |
| `EditorialImagePlaceholder` | 文章卡 / About 區塊的 seed placeholder（`card` / `oval` variants） |

#### Hero 裝飾規則

- **範圍：** 僅 Hero section，不延伸至其他 blocks
- **Grain：** CSS `feTurbulence` data URI（`.hero-grain`），opacity ~5%，`pointer-events-none`
- **Editorial lines：** 1–2 條 sage 斜線，雜誌分隔感，非 tech UI
- **Reduced motion：** `prefers-reduced-motion: reduce` → 停用 `OrganRingMark` float animation

#### CMS fields（沿用 hero group）

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `type` | select | yes | 首頁固定 `highImpact` |
| `richText` | richText | yes | H1 + 摘要段 |
| `links` | array (link) | no | max 2 |
| `media` | upload | no | **僅 `mediumImpact` 顯示**；highImpact 使用內建 graphic |

#### Seed placeholder 文案（可替換）

| 欄位 | Seed 值 |
|------|---------|
| H1 | `看懂胰臟，從理解開始。` |
| 副標 | 1–2 句書籍導讀 + 可信醫學寫作 |
| Primary CTA | `閱讀最新文章` → `/posts` |
| Secondary CTA | `認識章醫師` → `/about` |

#### 雜誌調性 guardrails

- 不使用 bounce / confetti / emoji 動畫
- Particles 數量嚴格限制（≤18），保持專業、克制
- 不使用 home.png 的 charcoal/gold 配色

#### HeaderTheme

Hero 為 default（暖白）背景；Header 維持 light-on-light。Footer inverse 時切換 dark header（§七 scroll observer）。

---

### 3.3 Quote（Section 2 — `quoteBlock`）

對照 home.png：引文左欄 + 說明右欄（雙欄雜誌 layout，無書封）。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="muted" spacing="default"` |
| Header | 可選 `SectionHeader sectionNumber`（無 kicker 時僅顯示編號） |
| Grid | `container max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-stretch` |
| 左欄 | `QuoteBlock`（含 attribution） |
| 右欄 | `sideText` richText |
| Mobile | stack |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `quote` | textarea | yes |
| `attribution` | text | no |
| `sideText` | richText | no |
| `coverImage` | upload → media | no（保留欄位，前端不渲染） |

#### Empty state

若 `quote` 空，block 不渲染（return null）。

---

### 3.4 四大特色（Section 3 — `featuresBlock`）

品牌價值主張：4 項靜態特色，bar-variant 標題 + 說明文字。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="default"` |
| Header | `SectionHeader`：`heading`（default「四大特色」）+ `sectionNumber`（default `"01"`） |
| Grid | Mobile 單欄；Desktop 左右兩組 flex column（左：①③，右：②④） |
| Stagger | 右組 `lg:mt-16 xl:mt-20` — 兩組 top 錯落；組內 `items-start` 置左對齊 |
| Item | `NumberedHeading variant="bar"`（無子項編號）+ sans body |
| Mobile | 單欄 stack（1×4） |
| Desktop | 左右兩組各 2 項垂直堆疊；右組 top 下移製造層次 |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `"01"` |
| `heading` | text | yes，default `"四大特色"` |
| `items` | array | yes，min 4 max 4 |
| `items[].title` | text | yes |
| `items[].description` | textarea | yes |

#### Empty state

`items` 空 → 不渲染。

---

### 3.5 Featured（Section 4 — `featuredPostsBlock`）

對照 home.png「02 本期精選」：section 編號 + 精選卡 grid。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="muted" spacing="default"` |
| Header | `SectionHeader`：`heading` + `sectionNumber` |
| Cards | `grid md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Footer link | 置中 `ReadMoreLink`：`查看全部文章` → `/posts` |
| Card 1 | `ArticleCard featured` — 可選 inverse 風格邊框/背景（左卡，home.png 深色卡對應 inverse 語意） |
| Card 2 | `ArticleCard` default |
| Mobile | 單欄 stack |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `"02"` |
| `heading` | text | yes，default `"本期精選"` |
| `posts` | relationship → posts | yes，min 1 max 3 |

#### Empty state

`posts` 空 → 不渲染。

---

### 3.6 依主題閱讀（Section 5 — `categoryNavBlock`）

6 個主題 slide 的 horizontal carousel；每 slide 含標題、分類說明、top 3 文章 list preview；連結至 `/posts?category={slug}`。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="default"` |
| Header | `SectionHeader`：`heading` + `sectionNumber` |
| Layout | Horizontal carousel：`snap-x snap-mandatory`；slide 寬 mobile ~88vw / desktop ~420–460px |
| Auto-advance | 每 2.5s 切換下一 slide；`hover` / `focus` 暫停 |
| Reduced motion | `prefers-reduced-motion: reduce` → 關閉 auto-advance，保留手動 scroll |
| Slide | `border border-brand-sage/20 bg-brand-bg rounded-md p-6`；標題 serif + `ArrowUpRight`；`BodyText` 說明；文章 list（標題 + 日期）；`ReadMoreLink`「查看此主題」 |
| 導覽 | 左右 chevron + dot indicators |
| 資料 | `items[].category` relationship → `categories.description` + runtime top 3 posts |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `"03"` |
| `heading` | text | no，default `"依主題閱讀"` |
| `items` | array | yes，min 1 max 6 |
| `items[].category` | relationship → categories | yes |
| `items[].title` | text | yes |
| `items[].link` | link | yes |

`categories.description`：textarea，分類頁 header 共用。

#### Empty state

`items` 空 → 不渲染。slide 內無文章 → 顯示「此主題尚無文章」。

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

文青編輯式醫師 profile，對齊 book sales 區塊語彙。文案來源：[`spec-book-marketing.md`](spec-book-marketing.md) §十 About mapping。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="muted" spacing="default"` |
| Meta row | `SectionHeader`：`heading` + `sectionNumber` |
| Desktop layout | `grid md:grid-cols-[2fr_3fr] md:gap-12 lg:gap-16`，editorial 開放排版（無 frame） |
| 左欄（有圖） | 肖像 `aspect-[3/4]`，無白框 |
| 左欄（無圖） | `doctorName` + 小標「醫師」→ `credentialsLine` 條列 |
| 右欄 | `body` → `highlightLine` → `ReadMoreLink`；desktop 以細線 `border-l` 分隔 |
| Mobile layout | 姓名/職稱與內文垂直 stack，無 frame 卡片 |
| 無圖 | 不使用 placeholder；editorial 雙欄文字排版 |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `04` |
| `heading` | text | yes，區塊標籤（seed：`認識章醫師`） |
| `doctorName` | text | yes（seed：`章明珠`） |
| `credentialsLine` | textarea | no，每行一項（條列顯示） |
| `body` | richText | yes |
| `highlightLine` | text | no（重點引述） |
| `image` | upload | no |
| `link` | link | no，default `/about` |

#### Seed copy

見 [`spec-book-marketing.md` §十](spec-book-marketing.md#十首頁-cms-field-mapping) `aboutTeaserBlock` 表。

---

### 3.8 Book Sales（Section 7 — `bookSalesBlock`）

首頁 closing CTA：文青雜誌式書籍推廣，以平放書封 + 封面文案排版 + 外部購買連結。文案來源：[`spec-book-marketing.md`](spec-book-marketing.md) §十 Book Sales mapping。

| 屬性 | 規格 |
|------|------|
| Wrapper | `Section variant="default" spacing="default"`，`id="book-sales"`（quote 區 attribution 錨點） |
| Meta row | `SectionHeader`：kicker `新書出版` + `sectionNumber` |
| Desktop layout | `grid lg:grid-cols-[0.38fr_0.62fr] lg:items-stretch lg:gap-x-16 xl:gap-x-20` |
| 左欄（desktop） | 單層 `<figure>`（`lg:p-6` 柔和 frame + shadow），書封高度對齊右欄 |
| 右欄（desktop） | 書名 → 副標 → `BodyText` → 左邊線 `highlightLine`（黑體）→ `authorLine` → `CMSLink` outline |
| Mobile layout | 白色 frame 卡片：書封置中 → 書名/副標（垂直 stack）；內文、引述、作者、CTA 全寬於卡片下方 |
| CTA | Mobile `w-full`；Desktop `w-auto min-w-44`；外部 URL，`newTab` 預設 true |
| 書封 sizing | Mobile `max-h-52`；Desktop `imgStyle` + `lg:h-full` 對齊文字欄高度 |

#### CMS fields

| Field | Type | Required |
|-------|------|----------|
| `sectionNumber` | text | no，default `05` |
| `heading` | text | yes，書名（seed：`攔截胰臟癌`） |
| `bookSubtitle` | text | no |
| `description` | textarea | no |
| `highlightLine` | text | no（重點引述，如存活率數據） |
| `authorLine` | text | no |
| `coverImage` | upload → media | no（seed：`book-flat.JPG`） |
| `buyLink` | link group | yes（外部購買 URL + label） |

#### Seed copy

見 [`spec-book-marketing.md` §十](spec-book-marketing.md#十首頁-cms-field-mapping) `bookSalesBlock` 表。

#### 電子報 block（保留）

`newsletterBlock` 仍註冊於 Payload，可供其他頁面使用；首頁 seed 不再包含。Phase 2 可接入 ESP 或 Footer 訂閱。

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
| `featuresBlock` | `src/blocks/FeaturesBlock/` | 同上 |
| `featuredPostsBlock` | `src/blocks/FeaturedPostsBlock/` | 同上 |
| `categoryNavBlock` | `src/blocks/CategoryNavBlock/` | 同上 |
| `aboutTeaserBlock` | `src/blocks/AboutTeaserBlock/` | 同上 |
| `bookSalesBlock` | `src/blocks/BookSalesBlock/` | 同上 |
| `newsletterBlock` | `src/blocks/NewsletterBlock/` | 同上（保留，首頁未使用） |

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
| Footer（inverse）可見 | `dark` |
| 其餘 scroll 位置 | `light` |

### 5.2 實作

新增 `src/hooks/useHeaderThemeOnScroll.ts`（或 `providers/HeaderTheme/observer.tsx`）：

- 在 home page client component mount
- 以 `data-header-theme="dark"` 標記 inverse sections（Footer）
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
hero: highImpact（OrganRingMark，無 media）
layout:
  1. quoteBlock         — 品牌引語 + 側欄說明（雙欄，無書封）
  2. featuresBlock      — 四大特色（4 欄 bar-variant 價值主張）
  3. featuredPostsBlock — 3 篇精選 + 查看全部文章
  4. categoryNavBlock   — 基礎知識 / 胰臟癌 / 胰臟發炎 / 胰臟水泡 / 飲食保健 / 健檢判讀
  5. aboutTeaserBlock   — 章醫師編輯 profile（NTUH 職稱 + 引述）
  6. bookSalesBlock     — 平放書封 + 封面文案排版 + 購買 CTA
```

### Placeholder 政策

| 類型 | 來源 | 客戶可編輯 |
|------|------|-----------|
| Hero H1 / 副標 / CTA | seed `home.ts` | Payload Admin → Pages → Home → hero |
| Quote / Book Sales 文案 | seed（標註「客戶可替換文案」） | Admin → layout blocks |
| 書封圖片 | seed `book-flat.JPG`（書籍區塊） | Admin → bookSalesBlock coverImage |
| Category nav 標籤 | seed | Admin → categoryNavBlock items |
| 文章卡無圖 | `EditorialImagePlaceholder`（runtime fallback） | 上傳 post meta.image |
| About 無圖 | `EditorialImagePlaceholder oval` | 上傳 aboutTeaserBlock image |
| 胰臟環形 graphic | 內建 SVG（非 CMS） | 需改 code |

移除現有 seed 中的 generic `content`、`mediaBlock`、legacy `cta`（若與 book sales 重複）。

---

## 九、驗證清單

### 視覺

- [x] `/` section 順序與 §二一致
- [x] 各 variant 背景色符合 v1.1 token
- [x] Hero 為暖白雙欄 + 內建 OrganRingMark（desktop）
- [x] 文章卡為 `ArticleCard` 非 legacy Card

### CMS

- [x] Admin → Pages → Home 可編輯各 block
- [x] 新增/刪除 block 後前端正確渲染

### HeaderTheme

- [x] 首屏 Hero：header 淺色字
- [x] 滾至 Latest Articles：header 深色字
- [x] 滾至 Questions：header 淺色字
- [x] 滾至 Footer：header 淺色字

### 技術

- [x] `pnpm exec tsc --noEmit` 通過
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
| 新增 | `src/blocks/BookSalesBlock/` |
| 新增 | `src/blocks/NewsletterBlock/`（保留） |
| 新增 | `src/hooks/useHeaderThemeOnScroll.ts`（或等效） |
| 改版 | `src/collections/Pages/index.ts` |
| 改版 | `src/endpoints/seed/home.ts` |
| 新增 | `src/components/brand/OrganRingMark.tsx` |
| 新增 | `src/components/brand/HeroDecor.tsx` |
| 新增 | `src/components/brand/HeroParticles.tsx` |
| 新增 | `src/components/brand/EditorialImagePlaceholder.tsx` |
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
| Subscribe 居中 | Book Sales default | 3D 書封 + 購買 CTA |
| Footer 黑底 | Footer inverse | 改 v1.1 深綠 |
