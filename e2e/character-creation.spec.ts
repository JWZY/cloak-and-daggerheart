import { test, expect } from '@playwright/test'

test.describe('Character Creation Flow', () => {
  test('complete character creation without errors', async ({ page }) => {
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []

    // Capture console errors and warnings (ignoring 404s for missing resources)
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore 404 errors for missing assets (images, fonts, etc.)
        if (!text.includes('404') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text)
        }
      }
      if (msg.type() === 'warning' && msg.text().includes('Maximum update depth')) {
        consoleWarnings.push(msg.text())
      }
    })

    // Capture page errors (uncaught exceptions)
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    // Navigate to app - goes directly to character creation when no characters exist
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Choose Your Ancestry')

    // Step 1: Select Ancestry (first one - Clank)
    await page.click('text=Clank')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Choose Your Community')

    // Step 2: Select Community (first one - Highborne)
    await page.click('text=Highborne')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Subclass')

    // Step 3: Select Subclass (School of Knowledge)
    await page.click('text=School of Knowledge')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Choose Domain Cards')

    // Step 4: Select 3 Domain Cards (School of Knowledge gets 3)
    // Select cards by their names
    await page.click('text=Book of Ava')
    await page.click('text=Book of Illiat')
    await page.click('text=Bolt Beacon')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Assign Your Traits')

    // Step 5: Assign Traits - use "Use Suggested" for simplicity
    // Wait for traits step to be ready
    await expect(page.locator('h3:has-text("agility")')).toBeVisible()

    // Click "Use Suggested" button to auto-assign all traits
    await page.click('text=Use Suggested')

    // Wait for "All assigned!" message to confirm traits are set
    await expect(page.locator('text=All assigned!')).toBeVisible()

    // Take screenshot to see state
    await page.screenshot({ path: 'test-results/traits-before-continue.png' })

    // The Continue button should now be enabled - wait for it and click
    const continueBtn = page.locator('.glass.fixed button:has-text("Continue")')
    await expect(continueBtn).toBeEnabled({ timeout: 2000 })

    // Force click to bypass any overlay issues
    await continueBtn.click({ force: true })
    await page.waitForTimeout(500) // Wait for animation

    await page.screenshot({ path: 'test-results/traits-after-continue.png' })

    await expect(page.locator('h2')).toContainText('Choose Your Equipment')

    // Step 6: Equipment Selection (use defaults - Quarterstaff and Leather Armor)
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Review Your Character')

    // Step 7: Enter name and complete
    await page.fill('input[placeholder*="name"]', 'Test Wizard')
    await page.click('button:has-text("Create Character")')

    // Verify character sheet loaded
    await expect(page.locator('h1')).toContainText('Test Wizard')
    await expect(page.locator('text=Clank Wizard')).toBeVisible()

    // Navigate tabs to verify they work
    await page.click('button:has-text("Cards")')
    await expect(page.locator('h3:has-text("Domain Cards")')).toBeVisible()

    await page.click('button:has-text("Gear")')
    await expect(page.locator('text=Active Weapons')).toBeVisible()

    await page.click('button:has-text("Notes")')
    await expect(page.locator('h3:has-text("Session Notes")')).toBeVisible()

    await page.click('button:has-text("Stats")')
    await expect(page.locator('text=HP')).toBeVisible()

    // Report errors
    if (consoleErrors.length > 0) {
      console.log('\n❌ Console Errors Found:')
      consoleErrors.forEach((err) => console.log(`  - ${err}`))
    }
    if (consoleWarnings.length > 0) {
      console.log('\n⚠️ Console Warnings Found:')
      consoleWarnings.forEach((warn) => console.log(`  - ${warn.substring(0, 100)}...`))
    }

    // Fail test if there were errors
    expect(consoleErrors, 'Console errors were found').toHaveLength(0)
    expect(consoleWarnings, 'React infinite loop warnings were found').toHaveLength(0)
  })

  test('School of War gets 2 cards and extra HP', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore 404 errors for missing assets (images, fonts, etc.)
        if (!text.includes('404') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text)
        }
      }
    })

    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    // Navigate to app - goes directly to character creation when no characters exist
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Choose Your Ancestry')

    // Create character with School of War
    await page.click('text=Human')
    await page.click('button:has-text("Continue")')
    await page.click('text=Wanderborne')
    await page.click('button:has-text("Continue")')

    // Select School of War
    await page.click('text=School of War')
    await page.click('button:has-text("Continue")')

    // Should only need to select 2 cards - glass counter shows "0 / 2 selected" in span format
    await expect(page.locator('.glass-counter')).toContainText('0')
    await expect(page.locator('.glass-counter')).toContainText('2')

    await page.click('text=Book of Ava')
    await page.click('text=Mending Touch')

    // After selection, counter should show 2
    await expect(page.locator('.glass-counter')).toContainText('2')

    await page.click('button:has-text("Continue")')

    // Assign traits - use "Use Suggested" for simplicity
    await expect(page.locator('h3:has-text("agility")')).toBeVisible()
    await page.click('text=Use Suggested')

    // Wait for "All assigned!" message to confirm traits are set
    await expect(page.locator('text=All assigned!')).toBeVisible()

    // The Continue button should now be enabled - wait for it and click
    const continueBtn2 = page.locator('.glass.fixed button:has-text("Continue")')
    await expect(continueBtn2).toBeEnabled({ timeout: 2000 })
    await continueBtn2.click()
    await expect(page.locator('h2')).toContainText('Choose Your Equipment')

    // Equipment Selection (use defaults)
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Review Your Character')

    // Verify HP is 6 (5 base + 1 from Battlemage)
    await expect(page.locator('text=HP')).toBeVisible()
    await expect(page.locator('text=6').first()).toBeVisible()

    await page.fill('input[placeholder*="name"]', 'War Wizard')
    await page.click('button:has-text("Create Character")')

    // Verify character loaded
    await expect(page.locator('h1')).toContainText('War Wizard')

    expect(consoleErrors, 'Console errors were found').toHaveLength(0)
  })
})
