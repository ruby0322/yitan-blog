# 胰探究竟 — 著作權與醫療聲明規格

**Legal Content Spec v1.0** · Single source of truth for copyright and medical disclaimer copy

---

## 一、概述

| 項目 | 說明 |
|------|------|
| **目的** | 統一管理著作權聲明與醫療資訊免責文案，確保全站三處放置一致 |
| **程式 SSOT** | [`src/content/legal.ts`](../../src/content/legal.ts) |
| **獨立頁路由** | `/terms` |
| **聯絡入口** | `/about`（正式版末句「本網站」連結） |

---

## 二、Canonical 文案

### 2.1 頁尾精簡版（`footerShort`）

```
© 2026 章明珠醫師／胰探究竟 - 章醫師的胰臟日常。版權所有，未經授權不得轉載、重製或改作。
「胰探究竟®」為章明珠醫師之註冊商標。詳見著作權與使用條款。
```

第二行末尾「詳見著作權與使用條款」連結至 `/terms`。

### 2.2 文章末尾版（`articleEnd`）

```
本文內容為章明珠醫師原創，歡迎分享本文原始連結；未經書面授權，請勿全文轉載、擷取圖表、改作、剪輯或重新發布。
```

### 2.3 醫療資訊聲明（`medicalDisclaimer`）

```
本站內容僅供一般醫療知識與健康教育參考，不能取代醫師的診斷、治療或個別醫療建議。每位讀者的健康狀況不同，如有症狀、檢查異常或治療需求，請諮詢合格醫療專業人員。
```

### 2.4 建議正式版（`termsFull` + 開頭聲明，用於 `/terms`）

開頭（`copyrightNotice` + `trademarkNotice`）：

```
© 2026 章明珠醫師／胰探究竟 - 章醫師的胰臟日常。版權所有，未經授權不得轉載、重製或改作。
「胰探究竟®」為章明珠醫師之註冊商標。
```

詳述（`termsFull`）：

```
本網站之文章、文字、圖表、投影片、插畫、影像及其他原創內容，除另有註明外，均受著作權法保護。未經書面授權，不得擅自重製、轉載、改作、剪輯、公開傳輸或作為商業用途。
如需引用，請註明作者、文章名稱及原始文章連結。若有合作、媒體引用或內容授權需求，請與本網站聯絡。
```

### 2.5 註冊商標聲明（`trademarkNotice`）

```
「胰探究竟®」為章明珠醫師之註冊商標。
```

---

## 三、放置規則

| 位置 | 內容 | 實作 |
|------|------|------|
| 全站頁尾 | 著作權 + 註冊商標 + terms 連結 | `src/Footer/Component.tsx` |
| 每篇文章末尾 | 醫療資訊聲明 → 著作權聲明（文章末尾版） | `src/components/PostLegalNotice` |
| `/terms` 獨立頁 | 著作權 + 註冊商標 + 詳述 + 醫療資訊聲明 | `src/app/(frontend)/terms/page.tsx` |

### 行為變更

- 頁尾**移除**舊版醫療免責段落；醫療聲明出現在文章末尾與 `/terms` 頁
- About 頁 seed 的「免責聲明」區塊同步更新為 `medicalDisclaimer` 文案
- 非文章頁（首頁、關於）不在頁尾重複醫療聲明

---

## 四、視覺規範

### 4.1 文章末尾（`PostLegalNotice`）

- 位置：`RichText` 之後、`RelatedPosts` 之前
- 寬度：與正文對齊 `max-w-[48rem]`
- 容器：`mt-8 border-t border-brand-border pt-8`
- 區塊標題：`font-sans text-xs tracking-[0.2em] uppercase text-brand-sage`
- 內文：`text-sm leading-relaxed text-brand-sage`
- 區塊間距：`space-y-6`

### 4.2 頁尾

- 維持 inverse section 既有樣式：`text-sm text-brand-inverse-fg/75`
- 兩行：`copyrightNotice` → `trademarkNotice` +「詳見著作權與使用條款」連結（同一行）至 `/terms`

### 4.3 `/terms` 頁

對齊 [`spec.md`](spec.md) 與 CMS 內容頁（如 `/about`）排版：

- 版型：`pb-24 pt-16` + `container` + `max-w-[48rem] lg:max-w-[40rem] mx-auto`
- 全頁 prose：`legalPageProseClassName`（`themeRichTextClassName` + 內文連結樣式）
- 頁首：單一 `h1` + 導言 `p`，無額外 kicker / 分隔線
- 著作權內文：`copyrightNotice` + `trademarkNotice` + `termsFull` 段落
- 醫療資訊：`NumberedHeading` `variant="bar"`（spec §NumberedHeading）+ 同 prose 內文
- 末段「本網站」連結至 `/about`

---

## 五、導覽

Footer seed「網站導覽」群組新增：

| 標籤 | URL |
|------|-----|
| 著作權與使用條款 | `/terms` |

---

## 六、不在 scope

- CMS 後台編輯 legal 文案
- 新增 contact 表單頁
- 首頁或其他非文章頁加醫療聲明
