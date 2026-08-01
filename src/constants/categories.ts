export const TOPIC_CATEGORY_DATA = [
  {
    title: '胰臟癌',
    description: '整理胰臟癌的風險因子、早期警訊、篩檢策略與治療追蹤，協助及早看見風險。',
  },
  {
    title: '胰臟癌篩檢',
    description: '整理胰臟癌高風險族群的篩檢策略、追蹤時機與早期攔截方法。',
  },
  {
    title: '胰臟健康',
    description: '飲食原則與生活型態，從日常守護胰臟。',
  },
  {
    title: '胰臟發炎',
    description: '說明急性與慢性胰臟炎的差異、誘發因素與日常管理，降低復發與併發症風險。',
  },
  {
    title: '胰臟水泡',
    description: '解析胰臟囊腫與水泡的常見類型、追蹤時機與哪些發現需要進一步評估。',
  },
] as const

export const TOPIC_CATEGORIES = TOPIC_CATEGORY_DATA.map((item) => item.title)

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number]

export const TOPIC_CATEGORIES_DESCRIPTION = TOPIC_CATEGORY_DATA.map((item) => item.title).join('、')

export function postsCategoryUrl(slug: string): string {
  return `/posts?category=${encodeURIComponent(slug)}`
}
