import { test, expect } from '@playwright/test'

test.describe('Deck Builder Flow (v2)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh (no existing characters or drafts)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    // Wait for splash screen to finish and DeckBuilder to appear
    await expect(
      page.locator('h2:has-text("Choose Your Subclass")')
    ).toBeVisible({ timeout: 10000 })
  })

  test('full deck build flow from splash to HandView', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('404') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text)
        }
      }
    })
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    // Step 0: Pick Subclass — tap School of Knowledge
    await page.click('text=School of Knowledge')
    const continueBtn = page.locator('button:has-text("Continue")')
    await expect(continueBtn).toBeEnabled()
    await continueBtn.click()

    // Step 1: Draft Domain Cards
    await expect(
      page.locator('h2:has-text("Draft Domain Cards")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=0 of 3 selected')).toBeVisible()

    // Domain cards start face-down in CardFlip containers (perspective style).
    // Clicking a face-down card reveals it (flips to front). Once revealed,
    // it's rendered inside a CardSelector instead, so the perspective
    // container disappears. We flip all 6 one at a time.

    // Flip all face-down cards one by one (count decreases after each flip)
    for (let i = 0; i < 6; i++) {
      const flipContainer = page.locator('div[style*="perspective"]').first()
      if (await flipContainer.isVisible({ timeout: 1000 }).catch(() => false)) {
        await flipContainer.click()
        await page.waitForTimeout(400)
      }
    }

    // All cards are now revealed. Select 3 by clicking their card titles.
    const cardsToSelect = ['Book of Ava', 'Book of Illiat', 'Bolt Beacon']
    for (const name of cardsToSelect) {
      await page.locator(`text=${name}`).first().click()
      await page.waitForTimeout(200)
    }

    await expect(page.locator('text=3 of 3 selected')).toBeVisible({
      timeout: 3000,
    })
    await page.locator('button:has-text("Continue")').click()

    // Step 2: Pick Ancestry (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Ancestry")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled()
    await page.getByText('Human', { exact: true }).first().click({ force: true })
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled()
    await page.locator('button:has-text("Continue")').click()

    // Step 3: Pick Community (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Community")')
    ).toBeVisible({ timeout: 3000 })
    await page.getByText('Highborne', { exact: true }).first().click({ force: true })
    await page.locator('button:has-text("Continue")').click()

    // Step 4: Assign Traits (pre-filled with suggested values)
    await expect(
      page.locator('h2:has-text("Assign Traits")')
    ).toBeVisible({ timeout: 3000 })
    await expect(
      page.locator('text=All values assigned')
    ).toBeVisible({ timeout: 2000 })
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled({
      timeout: 2000,
    })
    await page.locator('button:has-text("Continue")').click()

    // Step 5: Name Character
    await expect(
      page.locator('h2:has-text("Name Your Character")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled()
    await page.fill('input[placeholder*="name"]', 'Merlin the Wise')
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled()
    await page.locator('button:has-text("Continue")').click()

    // Step 6: Review — character name visible, "Begin Adventure" button
    await expect(page.locator('text=Merlin the Wise').first()).toBeVisible({
      timeout: 3000,
    })
    await expect(
      page.locator('button:has-text("Begin Adventure")')
    ).toBeVisible()
    await page.locator('button:has-text("Begin Adventure")').click()

    // HandView appears with character name and stat bar
    await expect(page.locator('text=Merlin the Wise').first()).toBeVisible({
      timeout: 5000,
    })
    await expect(page.locator('text=HP')).toBeVisible()

    expect(consoleErrors, 'Console errors were found').toHaveLength(0)
  })

  test('Continue button is disabled until selection is made', async ({
    page,
  }) => {
    // Continue should be disabled before any selection
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled()

    // Make a selection
    await page.click('text=School of War')

    // Continue should now be enabled
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled()
  })

  test('step indicator shows Back button after step 0', async ({ page }) => {
    // Select and continue to step 1
    await page.click('text=School of Knowledge')
    await page.locator('button:has-text("Continue")').click()

    await expect(
      page.locator('h2:has-text("Draft Domain Cards")')
    ).toBeVisible({ timeout: 3000 })

    // Back button should be visible on step 1
    await expect(page.locator('button:has-text("Back")')).toBeVisible()

    // Click Back to return to step 0
    await page.locator('button:has-text("Back")').click()
    await expect(
      page.locator('h2:has-text("Choose Your Subclass")')
    ).toBeVisible({ timeout: 3000 })
  })
})
