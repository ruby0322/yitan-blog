import { cn } from '@/utilities/ui'

/** Default section prose — matches theme preview typography tokens */
export const themeRichTextClassName = cn(
  'prose max-w-none md:prose-md',
  'prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-brand-heading',
  'prose-h2:text-2xl prose-h2:md:text-3xl',
  'prose-p:font-sans prose-p:text-brand-body prose-p:leading-loose prose-p:tracking-wide',
)

/** Article body on /posts/[slug] — aligns with spec.md §三 and spec-client type-live-body */
export const postPageProseClassName = cn(
  'post-page-prose',
  themeRichTextClassName,
  'prose-p:text-base prose-p:leading-[1.9] prose-p:tracking-wide',
  'md:prose-p:text-base md:prose-p:leading-loose',
  'prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl',
  'prose-li:font-sans prose-li:text-brand-body prose-li:leading-[1.9] prose-li:tracking-wide',
  'prose-ul:my-6 prose-ol:my-6',
  'prose-strong:font-sans prose-strong:font-bold prose-strong:text-brand-subtitle',
  'prose-a:font-sans prose-a:text-brand-heading prose-a:underline prose-a:decoration-brand-border prose-a:underline-offset-[0.25em]',
  'prose-a:transition-[color,text-decoration-color] hover:prose-a:decoration-brand-sage',
)

/** About page body — post typography without h2 sage bars */
export const aboutPageProseClassName = cn(
  postPageProseClassName,
  'about-page-prose',
)

export const legalPageProseClassName = cn(
  themeRichTextClassName,
  'prose-h1:mb-4 prose-h1:md:mb-6',
  'prose-a:font-sans prose-a:text-brand-heading prose-a:underline prose-a:decoration-brand-border prose-a:underline-offset-[0.25em]',
  'prose-a:transition-[color,text-decoration-color] hover:prose-a:decoration-brand-sage',
)
export const heroRichTextClassName = cn(
  'prose max-w-none',
  'prose-headings:font-serif prose-headings:font-semibold prose-headings:text-brand-heading',
  'prose-headings:text-balance',
  'prose-h1:mb-3 prose-h1:text-[1.625rem] prose-h1:leading-[1.35] prose-h1:tracking-wide',
  'sm:prose-h1:mb-4 sm:prose-h1:text-4xl sm:prose-h1:leading-tight sm:prose-h1:tracking-wide',
  'lg:prose-h1:text-[2.75rem] lg:prose-h1:leading-[1.15]',
  'prose-p:mx-auto prose-p:max-w-prose prose-p:font-sans prose-p:text-[0.9375rem] prose-p:leading-[1.75] prose-p:tracking-normal prose-p:text-brand-body',
  'sm:prose-p:mx-0 sm:prose-p:text-base sm:prose-p:leading-loose sm:prose-p:tracking-wide',
)

/** Inverse section prose — hero copy on deep green */
export const inverseRichTextClassName = cn(
  'prose max-w-none md:prose-md',
  'prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-brand-inverse-fg',
  'prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:mb-4',
  'prose-p:font-sans prose-p:text-brand-inverse-fg/90 prose-p:leading-loose prose-p:tracking-wide',
)
