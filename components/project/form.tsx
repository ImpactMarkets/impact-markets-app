import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/button'
import { ButtonLink } from '@/components/buttonLink'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdownEditor'
import { TAGS_GROUPED } from '@/components/project/tags'
import { TextField } from '@/components/textField'

import { IMMultiSelect } from '../multiSelect'

const DESCRIPTION_PROMPTS = (
  <>
    <p className="mt-2 ml-1">Ideally please touch on the following points:</p>
    <ol className="list-decimal list-outside m-6">
      <li className="mb-2">
        What is the action that this project is about? What is the goal?
      </li>

      <li className="mb-2">What are your funding targets and stretch goals?</li>

      <li className="mb-2">
        Once you have already completed it, where can supporters see proof of
        it?
      </li>

      <li className="mb-2">
        Might someone feel that the action is morally bad according to their
        values?
      </li>

      <li className="mb-2">
        Was there ever a risk that the action might be harmful?
      </li>

      <li className="mb-2">
        Who are all collaborators and how much have they each contributed?
      </li>

      <li>Is this a submission to any particular contests?</li>
    </ol>
  </>
)

type FormData = {
  id: string
  title: string
  content: string
  actionStart?: string
  actionEnd?: string
  paymentUrl: string
  tags: string
}

type ProjectFormProps = {
  defaultValues: FormData
  isSubmitting?: boolean
  isNew?: boolean
  backTo: string
  onSubmit: SubmitHandler<FormData>
}

export function ProjectForm({
  defaultValues,
  isSubmitting,
  isNew,
  backTo,
  onSubmit,
}: ProjectFormProps) {
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
        description="What’s the plan, in a few words?"
        placeholder="An article on implications of Evidential Cooperation in Large Worlds for population ethics"
        autoFocus
        required
        className="my-6"
      />
      <div className="mt-6">
        <TextField
          {...register('paymentUrl')}
          label="Payment URL"
          description="A link to a page where people can donate to the project. (Optional)"
          placeholder="https://ko-fi.com/velvetillumnation"
        />
      </div>
      <div className="mt-6">
        <IMMultiSelect
          {...register('tags')}
          label="Tags"
          description={
            <>
              Please select all that apply or leave us feedback (e.g., using the
              support button) if you can’t find suitable tags. (Optional)
            </>
          }
          placeholder="Pick all that apply"
          data={TAGS_GROUPED}
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
              description="Please hover over the question mark icon for some guidance. But don’t worry; supporters can ask questions too."
              info={DESCRIPTION_PROMPTS}
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
          className="flex items-center gap-2 link text-secondary"
        >
          <MarkdownIcon />
          <span className="text-xs">Markdown supported</span>
        </a>
      </div>

      <p className="my-6 text-sm">
        When you submit your project, you can still edit it, and it will remain
        hidden until a curator publishes it.
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
      </div>
    </form>
  )
}
