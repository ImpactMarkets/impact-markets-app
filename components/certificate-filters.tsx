import React, { useState } from 'react'

import { TAGS } from '@/lib/tags'
import { Button, Flex } from '@mantine/core'

import { IMMultiSelect } from './multi-select'
import { IMSelect } from './select'

export type CertificateFiltersProps = {
  onFilterTagsUpdate: (tags: string) => void
  onOrderByUpdate: (sort: string) => void
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
          input: 'bg-none !border-gray-300',
          searchInput: '!border-gray-300',
        }}
      />
      <IMSelect
        placeholder="Sort by:"
        data={[
          { value: 'actionStart', label: 'Action Period Start' },
          { value: 'actionEnd', label: 'Action Period End' },
          //{ value: 'holdings', label: 'Shares Bought' },
          //{ value: 'investment', label: 'Total Investment' },
        ]}
        onChange={(value) => {
          if (typeof value === 'string') {
            setOrderBy(value)
            props.onOrderByUpdate(value)
          }
        }}
        value={orderBy}
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
