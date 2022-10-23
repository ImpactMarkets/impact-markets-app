import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdown-editor'
import { TextField } from '@/components/text-field'
import { useLeaveConfirm } from '@/lib/form'
import { Accordion } from '@mantine/core'

const DESCRIPTION_PROMPTS = (
  <>
    <p className="mt-2">Please touch on the following points:</p>
    <ol className="list-decimal list-inside m-2">
      <li className="mb-2">
        What is the action that this certificate is about?
      </li>

      <li className="mb-2">
        If you have already completed it, where can investors see proof of it?
      </li>

      <li className="mb-2">
        Might someone feel that the action is morally bad according to their
        values?
      </li>

      <li className="mb-2">
        Was there ever a risk that the action might be harmful?
      </li>

      <li>
        Who are all collaborators and how much have they each contributed?
      </li>
    </ol>
    <p>And optionally:</p>
    <ol className="list-decimal list-inside m-2">
      <li className="mb-2">
        What would you have done had there been no chance to get retro funding?
        (This doesn’t affect our evaluation of your impact.)
      </li>

      <li>What can we improve about this process?</li>
    </ol>
  </>
)

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

type CertificateFormProps = {
  defaultValues?: FormData
  isSubmitting?: boolean
  isNew?: boolean
  backTo: string
  onSubmit: SubmitHandler<FormData>
}

export function CertificateForm({
  defaultValues,
  isSubmitting,
  isNew,
  backTo,
  onSubmit,
}: CertificateFormProps) {
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
        placeholder="An article on implications of Evidential Cooperation in Large Worlds for population ethics"
        autoFocus
        required
        className="text-lg !py-1.5"
      />
      {/* TODO: Once we have CUIDs, we can generate one now and provide the link back */}
      <TextField
        {...register('proof', {})}
        label="Proof of ownership"
        description="Any website or profile that is clearly yours and that contains a link to this certificate."
        info="For your convenience, you’ll see on the next page a text with a link to your certificate that you can copy to your personal website or profile. This proves that you are really who you claim you are."
        placeholder="https://forum.effectivealtruism.org/users/inga"
        type="url"
        autoFocus
        required
        className="text-lg !py-1.5"
      />
      <TextField
        {...register('counterfactual')}
        label="Counterfactual"
        description="What would you have done (or what would you do) if there were no offer of retroactive funding?"
        info="This is not displayed publicly"
        className="my-6"
      />

      {/* TODO: Split out feedback */}
      <div className="my-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MarkdownEditor
              label="Description"
              info={DESCRIPTION_PROMPTS}
              value={field.value}
              onChange={field.onChange}
              onTriggerSubmit={handleSubmit(onSubmit)}
              required
            />
          )}
        />
      </div>

      <Accordion variant="separated">
        <Accordion.Item value="advanced-options">
          <Accordion.Control>Advanced options</Accordion.Control>
          <Accordion.Panel>
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
              className="text-lg !py-1.5 disabled"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <p className="mt-4 mb-4">
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
