/** Shared SEO copy for high-intent landing pages. */
export const HOME_SEO = {
  title: '胰探究竟｜章明珠醫師的胰臟日常',
  description:
    '章明珠醫師（章醫師）的胰臟衛教網站。以近 30 年臨床經驗，分享胰臟、胰臟癌、胰臟癌篩檢與日常照護的可信醫學資訊。',
} as const

export const ABOUT_SEO = {
  title: '章明珠醫師｜胰臟與胰臟癌專家',
  description:
    '認識章明珠醫師（章醫師）：台灣胰臟癌篩檢權威，近 30 年專注胰臟疾病臨床、研究與教學，分享胰臟、胰臟癌早期發現與照護衛教。',
} as const

export const POSTS_ARCHIVE_SEO = {
  title: '胰臟衛教文章｜章明珠醫師',
  description:
    '閱讀章明珠醫師的胰臟衛教文章，涵蓋胰臟、胰臟癌、胰臟癌篩檢、胰臟發炎、胰臟水泡等主題，用淺顯方式傳遞可信醫學知識。',
} as const

export function getCategorySeoTitle(categoryTitle: string): string {
  return `${categoryTitle}｜章明珠醫師 胰臟衛教`
}

export function getCategorySeoDescription(categoryTitle: string, categoryDescription?: string | null): string {
  if (categoryDescription?.trim()) return categoryDescription

  return `閱讀章明珠醫師關於「${categoryTitle}」的胰臟衛教文章，了解胰臟健康與相關疾病知識。`
}
