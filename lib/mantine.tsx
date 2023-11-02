// Load completely on the client to avoid SSR error
// https://github.com/mantinedev/mantine/issues/2880#issuecomment-1617136855
import dynamic from 'next/dynamic'
import React from 'react'

import {
  Loader,
  MultiSelectProps,
  SelectProps,
  TooltipProps,
} from '@mantine/core'

export const Tooltip = ({ children, ...rest }: TooltipProps) => {
  const MantineTooltip = dynamic(
    () => import('@mantine/core').then((el) => el.Tooltip),
    {
      loading: () => <>{children}</>,
      ssr: false,
    },
  )

  return <MantineTooltip {...rest}>{children}</MantineTooltip>
}

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  ({ placeholder, ...rest }, forwardedRef) => {
    const MantineSelect = dynamic(
      () => import('@mantine/core').then((el) => el.Select),
      {
        loading: () => <>{placeholder}</>,
        ssr: false,
      },
    )

    return (
      <MantineSelect placeholder={placeholder} ref={forwardedRef} {...rest} />
    )
  },
)

Select.displayName = 'Select'

export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(
  ({ placeholder, ...rest }, forwardedRef) => {
    const MantineMultiSelect = dynamic(
      () => import('@mantine/core').then((el) => el.MultiSelect),
      {
        loading: () => <>{placeholder}</>,
        ssr: false,
      },
    )

    return (
      <MantineMultiSelect
        placeholder={placeholder}
        ref={forwardedRef}
        {...rest}
      />
    )
  },
)

MultiSelect.displayName = 'MultiSelect'

export const Progress = dynamic(
  () => import('@mantine/core').then((el) => el.Progress),
  {
    loading: () => (
      <Loader
        color="currentColor"
        style={{
          width: '1.8em',
          height: '1em',
          margin: '0 1em',
        }}
        type="bars"
      />
    ),
    ssr: false,
  },
)
