import { useSession } from 'next-auth/react'
import * as React from 'react'
import toast from 'react-hot-toast'

import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { Button } from '../button'

export function IncomingDonations({
  project,
}: {
  project: InferQueryOutput<'project.detail'>
}) {
  const { data: session } = useSession()
  const utils = trpc.useContext()

  let donations: InferQueryOutput<'donation.feed'> = []
  if (session) {
    const donationsQuery = trpc.useQuery([
      'donation.feed',
      {
        projectId: project.id,
        state: 'PENDING',
      },
    ])
    console.log(donationsQuery, typeof donationsQuery)
    donations = donationsQuery.data ?? []
  }

  const cancelDonationMutation = trpc.useMutation('donation.cancel', {
    onSuccess: () => {
      utils.invalidateQueries(['donation.feed'])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  const confirmDonationMutation = trpc.useMutation('donation.confirm', {
    onSuccess: () => {
      utils.invalidateQueries(['donation.feed'])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <div className="flex justify-center">
      <table className="text-sm">
        <thead>
          <tr>
            <th className="text-left w-32">Date</th>
            <th className="text-right w-32">Amount</th>
            <th className="text-left w-64"></th>
          </tr>
        </thead>
        <tbody>
          {donations?.map((donation) => (
            <tr key={donation.id}>
              <td className="text-left">
                {donation.time.toISOString().slice(0, 10)}
              </td>
              <td className="text-right">${num(donation.amount)}</td>
              <td className="text-left pl-2">
                <Button
                  type="button"
                  onClick={() => cancelDonationMutation.mutate(donation.id)}
                >
                  Cancel
                </Button>
                <Button
                  className="ml-1"
                  type="button"
                  onClick={() => confirmDonationMutation.mutate(donation.id)}
                >
                  Confirm
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
