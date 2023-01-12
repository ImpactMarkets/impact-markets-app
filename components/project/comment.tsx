import { useSession } from 'next-auth/react'
import * as React from 'react'

import { AuthorWithDate } from '@/components/authorWithDate'
import { Avatar } from '@/components/avatar'
import { HtmlView } from '@/components/htmlView'
import { IconButton } from '@/components/iconButton'
import { DotsIcon } from '@/components/icons'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { InferQueryOutput } from '@/lib/trpc'

import { AddReplyForm } from './addReplyForm'
import { ConfirmDeleteCommentDialog } from './confirmDeleteCommentDialog'
import { EditCommentForm } from './editCommentForm'

export function Comment({
  projectId,
  comment,
}: {
  projectId: string
  comment:
    | InferQueryOutput<'project.detail'>['comments'][number]
    | InferQueryOutput<'project.detail'>['comments'][number]['children'][number]
}) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isReplying, setIsReplying] = React.useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false)

  const commentBelongsToUser = comment.author.id === session?.user.id

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <Avatar name={comment.author.name!} src={comment.author.image} />
        <EditCommentForm
          projectId={projectId}
          comment={comment}
          onDone={() => {
            setIsEditing(false)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <AuthorWithDate author={comment.author} date={comment.createdAt} />
        {commentBelongsToUser && (
          <Menu>
            <MenuButton as={IconButton} variant="secondary" title="More">
              <DotsIcon className="w-4 h-4" />
            </MenuButton>

            <MenuItems className="w-28">
              <MenuItemsContent>
                <MenuItemButton
                  onClick={() => {
                    setIsEditing(true)
                  }}
                >
                  Edit
                </MenuItemButton>
                <MenuItemButton
                  className="!text-red"
                  onClick={() => {
                    setIsConfirmDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </MenuItemButton>
              </MenuItemsContent>
            </MenuItems>
          </Menu>
        )}
      </div>

      <div className="mt-4 pl-11 sm:pl-16">
        <HtmlView html={comment.contentHtml} />

        {!comment.parent && !isReplying && (
          <div className="text-secondary hover:text-blue text-sm">
            <button
              type="submit"
              onClick={() => {
                setIsReplying(true)
              }}
            >
              reply
            </button>
          </div>
        )}
      </div>

      {isReplying && (
        <div id="replies" className="pt-12 pl-14 space-y-12">
          {session && (
            <div className="flex items-start gap-2 sm:gap-4">
              <span className="hidden sm:inline-block">
                <Avatar name={session!.user.name} src={session!.user.image} />
              </span>
              <span className="inline-block sm:hidden">
                <Avatar
                  name={session!.user.name}
                  src={session!.user.image}
                  size="sm"
                />
              </span>
              <AddReplyForm
                projectId={projectId}
                parent={comment}
                onDone={() => {
                  setIsReplying(false)
                }}
              />
            </div>
          )}
        </div>
      )}

      <ConfirmDeleteCommentDialog
        projectId={projectId}
        commentId={comment.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false)
        }}
      />
    </div>
  )
}