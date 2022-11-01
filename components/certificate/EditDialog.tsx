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
import { SHARE_COUNT } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { Prisma } from '@prisma/client'

type EditFormData = {
  valuation: Prisma.Decimal
  target: Prisma.Decimal
}

export function EditDialog({
  holding,
  isOpen,
  onClose,
}: {
  holding: {
    id: number
    certificateId: number
    size: Prisma.Decimal
    valuation: Prisma.Decimal
    target: Prisma.Decimal
  }
  isOpen: boolean
  onClose: () => void
}) {
  const { register, watch, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
      valuation: holding.valuation,
      target: holding.target,
    },
  })
  const watchValuation = watch('valuation')
  const watchTarget = watch('target')

  const utils = trpc.useContext()
  const transactionMutation = trpc.useMutation('holding.edit', {
    onSuccess: () => {
      utils.invalidateQueries(['holding.feed'])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  function handleClose() {
    onClose()
    reset()
  }

  const onSubmit: SubmitHandler<EditFormData> = (data) => {
    transactionMutation.mutate(
      {
        id: holding.id,
        valuation: data.valuation,
        target: data.target,
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
          <DialogTitle>Edit</DialogTitle>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('valuation', { required: true })}
              label="Minimum valuation"
              description="What is the price below which you won’t sell a single share?"
              rightSection="USD"
              classNames={{ rightSection: 'w-16' }}
              type="number"
              step="1"
              min="1"
              required
            />
          </div>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('target', { required: true })}
              label="Target valuation"
              description="What is the valuation that you hope this certificate will reach?"
              rightSection="USD"
              classNames={{ rightSection: 'w-16' }}
              type="number"
              step="1"
              min="1"
              required
            />
          </div>
          <p className="text-sm mt-5">
            Value of your holding ({holding.size.times(SHARE_COUNT).toFixed(0)}{' '}
            shares): ${holding.size.times(watchValuation).toFixed(2)}
          </p>
          <DialogCloseButton onClick={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={transactionMutation.isLoading}
            loadingChildren="Saving"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
