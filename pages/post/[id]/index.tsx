import { AuthorWithDate } from '@/components/author-with-date'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import { Heading1 } from '@/components/heading-1'
import { HtmlView } from '@/components/html-view'
import { IconButton } from '@/components/icon-button'
import {
  DotsIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  MessageIcon,
  TrashIcon,
} from '@/components/icons'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/like-button'
import { MarkdownEditor } from '@/components/markdown-editor'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { InferQueryOutput, InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

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

const PostPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const utils = trpc.useContext()
  const postQueryPathAndInput = getPostQueryPathAndInput(
    Number(router.query.id)
  )
  const postQuery = trpc.useQuery(postQueryPathAndInput)
  const likeMutation = trpc.useMutation(['post.like'], {
    onMutate: async (likedPostId) => {
      await utils.cancelQuery(postQueryPathAndInput)

      const previousPost = utils.getQueryData(postQueryPathAndInput)

      if (previousPost) {
        utils.setQueryData(postQueryPathAndInput, {
          ...previousPost,
          likedBy: [
            ...previousPost.likedBy,
            { user: { id: session!.user.id, name: session!.user.name } },
          ],
        })
      }

      return { previousPost }
    },
    onError: (err, id, context: any) => {
      if (context?.previousPost) {
        utils.setQueryData(postQueryPathAndInput, context.previousPost)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['post.unlike'], {
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(postQueryPathAndInput)

      const previousPost = utils.getQueryData(postQueryPathAndInput)

      if (previousPost) {
        utils.setQueryData(postQueryPathAndInput, {
          ...previousPost,
          likedBy: previousPost.likedBy.filter(
            (item) => item.user.id !== session!.user.id
          ),
        })
      }

      return { previousPost }
    },
    onError: (err, id, context: any) => {
      if (context?.previousPost) {
        utils.setQueryData(postQueryPathAndInput, context.previousPost)
      }
    },
  })
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
    router.push(`/post/${postQuery.data?.id}/edit`)
  }

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true)
  }

  if (postQuery.data) {
    const isUserAdmin = session!.user.role === 'ADMIN'
    const postBelongsToUser = postQuery.data.author.id === session!.user.id

    return (
      <>
        <Head>
          <title>{postQuery.data.title} – Impact Markets</title>
        </Head>

        <div className="divide-y divide-primary">
          <div className="pb-12">
            {postQuery.data.hidden && (
              <Banner className="mb-6">
                This post has been hidden and is only visible to administrators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>{postQuery.data.title}</Heading1>
              {(postBelongsToUser || isUserAdmin) && (
                <>
                  <div className="flex md:hidden">
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        variant="secondary"
                        title="More"
                      >
                        <DotsIcon className="w-4 h-4" />
                      </MenuButton>

                      <MenuItems className="w-28">
                        <MenuItemsContent>
                          {isUserAdmin &&
                            (postQuery.data.hidden ? (
                              <MenuItemButton onClick={handleUnhide}>
                                Unhide
                              </MenuItemButton>
                            ) : (
                              <MenuItemButton onClick={handleHide}>
                                Hide
                              </MenuItemButton>
                            ))}
                          {postBelongsToUser && (
                            <>
                              <MenuItemButton onClick={handleEdit}>
                                Edit
                              </MenuItemButton>
                              <MenuItemButton
                                className="!text-red"
                                onClick={handleDelete}
                              >
                                Delete
                              </MenuItemButton>
                            </>
                          )}
                        </MenuItemsContent>
                      </MenuItems>
                    </Menu>
                  </div>
                  <div className="hidden md:flex md:gap-4">
                    {isUserAdmin &&
                      (postQuery.data.hidden ? (
                        <IconButton
                          variant="secondary"
                          title="Unhide"
                          onClick={handleUnhide}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </IconButton>
                      ) : (
                        <IconButton
                          variant="secondary"
                          title="Hide"
                          onClick={handleHide}
                        >
                          <EyeClosedIcon className="w-4 h-4" />
                        </IconButton>
                      ))}
                    {postBelongsToUser && (
                      <>
                        <IconButton
                          variant="secondary"
                          title="Edit"
                          onClick={handleEdit}
                        >
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
                </>
              )}
            </div>
            <div className="my-6">
              <AuthorWithDate
                author={postQuery.data.author}
                date={postQuery.data.createdAt}
              />
            </div>
            <div className="flex flex-wrap">
              <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                <a
                  href="https://forum.effectivealtruism.org/posts/7kqL4G5badqjskYQs/toward-impact-markets-1#Attributed_Impact"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Attributed Impact
                </a>{' '}
                v{postQuery.data.attributedImpactVersion}
              </span>
              <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                <a
                  href={postQuery.data.proof}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Proof
                </a>
              </span>
              {postQuery.data.location && (
                <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                  {postQuery.data.location}
                </span>
              )}
              <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                Right to retroactive funding
              </span>
              <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                Action: {postQuery.data.actionStart.toISOString().slice(0, 10)}{' '}
                to {postQuery.data.actionEnd.toISOString().slice(0, 10)}
              </span>
              <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                Impact: all time
              </span>
              <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                No audit
              </span>
              {postQuery.data.tags && (
                <span className="bg-blue-500 text-white font-bold text-sm py-1 px-2 mr-1 mb-1 rounded">
                  {postQuery.data.tags}
                </span>
              )}
            </div>
            {postBelongsToUser && (
              <div
                className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 my-5"
                role="alert"
              >
                <svg
                  className="fill-white w-8 h-8 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                </svg>
                <p>
                  {' '}
                  Please add this note to the bottom of your post:{' '}
                  <em>
                    As of {postQuery.data.createdAt.toISOString().slice(0, 10)},
                    the{' '}
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      certificate of this article
                    </a>{' '}
                    is owned by [name] ([percentage]), [name] ([percentage]), …,
                    and [name] ([percentage]).
                  </em>
                </p>
              </div>
            )}
            <HtmlView html={postQuery.data.contentHtml} className="mt-8" />
            <div className="flex gap-4 mt-6">
              <LikeButton
                likedBy={postQuery.data.likedBy}
                onLike={() => {
                  likeMutation.mutate(postQuery.data.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(postQuery.data.id)
                }}
              />
              <ButtonLink
                href={`/post/${postQuery.data.id}#comments`}
                variant="secondary"
              >
                <MessageIcon className="w-4 h-4 text-secondary" />
                <span className="ml-1.5">{postQuery.data._count.comments}</span>
              </ButtonLink>
            </div>
          </div>

          <div id="comments" className="pt-12 space-y-12">
            {postQuery.data.comments.length > 0 && (
              <ul className="space-y-12">
                {postQuery.data.comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment postId={postQuery.data.id} comment={comment} />
                  </li>
                ))}
              </ul>
            )}
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
              <AddCommentForm postId={postQuery.data.id} />
            </div>
          </div>
        </div>

        <ConfirmDeleteDialog
          postId={postQuery.data.id}
          isOpen={isConfirmDeleteDialogOpen}
          onClose={() => {
            setIsConfirmDeleteDialogOpen(false)
          }}
        />

        <ConfirmHideDialog
          postId={postQuery.data.id}
          isOpen={isConfirmHideDialogOpen}
          onClose={() => {
            setIsConfirmHideDialogOpen(false)
          }}
        />

        <ConfirmUnhideDialog
          postId={postQuery.data.id}
          isOpen={isConfirmUnhideDialogOpen}
          onClose={() => {
            setIsConfirmUnhideDialogOpen(false)
          }}
        />
      </>
    )
  }

  if (postQuery.isError) {
    return <div>Error: {postQuery.error.message}</div>
  }

  return (
    <div className="animate-pulse">
      <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
      <div className="flex items-center gap-4 mt-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700" />
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="w-32 h-3 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
      </div>
      <div className="space-y-3 mt-7">
        {[...Array(3)].map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
            <div className="w-1/2 h-5 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
            <div className="w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <div className="w-16 border rounded-full h-button border-secondary" />
        <div className="w-16 border rounded-full h-button border-secondary" />
      </div>
    </div>
  )
}

PostPage.auth = true

PostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

function Comment({
  postId,
  comment,
}: {
  postId: number
  comment: InferQueryOutput<'post.detail'>['comments'][number]
}) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false)

  const commentBelongsToUser = comment.author.id === session!.user.id

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <Avatar name={comment.author.name!} src={comment.author.image} />
        <EditCommentForm
          postId={postId}
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
      </div>

      <ConfirmDeleteCommentDialog
        postId={postId}
        commentId={comment.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false)
        }}
      />
    </div>
  )
}

