import * as React from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/button'
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import { trpc } from '@/lib/trpc'

export function ConfirmDeleteCommentDialog({
  objectId,
  objectType,
  commentId,
  isOpen,
  onClose,
}: {
  objectId: string
  objectType: 'project' | 'bounty'
  commentId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const deleteCommentMutation = trpc.comment.delete.useMutation({
    onSuccess: () => {
      return utils[objectType]['detail'].invalidate({
        id: objectId,
      })
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete comment</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this comment?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          className="!text-red"
          isLoading={deleteCommentMutation.isLoading}
          loadingChildren="Deleting comment"
          onClick={() => {
            deleteCommentMutation.mutate(commentId, {
              onSuccess: () => onClose(),
            })
          }}
        >
          Delete comment
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
