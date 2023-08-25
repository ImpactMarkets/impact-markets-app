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
  ({ label, info, id, name, className, classNames, ...rest }, forwardedRef) => {
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
          classNames={{
            input:
              'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring im-Select',
            ...classNames,
          }}
          sx={{
            'div > input::placeholder': {
              fontSize: 12,
            },
            'div > input': {
              padding: 17,
              fontSize: 14,
              lineHeight: '0.2rem',
              height: 16,
              minWidth: 0,
            },
            'div > input:focus': {
              boxShadow: 'none',
            },
          }}
        />
      </div>
    )
  },
)

IMSelect.displayName = 'IMMultiSelect'
