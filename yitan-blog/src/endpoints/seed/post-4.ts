import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'
import { heading, paragraph, richTextRoot, table, tableCell, tableRow, text } from './lexical-helpers'

type PostArgs = {
  author: User
  category: Category
  heroImage: Media
  publishedAt: string
}

export const post4 = ({
  heroImage,
  author,
  category,
  publishedAt,
}: PostArgs): RequiredDataFromCollectionSlug<'posts'> => ({
  _status: 'published',
  title: '胰臟炎警訊：哪些症狀需要盡快就醫？',
  slug: 'pancreatitis-warning-signs',
  heroImage: heroImage.id,
  authors: [author.id],
  categories: [category.id],
  publishedAt,
  content: richTextRoot(
    heading('h2', '什麼是胰臟炎？'),
    paragraph(
      text('胰臟炎代表胰臟組織出現發炎反應，可能與膽結石、長期飲酒、高甘油三酯或其他因素有關。部分患者症狀明顯，也可能初期被誤以為只是普通胃痛。'),
    ),
    heading('h2', '常見症狀對照'),
    table(
      tableRow(
        tableCell('症狀', 2),
        tableCell('可能意義', 2),
        tableCell('建議行動', 2),
      ),
      tableRow(
        tableCell('持續上腹痛，可能延伸到背部'),
        tableCell('需排除胰臟炎或其他腹部急症'),
        tableCell('盡快就醫評估'),
      ),
      tableRow(
        tableCell('反覆嘔吐、食慾明顯下降'),
        tableCell('可能代表腸胃或胰臟問題'),
        tableCell('不要自行服藥硬撐'),
      ),
      tableRow(
        tableCell('發燒合併腹痛'),
        tableCell('需排除感染或發炎'),
        tableCell('儘速尋求醫療協助'),
      ),
    ),
    heading('h2', '就醫前你可以做什麼'),
    paragraph(
      text('記錄疼痛開始時間、是否與進食或飲酒有關、是否伴隨黃疸或明顯體重改變，這些資訊都能幫助醫師更快判斷。'),
    ),
  ),
  meta: {
    title: '胰臟炎警訊：哪些症狀需要盡快就醫？ | 胰探究竟',
    description: '整理胰臟炎常見警訊與就醫時機，協助讀者提高警覺但不過度恐慌。',
    image: heroImage.id,
  },
})
