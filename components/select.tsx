import * as React from 'react'

import { SelectProps } from '@mantine/core'

import { Select } from '@/lib/mantine'

import { InfoTooltip } from './infoTooltip'
import { Label } from './label'

export type SelectOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type IMTextFieldProps = SelectOwnProps &
  SelectProps &
  React.ComponentPropsWithoutRef<'input'>

export const IMSelect = React.forwardRef<HTMLInputElement, IMTextFieldProps>(
  ({ label, info, id, name, className, ...rest }, forwardedRef) => {
    return (
      <div className={className}>
        {label && (
          <Label htmlFor={id || name} className="block text-s">
            {label}
            {info && <InfoTooltip text={info} />}
          </Label>
        )}
        <Select
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

IMSelect.displayName = 'IMSelect'
