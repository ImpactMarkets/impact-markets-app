import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

type LabelsProps = {
  queryData: InferQueryOutput<'certificate.detail'>
}

export const Labels = ({ queryData }: LabelsProps) => (
  <div className="flex flex-wrap font-bold text-xs">
    <span className="border text-primary border-secondary bg-primary py-1 px-2 mr-1 mb-1 rounded">
      <a
        href="https://impactmarkets.substack.com/i/64916368/impact-attribution-norm-formerly-attributed-impact"
        target="_blank"
        rel="noreferrer"
        className="link"
      >
        Impact Attribution Norm
      </a>{' '}
      v{queryData.attributedImpactVersion}
    </span>
    {queryData.location && (
      <span className="border text-primary border-secondary bg-primary py-1 px-2 mr-1 mb-1 rounded">
        {queryData.location}
      </span>
    )}
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
