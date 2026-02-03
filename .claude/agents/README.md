# Multi-Agent System

Talk to **@orchestrator only**. It delegates work to specialized subagents automatically.

## Quick Start

**Claude automatically takes the @orchestrator role** when you open this project (configured in CLAUDE.md).

Just start talking:

- "Add a dark mode toggle"
- "Fix the bug where HP doesn't save"
- "What's the current status?"
- "Spec out a dice history feature"

The orchestrator will:
1. Break down your request
2. Spawn the right subagents (@frontend, @ux, @creative)
3. Collect their work
4. Report back to you

## How It Works

```
You → @orchestrator → spawns → @frontend (writes code)
                    → spawns → @ux (specs features)
                    → spawns → @creative (designs visuals)

     ← summarizes results ←
```

The Task tool spawns subagents that run, complete their work, and return results. The orchestrator synthesizes everything and keeps you informed.

## Subagents

| Agent | Role | Spawned For |
|-------|------|-------------|
| **@frontend** | Developer | Code, bugs, tests, implementation |
| **@ux** | UX Designer | Feature specs, user flows, interactions |
| **@creative** | Creative Director | Visual design, animations, tokens |

## Context Files

Work is tracked in `.claude/agents/context/`:

| File | Purpose |
|------|---------|
| `current-sprint.md` | Active tasks and status |
| `handoffs.md` | Agent outputs and notes |
| `decisions.md` | Architecture/design decisions |
| `backlog.md` | Future work |

## Example Session

```
You: "Add a button to export character as JSON"

Orchestrator: "I'll get that done. Spawning @ux to spec the export flow..."

[spawns @ux agent]

Orchestrator: "@ux specced it: button in Notes tab, downloads character.json.
              Now spawning @frontend to implement..."

[spawns @frontend agent]

Orchestrator: "Done! Added export button to Notes tab.
              Files changed:
              - src/views/CharacterSheet/NotesTab.tsx
              - src/types/character.ts (added export function)

              Tests pass. Want me to do anything else?"
```

## Tips

- **Be specific** - "Add dark mode" is better than "make it look better"
- **Ask for status** - "What's in progress?" to see current work
- **Request specs first** - "Spec out X before implementing" for complex features
- **Run in parallel** - The orchestrator will parallelize independent work automatically

## Direct Agent Access (Advanced)

If you ever need to bypass the orchestrator and work with an agent directly:

```
Read .claude/agents/frontend.md and take that role
```

But normally, just stick with the orchestrator.
