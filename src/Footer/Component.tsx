import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-[#0f3d4c] text-white">
      <div className="container py-10 gap-8 flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <Link className="flex items-center" href="/">
            <Logo className="text-white text-xl" />
          </Link>

          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white/90 hover:text-white" key={i} {...link} />
            })}
          </nav>
        </div>

        <div className="border-t border-white/15 pt-6 text-sm text-white/75 space-y-2">
          <p>© {new Date().getFullYear()} 胰探究竟－章醫師的胰臟日常</p>
          <p>
            本網站資訊僅供衛教參考，不能取代醫師面對面的診斷與治療建議。若有身體不適，請盡快就醫。
          </p>
        </div>
      </div>
    </footer>
  )
}
