import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'
import { heading, mediaBlock, paragraph, richTextRoot, text } from './lexical-helpers'

type PostArgs = {
  author: User
  category: Category
  heroImage: Media
  inlineImage: Media
  publishedAt: string
}

export const post5 = ({
  heroImage,
  inlineImage,
  author,
  category,
  publishedAt,
}: PostArgs): RequiredDataFromCollectionSlug<'posts'> => ({
  _status: 'published',
  title: '健康飲食與胰臟：不是禁口，而是均衡',
  slug: 'healthy-diet-for-pancreas',
  heroImage: heroImage.id,
  authors: [author.id],
  categories: [category.id],
  publishedAt,
  content: richTextRoot(
    heading('h2', '飲食與胰臟的關係'),
    paragraph(
      text('很多人一聽到胰臟，就聯想到「什麼都不能吃」。其實更重要的是整體飲食品質、進食節奏，以及是否長期處於高油高糖狀態。'),
    ),
    heading('h2', '實際可執行的原則'),
    paragraph(text('優先選擇原型食物、增加蔬菜比例、減少含糖飲料，並避免長時間空腹後的大量暴食。')),
    mediaBlock(inlineImage.id, 'Healthy Plate'),
    heading('h2', '外食族的小技巧'),
    paragraph(
      text('選擇清燉優先、少選油炸與重醬料理，並留意份量。若已有代謝或胰臟相關病史，更應與營養師或醫師討論個別化建議。'),
    ),
    heading('h2', '別被極端說法牽著走'),
    paragraph(
      text('沒有一種「神奇食物」能保證預防所有疾病；真正能長期幫助你的，是可持續、均衡且符合自身狀況的飲食方式。'),
    ),
  ),
  meta: {
    title: '健康飲食與胰臟：不是禁口，而是均衡 | 胰探究竟',
    description: '說明飲食與胰臟健康的實際關係，提供一般讀者可執行的均衡飲食原則。',
    image: heroImage.id,
  },
})
