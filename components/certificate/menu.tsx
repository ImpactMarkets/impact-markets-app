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
import { IconButton } from '@/components/iconButton'
import { DotsIcon, EyeClosedIcon, EyeIcon } from '@/components/icons'
import {
  Menu as BaseMenu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { RouterOutput, trpc } from '@/lib/trpc'

type MenuProps = {
  queryData: RouterOutput['certificate']['detail']
  isUserAdmin: boolean
  belongsToUser: boolean
}

export const Menu = ({ queryData, isUserAdmin, belongsToUser }: MenuProps) => {
  const [isConfirmHideDialogOpen, setIsConfirmHideDialogOpen] =
    React.useState(false)
  const [isConfirmUnhideDialogOpen, setIsConfirmUnhideDialogOpen] =
    React.useState(false)

  function handleHide() {
    setIsConfirmHideDialogOpen(true)
  }

  function handleUnhide() {
    setIsConfirmUnhideDialogOpen(true)
  }

  if (!(belongsToUser || isUserAdmin)) {
    return null
  }

  return (
    <>
      <div className="flex md:hidden">
        <BaseMenu>
          <MenuButton as={IconButton} variant="secondary" title="More">
            <DotsIcon className="w-4 h-4" />
          </MenuButton>

          <MenuItems className="w-28">
            <MenuItemsContent>
              {isUserAdmin &&
                (queryData.hidden ? (
                  <MenuItemButton onClick={handleUnhide}>Unhide</MenuItemButton>
                ) : (
                  <MenuItemButton onClick={handleHide}>Hide</MenuItemButton>
                ))}
            </MenuItemsContent>
          </MenuItems>
        </BaseMenu>
      </div>
      <div className="hidden md:flex md:gap-4">
        {isUserAdmin &&
          (queryData.hidden ? (
            <IconButton
              variant="secondary"
              title="Unhide"
              onClick={handleUnhide}
            >
              <EyeIcon className="w-4 h-4" />
            </IconButton>
          ) : (
            <IconButton variant="secondary" title="Hide" onClick={handleHide}>
              <EyeClosedIcon className="w-4 h-4" />
            </IconButton>
          ))}
      </div>

      <ConfirmHideDialog
        certificateId={queryData.id}
        isOpen={isConfirmHideDialogOpen}
        onClose={() => {
          setIsConfirmHideDialogOpen(false)
        }}
      />

      <ConfirmUnhideDialog
        certificateId={queryData.id}
        isOpen={isConfirmUnhideDialogOpen}
        onClose={() => {
          setIsConfirmUnhideDialogOpen(false)
        }}
      />
    </>
  )
}

function ConfirmHideDialog({
  certificateId,
  isOpen,
  onClose,
}: {
  certificateId: string
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const hideCertificateMutation = trpc.certificate.hide.useMutation({
    onSuccess: () => {
      return utils.certificate.invalidate()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Hide certificate</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to unpublish this certificate?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          isLoading={hideCertificateMutation.isLoading}
          loadingChildren="Hiding certificate"
          onClick={() => {
            hideCertificateMutation.mutate(certificateId, {
              onSuccess: () => {
                toast.success('Certificate hidden')
                onClose()
              },
            })
          }}
        >
          Hide certificate
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmUnhideDialog({
  certificateId,
  isOpen,
  onClose,
}: {
  certificateId: string
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const unhideCertificateMutation = trpc.certificate.unhide.useMutation({
    onSuccess: () => {
      return utils.certificate.invalidate()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Unhide certificate</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to publish this certificate?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          isLoading={unhideCertificateMutation.isLoading}
          loadingChildren="Unhiding certificate"
          onClick={() => {
            unhideCertificateMutation.mutate(certificateId, {
              onSuccess: () => {
                toast.success('Certificate unhidden')
                onClose()
              },
            })
          }}
        >
          Unhide certificate
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
