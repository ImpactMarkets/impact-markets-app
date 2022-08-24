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

export function ConfirmDialog({
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
  const confirmRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const confirmTransactionMutation = trpc.useMutation('transaction.confirm', {
    onSuccess: () => {
      certificateId &&
        utils.invalidateQueries(['certificate.detail', { id: certificateId }])
      utils.invalidateQueries([
        'transaction.feed',
        { userId: session!.user.id },
      ])
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={confirmRef}>
      <DialogContent>
        <DialogTitle>Confirm transaction</DialogTitle>
        <DialogDescription className="mt-6">
          Do you want to confirm that you have received this transaction?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={confirmTransactionMutation.isLoading}
          loadingChildren="Confirming transaction"
          onClick={() => {
            confirmTransactionMutation.mutate(transactionId, {
              onSuccess: () => onClose(),
            })
          }}
        >
          Confirm transaction
        </Button>
        <Button variant="secondary" onClick={onClose} ref={confirmRef}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
