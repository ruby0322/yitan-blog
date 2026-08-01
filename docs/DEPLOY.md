# Vercel 部署指南 — 胰探究竟

本專案使用 Payload CMS `with-vercel-website` 模板，部署至 Vercel 時需連接 **Neon Postgres** 與 **Vercel Blob**。

## 一、前置準備

1. GitHub 帳號（存放原始碼）
2. Vercel 帳號（由我們代管）
3. 自訂網域（選填，例如 `yitan.example.com`）

## 二、部署步驟

### 1. 建立 GitHub Repository

```bash
cd yitan-blog
git init
git add .
git commit -m "Initial commit: 胰探究竟部落格"
git remote add origin git@github.com:YOUR_ORG/yitan-blog.git
git push -u origin main
```

### 2. Vercel Import Project

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. **Add New → Project** → 選擇 `yitan-blog` repo
3. Framework Preset：**Next.js**
4. Build Command：`pnpm run ci`（會先跑 migration 再 build）
5. Install Command：`pnpm install`
6. Node.js Version：**24.x**

### 3. 連接整合服務

在 Vercel Project → **Storage** 新增：

| 服務 | 用途 |
|------|------|
| **Neon Postgres** | 文章、頁面、媒體 metadata |
| **Vercel Blob** | 圖片上傳 |

連接後會自動設定 `POSTGRES_URL`。Blob 需額外確認 **`BLOB_READ_WRITE_TOKEN`**（見下方）。

> **重要：** Payload 的 Vercel Blob adapter **只認** `BLOB_READ_WRITE_TOKEN`。  
> 若 env 裡只有 `BLOB_STORE_ID` + `BLOB_WEBHOOK_PUBLIC_KEY`（新版 OIDC 連線），**upload 會 silently 改走本機 `public/media`**，deploy 後圖片全掛。

在 Blob store 頁 → 你的 project → **⋯ → Update Project Connection** → 勾選 **Production / Preview**，並在 Advanced 選項確認 **Read-Write Token** 有加入 project。  
完成後 Settings → Environment Variables 應看得到 `BLOB_READ_WRITE_TOKEN`（格式 `vercel_blob_rw_...`）。

### 4. 設定環境變數

| 變數 | 說明 | 如何取得 |
|------|------|----------|
| `PAYLOAD_SECRET` | JWT 簽章 | 用密碼管理器產生 32+ 字元隨機字串 |
| `CRON_SECRET` | 定時發布 cron 驗證 | 同上 |
| `PREVIEW_SECRET` | 草稿預覽驗證 | 同上 |
| `NEXT_PUBLIC_SERVER_URL` | 正式網域 | 例如 `https://yitan.example.com` |
| `BLOB_READ_WRITE_TOKEN` | Payload 媒體上傳（**必填**） | Blob store 連接 project 時一併注入；見 §二 step 3 |
| `SEED_ADMIN_EMAIL` | Seed 建立的 admin Email | 例如 `hello@pancrease.com` |
| `SEED_ADMIN_PASSWORD` | Seed 建立的 admin 密碼 | 強密碼，勿寫進 repo |

### 5. 部署

Push 至 `main` 分支即觸發自動部署。首次部署成功後：

1. 前往 `https://YOUR_DOMAIN/admin`
2. 建立章醫師 admin 帳號
3. 點選「建立示範內容」或手動建立首頁/關於/文章

## 三、自訂網域

1. Vercel Project → **Settings → Domains**
2. 新增域名並依指示設定 DNS
3. 更新 `NEXT_PUBLIC_SERVER_URL` 為正式網域
4. 重新部署

## 四、Schema 變更後

若修改 collection 欄位，本地需：

```bash
pnpm payload migrate:create
git add src/migrations/
git commit -m "Add migration for schema change"
git push
```

Vercel build 的 `pnpm run ci` 會自動執行 `payload migrate`。

## 五、預估成本（個人部落格）

| 服務 | 方案 | 月費 |
|------|------|------|
| Vercel | Hobby | $0 |
| Neon Postgres | Free | $0 |
| Vercel Blob | 按量 | ~$0–5 |
| 域名 | — | ~$10–15/年 |

## 六、章醫師帳號建立

部署時 `pnpm seed` 會依環境變數自動建立 admin 使用者：

- **姓名**：`SEED_ADMIN_NAME`（選填，預設 `章醫師`）
- **Email**：`SEED_ADMIN_EMAIL`
- **密碼**：`SEED_ADMIN_PASSWORD`

重新執行 seed（`pnpm seed` 或 `POST /next/seed`）會重置此帳號及所有 CMS 內容。

## 七、維運

- **備份**：Neon 免費版含自動備份
- **更新**：push 至 main 即自動重新部署
- **監控**：Vercel Dashboard 查看 build log 與流量

## 八、圖片／媒體沒出現（troubleshooting）

本站圖片**不是**從 git 直接當靜態檔部署，而是：

1. Build 跑 `pnpm ci` → `payload migrate` → **`pnpm seed`** → `next build`
2. Seed 讀取 `materials/posts-revised/`（文章圖；legacy 文章 fallback 至 `materials/posts/`）與 `public/seed-media/book-flat.JPG`（首頁書封），上傳至 Payload **Media**
3. 正式環境 Media 檔案存於 **Vercel Blob**（需 `BLOB_READ_WRITE_TOKEN`）

因此「程式碼有上去、圖沒有」通常是 **seed 沒成功** 或 **Blob 沒接好**。

### 檢查清單

| 項目 | 做法 |
|------|------|
| `materials/` 已在 repo | 需含 `materials/posts-revised/`（client 封面與 inline 圖），否則 seed 會 ENOENT |
| Vercel Blob 已連接 | 需有 **`BLOB_READ_WRITE_TOKEN`**，不能只有 `BLOB_STORE_ID` |
| Build log | 搜尋 `Seed completed successfully`；若有 `ENOENT` / `Seed failed` 代表媒體沒灌進 DB |
| 手動重跑 seed | 部署成功後，以 admin 登入，對 `POST /next/seed` 觸發（會清空並重建 posts/media） |

### 常見原因

- **第一次 deploy 時還沒 push `materials/`** → 重 push 含 materials 的 commit 後再 deploy
- **沒接 Vercel Blob** → 上傳無持久化，runtime 讀不到檔案
- **只有 `BLOB_STORE_ID`，沒有 `BLOB_READ_WRITE_TOKEN`** → Payload blob plugin 停用，seed 圖片不進 Blob（你目前的狀況）
- **Build 有 seed 錯誤但被忽略** → 修正後在 Vercel 按 **Redeploy**

`public/media/` 已在 `.gitignore`，不應期待把本機上傳檔 push 上去；正式環境一律走 Blob。
