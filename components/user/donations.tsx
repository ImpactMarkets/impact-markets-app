import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

export function Donations({
  user,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  return (
    <div className="flow-root mt-6">
      <div className="border rounded py-10 px-10">
        {user.donations.map((donation) => (
          <div key={donation.id} className="flex items-center justify-between">
            {donation.projectId} and ${donation.amount.toString()}
          </div>
        ))}
      </div>
    </div>
  )
}
