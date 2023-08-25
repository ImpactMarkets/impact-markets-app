import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'

import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from '@/components/dialog'
import { Heading1 } from '@/components/heading1'
import { IconButton } from '@/components/iconButton'
import { EditIcon } from '@/components/icons'
import { TextField } from '@/components/textField'
import { LargeTextField } from '@/components/textarea'
import { browserEnv } from '@/env/browser'
import { uploadImage } from '@/lib/cloudinary'
import { RouterOutput, trpc } from '@/lib/trpc'
import { Tooltip } from '@mantine/core'
import { Button as MantineButton } from '@mantine/core'
import {
  IconAlertCircle,
  IconCreditCard,
  IconMail,
  IconShieldLock,
} from '@tabler/icons-react'

function DotPattern() {
  return (
    <svg
      className="absolute inset-0 -z-1"
      width={720}
      height={240}
      fill="none"
      viewBox="0 0 720 240"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x={0}
          y={0}
          width={31.5}
          height={31.5}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={1.5}
            cy={1.5}
            r={1.5}
            className="text-gray-100 dark:text-gray-700"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width={720} height={240} fill="url(#dot-pattern)" />
    </svg>
  )
}

interface ContactLinkProps {
  contact: string | null
}

function ContactLink({ contact }: ContactLinkProps) {
  if (!contact) return null

  const isLink = contact.startsWith('http://') || contact.startsWith('https://')
  const isEmail =
    contact.includes('@') && contact.includes('.') && !contact.startsWith('@')

  return (
    <>
      <div className="text-lg text-secondary inline-block w-60 hyphens-auto">
        <span>
          {isLink ? (
            <a href={contact} target="_blank" rel="noreferrer">
              <IconMail className="inline" /> {contact}
            </a>
          ) : isEmail ? (
            <a href={`mailto:${contact}`} className="whitespace-nowrap">
              <IconMail className="inline" /> {contact}
            </a>
          ) : (
            <>
              <IconMail className="inline" /> {contact}
            </>
          )}
        </span>
      </div>
    </>
  )
}

type EditFormData = {
  name: string
  title: string | null
  proofUrl: string | null
  paymentUrl: string | null
  contact: string | null
  bio: string | null
}

