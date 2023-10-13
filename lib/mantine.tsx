// Load completely on the client to avoid SSR error
// https://github.com/mantinedev/mantine/issues/2880#issuecomment-1617136855
import dynamic from 'next/dynamic'

import { Loader } from '@mantine/core'

export const Select = dynamic(
  () => import('@mantine/core').then((el) => el.Select),
  {
    loading: () => (
      <Loader className="inline !w-[1em] fill-[currentColor]" variant="bars" />
    ),
    ssr: false,
  },
)

export const Tooltip = dynamic(
  () => import('@mantine/core').then((el) => el.Tooltip),
  {
    loading: () => (
      <Loader className="inline !w-[1em] fill-[currentColor]" variant="bars" />
    ),
    ssr: false,
  },
)

export const MultiSelect = dynamic(
  () => import('@mantine/core').then((el) => el.MultiSelect),
  {
    loading: () => (
      <Loader className="inline !w-[1em] fill-[currentColor]" variant="bars" />
    ),
    ssr: false,
  },
)

export const Progress = dynamic(
  () => import('@mantine/core').then((el) => el.Progress),
  {
    loading: () => (
      <Loader className="inline !w-[1em] fill-[currentColor]" variant="bars" />
    ),
    ssr: false,
  },
)
