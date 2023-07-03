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
        'p-3 font-semibold leading-snug border rounded bg-yellow-50 border-yellow-200',
        className
      )}
    >
      {children}
    </div>
  )
}
