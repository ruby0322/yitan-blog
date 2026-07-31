import type { Metadata } from 'next'

import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { StructuredData } from '@/components/StructuredData'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import {
  ICON_PATH,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_FULL_NAME,
  SITE_KEYWORDS,
} from '@/constants/site'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph, mergeTwitter } from '@/utilities/mergeOpenGraph'
import { getSiteStructuredData } from '@/utilities/structuredData'
import { draftMode } from 'next/headers'

import './globals.css'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/500.css'
import '@fontsource/noto-sans-tc/700.css'
import '@fontsource/noto-serif-tc/400.css'
import '@fontsource/noto-serif-tc/600.css'
import '@fontsource/noto-serif-tc/700.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <InitTheme />
        <StructuredData data={getSiteStructuredData()} />
      </head>
      <body className="font-sans">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: SITE_FULL_NAME,
    template: '%s | 胰探究竟',
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_FULL_NAME,
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: ICON_PATH, sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: mergeOpenGraph(),
  twitter: mergeTwitter({ title: SITE_FULL_NAME, description: SITE_DESCRIPTION }),
}
