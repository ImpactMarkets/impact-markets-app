import React, { useState } from 'react'

import { BountySortKey, ProjectSortKey } from '@/lib/constants'

import { IconButton } from './iconButton'
import { SearchIcon } from './icons'
import { IMMultiSelect } from './multiSelect'
import { SearchDialog } from './searchDialog'
import { IMSelect } from './select'
import { IMTag } from './utils'
import { Button } from '@mantine/core'

export type FiltersProps = {
  onFilterTagsUpdate: (tags: string) => void
  onOrderByUpdate: (orderBy: string) => void
  orderByValues: Array<{ value: ProjectSortKey | BountySortKey; label: string }>
  defaultFilterTagValue: string
  defaultOrderByValue: string
  searchEndpoint?: 'project' | 'bounty'
  tags: IMTag[]
}

export function Filters(props: FiltersProps) {
  const tagsMultiSelect = React.useRef<HTMLInputElement>(null)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const [filterTags, setFilterTags] = useState<string[] | undefined>(
    props.defaultFilterTagValue.split(','),
  )
  const [orderBy, setOrderBy] = useState<string | undefined>(
    props.defaultOrderByValue,
  )

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex flex-nowrap items-center">
        <IMMultiSelect
          ref={tagsMultiSelect}
          placeholder="Filter by tags"
          data={props.tags.map((tag) => ({
            value: tag.value,
            label: tag.label,
            group: tag.group,
          }))}
          onChange={(value) => {
            if (Array.isArray(value)) {
              setFilterTags(value)
              props.onFilterTagsUpdate(value.join(','))
            }
          }}
          value={filterTags}
          classNames={{
            input: 'bg-none border-none',
            searchInput:
              'border-none placeholder:text-secondary placeholder:!text-sm',
          }}
        />
        <IMSelect
          placeholder="Sort by:"
          data={props.orderByValues}
          onChange={(value) => {
            const sortKeys = props.orderByValues.map((item) => item.value)
            if (
              value &&
              typeof value === 'string' &&
              (sortKeys as string[]).includes(value)
            ) {
              setOrderBy(value)
              props.onOrderByUpdate(value)
            }
          }}
          value={orderBy}
          classNames={{
            input:
              'bg-none border-none text-secondary placeholder:text-secondary',
          }}
        />
      </div>
      {props.searchEndpoint && (
        <IconButton
          variant="secondary"
          onClick={() => {
            setIsSearchDialogOpen(true)
          }}
          style={{
            marginLeft: '10px',
          }}
        >
          <SearchIcon className="w-4 h-4" />
        </IconButton>
      )}
      <Button
        variant="subtle"
        radius="xs"
        size="xs"
        onClick={() => {
          setFilterTags(undefined)
          setOrderBy(undefined)
          props.onFilterTagsUpdate('')
          props.onOrderByUpdate('')
        }}
        style={{ marginLeft: 'auto' }}
      >
        Clear all
      </Button>
      {props.searchEndpoint && (
        <SearchDialog
          searchEndpoint={props.searchEndpoint}
          isOpen={isSearchDialogOpen}
          onClose={() => {
            setIsSearchDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}
