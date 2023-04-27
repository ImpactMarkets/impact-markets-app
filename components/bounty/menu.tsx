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
import { IconButton } from '@/components/iconButton'
import { DotsIcon, EditIcon, EyeClosedIcon, EyeIcon } from '@/components/icons'
import {
  Menu as BaseMenu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { InferQueryOutput, trpc } from '@/lib/trpc'

type MenuProps = {
  queryData: InferQueryOutput<'bounty.detail'>
  isUserAdmin: boolean
  belongsToUser: boolean
}

export const Menu = ({ queryData, isUserAdmin, belongsToUser }: MenuProps) => {
  const router = useRouter()

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
    router.push(`${router.asPath}/edit`)
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
              {(isUserAdmin || belongsToUser) && (
                <MenuItemButton onClick={handleEdit}>Edit</MenuItemButton>
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
        {(isUserAdmin || belongsToUser) && (
          <IconButton variant="secondary" title="Edit" onClick={handleEdit}>
            <EditIcon className="w-4 h-4" />
          </IconButton>
        )}
      </div>

      <ConfirmHideDialog
        bountyId={queryData.id}
        isOpen={isConfirmHideDialogOpen}
        onClose={() => {
          setIsConfirmHideDialogOpen(false)
        }}
      />

      <ConfirmUnhideDialog
        bountyId={queryData.id}
        isOpen={isConfirmUnhideDialogOpen}
        onClose={() => {
          setIsConfirmUnhideDialogOpen(false)
        }}
      />
    </>
  )
}

function ConfirmHideDialog({
  bountyId,
  isOpen,
  onClose,
}: {
  bountyId: string
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const hideProjectMutation = trpc.useMutation('bounty.hide', {
    onSuccess: () => {
      return utils.invalidateQueries([
        'bounty.detail',
        {
          id: bountyId,
        },
      ])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Hide bounty</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to unpublish this bounty?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          isLoading={hideProjectMutation.isLoading}
          loadingChildren="Hiding bounty"
          onClick={() => {
            hideProjectMutation.mutate(bountyId, {
              onSuccess: () => {
                toast.success('Project hidden')
                onClose()
              },
            })
          }}
        >
          Hide bounty
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmUnhideDialog({
  bountyId,
  isOpen,
  onClose,
}: {
  bountyId: string
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const unhideProjectMutation = trpc.useMutation('bounty.unhide', {
    onSuccess: () => {
      return utils.invalidateQueries([
        'bounty.detail',
        {
          id: bountyId,
        },
      ])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Unhide bounty</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to publish this bounty?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          isLoading={unhideProjectMutation.isLoading}
          loadingChildren="Unhiding bounty"
          onClick={() => {
            unhideProjectMutation.mutate(bountyId, {
              onSuccess: () => {
                toast.success('Project unhidden')
                onClose()
              },
            })
          }}
        >
          Unhide bounty
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
