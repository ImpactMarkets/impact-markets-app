import * as React from 'react'

import { Textarea, TextareaProps } from '@mantine/core'

import { Label } from './label'

export type LargeTextFieldOwnProps = {
  label?: string
}

type LargeTextFieldProps = LargeTextFieldOwnProps &
  TextareaProps &
  React.ComponentPropsWithoutRef<'textarea'>

export const LargeTextField = React.forwardRef<
  HTMLTextAreaElement,
  LargeTextFieldProps
>(({ label, id, name, classNames, ...rest }, forwardedRef) => {
  return (
    <div>
      {label && (
        <Label htmlFor={id || name} className="block text-s">
          {label}
        </Label>
      )}
      <Textarea
        {...rest}
        ref={forwardedRef}
        id={id || name}
        name={name}
        classNames={{
          input:
            'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring text-base',
          ...classNames,
        }}
      />
    </div>
  )
})

LargeTextField.displayName = 'LargeTextArea'