type CommentFormData = {
  content: string
}

function AddCommentForm({ postId }: { postId: number }) {
  const [markdownEditorKey, setMarkdownEditorKey] = React.useState(0)
  const utils = trpc.useContext()
  const addCommentMutation = trpc.useMutation('comment.add', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })
  const { control, handleSubmit, reset } = useForm<CommentFormData>()

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    addCommentMutation.mutate(
      {
        postId,
        content: data.content,
      },
      {
        onSuccess: () => {
          reset({ content: '' })
          setMarkdownEditorKey((markdownEditorKey) => markdownEditorKey + 1)
        },
      }
    )
  }

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            key={markdownEditorKey}
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={handleSubmit(onSubmit)}
            required
            placeholder="Comment"
            minRows={4}
          />
        )}
      />
      <div className="mt-4">
        <Button
          type="submit"
          isLoading={addCommentMutation.isLoading}
          loadingChildren="Adding comment"
        >
          Add comment
        </Button>
      </div>
    </form>
  )
}

function EditCommentForm({
  postId,
  comment,
  onDone,
}: {
  postId: number
  comment: InferQueryOutput<'post.detail'>['comments'][number]
  onDone: () => void
}) {
  const utils = trpc.useContext()
  const editCommentMutation = trpc.useMutation('comment.edit', {
    onSuccess: () => {
      return utils.invalidateQueries(getPostQueryPathAndInput(postId))
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })
  const { control, handleSubmit } = useForm<CommentFormData>({
    defaultValues: {
      content: comment.content,
    },
  })

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    editCommentMutation.mutate(
      {
        id: comment.id,
        data: {
          content: data.content,
        },
      },
      {
        onSuccess: () => onDone(),
      }
    )
  }

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={handleSubmit(onSubmit)}
            required
            placeholder="Comment"
            minRows={4}
            autoFocus
          />
        )}
      />
      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          isLoading={editCommentMutation.isLoading}
          loadingChildren="Updating comment"
        >
          Update comment
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function ConfirmDeleteCommentDialog({
  postId,
  commentId,
  isOpen,
  onClose,
}: {
  postId: number
  commentId: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const utils = trpc.useContext()
  const deleteCommentMutation = trpc.useMutation('comment.delete', {
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
        <DialogTitle>Delete comment</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this comment?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
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

export default PostPage
