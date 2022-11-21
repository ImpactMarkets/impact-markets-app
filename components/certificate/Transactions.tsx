import { useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { AuthorWithDate } from '../author-with-date'
import { ButtonLink } from '../button-link'
import { CancelDialog } from './CancelDialog'
import { ConfirmDialog } from './ConfirmDialog'

export type TransactionsFormData = {
  userId: string
  certificateId?: string
  showCertificates?: boolean
}

const Transaction = ({
  transaction,
  userId,
  certificateId,
  showCertificates = false,
}: {
  transaction: InferQueryOutput<'transaction.feed'>[0]
  userId: string
  certificateId?: string
  showCertificates?: boolean
}) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false)
  const { data: session } = useSession()

  return (
    <tr key={transaction.id}>
      <td>
        <div className="pt-[5px] whitespace-nowrap">
          <AuthorWithDate
            author={transaction.buyingHolding.user}
            date={transaction.createdAt}
            size="sm"
          />
        </div>
      </td>
      {showCertificates && (
        <td className="text-left max-w-xs pl-5 overflow-ellipsis">
          <Link
            href={`/certificate/${transaction.sellingHolding.certificate.id}`}
          >
            {transaction.sellingHolding.certificate.title}
          </Link>
        </td>
      )}
      <td
        className="text-right pl-5 underline underline-offset-1 decoration-dotted"
        title={transaction.consume ? 'To be consumed' : 'To be owned'}
      >
        {num(transaction.size.times(SHARE_COUNT))}
      </td>
      <td className="text-right pl-5">${num(transaction.cost, 2)}</td>
      <td className="text-right px-2">
        <div className="flex gap-1">
          {(session?.user.role === 'ADMIN' ||
            transaction.buyingHolding.user.id === userId) && (
            <div>
              <ButtonLink
                href="#"
                onClick={() => {
                  setIsCancelDialogOpen(true)
                }}
                variant="secondary"
                className="h-6"
              >
                <span className="block shrink-0">Cancel</span>
              </ButtonLink>
              <CancelDialog
                transaction={transaction}
                certificateId={certificateId}
                isOpen={isCancelDialogOpen}
                onClose={() => {
                  setIsCancelDialogOpen(false)
                }}
              />
            </div>
          )}
          {(session?.user.role === 'ADMIN' ||
            transaction.sellingHolding.user.id === userId) && (
            <div>
              <ButtonLink
                href="#"
                onClick={() => {
                  setIsConfirmDialogOpen(true)
                }}
                className="h-6"
              >
                <span className="block shrink-0">Confirm</span>
              </ButtonLink>
              <ConfirmDialog
                transaction={transaction}
                certificateId={certificateId}
                isOpen={isConfirmDialogOpen}
                onClose={() => {
                  setIsConfirmDialogOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export const Transactions = ({
  userId,
  certificateId,
  showCertificates = false,
}: TransactionsFormData) => {
  const transactionQuery = trpc.useQuery([
    'transaction.feed',
    {
      userId,
      certificateId,
      state: 'PENDING',
    },
  ])

  if (transactionQuery.isError) {
    return <div>Error: {transactionQuery.error.message}</div>
  }

  if (!transactionQuery.data?.length) {
    return null
  }

  return (
    <div className="flex flex-col justify-center text-sm">
      <table>
        <thead>
          <tr>
            <th className="text-left whitespace-nowrap">Buyer</th>
            {showCertificates && (
              <th className="text-left pl-5">Certificate</th>
            )}
            <th className="text-right pl-5">Shares</th>
            <th className="text-right pl-5">Cost</th>
          </tr>
        </thead>
        <tbody>
          {transactionQuery.data.map((transaction) => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              userId={userId}
              certificateId={certificateId}
              showCertificates={showCertificates}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
