import { num } from '@/lib/text'
import { InferQueryOutput } from '@/lib/trpc'
import { Progress } from '@mantine/core'
import { Prisma } from '@prisma/client'

interface HoldingsChartProps {
  holdings:
    | InferQueryOutput<'holding.feed'>
    | InferQueryOutput<'certificate.feed'>['certificates'][number]['holdings']
}

export function HoldingsChart({ holdings }: HoldingsChartProps) {
  const totalSize = (type: 'OWNERSHIP' | 'RESERVATION' | 'CONSUMPTION') =>
    holdings
      .filter((holding) => holding.type === type)
      .reduce(
        (aggregator, holding) => holding.size.plus(aggregator),
        new Prisma.Decimal(0)
      )
  const valueConsumed = totalSize('CONSUMPTION').times(100)
  const valueReserved = totalSize('RESERVATION').times(100)
  const valueAvailable = totalSize('OWNERSHIP').times(100).minus(valueReserved)

  const sections = [
    {
      label: valueAvailable.gte(20)
        ? `${num(valueAvailable, 0)}% available`
        : valueAvailable.gte(10)
        ? `${num(valueAvailable, 0)}%`
        : '',
      tooltip: `${num(valueAvailable, 0)}% available for purchase`,
      value: valueAvailable.toNumber(),
      color: '#47d6ab',
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
