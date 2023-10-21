import { useSession } from 'next-auth/react'
import * as React from 'react'
import toast from 'react-hot-toast'

import { num } from '@/lib/text'
import { RouterOutput, trpc } from '@/lib/trpc'

import { Author } from '../author'
import { ButtonLink } from '../buttonLink'

export function IncomingDonations({
  project,
}: {
  project: RouterOutput['project']['detail']
}) {
  const { data: session } = useSession()
  const utils = trpc.useContext()

  let donations: RouterOutput['donation']['feed'] = []
  if (session) {
    const donationsQuery = trpc.donation.feed.useQuery({
      projectId: project.id,
    })
    donations = donationsQuery.data ?? []
  }

  const cancelDonationMutation = trpc.donation.cancel.useMutation({
    onSuccess: () => {
      utils.donation.feed.invalidate()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-gray-500">No incoming donations</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center max-h-96 overflow-y-auto">
      <table className="text-sm">
        <thead>
          <tr>
            <th className="font-normal pb-6 text-left w-64">Donor</th>
            <th className="font-normal pb-6 text-right w-24">Date</th>
            <th className="font-normal pb-6 text-right w-24">Amount</th>
            <th className="font-normal pb-6 text-left w-64"></th>
          </tr>
        </thead>
        <tbody>
          {donations?.map((donation) => (
            <tr key={donation.id}>
              {/* FIXME: The row should be 34 px high but it’s ~ 42 px */}
              <td className="text-left">
                <Author author={donation.user} />
              </td>
              <td className="text-right whitespace-nowrap">
                {donation.time.toISOString().slice(0, 10)}
              </td>
              <td className="text-right">${num(donation.amount)}</td>
              <td className="text-left pl-8">
                {donation.state === 'CONFIRMED' ? (
                  <ButtonLink
                    href="#"
                    type="button"
                    className="!h-5"
                    variant="secondary"
                    onClick={() => cancelDonationMutation.mutate(donation.id)}
                  >
                    Veto
                  </ButtonLink>
                ) : donation.state === 'REJECTED' ? (
                  'Deleted or vetoed'
                ) : (
                  ''
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
