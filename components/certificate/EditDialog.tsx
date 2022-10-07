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

type EditFormData = {
  valuation: Prisma.Decimal
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
  }
  isOpen: boolean
  onClose: () => void
}) {
  const { register, watch, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
      valuation: holding.valuation || new Prisma.Decimal('0.00'),
    },
  })
  const watchValuation = watch('valuation')

  const utils = trpc.useContext()
  const transactionMutation = trpc.useMutation('holding.edit', {
    onSuccess: () => {
      utils.invalidateQueries(['holding.feed'])
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
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
        valuation: String(data.valuation),
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
              label="Valuation"
              info="Your minimum valuation of the whole certificate. You won’t receive any lower offers."
              type="number"
              step="0.01"
              required
            />
          </div>
          <p className="mt-5">
            Value of your holding: $
            {new Prisma.Decimal(+holding.size * +watchValuation).toFixed(2)}
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
