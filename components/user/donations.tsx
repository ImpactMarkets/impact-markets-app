import Link from 'next/link'
import * as React from 'react'

import { Date } from '@/components/date'
import { InferQueryOutput, trpc } from '@/lib/trpc'

export function Donations({
  user,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  //TODO
  // change date format?
  // style date normally
  // donor rank (? how will this be displayed)
  // then see if there's a way to clean up the matchingProject ternary that prevents us from running into an issue if it's undefined

  const projectQuery = trpc.useQuery(['project.feed'])
  const project = projectQuery.data?.projects || []

  // maps over all donations and writes them in order
  // instead we want to map over all projects and display
  // the total amount of donations per project
  // and the date of the earliest donation per project

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
