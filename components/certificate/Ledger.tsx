import { useSession } from 'next-auth/react'
import * as React from 'react'

import { BuyDialog } from '@/components/certificate/BuyDialog'
import { InferQueryOutput } from '@/lib/trpc'

import { ButtonLink } from '../button-link'

type LedgerProps = {
  queryData: InferQueryOutput<'certificate.detail'>
}

export const Ledger = ({ queryData }: LedgerProps) => {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = React.useState(false)

  const { data: session } = useSession()

  return (
    <div className="flex w-full gap-10 justify-center">
      {queryData.holdings.some((holding) => holding.type === 'OWNERSHIP') && (
        <div className="flex-auto max-w-xs">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Owned</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {queryData.holdings
                .filter((holding) => holding.type === 'OWNERSHIP')
                .map((holding) => (
                  <tr key={holding.user.id + holding.type}>
                    <td className="text-left" key="owner">
                      {holding.user.name}
                    </td>
                    <td className="text-right" key="size">{`${
                      +holding.size * 100 // https://github.com/microsoft/TypeScript/issues/5710
                    }%`}</td>
                    {holding.user.id !== session!.user.id && (
                      <td className="text-right px-2">
                        <ButtonLink
                          href="#"
                          onClick={() => {
                            setIsBuyDialogOpen(true)
                          }}
                        >
                          <span className="block shrink-0">Buy</span>
                        </ButtonLink>
                        <BuyDialog
                          user={session!.user}
                          holding={holding}
                          isOpen={isBuyDialogOpen}
                          onClose={() => {
                            setIsBuyDialogOpen(false)
                          }}
                        />
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {queryData.holdings.some((holding) => holding.type === 'RESERVATION') && (
        <div className="flex-auto max-w-xs">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Reserved</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {queryData.holdings
                .filter((holding) => holding.type === 'RESERVATION')
                .map((holding) => (
                  <tr key={holding.user.id + holding.type}>
                    <td className="text-left" key="owner">
                      {holding.user.name}
                    </td>
                    <td className="text-right" key="size">{`${
                      +holding.size * 100
                    }%`}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {queryData.holdings.some((holding) => holding.type === 'CONSUMPTION') && (
        <div className="flex-auto relative max-w-xs">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Consumed</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {queryData.holdings
                .filter((holding) => holding.type === 'CONSUMPTION')
                .map((holding) => (
                  <tr key={holding.user.id + holding.type}>
                    <td className="text-left" key="owner">
                      {holding.user.name}
                    </td>
                    <td className="text-right" key="size">{`${
                      +holding.size * 100
                    }%`}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
