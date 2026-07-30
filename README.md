# 胰探究竟－章醫師的胰臟日常

章醫師個人醫學部落格，使用 Payload CMS + Next.js + Vercel Postgres 建置。

## 功能

- 首頁、關於、部落格列表與文章內頁
- Payload 後台（`/admin`）發文、插圖、表格
- 繁體中文後台與品牌前台
- Vercel Postgres + Blob 部署就緒

## 本地開發

```bash
cp .env.example .env
pnpm db:up          # starts Postgres on localhost:54320
pnpm install
pnpm migrate        # apply schema migrations
pnpm seed           # optional: load demo home/about/posts
pnpm dev
```

首次登入 `/admin` 建立帳號後，也可在後台點「建立示範內容」初始化首頁、關於頁與示範文章。

若修改 collection 欄位（例如新增 block），本地需：

```bash
pnpm migrate:create
pnpm migrate
pnpm seed           # re-seed if needed
```

## 部署

詳見 [docs/DEPLOY.md](docs/DEPLOY.md)

## 操作手冊

給章醫師的使用說明：[docs/操作手冊.md](docs/操作手冊.md)

## 技術棧

- Payload CMS 3 + Lexical Editor（含 EXPERIMENTAL_TableFeature）
- Next.js 16 App Router
- Vercel Postgres + Blob
- Tailwind CSS 4
