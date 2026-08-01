export const TOPIC_CATEGORY_DATA = [
  {
    title: '基礎知識',
    description: '用白話方式介紹胰臟功能、常見症狀與就醫時機，建立對這個器官的基本理解。',
  },
  {
    title: '胰臟癌',
    description: '整理胰臟癌的風險因子、早期警訊、篩檢策略與治療追蹤，協助及早看見風險。',
  },
  {
    title: '胰臟發炎',
    description: '說明急性與慢性胰臟炎的差異、誘發因素與日常管理，降低復發與併發症風險。',
  },
  {
    title: '胰臟水泡',
    description: '解析胰臟囊腫與水泡的常見類型、追蹤時機與哪些發現需要進一步評估。',
  },
  {
    title: '飲食保健',
    description: '整理與代謝健康相關的飲食原則與生活型態，從日常選擇守護胰臟。',
  },
  {
    title: '健檢判讀',
    description: '協助理解影像與血液檢查結果，釐清哪些數值或報告用語需要追蹤。',
  },
  {
    title: '胰臟癌篩檢',
    description: '整理胰臟癌高風險族群的篩檢策略、追蹤時機與早期攔截方法。',
  },
  {
    title: '胰臟健康',
    description: '飲食原則與生活型態，從日常守護胰臟。',
  },
] as const

export const TOPIC_CATEGORIES = TOPIC_CATEGORY_DATA.map((item) => item.title)

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number]

export const TOPIC_CATEGORIES_DESCRIPTION =
  '基礎知識、胰臟癌、胰臟發炎、胰臟水泡、飲食保健與健檢判讀'

export function postsCategoryUrl(slug: string): string {
  return `/posts?category=${encodeURIComponent(slug)}`
}
