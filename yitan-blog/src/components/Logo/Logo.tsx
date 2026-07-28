import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <span
      className={clsx(
        'font-semibold tracking-tight text-base md:text-lg whitespace-nowrap',
        className,
      )}
    >
      胰探究竟
    </span>
  )
}
