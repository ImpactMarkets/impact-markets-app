import { HeartFilledIcon } from '@/components/icons'
import * as React from 'react'
import packageJson from '../package.json'

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm md:gap-4 md:flex-row text-secondary">
      <div className="inline-flex items-center gap-1 text-sm">
        <span>Made with</span>
        <HeartFilledIcon className="w-4 h-4" />
        <span>by PlanetScale and GoodX</span>
      </div>
    </footer>
  )
}
