import { test, expect, Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helper: inject a character into localStorage
// ---------------------------------------------------------------------------

const TEST_CHARACTER = {
  id: 'persist-test-1',
  name: 'Persist Wizard',
  ancestry: {
    name: 'Human',
    description: 'Versatile.',
    feats: [{ name: 'Adaptable', text: 'Gain +1 to a trait.' }],
  },
  community: {
    name: 'Highborne',
    description: 'Nobility.',
    feats: [{ name: 'Connections', text: 'You know people.' }],
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
      text: '**Arcane Barrage:** Deal 2d6 damage.',
      used: false,
    },
    {
      name: 'Bolt Beacon',
      level: '1',
      domain: 'Splendor',
      type: 'Spell',
      recall: '2d8',
      text: '**Lightning Strike:** Call down lightning.',
      used: false,
    },
  ],
  equipment: {
    primaryWeapon: null,
    secondaryWeapon: null,
    armor: null,
    items: [],
    consumables: [],
  },
  gold: 10,
  notes: '',
  backgroundAnswers: [],
  connectionAnswers: [],
  createdAt: Date.now(),
}

async function injectCharacterAndWait(page: Page) {
  await page.goto('/')
  await page.evaluate((charData) => {
    const storeData = {
      state: { characters: [charData] },
      version: 0,
    }
    localStorage.setItem('cloak-characters-v2', JSON.stringify(storeData))
    localStorage.removeItem('cloak-deck-draft-v1')
  }, TEST_CHARACTER)
  await page.reload()
  await expect(page.locator('text=Persist Wizard').first()).toBeVisible({
    timeout: 10000,
  })
}

// ---------------------------------------------------------------------------
// Tests: Character state persistence across reloads
// ---------------------------------------------------------------------------

test.describe('Character Persistence', () => {
  test('HP changes persist after page reload', async ({ page }) => {
    await injectCharacterAndWait(page)

    // HP starts at 5/5
    await expect(page.locator('text=5/5').first()).toBeVisible()

    // Click minus to reduce HP to 4/5
    const hpRow = page.locator('div.grid-cols-2').first().locator('> div').first()
    await hpRow.locator('button').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=4/5').first()).toBeVisible({ timeout: 2000 })

    // Reload the page
    await page.reload()
    // Wait for splash to finish
    await expect(page.locator('text=Persist Wizard').first()).toBeVisible({
      timeout: 10000,
    })

    // HP should still be 4/5 after reload
    await expect(page.locator('text=4/5').first()).toBeVisible({ timeout: 2000 })
  })

  test('card used state persists after reload', async ({ page }) => {
    await injectCharacterAndWait(page)

    // Mark a card as used
    const markUsedBtn = page.locator('button:has-text("Mark Used")').first()
    await expect(markUsedBtn).toBeVisible({ timeout: 3000 })
    await markUsedBtn.click()
    await expect(
      page.locator('button:has-text("Restore")').first()
    ).toBeVisible({ timeout: 2000 })

    // Reload
    await page.reload()
    await expect(page.locator('text=Persist Wizard').first()).toBeVisible({
      timeout: 10000,
    })

    // Card should still show "Restore" (used state persisted)
    await expect(
      page.locator('button:has-text("Restore")').first()
    ).toBeVisible({ timeout: 3000 })
  })

  test('character survives multiple page reloads', async ({ page }) => {
    await injectCharacterAndWait(page)

    // First reload
    await page.reload()
    await expect(page.locator('text=Persist Wizard').first()).toBeVisible({
      timeout: 10000,
    })

    // Second reload
    await page.reload()
    await expect(page.locator('text=Persist Wizard').first()).toBeVisible({
      timeout: 10000,
    })

    // Stats should still be present
    await expect(page.locator('text=HP')).toBeVisible()
    await expect(page.locator('text=Evasion 10')).toBeVisible()
  })
})
