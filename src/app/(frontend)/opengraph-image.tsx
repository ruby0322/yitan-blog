import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { SITE_NAME, SITE_TAGLINE } from '@/constants/site'

export const alt = `${SITE_NAME}－${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [iconData, serifFont, sansFont] = await Promise.all([
    readFile(join(process.cwd(), 'public/icon.png')),
    readFile(
      join(
        process.cwd(),
        'node_modules/@fontsource/noto-serif-tc/files/noto-serif-tc-chinese-traditional-600-normal.woff',
      ),
    ),
    readFile(
      join(
        process.cwd(),
        'node_modules/@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff',
      ),
    ),
  ])

  const iconSrc = `data:image/png;base64,${iconData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#FAF8F5',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          gap: 48,
          padding: 80,
          width: '100%',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" height={280} src={iconSrc} style={{ objectFit: 'contain' }} width={280} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              color: '#4A5248',
              fontFamily: 'Noto Serif TC',
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              color: '#8DAA91',
              fontFamily: 'Noto Sans TC',
              fontSize: 32,
              letterSpacing: '0.05em',
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Serif TC', data: serifFont, style: 'normal', weight: 600 },
        { name: 'Noto Sans TC', data: sansFont, style: 'normal', weight: 400 },
      ],
    },
  )
}
