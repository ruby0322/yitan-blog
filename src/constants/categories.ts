export const TOPIC_CATEGORIES = [
  '基礎知識',
  '胰臟癌',
  '胰臟發炎',
  '胰臟水泡',
  '飲食保健',
  '健檢判讀',
] as const

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number]

export const TOPIC_CATEGORIES_DESCRIPTION =
  '基礎知識、胰臟癌、胰臟發炎、胰臟水泡、飲食保健與健檢判讀'

export function postsCategoryUrl(slug: string): string {
  return `/posts?category=${encodeURIComponent(slug)}`
}
