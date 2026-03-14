# Demiplane Daggerheart Nexus — UX Critique

**Date:** 2026-03-13
**Analyst:** @ux (Cloak & Daggerheart)
**Screenshots reviewed:** IMG_8049–8056, image0–image2 (11 screenshots total)
**Device context:** iPhone, Safari browser (app.demiplane.com)

---

## 1. What Demiplane Does Well

### Completeness of Data

Demiplane is a fully realized digital character sheet. Every mechanical element of a Daggerheart character is accounted for: traits with action verbs, HP/stress pip tracks with +/- controls, armor slots, evasion, damage thresholds (minor/major/severe with actual calculated values), hope tracker, conditions, downtime button, weapons with proficiency pips and attack/damage formulas, domain effects with full ability text, features broken out by source (ancestry, community, class, subclass), equipment with checkboxes, experiences, background questions, connections, and a journal. This is comprehensive in a way that demonstrates deep rules knowledge.

### Damage Threshold Display (IMG_8051)

The "Calculate Damage" section with Minor (mark 1 HP), Major 7 (mark 2 HP), Severe 13 (mark 3 HP) is genuinely excellent. This is the single most referenced rule during combat. Having it right next to the HP track, with pre-calculated values, means a player never has to do mental math mid-combat. The horizontal layout with clear labels is immediately scannable.

### Weapons Panel (IMG_8052)

The active weapons display shows: weapon name, melee/ranged tag, attack modifier (+3 Instinct), damage formula (2d10+3 Physical), and proficiency pips — all in one compact row. This is everything you need during your attack action. Primary and secondary weapons are clearly separated. This is well-structured data presentation.

### Domain Effects with Actionable UI (IMG_8053)

The domain effects panel (Conjure Swarm, Fire Flies) includes inline cost/action badges — "1 Stress / Conjure Beetles" and "1 Hope / Keep Beetles." These act as quick-reference tags for the mechanical costs. The "Spellcast Roll" and "Damage Roll" badges with their values (+0, 2d8+3) are also useful for mid-play reference.

### Feature Cards with Toggle States (IMG_8054–8055)

Features like "Celestial Trance" have a toggle switch (Trance on/off), and "Per Short Rest" features have a checkbox. This tracks consumable ability usage during a session — something a paper sheet handles with pencil marks. Digital advantage, properly used.

### Character Builder Navigation (image1)

The builder sidebar (Getting Started, Class, Heritage, Experiences, Level Up) with checkmark completion indicators and a vertical progress line is clean and gives good orientation. You always know where you are in the build process.

### Official Art

The character portrait and class art (the Witch illustration behind the header) is official Daggerheart artwork, high quality, and properly integrated into the header. The domain icons in the top-right corner are the official SVGs. These are assets Demiplane has licensed access to, and they use them well.

---

## 2. What Demiplane Does Poorly

### It Is a Web App Pretending to Be Native (and Failing)

Every screenshot shows the Safari browser chrome — address bar at top, navigation bar at bottom. That is 120+ pixels of non-app UI on every screen. The Daggerheart Nexus top bar (hamburger menu, logo, search, cart, profile avatar) adds another 50px. So roughly 170px of every screen — on a ~850px viewport — is navigation chrome, not character data. That is 20% of the screen wasted before a single game stat appears.

### The Endless Scroll Problem

The character sheet is a single continuous vertical scroll. From the screenshots, the full sheet includes: header with portrait/name/level, conditions, hope tracker, traits (6 cards), a section nav overlay (Traits & Experiences, HP/Stress/Armor, Weapons, Domain Effects, Features, Equipment, Details, Journal), evasion/armor, armor slots, damage thresholds, HP pips, stress pips, active weapons, domain effects (multiple cards), features (multiple cards), equipment list, and more. A rough estimate from the screenshots: this is 6000–8000px of vertical content.

On a phone held one-handed at the table, finding "what is my Severe threshold?" means either: (a) scrolling through an unknown amount of content hoping to spot it, or (b) tapping "Hide Details" to get the section nav, finding "HP, Stress, & Armor," then scrolling within that section. Both paths are slow.

### The Section Nav Overlay Is Band-Aid Architecture (IMG_8050)

