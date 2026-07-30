'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { themeLocalStorageKey } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((_themeToSet: Theme | null) => {
    // Brand spec: site is always light; inverse is section-scoped only.
    document.documentElement.setAttribute('data-theme', 'light')
    setThemeState('light')
    window.localStorage.removeItem(themeLocalStorageKey)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    setThemeState('light')
    window.localStorage.removeItem(themeLocalStorageKey)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
