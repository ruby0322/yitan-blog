# 胰探究竟 — 整合設計參考 v1.1

**Integrated Design Spec v1.1** · Developer Reference · Single source of truth for theme implementation

---

## 一、概述與設計決策紀錄

| 項目 | 說明 |
|------|------|
| **網站定位** | 暖白色醫療雜誌風（Magazine Layout），以 16:9 投影片直接作為部落格圖片 |
| **設計目標** | 兼具醫療專業、文青質感、科技感、長時間閱讀舒適 |
| **參考文件** | `docs/archive/spec-v1.0.md`（色票）、`docs/design/assets/home.png`（版型結構） |
| **Client 預覽** | `docs/design/spec-client.html` |
| **Client 快照** | `docs/design/snapshots/v1.1/spec-client.png` |

### 決策紀錄表

| 決策 | 選擇 | 依據 |
|------|------|------|
| 色票 | v1 spec 9 色 | 客戶原始品牌規格 |
| 版型 | home.png 結構 | mockup 參考 |
| mockup 配色 | 不採用 | Charcoal/Gold 與 v1 衝突 |
| 標題字型 | Source Han Serif TC | 客戶 finalized |
| 內文字型 | Source Han Sans TC | 客戶 confirmed |
| 圓角 | `radius: 0.25rem`（微圓角） | 客戶 v1.1 回饋 |
| 陰影 | 無 card shadow | v1 設計原則 |
| 日常用色 | 暖白、米白、鼠尾草綠、淺灰、深綠、淺鼠尾草 | 客戶 v1.1 回饋 |
| Inverse 區塊 | 深綠 `#6F8D7A` + 暖白文字 | 客戶 v1.1 回饋 |
| Scope | theme foundation ✅ · 首頁見 [spec-home.md](spec-home.md) | 文章內頁為後續 PR |
| Dark mode | section-scoped inverse only | 不暴露 user toggle |
| Icon | Lucide line icons | v1「線條式 Icon」 |

---

## 二、品牌色票

### Brand Raw Tokens

| CSS Variable | HEX | 用途 |
|--------------|-----|------|
| `--brand-warm-white` | `#FAF8F5` | 網站背景 |
| `--brand-card` | `#F5F3EF` | 卡片 / 次區塊背景 |
| `--brand-heading` | `#4A5248` | 主標題（略淺、帶綠灰調） |
| `--brand-body` | `#6E756B` | 內文（略淺、呼應品牌綠調） |
| `--brand-subtitle` | `#607D8B` | 次標 / 強調文字（ sparingly） |
| `--brand-sage` | `#8DAA91` | 重點色 |
| `--brand-border` | `#D9D6D2` | 線條 |
| `--brand-cta` | `#6F8D7A` | CTA 按鈕 |
| `--brand-hover` | `#E6EFE8` | Hover 背景 |

### 色彩使用優先級

**Primary palette（日常使用）：** 暖白、米白、鼠尾草綠、淺灰、深綠、淺鼠尾草

**Secondary palette（ sparingly）：** 深灰 `#4A5248`、中灰 `#6E756B`、灰藍 `#607D8B` — 僅用於需高對比的特殊情境（如 admin、錯誤訊息）。日常 metadata 優先使用 `text-brand-sage`。

### Inverse Section Tokens

用於 Hero、Footer 等 accent 區塊（`data-theme="dark"`），採深綠而非深藍灰。

| CSS Variable | HEX | 用途 |
|--------------|-----|------|
| `--brand-inverse-bg` | `#6F8D7A` | accent 區塊背景（深綠，與 CTA 同色） |
| `--brand-inverse-fg` | `#FAF8F5` | accent 區塊文字 |
| `--brand-inverse-border` | `#5A7566` | accent 區塊邊線 |

---

## 三、Typography

| 用途 | 字型 | Weight | Tailwind |
|------|------|--------|----------|
| 標題 (H1–H3) | Source Han Serif TC | 600, 700 | `font-serif` |
| 內文 / UI | Source Han Sans TC | 400, 500, 700 | `font-sans` |
| Section 編號 | Source Han Serif TC | 400 | `font-serif` |

