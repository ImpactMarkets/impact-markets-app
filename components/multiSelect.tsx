import * as React from 'react'

import { MultiSelectProps } from '@mantine/core'

import { InfoTooltip } from './infoTooltip'
import { Label } from './label'
import { MultiSelect } from '@/lib/mantine'

export type MultiSelectOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type IMTextFieldProps = MultiSelectOwnProps &
  MultiSelectProps &
  React.ComponentPropsWithoutRef<'input'>

export const IMMultiSelect = React.forwardRef<
  HTMLInputElement,
  IMTextFieldProps
>(({ label, info, id, name, className, sx, ...rest }, forwardedRef) => {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id || name} className="block text-s">
          {label}
          {info && <InfoTooltip text={info} />}
        </Label>
      )}
      <MultiSelect
        {...rest}
        ref={forwardedRef}
        id={id || name}
        name={name}
        aria-label={label as string}
        styles={{
          defaultValueLabel: {
            overflow: 'visible',
          },
          defaultValue: {
            justifyContent: 'center',
            padding: '0 4px 0 11px',
            backgroundColor: 'rgba(231, 245, 255, 1)',
          },
        }}
        sx={{
          'div > input::placeholder': {
            fontSize: 16,
          },
          'div > input': {
            padding: 0,
            fontSize: 14,
            lineHeight: '0.2rem',
            height: 16,
            minWidth: 0,
          },
          'div > input:focus': {
            boxShadow: 'none',
          },
          ...sx,
        }}
      />
    </div>
  )
})

IMMultiSelect.displayName = 'IMMultiSelect'
