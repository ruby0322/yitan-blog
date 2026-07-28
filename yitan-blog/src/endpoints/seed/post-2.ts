import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type PostArgs = {
  author: User
  category: Category
  heroImage: Media
  publishedAt: string
}

export const post2 = ({
  heroImage,
  author,
  category,
  publishedAt,
}: PostArgs): RequiredDataFromCollectionSlug<'posts'> => ({
  _status: 'published',
  title: '破解迷思：吃太甜一定會得糖尿病嗎？',
  slug: 'sugar-and-diabetes-myth',
  heroImage: heroImage.id,
  authors: [author.id],
  categories: [category.id],
  publishedAt,
  content: richTextRoot(
    heading('h2', '常見說法'),
    paragraph(text('很多人以為只要少吃糖，就不會與胰臟或血糖問題有關。但實際情況往往更複雜。')),
    heading('h2', '更接近事實的說法'),
    paragraph(
      text('糖尿病的發生與遺傳、年齡、活動量、整體飲食型態、體重與代謝狀態都有關係，不能只用單一食物來概括。'),
    ),
    heading('h2', '實用建議'),
    paragraph(text('比起極端忌口，更重要的是整體均衡飲食、規律運動，以及定期追蹤血糖與相關指標。')),
    heading('h2', '可以這樣做'),
    paragraph(
      text('減少含糖飲料、留意精緻澱粉攝取、維持固定用餐時間，並在有家族病史或代謝風險時，與醫師討論是否需要進一步檢查。'),
    ),
  ),
  meta: {
    title: '破解迷思：吃太甜一定會得糖尿病嗎？ | 胰探究竟',
    description: '澄清常見迷思，說明糖分、飲食與血糖控制的實際關係。',
    image: heroImage.id,
  },
})