### 排版規則

- 行高：內文 `leading-loose`（~2.0），prose `lineHeight: 1.9`
- 字距：標題 `tracking-wide`，內文 `tracking-wide`（~0.03em）
- 強調文字：思源黑體 Bold + `text-brand-subtitle`（ sparingly）
- prose：headings → serif、body → sans

### 字型載入

- Package：`@fontsource/noto-sans-tc`、`@fontsource/noto-serif-tc`（與思源黑體/思源宋體 TC 同源）
- Weights：400, 500, 600, 700（subset）
- Import in `layout.tsx`

### Typography Components (`src/components/theme/typography.tsx`)

| Component | Usage | Key classes |
|-----------|-------|-------------|
| `DisplayHeading` | Hero H1 | `font-serif text-4xl md:text-5xl tracking-wide` |
| `SectionHeading` | Section title | `font-serif text-2xl md:text-3xl font-semibold tracking-wide` |
| `SectionNumber` | 01 / 02 decorative | `font-serif text-5xl text-brand-sage/40` |
| `BodyText` | Body copy | `font-sans text-brand-body leading-loose tracking-wide` |
| `EmphasisText` | Keyword highlight | `font-sans font-bold text-brand-subtitle` |
| `Caption` | Date / category | `font-sans text-sm text-brand-sage` |

### NumberedHeading (`src/components/theme/numbered-heading.tsx`)

兩種 variant：

- `badge`（預設）：左側 sage 圓形 badge + serif 小標
- `bar`：左側 sage 豎線 + serif 小標（文章區塊標題，如「真實故事」）

---

## 四、Spacing & Shape

| Rule | Value |
|------|-------|
| Border radius | `--radius: 0.25rem`（微圓角，元件用 `rounded-md`） |
| Card shadow | none |
| Image aspect | 16:9 (`aspect-video`) |
| Whitespace | generous padding between sections |
| Section variants | `default` / `muted` / `inverse` |

### Section Variants

| Variant | Background | Text | Mechanism |
|---------|------------|------|-----------|
| `default` | `--brand-warm-white` | `--brand-heading` | default tokens |
| `muted` | `--brand-card` | `--brand-heading` | `bg-brand-card` |
| `inverse` | `--brand-inverse-bg` | `--brand-inverse-fg` | `data-theme="dark"` |

---

## 五、Component 規格

### Button (`components/ui/button.tsx`)

| Variant | Style | Usage |
|---------|-------|-------|
| `default` / `cta` | solid `--brand-cta`, cream text | Subscribe, primary actions |
| `readMore` | ghost, underline, arrow | Article links |
| `link` | underline text link | Inline links |
| `ghost` | transparent, hover `--brand-hover` | Secondary |
| `outline` | border only | Secondary actions |

All buttons: `rounded-md`.

### Card (`components/ui/card.tsx`)

- Flat, `rounded-md`, `border-border`, `shadow-none`
- Variants: `default` (flat), `featured` (left color block for featured posts)

### Input (`components/ui/input.tsx`)

| Variant | Style |
|---------|-------|
| `default` | full border, `rounded-md` |
| `underline` | bottom border only (Newsletter) |

### Theme Components (`components/theme/`)

| Component | Purpose |
|-----------|---------|
| `Section` | Container with variant prop |
| `ReadMoreLink` | Text link + arrow icon |
| `NumberedHeading` | Sage badge or bar variant + serif title |
| `QuoteBlock` | Centered 「」 quote layout |
| `NewsletterForm` | Email input + CTA button |
| `ArticleCard` | Flat card, 16:9 image, serif title |

### CategoryBadge

- Plain text, `text-brand-sage`, no pill/rounded background

---

## 六、頁面版型

> **首頁詳細規格：** [spec-home.md](spec-home.md)（SDD 子規格，含 CMS fields、section layout、HeaderTheme）

### 首頁區塊順序（對應 home.png）

