import * as React from 'react'
import { Url } from 'url'

import { ButtonLink, ButtonLinkProps } from './button-link'
import { MessageIcon } from './icons'

export const MAX_LIKED_BY_SHOWN = 50

type CommentButtonProps = {
  commentCount: number
  disabled?: boolean
  href?: Url | string
} & Omit<ButtonLinkProps, 'href'>

export function CommentButton({
  commentCount,
  disabled = false,
  href,
  ...buttonProps
}: CommentButtonProps) {
  if (disabled) {
    return (
      <div className="inline-flex items-center justify-center font-semibold px-3 h-8 text-xs sm:px-4 sm:text-sm sm:h-button">
        <MessageIcon className="w-4 h-4 text-secondary" />
        <span className="ml-1.5">{commentCount}</span>
      </div>
    )
  }
  return (
    <ButtonLink href={href || ''} {...buttonProps}>
      <MessageIcon className="w-4 h-4 text-secondary" />
      <span className="ml-1.5">{commentCount}</span>
    </ButtonLink>
  )
}
