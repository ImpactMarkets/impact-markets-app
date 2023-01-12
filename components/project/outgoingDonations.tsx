import { useSession } from 'next-auth/react'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { num } from '@/lib/text'
import { InferQueryOutput, InferQueryPathAndInput, trpc } from '@/lib/trpc'
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

  // Fresh keys to force re-mounting of the dialogs
  // https://stackoverflow.com/a/66772917/678861
  const [childKey, setChildKey] = React.useState(1)
  React.useEffect(() => {
    setChildKey((prev) => prev + 1)
  }, [donations?.length])

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-left w-32">Date</th>
              <th className="text-right w-32">Amount</th>
              <th className="text-left w-64"></th>
            </tr>
          </thead>
          <tbody>
            <tr key={childKey}>
              <td className="py-4">
                <TextField
                  {...register('time', { required: true, valueAsDate: true })}
                  defaultValue={new Date().toISOString().slice(0, 10)}
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
                <td className="text-left">
                  {donation.time.toISOString().slice(0, 10)}
                </td>
                <td className="text-right">${num(donation.amount)}</td>
                <td className="text-left pl-2">
                  {donation.userId === session!.user.id &&
                    (donation.state === 'PENDING' ? (
                      <Button
                        type="button"
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
