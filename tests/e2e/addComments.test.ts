import { type Page, expect, test } from '@playwright/test'

async function fillInAndCreateCert(page: Page, titleText: string) {
  await page.getByRole('textbox', { name: 'title' }).fill(titleText)
  await page.locator(':nth-match(textarea, 1)').fill('description')
  await page.locator('button[data-testid="submit"]').click()
}

// TODO: Replace these delays with an await for some less brittle confirmation of submission.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001/api/auth/signin')
  await page.click('text=Sign in with Mock Login')
  await page.goto('http://localhost:3001/project/new')
})

test.describe('Submits and Replies', () => {
  test('should allow creating a comment', async ({ page }) => {
    const titleText = '0'
    await fillInAndCreateCert(page, titleText)

    const commentText0 = 'toplevel comment 0'
    await page.locator('[data-testid="comment-form"]').fill(commentText0)
    await page.click('text=Submit')

    await expect(page.locator('text=' + commentText0)).toBeVisible({
      visible: true,
    })
  })

  test('should allow creating multiple comments', async ({ page }) => {
    const titleText = '1'
    await fillInAndCreateCert(page, titleText)

    const commentTexts = [
      'toplevel comment 0',
      'toplevel comment 1',
      'toplevel comment 2',
    ]
    for (const commentText of commentTexts) {
      await page.locator('[data-testid="comment-form"]').fill(commentText)
      await page.click('text=Submit')

      // TODO: Replace these delays with an await for some less brittle confirmation of submission.
      // For some reason there's a weird race condition where we try to fill in the next comment
      // before the Comment box is actually visible on the page. I've tried waiting for various
      // elements to become visible (the post itself, the "Submit" button, etc), but no
      // luck yet.
      await delay(200)
    }

    for (const commentText of commentTexts) {
      await expect(page.locator('text=' + commentText)).toBeVisible({
        visible: true,
      })
    }
  })

  test('should allow creating reply on comment', async ({ page }) => {
    const titleText = '2'
    await fillInAndCreateCert(page, titleText)

    await page
      .locator('[data-testid="comment-form"]')
      .fill('toplevel comment 0')
    await page.click('text=Submit')
    await delay(200)

    page.locator(':nth-match(button:is(:text("reply")), 1)').click()

    const replyText0 = 'reply 0'
    await page.locator('[placeholder="Reply"]').fill(replyText0)
    await page.click('text=Add reply')

    await expect(page.locator('text=' + replyText0)).toBeVisible({
      visible: true,
    })
  })

  test('should allow creating multiple replies on comments', async ({
    page,
  }) => {
    const titleText = '3'
    await fillInAndCreateCert(page, titleText)

    const commentTexts = [
      'toplevel comment 0',
      'toplevel comment 1',
      'toplevel comment 2',
    ]
    for (const commentText of commentTexts) {
      await page.locator('[data-testid="comment-form"]').fill(commentText)
      await page.click('text=Submit')
      await delay(200)
    }

    const replyTextLists = [['reply 0'], ['reply 1', 'reply 2'], ['reply 3']]
    for (const i in replyTextLists) {
      for (const replyText of replyTextLists[i]) {
        const matchIdx = Number(i) + 1
        await page
          .locator(':nth-match(button:is(:text("reply")), ' + matchIdx + ')')
          .click()
        await page.locator('[placeholder="Reply"]').fill(replyText)
        await page.click('text=Add reply')
        await delay(200)
      }
    }

    for (const i in replyTextLists) {
      for (const replyText of replyTextLists[i]) {
        await expect(page.locator('text=' + replyText)).toBeVisible({
          visible: true,
        })
      }
    }
  })
})
