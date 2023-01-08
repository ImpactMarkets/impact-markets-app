import { useSession } from 'next-auth/react'
import * as React from 'react'

import { Transactions } from '@/components/certificate/transactions'
import { InferQueryOutput } from '@/lib/trpc'

export function TransactionFeed({
  user,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  const { data: session } = useSession()

  if (user?.id !== session?.user.id && session?.user.role !== 'ADMIN') {
    return null
  }

  return (
    <>
      <h2 className="text-lg font-bold my-6">Pending transactions</h2>
      <Transactions userId={user.id} showCertificates />
    </>
  )
}
