import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'
import { heading, paragraph, richTextRoot, table, tableCell, tableRow, text } from './lexical-helpers'

type PostArgs = {
  author: User
  category: Category
  heroImage: Media
  publishedAt: string
}

export const post6 = ({
  heroImage,
  author,
  category,
  publishedAt,
}: PostArgs): RequiredDataFromCollectionSlug<'posts'> => ({
  _status: 'published',
  title: '常見檢查怎麼看？一次搞懂重點指標',
  slug: 'understanding-common-pancreas-tests',
  heroImage: heroImage.id,
  authors: [author.id],
  categories: [category.id],
  publishedAt,
  content: richTextRoot(
    heading('h2', '為什麼需要檢查？'),
    paragraph(
      text('當醫師懷疑胰臟或相關代謝問題時，可能會安排血液檢查、影像檢查或其他評估。重點不是看懂每一個數字，而是理解這些檢查在回答什麼問題。'),
    ),
    heading('h2', '常見項目簡表'),
    table(
      tableRow(
        tableCell('檢查項目', 2),
        tableCell('主要用途', 2),
        tableCell('讀者該知道的事', 2),
      ),
      tableRow(
        tableCell('澱粉酶 / 脂肪酶'),
        tableCell('評估胰臟發炎可能'),
        tableCell('需由醫師綜合症狀判讀'),
      ),
      tableRow(
        tableCell('血糖與糖化血色素'),
        tableCell('了解血糖控制狀況'),
        tableCell('與內分泌功能密切相關'),
      ),
      tableRow(
        tableCell('腹部超音波或影像'),
        tableCell('觀察結構變化'),
        tableCell('是否需進一步檢查由醫師決定'),
      ),
    ),
    heading('h2', '看到報告別自己嚇自己'),
    paragraph(
      text('單一數值異常不代表一定有嚴重疾病。請把完整報告與症狀一起帶給醫師，才能做出正確判斷與後續追蹤計畫。'),
    ),
  ),
  meta: {
    title: '常見檢查怎麼看？一次搞懂重點指標 | 胰探究竟',
    description: '用表格整理常見胰臟相關檢查項目，協助讀者理解報告背後的意義。',
    image: heroImage.id,
  },
})
