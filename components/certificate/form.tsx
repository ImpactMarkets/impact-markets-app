import { useSession } from 'next-auth/react'
import * as React from 'react'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useIntercom } from 'react-use-intercom'

import { Button } from '@/components/button'
import { ButtonLink } from '@/components/buttonLink'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdownEditor'
import { TAGS } from '@/components/project/tags'
import { TextField } from '@/components/textField'
import { BondingCurve } from '@/lib/auction'
import { DEFAULT_TARGET, DEFAULT_VALUATION, SHARE_COUNT } from '@/lib/constants'
import { num } from '@/lib/text'
import {
  isListOfEmails,
  isListOfEmailsValidationMessage,
} from '@/lib/validations'
import { Accordion, SimpleGrid, Switch } from '@mantine/core'
import { Prisma } from '@prisma/client'

import { IMMultiSelect } from '../multiSelect'

const DESCRIPTION_PROMPTS = (
  <>
    <p className="mt-2 ml-1">Please touch on the following points:</p>
    <ol className="list-decimal list-outside m-6">
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
  counterfactual: string
  location: string
  rights: string
  actionStart: string
  actionEnd: string
  tags: string
  issuerEmails: string
  // These defaults are set for new forms but not for editing
  valuation?: Prisma.Decimal
  target?: Prisma.Decimal
}

type CertificateFormProps = {
  defaultValues: FormData
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
  const {
    control,
    register,
    formState,
    getValues,
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues,
  })

  // FIXME: Doesn’t work reliably in webkit browsers, thinks the submission were a route change
  // useLeaveConfirm({ formState })

  const { isSubmitSuccessful } = formState

  const { show } = useIntercom()

  const { data: session } = useSession()

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues())
    }
  }, [isSubmitSuccessful, reset, getValues])

  const one = new Prisma.Decimal(1)
  const watchValuation = watch('valuation')
  const watchTarget = watch('target')

  const [issuerEmailsData, setIssuerEmailsData] = useState(
    (getValues().issuerEmails || session!.user.email)
      .split(',')
      .map((email) => {
        return { value: email, label: email }
      })
  )

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

      <p className="mt-2 mb-2 text-sm">I confirm that:</p>
      <Switch
        label="I will never sell these rights (or parts thereof) more than once"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        defaultChecked={!isNew}
        required
      />
      <Switch
        label="I am happy for this record to be publicly accessible forever"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        defaultChecked={!isNew}
        required
      />
      <Accordion variant="separated" className="my-6">
        <Accordion.Item value="optional-fields">
          <Accordion.Control>Optional fields</Accordion.Control>
          <Accordion.Panel className="text-sm">
            <TextField
              {...register('counterfactual')}
              label="Counterfactual"
              description="What would you have done (or what would you do) if there were no offer of retroactive funding?"
              info="This is not displayed publicly"
              className="my-6"
            />
            <IMMultiSelect
              {...register('tags')}
              label="Tags"
              description={
                <>
                  Please select all that apply or{' '}
                  <span className="link" onClick={() => show()}>
                    leave us feedback
                  </span>{' '}
                  if you can’t find suitable tags for your field and type of
                  work so we can add them.
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
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
          value="advanced-options"
          className={session!.user.prefersDetailView ? '' : 'hidden'}
        >
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
                      description="You won’t sell a single share below what valuation?"
                      rightSection="USD"
                      classNames={{ rightSection: 'w-16' }}
                      type="number"
                      step="1"
                      min="1"
                      max="1e30"
                      required
                    />
                  </div>
                  <div className="mt-6 space-y-6">
                    <TextField
                      {...register('target', {
                        required: true,
                      })}
                      label="Fundraising target"
                      description="How much do you hope to raise?"
                      rightSection="USD"
                      classNames={{ rightSection: 'w-16' }}
                      type="number"
                      step="1"
                      min="1"
                      max="1e30"
                      required
                    />
                  </div>
                </SimpleGrid>
                <table className="text-sm mx-auto mt-6">
                  <tbody>
                    <tr>
                      <td className="text-right pr-4">Shares:</td>
                      <td className="text-right pr-4">
                        {num(new Prisma.Decimal(SHARE_COUNT))}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-right pr-4">Maximum valuation:</td>
                      <td className="text-right pr-4">
                        $
                        {num(
                          new BondingCurve(
                            new Prisma.Decimal(watchTarget || DEFAULT_TARGET)
                          ).valuationOfSize(
                            new Prisma.Decimal(
                              watchValuation || DEFAULT_VALUATION
                            ),
                            one
                          ),
                          0
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-right pr-4">Maximum fundraise:</td>
                      <td className="text-right pr-4">
                        $
                        {num(
                          new BondingCurve(
                            new Prisma.Decimal(watchTarget || DEFAULT_TARGET)
                          ).costOfSize(
                            new Prisma.Decimal(
                              watchValuation || DEFAULT_VALUATION
                            ),
                            one
                          ),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

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

            <IMMultiSelect
              {...register('issuerEmails', {
                validate: (value) => isListOfEmails(value),
              })}
              label="Issuers' email addresses"
              description="Please enter the exact email addresses that you and the other issuers use on this platform."
              className="mt-6"
              data={issuerEmailsData}
              onChange={(value) => {
                Array.isArray(value)
                  ? setValue('issuerEmails', value.join(','))
                  : null
              }}
              onKeyPress={(event) => {
                if (event.key === ' ') {
                  event.preventDefault()
                }
              }}
              defaultValue={
                getValues().issuerEmails
                  ? getValues().issuerEmails.split(',')
                  : [session!.user.email]
              }
              searchable // allows typing
              creatable
              getCreateLabel={(query) => `+ Add ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query }
                setIssuerEmailsData((current) => [...current, item])
                return item
              }}
            />
            {formState.errors.issuerEmails && (
              <p className="text-red">
                {isListOfEmailsValidationMessage(getValues('issuerEmails'))}
              </p>
            )}

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

      <p className="my-6 text-sm">
        When you submit your certificate, you can still edit it, and it will
        remain hidden until a curator publishes it.
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
