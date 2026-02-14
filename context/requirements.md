# Requirements & Locked-In Decisions

> This file captures decisions so they never need to be reiterated.
> If building a v3 or refactoring, check here first.

## v3 Architecture Principle

> **Data-driven from SRD JSON. No class-specific hardcoding.**

The deck builder and character model must read class data (domains, HP, evasion, suggested equipment, subclasses, foundation features) from `daggerheart-srd-main/.build/json/`. Adding a new class should mean adding its SRD data, not writing new code.

- **MVP focus: Wizard only.** Ship and polish the Wizard experience first. But build the data pipeline generically so it works for any class.
- Class selection step reads from `classes.json` — class name, domains, HP, evasion, suggested equipment, subclasses
- Subclass options, foundation features, domain card pools all derived from selected class data
- Equipment options filtered by tier, with class `suggested_*` fields as defaults
- No `if (class === 'Wizard')` branches — use the data

### v3 Component Naming

Rename card components to match their game concepts (not implementation details):
- `SRDCard` → `SubclassCard`
- `DomainCard` → stays (already correctly named)
- `InfoCard` → split into `AncestryCard` and `CommunityCard`

## Card Visual Language

### ALL cards must match SRDCard style
- **DomainCard, InfoCard, and SRDCard share the same visual DNA**
- Dark background (#03070d), 360x508px, 12px border radius
- Gold gradient typography (EB Garamond): #f9f8f3 → #e7ba90
- Atmosphere texture (atmosphere.png), card frame overlay (frame.svg at 60%)
- Diamond-line separators between sections
- Source Sans 3 for body text (13.5px, line-height 1.4)
- EB Garamond for titles (small-caps, weight 500) and subtitles (weight 600, 13px)
- Content area pinned to bottom with gradient fade from illustration

### DomainCard specifics
- Single domain icon in pennant banner (not 2 like SRDCard)
- Banner uses domain color for outer fill, darkened for inner pennant
- Shows: title, type · Level X · Recall Y subtitle, ability text, domain footer
- NO polygon clip paths, NO white backgrounds, NO Noto Sans

### InfoCard specifics
- Used for Ancestries and Communities
- Large faint decorative title in top zone (72px, 8% opacity)
- Description in italic, then feats list
- Footer with optional left/right text

## Daggerheart Mechanics Reference (from SRD)

> Authoritative rules extracted from `daggerheart-srd-main/`. Consult this before implementing any game mechanic.

### Character Creation (SRD order, 9 steps)

1. **Choose Class and Subclass** — pick class, pick subclass, take foundation card
2. **Choose Heritage** — pick Ancestry (2 features) + Community (1 feature)
3. **Assign Traits** — distribute +2, +1, +1, +0, +0, -1 across 6 traits (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
4. **Record Additional Info** — Level (1), Evasion (from class), HP (from class), Stress (6 slots), Hope (starts at 2)
5. **Choose Starting Equipment** — Tier 1 weapons (primary, optional secondary), Tier 1 armor (4 options), inventory items (torch, rope, supplies, gold, potion choice, class-specific item)
6. **Create Background** — answer background questions (narrative, no mechanical effect)
7. **Create Experiences** — 2 Experiences at +2 each
8. **Choose Domain Cards** — 2 Level 1 cards from class's domains (exception: School of Knowledge Wizard gets 3 via "Prepared")
9. **Create Connections** — establish PC relationships (optional)

### Domain Cards

- L1 characters get exactly **2** domain cards, chosen from their class's two domains
- **Exception:** School of Knowledge Wizard gets **3** via "Prepared" foundation feature
- Each domain has exactly 3 Level 1 options
- No universal "used/unused" or "exhaust" mechanic — individual cards may have usage limits
- **Vaulting** has two aspects:
  - **Loadout limit:** max 5 active cards. Excess go to vault. Typically relevant at L5+ (6+ total cards)
  - **Individual card abilities** can send cards to vault as a cost (relevant at L2+ for some domains)
- For L1 Wizard: none of the L1 Codex/Splendor cards reference the vault

### Damage Thresholds

- **Formula:** armor `base_thresholds` + character level
- Three tiers: below Major = 1 HP, at/above Major = 2 HP, at/above Severe = 3 HP
- Damage reduced to 0 or less = no HP marked
- Armor slots can reduce severity by 1 when marked

### Tier 1 Armor (4 options with tradeoffs)

| Armor | Base Thresholds (Major/Severe) | Base Score | Feature |
|-------|-------------------------------|------------|---------|
| Gambeson | 5 / 11 | 3 | +1 Evasion |
| Leather | 6 / 13 | 3 | — |
| Chainmail | 7 / 15 | 4 | -1 Evasion |
| Full Plate | 8 / 17 | 4 | -2 Evasion, -1 Agility |

- Armor Score (slots) = base_score + level
- Evasion modified by armor feats

### Wizard Class Stats

- HP: 5 (School of War gets +1 from Battlemage = 6)
- Evasion: 11 (before armor modification)
- **Spellcast Trait: Knowledge (BOTH subclasses — not Presence for War)**
- Suggested build: Greatstaff (primary) + Leather Armor
- Class item: "A book you're trying to translate" or "a tiny, harmless elemental pet"
- Subclass cards: Foundation → Specialization (L5) → Mastery (L8)

---

## MVP Scope (Wizard Level 1)

### Domain Card Tracking (L1 Scope)
- The SRD has no universal "used/unused" or "exhaust" mechanic for domain cards — individual cards define their own usage limits
- Domain cards have NO "used" boolean in our types, stores, or components
- No "Mark Used" / "Restore" UI on cards
- Cards are always face-up and active in the hand view
- **Note:** Vault tracking will be needed for L2+ content where individual card abilities reference the vault

### No card flip/reveal in deck builder
- Domain card selection is simple tap-to-select (not draft/flip/reveal)
- Cards shown face-up in horizontal scrollable rail at 0.52 scale
- Tap to select, tap selected to zoom — that's it

### Equipment Selection (MVP Simplified)
- The SRD has full equipment selection as Step 5, with 4 Tier 1 armor options and ~25 Tier 1 weapon options (see Armor table above)
- **For MVP:** auto-assign Wizard suggested build — Greatstaff (primary) + Leather Armor
- No inventory management in MVP
- **Known simplification to revisit:** equipment selection with armor-evasion tradeoffs is mechanically important for the full experience (armor choice affects damage thresholds AND evasion)

## Hand View Requirements

### Character name
- Displayed ABOVE the hero card as a header, NOT overlapping the card
- Gold gradient text, EB Garamond, small-caps
- Subclass subtitle underneath (e.g. "School of Knowledge Wizard")

### Card carousel must include ALL card types
- Domain cards AND ancestry/community InfoCards in the carousel
- All tappable to zoom to full-screen view

### Stat bar
- Label must say "Armor" (not "Arm" or any abbreviation)
- Damage thresholds (Major / Severe) must be visible — displayed as badges below Evasion
- HP, Armor, Hope, Stress all have pip-based counters with +/- buttons

### Evasion & damage thresholds
- Evasion shown as centered badge in stat bar
- Damage thresholds from armor shown as "Major X" and "Severe Y" badges

## Deck Builder Flow

### Steps (in order)
0. Pick Subclass (2 SRDCards, tap to select)
1. Choose Domain Cards (tap-to-select, 2 required — or 3 for School of Knowledge)
2. Pick Ancestry (InfoCards, single select)
3. Pick Community (InfoCards, single select)
4. Assign Traits (pre-filled with suggested values)
5. Name Character (text input)
6. Review Deck (all selections shown, "Begin Adventure" confirms)

### Selection patterns
- Continue button disabled until selection made
- Back button visible on steps 1+
- Domain cards: counter shows "X of N selected" where N depends on subclass (2 for War, 3 for Knowledge)

## Domain Color System
- Colors represent DOMAINS, not classes
- Each class has 2 domains (domain_1 and domain_2)
- Banner colors derive from domain colors, not hardcoded per class
- See `src/cards/domain-colors.ts` for the mapping

## Typography (locked in)
- **Title**: EB Garamond, 36px max (AutoFit), weight 500, small-caps, 0.01em spacing
- **Subtitle**: EB Garamond, 13px, weight 600, small-caps, 0.06em spacing
- **Body**: Source Sans 3, 13.5px, line-height 1.4, color #D4CFC7 at 90%
- **Gold gradient**: #f9f8f3 → #e7ba90
- Content area: fixed 297px minimum, pinned to bottom

---

## Known Code Issues (from SRD audit, 2026-02-14)

~~All resolved on 2026-02-14:~~
1. ~~Domain card count hardcoded to 3~~ — Fixed: uses `getWizardCardCount()` (2 for War, 3 for Knowledge)
2. ~~School of War spellcast trait wrong~~ — Fixed: returns "Knowledge" for both subclasses
3. ~~Damage thresholds missing level offset~~ — Fixed: StatBar adds character level to base values
4. ~~Duplicate threshold parsing~~ — Fixed: StatBar uses shared `parseThresholds()` utility
