import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

type HomeArgs = {
  bookFlatImage: Media
  doctorImage: Media
  featuredPostIds: number[]
  metaImage: Media
}

const BRAND_INTRO =
  '歡迎來到「胰探究竟－章醫師的胰臟日常」。這裡以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，致力於傳遞正確、可信且容易理解的醫學資訊。希望幫助更多人認識胰臟、了解胰臟，進而守護自己與家人的胰臟健康。'

export const home = ({
  bookFlatImage,
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
      blockType: 'aboutTeaserBlock',
      blockName: 'About Teaser',
      sectionNumber: '03',
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
      blockType: 'bookSalesBlock',
      blockName: 'Book Sales',
      sectionNumber: '04',
      heading: '攔截胰臟癌',
      bookSubtitle: '破解癌王無聲警報，及早攔截沉默殺手',
      description:
        '定期健檢正常，為何仍得胰臟癌？台灣胰臟癌篩檢權威章明珠醫師，以 25 年臨床數據揭開「零期攔截」的防禦地圖。從被動等待到主動管理，讓胰臟癌風險不再只是命運。',
      highlightLine: '五年存活率從不到 10% 翻轉至 98%！',
      authorLine: '章明珠醫師 著',
      coverImage: bookFlatImage.id,
      buyLink: {
        type: 'custom',
        label: '前往博客來選購',
        url: 'https://www.books.com.tw/',
        newTab: true,
      },
    },
  ],
  meta: {
    title: '胰探究竟－章醫師的胰臟日常',
    description: BRAND_INTRO,
    image: metaImage.id,
  },
})
