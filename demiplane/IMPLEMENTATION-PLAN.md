# Implementation Plan: Combat Features Sprint

**Date:** 2026-03-13
**Source:** Demiplane competitive analysis — features to steal
**Priority:** Up next (after mobile/desktop layout unification)

---

## Overview

Five features that Demiplane ships and we don't. These are at-the-table gameplay features, not cosmetic. Ordered by combat utility (highest first).

---

## 1. Damage Threshold Reference Row

**Size:** S | **Effort:** ~1 session | **Files:** 2-3

### What
A clear "Minor → Major → Severe" reference row in StatBar, directly below the existing Armor row. Shows the threshold values and how many HP to mark for each.

### Why this matters
Most-referenced rule in combat. GM says "you take 9 damage" — player needs to instantly know severity. Currently we show Major/Severe as tiny GameBadges inline with Evasion. Easy to miss, and no "Minor" or "mark X HP" context.

### What exists
- `parseThresholds()` in `src/core/character/armor.ts` — parses `base_thresholds` string into `{ major, severe }`
- StatBar already shows `Major {n}` and `Severe {n}` GameBadges (lines 180-188)
- Threshold values = base + character.level (already calculated)

### Implementation
1. **Replace** the existing inline GameBadge row (StatBar lines 178-188) with a dedicated "Damage Reference" row
2. **Layout:** Three segments in a row: `Minor (below Major) = 1 HP` | `Major [7] = 2 HP` | `Severe [13] = 3 HP`
3. **Style:** Use the warm glass pill pattern. Values in gold, "mark X HP" in muted text
4. Minor threshold = any damage below Major threshold (no number needed, just the label)
5. Keep Evasion badge — move it to its own line or keep it inline with Armor

### No type changes needed
All data already available on `Character`.

---

## 2. Weapon Stat Block

**Size:** M | **Effort:** ~1-2 sessions | **Files:** 3-4

### What
A structured weapon display in the hand view showing: name, range, attack modifier (trait value), damage dice, damage type, burden, and weapon feat if any.

### Why this matters
Player rolling an attack currently has to: (1) find their weapon in the equipment list, (2) find the trait used, (3) look at the trait bar for the modifier, (4) mentally combine them. The weapon stat block does this for them.

### What exists
- `Weapon` interface in `src/types/character.ts` — has all fields: `trait`, `range`, `damage`, `burden`, `physical_or_magical`, `feat_name/feat_text`
- `Character.equipment.primaryWeapon` and `secondaryWeapon` — already stored
- `Character.traits[weapon.trait.toLowerCase()]` — attack modifier calculable
- `EquipmentPanel` exists but renders a flat list

### Implementation
1. **New component:** `WeaponPanel.tsx` in `src/hand/`
   - Props: `weapon: Weapon`, `attackMod: number` (pre-calculated from trait), `proficiency: number`
   - Layout: Weapon name (gold, large) | Range tag | Attack: `+{traitMod}` {Trait} | Damage: `{dice}` {type} | Burden tag
   - If weapon has a feat: show feat name + text below (collapsible or inline)
   - Use warm glass styling consistent with other panels
2. **Render in MobileLayout and DesktopLayout** — above Equipment section, below Domain Abilities
   - Show primary weapon, then secondary if equipped
3. **Attack modifier calc:** `character.traits[weapon.trait.toLowerCase()] + character.proficiency` (verify against SRD rules)
4. **No type changes needed** — all data on `Character.equipment`

### Open question
- Do we want a "roll attack" button on the weapon panel? Could integrate with existing dice roller. Scope creep risk — maybe v2.

---

## 3. Ability Usage Tracking

**Size:** M | **Effort:** ~2 sessions | **Files:** 5-6

### What
Toggle/checkbox on features that have limited uses (per-rest, per-session). Visual state: used/available. Resets on rest.

### Why this matters
Players with once-per-rest abilities currently have to remember what they've used. Paper sheets handle this with pencil marks — we should do at least as well.

### What exists
- `FeaturePanel` renders all features as static text
- SRD ability data has `recall` cost (for domain cards, not class features)
- Class/ancestry/community feats are unstructured `{ name, text }` — no usage metadata in SRD JSON

### The problem
The SRD JSON doesn't tag features as "per rest" or "per session" — that information is embedded in the feature text (e.g., "Once per long rest, you can..."). We have two options:

**Option A: Parse feature text** for patterns like "per rest", "per session", "once per", "per short rest"
- Pro: Automatic for all features
- Con: Fragile regex, may miss cases or false-positive

**Option B: Manual toggle on any feature** — let the player mark any feature as "used"
- Pro: Simple, no text parsing, works for all features
- Con: Player has to decide which features to track

### Implementation (Option B — recommended)
1. **Type change:** Add `usedFeatures: string[]` to `Character` — array of feature name strings currently marked as used
2. **Store action:** `toggleFeatureUsed(characterId, featureName)` — add/remove from array
3. **Store action:** `resetFeatureUsage(characterId)` — clear array (called on rest)
4. **FeaturePanel update:** Add optional `used?: boolean` and `onToggleUsed?: () => void` props
   - When `onToggleUsed` provided: show a small toggle/circle indicator in the header
   - When `used=true`: dim the panel slightly (opacity 0.6 or desaturate)
