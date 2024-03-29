import * as React from 'react'

import { RouterOutput } from '@/lib/trpc'

export function Bio({ user }: { user: RouterOutput['user']['profile'] }) {
  return (
    <div className="flow-root mt-6">
      <div className="border rounded py-10 px-10">
        {user.bio || 'This user has not entered a bio yet'}
      </div>
    </div>
  )
}
