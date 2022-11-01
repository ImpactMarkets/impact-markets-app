import { useSession } from 'next-auth/react'
import * as React from 'react'

import { BuyDialog } from '@/components/certificate/BuyDialog'
import { EditDialog } from '@/components/certificate/EditDialog'
import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'
import { Prisma } from '@prisma/client'

import { Author } from '../author'
import { ButtonLink } from '../button-link'
import { Transactions } from './Transactions'

type LedgerProps = {
  certificateId: number
}

const Holding = ({
  holding,
  userId,
}: {
  holding: InferQueryOutput<'holding.feed'>[0]
  userId: string
}) => {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const reservedSize = holding.sellTransactions.reduce(
    (aggregator, transaction) => transaction.size.plus(aggregator),
    new Prisma.Decimal(0)
  )
  return (
    <tr key={holding.user.id + holding.type}>
      <td className="text-left" key="owner">
        <Author author={holding.user} />
      </td>
      <td className="text-right" key="size">
        {num(holding.size.times(SHARE_COUNT))}
      </td>
      <td className="text-right" key="valuation">
        <>${num(holding.valuation, 0)}</>
      </td>
      <td className="text-right px-2">
        {holding.user.id === userId ? (
          <>
            <ButtonLink
              href="#"
              variant="secondary"
              className="h-6"
              onClick={() => {
                setIsEditDialogOpen(true)
              }}
            >
              <span className="block shrink-0">Edit</span>
            </ButtonLink>
            <EditDialog
              holding={holding}
              isOpen={isEditDialogOpen}
              onClose={() => {
                setIsEditDialogOpen(false)
              }}
            />
          </>
        ) : (
          <>
            <ButtonLink
              href="#"
              variant="highlight"
              className="h-6"
              onClick={() => {
                setIsBuyDialogOpen(true)
              }}
            >
              <span className="block shrink-0">Buy</span>
            </ButtonLink>
            <BuyDialog
              holding={holding}
              reservedSize={reservedSize}
              isOpen={isBuyDialogOpen}
              onClose={() => {
                setIsBuyDialogOpen(false)
              }}
            />
          </>
        )}
      </td>
    </tr>
  )
}

export const Ledger = ({ certificateId }: LedgerProps) => {
  const holdingsQuery = trpc.useQuery([
    'holding.feed',
    {
      certificateId,
    },
  ])
  const holdings = holdingsQuery.data || []

  const { data: session } = useSession()

  const totalReservedSize = holdings
    .filter((holding) => holding.type === 'RESERVATION')
    .reduce(
      (aggregator, holding) => holding.size.plus(aggregator),
      new Prisma.Decimal(0)
    )

  return (
    <div className="flex w-full gap-6 justify-between items-start text-sm flex-col md:flex-row">
      {holdings.some((holding) => holding.type === 'OWNERSHIP') && (
        <div className="flex-auto max-w-sm">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Owners</th>
                <th className="text-right">Shares</th>
                <th className="text-right">Valuation</th>
              </tr>
            </thead>
            <tbody>
              {holdings
                .filter((holding) => holding.type === 'OWNERSHIP')
                .map((holding) => (
                  <Holding
                    key={holding.id}
                    holding={holding}
                    userId={session!.user.id}
                  />
                ))}
              <tr key="Reservation">
                <td className="text-left pl-11 h-9" key="owner">
                  Reserved
                </td>
                <td className="text-right" key="size">
                  {num(totalReservedSize.times(SHARE_COUNT))}
                </td>
                <td className="text-right" key="valuation">
                  –
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {holdings.some((holding) => holding.type === 'CONSUMPTION') && (
        <div className="flex-auto relative max-w-xs">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Consumed</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {holdings
                .filter((holding) => holding.type === 'CONSUMPTION')
                .map((holding) => (
                  <tr key={holding.user.id + holding.type}>
                    <td className="text-left" key="owner">
                      {holding.user.name}
                    </td>
                    <td className="text-right" key="size">
                      {num(holding.size.times(SHARE_COUNT))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Transactions certificateId={certificateId} userId={session!.user.id} />
    </div>
  )
}
