import { flow, max, min } from 'lodash'
import { map, reverse, sortBy } from 'lodash/fp'
import Link from 'next/link'
import * as React from 'react'

import { Date } from '@/components/date'
import { num } from '@/lib/text'
import { InferQueryOutput } from '@/lib/trpc'
import { Prisma } from '@prisma/client'

interface DonationGroup {
  projectId: string
  project: InferQueryOutput<'user.profile'>['donations'][0]['project']
  totalAmount: Prisma.Decimal
  earliestDate: Date
  latestDate: Date
}

interface GroupedDonations {
  [projectId: string]: DonationGroup
}

export function Donations({
  user,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  const groupedDonations = user.donations.reduce((acc, donation) => {
    // Skip donations that are not confirmed or have totalAmount of 0
    if (donation.state !== 'CONFIRMED') {
      return acc
    }

    // If the project ID is not in the accumulator, add it with the following properties
    if (!acc[donation.project.id]) {
      acc[donation.project.id] = {
        projectId: donation.project.id,
        project: donation.project,
        totalAmount: new Prisma.Decimal(0),
        earliestDate: donation.time,
        latestDate: donation.time,
      }
    }

    const aggregate = acc[donation.project.id]

    // Add donation amount to totalAmount
    aggregate.totalAmount = acc[donation.project.id].totalAmount.add(
      donation.amount
    )

    // Replace date with date of earliest/latest donation
    aggregate.earliestDate =
      min([aggregate.earliestDate, donation.time]) || aggregate.earliestDate
    aggregate.latestDate =
      max([aggregate.latestDate, donation.time]) || aggregate.latestDate

    return acc
  }, {} as GroupedDonations)

  const projectDonations = flow(
    Object.values,
    sortBy('latestDate'),
    reverse,
    map((donation: DonationGroup) => (
      <tr key={donation.project.id}>
        <td className="px-4 py-2">
          {donation.project.hidden ? (
            <span className="text-gray-500" title="Unlisted project">
              {donation.project.title}
            </span>
          ) : (
            <Link href={`/project/${donation.project.id}`} className="link">
              {donation.project.title}
            </Link>
          )}
        </td>
        <td className="px-4 py-2">
          <Date date={donation.earliestDate} />
        </td>
        <td className="px-4 py-2">
          <Date date={donation.latestDate} />
        </td>
        <td className="px-4 py-2 text-right">${num(donation.totalAmount)}</td>
      </tr>
    ))
  )(groupedDonations)

  return (
    <table className="table-auto w-full">
      <thead className="text-sm">
        <tr>
          <th className="font-normal p-4 text-left">Project</th>
          <th className="font-normal p-4 text-left">Earliest donation</th>
          <th className="font-normal p-4 text-left">Latest donation</th>
          <th className="font-normal p-4 text-right">Total amount</th>
        </tr>
      </thead>
      <tbody>{projectDonations}</tbody>
    </table>
  )
}
