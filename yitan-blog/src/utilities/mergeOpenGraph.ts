import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const SITE_NAME = '胰探究竟－章醫師的胰臟日常'
const SITE_DESCRIPTION =
  '以臨床經驗結合最新醫學證據，分享真正重要的胰臟知識，破解迷思，傳遞正確且容易理解的醫學資訊。'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: SITE_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: SITE_NAME,
  title: SITE_NAME,
  locale: 'zh_TW',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
