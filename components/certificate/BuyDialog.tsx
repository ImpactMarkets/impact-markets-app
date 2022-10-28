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
import { trpc } from '@/lib/trpc'
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
        size: String(data.size),
        cost: String(data.cost),
        consume: data.consume,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  const watchSize = watch('size')
  const watchCost = watch('cost')

  const toSize = (value: number) =>
    value.toLocaleString(undefined, {
      maximumFractionDigits: 1,
    })
  const toCost = (value: number) =>
    value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })

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
            {/* Not using NumberInput because onChange is called with only the value, not the field element */}
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
                  {toSize((1 - reservedSize) * 1e5)})
                </span>
              }
              rightSection="shares"
              classNames={{ rightSection: 'w-20' }}
              type="number"
              step="0.1"
              min="0.1"
              max={(+holding.size - reservedSize) * 1e5}
              required
            />
            <TextField
              {...register('cost', { required: true, shouldUnregister: true })}
              label="Cost"
              description={
                <span>
                  Seller’s valuation: ${toCost(+holding.valuation)}, your
                  valuation: $
                  {watchCost && watchSize
                    ? toCost(+watchCost / +watchSize)
                    : '–'}
                  , min. cost: $
                  {toCost(Math.max(+holding.valuation * +watchSize, 1))}
                </span>
              }
              rightSection="USD"
              classNames={{ rightSection: 'w-16' }}
              type="number"
              step="0.01"
              min={Math.max(+holding.valuation * +watchSize, 1)}
              required
            />

            <SwitchField
              {...register('consume', { shouldUnregister: true })}
              label="Consume immediately"
              info="You will never be able to resell shares that you have consumed."
            />

            <Banner className="flex items-center text-sm px-4 py-3 my-5">
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
