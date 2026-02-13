import { test, expect } from '@playwright/test'

test.describe('Character Creation Flow (v2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    // Wait for splash to finish
    await expect(
      page.locator('h2:has-text("Choose Your Subclass")')
    ).toBeVisible({ timeout: 10000 })
  })

  test('complete character creation without errors', async ({ page }) => {
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('404') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text)
        }
      }
      if (msg.type() === 'warning' && msg.text().includes('Maximum update depth')) {
        consoleWarnings.push(msg.text())
      }
    })
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    // Step 0: Select Subclass (School of Knowledge)
    await page.click('text=School of Knowledge')
    await page.locator('button:has-text("Continue")').click()

    // Step 1: Draft Domain Cards — flip and select 3
    await expect(
      page.locator('h2:has-text("Draft Domain Cards")')
    ).toBeVisible({ timeout: 3000 })

    // Flip all face-down cards
    for (let i = 0; i < 6; i++) {
      const flipContainer = page.locator('div[style*="perspective"]').first()
      if (await flipContainer.isVisible({ timeout: 1000 }).catch(() => false)) {
        await flipContainer.click()
        await page.waitForTimeout(400)
      }
    }

    // Select 3 cards
    await page.locator('text=Book of Ava').first().click()
    await page.waitForTimeout(200)
    await page.locator('text=Book of Illiat').first().click()
    await page.waitForTimeout(200)
    await page.locator('text=Bolt Beacon').first().click()
    await page.waitForTimeout(200)

    await page.locator('button:has-text("Continue")').click()

    // Step 2: Select Ancestry (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Ancestry")')
    ).toBeVisible({ timeout: 3000 })
    await page.getByText('Clank', { exact: true }).first().click({ force: true })
    await page.locator('button:has-text("Continue")').click()

    // Step 3: Select Community (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Community")')
    ).toBeVisible({ timeout: 3000 })
    await page.getByText('Highborne', { exact: true }).first().click({ force: true })
    await page.locator('button:has-text("Continue")').click()

    // Step 4: Assign Traits (pre-filled with suggested wizard traits)
    await expect(
      page.locator('h2:has-text("Assign Traits")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=All values assigned')).toBeVisible({
      timeout: 2000,
    })
    await expect(
      page.locator('button:has-text("Continue")')
    ).toBeEnabled({ timeout: 2000 })
    await page.locator('button:has-text("Continue")').click()

    // Step 5: Name Character
    await expect(
      page.locator('h2:has-text("Name Your Character")')
    ).toBeVisible({ timeout: 3000 })
    await page.fill('input[placeholder*="name"]', 'Test Wizard')
    await page.locator('button:has-text("Continue")').click()

    // Step 6: Review
    await expect(page.locator('text=Test Wizard').first()).toBeVisible({
      timeout: 3000,
    })
    await page.locator('button:has-text("Begin Adventure")').click()

    // Verify HandView loaded with character
    await expect(page.locator('text=Test Wizard').first()).toBeVisible({
      timeout: 5000,
    })
    await expect(page.locator('text=HP')).toBeVisible()

    // Report and assert errors
    expect(consoleErrors, 'Console errors were found').toHaveLength(0)
    expect(consoleWarnings, 'React infinite loop warnings were found').toHaveLength(0)
  })

  test('School of War gets extra HP', async ({ page }) => {
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

    // Step 0: Select School of War
    await page.click('text=School of War')
    await page.locator('button:has-text("Continue")').click()

    // Step 1: Draft Domain Cards — flip and select 3
    await expect(
      page.locator('h2:has-text("Draft Domain Cards")')
    ).toBeVisible({ timeout: 3000 })

    for (let i = 0; i < 6; i++) {
      const flipContainer = page.locator('div[style*="perspective"]').first()
      if (await flipContainer.isVisible({ timeout: 1000 }).catch(() => false)) {
        await flipContainer.click()
        await page.waitForTimeout(400)
      }
    }

    await page.locator('text=Book of Ava').first().click()
    await page.waitForTimeout(200)
    await page.locator('text=Mending Touch').first().click()
    await page.waitForTimeout(200)
    await page.locator('text=Bolt Beacon').first().click()
    await page.waitForTimeout(200)

    await page.locator('button:has-text("Continue")').click()

    // Step 2: Select Ancestry (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Ancestry")')
    ).toBeVisible({ timeout: 3000 })
    await page.getByText('Human', { exact: true }).first().click({ force: true })
    await page.locator('button:has-text("Continue")').click()

    // Step 3: Select Community (InfoCards at 0.52 scale inside CardSelector)
    await expect(
      page.locator('h2:has-text("Choose Your Community")')
    ).toBeVisible({ timeout: 3000 })
    await page.getByText('Wanderborne', { exact: true }).first().click({ force: true })
    await page.locator('button:has-text("Continue")').click()

    // Step 4: Assign Traits
    await expect(
      page.locator('h2:has-text("Assign Traits")')
    ).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=All values assigned')).toBeVisible({
      timeout: 2000,
    })
    await page.locator('button:has-text("Continue")').click()

    // Step 5: Name Character
    await expect(
      page.locator('h2:has-text("Name Your Character")')
    ).toBeVisible({ timeout: 3000 })
    await page.fill('input[placeholder*="name"]', 'War Wizard')
    await page.locator('button:has-text("Continue")').click()

    // Step 6: Review — School of War gives +1 HP (5 base + 1 = 6)
    await expect(page.locator('text=War Wizard').first()).toBeVisible({
      timeout: 3000,
    })
    await page.locator('button:has-text("Begin Adventure")').click()

    // Verify HandView loaded
    await expect(page.locator('text=War Wizard').first()).toBeVisible({
      timeout: 5000,
    })

    expect(consoleErrors, 'Console errors were found').toHaveLength(0)
  })
})