5. **Wire up** in MobileLayout and DesktopLayout — pass `used` and `onToggleUsed` to all FeaturePanels
6. **Rest button** — add a "Rest" action somewhere (maybe StatBar or a floating action) that resets usage + recovers HP/stress per rules

### Migration
Add `usedFeatures: []` default in character store migration.

---

## 4. Conditions Tracker

**Size:** M | **Effort:** ~1-2 sessions | **Files:** 4-5

### What
A chip/tag system for tracking active conditions (Hidden, Restrained, Vulnerable, plus custom/temporary conditions from abilities).

### Why this matters
Conditions affect what actions a player can take. Forgetting an active condition is a common table mistake.

### What exists
- `daggerheart-srd-main/contents/Conditions.md` — full rules for Hidden, Restrained, Vulnerable
- No condition data in Character type
- No condition UI

### Implementation
1. **Type change:** Add `conditions: string[]` to `Character`
2. **Core constants:** `src/core/rules/conditions.ts` — export the three standard conditions with descriptions:
   ```ts
   export const CONDITIONS = [
     { name: 'Hidden', description: 'Rolls against you have disadvantage. Breaks when spotted or you act.' },
     { name: 'Restrained', description: "Can't move but can still act. Clear by making a move." },
     { name: 'Vulnerable', description: 'Rolls targeting you have advantage. Clear by making a move.' },
   ]
   ```
3. **Store actions:** `addCondition(id, name)`, `removeCondition(id, name)`, `clearConditions(id)`
4. **UI component:** `ConditionBar.tsx` in `src/hand/`
   - Renders as a row of chip/tags below StatBar (or integrated into StatBar)
   - Tap a standard condition chip to toggle it on/off
   - "+" button to add custom condition text (for ability-specific conditions like "Hexed")
   - Active conditions: filled chip with accent color. Inactive: outline only or hidden
   - Keep it compact — this should be ~40px tall when no conditions active, expanding when conditions are added
5. **Placement:** Between StatBar and Trait Bar in both layouts

### Migration
Add `conditions: []` default in character store migration.

---

## 5. Character Portraits

**Size:** M | **Effort:** ~1-2 sessions | **Files:** 4-5

### What
A character portrait/avatar shown in the header. User can upload an image or use a class/subclass default.

### Why this matters
Players are emotionally attached to their character's appearance. A portrait adds personality and makes the character sheet feel like *theirs*, not a generic data form. Also the lowest-priority feature in this sprint because it's not mechanically useful — it's emotional.

### What exists
- `CharacterHeader` component in both mobile and desktop layouts
- Desktop has a `DomainBanner` in the identity banner, no portrait
- Mobile CharacterHeader is text-only
- Class/subclass art images exist in `/public/images/cards/`

### Implementation
1. **Type change:** Add `portrait?: string` to `Character` — base64 data URL or empty
2. **Store action:** `setPortrait(characterId, dataUrl)`
3. **Default portrait:** If no custom portrait, show the subclass art (already have `subclassArtSrc()`) in a circular mask
4. **Upload flow:**
   - Tap portrait circle → file picker (accept images)
   - Resize/crop to square (use canvas API, no external deps)
   - Store as base64 data URL in character store
   - Keep it under ~100KB (resize to 200x200 max)
5. **Display:**
   - Mobile `CharacterHeader`: 44px circle to the left of name
   - Desktop identity banner: 56px circle to the left of the DomainBanner
6. **No crop UI in v1** — just center-crop to square. Fancy crop tool is scope creep.

### Migration
`portrait` is optional, no migration needed — `undefined` falls back to subclass art.

---

## 6. Trait Bar Readability (Mobile)

**Size:** S | **Effort:** ~30 min | **Files:** 1

### What
Switch mobile trait bar from 6-column to 3x2 grid with larger values, matching Demiplane's readability but keeping our visual style.

### Why
6 columns at 375px = 55px per trait. At 11px font, it's squinty. Demiplane's 3x2 with bigger values is more readable one-handed.

### Implementation
1. **MobileLayout only** — change trait grid from `grid-cols-6` to `grid-cols-3` with 2 rows
2. Increase trait value font to 20-24px
3. Keep trait name, spellcast highlight, and action verbs
4. Desktop stays 6-column (plenty of room)

---

## Suggested Order

| # | Feature | Size | Dependencies |
|---|---------|------|-------------|
| 1 | Trait Bar Readability | S | None — quick win |
| 2 | Damage Threshold Row | S | None — enhances existing StatBar |
| 3 | Weapon Stat Block | M | None — new component |
| 4 | Conditions Tracker | M | Type change + new component |
| 5 | Ability Usage Tracking | M | Type change + FeaturePanel update |
| 6 | Character Portraits | M | Type change + upload flow |

Features 1-3 are pure additions with no type changes. Features 4-6 require Character type changes and store migrations — batch those together.

---

## What's NOT in scope

- Dice rolling from weapon panels (future)
- Loadout/vault mechanics for domain cards (future — separate feature)
- Downtime actions (future)
- Journal/session notes structure (future)
- Hope max (SRD doesn't define a hard cap — current behavior is correct)
