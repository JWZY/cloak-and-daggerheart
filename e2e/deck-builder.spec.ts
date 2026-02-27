import { test, expect } from '@playwright/test'

test.describe('Deck Builder Flow (v2)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh (no existing characters or drafts)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    // Wait for splash screen to finish and DeckBuilder to appear (step 0 = PickClass)
    await expect(
      page.locator('h2:has-text("Choose Your Class")')
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

    // Step 0: Pick Class — tap Wizard
    await page.click('text=Wizard')
    const continueBtn = page.locator('button:has-text("Continue")')
    await expect(continueBtn).toBeEnabled()
    await continueBtn.click()

    // Step 1: Pick Subclass — tap School of Knowledge
    await expect(
      page.locator('h2:has-text("Choose Your Subclass")')
    ).toBeVisible({ timeout: 3000 })
    await page.click('text=School of Knowledge')
    await page.locator('button:has-text("Continue")').click()

    // Step 2: Choose Domain Cards (cards at 0.52 scale in horizontal rail)
    await expect(
      page.locator('h2:has-text("Choose Your Domain Cards")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=0 of 3 selected')).toBeVisible()

    // Select 3 cards by tapping (force: true needed due to 0.52 scale transform)
    const cardsToSelect = ['Book of Ava', 'Book of Illiat', 'Bolt Beacon']
    for (const name of cardsToSelect) {
      await page.locator(`text=${name}`).first().click({ force: true })
      await page.waitForTimeout(200)
    }

    await expect(page.locator('text=3 of 3 selected')).toBeVisible({
      timeout: 3000,
    })
    await page.locator('button:has-text("Continue")').click()

    // Step 3: Pick Ancestry (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Ancestry")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled()
    await page.getByText('Human', { exact: true }).first().click({ force: true })
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled()
    await page.locator('button:has-text("Continue")').click()

    // Step 4: Pick Community (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Community")')
    ).toBeVisible({ timeout: 3000 })
    await page.getByText('Highborne', { exact: true }).first().click({ force: true })
    await page.locator('button:has-text("Continue")').click()

    // Step 5: Choose Equipment (defaults pre-selected: Leather Armor + Greatstaff)
    await expect(
      page.locator('h2:has-text("Choose Your Equipment")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled({
      timeout: 2000,
    })
    await page.locator('button:has-text("Continue")').click()

    // Step 6: Assign Traits (pre-filled with suggested values)
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

    // Step 7: Create Experiences (need 2 non-empty)
    await expect(
      page.locator('text=Create Experiences')
    ).toBeVisible({ timeout: 3000 })
    await page.locator('input[placeholder*="Arcane Scholar"]').first().fill('Arcane Scholar')
    await page.locator('input[placeholder*="Arcane Scholar"]').last().fill('War Veteran')
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled({
      timeout: 2000,
    })
    await page.locator('button:has-text("Continue")').click()

    // Step 8: Create Background (optional — just continue)
    await expect(
      page.locator('text=Create Your Background')
    ).toBeVisible({ timeout: 3000 })
    await page.locator('button:has-text("Continue")').click()

    // Step 9: Create Connections (optional — just continue)
    await expect(
      page.locator('text=Create Connections')
    ).toBeVisible({ timeout: 3000 })
    await page.locator('button:has-text("Continue")').click()

    // Step 10: Name Character
    await expect(
      page.locator('h2:has-text("Name Your Character")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled()
    await page.fill('input[placeholder*="name"]', 'Merlin the Wise')
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled()
    await page.locator('button:has-text("Continue")').click()

    // Step 11: Review — character name visible, "Begin Adventure" button
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
    // Continue should be disabled before any selection (step 0 = PickClass)
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled()

    // Make a selection
    await page.click('text=Wizard')

    // Continue should now be enabled
    await expect(page.locator('button:has-text("Continue")')).toBeEnabled()
  })

  test('step indicator shows Back button after step 0', async ({ page }) => {
    // Select class and continue to step 1
    await page.click('text=Wizard')
    await page.locator('button:has-text("Continue")').click()

    await expect(
      page.locator('h2:has-text("Choose Your Subclass")')
    ).toBeVisible({ timeout: 3000 })

    // Back button should be visible on step 1
    await expect(page.locator('button:has-text("Back")')).toBeVisible()

    // Click Back to return to step 0
    await page.locator('button:has-text("Back")').click()
    await expect(
      page.locator('h2:has-text("Choose Your Class")')
    ).toBeVisible({ timeout: 3000 })
  })
})
