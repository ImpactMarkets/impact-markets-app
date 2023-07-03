import * as React from 'react'

import { ButtonVariant } from '@/components/button'
import { classNames } from '@/lib/classnames'

export type IconButtonOwnProps = {
  variant?: ButtonVariant
}

type IconButtonProps = IconButtonOwnProps &
  React.ComponentPropsWithoutRef<'button'>

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = 'primary', type = 'button', ...rest },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        className={classNames(
          'inline-flex items-center justify-center flex-shrink-0 rounded-full h-button w-icon-button focus-ring',
          variant === 'primary' && 'text-primary bg-primary hover:opacity-80',
          variant === 'secondary' &&
            'border text-secondary border-secondary bg-secondary hover:opacity-80',
          className
        )}
      />
    )
  }
)

IconButton.displayName = 'IconButton'
