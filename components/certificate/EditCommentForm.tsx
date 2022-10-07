import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import { MarkdownEditor } from '@/components/markdown-editor'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { CommentFormData, getCertificateQueryPathAndInput } from './utils'

export function EditCommentForm({
  certificateId,
  comment,
  onDone,
}: {
  certificateId: number
  comment: InferQueryOutput<'certificate.detail'>['comments'][number]
  onDone: () => void
}) {
  const utils = trpc.useContext()
  const editCommentMutation = trpc.useMutation('comment.edit', {
    onSuccess: () => {
      return utils.invalidateQueries(
        getCertificateQueryPathAndInput(certificateId)
      )
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })
  const { control, handleSubmit } = useForm<CommentFormData>({
    defaultValues: {
      content: comment.content,
    },
  })

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    editCommentMutation.mutate(
      {
        id: comment.id,
        data: {
          content: data.content,
        },
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
            placeholder="Comment"
            minRows={4}
            autoFocus
          />
        )}
      />
      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          isLoading={editCommentMutation.isLoading}
          loadingChildren="Updating comment"
        >
          Update comment
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
