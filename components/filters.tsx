import React, { useState } from 'react'

import { Button } from '@mantine/core'

import { BountySortKey, ProjectSortKey } from '@/lib/constants'

import { IconButton } from './iconButton'
import { SearchIcon } from './icons'
import { MultiSelect } from './multiSelect'
import { SearchDialog } from './searchDialog'
import { Select } from './select'
import { TagGroup, notEmpty } from './utils'

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
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const [filterTags, setFilterTags] = useState<string[] | undefined>(
    props.defaultFilterTagValue ? props.defaultFilterTagValue.split(',') : [],
  )
  const [orderBy, setOrderBy] = useState<string | undefined>(
    props.defaultOrderByValue,
  )

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex flex-nowrap gap-3 items-center text-sm">
        <MultiSelect
          classNames={{
            inputField:
              'placeholder:text-secondary focus:ring-0 cursor-pointer',
            pillsList: 'flex-nowrap',
            root: 'w-48',
          }}
          hidePickedOptions
        />
        <Select
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
            input: 'border-none focus:ring-0 placeholder:text-secondary',
            root: 'w-48',
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
