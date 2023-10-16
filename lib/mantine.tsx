// Load completely on the client to avoid SSR error
// https://github.com/mantinedev/mantine/issues/2880#issuecomment-1617136855
import dynamic from 'next/dynamic'
import { RefAttributes } from 'react'

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

export const Select = ({
  placeholder,
  ...rest
}: SelectProps & RefAttributes<HTMLInputElement>) => {
  const MantineSelect = dynamic(
    () => import('@mantine/core').then((el) => el.Select),
    {
      loading: () => <>{placeholder}</>,
      ssr: false,
    },
  )

  return <MantineSelect placeholder={placeholder} {...rest} />
}

export const MultiSelect = ({
  placeholder,
  ...rest
}: MultiSelectProps & RefAttributes<HTMLInputElement>) => {
  const MantineMultiSelect = dynamic(
    () => import('@mantine/core').then((el) => el.MultiSelect),
    {
      loading: () => <>{placeholder}</>,
      ssr: false,
    },
  )

  return <MantineMultiSelect placeholder={placeholder} {...rest} />
}

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
