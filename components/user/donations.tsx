import * as React from 'react'

import { InferQueryOutput, trpc } from '@/lib/trpc'

export function Donations({
  user,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  //TODO
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
      <div key={donation.id} className="flex items-center justify-between">
        donated ${donationAmount} to {projectTitle}
      </div>
    )
  })

  return (
    <div className="flow-root mt-6">
      <div className="border rounded py-10 px-10">{donations}</div>
    </div>
  )
}
