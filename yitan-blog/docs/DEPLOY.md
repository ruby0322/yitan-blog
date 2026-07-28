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

連接後會自動設定 `POSTGRES_URL` 與 `BLOB_READ_WRITE_TOKEN`。

### 4. 設定環境變數

| 變數 | 說明 | 如何取得 |
|------|------|----------|
| `PAYLOAD_SECRET` | JWT 簽章 | 用密碼管理器產生 32+ 字元隨機字串 |
| `CRON_SECRET` | 定時發布 cron 驗證 | 同上 |
| `PREVIEW_SECRET` | 草稿預覽驗證 | 同上 |
| `NEXT_PUBLIC_SERVER_URL` | 正式網域 | 例如 `https://yitan.example.com` |

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

部署完成後，由管理員在 `/admin` 建立唯一 admin 使用者：

- **姓名**：章醫師
- **Email**：由客戶提供
- **密碼**：強密碼，透過安全管道（非 Email 明文）交付

交付後請修改 demo 帳號密碼或刪除 demo 帳號（seed 建立的 `demo-author@example.com`）。

## 七、維運

- **備份**：Neon 免費版含自動備份
- **更新**：push 至 main 即自動重新部署
- **監控**：Vercel Dashboard 查看 build log 與流量
