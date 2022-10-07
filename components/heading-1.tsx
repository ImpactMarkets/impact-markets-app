import * as React from 'react'

import { classNames } from '@/lib/classnames'

export const Heading1 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h1'>
>(({ children, className, ...rest }, forwardedRef) => (
  <h1
    className={classNames('font-display text-3xl md:text-4xl', className)}
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </h1>
))

Heading1.displayName = 'Heading1'
