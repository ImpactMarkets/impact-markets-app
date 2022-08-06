import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdown-editor'
import { TextField } from '@/components/text-field'
import { browserEnv } from '@/env/browser'
import { useLeaveConfirm } from '@/lib/form'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormData = {
  title: string
  content: string
  attributedImpactVersion: string
  proof: string
  location: string
  rights: string
  actionStart: string
  actionEnd: string
  impactStart: Date | null
  impactEnd: Date | null
  tags: string
}

type PostFormProps = {
  defaultValues?: FormData
  isSubmitting?: boolean
  isNew?: boolean
  backTo: string
  onSubmit: SubmitHandler<FormData>
}

export function PostForm({
  defaultValues,
  isSubmitting,
  isNew,
  backTo,
  onSubmit,
}: PostFormProps) {
  const { control, register, formState, getValues, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    })

  useLeaveConfirm({ formState })

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
        info="This can be the same as your article’s title if it is descriptive"
        placeholder="Why you should contribute to Giving What We Can as a ventriloquist"
        autoFocus
        required
        className="text-lg !py-1.5"
      />
      <TextField
        {...register('proof', {})}
        label="Link to your work that links back here"
        info="You can first enter a link to your post, submit the certificate, and then edit your post to include the ledger note with the link back that you’ll find on your certificate page after you submit it."
        placeholder="https://forum.effectivealtruism.org/posts/gqTN6jcqygiew4N5Y"
        type="url"
        autoFocus
        required
        className="text-lg !py-1.5"
      />
      {/* TODO: Action period */}
      <TextField
        {...register('actionStart', { required: true })}
        label="Start of the action period"
        info="The action period is the time that you define during which you worked on the project that this certificate describes."
        type="date"
        placeholder="YYYY-MM-DD"
        autoFocus
        required
        className="text-lg !py-1.5"
      />
      <TextField
        {...register('actionEnd', { required: true })}
        label="End of the action period"
        info="Must be the day of certificate creation or earlier."
        type="date"
        placeholder="YYYY-MM-DD"
        autoFocus
        required
        className="text-lg !py-1.5"
      />
      <TextField
        {...register('attributedImpactVersion', { required: true })}
        label={
          <span>
            Version of{' '}
            <a
              href="https://impactmarkets.substack.com/i/64916368/impact-attribution-norm-formerly-attributed-impact"
              className="text-blue"
            >
              Attributed Impact
            </a>
          </span>
        }
        info="Your certificate description needs to justify the value of your impact based on a particular version of Attributed Impact."
        placeholder="0.42"
        autoFocus
        required
        disabled
        defaultValue={
          browserEnv.NEXT_PUBLIC_ATTRIBUTED_IMPACT_RECOMMENDED_VERSION
        }
        className="text-lg !py-1.5 disabled"
      />

      <div className="my-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MarkdownEditor
              label="Description"
              info="You can leave this untouched until someone shows interest in your certificate; then you can fill it in."
              value={field.value}
              onChange={field.onChange}
              onTriggerSubmit={handleSubmit(onSubmit)}
              required
            />
          )}
        />
      </div>

      <p className="mb-4">
        This certificate defines a right to retroactive funding. The impact
        period is from the beginning to the end of time.
      </p>
      <p className="mb-4">By submitting I confirm that:</p>
      <ol className="list-decimal list-inside mb-4">
        <li>I am not and will never sell these rights more than once, and</li>
        <li>I am happy for this record to be publicly accessible forever.</li>
      </ol>

      <div className="flex items-center justify-between gap-4 mt-8">
        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingChildren={`${isNew ? 'Submitting' : 'Saving'}`}
          >
            {isNew ? 'Submit' : 'Save'}
          </Button>
          <ButtonLink href={backTo} variant="secondary">
            Cancel
          </ButtonLink>
        </div>
        {!isSubmitting && (
          <a
            href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-colors text-secondary hover:text-blue"
          >
            <MarkdownIcon />
            <span className="text-xs">Markdown supported</span>
          </a>
        )}
      </div>
    </form>
  )
}
