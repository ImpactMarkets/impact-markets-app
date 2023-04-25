import React, { useState } from 'react'

import { TAGS } from '@/components/project/tags'
import { BountySortKey, ProjectSortKey } from '@/lib/constants'
import { Button, Flex } from '@mantine/core'

import { IconButton } from './iconButton'
import { SearchIcon } from './icons'
import { IMMultiSelect } from './multiSelect'
import { SearchDialog } from './searchDialog'
import { IMSelect } from './select'

export type FiltersProps = {
  onFilterTagsUpdate: (tags: string) => void
  onOrderByUpdate: (orderBy: string) => void
  orderByValues: Array<{ value: ProjectSortKey | BountySortKey; label: string }>
  defaultFilterTagValue: string
  defaultOrderByValue: string
  searchEndpoint: 'project.search' | 'bounty.search'
}

export function Filters(props: FiltersProps) {
  const tagsMultiSelect = React.useRef<HTMLInputElement>(null)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const [filterTags, setFilterTags] = useState<string[] | undefined>(
    props.defaultFilterTagValue.split(',')
  )
  const [orderBy, setOrderBy] = useState<string | undefined>(
    props.defaultOrderByValue
  )

  return (
    <Flex gap={{ base: 'sm' }} align="center">
      <IMMultiSelect
        ref={tagsMultiSelect}
        placeholder="Filter by tags"
        data={TAGS.map((tag) => ({
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
          searchInput: 'border-none placeholder:text-primary',
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
          input: 'bg-none border-none placeholder:text-primary',
        }}
      />
      <IconButton
        variant="secondary"
        onClick={() => {
          setIsSearchDialogOpen(true)
        }}
      >
        <SearchIcon className="w-4 h-4" />
      </IconButton>
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
      >
        Clear all
      </Button>
      <SearchDialog
        searchEndpoint={props.searchEndpoint}
        isOpen={isSearchDialogOpen}
        onClose={() => {
          setIsSearchDialogOpen(false)
        }}
      />
    </Flex>
  )
}
