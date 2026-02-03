# Architecture Decisions

This log tracks significant decisions made during development.

---

## 2026-02-02: Investiture Architecture Pattern

**Decision:** Adopt three-layer architecture: core/, content/, design-system/

**Context:**
- characterStore.ts has grown to 460 lines mixing business logic and state
- UI strings are hardcoded, blocking i18n
- Design tokens are scattered across CSS and config files

**Choice:**
```
src/
├── core/           # Pure business logic (no React, no side effects)
├── content/        # All user-facing content (i18n, SRD, constants)
├── design-system/  # Tokens and base components
├── components/     # Feature-specific components only
├── views/          # Page compositions
├── stores/         # Thin state layer
└── types/          # TypeScript definitions
```

**Rationale:**
- **Testability:** core/ has pure functions, easy to unit test
- **Separation:** Business logic doesn't depend on UI framework
- **i18n-ready:** content/ layer makes localization straightforward
- **Design consistency:** design-system/ provides single source of truth

**Trade-offs:**
- More files and directories
- Import paths are longer
- Need to update existing imports

**Affected Files:**
- characterStore.ts → moves logic to core/character/
- srd.ts → split into data loading (stays) and business logic (moves)
- TraitsStep.tsx → moves trait rules to core/rules/
- diceLogic.ts → moves to core/dice/

---

## 2026-02-02: Multi-Agent Development System

**Decision:** Enable parallel work via agent role files in .claude/agents/

**Context:**
- Single developer workflow limits parallelism
- Complex refactors benefit from specialized focus areas

**Choice:**
- Four agents: @orchestrator (PM), @frontend (dev), @ux (design), @creative (visual)
- Coordination via markdown files in .claude/agents/context/
- Handoffs are explicit to avoid conflicts

**Rationale:**
- Can run multiple Claude Code terminals simultaneously
- Clear ownership prevents merge conflicts
- Context files preserve state across sessions

**Trade-offs:**
- Overhead of maintaining context files
- Risk of stale information if not updated
