'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useDebounce } from '@/utilities/useDebounce'

const DEFAULT_DELAY = 350

type UseImeSafeDebouncedSearchArgs = {
  delay?: number
  externalValue?: string
  onDebouncedChange?: (value: string) => void
}

export function useImeSafeDebouncedSearch({
  delay = DEFAULT_DELAY,
  externalValue = '',
  onDebouncedChange,
}: UseImeSafeDebouncedSearchArgs = {}) {
  const [value, setValue] = useState(externalValue)
  const isComposingRef = useRef(false)
  const debouncedValue = useDebounce(value, delay)

  // Sync when the parent value changes (e.g. URL ?q=), not on input blur.
  useEffect(() => {
    if (isComposingRef.current) return
    setValue(externalValue)
  }, [externalValue])

  const isFirstRunRef = useRef(true)

  useEffect(() => {
    if (isComposingRef.current) return

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      return
    }

    onDebouncedChange?.(debouncedValue)
  }, [debouncedValue, onDebouncedChange])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
  }, [])

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false
      const nextValue = event.currentTarget.value
      setValue(nextValue)
      onDebouncedChange?.(nextValue)
    },
    [onDebouncedChange],
  )

  const inputProps = {
    onChange: handleChange,
    onCompositionEnd: handleCompositionEnd,
    onCompositionStart: handleCompositionStart,
    value,
  }

  return {
    debouncedValue,
    inputProps,
    isComposing: isComposingRef,
    setValue,
    value,
  }
}
