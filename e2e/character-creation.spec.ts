import { test, expect } from '@playwright/test'

test.describe('Character Creation Flow', () => {
  test('complete character creation without errors', async ({ page }) => {
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []

    // Capture console errors and warnings
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
      if (msg.type() === 'warning' && msg.text().includes('Maximum update depth')) {
        consoleWarnings.push(msg.text())
      }
    })

    // Capture page errors (uncaught exceptions)
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    // Navigate to app
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Daggerheart')

    // Click Create Character
    await page.click('button:has-text("Create Character")')
    await expect(page.locator('h2')).toContainText('Choose Your Ancestry')

    // Step 1: Select Ancestry (first one - Clank)
    await page.click('text=Clank')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Choose Your Community')

    // Step 2: Select Community (first one - Highborne)
    await page.click('text=Highborne')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Choose Your School')

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

    // Step 5: Assign Traits (-1, 0, 0, +1, +1, +2)
    // Assign to each trait in order
    const traitSections = page.locator('.rounded-xl.border').filter({ hasText: /agility|strength|finesse|instinct|presence|knowledge/i })

    // Agility: -1
    await traitSections.filter({ hasText: /agility/i }).locator('button:has-text("-1")').click()
    // Strength: 0
    await traitSections.filter({ hasText: /strength/i }).locator('button:has-text("0")').click()
    // Finesse: 0
    await traitSections.filter({ hasText: /finesse/i }).locator('button:has-text("0")').click()
    // Instinct: +1
    await traitSections.filter({ hasText: /instinct/i }).locator('button:has-text("+1")').click()
    // Presence: +1
    await traitSections.filter({ hasText: /presence/i }).locator('button:has-text("+1")').click()
    // Knowledge: +2
    await traitSections.filter({ hasText: /knowledge/i }).locator('button:has-text("+2")').click()

    await page.click('button:has-text("Continue")')
    await expect(page.locator('h2')).toContainText('Review Your Character')

    // Step 6: Enter name and complete
    await page.fill('input[placeholder*="name"]', 'Test Wizard')
    await page.click('button:has-text("Create Character")')

    // Verify character sheet loaded
    await expect(page.locator('h1')).toContainText('Test Wizard')
    await expect(page.locator('text=Clank Wizard')).toBeVisible()

    // Navigate tabs to verify they work
    await page.click('button:has-text("Cards")')
    await expect(page.locator('h3:has-text("Domain Cards")')).toBeVisible()

    await page.click('button:has-text("Gear")')
    await expect(page.locator('h3:has-text("Weapons")')).toBeVisible()

    await page.click('button:has-text("Notes")')
    await expect(page.locator('h3:has-text("Session Notes")')).toBeVisible()

    await page.click('button:has-text("Stats")')
    await expect(page.locator('text=Hit Points')).toBeVisible()

    // Test dice tray opens
    const diceButton = page.locator('button.fixed').filter({ has: page.locator('svg') })
    await diceButton.click()
    await expect(page.locator('text=Roll Duality Dice')).toBeVisible()

    // Roll dice
    await page.click('button:has-text("Roll Duality Dice")')
    await page.waitForTimeout(600)
    await expect(page.locator('text=/with Hope|with Fear|Critical Success/').first()).toBeVisible()

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
        consoleErrors.push(msg.text())
      }
    })

    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    await page.goto('/')

    // Create character with School of War
    await page.click('button:has-text("Create Character")')
    await page.click('text=Human')
    await page.click('button:has-text("Continue")')
    await page.click('text=Wanderborne')
    await page.click('button:has-text("Continue")')

    // Select School of War
    await page.click('text=School of War')
    await page.click('button:has-text("Continue")')

    // Should only need to select 2 cards
    await expect(page.locator('text=0 / 2 selected')).toBeVisible()

    await page.click('text=Book of Ava')
    await page.click('text=Mending Touch')
    await expect(page.locator('text=2 / 2 selected')).toBeVisible()

    await page.click('button:has-text("Continue")')

    // Assign traits
    const traitSections = page.locator('.rounded-xl.border').filter({ hasText: /agility|strength|finesse|instinct|presence|knowledge/i })
    await traitSections.filter({ hasText: /agility/i }).locator('button:has-text("-1")').click()
    await traitSections.filter({ hasText: /strength/i }).locator('button:has-text("0")').click()
    await traitSections.filter({ hasText: /finesse/i }).locator('button:has-text("0")').click()
    await traitSections.filter({ hasText: /instinct/i }).locator('button:has-text("+1")').click()
    await traitSections.filter({ hasText: /presence/i }).locator('button:has-text("+1")').click()
    await traitSections.filter({ hasText: /knowledge/i }).locator('button:has-text("+2")').click()

    await page.click('button:has-text("Continue")')

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
