import * as React from 'react'
import { classNames } from '@/lib/classnames'
import * as Tooltip from '@radix-ui/react-tooltip'
import { InfoIcon } from './icons'
import { Label } from './label'

export type TextFieldOwnProps = {
  label?: string | React.ReactElement
  info?: string | React.ReactElement
}

type TextFieldProps = TextFieldOwnProps &
  React.ComponentPropsWithoutRef<'input'>

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { label, info, id, name, type = 'text', className, ...rest },
    forwardedRef
  ) => {
    return (
      <div className="mt-6">
        {label && (
          <Label htmlFor={id || name} className="block mb-2 text-s">
            {label}
            {info && (
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
                  <p className="text-sm">{info}</p>
                  <Tooltip.Arrow
                    offset={22}
                    className="fill-gray-800 dark:fill-gray-50"
                  />
                </Tooltip.Content>
              </Tooltip.Root>
            )}
          </Label>
        )}
        <input
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          type={type}
          className={classNames(
            'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring',
            className
          )}
        />
      </div>
    )
  }
)

TextField.displayName = 'TextField'
