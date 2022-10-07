import * as React from 'react'

import { classNames } from '@/lib/classnames'

export const Heading2 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h2'>
>(({ children, className, ...rest }, forwardedRef) => (
  <h2
    className={classNames('font-display text-2xl md:text-3xl', className)}
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </h2>
))

Heading2.displayName = 'Heading2'
