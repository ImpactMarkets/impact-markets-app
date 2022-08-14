import { useRouter } from 'next/router'
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
import { IconButton } from '@/components/icon-button'
import {
  DotsIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  TrashIcon,
} from '@/components/icons'
import {
  Menu as BaseMenu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { getCertificateQueryPathAndInput } from './utils'

type CertificateMenuProps = {
  queryData: InferQueryOutput<'certificate.detail'>
  isUserAdmin: Boolean
  certificateBelongsToUser: Boolean
}

export const CertificateMenu = ({
  queryData,
  isUserAdmin,
  certificateBelongsToUser,
}: CertificateMenuProps) => {
  const router = useRouter()

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false)
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

  function handleEdit() {
    router.push(`/certificate/${queryData?.id}/edit`)
  }

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true)
  }

  if (!(certificateBelongsToUser || isUserAdmin)) {
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
              {certificateBelongsToUser && (
                <>
                  <MenuItemButton onClick={handleEdit}>Edit</MenuItemButton>
                  <MenuItemButton className="!text-red" onClick={handleDelete}>
                    Delete
                  </MenuItemButton>
                </>
              )}
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
        {certificateBelongsToUser && (
          <>
            <IconButton variant="secondary" title="Edit" onClick={handleEdit}>
              <EditIcon className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="secondary"
              title="Delete"
              onClick={handleDelete}
            >
              <TrashIcon className="w-4 h-4 text-red" />
            </IconButton>
          </>
        )}
      </div>

      <ConfirmDeleteDialog
        certificateId={queryData.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false)
        }}
      />

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
  certificateId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const hideCertificateMutation = trpc.useMutation('certificate.hide', {
    onSuccess: () => {
      return utils.invalidateQueries(
        getCertificateQueryPathAndInput(certificateId)
      )
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Hide certificate</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to hide this certificate?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
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
  certificateId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const unhideCertificateMutation = trpc.useMutation('certificate.unhide', {
    onSuccess: () => {
      return utils.invalidateQueries(
        getCertificateQueryPathAndInput(certificateId)
      )
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Unhide certificate</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to unhide this certificate?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
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

function ConfirmDeleteDialog({
  certificateId,
  isOpen,
  onClose,
}: {
  certificateId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const deleteCertificateMutation = trpc.useMutation('certificate.delete', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete certificate</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this certificate?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={deleteCertificateMutation.isLoading}
          loadingChildren="Deleting certificate"
          onClick={() => {
            deleteCertificateMutation.mutate(certificateId, {
              onSuccess: () => router.push('/'),
            })
          }}
        >
          Delete certificate
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}