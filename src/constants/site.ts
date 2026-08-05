import { TOPIC_CATEGORIES } from '@/constants/categories'

export const SITE_NAME = '胰探究竟'
export const SITE_TAGLINE = '章醫師的胰臟日常'
export const SITE_FULL_NAME = '胰探究竟－章醫師的胰臟日常'
export const SITE_DESCRIPTION =
  '章明珠醫師（章醫師）的胰臟衛教網站「胰探究竟」，以近 30 年臨床經驗分享胰臟、胰臟癌、胰臟癌篩檢與日常照護的可信醫學資訊。'
export const SITE_AUTHOR = '章明珠醫師'
export const SITE_AUTHOR_ALIASES = ['章明珠', '章醫師'] as const
export const SITE_KEYWORDS = [
  '章明珠醫師',
  '章醫師',
  '胰臟',
  '胰臟癌',
  '胰臟癌篩檢',
  '胰探究竟',
  ...TOPIC_CATEGORIES,
] as const

export const DEFAULT_OG_PATH = '/og-default.png'
export const ICON_PATH = '/icon.png'
