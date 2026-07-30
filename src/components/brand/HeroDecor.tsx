'use client'

import React from 'react'

import { cn } from '@/utilities/ui'

type HeroDecorProps = {
  className?: string
}

export const HeroDecor: React.FC<HeroDecorProps> = ({ className }) => {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* Editorial diagonal lines */}
      <svg
        className="absolute -right-8 top-0 h-full w-1/2 opacity-[0.12]"
        preserveAspectRatio="none"
        viewBox="0 0 200 600"
      >
        <line stroke="#8DAA91" strokeWidth="0.5" x1="40" x2="160" y1="0" y2="600" />
        <line stroke="#8DAA91" strokeWidth="0.5" x1="80" x2="200" y1="0" y2="600" />
      </svg>

      {/* Grain overlay */}
      <div className="hero-grain absolute inset-0 opacity-[0.05]" />
    </div>
  )
}
