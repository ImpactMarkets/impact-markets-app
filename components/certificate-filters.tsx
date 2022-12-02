import React, { useState } from 'react'

import { TAGS } from '@/lib/tags'
import { Button, Flex } from '@mantine/core'

import { IMMultiSelect } from './multi-select'

export type CertificateFiltersProps = {
  onUpdate: (tags: string) => void
  defaultValue: string
}

export function CertificateFilters(props: CertificateFiltersProps) {
  const tagsMultiSelect = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string[] | undefined>(
    props.defaultValue.split(',')
  )

  return (
    <Flex align="center">
      <IMMultiSelect
        ref={tagsMultiSelect}
        placeholder="Pick all that apply"
        data={TAGS.map((tag) => ({
          value: tag.value,
          label: tag.label,
          group: tag.group,
        }))}
        onChange={(value) => {
          if (Array.isArray(value)) {
            setValue(value)
            props.onUpdate(value.join(','))
          }
        }}
        value={value}
      />
      <Button
        variant="subtle"
        radius="xs"
        size="xs"
        onClick={() => {
          setValue(undefined)
          props.onUpdate('')
        }}
      >
        Clear all
      </Button>
    </Flex>
  )
}
