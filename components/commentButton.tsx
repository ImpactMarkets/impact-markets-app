import * as React from 'react'
import { Url } from 'url'

import { Tooltip } from '@/lib/mantine'

import { ButtonLink, ButtonLinkProps } from './buttonLink'
import { MessageIcon } from './icons'

export const MAX_LIKED_BY_SHOWN = 50

type CommentButtonProps = {
  commentCount: number
  disabled?: boolean
  label?: [string, string]
  href?: Url | string
} & Omit<ButtonLinkProps, 'href'>

export function CommentButton({
  commentCount,
  disabled = false,
  label = ['comment', 'comments'],
  href,
  ...buttonProps
}: CommentButtonProps) {
  const fullLabel = commentCount === 1 ? label[0] : label[1]
  if (disabled) {
    return (
      <Tooltip label={`${commentCount} ${fullLabel}`}>
        <div className="inline-flex items-center justify-center font-semibold px-3 h-8 text-xs sm:px-4 sm:text-sm sm:h-button">
          <MessageIcon className="w-4 h-4 text-secondary" />
          <span className="ml-1.5">{commentCount}</span>
        </div>
      </Tooltip>
    )
  }
  return (
    <ButtonLink href={href || ''} {...buttonProps}>
      <MessageIcon className="w-4 h-4 text-secondary" />
      <span className="ml-1.5">{commentCount}</span>
      <span className="font-light pl-1.5">{fullLabel}</span>
    </ButtonLink>
  )
}
