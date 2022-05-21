import { classNames } from '@/lib/classnames'
import * as React from 'react'

export const Heading2 = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'h2'>
>(({ children, className, ...rest }, forwardedRef) => (
  <h2
    className={classNames('font-display text-2xl md:text-3xl', className)}
    {...rest}
  >
    {children}
  </h2>
))

Heading2.displayName = 'Heading2'
