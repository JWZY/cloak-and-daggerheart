import { test, expect } from '@playwright/test'

test.describe('Character Edit Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // Create a character first using the same pattern as character-creation.spec.ts
    await expect(page.locator('h2')).toContainText('Choose Your Ancestry')

    // Step 1: Select Ancestry
    await page.click('text=Human')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Choose Your Community')

    // Step 2: Select Community
    await page.click('text=Highborne')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Subclass')

    // Step 3: Select Subclass (School of Knowledge)
    await page.click('text=School of Knowledge')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Choose Domain Cards')

    // Step 4: Select 3 Domain Cards (School of Knowledge gets 3)
    await page.click('text=Book of Ava')
    await page.click('text=Book of Illiat')
    await page.click('text=Bolt Beacon')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Assign Your Traits')

    // Step 5: Assign Traits - use "Use Suggested" for simplicity
    await expect(page.locator('h3:has-text("agility")')).toBeVisible()
    await page.click('text=Use Suggested')
    await expect(page.locator('text=All assigned!')).toBeVisible()
    const continueBtn = page.locator('.glass.fixed button:has-text("Continue")')
    await expect(continueBtn).toBeEnabled({ timeout: 2000 })
    await continueBtn.click({ force: true })
    await page.waitForTimeout(500)

    await expect(page.locator('h2')).toContainText('Choose Your Equipment')

    // Step 6: Equipment Selection (use defaults)
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Review Your Character')

    // Step 7: Enter name and complete
    await page.fill('input[placeholder*="name"]', 'Test Wizard')
    await page.click('button:has-text("Create Character")')

    // Verify character sheet loaded
    await expect(page.locator('h1').first()).toContainText('Test Wizard')
  })

  test('edit from Stats tab shows Ancestry step', async ({ page }) => {
    // We're on the character sheet, Stats tab should be active by default
    await expect(page.locator('button:has-text("Stats")')).toBeVisible()

    // Click the edit button (the floating glass button with pencil icon)
    await page.locator('button.glass.rounded-full.w-14').click()

    // Should navigate to the edit flow at Ancestry step
    await expect(page.locator('h2')).toContainText('Choose Your Ancestry', { timeout: 5000 })
    await expect(page.locator('text=Edit Character')).toBeVisible()
  })

  test('edit from Cards tab shows Domain Cards step', async ({ page }) => {
    // Click on Cards tab
    await page.click('button:has-text("Cards")')
    await expect(page.locator('h3:has-text("Domain Cards")')).toBeVisible()

    // Click the edit button
    await page.locator('button.glass.rounded-full.w-14').click()

    // Should navigate to the edit flow at Cards step (domain cards)
    await expect(page.locator('h2')).toContainText('Choose Domain Cards', { timeout: 5000 })
    await expect(page.locator('text=Edit Character')).toBeVisible()
  })

  test('edit from Gear tab shows Equipment step', async ({ page }) => {
    // Wait for animations to settle
    await page.waitForTimeout(500)

    // Click on Gear tab (inventory)
    await page.click('button:has-text("Gear")')
    // Wait for tab content to load (the Inventory tab has weapon-related content)
    await expect(page.locator('text=/active weapons/i')).toBeVisible({ timeout: 5000 })

    // Click the edit button
    await page.locator('button.glass.rounded-full.w-14').click()

    // Should navigate to the edit flow at Equipment step
    await expect(page.locator('h2')).toContainText('Choose Your Equipment', { timeout: 5000 })
    await expect(page.locator('text=Edit Character')).toBeVisible()
  })

  test('edit from Notes tab shows Review step', async ({ page }) => {
    // Click on Notes tab
    await page.click('button:has-text("Notes")')
    await expect(page.locator('h3:has-text("Session Notes")')).toBeVisible()

    // Click the edit button
    await page.locator('button.glass.rounded-full.w-14').click()

    // Should navigate to the edit flow at Summary step
    await expect(page.locator('h2')).toContainText('Review Your Character', { timeout: 5000 })
    await expect(page.locator('text=Edit Character')).toBeVisible()
  })
})
