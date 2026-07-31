import type { RequiredDataFromCollectionSlug } from 'payload'
import { LEGAL } from '@/content/legal'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

const BRAND_INTRO =
  '歡迎來到「胰探究竟－章醫師的胰臟日常」。這裡以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，致力於傳遞正確、可信且容易理解的醫學資訊。'

export const aboutStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'about',
  _status: 'published',
  title: '關於',
  hero: {
    type: 'lowImpact',
    richText: richTextRoot(
      heading('h1', '關於章醫師'),
      paragraph(
        text('胰探究竟由章醫師經營，專注分享胰臟相關的臨床觀察與醫學證據，協助讀者建立正確且可理解的衛教認知。'),
      ),
    ),
  },
  meta: {
    description:
      '認識章醫師與「胰探究竟」的內容方向：以臨床經驗結合醫學證據，分享可信、易懂的胰臟衛教資訊。',
    title: '關於 | 胰探究竟－章醫師的胰臟日常',
  },
  layout: [
    {
      blockType: 'content',
      blockName: 'About Fallback',
      columns: [
        {
          size: 'full',
          richText: richTextRoot(
            heading('h2', '為什麼開始寫這個部落格？'),
            paragraph(
              text(
                '胰臟相關問題常被誤解，許多資訊不是過於艱澀，就是充滿未經證實的說法。章醫師希望透過這個平台，把真正重要的胰臟知識整理成一般民眾也能理解的內容。',
              ),
            ),
            heading('h2', '醫療資訊聲明'),
            paragraph(
              text(LEGAL.medicalDisclaimer),
            ),
          ),
        },
      ],
    },
  ],
}
