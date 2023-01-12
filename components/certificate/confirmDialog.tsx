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
import { num } from '@/lib/text'
import { InferQueryOutput, trpc } from '@/lib/trpc'

export function ConfirmDialog({
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
  const confirmRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const confirmTransactionMutation = trpc.useMutation('transaction.confirm', {
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
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={confirmRef}>
      <DialogContent>
        <DialogTitle>Confirm transaction</DialogTitle>
        <DialogDescription className="mt-6">
          Do you want to confirm that you have received the payment of $
          {num(transaction.cost, 2)} from {transaction.buyingHolding.user.name}?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="highlight"
          isLoading={confirmTransactionMutation.isLoading}
          loadingChildren="Confirming transaction"
          onClick={() => {
            confirmTransactionMutation.mutate(transaction.id, {
              onSuccess: () => onClose(),
            })
          }}
        >
          Confirm transaction
        </Button>
        <Button variant="secondary" onClick={onClose} ref={confirmRef}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}