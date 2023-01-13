import { useSession } from 'next-auth/react'
import * as React from 'react'

import { BuyDialog } from '@/components/certificate/buyDialog'
import { EditDialog } from '@/components/certificate/editDialog'
import { classNames } from '@/lib/classnames'
import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'
import { Tabs, Tooltip } from '@mantine/core'
import { Prisma } from '@prisma/client'
import { IconAlertCircle } from '@tabler/icons'

import { Author } from '../author'
import { ButtonLink } from '../buttonLink'
import { HoldingsChart } from './holdingsChart'
import { Transactions } from './transactions'

type LedgerProps = {
  isActive: boolean
  certificate: InferQueryOutput<'certificate.detail'>
}

const Holding = ({
  holding,
  userId, // eslint-disable-line @typescript-eslint/no-unused-vars
  isActive,
  simplified = false,
}: {
  holding: InferQueryOutput<'holding.feed'>[0]
  userId?: string
  isActive: boolean
  simplified: boolean
}) => {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  // Fresh keys to force re-mounting of the dialogs
  // https://stackoverflow.com/a/66772917/678861
  const [childKey, setChildKey] = React.useState(1)
  React.useEffect(() => {
    setChildKey((prev) => prev + 1)
  }, [isBuyDialogOpen, isEditDialogOpen])

  const reservedSize = holding.sellTransactions.reduce(
    (aggregator, transaction) => transaction.size.plus(aggregator),
    new Prisma.Decimal(0)
  )
  // Show the edit button only if (1) the viewer is logged in, (2) the viewer wants to see details,
  // and (3) the viewer is admin or the specified user is the owner of the holding. The specified
  // user might be different from the viewer on the profile pages.
  // Reactivate this when ready:
  // const showEditButton =
  //   session &&
  //   !simplified &&
  //   (session!.user.role === 'ADMIN' || holding.user.id === userId)
  // const showBuyButton = session && holding.user.id !== userId
  const showEditButton = false
  const showBuyButton = false
  return (
    <tr key={holding.user.id + holding.type + childKey}>
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
          {showEditButton && (
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
          {showBuyButton && (
            <>
              <ButtonLink
                href="#"
                disabled={!holding.user.paymentUrl}
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
              {!holding.user.paymentUrl && (
                <Tooltip label="This user has not yet entered a payment method on their profile">
                  <span>
                    <IconAlertCircle />
                  </span>
                </Tooltip>
              )}
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

export const Ledger = ({ certificate, isActive }: LedgerProps) => {
  const holdingsQuery = trpc.useQuery([
    'holding.feed',
    {
      certificateId: certificate.id,
    },
  ])
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
      new Prisma.Decimal(0)
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
                    <th className="text-sm text-left">Donors</th>
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
              certificateId={certificate.id}
              userId={session!.user.id}
              simplified={simplified}
            />
          </Tabs.Panel>
        )}
      </Tabs>
    </>
  )
}
