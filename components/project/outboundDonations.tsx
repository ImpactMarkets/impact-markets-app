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

export function OutboundDonations({
  project,
}: {
  project: RouterOutput['project']['detail']
}) {
  const { data: session } = useSession()
  const utils = trpc.useContext()
  const { register, handleSubmit, setValue } = useForm<AddDonationFormData>({
    mode: 'onSubmit',
    defaultValues: {
      time: new Date().toISOString().slice(0, 10),
      projectId: project.id,
      userId: session!.user.id,
      recommender: '',
    },
  })

  let donations: RouterOutput['donation']['feed'] = []
  if (session) {
    const donationsQuery = trpc.donation.feed.useQuery({
      projectId: project.id,
      userId: session!.user.id,
    })
    donations = donationsQuery.data ?? []
  }

  const addDonationMutation = trpc.donation.add.useMutation({
    onSuccess: () => {
      utils.donation.feed.invalidate()
      utils.project.detail.invalidate()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

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

  const onSubmit: SubmitHandler<AddDonationFormData> = (data) => {
    addDonationMutation.mutate({
      projectId: data.projectId,
      userId: data.userId,
      amount: new Prisma.Decimal(data.amount),
      time: new Date(data.time),
      recommender: data.recommender,
    })
  }

  const rankingQuery = trpc.user.topDonors.useQuery({})
  type OptionsType = [
    { value: string; label: string },
    ...{ value: string; label: string }[],
  ]
  // https://stackoverflow.com/a/77332075/678861
  const topDonors = sortBy(rankingQuery.data ?? [], 'name').map(
    ({ id, name }) => ({ value: id, label: name }),
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
  // https://stackoverflow.com/a/77332075/678861
  const recommenderValues = Object.keys(recommenderMap) as [string, ...string[]]

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl pb-6 text-sm">
        You can register all your donations here, regardless how long ago you
        made them and whether the project still accepts donations.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-96 overflow-y-auto"
      >
        <table>
          <thead>
            <tr>
              <th className="text-center w-32 pr-3">
                Date
                <div className="text-xs text-slate-500 font-normal">
                  Of your transfer
                </div>
              </th>
              <th className="text-center w-32 pr-3">
                Amount
                <div className="text-xs text-slate-500 font-normal">
                  In USD at the time
                </div>
              </th>
              <th className="text-center w-42 pr-3">
                Recommender
                <div className="text-xs text-slate-500 font-normal">
                  Who influenced your decision?
                </div>
              </th>
              <th className="text-center"></th>
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
                  classNames={{ section: 'w-14' }}
                  type="number"
                  step="0.01"
                  min="10"
                  max={1e30}
                  required
                />
              </td>
              <td className="py-4">
                <Select
                  {...register('recommender')}
                  defaultValue=""
                  placeholder="Not specified"
                  data={recommenderOptions}
                  onChange={(value) =>
                    setValue(
                      'recommender',
                      z.enum(recommenderValues).parse(value),
                    )
                  }
                  searchable
                />
              </td>
              <td className="py-4 pl-2">
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
              </td>
            </tr>
            {donations?.map((donation) => (
              <tr
                key={donation.id}
                className={
                  'text-sm' +
                  (donation.state === 'REJECTED'
                    ? ' line-through opacity-50'
                    : '')
                }
              >
                <td className={'text-right pr-3'}>
                  {donation.time.toISOString().slice(0, 10)}
                </td>
                <td className="text-right pr-3">${num(donation.amount)}</td>
                <td className="text-right pr-3">
                  {recommenderMap[donation.recommender] || '–'}
                </td>
                <td className="text-left pl-2">
                  {donation.user.id === session!.user.id &&
                    (donation.state === 'CONFIRMED' ? (
                      <ButtonLink
                        href="#"
                        variant="secondary"
                        className="!h-5"
                        disabled={cancelDonationMutation.isLoading}
                        onClick={() =>
                          cancelDonationMutation.mutate(donation.id)
                        }
                      >
                        Delete
                      </ButtonLink>
                    ) : donation.state === 'REJECTED' ? (
                      <ButtonLink
                        href="#"
                        variant="secondary"
                        className="!h-5"
                        disabled={confirmDonationMutation.isLoading}
                        onClick={() =>
                          confirmDonationMutation.mutate(donation.id)
                        }
                      >
                        Restore
                      </ButtonLink>
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
