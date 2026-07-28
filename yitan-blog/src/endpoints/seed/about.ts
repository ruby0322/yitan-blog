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
        text('胰探究竟由章醫師經營，專注分享胰臟相關的臨床觀察與醫學證據，協助讀者建立正確且可理解的衛教認知。'),
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
                '章醫師長期投入胰臟相關疾病的臨床照護與衛教，重視把艱深的醫學概念轉譯成一般民眾能理解的語言，協助大家在資訊爆炸的環境中，找到可信、實用的健康知識。',
              ),
            ),
            heading('h3', '專長與理念'),
            paragraph(
              text('專注於胰臟功能、常見迷思澄清、日常保健與風險辨識，強調「理解原理、避免恐慌、適時就醫」的衛教方式。'),
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
      '認識章醫師與「胰探究竟」的內容方向：以臨床經驗結合醫學證據，分享可信、易懂的胰臟衛教資訊。',
    image: metaImage.id,
  },
})
