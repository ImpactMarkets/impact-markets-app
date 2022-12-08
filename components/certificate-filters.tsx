import React, { useState } from 'react'

import { CERT_SORT_KEYS, CertSortKey } from '@/lib/constants'
import { TAGS } from '@/lib/tags'
import { Button, Flex } from '@mantine/core'

import { IMMultiSelect } from './multi-select'
import { IMSelect } from './select'

export type CertificateFiltersProps = {
  onFilterTagsUpdate: (tags: string) => void
  onOrderByUpdate: (sort: CertSortKey) => void
  defaultFilterTagValue: string
  defaultOrderByValue: string
}

export function CertificateFilters(props: CertificateFiltersProps) {
  const tagsMultiSelect = React.useRef<HTMLInputElement>(null)
  const [filterTags, setFilterTags] = useState<string[] | undefined>(
    props.defaultFilterTagValue.split(',')
  )
  const [orderBy, setOrderBy] = useState<string | undefined>(
    props.defaultOrderByValue
  )
  const sortOptions: Array<{ value: CertSortKey; label: string }> = [
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
          input: 'bg-none border-0',
          searchInput: 'border-0',
        }}
      />
      <IMSelect
        placeholder="Sort by:"
        data={sortOptions}
        onChange={(value) => {
          if (CERT_SORT_KEYS.includes(value as CertSortKey)) {
            setOrderBy(value as CertSortKey)
            props.onOrderByUpdate(value as CertSortKey)
          }
        }}
        value={orderBy}
        classNames={{
          input: 'bg-none border-0',
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
