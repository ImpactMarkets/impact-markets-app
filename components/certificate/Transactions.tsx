import { formatDistanceToNow } from 'date-fns'
import * as React from 'react'

import { InferQueryOutput, trpc } from '@/lib/trpc'
import { InferQueryPathAndInput } from '@/lib/trpc'
import { TransactionState } from '@prisma/client'

function getTransactionQueryPathAndInput(
  userId: string,
  certificateId: number,
  state: TransactionState
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
  certificate: InferQueryOutput<'certificate.detail'>
  user: InferQueryOutput<'user.profile'>
}

export const Transactions = ({ certificate, user }: TransactionsFormData) => {
  const utils = trpc.useContext()
  const transactionQueryPathAndInput = getTransactionQueryPathAndInput(
    user.id,
    certificate.id,
    'PENDING'
  )
  const transactionQuery = trpc.useQuery(transactionQueryPathAndInput)

  if (transactionQuery.data) {
    return (
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-right pl-5">Created</th>
            <th className="text-right pl-5">Size</th>
            <th className="text-right pl-5">Cost</th>
            <th className="text-right pl-5">Consume</th>
          </tr>
        </thead>
        <tbody>
          {transactionQuery.data.map((transaction) => (
            <tr key={transaction.id}>
              <td className="text-right pl-5">
                <time dateTime={transaction.createdAt.toISOString()}>
                  {formatDistanceToNow(transaction.createdAt)}
                </time>{' '}
                ago
              </td>
              <td className="text-right pl-5">{+transaction.size}%</td>
              <td className="text-right pl-5">${+transaction.cost}</td>
              <td className="text-right pl-5">{transaction.consume && '✅'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (transactionQuery.isError) {
    return <div>Error: {transactionQuery.error.message}</div>
  }
}
