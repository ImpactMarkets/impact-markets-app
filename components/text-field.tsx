import * as React from 'react'

import { TextInput, TextInputProps } from '@mantine/core'

import { InfoTooltip } from './info-tooltip'
import { Label } from './label'

export type TextFieldOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type TextFieldProps = TextFieldOwnProps &
  TextInputProps &
  React.ComponentPropsWithoutRef<'input'>

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { label, info, id, name, type = 'text', className, classNames, ...rest },
    forwardedRef
  ) => {
    return (
      <div className={className}>
        {label && (
          <Label htmlFor={id || name} className="block text-s">
            {label}
            {info && <InfoTooltip text={info} />}
          </Label>
        )}
        <TextInput
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          type={type}
          classNames={{
            input:
              'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring',
            ...classNames,
          }}
        />
      </div>
    )
  }
)

TextField.displayName = 'TextField'
