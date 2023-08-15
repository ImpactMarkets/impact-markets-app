import * as React from 'react'

import { Tooltip } from '@mantine/core'
import { IconHelpOctagon } from '@tabler/icons-react'

type InfoTooltipProps = {
  text?: string | React.ReactElement
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip label={text} events={{ hover: true, focus: true, touch: true }}>
      <span>
        <IconHelpOctagon className="inline h-5 ml-1 align-middle text-gray-400" />
      </span>
    </Tooltip>
  )
}
