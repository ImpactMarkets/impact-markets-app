import { sortBy } from 'lodash/fp'

import { InferQueryPathAndInput } from '@/lib/trpc'
import { Author } from '@/lib/types'

export function getCertificateQueryPathAndInput(
  id: string
): InferQueryPathAndInput<'certificate.detail'> {
  return [
    'certificate.detail',
    {
      id,
    },
  ]
}

export type CommentFormData = {
  content: string
}

type SortAuthorFirst = (array: Author[]) => Author[]
export const sortAuthorFirst: (author: Author) => SortAuthorFirst = (author) =>
  sortBy((user) => [user.id !== author.id, user.name])
