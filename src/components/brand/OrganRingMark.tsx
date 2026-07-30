import { cn } from '@/utilities/ui'
import React, { useId } from 'react'

type OrganRingMarkProps = {
  animated?: boolean
  className?: string
  height?: number | string
  /** Nav lockup — same visual language as hero, pixel-fixed strokes for ~20–32px. */
  variant?: 'default' | 'nav' | 'inverse'
  width?: number | string
  /** Counter-clockwise tilt in degrees. */
  tilt?: number
}

const NAV_STROKES = {
  orbit: 2,
  ring: 3.75,
} as const

export const OrganRingMark: React.FC<OrganRingMarkProps> = ({
  animated = false,
  className,
  height,
  variant = 'default',
  width,
  tilt = -30,
}) => {
  const uid = useId().replace(/:/g, '')
  const glowId = `organ-ring-glow-${uid}`
  const hotspotId = `organ-ring-hotspot-${uid}`
  const isNav = variant === 'nav'
  const isInverse = variant === 'inverse'
  const strokeColor = isInverse ? '#FAF8F5' : '#8DAA91'

  const sizeStyle =
    width !== undefined || height !== undefined
      ? { width, height: height ?? width }
      : undefined

  return (
    <svg
      aria-hidden
      className={cn(
        'block shrink-0',
        animated && 'organ-ring-mark--animated',
        className,
      )}
      fill="none"
      style={sizeStyle}
      viewBox="0 0 400 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {!isNav && !isInverse && (
          <filter height="200%" id={glowId} width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur" stdDeviation="8" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        <radialGradient cx="38%" cy="28%" id={hotspotId} r="50%">
          <stop
            offset="0%"
            stopColor={strokeColor}
            stopOpacity={isInverse ? 0.55 : isNav ? 0.82 : 0.55}
          />
          <stop
            offset="100%"
            stopColor={strokeColor}
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      <g transform={`rotate(${tilt} 200 240)`}>
        <ellipse cx="200" cy="240" fill={`url(#${hotspotId})`} rx="120" ry="160" />

        <ellipse
          cx="200"
          cy="240"
          opacity={isInverse ? 0.35 : isNav ? 0.45 : 0.2}
          rx="155"
          ry="195"
          stroke={strokeColor}
          strokeWidth={isNav || isInverse ? NAV_STROKES.orbit : 1}
          vectorEffect={isNav || isInverse ? 'nonScalingStroke' : undefined}
        />

        <ellipse
          cx="200"
          cy="240"
          filter={isNav || isInverse ? undefined : `url(#${glowId})`}
          opacity={isInverse ? 0.95 : isNav ? 1 : 0.85}
          rx="130"
          ry="175"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth={isNav || isInverse ? NAV_STROKES.ring : 2}
          vectorEffect={isNav || isInverse ? 'nonScalingStroke' : undefined}
        />

        <circle
          cx="148"
          cy="118"
          fill="#FAF8F5"
          opacity={isInverse ? 1 : 0.9}
          r={isNav || isInverse ? 5 : 3}
        />
        <circle
          cx="148"
          cy="118"
          fill={strokeColor}
          opacity={isInverse ? 0.85 : 0.6}
          r={isNav || isInverse ? 9 : 6}
        />
      </g>
    </svg>
  )
}
