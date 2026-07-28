import type { RequiredDataFromCollectionSlug } from 'payload'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

const BRAND_INTRO =
  '歡迎來到「胰探究竟－章醫師的胰臟日常」。這裡以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，致力於傳遞正確、可信且容易理解的醫學資訊。'

export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  title: '首頁',
  hero: {
    type: 'lowImpact',
    richText: richTextRoot(
      heading('h1', '胰探究竟－章醫師的胰臟日常'),
      paragraph(text(BRAND_INTRO)),
    ),
  },
  meta: {
    description: BRAND_INTRO,
    title: '胰探究竟－章醫師的胰臟日常',
  },
  layout: [],
}
