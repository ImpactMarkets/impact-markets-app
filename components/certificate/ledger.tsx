import { useSession } from 'next-auth/react'
import * as React from 'react'

import { Tabs } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { classNames } from '@/lib/classnames'
import { num } from '@/lib/text'
import { RouterOutput, trpc } from '@/lib/trpc'

import { Author } from '../author'
import { HoldingsChart } from './holdingsChart'

const SHARE_COUNT = new Prisma.Decimal(1e5)

type LedgerProps = {
  isActive: boolean
  certificate: RouterOutput['certificate']['detail']
}

const Holding = ({
  holding,
  userId, // eslint-disable-line @typescript-eslint/no-unused-vars
  isActive, // eslint-disable-line @typescript-eslint/no-unused-vars
  simplified = false,
}: {
  holding: RouterOutput['holding']['feed'][0]
  userId?: string
  isActive: boolean
  simplified: boolean
}) => {
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
    </tr>
  )
}

export const Ledger = ({ certificate, isActive }: LedgerProps) => {
  const holdingsQuery = trpc.holding.feed.useQuery({
    certificateId: certificate.id,
  })
  const holdings = holdingsQuery.data || []

  const { data: session } = useSession()
  // Reactivate this when ready:
  // const { prefersDetailView } = session?.user || {}
  // const simplified = !prefersDetailView
  const simplified = true

  const totalReservedSize = holdings
    .filter((holding) => holding.type === 'RESERVATION')
    .reduce(
      (aggregator, holding) => holding.size.plus(aggregator),
      new Prisma.Decimal(0),
    )

  return (
    <>
      <div className="flex items-center gap-12 my-6">
        <HoldingsChart holdings={holdings} issuers={certificate.issuers} />
      </div>

      <Tabs defaultValue="owners">
        {session && (
          <Tabs.List>
            <Tabs.Tab value="owners">Owners and donors</Tabs.Tab>
          </Tabs.List>
        )}

        <Tabs.Panel value="owners" pt="xs">
          <div className="flex flex-wrap items-start w-full">
            {holdings.some((holding) => holding.type === 'OWNERSHIP') && (
              <table className="table-auto w-full">
                <thead>
                  <tr className="h-10">
                    <th className="text-sm text-left">Owners</th>
                    <th
                      className={classNames(
                        'text-sm text-right',
                        simplified && 'hidden',
                      )}
                    >
                      Shares
                    </th>
                    <th
                      className={classNames(
                        'text-sm text-right',
                        simplified && 'hidden',
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
                    <th className="text-sm text-left">Donors</th>
                    <th
                      className={classNames(
                        'text-sm text-right',
                        simplified && 'hidden',
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
                            simplified && 'hidden',
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
      </Tabs>
    </>
  )
}
