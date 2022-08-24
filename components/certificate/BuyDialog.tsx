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

import { SwitchField } from '../switch-field'

type BuyFormData = {
  size: Prisma.Decimal
  cost: Prisma.Decimal
  consume: boolean
}

export function BuyDialog({
  user,
  holding,
  isOpen,
  onClose,
}: {
  user: {
    id: string
  }
  holding: {
    id: number
    certificateId: number
    size: Prisma.Decimal
  }
  isOpen: boolean
  onClose: () => void
}) {
  const { register, handleSubmit, reset } = useForm<BuyFormData>({
    defaultValues: {
      size: new Prisma.Decimal('0.00'),
      cost: new Prisma.Decimal('0.00'),
      consume: false,
    },
  })
  const utils = trpc.useContext()
  const transactionMutation = trpc.useMutation('transaction.add', {
    onSuccess: () => {
      window.location.reload()
      return utils.invalidateQueries(['certificate.detail'])
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  function handleClose() {
    onClose()
    reset()
  }

  const onSubmit: SubmitHandler<BuyFormData> = (data) => {
    transactionMutation.mutate(
      {
        userId: user.id,
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

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>Buy</DialogTitle>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('size', { required: true })}
              label="Size"
              type="number"
              step="0.001"
              required
            />
            <TextField
              {...register('cost', { required: true })}
              label="Cost"
              type="number"
              step="0.01"
              required
            />
            <SwitchField
              {...register('consume')}
              label="Consume immediately"
              info="You will never be able to resell shares that you have consumed."
            />
          </div>
          <DialogCloseButton onClick={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={transactionMutation.isLoading}
            loadingChildren="Saving"
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
