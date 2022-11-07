import * as React from 'react'

import { Footer as MantineFooter } from '@mantine/core'

export function Footer() {
  return (
    <MantineFooter
      height={30}
      className="flex flex-row justify-center items-center text-sm md:gap-4 text-secondary"
    >
      <p>
        © {new Date().getFullYear()}, Good Exchange, PBC. All rights reserved.
      </p>
    </MantineFooter>
  )
}
