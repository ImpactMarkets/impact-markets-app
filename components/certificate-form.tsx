import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdown-editor'
import { TextField } from '@/components/text-field'
import { useLeaveConfirm } from '@/lib/form'
import { Accordion, SimpleGrid, Switch } from '@mantine/core'
import { Prisma } from '@prisma/client'

const DESCRIPTION_PROMPTS = (
  <>
    <p className="mt-2">Please touch on the following points:</p>
    <ol className="list-decimal list-outside m-2">
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
  </>
)

type FormData = {
  title: string
  content: string
  attributedImpactVersion: string
  counterfactual: string
  proof: string
  location: string
  rights: string
  actionStart: Date
  actionEnd: Date
  tags: string
  // These defaults are set for new forms but not for editing
  valuation?: Prisma.Decimal
  target?: Prisma.Decimal
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
        description="What did you do (will you do), in a few words?"
        placeholder="An article on implications of Evidential Cooperation in Large Worlds for population ethics"
        autoFocus
        required
        className="my-6"
      />
      {/* TODO: Once we have CUIDs, we can generate one now and provide the link back */}
      <TextField
        {...register('proof', {})}
        label="Proof of ownership"
        description="Where can we find any website or profile that is clearly yours and that contains a link to this certificate?"
        info="For your convenience, you’ll see on the next page a text with a link to your certificate that you can copy to your personal website or profile. This proves that you are really who you claim you are."
        placeholder="https://forum.effectivealtruism.org/users/inga"
        type="url"
        required
        className="my-6"
      />
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        <TextField
          {...register('actionStart', { required: true, valueAsDate: true })}
          label="Start of the work period"
          description="When did you (or will you) start working on this?"
          info="You can edit it later."
          type="date"
          required
        />
        <TextField
          {...register('actionEnd', { required: true, valueAsDate: true })}
          label="End of the work period"
          description="… finish working on this?"
          info="You can edit it later."
          type="date"
          required
        />
      </SimpleGrid>
      <TextField
        {...register('counterfactual')}
        label="Counterfactual"
        description="What would you have done (or what would you do) if there were no offer of retroactive funding?"
        info="This is not displayed publicly"
        className="my-6"
      />

      {/* TODO: Split out feedback */}
      <div className="mt-6">
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

      <Accordion variant="separated" className="my-6">
        <Accordion.Item value="advanced-options">
          <Accordion.Control>Advanced options</Accordion.Control>
          <Accordion.Panel className="text-sm">
            {isNew ? (
              <>
                <SimpleGrid
                  cols={2}
                  breakpoints={[{ maxWidth: 'md', cols: 1 }]}
                >
                  <div className="mt-6 space-y-6">
                    <TextField
                      {...register('valuation', {
                        required: true,
                      })}
                      label="Minimum valuation"
                      description="What is the price below which you won’t sell a single share?"
                      rightSection="USD"
                      classNames={{ rightSection: 'w-16' }}
                      type="number"
                      step="1"
                      min="1"
                      required
                    />
                  </div>
                  <div className="mt-6 space-y-6">
                    <TextField
                      {...register('target', {
                        required: true,
                      })}
                      label="Target valuation"
                      description="What is the valuation that you hope this certificate will reach?"
                      rightSection="USD"
                      classNames={{ rightSection: 'w-16' }}
                      type="number"
                      step="1"
                      min="1"
                      required
                    />
                  </div>
                </SimpleGrid>
                <div className="mt-6 space-y-6 text-sm">
                  You can edit these later through the edit function of your
                  holding.
                </div>
              </>
            ) : (
              <div className="mt-6 space-y-6 text-sm">
                Please go through the edit function of your holding to change
                starting and target valuation.
              </div>
            )}

            <TextField
              {...register('attributedImpactVersion', { required: true })}
              label={
                <span>
                  Version of the{' '}
                  <a
                    href="https://impactmarkets.substack.com/i/64916368/impact-attribution-norm-formerly-attributed-impact"
                    className="text-blue"
                  >
                    Attributed Impact Norm
                  </a>
                </span>
              }
              info="Your certificate description needs to justify the value of your impact based on a particular version of Attributed Impact."
              placeholder="0.42"
              autoFocus
              required
              disabled
              className="text-lg disabled my-6"
            />
            <ol className="list-decimal list-outside mx-5">
              <li className="mb-2">
                This certificate defines a{' '}
                <strong>right to retroactive funding</strong>. That is, anyone
                who owns shares in it can offer to sell them to a retro funder,
                but no one is forced to buy or sell them.
              </li>
              <li className="mb-2">
                We allow <strong>no limitation of the impact period</strong> of
                your certificate. The impact period is from the beginning to the
                end of time. That is, any impact that your action has at any
                point in time counts under this certificate.
              </li>
              <li className="mb-2">
                We allow <strong>no limitation of the impact scopes</strong> of
                your certificate. That is, any impact in any form and shape that
                your action has counts under this certificate.
              </li>
            </ol>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <p className="mt-2 mb-2 text-sm">I confirm that:</p>
      <Switch
        label="I will never sell these rights more than once"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        required
      />
      <Switch
        label="I am happy for this record to be publicly accessible forever"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        required
      />

      <p className="my-6 text-sm">
        When you submit your certificate, you can still edit it, and it will
        remain hidden until a curator publishes it.
      </p>

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
        <div>
          <a
            href="https://airtable.com/shrXCFWdrzgG9jWn3"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium transition-colors hover:text-blue hover:underline"
          >
            Do you have any feedback or tips for us?
          </a>
        </div>
      </div>
    </form>
  )
}
