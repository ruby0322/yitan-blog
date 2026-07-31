'use client'

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { CategoryTopicSlide } from '@/blocks/CategoryNavBlock/types'
import { ReadMoreLink } from '@/components/theme'
import { Caption } from '@/components/theme/typography'
import { formatDateTime } from '@/utilities/formatDateTime'
import { cn } from '@/utilities/ui'

const AUTO_ADVANCE_MS = 2500

type Props = {
  slides: CategoryTopicSlide[]
}

export const CategoryNavCarousel: React.FC<Props> = ({ slides }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return

    const slide = container.children[index] as HTMLElement | undefined
    if (!slide) return

    container.scrollTo({
      left: slide.offsetLeft - container.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
    setActiveIndex(index)
  }, [prefersReducedMotion])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[]
      if (children.length === 0) return

      const scrollLeft = container.scrollLeft
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      children.forEach((child, index) => {
        const distance = Math.abs(child.offsetLeft - container.offsetLeft - scrollLeft)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [slides.length])

  useEffect(() => {
    if (prefersReducedMotion || isPaused || slides.length <= 1) return

    const intervalId = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length
      scrollToIndex(nextIndex)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(intervalId)
  }, [activeIndex, isPaused, prefersReducedMotion, scrollToIndex, slides.length])

  if (slides.length === 0) return null

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false)
        }
      }}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          aria-label="上一個主題"
          className="inline-flex size-9 items-center justify-center rounded-md border border-brand-sage/20 bg-brand-bg text-brand-sage transition-colors hover:border-brand-sage hover:bg-brand-hover disabled:opacity-40"
          disabled={slides.length <= 1}
          onClick={() => scrollToIndex((activeIndex - 1 + slides.length) % slides.length)}
          type="button"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          aria-label="下一個主題"
          className="inline-flex size-9 items-center justify-center rounded-md border border-brand-sage/20 bg-brand-bg text-brand-sage transition-colors hover:border-brand-sage hover:bg-brand-hover disabled:opacity-40"
          disabled={slides.length <= 1}
          onClick={() => scrollToIndex((activeIndex + 1) % slides.length)}
          type="button"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        {slides.map((slide) => (
          <article
            className="w-[88vw] shrink-0 snap-center rounded-md border border-brand-sage/20 bg-brand-bg p-6 sm:w-[420px] lg:w-[460px]"
            key={slide.href}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-xl font-semibold tracking-wide text-brand-heading">
                {slide.title}
              </h3>
              <Link
                aria-label={`查看${slide.title}主題`}
                className="inline-flex shrink-0 text-brand-sage transition-transform hover:-translate-y-0.5 hover:translate-x-0.5"
                href={slide.href}
              >
                <ArrowUpRight className="size-5" />
              </Link>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-brand-body">{slide.description}</p>

            <div className="mt-5 border-t border-brand-sage/15 pt-4">
              {slide.posts.length > 0 ? (
                <ul className="space-y-3">
                  {slide.posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        className="group block rounded-sm transition-colors hover:text-brand-cta"
                        href={`/posts/${post.slug}`}
                      >
                        <span className="block font-sans text-sm leading-snug text-brand-heading group-hover:underline">
                          {post.title}
                        </span>
                        {post.publishedAt ? (
                          <Caption className="mt-1 block">{formatDateTime(post.publishedAt)}</Caption>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-brand-body">此主題尚無文章，請稍後再來看看。</p>
              )}
            </div>

            <div className="mt-5">
              <ReadMoreLink href={slide.href} label="查看此主題" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            aria-label={`前往${slide.title}`}
            className={cn(
              'size-2 rounded-full transition-colors',
              index === activeIndex ? 'bg-brand-sage' : 'bg-brand-sage/25 hover:bg-brand-sage/50',
            )}
            key={slide.href}
            onClick={() => scrollToIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
