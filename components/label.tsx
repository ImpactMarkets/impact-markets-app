import * as React from 'react'

import { classNames } from '@/lib/classnames'

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'label'>
>(({ children, className, ...rest }, forwardedRef) => (
  <label
    className={classNames('block mb-2 text-sm', className)}
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </label>
))

Label.displayName = 'Label'
