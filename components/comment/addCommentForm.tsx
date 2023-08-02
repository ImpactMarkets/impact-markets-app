import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import { MarkdownEditor } from '@/components/markdownEditor'
import { trpc } from '@/lib/trpc'
import { CommentType } from '@prisma/client'

import { CommentFormData } from '../utils'

export function AddCommentForm({
  objectId,
  objectType,
  category,
}: {
  objectId: string
  objectType: 'project' | 'bounty'
  category: CommentType
}) {
  const [markdownEditorKey, setMarkdownEditorKey] = React.useState(0)
  const utils = trpc.useContext()
  const addCommentMutation = trpc.useMutation('comment.add', {
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
  const { control, handleSubmit, reset } = useForm<CommentFormData>()

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    console.log(`the data to be submitted is: ${data}`)
    addCommentMutation.mutate(
      {
        objectId,
        objectType,
        content: data.content,
        category,
      },
      {
        // IS THIS DOING ANYTHING?
        // when i try logging to the console on the line above "reset," nothing happens
        onSuccess: () => {
          reset({ content: '' })
          setMarkdownEditorKey((markdownEditorKey) => markdownEditorKey + 1)
        },
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
            key={markdownEditorKey}
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={handleSubmit(onSubmit)}
            placeholder="Type your comment here."
            minRows={4}
            data-testid={`comment-form-${category}`}
            required
          />
        )}
      />
      <div className="mt-4">
        <Button
          type="submit"
          isLoading={addCommentMutation.isLoading}
          loadingChildren="Submitting"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