The full-screen navy overlay with section names (Traits & Experiences, HP Stress & Armor, Weapons, Domain Effects, Features, Equipment, Details, Journal) exists because the single-scroll sheet is too long to navigate. But it is an overlay that covers the entire screen, breaking your context. You have to: (1) remember what you need, (2) tap "Hide Details" to open the nav, (3) find the right section name, (4) tap it, (5) mentally reorient to the new scroll position. That is 5 steps and a context switch to jump between sections.

### Visual Noise and Inconsistent Hierarchy

The design mixes at least four distinct visual treatments on a single screen:
- Gold-bordered shield badges (traits, level)
- Dark cards with gold borders (trait cards, weapons)
- White cards with thin borders (equipment list, feature text areas)
- Purple/navy bars (hope tracker, HP/stress headers, section nav)
- Orange background texture bleeding through everywhere

There is no clear system for "this style means this type of thing." The gold-bordered shields are used for both the level badge AND the trait values AND the armor/evasion badges — three different semantic meanings with the same visual treatment.

### Small Touch Targets on the Pip Tracks

The hope, HP, and stress pip tracks use small diamond/square shapes (approximately 20x20px before the +/- buttons). The +/- buttons themselves look like ~30px circles. On a phone being held one-handed while also managing physical dice, miniatures, and a character sheet, these are below the iOS 44pt minimum touch target.

### The Cart Icon in a Character Sheet

There is a shopping cart icon in the top navigation bar. During gameplay. This is a marketplace UX pattern leaking into a play-time tool. It is a constant visual reminder that Demiplane is a storefront first and a character tool second.

### "SET ACTIVE IN THE EQUIPMENT SECTION" (IMG_8052)

The secondary weapon slot says "SET ACTIVE IN THE EQUIPMENT SECTION" — sending the user to a different section to configure something that is displayed here. This is a classic "the data model leaked into the UI" problem. If I am looking at my weapons, I should be able to set my active weapon from the weapons section.

### ALL CAPS EVERYTHING

Nearly every label, header, section title, and button is set in all-caps or small-caps bold. When everything screams, nothing communicates hierarchy. The trait names (AGILITY, STRENGTH), section headers (ACTIVE WEAPONS, HIT POINTS & STRESS), feature types (ANCESTRY, CLASS FEATURE, UNIQUE HOPE FEATURE), button labels (HIDE DETAILS, CALCULATE DAMAGE) — all competing at the same visual volume.

### Equipment List Is a Sea of Checkboxes (IMG_8056)

The equipment section is a flat list of items with checkboxes, all in the same visual style regardless of type. "Quarterstaff — Primary Weapon (Physical) — Two-Handed" sits in the same visual row as "50ft of Rope" and "Basic Supplies." There is no grouping, no visual differentiation between weapons, armor, consumables, and flavor items. The checkboxes appear to serve no clear purpose (equipped status? Used?).

---

## 3. What Cloak & Daggerheart Does Better

### Information Architecture: Panels vs. Infinite Scroll

Our MobileLayout renders a structured vertical flow: CharacterHeader, StatBar, Trait Bar, Domain Abilities, Subclass Features, Hope Feature, Class Features, Ancestry Features, Community Features, Experiences, Equipment, Gold, Notes, Background, Connections. But critically, each is a discrete, visually bounded panel (FeaturePanel, DomainAbilityPanel, InlineSection) rather than sections of a continuous document.

On desktop (DesktopLayout), we go further with a three-column grid: vitals left, abilities center, equipment/notes right. This means the most-needed information (stats, HP, armor) is always visible in the left column while you scroll abilities in the center. Demiplane has no desktop-specific layout — it is the same phone scroll on every screen size.

### Consistent Visual Language

Every feature — regardless of source (ancestry, class, community, hope, subclass) — uses the same FeaturePanel component: warm glass background, gold gradient title, source subtitle, gold separator, body text. The DomainAbilityPanel follows the same pattern with added level and recall metadata. This consistency means you learn one visual pattern and it works everywhere. Demiplane mixes white cards, dark cards, gold-bordered badges, and purple bars seemingly at random.

### The StatBar Is a Single, Cohesive Component

Our StatBar puts Armor (with inline Evasion and threshold badges), HP, Stress, and Hope into one glass panel with consistent +/- controls, animated pip tracks, and count labels. The entire combat-relevant stat block fits in roughly 200px of vertical space. Demiplane spreads the same information across: the Evasion/Armor shield badges, the Armor Slots section, the Calculate Damage section, the HP section, and the Stress section — spanning at least 600px of scroll with visual breaks between each.

