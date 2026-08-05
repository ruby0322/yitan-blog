import type { RequiredDataFromCollectionSlug } from 'payload'

import { HOME_SEO } from '@/constants/seo'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

const BRAND_INTRO = HOME_SEO.description

export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  title: '首頁',
  hero: {
    type: 'lowImpact',
    richText: richTextRoot(
      heading('h1', '胰探究竟－章醫師的胰臟日常'),
      paragraph(text(BRAND_INTRO)),
    ),
  },
  meta: {
    description: BRAND_INTRO,
    title: HOME_SEO.title,
  },
  layout: [],
}
