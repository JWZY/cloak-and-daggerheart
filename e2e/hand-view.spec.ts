import { test, expect, Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helper: build a valid Character object and inject into localStorage
// ---------------------------------------------------------------------------

const TEST_CHARACTER = {
  id: 'e2e-test-char-1',
  name: 'Elara the Wise',
  level: 1,
  ancestry: {
    name: 'Human',
    description: 'Versatile and ambitious.',
    feats: [{ name: 'Adaptable', text: 'Gain +1 to a trait of your choice.' }],
  },
  community: {
    name: 'Highborne',
    description: 'Born into privilege.',
    feats: [{ name: 'Connections', text: 'You know people in high places.' }],
  },
  class: 'Wizard',
  subclass: 'School of Knowledge',
  traits: {
    agility: -1,
    strength: 0,
    finesse: 0,
    instinct: 1,
    presence: 1,
    knowledge: 2,
  },
  hp: { current: 5, max: 5 },
  armorSlots: { current: 3, max: 3 },
  hope: 2,
  stress: { current: 0, max: 6 },
  evasion: 10,
  proficiency: 1,
  domainCards: [
    {
      name: 'Book of Ava',
      level: '1',
      domain: 'Codex',
      type: 'Spell',
      recall: '2d6',
      text: '**Arcane Barrage:** Deal 2d6 damage to a target within far range.',

    },
    {
      name: 'Book of Illiat',
      level: '1',
      domain: 'Codex',
      type: 'Spell',
      recall: '2d6',
      text: 'You conjure a protective ward that absorbs damage.',

    },
    {
      name: 'Bolt Beacon',
      level: '1',
      domain: 'Splendor',
      type: 'Spell',
      recall: '2d8',
      text: '**Lightning Strike:** Call down a bolt of lightning on a target.',

    },
  ],
  equipment: {
    primaryWeapon: {
      name: 'Greatstaff',
      primary_or_secondary: 'Primary',
      tier: '1',
      physical_or_magical: 'Magical',
      trait: 'Knowledge',
      range: 'Far',
      damage: '2d8',
      burden: '1',
    },
    secondaryWeapon: null,
    armor: {
      name: 'Leather Armor',
      tier: '1',
      base_thresholds: '6 / 13',
      base_score: '3',
    },
    items: [],
    consumables: [],
  },
  gold: 10,
  notes: '',
  advancements: [],
  markedTraits: [],
  subclassTier: 'foundation',
  backgroundAnswers: [],
  experiences: [],
  connectionAnswers: [],
  createdAt: Date.now(),
}

/**
 * Inject a character into localStorage so the app shows HandView directly.
 * The Zustand persist middleware stores data as { state: { characters: [...] }, version: 0 }.
 */
async function injectCharacterAndWait(page: Page) {
  await page.goto('/')
  await page.evaluate((charData) => {
    const storeData = {
      state: { characters: [charData], activeCharacterId: charData.id },
      version: 0,
    }
    localStorage.setItem('cloak-characters-v3', JSON.stringify(storeData))
    localStorage.removeItem('cloak-deck-draft-v2')
  }, TEST_CHARACTER)
  await page.reload()
  // Wait for splash screen to finish and HandView to appear
  await expect(page.locator('text=Elara the Wise').first()).toBeVisible({
    timeout: 10000,
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Hand View Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await injectCharacterAndWait(page)
  })

  test('displays character name in hero card area', async ({ page }) => {
    await expect(page.locator('text=Elara the Wise').first()).toBeVisible()
  })

  test('stat bar shows HP, Armor, Hope, Stress labels', async ({ page }) => {
    await expect(page.getByText('HP', { exact: true })).toBeVisible()
    await expect(page.getByText('Armor', { exact: true })).toBeVisible()
    await expect(page.getByText('Hope', { exact: true })).toBeVisible()
    await expect(page.getByText('Stress', { exact: true })).toBeVisible()
  })

  test('stat bar shows evasion badge', async ({ page }) => {
    await expect(page.locator('text=Evasion 10')).toBeVisible()
  })

  test('HP buttons adjust HP value', async ({ page }) => {
    // HP starts at 5/5
    await expect(page.locator('text=5/5').first()).toBeVisible()

    // Find the HP row by its label, then navigate to sibling buttons
    const hpRow = page.getByText('HP', { exact: true }).locator('..')

    // Click minus (first button in the row)
    await hpRow.locator('button').first().click()
    await page.waitForTimeout(300)

    // HP should now be 4/5
    await expect(page.locator('text=4/5').first()).toBeVisible({ timeout: 2000 })

    // Click plus (last button in the row) to restore
    await hpRow.locator('button').last().click()
    await page.waitForTimeout(300)

    // HP should be back to 5/5
    await expect(page.locator('text=5/5').first()).toBeVisible({ timeout: 2000 })
  })

  test('collapsible panels open and close', async ({ page }) => {
    // Click Traits panel header to open it
    await page.locator('button:has-text("Traits")').click()
    await page.waitForTimeout(400)

    // Trait names should be visible
    await expect(page.locator('text=knowledge').first()).toBeVisible({
      timeout: 2000,
    })

    // Click again to close
    await page.locator('button:has-text("Traits")').click()
    await page.waitForTimeout(400)

    // Open Equipment panel
    await page.locator('button:has-text("Equipment")').click()
    await page.waitForTimeout(400)

    // Weapon info should be visible
    await expect(page.locator('text=Greatstaff').first()).toBeVisible({
      timeout: 2000,
    })
  })

  test('domain cards carousel is present', async ({ page }) => {
    // At least one domain card name should be visible in the carousel
    await expect(page.locator('text=Book of Ava').first()).toBeVisible({
      timeout: 3000,
    })
  })

  test('back button returns to character select', async ({ page }) => {
    // Click the back button
    const backBtn = page.getByTestId('back-to-select')
    await expect(backBtn).toBeVisible({ timeout: 2000 })
    await backBtn.click()

    // After going back, should show CharacterSelect with the character still listed
    await expect(
      page.locator('text=Characters').first()
    ).toBeVisible({ timeout: 10000 })
  })
})
