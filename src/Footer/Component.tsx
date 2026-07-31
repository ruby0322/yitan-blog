import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Section } from '@/components/theme/section'
import { LEGAL } from '@/content/legal'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const linkGroups = footerData?.linkGroups || []

  return (
    <Section
      as="footer"
      className="mt-auto border-t border-brand-inverse-border"
      data-header-theme="dark"
      spacing="none"
      variant="inverse"
    >
      <div className="container flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <Link className="flex shrink-0 items-start" href="/">
            <Logo size="lg" variant="inverse" />
          </Link>

          {linkGroups.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:ml-auto lg:grid-cols-3 lg:gap-x-10 xl:gap-x-12">
              {linkGroups.map(({ id, items, label }, groupIndex) => (
                <nav aria-label={label || undefined} key={id || groupIndex}>
                  {label ? (
                    <p className="mb-3 font-sans text-xs tracking-[0.2em] text-brand-inverse-fg/55 uppercase">
                      {label}
                    </p>
                  ) : null}
                  <ul className="flex flex-col gap-2.5">
                    {(items || []).map(({ id: itemId, link }, itemIndex) => (
                      <li key={itemId || itemIndex}>
                        <CMSLink
                          className="text-sm text-brand-inverse-fg/85 underline decoration-brand-inverse-fg/35 underline-offset-[0.25em] transition-[color,text-decoration-color] hover:text-brand-inverse-fg hover:decoration-brand-inverse-fg/70"
                          {...link}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-2 border-t border-brand-inverse-fg/15 pt-6 text-sm text-brand-inverse-fg/75">
          <p>{LEGAL.footerShort.copyright}</p>
          <p>
            {LEGAL.footerShort.usage}
            {' '}
            <Link
              className="underline decoration-brand-inverse-fg/35 underline-offset-[0.25em] transition-[color,text-decoration-color] hover:text-brand-inverse-fg hover:decoration-brand-inverse-fg/70"
              href="/terms"
            >
              詳見著作權與使用條款
            </Link>
            。
          </p>
        </div>
      </div>
    </Section>
  )
}
