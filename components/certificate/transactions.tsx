import { useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

import { classNames } from '@/lib/classnames'
import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { AuthorWithDate } from '../authorWithDate'
import { ButtonLink } from '../buttonLink'
import { CancelDialog } from './cancelDialog'
import { ConfirmDialog } from './confirmDialog'

const Transaction = ({
  transaction,
  userId,
  certificateId,
  showCertificates = false,
  simplified = false,
}: {
  transaction: InferQueryOutput<'transaction.feed'>[0]
  userId: string
  certificateId?: string
  showCertificates?: boolean
  simplified?: boolean
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
      <td
        className={classNames(
          'text-left max-w-xs pl-5 overflow-ellipsis',
          showCertificates ? null : 'hidden'
        )}
      >
        <Link
          href={`/certificate/${transaction.sellingHolding.certificate.id}`}
        >
          {transaction.sellingHolding.certificate.title}
        </Link>
      </td>
      <td className={classNames('text-left pl-5', simplified && 'hidden')}>
        {transaction.consume ? 'Consumption' : 'Purchase'}
      </td>
      <td className={classNames('text-right pl-5', simplified && 'hidden')}>
        {num(transaction.size.times(SHARE_COUNT))}
      </td>
      <td className="text-right pl-5">${num(transaction.cost, 2)}</td>
      <td className="text-right pl-5 px-2">
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
                variant="highlight"
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
  simplified = false,
}: {
  userId: string
  certificateId?: string
  showCertificates?: boolean
  simplified?: boolean
}) => {
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
    return <div className="w-full text-center">No pending transactions</div>
  }

  return (
    <div className="text-sm">
      <table className="w-3/4 m-auto">
        <thead>
          <tr>
            <th className="text-left whitespace-nowrap">User</th>
            <th
              className={classNames(
                'text-left pl-5',
                showCertificates ? null : 'hidden'
              )}
            >
              Certificate
            </th>
            <th
              className={classNames('text-left pl-5', simplified && 'hidden')}
            >
              Type
            </th>
            <th
              className={classNames('text-right pl-5', simplified && 'hidden')}
            >
              Shares
            </th>
            <th className="text-right pl-5">Payment</th>
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
              simplified={simplified}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
