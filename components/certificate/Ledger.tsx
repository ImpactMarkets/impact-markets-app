import { useSession } from 'next-auth/react'
import * as React from 'react'

import { BuyDialog } from '@/components/certificate/BuyDialog'
import { EditDialog } from '@/components/certificate/EditDialog'
import { trpc } from '@/lib/trpc'

import { ButtonLink } from '../button-link'
import { Transactions } from './Transactions'

type LedgerProps = {
  certificateId: number
}

export const Ledger = ({ certificateId }: LedgerProps) => {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const holdingsQuery = trpc.useQuery([
    'holding.feed',
    {
      certificateId,
    },
  ])
  const holdings = holdingsQuery.data || []

  const { data: session } = useSession()

  const reservedSize = holdings
    .filter((holding) => holding.type === 'RESERVATION')
    .reduce((aggregator, holding) => +holding.size + aggregator, 0)

  return (
    <div className="flex w-full justify-between">
      {holdings.some((holding) => holding.type === 'OWNERSHIP') && (
        <div className="flex-auto max-w-xs">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Owners</th>
                <th className="text-right"></th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {holdings
                .filter((holding) => holding.type === 'OWNERSHIP')
                .map((holding) => (
                  <tr key={holding.user.id + holding.type}>
                    <td className="text-left" key="owner">
                      {holding.user.name}
                    </td>
                    <td className="text-right" key="size">
                      {(+holding.size * 100).toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td className="text-right" key="valuation">
                      <>
                        at $
                        {(+holding.valuation).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </>
                    </td>
                    <td className="text-right px-2">
                      {holding.user.id === session!.user.id ? (
                        <>
                          <ButtonLink
                            href="#"
                            variant="secondary"
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
                ))}
              <tr key="Reservation">
                <td className="text-left" key="owner">
                  Reserved
                </td>
                <td className="text-right" key="size">
                  {(reservedSize * 100).toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                  %
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
                      {(+holding.size * 100).toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}
                      %
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
