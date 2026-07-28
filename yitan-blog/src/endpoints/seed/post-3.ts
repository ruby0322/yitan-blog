import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type PostArgs = {
  author: User
  category: Category
  heroImage: Media
  publishedAt: string
}

export const post3 = ({
  heroImage,
  author,
  category,
  publishedAt,
}: PostArgs): RequiredDataFromCollectionSlug<'posts'> => ({
  _status: 'published',
  title: '日常保健：哪些生活習慣與胰臟健康有關？',
  slug: 'daily-habits-for-pancreas-health',
  heroImage: heroImage.id,
  authors: [author.id],
  categories: [category.id],
  publishedAt,
  content: richTextRoot(
    heading('h2', '從生活型態開始'),
    paragraph(
      text('與胰臟健康相關的生活習慣，往往和整體代謝健康高度重疊，包括飲食、運動、睡眠與壓力管理。'),
    ),
    heading('h2', '可以優先留意的方向'),
    paragraph(text('維持健康體重、避免長期大量飲酒、規律運動，以及減少長期高油高糖飲食。')),
    heading('h2', '需要個別化建議時'),
    paragraph(
      text('若您已有慢性病史或家族風險，建議與醫師討論個人化追蹤方式，而不是只靠網路文章自行調整。'),
    ),
    heading('h2', '建立可持續的小習慣'),
    paragraph(
      text('與其追求一次到位的完美計畫，不如從固定睡眠時間、每週規律活動與減少宵夜開始，讓健康行為更容易長期維持。'),
    ),
  ),
  meta: {
    title: '日常保健：哪些生活習慣與胰臟健康有關？ | 胰探究竟',
    description: '整理與胰臟健康相關的日常保健方向，提供一般讀者參考。',
    image: heroImage.id,
  },
})
