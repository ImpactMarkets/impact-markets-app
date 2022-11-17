import { InferQueryOutput, trpc } from '@/lib/trpc'
import { Progress } from '@mantine/core'
import { Prisma } from '@prisma/client'

interface HoldingsChartProps {
  certificate:
    | InferQueryOutput<'certificate.detail'>
    | InferQueryOutput<'certificate.feed'>['certificates'][number]
}

export function HoldingsChart({ certificate }: HoldingsChartProps) {
  const holdingsQuery = trpc.useQuery([
    'holding.feed',
    {
      certificateId: certificate.id,
    },
  ])
  const holdings = holdingsQuery.data || []

  const totalSize = (type: 'OWNERSHIP' | 'RESERVATION' | 'CONSUMPTION') =>
    holdings
      .filter((holding) => holding.type === type)
      .reduce(
        (aggregator, holding) => holding.size.plus(aggregator),
        new Prisma.Decimal(0)
      )
  const valueConsumed = totalSize('CONSUMPTION').times(100).toNumber()
  const valueReserved = totalSize('RESERVATION').times(100).toNumber()
  const valueAvailable =
    totalSize('OWNERSHIP').times(100).toNumber() - valueReserved

  const sections = [
    {
      label:
        valueAvailable >= 20
          ? `${valueAvailable}% available`
          : valueAvailable >= 10
          ? `${valueAvailable}%`
          : '',
      tooltip: `${valueAvailable}% available for purchase`,
      value: valueAvailable,
      color: '#47d6ab',
    },
    {
      label:
        valueReserved >= 20
          ? `${valueReserved}% reserved`
          : valueReserved >= 10
          ? `${valueReserved}%`
          : '',
      tooltip: `${valueReserved}% reserved by buyers`,
      value: valueReserved,
      color: '#AAAAAA',
    },
    {
      label:
        valueConsumed >= 20
          ? `${valueConsumed}% consumed`
          : valueConsumed >= 10
          ? `${valueConsumed}%`
          : '',
      tooltip: `${valueConsumed}% consumed and permanently off the market`,
      value: valueConsumed,
      color: '#4fcdf7',
    },
  ]

  return (
    <Progress
      sections={sections}
      classNames={{ label: 'text-sm', root: 'w-full h-8' }}
    />
  )
}
