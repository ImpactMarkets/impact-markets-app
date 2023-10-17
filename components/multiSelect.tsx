import * as React from 'react'

import { MultiSelectProps } from '@mantine/core'

import { MultiSelect } from '@/lib/mantine'

import { InfoTooltip } from './infoTooltip'
import { Label } from './label'

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
>(({ label, info, id, name, className, ...rest }, forwardedRef) => {
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
        variant="unstyled"
        ref={forwardedRef}
        id={id || name}
        name={name}
        aria-label={label as string}
      />
    </div>
  )
})

IMMultiSelect.displayName = 'IMMultiSelect'
