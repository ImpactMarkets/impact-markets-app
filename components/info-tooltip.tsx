import * as React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { classNames } from '@/lib/classnames'
import { InfoIcon } from './icons'

type InfoTooltipProps = {
  text?: string | React.ReactElement
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger
        asChild
        onClick={(event) => {
          event.preventDefault()
        }}
        onMouseDown={(event) => {
          event.preventDefault()
        }}
      >
        <span>
          {' '}
          <InfoIcon className="inline h-3" />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content
        side="bottom"
        sideOffset={4}
        className={classNames(
          'max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm'
        )}
      >
        <p className="text-sm">{text}</p>
        <Tooltip.Arrow
          offset={22}
          className="fill-gray-800 dark:fill-gray-50"
        />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
