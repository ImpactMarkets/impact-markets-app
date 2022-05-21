import { classNames } from '@/lib/classnames'
import * as React from 'react'

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'label'>
>(({ children, className, ...rest }, forwardedRef) => (
  <label className={classNames('block mb-2 text-sm', className)} {...rest}>
    {children}
  </label>
))

Label.displayName = 'Label'
