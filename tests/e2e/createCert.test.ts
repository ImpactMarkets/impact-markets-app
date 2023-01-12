import { type Page, expect, test } from '@playwright/test'

const counterfactualText = 'I would be sitting around doing nothing.'
const descriptionText = 'Just a random description.'

async function fillInDefaultValues(page: Page, titleText: string) {
  await page.getByRole('textbox', { name: 'title' }).fill(titleText)

  // TODO: start + end dates
  //await page.getByRole('textbox', { name: 'actionStart' }).fill(actionStartText)
  //await page.getByRole('textbox', { name: 'actionEnd' }).fill(actionEndText)

  await page.click('text=Optional fields')

  await page
    .getByRole('textbox', { name: 'counterfactual' })
    .fill(counterfactualText)

  // TODO: Tags
  //await page.selectOption('#tags', [{label: tagLabel}])

  await page.locator(':nth-match(textarea, 1)').fill(descriptionText)

  // TODO: Advanced options

  await page.click(
    'text=I will never sell these rights (or parts thereof) more than once'
  )
  await page.click(
    'text=I am happy for this record to be publicly accessible forever'
  )
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001/api/auth/signin')
  await page.click('text=Sign in with Mock Login')
})

test.describe('Create Certificate', () => {
  test('should allow creating new certificate', async ({ page }) => {
    const titleText = 'My test project 0001'

    await page.click('text=New project')
    await fillInDefaultValues(page, titleText)
    await page.locator('button[data-testid="submit"]').click()

    // Check we've landed on the cert page.
    await expect(page).toHaveTitle(new RegExp('.*' + titleText + '.*'))
  })

  test('should fill in all certificate values', async ({ page }) => {
    const titleText = 'My test project 0002'

    await page.click('text=New project')
    await fillInDefaultValues(page, titleText)
    await page.locator('button[data-testid="submit"]').click()

    // Check we've landed on the cert page.
    await expect(page).toHaveTitle(new RegExp('.*' + titleText + '.*'))

    // Verify certificate values.
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      titleText
    )
    await expect(page.locator('text=' + descriptionText)).toBeVisible({
      visible: true,
    })
  })
})