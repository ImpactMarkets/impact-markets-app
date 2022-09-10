import * as React from 'react'

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm md:gap-4 md:flex-row text-secondary">
      <div className="inline-flex justify-center items-center gap-1 text-sm">
        <span>
          © {new Date().getFullYear()}, Good Exchange, PBC. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
