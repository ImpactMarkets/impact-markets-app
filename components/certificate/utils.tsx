import { InferQueryPathAndInput } from '@/lib/trpc'

export function getCertificateQueryPathAndInput(
  id: number
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
