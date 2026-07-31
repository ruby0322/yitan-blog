'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type SearchOverlayShellProps = {
  children: React.ReactNode
  onClose: () => void
  open: boolean
}

export const SearchOverlayShell: React.FC<SearchOverlayShellProps> = ({
  children,
  onClose,
  open,
}) => {
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (panel.contains(event.target as Node)) return
      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [onClose, open])

  if (!open || !mounted) return null

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100000] isolate"
      role="dialog"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/50" />

      <div className="pointer-events-none absolute inset-x-0 top-[15vh] flex justify-center px-4">
        <div
          ref={panelRef}
          className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-xl border border-brand-border bg-brand-warm-white shadow-2xl"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
