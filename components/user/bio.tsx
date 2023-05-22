import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

export function Bio({ user }: { user: InferQueryOutput<'user.profile'> }) {
  return (
    <div className="flow-root mt-6">
      <div className="border rounded py-10 px-10">{user.bio}</div>
    </div>
  )
}
