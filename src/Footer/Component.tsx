import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Section } from '@/components/theme/section'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <Section
      as="footer"
      className="mt-auto border-t border-brand-inverse-border"
      data-header-theme="dark"
      spacing="none"
      variant="inverse"
    >
      <div className="container flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <Link className="flex items-center" href="/">
            <Logo className="text-xl text-brand-inverse-fg" />
          </Link>

          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-brand-inverse-fg/90 hover:text-brand-inverse-fg"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>

        <div className="space-y-2 border-t border-brand-inverse-fg/15 pt-6 text-sm text-brand-inverse-fg/75">
          <p>© {new Date().getFullYear()} 胰探究竟－章醫師的胰臟日常</p>
          <p>
            本網站資訊僅供衛教參考，不能取代醫師面對面的診斷與治療建議。若有身體不適，請盡快就醫。
          </p>
        </div>
      </div>
    </Section>
  )
}
