import clsx from 'clsx'
import { sortBy } from 'lodash'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Prisma } from '@prisma/client'

import { Select } from '@/lib/mantine'
import { num } from '@/lib/text'
import { RouterOutput, trpc } from '@/lib/trpc'

import { Button } from '../button'
import { ButtonLink } from '../buttonLink'
import { TextField } from '../textField'

type AddDonationFormData = {
  time: string
  amount: Prisma.Decimal
  projectId: string
  userId: string
  recommender: string
}

type OptionsType = [
  { value: string; label: string },
  ...{ value: string; label: string }[],
]

const DonationRegistrationForm = ({
  project,
  recommenderOptions,
}: {
  project: RouterOutput['project']['detail']
  recommenderOptions: OptionsType
}) => {
  const utils = trpc.useContext()
  const { data: session } = useSession()

  const { register, handleSubmit, setValue } = useForm<AddDonationFormData>({
    mode: 'onSubmit',
    defaultValues: {
      time: new Date().toISOString().slice(0, 10),
      projectId: project.id,
      userId: session!.user.id,
      recommender: '',
    },
  })

  const addDonationMutation = trpc.donation.add.useMutation({
    onSuccess: () => {
      utils.donation.feed.invalidate()
      utils.project.detail.invalidate()
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
      recommender: data.recommender,
    })
  }

  // https://stackoverflow.com/a/77332075/678861
  const recommenderValues = recommenderOptions.map(({ value }) => value) as [
    string,
    ...string[],
  ]

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contents max-h-96 overflow-y-auto"
    >
      <div className="py-4">
        <TextField
          {...register('time', { required: true, valueAsDate: true })}
          type="date"
          required
        />
      </div>
      <div className="py-4">
        <TextField
          {...register('amount', { required: true })}
          rightSection="USD"
          classNames={{ section: 'w-14' }}
          type="number"
          step="0.01"
          min="10"
          max={1e30}
          required
        />
      </div>
      <div className="py-4">
        <Select
          {...register('recommender')}
          defaultValue=""
          placeholder="Not specified"
          data={recommenderOptions}
          onChange={(value) =>
            setValue('recommender', z.enum(recommenderValues).parse(value))
          }
          searchable
        />
      </div>
      <div className="py-4">
        <Button
          type="submit"
          variant="highlight"
          isLoading={addDonationMutation.isLoading}
          disabled={addDonationMutation.isLoading}
          loadingChildren="Saving"
          data-testid="submit"
        >
          Add
        </Button>
      </div>
    </form>
  )
}

export const RegisterDonations = ({
  project,
}: {
  project: RouterOutput['project']['detail']
}) => {
  const { data: session } = useSession()
  const utils = trpc.useContext()

  let donations: RouterOutput['donation']['feed'] = []
  if (session) {
    const donationsQuery = trpc.donation.feed.useQuery({
      projectId: project.id,
      userId: session!.user.id,
    })
    donations = donationsQuery.data ?? []
  }

  const cancelDonationMutation = trpc.donation.cancel.useMutation({
    onSuccess: () => {
      utils.donation.feed.invalidate()
      utils.project.detail.invalidate()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  const confirmDonationMutation = trpc.donation.confirm.useMutation({
    onSuccess: () => {
      utils.donation.feed.invalidate()
      utils.project.detail.invalidate()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  const rankingQuery = trpc.user.topDonors.useQuery({})
  // https://stackoverflow.com/a/77332075/678861
  const topDonors = sortBy(rankingQuery.data ?? [], 'name').map(
    ({ id, name }) => ({
      value: id,
      label: name,
    }),
  ) as OptionsType
  const recommenderOptions: OptionsType = [
    { value: '', label: 'Not specified' },
    { value: 'TOP_PROJECTS', label: 'Our top project ranking' },
    { value: 'OWN_RESEARCH', label: 'Your own research' },
    ...topDonors,
    { value: 'OTHER', label: 'Other' },
  ]
  const recommenderMap = Object.fromEntries(
    recommenderOptions.map(({ value, label }) => [value, label]),
  )

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl pb-6 text-sm">
        You can register all your donations here, regardless how long ago you
        made them and whether the project still accepts donations.
      </div>
      <div className="grid grid-cols-[1fr_1fr_2fr_1fr] gap-2">
        <div className="contents">
          <div className="text-center">
            Date
            <div className="text-xs text-slate-500 font-normal">
              Of your transfer
            </div>
          </div>
          <div className="text-center">
            Amount
            <div className="text-xs text-slate-500 font-normal">
              In USD at the time
            </div>
          </div>
          <div className="text-center">
            Recommender
            <div className="text-xs text-slate-500 font-normal">
              Who influenced your decision?
            </div>
          </div>
          <div className="text-center"></div>
        </div>
        <DonationRegistrationForm
          project={project}
          recommenderOptions={recommenderOptions}
        />
        {donations?.map((donation) => (
          <div key={donation.id} className="contents text-sm">
            <div
              className={clsx(
                'text-right',
                donation.state === 'REJECTED' && ' line-through opacity-50',
              )}
            >
              {donation.time.toISOString().slice(0, 10)}
            </div>
            <div
              className={clsx(
                'text-right',
                donation.state === 'REJECTED' && ' line-through opacity-50',
              )}
            >
              ${num(donation.amount)}
            </div>
            <div
              className={clsx(
                'text-right',
                donation.state === 'REJECTED' && ' line-through opacity-50',
              )}
            >
              {recommenderMap[donation.recommender] || '–'}
            </div>
            <div
              className={clsx(
                'text-left',
                donation.state === 'REJECTED' && ' line-through opacity-50',
              )}
            >
              {donation.user.id === session!.user.id &&
                (donation.state === 'CONFIRMED' ? (
                  <ButtonLink
                    href="#"
                    variant="secondary"
                    className="!h-5"
                    disabled={cancelDonationMutation.isLoading}
                    onClick={() => cancelDonationMutation.mutate(donation.id)}
                  >
                    Delete
                  </ButtonLink>
                ) : donation.state === 'REJECTED' ? (
                  <ButtonLink
                    href="#"
                    variant="secondary"
                    className="!h-5"
                    disabled={confirmDonationMutation.isLoading}
                    onClick={() => confirmDonationMutation.mutate(donation.id)}
                  >
                    Restore
                  </ButtonLink>
                ) : (
                  ''
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
