import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media } from '@/payload-types'
import { heading, link, paragraph, richTextRoot, text } from './lexical-helpers'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

const BRAND_INTRO =
  '歡迎來到「胰探究竟－章醫師的胰臟日常」。這裡以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，致力於傳遞正確、可信且容易理解的醫學資訊。希望幫助更多人認識胰臟、了解胰臟，進而守護自己與家人的胰臟健康。'

export const home = ({ heroImage, metaImage }: HomeArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'home',
  _status: 'published',
  title: '首頁',
  hero: {
    type: 'highImpact',
    media: heroImage.id,
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: '閱讀最新文章',
          url: '/posts',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: '認識章醫師',
          url: '/about',
        },
      },
    ],
    richText: richTextRoot(
      heading('h1', '胰探究竟－章醫師的胰臟日常'),
      paragraph(text(BRAND_INTRO)),
    ),
  },
  layout: [
    {
      blockType: 'content',
      blockName: 'Brand Intro',
      columns: [
        {
          size: 'full',
          richText: richTextRoot(
            heading('h2', '這裡提供什麼？'),
            paragraph(
              text('以一般讀者能理解的語言，整理胰臟相關的醫學重點，包含常見問題、迷思澄清，以及日常保健建議。'),
            ),
          ),
        },
        {
          size: 'oneThird',
          richText: richTextRoot(
            heading('h3', '可信資訊'),
            paragraph(text('內容以臨床經驗與醫學證據為基礎，避免誇大或誤導。')),
          ),
        },
        {
          size: 'oneThird',
          richText: richTextRoot(
            heading('h3', '易懂整理'),
            paragraph(text('把複雜概念轉成一般民眾也能理解的說明。')),
          ),
        },
        {
          size: 'oneThird',
          richText: richTextRoot(
            heading('h3', '持續更新'),
            paragraph(text('新文章會定期發布，歡迎常回來看看。')),
          ),
        },
      ],
    },
    {
      blockType: 'archive',
      blockName: 'Latest Posts',
      populateBy: 'collection',
      relationTo: 'posts',
      limit: 3,
      categories: [],
      introContent: richTextRoot(
        heading('h3', '最新文章'),
        paragraph(text('以下為最近發布的文章，點選標題即可閱讀全文。')),
      ),
    },
    {
      blockType: 'mediaBlock',
      blockName: 'Hero Image',
      media: metaImage.id,
    },
    {
      blockType: 'cta',
      blockName: 'Posts CTA',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: '查看全部文章',
            url: '/posts',
          },
        },
      ],
      richText: richTextRoot(
        heading('h3', '開始閱讀'),
        paragraph(link('前往部落格', '/posts')),
      ),
    },
  ],
  meta: {
    title: '胰探究竟－章醫師的胰臟日常',
    description: BRAND_INTRO,
    image: heroImage.id,
  },
})
