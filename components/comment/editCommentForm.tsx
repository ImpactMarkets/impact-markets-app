import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import { MarkdownEditor } from '@/components/markdownEditor'
import { RouterOutput, trpc } from '@/lib/trpc'

import { CommentFormData } from '../utils'

export function EditCommentForm({
  objectId,
  objectType,
  comment,
  onDone,
}: {
  objectId: string
  objectType: 'project' | 'bounty'
  comment:
    | RouterOutput['project']['detail']['comments'][number]
    | RouterOutput['project']['detail']['comments'][number]['children'][number]
    | RouterOutput['bounty']['detail']['comments'][number]
    | RouterOutput['bounty']['detail']['comments'][number]['children'][number]
  onDone: () => void
}) {
  const utils = trpc.useContext()
  const editCommentMutation = trpc.comment.edit.useMutation({
    onSuccess: () => {
      return utils[objectType]['detail'].invalidate({
        id: objectId,
      })
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
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
      },
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
            placeholder="Comment"
            name="content"
            minRows={4}
            autoFocus
            required
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
