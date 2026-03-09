# Backlog

## Refactors

### Split LevelUpWizard into steps (Medium priority)
- **File**: `src/level-up/LevelUpWizard.tsx` (906 LOC)
- **Problem**: All 4 wizard steps are inline in one file instead of split into separate step components
- **Pattern to follow**: `src/deck-builder/` — DeckBuilder.tsx orchestrates, `steps/` directory has individual step files
- **Expected outcome**: `src/level-up/steps/` directory with `StepAutoGains.tsx`, `StepAdvancements.tsx`, `StepDomainCard.tsx`, `StepReview.tsx`. Main `LevelUpWizard.tsx` drops to ~150 LOC.
- **Risk**: Low — purely structural, no behavior change
- **Estimated effort**: ~1 hour
