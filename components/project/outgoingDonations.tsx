import { useSession } from 'next-auth/react'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'
import { Prisma } from '@prisma/client'

import { Button } from '../button'
import { TextField } from '../textField'

type AddDonationFormData = {
  time: string
  amount: Prisma.Decimal
  projectId: string
  userId: string
}

export function OutgoingDonations({
  project,
}: {
  project: InferQueryOutput<'project.detail'>
}) {
  const { data: session } = useSession()
  const utils = trpc.useContext()
  const { register, handleSubmit } = useForm<AddDonationFormData>({
    mode: 'onSubmit',
    defaultValues: {
      time: new Date().toISOString().slice(0, 10),
      projectId: project.id,
      userId: session!.user.id,
    },
  })

  let donations: InferQueryOutput<'donation.feed'> = []
  if (session) {
    const donationsQuery = trpc.useQuery([
      'donation.feed',
      {
        projectId: project.id,
        userId: session!.user.id,
      },
    ])
    donations = donationsQuery.data ?? []
  }

  const addDonationMutation = trpc.useMutation('donation.add', {
    onSuccess: () => {
      utils.invalidateQueries([
        'donation.feed',
        { projectId: project.id, userId: session!.user.id },
      ])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  const cancelDonationMutation = trpc.useMutation('donation.cancel', {
    onSuccess: () => {
      utils.invalidateQueries(['donation.feed'])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  const onSubmit: SubmitHandler<AddDonationFormData> = (data) => {
    addDonationMutation.mutate({
      projectId: data.projectId,
      userId: data.userId,
      amount: new Prisma.Decimal(data.amount),
      time: new Date(data.time),
    })
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-right w-32">Date</th>
              <th className="text-right w-32">Amount</th>
              <th className="text-right w-64"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4">
                <TextField
                  {...register('time', { required: true, valueAsDate: true })}
                  type="date"
                  required
                />
              </td>
              <td className="py-4">
                <TextField
                  {...register('amount', { required: true })}
                  rightSection="USD"
                  classNames={{ rightSection: 'w-14' }}
                  type="number"
                  step="0.01"
                  min="10"
                  max={1e30}
                  required
                />
              </td>
              <td className="py-4 pl-2">
                <Button
                  type="submit"
                  variant="highlight"
                  isLoading={addDonationMutation.isLoading}
                  loadingChildren="Saving"
                  data-testid="submit"
                >
                  Add
                </Button>
              </td>
            </tr>
            {donations?.map((donation) => (
              <tr key={donation.id}>
                <td className="text-right">
                  {donation.time.toISOString().slice(0, 10)}
                </td>
                <td className="text-right">${num(donation.amount)}</td>
                <td className="text-left pl-2">
                  {donation.userId === session!.user.id &&
                    (donation.state === 'PENDING' ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          cancelDonationMutation.mutate(donation.id)
                        }
                      >
                        Cancel
                      </Button>
                    ) : donation.state === 'REJECTED' ? (
                      'Canceled'
                    ) : donation.state === 'CONFIRMED' ? (
                      'Confirmed'
                    ) : (
                      ''
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  )
}
