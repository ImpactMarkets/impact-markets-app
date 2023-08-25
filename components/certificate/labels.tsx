import { RouterOutput } from '@/lib/trpc'
import * as React from 'react'

type LabelsProps = {
  queryData: RouterOutput['certificate']['detail']
}

export const Labels = ({ queryData }: LabelsProps) => (
  <div className="flex flex-wrap font-bold text-xs">
    <span className="border text-primary border-secondary bg-primary py-1 px-2 mr-1 mb-1 rounded">
      Right to retroactive funding
    </span>
    <span className="border text-primary border-secondary bg-primary py-1 px-2 mr-1 mb-1 rounded">
      Work: {queryData.actionStart.toISOString().slice(0, 10)} to{' '}
      {queryData.actionEnd.toISOString().slice(0, 10)}
    </span>
    <span className="border text-primary border-secondary bg-primary py-1 px-2 mr-1 mb-1 rounded">
      Impact: all time, unscoped
    </span>
    <span className="border text-primary border-secondary bg-primary py-1 px-2 mr-1 mb-1 rounded">
      No audit
    </span>
  </div>
)
