import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import { MarkdownEditor } from '@/components/markdownEditor'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { CommentFormData } from '../utils'

export function AddReplyForm({
  objectId,
  objectType,
  parent,
  onDone,
}: {
  objectId: string
  objectType: 'project' | 'bounty'
  parent:
    | InferQueryOutput<'project.detail'>['comments'][number]
    | InferQueryOutput<'project.detail'>['comments'][number]['children'][number]
    | InferQueryOutput<'bounty.detail'>['comments'][number]
    | InferQueryOutput<'bounty.detail'>['comments'][number]['children'][number]
  onDone: () => void
}) {
  const utils = trpc.useContext()
  const addReplyMutation = trpc.useMutation('comment.add', {
    onSuccess: () => {
      return utils.invalidateQueries([
        (objectType + '.detail') as 'project.detail' | 'bounty.detail',
        {
          id: objectId,
        },
      ])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })
  const { control, handleSubmit } = useForm<CommentFormData>()

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    addReplyMutation.mutate(
      {
        objectId,
        objectType,
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
