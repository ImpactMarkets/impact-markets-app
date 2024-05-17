import React from 'react'

import { Progress } from '@mantine/core'

import { Tooltip } from '@/lib/mantine'

interface ProgressBarProps {
  quarterDonationTotal: string
  fundingGoal: string
}

export const FundingProgress: React.FC<ProgressBarProps> = ({
  quarterDonationTotal,
  fundingGoal,
}) => {
  // sanitize input values
  const sanitizeNumString = (str: string) => {
    return str.replace(/[^0-9.-]/g, '')
  }

  // sanitize and convert Decimal string values to numbers
  const quarterDonationTotalNum = parseFloat(
    sanitizeNumString(quarterDonationTotal.trim()),
  )

  const fundingGoalNum = parseFloat(sanitizeNumString(fundingGoal.trim()))

  const percentFunded =
    fundingGoalNum > 0
      ? Math.round((quarterDonationTotalNum / fundingGoalNum) * 100)
      : 0
  const percentNeeded = 100 - percentFunded

  return (
    <div className="text-sm text-secondary whitespace-nowrap">
      <Tooltip
        label={`$${quarterDonationTotalNum} / $${fundingGoalNum} raised this quarter`}
      >
        <Progress.Root
          classNames={{ label: 'text-sm', root: 'w-full h-8 rounded mt-5' }}
        >
          <Progress.Section value={percentFunded} color="#47d6ab">
            <Progress.Label>{`${percentFunded}% funded`}</Progress.Label>
          </Progress.Section>
          <Progress.Section value={percentNeeded} color="#AAAAAA">
            <Progress.Label>{`${percentNeeded}% needed this quarter`}</Progress.Label>
          </Progress.Section>
        </Progress.Root>
      </Tooltip>
    </div>
  )
}
