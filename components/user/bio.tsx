import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

export function Bio({ user }: { user: InferQueryOutput<'user.profile'> }) {
  return <div>{user.bio ? user.bio : 'No bio yet.'}</div>
}
