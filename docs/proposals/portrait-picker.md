## User story

**As a player who wants my Hero Card to feel like my character, I'd like to pick a preset portrait or upload my own, so the sheet visually represents who I'm playing.**

## Problem

`useCharacterStore.setPortrait(id, dataUrl)` exists in [`store/character-store.ts`](../../src/store/character-store.ts) and `Character.portrait?: string` is in the type. There is no UI to call it. The hero card uses class/subclass art only.

## Source

- Demiplane forum confirming portrait presets + uploads: https://forums.demiplane.com/t/character-builder-not-showing-uploaded-character-portraits/4840

## Suggestion

Two surfaces:

1. **In the wizard**, between Equipment and Traits (or in NameCharacter): a "Portrait" sub-step.
2. **On the hand view**, tapping the hero portrait opens an edit sheet.

Sheet contents:
- Preset gallery (8–12 illustrations bundled in `/public/portraits/`).
- "Upload" button → file picker → resize to 512×512 (canvas) → store as data URL.
- "Remove" → fall back to class/subclass art.

LocalStorage budget: cap data URLs at ~200 KB (resize hard, JPEG q=0.85). Document in a comment.

## Acceptance

- [ ] Portrait picker accessible from creation and from hand view.
- [ ] Preset selection writes the preset URL to `portrait`.
- [ ] Upload resizes and writes a JPEG data URL.
- [ ] Remove clears the field.
- [ ] Hero card prefers `character.portrait` when present.
