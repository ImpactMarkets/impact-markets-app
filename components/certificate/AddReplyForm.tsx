import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import { MarkdownEditor } from '@/components/markdown-editor'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { CommentFormData, getCertificateQueryPathAndInput } from './utils'

export function AddReplyForm({
  certificateId,
  parent,
  onDone,
}: {
  certificateId: string
  parent:
    | InferQueryOutput<'certificate.detail'>['comments'][number]
    | InferQueryOutput<'certificate.detail'>['comments'][number]['children'][number]
  onDone: () => void
}) {
  const utils = trpc.useContext()
  const addReplyMutation = trpc.useMutation('comment.add', {
    onSuccess: () => {
      return utils.invalidateQueries(
        getCertificateQueryPathAndInput(certificateId)
      )
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })
  const { control, handleSubmit, reset } = useForm<CommentFormData>()

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    addReplyMutation.mutate(
      {
        certificateId,
        content: data.content,
        parentId: parent?.id,
      },
      {
        onSuccess: () => onDone(),
      }
    )
  }

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={handleSubmit(onSubmit)}
            required
            placeholder="Reply"
            minRows={4}
            autoFocus
          />
        )}
      />
      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          isLoading={addReplyMutation.isLoading}
          loadingChildren="Adding reply"
        >
          Add reply
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
