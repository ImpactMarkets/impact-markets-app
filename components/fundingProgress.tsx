import React from 'react'

import { Tooltip } from '@/lib/mantine'
import { Progress } from '@mantine/core'

interface ProgressBarProps {
  quarterDonationTotal: string
  fundingGoal: string
  classNames: {
    label: string
    root: string
  }
  showLabels: boolean
}

export const FundingProgress: React.FC<ProgressBarProps> = ({
  quarterDonationTotal,
  fundingGoal,
  classNames,
  showLabels = true,
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
        <Progress.Root classNames={classNames}>
          <Progress.Section value={percentFunded} color="#47d6ab">
            {showLabels && (
              <Progress.Label>
                {`${percentFunded}% funded ${percentFunded >= 50 ? 'this quarter' : ''}`}
              </Progress.Label>
            )}
          </Progress.Section>
          {percentFunded < 100 && (
            <Progress.Section value={percentNeeded} color="#AAAAAA">
              {showLabels && (
                <Progress.Label>
                  {`${percentNeeded}% needed ${percentNeeded > 50 ? 'this quarter' : ''}`}
                </Progress.Label>
              )}
            </Progress.Section>
          )}
        </Progress.Root>
      </Tooltip>
    </div>
  )
}
