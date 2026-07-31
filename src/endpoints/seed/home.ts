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
          '以近 30 年胰臟臨床診療與研究經驗，陪您認識這個重要卻經常被忽略的器官。',
        ),
      ),
      paragraph(
        text(
          '將艱深的醫學知識，化為清楚、容易理解的內容，幫助您更早辨識風險，做出更安心的健康決策。',
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
            '歡迎來到「胰探究竟－章醫師的胰臟日常」。這裡以臨床經驗結合最新醫學證據，把真正重要的胰臟知識說清楚，破解迷思，傳遞正確而容易理解的資訊，希望幫助更多人認識這個器官，進而守護自己與家人的健康。',
          ),
        ),
        paragraph(
          text(
            '章醫師的著作從最常被忽略的胰臟說起，整理症狀警訊、影像檢查與日常保健之間，那些真正值得留意的細節；本站則延伸這份理解，持續更新您可能還來不及問出口的問題。',
          ),
        ),
        paragraph(
          text(
            '但有一件事，許多人在健檢一切正常之後，才開始真正感到不安——關於這個「沉默的殺手」，還有一些關鍵，值得您親自往下讀。',
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
      doctorName: '章明珠',
      credentialsLine: '台大醫學院臨床副教授 · 台大醫院內科部消化系主治醫師',
      body: richTextRoot(
        paragraph(
          text(
            '長年投入胰臟癌診斷、治療與臨床研究，發表胰臟相關論文 48 篇；與中研院合作超過十餘年，團隊早期篩檢工具成果於 2026 年發表於 Nature Communications。',
          ),
        ),
        paragraph(
          text(
            '她是台灣發現最多零期胰臟癌的臨床醫師之一，病患遠從美國、英國、日本、新加坡前來就診；並與丈夫張毓廷醫師建立台灣最大規模的胰臟疾病生物資料庫，持續推動胰臟癌照護與研究。',
          ),
        ),
      ),
      highlightLine: '看懂你的風險，拿回胰臟健康的掌控權——別讓最安靜的器官，成為健康最大的遺憾。',
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
        '定期健檢正常，為何仍得胰臟癌？台灣胰臟癌篩檢權威章明珠醫師，用近30年臨床經驗，25年研究數據「零期攔截」的防禦地圖。從被動等待到主動管理，讓胰臟癌風險不再只是命運。',
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
