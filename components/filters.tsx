import React, { useState } from 'react'

import { PROJECT_SORT_KEYS, ProjectSortKey } from '@/lib/constants'
import { TAGS } from '@/lib/tags'
import { Button, Flex } from '@mantine/core'

import { IMMultiSelect } from './multiSelect'
import { IMSelect } from './select'

export type FiltersProps = {
  onFilterTagsUpdate: (tags: string) => void
  onOrderByUpdate: (sort: ProjectSortKey) => void
  defaultFilterTagValue: string
  defaultOrderByValue: string
}

export function Filters(props: FiltersProps) {
  const tagsMultiSelect = React.useRef<HTMLInputElement>(null)
  const [filterTags, setFilterTags] = useState<string[] | undefined>(
    props.defaultFilterTagValue.split(',')
  )
  const [orderBy, setOrderBy] = useState<string | undefined>(
    props.defaultOrderByValue
  )
  const sortOptions: Array<{ value: ProjectSortKey; label: string }> = [
    { value: 'actionStart', label: 'Start of work' },
    { value: 'actionEnd', label: 'End of work' },
    { value: 'supporterCount', label: 'Supporters' },
    // Not currently supported:
    // { value: 'holdings', label: 'Shares Bought' },
    // { value: 'investment', label: 'Total Investment' },
  ]

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
          searchInput: 'border-none',
        }}
      />
      <IMSelect
        placeholder="Sort by:"
        data={sortOptions}
        onChange={(value) => {
          if (PROJECT_SORT_KEYS.includes(value as ProjectSortKey)) {
            setOrderBy(value as ProjectSortKey)
            props.onOrderByUpdate(value as ProjectSortKey)
          }
        }}
        value={orderBy}
        classNames={{
          input: 'bg-none border-none',
        }}
      />
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
    </Flex>
  )
}
