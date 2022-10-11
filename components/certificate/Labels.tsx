import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

type LabelsProps = {
  queryData: InferQueryOutput<'certificate.detail'>
}

export const Labels = ({ queryData }: LabelsProps) => (
  <div className="flex flex-wrap">
    <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
      <a
        href="https://impactmarkets.substack.com/i/64916368/impact-attribution-norm-formerly-attributed-impact"
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        Attributed Impact
      </a>{' '}
      v{queryData.attributedImpactVersion}
    </span>
    <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
      <a
        href={queryData.proof}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        Proof
      </a>
    </span>
    {queryData.location && (
      <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
        {queryData.location}
      </span>
    )}
    <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
      Right to retroactive funding
    </span>
    <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
      Action: {queryData.actionStart.toISOString().slice(0, 10)} to{' '}
      {queryData.actionEnd.toISOString().slice(0, 10)}
    </span>
    <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
      Impact: all time
    </span>
    <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
      No audit
    </span>
    {queryData.tags && (
      <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
        {queryData.tags}
      </span>
    )}
  </div>
)
