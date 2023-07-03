import Link from 'next/link'
import * as React from 'react'

import { Date } from '@/components/date'
import { InferQueryOutput, trpc } from '@/lib/trpc'

export function Donations({
  user,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  const projectQuery = trpc.useQuery(['project.feed'])
  const project = projectQuery.data?.projects || []

  interface GroupedDonations {
    [projectId: string]: {
      projectId: string
      totalAmount: number
      earliestDate: Date
    }
  }

  const groupedDonations = user.donations.reduce((acc, donation) => {
    if (!acc[donation.projectId]) {
      acc[donation.projectId] = {
        projectId: donation.projectId,
        totalAmount: 0,
        earliestDate: donation.createdAt,
      }
    }
    acc[donation.projectId].totalAmount += Number(donation.amount)

    // replaces date with date of earliest donation
    if (acc[donation.projectId].earliestDate > donation.createdAt) {
      acc[donation.projectId].earliestDate = donation.createdAt
    }

    return acc
  }, {} as GroupedDonations)

  const projectDonations = Object.values(groupedDonations).map((donation) => {
    const matchingProject = project.find(
      (project) => project.id === donation.projectId
    )

    return (
      <tr className="border" key={donation.projectId}>
        {matchingProject ? (
          <td className="p-4">
            <Link href={`/project/${matchingProject.id}`}>
              {matchingProject.title}
            </Link>
          </td>
        ) : null}
        <td className="p-4">${donation.totalAmount}</td>
        <td className="p-4">
          <Date date={donation.earliestDate} />
        </td>
      </tr>
    )
  })

  return (
    <table className="border rounded table-auto w-full">
      <thead className="text-secondary bg-secondary border">
        <tr>
          <th className="p-4 text-left">Project</th>
          <th className="p-4 text-left">Total Amount</th>
          <th className="p-4 text-left">Earliest Donation</th>
        </tr>
      </thead>
      <tbody>{projectDonations}</tbody>
    </table>
  )
}
