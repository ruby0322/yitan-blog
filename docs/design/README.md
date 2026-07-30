# Design Documentation

**Current version:** 整合設計參考 v1.1 / Integrated Design Spec v1.1

## Files

| Path | Purpose |
|------|---------|
| [`spec.md`](spec.md) | Developer reference (single source of truth for theme implementation) |
| [`spec-home.md`](spec-home.md) | Home page SDD sub-spec (sections, CMS blocks, HeaderTheme) |
| [`spec-book-marketing.md`](spec-book-marketing.md) | 《攔截胰臟癌》行銷文案（PDF 結構化 + 首頁 seed mapping） |
| [`book-marketing.pdf`](book-marketing.pdf) | 天下雜誌出版行銷稿（封面 + 封底 + 作者簡介） |
| [`spec-client.html`](spec-client.html) | Client-facing A4 preview (open in browser or export to PNG) |
| [`assets/`](assets/) | Shared reference assets (layout mockup, sample images) |
| [`snapshots/`](snapshots/) | Frozen PNG exports per spec version |

## Snapshots

| Version | PNG | Notes |
|---------|-----|-------|
| v1.0 | [`snapshots/v1.0/spec-client.png`](snapshots/v1.0/spec-client.png) | Initial integrated client preview |
| v1.1 | [`snapshots/v1.1/spec-client.png`](snapshots/v1.1/spec-client.png) | Client feedback: sage inverse, micro-radius, typography spacing |

Regenerate the current snapshot:

```bash
pnpm export:spec-client
# or for a specific version:
SPEC_VERSION=v1.1 pnpm export:spec-client
```

## Implementation Plans

| Feature | Plan | Spec |
|---------|------|------|
| Home page | [`../superpowers/plans/2026-07-30-home-page.md`](../superpowers/plans/2026-07-30-home-page.md) | [`spec-home.md`](spec-home.md) |
| Book marketing copy | — | [`spec-book-marketing.md`](spec-book-marketing.md) |

## Archive

Superseded written specs live in [`../archive/`](../archive/).
