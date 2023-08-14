import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

// TODO
// fix the displayed info (we dont want it to be the id we want it to be the project name) -- see donations.tsx for this
// create pagination
// fix styling -- see projectFeed.tsx for this
// refactor

// to add certificates:
//// update user.ts profile query

export function Likes({ user }: { user: InferQueryOutput<'user.profile'> }) {
  const projects = user.likedProjects.map((like) => (
    <tr key={like.projectId}>
      <td className="p-4">
        <a href={`/project/${like.projectId}`}>{like.projectId}</a>
      </td>
    </tr>
  ))

  const bounties = user.likedBounties.map((like) => (
    <tr key={like.bountyId}>
      <td className="p-4">
        <a href={`/bounty/${like.bountyId}`}>{like.bountyId}</a>
      </td>
    </tr>
  ))

  return (
    <div className="flow-root mt-6">
      {projects}
      {bounties}
    </div>
  )
}
