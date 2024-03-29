import * as React from 'react'

import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'

import { XIcon } from '@/components/icons'

type DialogProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  initialFocus?: React.MutableRefObject<HTMLElement | null>
}

export function Dialog({
  isOpen,
  onClose,
  children,
  initialFocus,
}: DialogProps) {
  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <HeadlessDialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isOpen}
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessDialog.Overlay className="fixed inset-0 bg-black transition-opacity opacity-10" />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block bg-white w-full max-w-md mt-[15vh] mb-8 text-left align-middle transition-all transform rounded-lg shadow-xl dark:border">
              {children}
            </div>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>
}

export function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4 px-6 py-4 border-t">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <HeadlessDialog.Title as="h3" className="text-lg font-semibold">
      {children}
    </HeadlessDialog.Title>
  )
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <HeadlessDialog.Description className={className}>
      {children}
    </HeadlessDialog.Description>
  )
}

export function DialogCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-0 right-0 pt-6 pr-6">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-sm text-secondary hover:text-primary hover:bg-secondary"
        onClick={onClick}
      >
        <span className="sr-only">Close</span>
        <XIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}
