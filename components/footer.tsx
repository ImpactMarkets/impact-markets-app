import * as React from 'react'

import { Footer } from '@mantine/core'

export function AppFooter() {
  return (
    <Footer
      height={30}
      className="flex flex-row justify-center items-center text-sm md:gap-4 text-secondary"
    >
      <p>
        © {new Date().getFullYear()}, Good Exchange, PBC. All rights reserved.
      </p>
    </Footer>
  )
}
