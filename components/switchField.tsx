import * as React from 'react'

import { InfoTooltip } from './infoTooltip'
import { Label } from './label'

export type SwitchFieldOwnProps = {
  label: string | React.ReactElement
  info?: string | React.ReactElement
}

type SwitchFieldProps = SwitchFieldOwnProps &
  React.ComponentPropsWithoutRef<'input'>

export const SwitchField = React.forwardRef<HTMLInputElement, SwitchFieldProps>(
  ({ label, info, ...rest }, forwardedRef) => {
    return (
      <Label className="block text-s">
        <input {...rest} ref={forwardedRef} type="checkbox" className="mr-2" />
        {label}
        {info && <InfoTooltip text={info} />}
      </Label>
    )
  },
)

SwitchField.displayName = 'SwitchField'
