import { useRouter } from 'next/router'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from '@/components/dialog'
import { TextField } from '@/components/text-field'
import { trpc } from '@/lib/trpc'
import { InferQueryOutput } from '@/lib/trpc'
import { Button } from '@mantine/core'
import { Decimal } from '@prisma/client/runtime'

type LedgerProps = {
  queryData: InferQueryOutput<'certificate.detail'>
}

export const Ledger = ({ queryData }: LedgerProps) => (
  <div className="flex w-full gap-10">
    {queryData.holdings.some((holding) => holding.type === 'OWNERSHIP') && (
      <div className="flex-auto">
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
                  <td className="px-2">
                    <Button color="blue">Buy</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
    {queryData.holdings.some((holding) => holding.type === 'CONSUMPTION') && (
      <div className="flex-auto relative">
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
    {queryData.holdings.some((holding) => holding.type === 'RESERVATION') && (
      <div className="flex-auto">
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
    {queryData.holdings.some((holding) => holding.type === 'REWARD') && (
      <div className="flex-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-left">Rewarded</th>
              <th className="text-right"></th>
            </tr>
          </thead>
          <tbody>
            {queryData.holdings
              .filter((holding) => holding.type === 'REWARD')
              .map((holding) => (
                <tr key={holding.user.id + holding.type}>
                  <td className="text-left" key="owner">
                    {holding.user.name}
                  </td>
                  <td
                    className="text-right"
                    key="size"
                  >{`$${holding.cost}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)
