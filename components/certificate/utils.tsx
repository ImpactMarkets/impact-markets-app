import { InferQueryPathAndInput } from '@/lib/trpc'

export function getPostQueryPathAndInput(
  id: number
): InferQueryPathAndInput<'post.detail'> {
  return [
    'post.detail',
    {
      id,
    },
  ]
}

export type CommentFormData = {
  content: string
}
