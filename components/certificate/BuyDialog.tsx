import { useSession } from 'next-auth/react'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from '@/components/dialog'
import { TextField } from '@/components/text-field'
import { BondingCurve } from '@/lib/auction'
import { trpc } from '@/lib/trpc'
import { Accordion } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { Banner } from '../banner'
import { SwitchField } from '../switch-field'

type BuyFormData = {
  size: Prisma.Decimal
  cost: Prisma.Decimal
  consume: boolean
}

export function BuyDialog({
  holding,
  reservedSize,
  isOpen,
  onClose,
}: {
  holding: {
    id: number
    certificateId: number
    size: Prisma.Decimal
    valuation: Prisma.Decimal
    target: Prisma.Decimal
    user: {
      name: string | null
    }
  }
  reservedSize: number
  isOpen: boolean
  onClose: () => void
}) {
  const { register, handleSubmit, reset, watch } = useForm<BuyFormData>({
    defaultValues: {
      consume: false,
    },
  })
  const utils = trpc.useContext()
  const { data: session } = useSession()
  const transactionMutation = trpc.useMutation('transaction.add', {
    onSuccess: () => {
      utils.invalidateQueries([
        'holding.feed',
        { certificateId: holding.certificateId },
      ])
      utils.invalidateQueries([
        'transaction.feed',
        { certificateId: holding.certificateId, userId: session!.user.id },
      ])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  function handleClose() {
    onClose()
    reset()
  }

  const onSubmit: SubmitHandler<BuyFormData> = (data) => {
    transactionMutation.mutate(
      {
        sellingHolding: holding,
        size: data.size,
        consume: data.consume,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  const watchSize = watch('size')
  const zero = new Prisma.Decimal(0)

  const bondingCurve = new BondingCurve(holding.target)

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>Buy</DialogTitle>
          <div className="mt-6 space-y-6">
            <p className="text-sm">
              Please contact the current owner {holding.user.name || ''} to
              agree on a payment method.
            </p>
            {/* Not using NumberInput because onChange is called with only the value,
                not the field element */}
            <TextField
              {...register('size', {
                required: true,
                shouldUnregister: true,
                setValueAs: (value) => value / 1e5,
              })}
              label="Size"
              description={
                <span>
                  Shares in the certificate (max.{' '}
                  {holding.size.minus(reservedSize).times(1e5).toFixed(0)})
                </span>
              }
              rightSection="shares"
              classNames={{ rightSection: 'w-20' }}
              type="number"
              step="1"
              min="1"
              max={holding.size.minus(reservedSize).times(1e5).toNumber()}
              required
            />
            <table className="text-sm mx-auto">
              <tbody>
                <tr>
                  <td className="text-right pr-4">Starting valuation:</td>
                  <td className="text-right pr-4">
                    ${holding.valuation.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-4">New valuation:</td>
                  <td className="text-right pr-4">
                    $
                    {bondingCurve
                      .valuationAt(
                        bondingCurve
                          .fractionAt(holding.valuation)
                          .plus(watchSize || zero)
                      )
                      .toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-right font-bold pr-4">Cost:</td>
                  <td className="text-right font-bold pr-4">
                    $
                    {bondingCurve
                      .costBetween(holding.valuation, watchSize || zero)
                      .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP)
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <Accordion variant="separated" className="my-6">
              <Accordion.Item value="advanced-options">
                <Accordion.Control>Advanced options</Accordion.Control>
                <Accordion.Panel className="text-sm">
                  <SwitchField
                    {...register('consume', { shouldUnregister: true })}
                    label="Consume immediately"
                    info="You will never be able to resell shares that you have consumed."
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            {watchSize ? (
              <Banner className="text-sm px-4 py-3 my-5">
                When you click “Buy,” you’ll have one week to send{' '}
                {holding.user.name || ''} $
                {bondingCurve
                  .costBetween(holding.valuation, watchSize || zero)
                  .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP)
                  .toFixed(2)}
                .
              </Banner>
            ) : (
              ''
            )}
            <Banner className="text-sm px-4 py-3 my-5">
              Make sure that you trust the recipient to confirm the transaction!
            </Banner>
          </div>
          <DialogCloseButton onClick={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={transactionMutation.isLoading}
            loadingChildren="Saving"
            variant="highlight"
            disabled={!watchSize}
          >
            Buy
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
