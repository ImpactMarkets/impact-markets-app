import * as React from 'react'

import { InfoTooltip } from './info-tooltip'
import { Label } from './label'

export type SwitchFieldOwnProps = {
  label: string | React.ReactElement
  info?: string | React.ReactElement
}

type SwitchFieldProps = SwitchFieldOwnProps &
  React.ComponentPropsWithoutRef<'input'>

export const SwitchField = React.forwardRef<HTMLInputElement, SwitchFieldProps>(
  ({ label, info, className, ...rest }, forwardedRef) => {
    console.log(rest)

    return (
      <Label className="block text-s">
        {label}
        {info && <InfoTooltip text={info} />}
        <input
          {...rest}
          ref={forwardedRef}
          type="checkbox"
          className="block mt-2"
        />
      </Label>
    )
  }
)

SwitchField.displayName = 'SwitchField'
