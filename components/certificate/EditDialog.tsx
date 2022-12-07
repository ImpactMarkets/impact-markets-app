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
import {
  DEFAULT_TARGET,
  DEFAULT_VALUATION,
  SHARE_COUNT,
  TARGET_FRACTION,
} from '@/lib/constants'
import { num } from '@/lib/text'
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
    certificateId: string
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

  // These *should* be Decimals but they aren’t, so we have to convert them.
  const watchValuation = new Prisma.Decimal(
    watch('valuation') || DEFAULT_VALUATION
  )
  const watchTarget = new Prisma.Decimal(watch('target') || DEFAULT_TARGET)

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
        valuation: new Prisma.Decimal(data.valuation),
        target: new Prisma.Decimal(data.target),
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  // TODO: I’m a bit fuzzy on what’s happening here. I would’ve thought that a hypothetical min.
  // target would be achieved if the bonding curve is close to flat, so with a very small positive
  // k. So if it’s flat enough, valuation * size * 0.9 shouold approxiate the target. But that
  // doesn’t make much sense because if it’s flat, it will never reach the valuation in the first
  // place, and and since flatness is an approximation, it will in fact reach the valuation only
  // at some very large fraction, where the slope is considerable again and the flatness
  // approximation is meaningless. This is all very confusing. We also can’t just plug these
  // numbers into the bonding curve because the slop changes based on the target, so that there’s
  // a feedback loop. It always seems to tend toward some limit when I manually iterate it, but
  // that’s about as far as I’ve gotten. I’m not sure what the right approach is here.
  const minTarget = watchValuation.times(holding.size).times(TARGET_FRACTION)

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>Edit</DialogTitle>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('valuation', { required: true })}
              label="Minimum valuation"
              description="You won’t sell a single share below what valuation?"
              rightSection="USD"
              classNames={{ rightSection: 'w-16' }}
              type="number"
              step="0.01"
              min="1"
              max="1e30"
              required
            />
          </div>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('target', { required: true })}
              label="Fundraising target"
              description={`How much do you hope to raise (min. $${num(
                minTarget.ceil(),
                0
              )})?`}
              rightSection="USD"
              classNames={{ rightSection: 'w-16' }}
              type="number"
              step="0.01"
              min={minTarget.ceil().toNumber()}
              max="1e30"
              required
            />
          </div>
          <table className="text-sm mx-auto mt-6">
            <tbody>
              <tr>
                <td className="text-right pr-4">Shares:</td>
                <td className="text-right pr-4">
                  {num(holding.size.times(SHARE_COUNT), 0)}
                </td>
              </tr>
              <tr>
                <td className="text-right pr-4">Current valuation:</td>
                <td className="text-right pr-4">${num(watchValuation, 0)}</td>
              </tr>
              <tr>
                <td className="text-right pr-4">Maximum valuation:</td>
                <td className="text-right pr-4">
                  $
                  {num(
                    new BondingCurve(watchTarget)
                      .valuationOfSize(watchValuation, holding.size)
                      .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP),
                    0
                  )}
                </td>
              </tr>
              <tr>
                <td className="text-right pr-4">Maximum fundraise:</td>
                <td className="text-right pr-4">
                  $
                  {num(
                    new BondingCurve(watchTarget)
                      .costOfSize(watchValuation, holding.size)
                      .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP),
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
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
