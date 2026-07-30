'use client'

import { useHeaderThemeOnScroll } from '@/hooks/useHeaderThemeOnScroll'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  const { setHeaderTheme } = useHeaderTheme()

  useHeaderThemeOnScroll(true)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  return null
}

export default PageClient
