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
import { classNames } from '@/lib/classnames'
import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { trpc } from '@/lib/trpc'
import { Accordion, Switch, Tabs } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { Banner } from '../banner'
import { InfoTooltip } from '../info-tooltip'

type BuyFormData = {
  size: Prisma.Decimal
  cost: Prisma.Decimal
  consume: boolean
}

export function BuyDialog({
  holding,
  reservedSize,
  isActive,
  isOpen,
  onClose,
}: {
  holding: {
    id: number
    certificateId: string
    size: Prisma.Decimal
    valuation: Prisma.Decimal
    target: Prisma.Decimal
    user: {
      name: string | null
    }
  }
  reservedSize: Prisma.Decimal
  isActive: boolean
  isOpen: boolean
  onClose: () => void
}) {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<BuyFormData>({
      defaultValues: {
        consume: false,
      },
    })
  const utils = trpc.useContext()
  const { data: session } = useSession()
  const simplified = !session!.user.prefersDetailView
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
        size: new Prisma.Decimal(data.size),
        consume: data.consume,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  const watchSize = watch('size')
  const watchCost = watch('cost')
  const zero = new Prisma.Decimal(0)

  const bondingCurve = new BondingCurve(holding.target)

  const costOfSize = (size: Prisma.Decimal) =>
    bondingCurve
      .costOfSize(
        holding.valuation,
        new Prisma.Decimal(size || zero),
        reservedSize
      )
      .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP)
  const sharesOfCost = (cost: Prisma.Decimal) =>
    bondingCurve
      .sizeOfCost(
        holding.valuation,
        new Prisma.Decimal(cost || zero),
        reservedSize
      )
      .times(SHARE_COUNT)
      .toDecimalPlaces(0, Prisma.Decimal.ROUND_DOWN)

  const valuationFraction = bondingCurve.fractionAtValuation(holding.valuation)
  const startingValuation = bondingCurve.valuationAtFraction(
    valuationFraction.plus(reservedSize)
  )
  const newValuation = bondingCurve.valuationAtFraction(
    bondingCurve
      .fractionAtValuation(holding.valuation)
      .plus(reservedSize)
      .plus(new Prisma.Decimal(watchSize || zero))
  )
  const maxCost = bondingCurve.costBetweenFractions(
    valuationFraction.plus(reservedSize),
    valuationFraction.plus(holding.size)
  )
  const cost = costOfSize(watchSize)
  const shares = sharesOfCost(watchCost)

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>
            {isActive ? (
              <span>
                Donate
                <InfoTooltip text="Are you an accredited investor and would you like to buy and sell shares in this project? Contact us to prove your accredited investor status." />
              </span>
            ) : (
              <span>Buy</span>
            )}
          </DialogTitle>
          <div className="mt-6 space-y-6">
            <Tabs defaultValue="cost">
              {simplified ? null : (
                <Tabs.List>
                  <Tabs.Tab value="cost">Enter USD</Tabs.Tab>
                  <Tabs.Tab value="shares">Enter shares</Tabs.Tab>
                </Tabs.List>
              )}

              <Tabs.Panel value="cost" pt="xs">
                {/* Not using NumberInput because onChange is called with only the value,
                not the field element */}
                <div className="mt-3">
                  <TextField
                    {...register('cost', {
                      shouldUnregister: true,
                      onChange: (event) =>
                        setValue(
                          'size',
                          sharesOfCost(
                            new Prisma.Decimal(event.target.valueAsNumber)
                          )
                        ),
                    })}
                    label="Payment"
                    description={
                      simplified ? (
                        'How much would you like to spend?'
                      ) : (
                        <span>
                          USD you want to pay for shares in the certificate
                          (max. ${num(maxCost, 2)})
                        </span>
                      )
                    }
                    rightSection="USD"
                    classNames={{ rightSection: 'w-20' }}
                    type="number"
                    step="0.01"
                    min="1"
                    max={maxCost.toNumber()}
                    required
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="shares" pt="xs">
                {/* Not using NumberInput because onChange is called with only the value,
                not the field element */}
                <div className="mt-3">
                  <TextField
                    {...register('size', {
                      shouldUnregister: true,
                      setValueAs: (value) => value / SHARE_COUNT,
                      onChange: (event) =>
                        setValue(
                          'cost',
                          costOfSize(
                            new Prisma.Decimal(
                              event.target.valueAsNumber / SHARE_COUNT
                            )
                          )
                        ),
                    })}
                    label="Size"
                    description={
                      <span>
                        Shares in the certificate (max.{' '}
                        {num(
                          holding.size.minus(reservedSize).times(SHARE_COUNT)
                        )}
                        )
                      </span>
                    }
                    rightSection="shares"
                    classNames={{ rightSection: 'w-20' }}
                    type="number"
                    step="1"
                    min="1"
                    max={holding.size
                      .minus(reservedSize)
                      .times(SHARE_COUNT)
                      .toNumber()}
                    required
                  />
                </div>
              </Tabs.Panel>
            </Tabs>

            <table
              className={classNames(
                'text-sm mx-auto mt-6',
                simplified && 'hidden'
              )}
            >
              <tbody>
                <tr>
                  <td className="text-right pr-4">Starting valuation:</td>
                  <td className="text-right pr-4">
                    ${num(startingValuation, 2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-4">New valuation:</td>
                  <td className="text-right pr-4">${num(newValuation, 2)}</td>
                </tr>
                <tr>
                  <td className="text-right font-bold pr-4">Shares:</td>
                  <td className="text-right font-bold pr-4">
                    {num(shares, 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-right font-bold pr-4">Cost:</td>
                  <td className="text-right font-bold pr-4">${num(cost, 2)}</td>
                </tr>
              </tbody>
            </table>

            <Accordion
              variant="separated"
              className={classNames(
                'my-6',
                isActive || simplified ? 'hidden' : null
              )}
            >
              <Accordion.Item value="advanced-options">
                <Accordion.Control>Advanced options</Accordion.Control>
                <Accordion.Panel className="text-sm">
                  <p className="mb-6">
                    Change only if you know exactly what you’re doing.
                  </p>
                  <Switch
                    {...register('consume', { shouldUnregister: true })}
                    label="Consume immediately"
                    description="You will never be able to resell shares that you have consumed. Think of it as a donation."
                    classNames={{
                      input: 'rounded-full !bg-auto !bg-left',
                      label: 'text-red',
                    }}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            {watchSize ? (
              <Banner className="text-sm px-4 py-3 my-5">
                When you click “{isActive ? 'Donate' : 'Buy'},” you’ll have one
                week to send {holding.user.name || ''} ${num(cost, 2)} or to
                cancel the transaction.
              </Banner>
            ) : (
              ''
            )}
            <Banner className="text-sm font-normal px-4 py-3 my-5">
              <ol className="list-decimal list-outside m-2 ml-5">
                <li>
                  I’ve checked that{' '}
                  <a
                    href={`/profile/${holding.user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    {holding.user.name}
                  </a>{' '}
                  is who they claim to be.
                </li>
                <li>
                  The{' '}
                  <a
                    href={holding.user.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    proposed payment method
                  </a>{' '}
                  works for me.
                </li>
                <li>
                  I trust{' '}
                  <a
                    href={`/profile/${holding.user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    {holding.user.name}
                  </a>{' '}
                  to confirm my transaction.
                </li>
              </ol>
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
            {isActive ? 'Donate' : 'Buy'}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
