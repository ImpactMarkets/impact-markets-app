import * as fp from 'lodash/fp'

import { num } from '@/lib/text'
import { InferQueryOutput } from '@/lib/trpc'
import { Progress } from '@mantine/core'
import { Prisma } from '@prisma/client'

interface HoldingsChartProps {
  holdings:
    | InferQueryOutput<'holding.feed'>
    | InferQueryOutput<'certificate.feed'>['certificates'][number]['holdings']
  issuers: InferQueryOutput<'certificate.feed'>['certificates'][number]['issuers']
}

export function HoldingsChart({ holdings, issuers }: HoldingsChartProps) {
  const issuersIds = issuers.map((issuer) => issuer.user.id)
  type Holding = typeof holdings[number]
  const valueConsumed = fp
    .flow(
      fp.filter((holding: Holding) => holding.type === 'CONSUMPTION'),
      fp.reduce(
        (aggregator, holding) => holding.size.plus(aggregator),
        new Prisma.Decimal(0)
      )
    )(holdings)
    .times(100)
  const valueReservedFromIssuers = fp.flow(
    fp.filter(
      (holding: Holding) =>
        holding.type === 'OWNERSHIP' && issuersIds.includes(holding.user.id)
    ),
    fp.map('sellTransactions'),
    fp.flatten,
    fp.map('size'),
    (sizes) => Prisma.Decimal.sum(...sizes, 0)
  )(holdings)
  const valueReservedFromInvestors = fp.flow(
    fp.filter(
      (holding: Holding) =>
        holding.type === 'OWNERSHIP' && !issuersIds.includes(holding.user.id)
    ),
    fp.map('sellTransactions'),
    fp.flatten,
    fp.map('size'),
    (sizes) => Prisma.Decimal.sum(...sizes, 0)
  )(holdings)
  const valueReserved = valueReservedFromIssuers
    .plus(valueReservedFromInvestors)
    .times(100)
  const valueAvailableFromIssuers = fp
    .flow(
      fp.filter(
        (holding: Holding) =>
          holding.type === 'OWNERSHIP' && issuersIds.includes(holding.user.id)
      ),
      fp.map('size'),
      (sizes) => Prisma.Decimal.sum(...sizes, -valueReservedFromIssuers)
    )(holdings)
    .times(100)
  const valueAvailableFromInvestors = fp
    .flow(
      fp.filter(
        (holding: Holding) =>
          holding.type === 'OWNERSHIP' && !issuersIds.includes(holding.user.id)
      ),
      fp.map('size'),
      (sizes) => Prisma.Decimal.sum(...sizes, -valueReservedFromInvestors)
    )(holdings)
    .times(100)

  const sections = [
    {
      label: valueAvailableFromIssuers.gte(20)
        ? `${num(valueAvailableFromIssuers, 0)}% available`
        : valueAvailableFromIssuers.gte(10)
        ? `${num(valueAvailableFromIssuers, 0)}%`
        : '',
      tooltip: `${num(
        valueAvailableFromIssuers,
        0
      )}% available from the issuers`,
      value: valueAvailableFromIssuers.toNumber(),
      color: '#47d6ab',
    },
    {
      label: valueAvailableFromInvestors.gte(20)
        ? `${num(valueAvailableFromInvestors, 0)}% circulating`
        : valueAvailableFromInvestors.gte(10)
        ? `${num(valueAvailableFromInvestors, 0)}%`
        : '',
      tooltip: `${num(
        valueAvailableFromInvestors,
        0
      )}% available from investors`,
      value: valueAvailableFromInvestors.toNumber(),
      color: '#37c69b',
    },
    {
      label: valueReserved.gte(20)
        ? `${num(valueReserved, 0)}% reserved`
        : valueReserved.gte(10)
        ? `${num(valueReserved, 0)}%`
        : '',
      tooltip: `${num(valueReserved, 0)}% reserved by buyers`,
      value: valueReserved.toNumber(),
      color: '#AAAAAA',
    },
    {
      label: valueConsumed.gte(20)
        ? `${num(valueConsumed, 0)}% donated`
        : valueConsumed.gte(10)
        ? `${num(valueConsumed, 0)}%`
        : '',
      tooltip: `${num(
        valueConsumed,
        0
      )}% donated/consumed and permanently off the market`,
      value: valueConsumed.toNumber(),
      color: '#4fcdf7',
    },
  ]

  return (
    <Progress
      sections={sections}
      classNames={{ label: 'text-sm', root: 'w-full h-8 rounded' }}
    />
  )
}
