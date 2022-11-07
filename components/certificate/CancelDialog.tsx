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
import { SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'

export function CancelDialog({
  transaction,
  certificateId,
  isOpen,
  onClose,
}: {
  transaction: InferQueryOutput<'transaction.feed'>[0]
  certificateId?: string
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const cancelTransactionMutation = trpc.useMutation('transaction.cancel', {
    onSuccess: () => {
      certificateId &&
        utils.invalidateQueries(['holding.feed', { certificateId }])
      utils.invalidateQueries(['transaction.feed'])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Cancel transaction</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to cancel this transaction over{' '}
          {num(transaction.size.times(SHARE_COUNT))} shares?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={cancelTransactionMutation.isLoading}
          loadingChildren="Canceling transaction"
          onClick={() => {
            cancelTransactionMutation.mutate(transaction.id, {
              onSuccess: () => onClose(),
            })
          }}
        >
          Cancel transaction
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