### Touch Targets and Mobile-First Design

Our StatButton component includes an invisible touch target expander (`margin: -8px` on an inner span) to meet the iOS 44pt minimum, even though the visible button is 28px. Our FeaturePanels are full-width tap targets. The app is designed phone-first; desktop is a responsive enhancement. Demiplane is a responsive website that happens to work on phones.

### No Browser Chrome Tax

As a PWA, our app runs full-screen on iOS with no address bar, no Safari tab strip, no back/forward buttons. That 170px Demiplane loses to browser chrome? We use it for game content.

### Aesthetic Cohesion

The warm glass design system (semi-transparent panels, backdrop blur, gold gradients, consistent border radii) creates a unified visual identity that feels like a game artifact, not a database viewer. Demiplane's design feels like a D&D Beyond skin applied to a generic web framework — functional but not evocative.

### Background Art Integration

Our FeaturePanel and DomainAbilityPanel render source-appropriate artwork behind the text at 10% opacity. This adds visual richness and helps differentiate panels by source (subclass art for subclass features, class art for class features) without competing with readability. Demiplane's background art is limited to the header portrait area.

---

## 4. What Cloak & Daggerheart Does Worse (The Honest Part)

### We Have No Damage Threshold Display

This is the biggest functional gap. Demiplane's "Calculate Damage" section with pre-computed Minor/Major/Severe thresholds right next to the HP track is genuinely better than what we have. Our StatBar shows `GameBadge` components for Evasion, Major, and Severe inline with Armor — but these are small badges that could easily be missed, and they do not include the "mark X HP" instruction that makes Demiplane's version immediately actionable. During combat, the GM says "you take 9 damage" and the player needs to instantly know: is that minor, major, or severe? Demiplane answers that faster than we do.

### We Have No Weapon Display

Our MobileLayout has no weapon section. Equipment is an InlineSection with an EquipmentPanel, but there is no structured weapon display showing attack modifier, damage dice, trait used, range, or proficiency. Demiplane shows "Quarterstaff / Melee / +3 Instinct / 2d10+3 Physical" in a compact, scannable format. We show... a list. A player rolling an attack needs: (1) which trait to roll, (2) what modifier, (3) damage dice. We do not surface this at the point of need.

### We Have No Ability Usage Tracking

Demiplane's toggle switches on features (Celestial Trance on/off) and "Per Short Rest" checkboxes track consumable ability usage. We render all features as static text panels. If a player uses their once-per-rest ability, they have no way to mark it as used in our app. They have to remember, or write a note. This is a meaningful functional gap for at-table play.

### We Have No Conditions Tracker

Demiplane has a "Conditions" section (showing "No Active Conditions" in the screenshots). Conditions are a core Daggerheart mechanic — Frightened, Restrained, etc. affect what actions you can take. We have no way to track active conditions.

### We Have No Hope Tracker with Max

Demiplane shows "Hope 0/6" — current vs. maximum. Our StatBar shows Hope as an unbounded counter (no max, showMax=false). The game has a maximum hope value that varies by class. This is a data accuracy issue.

### We Have No Downtime or Session Management

Demiplane has a "Downtime" button and a "Journal" section. These are session-management features — tracking what happens between adventures and letting players record session notes in context. Our Notes panel is free-form text with no structure.

### The Feature Panels Are All the Same

This one stings but it is true: while our consistent FeaturePanel design is a strength for learnability, it is a weakness for scannability. When you have 8–12 FeaturePanels stacked vertically on mobile, they all look identical at a glance. The only differentiator is the background art at 10% opacity (barely visible) and the source subtitle text. Demiplane's inconsistent styling — while ugly — actually makes different feature types more visually distinct. A player scanning for their Hope feature can spot the different visual treatment faster than scanning our uniform gold-titled panels.

### Our Trait Bar Is Cramped on Mobile

Six trait columns at equal width on a ~375px phone screen means each column is roughly 55px wide. The trait name, modifier value, and three action verbs all need to fit. Looking at our implementation, the font is 11px for labels and 10px for actions — that is genuinely small. Demiplane gives each trait card more breathing room (3 columns per row, 2 rows) and the values are much larger (+1, -1, +0 in probably 24px+ type). Their approach is more readable at a glance during play.

### We Have No Character Portrait

