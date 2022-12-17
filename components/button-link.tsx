import Link, { LinkProps } from 'next/link'
import * as React from 'react'

import { ButtonVariant, buttonClasses } from '@/components/button'

export type ButtonLinkProps = {
  variant?: ButtonVariant
  responsive?: boolean
  disabled?: boolean
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> &
  LinkProps

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      className,
      responsive,
      onClick,
      children,
      variant = 'primary',
      disabled = false,
    },
    forwardedRef
  ) => {
    if (disabled) {
      return (
        <span
          className={buttonClasses({
            className,
            variant,
            responsive,
            disabled,
          })}
        >
          {children}
        </span>
      )
    }
    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
      >
        <span
          onClick={onClick}
          ref={forwardedRef}
          className={buttonClasses({
            className,
            variant,
            responsive,
          })}
        >
          {children}
        </span>
      </Link>
    )
  }
)

ButtonLink.displayName = 'ButtonLink'
