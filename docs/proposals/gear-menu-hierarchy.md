## User story

**As a player mid-session, I'd like Short Rest and Long Rest to be one tap away in the bottom bar, so I'm not opening a settings menu next to the Delete Character button every time the party rests.**

## Problem

The bottom-bar gear menu in [`hand/HandView.tsx`](../../src/hand/HandView.tsx) currently lists, in order:

1. Short Rest
2. Long Rest
3. Level Up
4. Edit Character
5. Delete Character (red)

These have wildly different lifecycle frequencies:

| Action | Frequency |
|---|---|
| Short Rest | Multiple per session |
| Long Rest | Once per session |
| Level Up | Every ~3 sessions |
| Edit Character | Rare |
| Delete Character | Once ever |

Putting them in the same surface buries the frequent actions next to the destructive one. Demiplane gets dinged in reviews for *not* surfacing Level Up on the play sheet (forum link below). Don't repeat that bug.

## Source

- Demiplane forum feedback (no Level Up button on sheet): https://forums.demiplane.com/t/demiplane-daggerheart-character-sheet-feedback/3568

## Suggestion

**Bottom bar:**
- `[Back]  [Short Rest] [Long Rest]  [Cards · Actions]  [⋯]`
- Short Rest and Long Rest become primary pills.

**`⋯` menu** (Settings drawer, Vaul sheet):
- Level Up (with a "ready" badge when GM/party flag the level)
- Edit Character
- Settings (PWA install, theme, audio toggle…)
- Delete Character (red, at the bottom, hold-to-delete already in place)

**Level Up promotion:** when the active character has unspent advancements (from `level` increments not yet resolved), surface a sticky banner "Ready to level up →" instead of hiding it in the menu.

## Acceptance

- [ ] Short Rest and Long Rest are bottom-bar pills.
- [ ] Settings drawer contains Level Up, Edit, Settings, Delete.
- [ ] Level Up banner appears when unspent advancements exist.
- [ ] Drawer matches the existing Vaul aesthetic.
