import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

type TagsProps = {
  queryData: InferQueryOutput<'certificate.detail'>|InferQueryOutput<'certificate.feed'>
}

export const Tags = ({ queryData }: TagsProps) => (
  <div className="flex flex-wrap">
    {queryData.tags && (
      <span className="border text-primary border-secondary bg-primary font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
        {queryData.tags}
      </span>
    )}
  </div>
)
