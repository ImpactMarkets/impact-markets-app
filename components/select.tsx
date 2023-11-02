import * as React from 'react'

import { SelectProps as MantineSelectProps } from '@mantine/core'

import { Select as MantineSelect } from '@/lib/mantine'

import { InfoTooltip } from './infoTooltip'
import { Label } from './label'

export type SelectOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type TextFieldProps = SelectOwnProps &
  MantineSelectProps &
  React.ComponentPropsWithoutRef<'input'>

export const Select = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, info, id, name, className, ...rest }, forwardedRef) => {
    return (
      <div className={className}>
        {label && (
          <Label htmlFor={id || name} className="block text-s">
            {label}
            {info && <InfoTooltip text={info} />}
          </Label>
        )}
        <MantineSelect
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          aria-label={label as string}
        />
      </div>
    )
  },
)

Select.displayName = 'Select'
