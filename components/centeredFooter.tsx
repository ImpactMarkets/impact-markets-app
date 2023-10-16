import Link from 'next/link'
import * as React from 'react'

import { ActionIcon } from '@mantine/core'
import { IconBrandYoutube } from '@tabler/icons-react'

export function CenteredFooter() {
  return (
    <div className="flex justify-between mt-6 text-sm">
      <div>Good Exchange, PBC. Images by pch.vector on Freepik.</div>
      <div className="flex gap-4">
        <Link key="ranking" href="/ranking">
          Ranking
        </Link>
        <Link key="blog" href="https://impactmarkets.substack.com/">
          Blog
        </Link>
        <Link key="discord" href="https://discord.gg/7zMNNDSxWv">
          Discord
        </Link>
      </div>
      <div>
        <Link href="https://www.youtube.com/@impactmarkets">
          <ActionIcon size="md" variant="default" radius="xl">
            <IconBrandYoutube size={16} stroke={1.5} />
          </ActionIcon>
        </Link>
      </div>
    </div>
  )
}
