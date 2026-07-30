'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useEffect } from 'react'

const HEADER_OFFSET = '64px'

export function useHeaderThemeOnScroll(enabled: boolean): void {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    if (!enabled) return

    const sentinels = Array.from(document.querySelectorAll('[data-header-theme="dark"]'))
    if (sentinels.length === 0) {
      setHeaderTheme('light')
      return
    }

    const visibleSentinels = new Set<Element>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSentinels.add(entry.target)
          } else {
            visibleSentinels.delete(entry.target)
          }
        })
        setHeaderTheme(visibleSentinels.size > 0 ? 'dark' : 'light')
      },
      {
        rootMargin: `-${HEADER_OFFSET} 0px 0px 0px`,
        threshold: 0,
      },
    )

    sentinels.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [enabled, setHeaderTheme])
}
