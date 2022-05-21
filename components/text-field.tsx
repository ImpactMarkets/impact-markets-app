import { classNames } from '@/lib/classnames'
import * as React from 'react'
import { Label } from './label'

export type TextFieldOwnProps = {
  label?: string | React.ReactElement
}

type TextFieldProps = TextFieldOwnProps &
  React.ComponentPropsWithoutRef<'input'>

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, name, type = 'text', className, ...rest }, forwardedRef) => {
    return (
      <div className="mt-6">
        {label && (
          <Label htmlFor={id || name} className="block mb-2 text-s">
            {label}
          </Label>
        )}
        <input
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          type={type}
          className={classNames(
            'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring',
            className
          )}
        />
      </div>
    )
  }
)

TextField.displayName = 'TextField'
