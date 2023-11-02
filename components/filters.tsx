import { concat } from 'lodash'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button, Switch } from '@mantine/core'

import { IconButton } from './iconButton'
import { SearchIcon } from './icons'
import { MultiSelect } from './multiSelect'
import { SearchDialog } from './searchDialog'
import { Select } from './select'
import { TagGroup, notEmpty } from './utils'

export type OrderByOption<TOrdering> = {
  value: TOrdering
  label: string
}

export type FilterInputs<TOrdering> = {
  orderBy: TOrdering
  filterTags: string[]
  showAll: boolean
}

export type FiltersProps<TOrdering> = {
  tags: [TagGroup, ...TagGroup[]]
  orderings: [OrderByOption<TOrdering>, ...OrderByOption<TOrdering>[]]
  searchEndpoint?: 'project' | 'bounty'
  form: UseFormReturn<any, any, undefined>
}

export function Filters<TOrdering extends string>({
  form,
  tags,
  orderings,
  searchEndpoint,
}: FiltersProps<TOrdering>) {
  const { register, watch, reset, setValue } = form
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)

  // https://stackoverflow.com/a/77332075/678861
  const tagValues = notEmpty(
    concat(...tags.map((group) => group.items)).map((item) => item.value),
  )
  const orderingValues = notEmpty(orderings.map(({ value }) => value))

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex flex-nowrap gap-3 items-center text-sm">
        <MultiSelect
          {...register('filterTags')}
          data={tags}
          value={watch('filterTags')}
          onChange={(value) =>
            setValue('filterTags', z.array(z.enum(tagValues)).parse(value))
          }
          placeholder={watch('filterTags').length ? ' ' : 'Filter by tags'}
          classNames={{
            inputField:
              'placeholder:text-secondary focus:ring-0 cursor-pointer',
            pillsList: 'flex-nowrap',
            root: 'w-48',
          }}
          hidePickedOptions
        />
        <Select
          {...register('orderBy')}
          data={orderings}
          value={watch('orderBy')}
          onChange={(value) =>
            setValue('orderBy', z.enum(orderingValues).parse(value))
          }
          placeholder="Sort by:"
          classNames={{
            input: 'border-none focus:ring-0 placeholder:text-secondary',
            root: 'w-48',
          }}
        />
        <Switch
          {...register('showAll')}
          label={watch('showAll') ? 'Showing all' : 'Show all'}
          classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
          checked={watch('showAll')}
          onChange={(event) => {
            setValue('showAll', event.currentTarget.checked)
          }}
        />
      </div>
      {searchEndpoint && (
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
        onClick={() => reset()}
        style={{ marginLeft: 'auto' }}
      >
        Clear all
      </Button>
      {searchEndpoint && (
        <SearchDialog
          searchEndpoint={searchEndpoint}
          isOpen={isSearchDialogOpen}
          onClose={() => {
            setIsSearchDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}
