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
  // link projectTitle to project page
  // organize in table format
  // ideally add:
  // date of earliest donation
  // total size of donations per project
  // donor rank

  const projectQuery = trpc.useQuery(['project.feed'])
  const project = projectQuery.data?.projects || []

  const donations = user.donations.map((donation) => {
    const donationAmount = donation.amount.toString()
    const matchingProject = project.find(
      (project) => project.id === donation.projectId
    )
    const projectTitle = matchingProject ? matchingProject.title : ''

    return (
      <tr className="border" key={donation.id}>
        <td className="p-4">${donationAmount}</td>
        <td className="p-4">{projectTitle}</td>
        <td className="p-4">
          <Date date={donation.createdAt} />
        </td>
      </tr>
    )
  })

  return (
    <table className="border rounded table-auto w-full">
      <thead className="text-secondary bg-secondary border">
        <tr>
          <th className="p-4 text-left">Amount</th>
          <th className="p-4 text-left">Project</th>
          <th className="p-4 text-left">Date</th>
        </tr>
      </thead>
      <tbody>{donations}</tbody>
    </table>
  )
}
