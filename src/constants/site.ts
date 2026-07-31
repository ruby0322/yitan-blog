import { TOPIC_CATEGORIES } from '@/constants/categories'

export const SITE_NAME = '胰探究竟'
export const SITE_TAGLINE = '章醫師的胰臟日常'
export const SITE_FULL_NAME = '胰探究竟－章醫師的胰臟日常'
export const SITE_DESCRIPTION =
  '以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，傳遞正確且容易理解的醫學資訊。'
export const SITE_AUTHOR = '章明珠醫師'
export const SITE_KEYWORDS = [
  '胰臟',
  '胰臟癌',
  '胰臟發炎',
  '胰臟水泡',
  '飲食保健',
  '健檢判讀',
  '章醫師',
  '胰探究竟',
  ...TOPIC_CATEGORIES,
] as const

export const DEFAULT_OG_PATH = '/og-default.png'
export const ICON_PATH = '/icon.png'
