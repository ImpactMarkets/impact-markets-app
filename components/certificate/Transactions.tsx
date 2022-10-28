import * as React from 'react'

import { trpc } from '@/lib/trpc'
import { InferQueryPathAndInput } from '@/lib/trpc'
import { TransactionState } from '@prisma/client'

import { AuthorWithDate } from '../author-with-date'
import { ButtonLink } from '../button-link'
import { CancelDialog } from './CancelDialog'
import { ConfirmDialog } from './ConfirmDialog'

function getTransactionQueryPathAndInput(
  userId: string,
  certificateId?: number,
  state?: TransactionState
): InferQueryPathAndInput<'transaction.feed'> {
  return [
    'transaction.feed',
    {
      userId,
      certificateId,
      state,
    },
  ]
}

export type TransactionsFormData = {
  userId: string
  certificateId?: number
}

export const Transactions = ({
  userId,
  certificateId,
}: TransactionsFormData) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false)

  const transactionQueryPathAndInput = getTransactionQueryPathAndInput(
    userId,
    certificateId,
    'PENDING'
  )
  const transactionQuery = trpc.useQuery(transactionQueryPathAndInput)

  if (transactionQuery.isError) {
    return <div>Error: {transactionQuery.error.message}</div>
  }

  if (!transactionQuery.data?.length) {
    return null
  }

  return (
    <div className="flex gap-1 justify-center">
      <table>
        <thead>
          <tr>
            <th className="text-left whitespace-nowrap">Pending purchases</th>
            <th className="text-right pl-5">Size</th>
            <th className="text-right pl-5">Cost</th>
          </tr>
        </thead>
        <tbody>
          {transactionQuery.data.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <div className="pt-[5px] whitespace-nowrap">
                  <AuthorWithDate
                    author={transaction.buyingHolding.user}
                    date={transaction.createdAt}
                  />
                </div>
              </td>
              <td
                className="text-right pl-5 underline underline-offset-1 decoration-dotted"
                title={transaction.consume ? 'To be consumed' : 'To be owned'}
              >
                {(+transaction.size * 1e5).toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}{' '}
                shares
              </td>
              <td className="text-right pl-5">
                $
                {(+transaction.cost).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="text-right px-2">
                <ButtonLink
                  href="#"
                  onClick={() => {
                    setIsCancelDialogOpen(true)
                  }}
                  variant="secondary"
                >
                  <span className="block shrink-0">
                    {/* Call it “Decline” if the user whose profile this is is also the seller;
                    call it cancel if they’re the buyer. This ignores the case where an admin
                    looks at the profile. No other user can see this section. */}
                    {transaction.sellingHolding.user.id === userId
                      ? 'Decline'
                      : 'Cancel'}
                  </span>
                </ButtonLink>
                <CancelDialog
                  transactionId={transaction.id}
                  certificateId={certificateId}
                  isOpen={isCancelDialogOpen}
                  onClose={() => {
                    setIsCancelDialogOpen(false)
                  }}
                />
                {transaction.sellingHolding.user.id === userId && (
                  <>
                    <ButtonLink
                      href="#"
                      className="mx-1"
                      onClick={() => {
                        setIsCancelDialogOpen(true)
                      }}
                    >
                      <span className="block shrink-0">Confirm</span>
                    </ButtonLink>
                    <ConfirmDialog
                      transactionId={transaction.id}
                      certificateId={certificateId}
                      isOpen={isConfirmDialogOpen}
                      onClose={() => {
                        setIsConfirmDialogOpen(false)
                      }}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
