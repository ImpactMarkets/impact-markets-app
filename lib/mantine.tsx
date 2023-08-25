// Load completely on the client to avoid SSR error
// https://github.com/mantinedev/mantine/issues/2880#issuecomment-1617136855

import dynamic from 'next/dynamic'

export const Select = dynamic(
  () => import('@mantine/core').then((el) => el.Select),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
)

export const Tooltip = dynamic(
  () => import('@mantine/core').then((el) => el.Tooltip),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
)

export const MultiSelect = dynamic(
  () => import('@mantine/core').then((el) => el.MultiSelect),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
)
