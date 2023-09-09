import Link from 'next/link'
import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'

interface LikedProject {
  projectId: string
  project: InferQueryOutput<'user.profile'>['likedProjects'][0]['project']
}

interface LikedBounty {
  bountyId: string
  bounty: InferQueryOutput<'user.profile'>['likedBounties'][0]['bounty']
}

export function Likes({ user }: { user: InferQueryOutput<'user.profile'> }) {
  const likedProjects = user.likedProjects
    .filter((likedProject: LikedProject) => !likedProject.project.hidden)
    .map((likedProject: LikedProject) => (
      <tr key={likedProject.project.id}>
        <td className="px-4 py-2">
          <Link href={`/project/${likedProject.project.id}`} className="link">
            {likedProject.project.title}
          </Link>
        </td>
        <td className="px-4 py-2">{likedProject.project.likedBy.length}</td>
        <td className="px-4 py-2">
          {likedProject.project.supportScore?.score.toString() || 'n/a'}
        </td>
      </tr>
    ))

  const likedBounties = user.likedBounties
    .filter((likedBounty: LikedBounty) => !likedBounty.bounty.hidden)
    .map((likedBounty: LikedBounty) => (
      <tr key={likedBounty.bounty.id}>
        <td className="px-4 py-2">
          <Link href={`/bounty/${likedBounty.bounty.id}`} className="link">
            {likedBounty.bounty.title}
          </Link>
        </td>
      </tr>
    ))

  return (
    <>
      {likedProjects && likedProjects.length > 0 && (
        <Card shadow="sm" p="lg" radius="md" m="lg" withBorder>
          <h1>Projects</h1>
          <table className="table-auto w-full">
            <thead className="text-sm">
              <tr>
                <th className="font-normal p-4 text-left">Title</th>
                <th className="font-normal p-4 text-left">Likes</th>
                <th className="font-normal p-4 text-left">Support Score</th>
              </tr>
            </thead>
            <tbody>{likedProjects}</tbody>
          </table>
        </Card>
      )}
      {likedBounties && likedBounties.length > 0 && (
        <Card shadow="sm" p="lg" radius="md" m="lg" withBorder>
          <h1>Bounties</h1>
          {likedBounties}
        </Card>
      )}
    </>
  )
}
