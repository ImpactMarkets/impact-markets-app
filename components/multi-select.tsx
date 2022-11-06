import * as React from 'react'

import { MultiSelect, MultiSelectProps } from '@mantine/core'

import { InfoTooltip } from './info-tooltip'
import { Label } from './label'

export type MultiSelectOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type IMTextFieldProps = MultiSelectOwnProps &
  MultiSelectProps &
  React.ComponentPropsWithoutRef<'input'>

export const IMMultiSelect = React.forwardRef<HTMLInputElement, IMTextFieldProps>(
  (
    { label, info, id, name, className, classNames, ...rest },
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
        <MultiSelect
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          aria-label={label as string}
          classNames={{
            input:
              'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring im-multiselect',
            ...classNames,
          }}
        />
      </div>
    )
  }
)

IMMultiSelect.displayName = 'IMMultiSelect'
