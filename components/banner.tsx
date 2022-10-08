import * as React from 'react'

import { classNames } from '@/lib/classnames'

type BannerProps = {
  children: React.ReactNode
  className?: string
}

export function Banner({ children, className }: BannerProps) {
  return (
    <div
      className={classNames(
        'p-6 font-semibold leading-snug border rounded bg-yellow-light border-yellow-light',
        className
      )}
    >
      {children}
    </div>
  )
}
