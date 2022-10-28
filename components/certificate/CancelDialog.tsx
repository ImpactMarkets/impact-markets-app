import { useSession } from 'next-auth/react'
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

export function CancelDialog({
  transactionId,
  certificateId,
  isOpen,
  onClose,
}: {
  transactionId: number
  certificateId?: number
  isOpen: boolean
  onClose: () => void
}) {
  const { data: session } = useSession()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const cancelTransactionMutation = trpc.useMutation('transaction.cancel', {
    onSuccess: () => {
      certificateId &&
        utils.invalidateQueries(['holding.feed', { certificateId }])
      utils.invalidateQueries([
        'transaction.feed',
        { userId: session!.user.id },
      ])
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
          Are you sure you want to cancel this transaction?
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
            cancelTransactionMutation.mutate(transactionId, {
              onSuccess: () => onClose(),
            })
          }}
        >
          Cancel transaction
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
