import * as React from 'react'

import { Tooltip } from '@mantine/core'

import { InfoIcon } from './icons'

type InfoTooltipProps = {
  text?: string | React.ReactElement
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip label={text} events={{ hover: true, focus: true, touch: true }}>
      <span>
        <InfoIcon className="inline h-3 ml-1 align-baseline" />
      </span>
    </Tooltip>
  )
}
