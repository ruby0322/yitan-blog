import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { heroRichTextClassName } from '@/components/theme'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      variant?: 'default' | 'article'
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
      variant?: 'default' | 'article'
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, variant = 'default' }) => {
  if (variant === 'article') {
    return (
      <header className="border-b border-brand-border bg-brand-warm-white pt-8 md:pt-12">
        <div className="container">
          <div className="mx-auto w-full max-w-[48rem] pb-8">
            {children ||
              (richText && (
                <RichText
                  className={heroRichTextClassName}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              ))}
          </div>
        </div>
      </header>
    )
  }

  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
