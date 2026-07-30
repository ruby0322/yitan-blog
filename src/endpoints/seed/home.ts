import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type HomeArgs = {
  doctorImage: Media
  featuredPostIds: number[]
  metaImage: Media
}

const BRAND_INTRO =
  '歡迎來到「胰探究竟－章醫師的胰臟日常」。這裡以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，致力於傳遞正確、可信且容易理解的醫學資訊。希望幫助更多人認識胰臟、了解胰臟，進而守護自己與家人的胰臟健康。'

export const home = ({
  doctorImage,
  featuredPostIds,
  metaImage,
}: HomeArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'home',
  _status: 'published',
  title: '首頁',
  hero: {
    type: 'highImpact',
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
      heading('h1', '看懂胰臟，從理解開始。'),
      paragraph(
        text(
          '以可信的醫學寫作，陪您認識這個重要卻常被忽略的器官。本書與本站的每一篇文章，都致力於用清楚、專業的語言，讓胰臟健康不再遙不可及。',
        ),
      ),
    ),
  },
  layout: [
    {
      blockType: 'quoteBlock',
      blockName: 'Brand Quote',
      quote: '看懂胰臟，從理解開始。',
      attribution: '胰探究竟',
      sideText: richTextRoot(
        paragraph(
          text(
            '以一般讀者能理解的語言，整理胰臟相關的醫學重點，包含常見問題、迷思澄清，以及日常保健建議。',
          ),
        ),
        paragraph(
          text(
            '本書延伸自章醫師的臨床與衛教經驗，是理解胰臟的起點；本站則持續更新最新文章，供讀者深入閱讀。（客戶可替換文案）',
          ),
        ),
      ),
    },
    {
      blockType: 'featuredPostsBlock',
      blockName: 'Featured Posts',
      sectionNumber: '01',
      heading: '本期精選',
      posts: featuredPostIds,
    },
    {
      blockType: 'categoryNavBlock',
      blockName: 'Category Navigation',
      sectionNumber: '02',
      heading: '從這裡開始',
      items: [
        {
          number: '01',
          title: '症狀與警訊',
          link: {
            type: 'custom',
            label: '症狀與警訊',
            url: '/posts',
          },
        },
        {
          number: '02',
          title: '影像與檢查',
          link: {
            type: 'custom',
            label: '影像與檢查',
            url: '/posts',
          },
        },
        {
          number: '03',
          title: '常見疾病',
          link: {
            type: 'custom',
            label: '常見疾病',
            url: '/posts',
          },
        },
        {
          number: '04',
          title: '治療與追蹤',
          link: {
            type: 'custom',
            label: '治療與追蹤',
            url: '/posts',
          },
        },
      ],
    },
    {
      blockType: 'archive',
      blockName: 'Latest Posts',
      sectionNumber: '03',
      heading: '最新文章',
      populateBy: 'collection',
      relationTo: 'posts',
      limit: 6,
      categories: [],
      introContent: richTextRoot(
        paragraph(text('以下為最近發布的文章，點選標題即可閱讀全文。')),
      ),
    },
    {
      blockType: 'aboutTeaserBlock',
      blockName: 'About Teaser',
      sectionNumber: '04',
      heading: '認識章醫師',
      body: richTextRoot(
        paragraph(
          text(
            '章醫師長期專注於胰臟相關疾病的臨床與衛教，希望用清楚、可信的方式，幫助更多人認識這個重要卻常被忽略的器官。',
          ),
        ),
      ),
      image: doctorImage.id,
      link: {
        type: 'custom',
        label: '了解更多',
        url: '/about',
      },
    },
    {
      blockType: 'newsletterBlock',
      blockName: 'Newsletter',
      sectionNumber: '05',
      heading: '每月一封，陪您看懂胰臟。',
      description:
        '訂閱電子報，每月收到一篇精選胰臟保健重點、新文章摘要與書籍動態。不會過度寄送，隨時可取消訂閱。（客戶可替換文案）',
    },
  ],
  meta: {
    title: '胰探究竟－章醫師的胰臟日常',
    description: BRAND_INTRO,
    image: metaImage.id,
  },
})
