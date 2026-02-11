# Handoff Notes

## Last Session: 2026-02-10

### What we did
- Built interactive Figma delta comparison tool at `?cards`
- Compared SRD card (Figma node `25:1848`) against live code — 13 deltas identified
- Reviewed 8 of 11 toggleable deltas, locked them in
- Added auto-fit title that scales down for long card names
- Deleted old CardDesignLab, consolidated routes (`?srdcard` → `?cards`)

### Pick up here
3 deltas still need review on the `?cards` page:
- **#4** Title Letter Spacing — code: 0.02em, figma: 0em
- **#6** Title Text Shadow — code: heavy (double drop-shadow), figma: subtle (single)
- **#7** Class Name Letter Spacing — code: 0.08em, figma: 0em

2 deltas need assets before they can be implemented:
- **#2** Illustration Masking — needs a mask shape asset from Figma
- **#3** Background Atmosphere Layer — needs a flipped bg image asset

### After deltas
- Bring back the other card variants (Syndicate, School of War, Call of the Slayer, Divine Wielder) — currently only showing School of Knowledge
- Consider restoring the tweaker panel as a secondary mode
