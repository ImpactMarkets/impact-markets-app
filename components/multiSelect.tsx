import * as React from 'react'

import { MultiSelectProps as MantineMultiSelectProps } from '@mantine/core'

import { MultiSelect as MantineMultiSelect } from '@/lib/mantine'

import { InfoTooltip } from './infoTooltip'
import { Label } from './label'

export type MultiSelectOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type TextFieldProps = MultiSelectOwnProps &
  MantineMultiSelectProps &
  React.ComponentPropsWithoutRef<'input'>

export const MultiSelect = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, info, id, name, className, ...rest }, forwardedRef) => {
    return (
      <div className={className}>
        {label && (
          <Label htmlFor={id || name} className="block text-s">
            {label}
            {info && <InfoTooltip text={info} />}
          </Label>
        )}
        <MantineMultiSelect
          {...rest}
          variant="unstyled"
          ref={forwardedRef}
          id={id || name}
          name={name}
          aria-label={label as string}
        />
      </div>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'
