import { cn } from '@/utilities/ui'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type ReadMoreLinkProps = {
  children?: React.ReactNode
  className?: string
  href: string
  label?: string
}

export const ReadMoreLink: React.FC<ReadMoreLinkProps> = ({
  children,
  className,
  href,
  label = '閱讀更多',
}) => {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-brand-heading underline-offset-4 transition-colors hover:text-brand-cta hover:underline',
        className,
      )}
      href={href}
    >
      {children ?? label}
      <ArrowRight className="size-4" />
    </Link>
  )
}
