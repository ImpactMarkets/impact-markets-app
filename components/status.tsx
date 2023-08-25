import * as React from 'react'

import { classNames } from '@/lib/classnames'

interface StatusProps {
  color: string
  status: string
}

export const Status: React.FC<StatusProps> = ({ color, status }) => {
  return (
    <div
      className={classNames(
        'border text-sm text-center text-highlight border-secondary font-bold px-2 py-1 mt-1 rounded-lg',
        color,
      )}
    >
      {status}
    </div>
  )
}
