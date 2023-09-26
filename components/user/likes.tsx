import Link from 'next/link'
import * as React from 'react'

import { Card } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { num } from '@/lib/text'
import { RouterOutput } from '@/lib/trpc'

interface LikedProject {
  projectId: string
  project: RouterOutput['user']['profile']['likedProjects'][0]['project']
}

interface LikedBounty {
  bountyId: string
  bounty: RouterOutput['user']['profile']['likedBounties'][0]['bounty']
}

export function Likes({ user }: { user: RouterOutput['user']['profile'] }) {
  const likedProjects = user.likedProjects
    .filter((likedProject: LikedProject) => !likedProject.project.hidden)
    .map((likedProject: LikedProject) => (
      <tr key={likedProject.project.id}>
        <td className="px-4 py-2">
          <Link href={`/project/${likedProject.project.id}`} className="link">
            {likedProject.project.title}
          </Link>
        </td>
        <td className="px-4 py-2 text-right">
          {likedProject.project.likedBy.length}
        </td>
        <td className="px-4 py-2 text-right">
          {num(
            likedProject.project.supportScore?.score || new Prisma.Decimal(0),
            0,
          )}
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
      {likedProjects.length > 0 || likedBounties.length > 0 ? (
        <>
          {likedProjects && likedProjects.length > 0 && (
            <Card shadow="sm" p="lg" radius="md" m="lg" withBorder>
              <h2>Projects</h2>
              <table className="table-auto w-full">
                <thead className="text-sm">
                  <tr>
                    <th className="font-normal p-4 text-left">Title</th>
                    <th className="font-normal p-4 text-right">Likes</th>
                    <th className="font-normal p-4 text-right whitespace-nowrap">
                      Support score
                    </th>
                  </tr>
                </thead>
                <tbody>{likedProjects}</tbody>
              </table>
            </Card>
          )}
          {likedBounties && likedBounties.length > 0 && (
            <Card shadow="sm" p="lg" radius="md" m="lg" withBorder>
              <h2>Bounties</h2>
              <table className="table-auto w-full">
                <tbody>{likedBounties}</tbody>
              </table>
            </Card>
          )}
        </>
      ) : (
        <div className="flow-root mt-6">
          <div className="border rounded py-10 px-10">
            {user.bio || 'This user has not liked any projects or bounties yet'}
          </div>
        </div>
      )}
    </>
  )
}