Header → Hero (inverse) → Quote (muted) → Featured → Questions (inverse) → Latest Articles → About → Newsletter (muted) → Footer (inverse)

**狀態：** spec 已撰寫，待審核後實作。

### 文章內頁

H1 → 摘要 → Hero 16:9 → 正文 → 投影片 → FAQ → CTA → 上一篇 / 下一篇

### PPT 母片規範

1. 封面：大標＋副標＋分類＋品牌名稱
2. 內容頁：一頁一個重點
3. 圖文比例：60% 圖片 / 40% 文字
4. 結尾頁：Take Home Message（三個重點）

---

## 七、Design Token 對照表

### Brand Raw → Shadcn Semantic (`:root`)

| Shadcn Token | Maps To |
|--------------|---------|
| `--background` | `--brand-warm-white` |
| `--foreground` | `--brand-heading` |
| `--card` | `--brand-card` |
| `--card-foreground` | `--brand-heading` |
| `--muted` | `--brand-card` |
| `--muted-foreground` | `--brand-body` |
| `--primary` | `--brand-cta` |
| `--primary-foreground` | `#FAF8F5` |
| `--secondary` | `--brand-hover` |
| `--secondary-foreground` | `--brand-heading` |
| `--accent` | `--brand-sage` |
| `--accent-foreground` | `--brand-heading` |
| `--border` | `--brand-border` |
| `--input` | `--brand-border` |
| `--ring` | `--brand-sage` |

### Inverse (`[data-theme='dark']`)

| Shadcn Token | Maps To |
|--------------|---------|
| `--background` | `--brand-inverse-bg` |
| `--foreground` | `--brand-inverse-fg` |
| `--primary` | `--brand-sage` |
| `--primary-foreground` | `--brand-inverse-bg` |
| `--accent` | `--brand-sage` |
| `--border` | `--brand-inverse-border` |
| `--muted` | `#5A7566` |
| `--muted-foreground` | `#FAF8F5` at 75% opacity |

### Tailwind Utilities

Exposed via `@theme inline`:

- `bg-brand-warm-white`, `bg-brand-card`, `bg-brand-sage`, etc.
- `text-brand-heading`, `text-brand-body`, `text-brand-subtitle`
- `border-brand-border`
- `font-serif`, `font-sans`

---

## 八、Theme 策略 & 檔案結構

### Theme Strategy

- 全站預設 `light`；不在 Header 暴露 ThemeSelector
- `data-theme="dark"` 僅作 section-scoped inverse（Hero, Footer, etc.）
- HeaderTheme provider 已有：inverse section 時 header 自動切換
- Payload Admin 不在此次 scope

### Expected File Tree

```
src/
├── app/(frontend)/
│   ├── globals.css          # tokens + @theme
│   ├── layout.tsx           # font imports
│   └── theme-preview/       # dev validation page
├── components/
│   ├── theme/
│   │   ├── index.ts
│   │   ├── typography.tsx
│   │   ├── section.tsx
│   │   ├── read-more-link.tsx
│   │   ├── numbered-heading.tsx
│   │   ├── quote-block.tsx
│   │   ├── newsletter-form.tsx
│   │   └── article-card.tsx
│   └── ui/
│       ├── button.tsx       # + cta, readMore variants
│       ├── card.tsx         # flat, rounded-md
│       └── input.tsx        # + underline variant
docs/
├── design/
│   ├── README.md
│   ├── spec.md              # this file
│   ├── spec-home.md         # home page SDD sub-spec
│   ├── spec-client.html     # client review
│   ├── assets/
│   │   └── home.png         # layout reference
│   └── snapshots/
│       ├── v1.0/spec-client.png
│       └── v1.1/spec-client.png
└── archive/
    └── spec-v1.0.md         # archived v1
```

---

## 附錄：設計原則（沿用 v1）

- 大量留白
- 不使用厚重外框
- 線條式 Icon（Lucide）
- 圖片保持原始 16:9 比例
- 全站維持一致品牌色彩
