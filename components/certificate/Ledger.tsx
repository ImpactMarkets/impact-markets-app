import { useSession } from 'next-auth/react'
import * as React from 'react'

import { BuyDialog } from '@/components/certificate/BuyDialog'
import { EditDialog } from '@/components/certificate/EditDialog'
import { classNames } from '@/lib/classnames'
import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'
import { Tabs } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { Author } from '../author'
import { ButtonLink } from '../button-link'
import { HoldingsChart } from '../holdings-chart'
import { Transactions } from './Transactions'

type LedgerProps = {
  certificateId: string
  isActive: boolean
}

const Holding = ({
  holding,
  userId,
  isActive,
  simplified = false,
}: {
  holding: InferQueryOutput<'holding.feed'>[0]
  userId?: string
  isActive: boolean
  simplified: boolean
}) => {
  const { data: session } = useSession()
  const [isBuyDialogOpen, setIsBuyDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const reservedSize = holding.sellTransactions.reduce(
    (aggregator, transaction) => transaction.size.plus(aggregator),
    new Prisma.Decimal(0)
  )
  return (
    <tr key={holding.user.id + holding.type}>
      <td className="text-sm text-left flex" key="owner">
        <Author author={holding.user} />
      </td>
      <td
        className={classNames('text-sm text-right', simplified && 'hidden')}
        key="size"
      >
        {num(holding.size.times(SHARE_COUNT))}
      </td>
      <td
        className={classNames('text-sm text-right', simplified && 'hidden')}
        key="valuation"
      >
        <>${num(holding.valuation, 0)}</>
      </td>
      <td className="text-sm text-right px-2">
        <div className="flex gap-1">
          {((session && session?.user.role === 'ADMIN') ||
            holding.user.id === userId) && (
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
          )}
          {session && holding.user.id !== userId && (
            <>
              <ButtonLink
                href="#"
                variant="highlight"
                className="h-6"
                onClick={() => {
                  setIsBuyDialogOpen(true)
                }}
              >
                <span className="block shrink-0">
                  {isActive ? 'Donate' : 'Buy'}
                </span>
              </ButtonLink>
              <BuyDialog
                holding={holding}
                reservedSize={reservedSize}
                isActive={isActive}
                isOpen={isBuyDialogOpen}
                onClose={() => {
                  setIsBuyDialogOpen(false)
                }}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export const Ledger = ({ certificateId, isActive }: LedgerProps) => {
  const holdingsQuery = trpc.useQuery([
    'holding.feed',
    {
      certificateId,
    },
  ])
  const holdings = holdingsQuery.data || []

  const { data: session } = useSession()
  const { prefersDetailView } = session?.user || {}
  const simplified = !prefersDetailView

  const totalReservedSize = holdings
    .filter((holding) => holding.type === 'RESERVATION')
    .reduce(
      (aggregator, holding) => holding.size.plus(aggregator),
      new Prisma.Decimal(0)
    )

  return (
    <>
      <div className="flex items-center gap-12 my-6">
        <HoldingsChart holdings={holdings} />
      </div>

      <Tabs defaultValue="owners">
        {session && (
          <Tabs.List>
            <Tabs.Tab value="owners">Owners and consumers</Tabs.Tab>
            <Tabs.Tab value="transactions">Pending transactions</Tabs.Tab>
          </Tabs.List>
        )}

        <Tabs.Panel value="owners" pt="xs">
          <div className="flex flex-wrap items-start justify-center w-full">
            {holdings.some((holding) => holding.type === 'OWNERSHIP') && (
              <table className="table-auto w-2/3">
                <thead>
                  <tr className="h-10">
                    <th className="text-sm text-left">Owners</th>
                    <th
                      className={classNames(
                        'text-sm text-right',
                        simplified && 'hidden'
                      )}
                    >
                      Shares
                    </th>
                    <th
                      className={classNames(
                        'text-sm text-right',
                        simplified && 'hidden'
                      )}
                    >
                      Valuation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holdings
                    .filter((holding) => holding.type === 'OWNERSHIP')
                    .map((holding) => (
                      <Holding
                        key={holding.id}
                        holding={holding}
                        userId={session?.user.id}
                        isActive={isActive}
                        simplified={simplified}
                      />
                    ))}
                  <tr
                    key="Reservation"
                    className={classNames(simplified && 'hidden')}
                  >
                    <td className="text-left text-sm h-10" key="owner">
                      Reserved
                    </td>
                    <td className="text-sm text-right" key="size">
                      {num(totalReservedSize.times(SHARE_COUNT))}
                    </td>
                    <td className="text-sm text-right" key="valuation">
                      –
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {holdings.some((holding) => holding.type === 'CONSUMPTION') && (
              <table className="table-auto w-1/3">
                <thead>
                  <tr className="h-10">
                    <th className="text-sm text-left">Consumers</th>
                    <th
                      className={classNames(
                        'text-sm text-right',
                        simplified && 'hidden'
                      )}
                    >
                      Shares
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holdings
                    .filter((holding) => holding.type === 'CONSUMPTION')
                    .map((holding) => (
                      <tr key={holding.user.id + holding.type}>
                        <td className="text-sm text-left" key="owner">
                          <Author author={holding.user} />
                        </td>
                        <td
                          className={classNames(
                            'text-sm text-right',
                            simplified && 'hidden'
                          )}
                          key="size"
                        >
                          {num(holding.size.times(SHARE_COUNT))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </Tabs.Panel>
        {session && (
          <Tabs.Panel value="transactions" pt="xs">
            <Transactions
              certificateId={certificateId}
              userId={session!.user.id}
              simplified={simplified}
            />
          </Tabs.Panel>
        )}
      </Tabs>
    </>
  )
}
