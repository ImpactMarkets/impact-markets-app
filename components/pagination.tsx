import { useRouter } from 'next/router'

import { ButtonLink } from '@/components/buttonLink'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'

type PaginationProps = {
  itemCount: number
  itemsPerPage: number
  currentPageNumber: number
}

export function getQueryPaginationInput(
  itemsPerPage: number,
  currentPageNumber: number,
) {
  return {
    take: itemsPerPage,
    skip:
      currentPageNumber === 1
        ? undefined
        : itemsPerPage * (currentPageNumber - 1),
  }
}

export function Pagination({
  itemCount,
  itemsPerPage,
  currentPageNumber,
}: PaginationProps) {
  const router = useRouter()

  const totalPages = Math.ceil(itemCount / itemsPerPage)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center gap-4 mt-12">
      <ButtonLink
        href={{
          pathname: router.pathname,
          query: { ...router.query, page: currentPageNumber - 1 },
        }}
        variant="secondary"
        className={
          currentPageNumber === 1 ? 'pointer-events-none opacity-50' : ''
        }
      >
        <span className="mr-1">
          <ChevronLeftIcon />
        </span>
        Newer
      </ButtonLink>
      <ButtonLink
        href={{
          pathname: router.pathname,
          query: { ...router.query, page: currentPageNumber + 1 },
        }}
        variant="secondary"
        className={
          currentPageNumber === totalPages
            ? 'pointer-events-none opacity-50'
            : ''
        }
      >
        Older{' '}
        <span className="ml-1">
          <ChevronRightIcon />
        </span>
      </ButtonLink>
    </div>
  )
}
