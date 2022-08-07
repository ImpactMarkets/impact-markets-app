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
import { InferQueryOutput, InferQueryPathAndInput, trpc } from '@/lib/trpc'

function getPostQueryPathAndInput(
  id: number
): InferQueryPathAndInput<'post.detail'> {
  return [
    'post.detail',
    {
      id,
    },
  ]
}

type CertificateMenuProps = {
  queryData: InferQueryOutput<'post.detail'>
  isUserAdmin: Boolean
  postBelongsToUser: Boolean
}

export const CertificateMenu = ({
  queryData,
  isUserAdmin,
  postBelongsToUser,
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
    router.push(`/post/${queryData?.id}/edit`)
  }

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true)
  }

  if (!(postBelongsToUser || isUserAdmin)) {
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
              {postBelongsToUser && (
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
        {postBelongsToUser && (
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
        postId={queryData.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false)
        }}
      />

      <ConfirmHideDialog
        postId={queryData.id}
        isOpen={isConfirmHideDialogOpen}
        onClose={() => {
          setIsConfirmHideDialogOpen(false)
        }}
      />

      <ConfirmUnhideDialog
        postId={queryData.id}
        isOpen={isConfirmUnhideDialogOpen}
        onClose={() => {
          setIsConfirmUnhideDialogOpen(false)
        }}
      />
    </>
  )
}

function ConfirmHideDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const hidePostMutation = trpc.useMutation('post.hide', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Hide post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to hide this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          isLoading={hidePostMutation.isLoading}
          loadingChildren="Hiding post"
          onClick={() => {
            hidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success('Post hidden')
                onClose()
              },
            })
          }}
        >
          Hide post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmUnhideDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const unhidePostMutation = trpc.useMutation('post.unhide', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Unhide post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to unhide this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          isLoading={unhidePostMutation.isLoading}
          loadingChildren="Unhiding post"
          onClick={() => {
            unhidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success('Post unhidden')
                onClose()
              },
            })
          }}
        >
          Unhide post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmDeleteDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const deletePostMutation = trpc.useMutation('post.delete', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={deletePostMutation.isLoading}
          loadingChildren="Deleting post"
          onClick={() => {
            deletePostMutation.mutate(postId, {
              onSuccess: () => router.push('/'),
            })
          }}
        >
          Delete post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