function EditProfileDialog({
  user,
  isOpen,
  onClose,
}: {
  user: RouterOutput['user']['profile']
  isOpen: boolean
  onClose: () => void
}) {
  const { register, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
      name: user.name || '',
      title: user.title,
      proofUrl: user.proofUrl,
      paymentUrl: user.paymentUrl,
      contact: user.contact,
      bio: user.bio,
    },
  })
  const router = useRouter()
  const utils = trpc.useContext()
  const editUserMutation = trpc.useMutation('user.edit', {
    onSuccess: () => {
      return utils.invalidateQueries([
        'user.profile',
        {
          id: String(router.query.userId),
        },
      ])
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  function handleClose() {
    onClose()
    reset()
  }

  const onSubmit: SubmitHandler<EditFormData> = (data) => {
    editUserMutation.mutate(
      {
        name: data.name,
        title: data.title || '',
        proofUrl: data.proofUrl || '',
        paymentUrl: data.paymentUrl || '',
        contact: data.contact || '',
        bio: data.bio || '',
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <div className="mt-6 space-y-6">
            <TextField
              {...register('name', { required: true })}
              label="Name"
              required
            />
            <TextField
              {...register('title')}
              label="Title or role"
              placeholder="Lictor of Thrax, CEO of Gem Inc., etc."
            />
            <TextField
              {...register('proofUrl', {})}
              label="Proof link"
              description={
                <span>
                  This is your profile link:{' '}
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link italic"
                  >
                    My impactmarkets.io profile
                  </a>
                  . Please put it on a personal page that is clearly yours and
                  paste a link to that page below. Putting a link to your
                  certificate on a website that only you can edit proves to your
                  supporters that you are really who you claim to be.
                </span>
              }
              placeholder="https://forum.effectivealtruism.org/users/inga"
              type="url"
              className="my-6"
            />
            <TextField
              {...register('paymentUrl')}
              label="Payment link"
              placeholder="https://ko-fi.com/velvetillumnation"
              description="A page for people can pay you (Stripe, PayPal, Ko-Fi, etc.). Only needed for certificates."
            />
            <TextField
              {...register('contact')}
              label="Contact"
              description="Any email address or social media profile where people can reach you. This information is public."
              placeholder="hi@impactmarkets.io"
            />
            <LargeTextField
              {...register('bio')}
              label="Bio"
              description="Your background and values."
              placeholder="Please describe where you’re coming from in terms of your worldview – ethics, epistemics, etc."
            />
          </div>
          <DialogCloseButton onClick={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={editUserMutation.isLoading}
            loadingChildren="Saving"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function UpdateAvatarDialog({
  user,
  isOpen,
  onClose,
}: {
  user: RouterOutput['user']['profile']
  isOpen: boolean
  onClose: () => void
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = React.useState(user.image)
  const updateUserAvatarMutation = trpc.useMutation('user.updateAvatar', {
    onSuccess: () => {
      window.location.reload()
    },
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })
  const uploadImageMutation = useMutation(
    (file: File) => {
      return uploadImage(file)
    },
    {
      onError: (error: any) => {
        toast.error(`Error uploading image: ${error.message}`)
      },
    },
  )

  function handleClose() {
    onClose()
    setUploadedImage(user.image)
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Update avatar</DialogTitle>
        <DialogCloseButton onClick={handleClose} />
        <div className="flex justify-center mt-8">
          <Avatar
            name={user.name || 'Anonymous'}
            src={uploadedImage}
            size="lg"
          />
        </div>
        <div className="grid grid-flow-col gap-6 mt-6">
          <div className="text-center">
            <Button
              variant="secondary"
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              Choose file…
            </Button>
            <input
              ref={fileInputRef}
              name="user-image"
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              className="hidden"
              onChange={(event) => {
                const files = event.target.files

                if (files && files.length > 0) {
                  const file = files[0]
                  if (file.size > 5242880) {
                    toast.error('Image is bigger than 5MB')
                    return
                  }
                  setUploadedImage(URL.createObjectURL(files[0]))
                }
              }}
            />
            <p className="mt-2 text-xs text-secondary">
              JPEG, PNG, GIF / 5MB max
            </p>
          </div>
          {uploadedImage && (
            <div className="text-center">
              <Button
                variant="secondary"
                className="!text-red"
                onClick={() => {
                  fileInputRef.current!.value = ''
                  URL.revokeObjectURL(uploadedImage)
                  setUploadedImage('')
                }}
              >
                Remove photo
              </Button>
              <p className="mt-2 text-xs text-secondary">
                And use default avatar
              </p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          isLoading={
            updateUserAvatarMutation.isLoading || uploadImageMutation.isLoading
          }
          loadingChildren="Saving changes"
          onClick={async () => {
            if (user.image === uploadedImage) {
              handleClose()
            } else {
              const files = fileInputRef.current?.files

              if (files && files.length > 0) {
                uploadImageMutation.mutate(files[0], {
                  onSuccess: (uploadedImage) => {
                    updateUserAvatarMutation.mutate({
                      image: uploadedImage.url,
                    })
                  },
                })
              } else {
                updateUserAvatarMutation.mutate({
                  image: '',
                })
              }
            }
          }}
        >
          Save changes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function ProfileInfo({
  user,
}: {
  user: RouterOutput['user']['profile']
}) {
  const { data: session } = useSession()

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false)
  const [isUpdateAvatarDialogOpen, setIsUpdateAvatarDialogOpen] =
    React.useState(false)

  // Fresh keys to force re-mounting of the dialogs
  // https://stackoverflow.com/a/66772917/678861
  const [childKey, setChildKey] = React.useState(1)
  React.useEffect(() => {
    setChildKey((prev) => prev + 1)
  }, [isEditProfileDialogOpen, isUpdateAvatarDialogOpen])

  if (user) {
    const profileBelongsToUser = user.id === session?.user.id

    return (
      <div key={childKey}>
        <Head>
          <title>{user.name} – Impact Markets</title>
        </Head>

        <div className="relative flex items-start gap-4 py-8 overflow-hidden">
          <div className="flex items-center gap-8">
            {browserEnv.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD &&
            profileBelongsToUser ? (
              <button
                type="button"
                className="relative inline-flex group"
                onClick={() => {
                  setIsUpdateAvatarDialogOpen(true)
                }}
              >
                <Avatar name={user.name!} src={user.image} size="lg" />
                <div className="absolute inset-0 transition-opacity bg-gray-900 rounded-full opacity-0 group-hover:opacity-50" />
                <div className="absolute inline-flex items-center justify-center transition-opacity -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-white rounded-full opacity-0 top-1/2 left-1/2 h-9 w-9 group-hover:opacity-100">
                  <EditIcon className="w-4 h-4 text-white" />
                </div>
              </button>
            ) : (
              <Avatar name={user.name!} src={user.image} size="lg" />
            )}

            <div className="flex-1">
              <Heading1 className="whitespace-nowrap">
                {user.name}{' '}
                {user.proofUrl ? (
                  <a
                    href={user.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Proof of identity supplied"
                  >
                    <IconShieldLock className="inline fill-green-500" />
                  </a>
                ) : (
                  <Tooltip label="No proof of identity">
                    <span>
                      <IconAlertCircle className="inline fill-yellow-200" />
                    </span>
                  </Tooltip>
                )}
              </Heading1>
              <div>
                {user.title && (
                  <p className="text-lg text-secondary">{user.title}</p>
                )}
                {user.paymentUrl && (
                  <a
                    className="text-lg text-secondary inline-block w-60 whitespace-nowrap overflow-hidden overflow-ellipsis"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={user.paymentUrl}
                  >
                    <IconCreditCard className="inline" /> {user.paymentUrl}
                  </a>
                )}
              </div>
              <div>
                <ContactLink contact={user.contact} />
              </div>
            </div>
          </div>

          {profileBelongsToUser && (
            <div className="ml-auto mr-10 flex items-center gap-2">
              <IconButton
                variant="secondary"
                onClick={() => {
                  setIsEditProfileDialogOpen(true)
                }}
              >
                <EditIcon className="w-4 h-4" />
              </IconButton>
              <MantineButton
                className="bg-red-600 hover:bg-red-400"
                onClick={async () => signOut({ redirect: false })}
              >
                Sign out
              </MantineButton>
            </div>
          )}

          <DotPattern />
        </div>

        <EditProfileDialog
          user={user}
          isOpen={isEditProfileDialogOpen}
          onClose={() => {
            setIsEditProfileDialogOpen(false)
          }}
        />

        <UpdateAvatarDialog
          key={user.image}
          user={user}
          isOpen={isUpdateAvatarDialogOpen}
          onClose={() => {
            setIsUpdateAvatarDialogOpen(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative flex items-center gap-8 py-8 overflow-hidden animate-pulse">
      <div className="w-32 h-32 bg-gray-200 rounded-full dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-8 bg-gray-200 rounded w-60 dark:bg-gray-700" />
        <div className="w-40 h-5 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
      <DotPattern />
    </div>
  )
}
