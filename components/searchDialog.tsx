import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useDebounce } from 'use-debounce'
import { ItemOptions, useItemList } from 'use-item-list'

import { Dialog, Transition } from '@headlessui/react'

import { SearchIcon, SpinnerIcon } from '@/components/icons'
import { classNames } from '@/lib/classnames'
import { RouterOutput, trpc } from '@/lib/trpc'

type SearchDialogProps = {
  isOpen: boolean
  onClose: () => void
  searchEndpoint: 'project' | 'bounty'
}

function SearchResult({
  useItem,
  result,
}: {
  useItem: ({ ref, text, value, disabled }: ItemOptions) => {
    id: string
    index: number
    highlight: () => void
    select: () => void
    selected: any
    // eslint-disable-next-line @typescript-eslint/ban-types
    useHighlighted: () => boolean | Boolean // Boolean due to dependency on use-item-list
  }
  result:
    | RouterOutput['project']['search'][number]
    | RouterOutput['bounty']['search'][number]
}) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { id, highlight, select, useHighlighted } = useItem({
    ref,
    value: result,
  })
  const highlighted = useHighlighted()

  return (
    <li ref={ref} id={id} onMouseEnter={highlight} onClick={select}>
      <Link
        href={result.link}
        className={classNames(
          'block py-3.5 pl-10 pr-3 transition-colors leading-tight',
          highlighted && 'bg-blue-600 text-white',
        )}
      >
        {result.title}
      </Link>
    </li>
  )
}

function SearchField({
  onSelect,
  searchEndpoint,
}: {
  onSelect: () => void
  searchEndpoint: 'project' | 'bounty'
}) {
  const [value, setValue] = React.useState('')
  const [debouncedValue] = useDebounce(value, 1000)
  const router = useRouter()

  // https://github.com/microsoft/TypeScript/issues/33591#issuecomment-786443978
  // But that didn't work because react-query doesn't export ProcedureUseQuery
  const enabled = debouncedValue.trim().length > 0
  let feedQuery
  if (searchEndpoint === 'project')
    feedQuery = trpc.project.search.useQuery(
      { query: debouncedValue },
      { enabled },
    )
  else
    feedQuery = trpc.bounty.search.useQuery(
      { query: debouncedValue },
      { enabled },
    )

  const { moveHighlightedItem, selectHighlightedItem, useItem } = useItemList({
    onSelect: (item) => {
      router.push(`/project/${item.value.id}`)
      onSelect()
    },
  })

  React.useEffect(() => {
    function handleKeydownEvent(event: KeyboardEvent) {
      const { code } = event

      if (code === 'ArrowUp' || code === 'ArrowDown' || code === 'Enter') {
        event.preventDefault()
      }

      if (code === 'ArrowUp') {
        moveHighlightedItem(-1)
      }

      if (code === 'ArrowDown') {
        moveHighlightedItem(1)
      }

      if (code === 'Enter') {
        selectHighlightedItem()
      }
    }

    document.addEventListener('keydown', handleKeydownEvent)
    return () => {
      document.removeEventListener('keydown', handleKeydownEvent)
    }
  }, [moveHighlightedItem, selectHighlightedItem, router])

  return (
    <div>
      <div className="relative">
        <div
          className={classNames(
            'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-opacity',
            feedQuery.isLoading ? 'opacity-100' : 'opacity-0',
          )}
        >
          <SpinnerIcon className="w-4 h-4 animate-spin" />
        </div>
        <div
          className={classNames(
            'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-opacity',
            feedQuery.isLoading ? 'opacity-0' : 'opacity-100',
          )}
        >
          <SearchIcon className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Search"
          className="block w-full py-3 pl-10 bg-transparent border-0 focus:ring-0"
          role="combobox"
          aria-controls="search-results"
          aria-expanded={true}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
          }}
        />
      </div>
      {feedQuery.data &&
        (feedQuery.data.length > 0 ? (
          <ul
            id="search-results"
            role="listbox"
            className="max-h-[286px] border-t overflow-y-auto"
          >
            {feedQuery.data.map((result) => (
              <SearchResult key={result.id} useItem={useItem} result={result} />
            ))}
          </ul>
        ) : (
          <div className="border-t py-3.5 px-3 text-center leading-tight">
            No results. Try something else
          </div>
        ))}
      {feedQuery.isError && (
        <div className="border-t py-3.5 px-3 text-center leading-tight">
          Error: {feedQuery.error.message}
        </div>
      )}
    </div>
  )
}

export function SearchDialog({
  isOpen,
  onClose,
  searchEndpoint,
}: SearchDialogProps) {
  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        open={isOpen}
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
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
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-700 opacity-90 dark:bg-gray-900" />
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
            <div className="inline-block w-full max-w-md mt-[10vh] mb-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              {isOpen ? (
                <SearchField
                  onSelect={onClose}
                  searchEndpoint={searchEndpoint}
                />
              ) : (
                <div className="h-12" />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
