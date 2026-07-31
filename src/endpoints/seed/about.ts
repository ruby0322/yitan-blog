import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { LEGAL } from '@/content/legal'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type AboutArgs = {
  metaImage: Media
}

export const about = ({ metaImage }: AboutArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'about',
  _status: 'published',
  title: '關於',
  hero: {
    type: 'lowImpact',
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
                '專注於胰臟疾病的臨床診療與研究近三十年，是台灣少數長期全心投入胰臟疾病診療、研究與胰臟癌早期篩檢的醫師。診療範圍涵蓋從急、慢性胰臟炎、脂肪胰、胰臟囊腫到胰臟癌等完整疾病光譜，累積國內豐富的胰臟疾病診療經驗。',
              ),
            ),
            paragraph(
              text(
                '建立亞太最大的胰臟疾病資料庫，並撰寫胰臟超音波教科書。正因為同時照顧各類胰臟疾病，而非只專注於單一疾病，更能將發炎、囊腫、腫瘤與影像變化彼此連結、融會貫通，提升早期辨識風險與精準判斷的能力。',
              ),
            ),
            paragraph(
              text(
                '秉持「理解原理、避免恐慌、適時就醫」的理念，協助讀者看懂自己的風險，從被動等待走向主動管理。',
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
            heading('h3', '健檢判讀'),
            paragraph(text('協助理解影像與血液檢查結果，釐清哪些發現需要追蹤。')),
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
            heading('h2', '醫療資訊聲明'),
            paragraph(
              text(LEGAL.medicalDisclaimer),
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
