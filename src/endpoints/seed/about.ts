import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type AboutArgs = {
  doctorImage: Media
  metaImage: Media
}

export const about = ({ doctorImage, metaImage }: AboutArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'about',
  _status: 'published',
  title: '關於',
  hero: {
    type: 'mediumImpact',
    media: doctorImage.id,
    richText: richTextRoot(
      heading('h1', '關於章醫師'),
      paragraph(
        text('台灣胰臟癌篩檢權威，以 25 年臨床經驗把複雜的胰臟知識說清楚。'),
      ),
    ),
  },
  layout: [
    {
      blockType: 'content',
      blockName: 'Doctor Bio',
      columns: [
        {
          size: 'full',
          richText: richTextRoot(
            heading('h2', '章醫師簡介'),
            paragraph(
              text(
                '章明珠醫師現任台大醫學院臨床副教授、台大醫院內科部消化系主治醫師，長年投入胰臟癌領域的診斷、治療與臨床研究。她發表胰臟相關論文 48 篇，並持續與中央研究院合作研究胰臟癌致病機轉、預後因子及前瞻治療超過十餘年，榮獲科技部卓越研究團隊計畫支持。',
              ),
            ),
            paragraph(
              text(
                '她是台灣發現最多零期胰臟癌的臨床醫師之一，許多病患遠從美國、英國、日本、新加坡前來就診。團隊近年開發出深具潛力的早期胰臟癌篩檢工具，成果於 2026 年發表於 Nature Communications。她與丈夫張毓廷醫師一同建立台灣最大規模的長期追蹤胰臟疾病生物資料庫，持續推動胰臟癌照護與研究。',
              ),
            ),
            paragraph(
              text(
                '「胰探究竟」延續這份臨床與研究積累，把第一線的診間經驗轉譯成一般讀者能理解的語言——清楚、可信，不製造恐慌，也絕不輕忽真正需要留意的警訊。',
              ),
            ),
            heading('h3', '專長與理念'),
            paragraph(
              text(
                '專注於胰臟癌早期篩檢、脂肪胰與健檢盲點、影像追蹤與風險辨識，強調「理解原理、避免恐慌、適時就醫」的衛教方式。從被動等待到主動管理，幫助讀者看懂自己的風險，拿回胰臟健康的掌控權。',
              ),
            ),
          ),
        },
      ],
    },
    {
      blockType: 'content',
      blockName: 'Content Direction',
      columns: [
        {
          size: 'oneThird',
          richText: richTextRoot(
            heading('h3', '基礎知識'),
            paragraph(text('用白話方式介紹胰臟功能、常見症狀與就醫時機。')),
          ),
        },
        {
          size: 'oneThird',
          richText: richTextRoot(
            heading('h3', '迷思破解'),
            paragraph(text('針對網路常見說法，提供有證據支持的澄清與建議。')),
          ),
        },
        {
          size: 'oneThird',
          richText: richTextRoot(
            heading('h3', '飲食保健'),
            paragraph(text('整理與代謝健康相關的生活型態與飲食原則。')),
          ),
        },
      ],
    },
    {
      blockType: 'content',
      blockName: 'Disclaimer',
      columns: [
        {
          size: 'full',
          richText: richTextRoot(
            heading('h2', '免責聲明'),
            paragraph(
              text('本網站資訊僅供衛教參考，不能取代醫師面對面的診斷與治療建議。若有身體不適或疑似胰臟相關問題，請盡快就醫。'),
            ),
          ),
        },
      ],
    },
  ],
  meta: {
    title: '關於 | 胰探究竟－章醫師的胰臟日常',
    description:
      '認識章明珠醫師：台大胰臟癌篩檢權威、零期攔截先驅，Nature Communications 早期篩檢研究，以 25 年臨床經驗分享可信、易懂的胰臟衛教。',
    image: metaImage.id,
  },
})