Demiplane shows the character's portrait image prominently in the header. Our CharacterHeader is text-only: name in gold gradient, subclass + class subtitle. This is a missed opportunity for personality and visual identity. Players are attached to their character's appearance.

### Information Density vs. Usability on Mobile

Here is the uncomfortable truth: our MobileLayout is almost as long a scroll as Demiplane's, but without the section-jump navigation overlay. We render CharacterHeader, StatBar, Trait Bar, then every domain ability, every subclass feature, every class feature, every ancestry feature, every community feature, experiences, equipment, gold, notes, background, and connections — all in a single scrollable column. For a level 2 character with 2 domain cards and a typical class, that is easily 15+ panels. We do not have a way to jump to a section. We do not have collapsible groups. We have the same endless-scroll problem we are criticizing Demiplane for, just with prettier panels.

---

## 5. Lessons to Steal

### 1. Damage Threshold Calculator — Steal the Pattern, Improve the Placement

Add a "Damage Reference" row to our StatBar, directly below the Armor row. Show: `Minor = 1 HP | Major [7] = 2 HP | Severe [13] = 3 HP` using our GameBadge components. The values are already calculable from `character.equipment.armor.base_thresholds + character.level`. Place it where Demiplane does — right next to HP — because that is where the player's eyes go during combat.

### 2. Structured Weapon Display — Steal the Data Layout

Create a weapon section (or enhance EquipmentPanel) that shows active weapons in a structured format: Name, Range (Melee/Ranged/Reach), Attack Modifier (+Trait), Damage Dice, Damage Type. This is not about copying Demiplane's visual design — their gold shields and white cards are ugly. It is about surfacing the right data at the point of action. A player should not have to calculate their attack modifier by looking at their trait bar and their weapon separately.

### 3. Ability Usage Tracking — Steal the Toggle/Checkbox Pattern

Add a "used" toggle to features that have limited uses (per-rest, per-session, per-scene). This could be as simple as a small toggle or filled/empty circle on the FeaturePanel header row. The state resets on rest or session change. This is a meaningful at-table utility that static text panels cannot provide.

### 4. Section Navigation for Mobile

Our mobile scroll is too long. Options to steal/adapt:
- **Floating section pills** (like our existing tab bar pattern) that anchor-scroll to sections
- **Collapsible groups** — "Domain Abilities (3)" as a header that collapses/expands its children
- **Priority ordering** — put the 3 things you need most in combat (stats, weapons, domain abilities) at the top, and push reference material (background, connections, notes) to the bottom or behind a "Details" section

### 5. Conditions Tracker

Add a conditions section to StatBar or as a dedicated panel. Daggerheart conditions are a finite set (Frightened, Restrained, etc.) — this could be a simple chip/tag system where you tap to toggle active conditions. Small implementation, high utility during play.

### 6. Feature Panel Visual Differentiation

Without breaking our consistent component architecture, add subtle visual cues to distinguish feature sources:
- Domain abilities already have domain color potential — use it (a thin left border in the domain color)
- Hope features could have a subtle star accent
- Ancestry/community features could use slightly different background tint

The goal is not Demiplane's visual chaos. It is giving the scanning eye one more signal to differentiate 12 panels that currently all look the same.

### 7. Character Portrait in Header

Even a small circular portrait (like Demiplane's ~40px circle in the header) adds personality. This could be a user-uploaded image or a placeholder based on class/ancestry. Our CharacterHeader is functional but personality-free.

---

## Summary

Demiplane built a complete digital character sheet that covers every mechanical element of Daggerheart. Respect that — it is hard work and the data model is thorough. But they delivered it as a responsive web page, not a play-time tool. The endless scroll, inconsistent visual hierarchy, browser chrome tax, small touch targets, and marketplace chrome all work against the at-the-table use case.

Cloak & Daggerheart has a stronger design foundation: consistent visual language, mobile-first touch targets, PWA full-screen experience, structured panel architecture, and a warm-glass aesthetic that feels like a game artifact rather than a web app. The desktop three-column layout is genuinely superior for information architecture.

But — and this is the honest part — we are missing real functional features that Demiplane ships: damage threshold calculator, structured weapon display, ability usage tracking, conditions, section navigation on mobile, and character portraits. These are not cosmetic gaps. They are things a player actually needs at the table.

The path forward is clear: keep our design system and interaction quality, but steal the data patterns and functional features where Demiplane got the "what to show" right even when they got the "how to show it" wrong.
