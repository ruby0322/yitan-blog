export const TOPIC_CATEGORY_DATA = [
  {
    title: '胰臟水泡',
    sortOrder: 1,
    description:
      '發現胰臟水泡，不代表就是癌症。越來越多人因健檢發現胰臟囊腫。這裡帶您認識胰臟水泡、追蹤原則，以及哪些變化需要提高警覺，避免過度擔心，也不要錯過治療時機。',
  },
  {
    title: '胰臟發炎',
    sortOrder: 2,
    description:
      '胰臟發炎的背後，可能藏著不同的原因。帶您認識容易被忽略的重要胰臟疾病，及早發現可能增加胰臟癌風險的警訊。',
  },
  {
    title: '胰臟癌',
    sortOrder: 3,
    description:
      '了解胰臟癌，是戰勝它的第一步。從危險因子、早期症狀、到最新治療與精準醫療，希望透過完整而容易理解的內容，幫助更多人及早發現、及早治療，改變胰臟癌的結局。',
  },
  {
    title: '胰臟癌篩檢',
    sortOrder: 4,
    description:
      '真正重要的，不是找到腫瘤，而是在它出現之前找到蛛絲馬跡。胰臟癌篩檢不只是抽血或做影像，而是整合家族史、血液檢查與影像分析，找出那些容易被忽略的早期線索。',
  },
  {
    title: '胰臟健康',
    sortOrder: 5,
    description:
      '不是生病以後才照顧胰臟，而是從今天開始保護它。胰臟每天默默工作，卻往往等到出現問題才被注意。這裡整理飲食、生活型態、胰臟酵素等主題，希望幫助您從日常建立正確觀念，降低未來發炎與胰臟癌的風險。',
  },
] as const

export const TOPIC_CATEGORIES = TOPIC_CATEGORY_DATA.map((item) => item.title)

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number]

export const TOPIC_CATEGORIES_DESCRIPTION = TOPIC_CATEGORY_DATA.map((item) => item.title).join('、')

export function postsCategoryUrl(slug: string): string {
  return `/posts?category=${encodeURIComponent(slug)}`
}
