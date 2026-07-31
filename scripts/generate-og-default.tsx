import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ImageResponse } from 'next/og'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_NAME = '胰探究竟'
const SITE_TAGLINE = '章醫師的胰臟日常'
const LOCKUP_SCALE = 1.3
const ICON_BOX_SIZE = Math.round(280 * LOCKUP_SCALE)
const LOCKUP_GAP = Math.round(72 * LOCKUP_SCALE)
const TITLE_SIZE = Math.round(64 * LOCKUP_SCALE)
const TAGLINE_SIZE = Math.round(32 * LOCKUP_SCALE)
const TEXT_GAP = Math.round(12 * LOCKUP_SCALE)

const [iconRaw, serifFont, sansFont] = await Promise.all([
  readFile(join(root, 'public/icon.png')),
  readFile(
    join(
      root,
      'node_modules/@fontsource/noto-serif-tc/files/noto-serif-tc-chinese-traditional-600-normal.woff',
    ),
  ),
  readFile(
    join(
      root,
      'node_modules/@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff',
    ),
  ),
])

const trimmedIcon = await sharp(iconRaw).trim().png().toBuffer()
const { width: iconWidth, height: iconHeight } = await sharp(trimmedIcon).metadata()
const { width: canvasSize = ICON_BOX_SIZE } = await sharp(iconRaw).metadata()
// Match visual logo size from the original 280×280 untrimmed box (scale = box / source canvas).
const iconScale = ICON_BOX_SIZE / canvasSize
const iconDisplayHeight = Math.round(iconHeight! * iconScale)
const iconDisplayWidth = Math.round(iconWidth! * iconScale)
const iconSrc = `data:image/png;base64,${trimmedIcon.toString('base64')}`

const response = new ImageResponse(
  (
    <div
      style={{
        alignItems: 'center',
        background: '#FAF8F5',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ flexBasis: 0, flexGrow: 1 }} />
      <div style={{ alignItems: 'center', display: 'flex', gap: LOCKUP_GAP }}>
        <img
          alt=""
          height={iconDisplayHeight}
          src={iconSrc}
          style={{ objectFit: 'contain' }}
          width={iconDisplayWidth}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: TEXT_GAP }}>
          <div
            style={{
              color: '#4A5248',
              fontFamily: 'Noto Serif TC',
              fontSize: TITLE_SIZE,
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
              fontSize: TAGLINE_SIZE,
              letterSpacing: '0.05em',
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
      <div style={{ flexBasis: 0, flexGrow: 1 }} />
    </div>
  ),
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Noto Serif TC', data: serifFont, style: 'normal', weight: 600 },
      { name: 'Noto Sans TC', data: sansFont, style: 'normal', weight: 400 },
    ],
  },
)

const buffer = Buffer.from(await response.arrayBuffer())
await writeFile(join(root, 'public/og-default.png'), buffer)
console.log('Generated public/og-default.png')
