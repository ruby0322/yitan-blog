import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type PostArgs = {
  author: User
  category: Category
  heroImage: Media
  publishedAt: string
}

export const post1 = ({
  heroImage,
  author,
  category,
  publishedAt,
}: PostArgs): RequiredDataFromCollectionSlug<'posts'> => ({
  _status: 'published',
  title: '認識胰臟：它到底在做什麼？',
  slug: 'what-does-the-pancreas-do',
  heroImage: heroImage.id,
  authors: [author.id],
  categories: [category.id],
  publishedAt,
  content: richTextRoot(
    heading('h2', '胰臟是什麼？'),
    paragraph(
      text('胰臟是位於上腹部、靠近胃後方的一個器官，雖然體積不大，卻同時具有內分泌與外分泌功能，對血糖調節與消化都非常重要。'),
    ),
    heading('h2', '兩大功能'),
    paragraph(text('內分泌：分泌胰島素等荷爾蒙，協助調控血糖。')),
    paragraph(text('外分泌：分泌消化酵素，幫助分解蛋白質、脂肪與碳水化合物。')),
    heading('h2', '什麼時候該提高警覺？'),
    paragraph(
      text('若出現持續上腹痛、明顯體重變化、血糖突然惡化或黃疸等症狀，應盡早就醫評估，不要自行網路診斷。'),
    ),
    heading('h2', '給一般讀者的提醒'),
    paragraph(
      text('了解胰臟功能的目的，不是讓自己過度焦慮，而是能在出現警訊時及早尋求專業協助，並建立更穩定的日常保健習慣。'),
    ),
  ),
  meta: {
    title: '認識胰臟：它到底在做什麼？ | 胰探究竟',
    description: '用易懂的方式介紹胰臟的基本功能，以及何時該提高警覺。',
    image: heroImage.id,
  },
})
