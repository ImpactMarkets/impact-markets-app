import * as React from 'react'

import { HeartFilledIcon } from '@/components/icons'

import packageJson from '../package.json'

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm md:gap-4 md:flex-row text-secondary">
      <div className="inline-flex justify-center items-center gap-1 text-sm">
        <span>© Copyright 2022, Good Exchange, PBC All Rights Reserved.</span>
      </div>
    </footer>
  )
}
