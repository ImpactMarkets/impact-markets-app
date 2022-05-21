import { classNames } from '@/lib/classnames'
import * as React from 'react'

export const Heading1 = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'h1'>
>(({ children, className, ...rest }, forwardedRef) => (
  <h1
    className={classNames('font-display text-3xl md:text-4xl', className)}
    {...rest}
  >
    {children}
  </h1>
))

Heading1.displayName = 'Heading1'
