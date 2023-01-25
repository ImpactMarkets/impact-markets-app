import * as React from 'react'

import { Tooltip } from '@mantine/core'
import { IconQuestionCircle } from '@tabler/icons'

type InfoTooltipProps = {
  text?: string | React.ReactElement
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip label={text} events={{ hover: true, focus: true, touch: true }}>
      <span>
        <IconQuestionCircle className="inline h-5 ml-1 align-middle text-gray-400" />
      </span>
    </Tooltip>
  )
}
