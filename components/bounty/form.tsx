import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useIntercom } from 'react-use-intercom'

import { TAGS } from '@/components/bounty/tags'
import { Button } from '@/components/button'
import { ButtonLink } from '@/components/buttonLink'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdownEditor'
import { TextField } from '@/components/textField'
import { SimpleGrid } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { IMMultiSelect } from '../multiSelect'

type FormData = {
  id: string
  title: string
  content: string
  size: Prisma.Decimal
  deadline?: string
  sourceUrl: string
  tags: string
}

type FormProps = {
  defaultValues: FormData
  isSubmitting?: boolean
  isNew?: boolean
  backTo: string
  onSubmit: SubmitHandler<FormData>
}

export const Form = ({
  defaultValues,
  isSubmitting,
  isNew,
  backTo,
  onSubmit,
}: FormProps) => {
  const {
    control,
    register,
    formState,
    getValues,
    reset,
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues,
  })

  // FIXME: Doesn’t work reliably in webkit browsers, thinks the submission were a route change
  // useLeaveConfirm({ formState })

  const { isSubmitSuccessful } = formState

  const { show } = useIntercom()

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues())
    }
  }, [isSubmitSuccessful, reset, getValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('title', { required: true })}
        label="Title"
        description="What are you looking for?"
        placeholder="Rescue my capybara from the clutches of the evil wizard"
        className="my-6"
        autoFocus
        required
      />
      <TextField
        {...register('sourceUrl')}
        label="Source URL"
        description="Where can your clients find more information on your bounty? (Optional)"
        placeholder="https://bit.ly/my-dating-doc"
        className="my-6"
      />
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        <TextField
          {...register('size', {})}
          label="Bounty amount"
          description="What is your maximum bounty payment? (Optional)"
          rightSection="USD"
          classNames={{ rightSection: 'w-14' }}
          type="number"
          step="0.01"
          max={1e30}
        />
        <TextField
          {...register('deadline', { valueAsDate: true })}
          label="Deadline"
          description="Will your bounty expire? (Optional)"
          type="date"
        />
      </SimpleGrid>
      <div className="mt-6">
        <IMMultiSelect
          {...register('tags')}
          label="Tags"
          description={
            <>
              Please select all that apply or{' '}
              <span className="link" onClick={() => show()}>
                leave us feedback
              </span>{' '}
              if you can’t find suitable tags so we can add them. (Optional)
            </>
          }
          placeholder="Pick all that apply"
          data={TAGS.map((tag) => ({
            value: tag.value,
            label: tag.label,
            group: tag.group,
          }))}
          searchable
          onChange={(value) =>
            Array.isArray(value) ? setValue('tags', value.join(',')) : null
          }
          defaultValue={getValues().tags ? getValues().tags.split(',') : []}
        />
      </div>
      <div className="mt-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MarkdownEditor
              label="Description"
              description="What is your bounty about? Don’t worry; supporters can ask questions too."
              value={field.value}
              onChange={field.onChange}
              onTriggerSubmit={handleSubmit(onSubmit)}
              required
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-2">
        <a
          href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-colors text-secondary hover:text-blue"
        >
          <MarkdownIcon />
          <span className="text-xs">Markdown supported</span>
        </a>
      </div>

      <p className="my-6 text-sm">
        When you submit your project, you can still edit it.
      </p>

      <div className="flex items-center justify-between gap-4 mt-8">
        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingChildren={isNew ? 'Submitting' : 'Saving'}
            data-testid="submit"
          >
            {isNew ? 'Submit' : 'Save'}
          </Button>
          <ButtonLink href={backTo} variant="secondary">
            Cancel
          </ButtonLink>
        </div>
        <div>
          <a
            onClick={show}
            className="text-sm font-medium transition-colors link"
          >
            🗣️ Do you have any feedback or tips for us?
          </a>
        </div>
      </div>
    </form>
  )
}
