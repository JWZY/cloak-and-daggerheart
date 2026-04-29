## User story

**As a player joining a one-shot or moving between devices, I'd like to export my character to PDF or a read-only link, so I can email it to my GM or print it for a session without WiFi.**

## Decision A: split into two PRs

Original draft bundled PDF + share link. Different complexity classes; bundling couples low-risk to high-risk.

### Options considered

| Option | Approach |
|---|---|
| **A1. One PR for both** | Easier to track; ships together. |
| **A2. Two PRs** | PDF is CSS work, low risk. Share link involves serialization, URL durability, privacy, encoding. Different risks, different reviewers. |

**Recommendation: A2.** This proposal becomes two:

- **16a. PDF export** — print-styled `/print/<characterId>` route + window.print(). Ships first.
- **16b. Shareable link** — URL-fragment encoding with versioning + privacy scope. Ships after PDF.

Files:
- `docs/proposals/pdf-export.md` (this content focuses on PDF).
- `docs/proposals/share-link.md` (split into a follow-up proposal PR).

For brevity below, this single file documents both scopes as the master spec. Implementation PRs are separate.

## PDF Export (16a)

### Decision A: time estimate

Original draft said "one afternoon of CSS." Reviewer pushed back: glass overrides, dark-mode → light-print, page breaks, font embedding, expanded panels, carousel handling. **Recalibrate to 2-3 days.**

### Decision B: surface

`/print/<characterId>` route. Renders `HandView` in print mode. `window.print()` button on the regular hand view.

State explicitly: `/print/<characterId>` is local-only (LocalStorage-bound). Not a shareable URL. Document that or users will assume.

### Decision C: print-mode styling

Concrete CSS work:

| Concern | Treatment |
|---|---|
| Glass / blur effects | Solid white backgrounds. `@media print` overrides. |
| Dark mode | Force light palette. Black text on white. |
| Carousel | Render all cards in a static grid. |
| Collapsible panels | Force-expand all. |
| Page breaks | `page-break-inside: avoid` on every card and panel. |
| Custom fonts | EB Garamond — embed via `@font-face` from `/public/fonts/` or fall back to system. Verify offline. |
| Hero portrait | Render at print resolution. Watch out for data-URL JPEG quality. |

### Decision D: read-only props

`HandView` has dozens of edit affordances. Need to disable all in print mode.

#### Options considered

| Option | Approach |
|---|---|
| **D1. `readOnly` prop on HandView**, drilled down | 20+ touchpoints. Tedious. |
| **D2. `ReadOnlyContext`** | One provider wraps the view; components consume. | Less drilling. **Right.** |

**Recommendation: D2.**

### PDF acceptance

- [ ] `/print/<characterId>` route renders the active character's HandView in print mode.
- [ ] "Export PDF" button on regular hand view opens `/print` and calls `window.print()`.
- [ ] Print preview matches design system in light mode.
- [ ] All info panels expanded.
- [ ] No card splits across pages (page-break-inside: avoid verified at sample levels).
- [ ] EB Garamond renders in print preview both online and offline.
- [ ] `ReadOnlyContext` introduced; HandView consumes; no edit affordances in print mode.
- [ ] Tested on Chrome + Safari + Firefox print previews.

### PDF out of scope

- Multi-character batch export.
- Print-friendly QR linking back to share link (if/when 16b lands).

## Share Link (16b — separate PR)

### Decision E: URL fragment encoding

Original draft handwaved gzip+base64url.

#### Options considered

| Encoding | Size for 1.5KB JSON | Tradeoffs |
|---|---|---|
| **E1. JSON + gzip + base64url** | ~1.5KB | Standard. Brotli is better. |
| **E2. JSON + brotli + base64url** | ~1.2KB | Better. Brotli native in modern browsers via `CompressionStream('deflate-raw')`? Verify support. |
| **E3. msgpack + brotli + base64url** | ~0.9KB | Smallest. Adds msgpack lib. |
| **E4. Field-pack scheme (no JSON keys, fixed positions)** | ~0.6KB | Smallest. Schema-version-coupled. Custom ser/de. |

**Recommendation: E2.** Brotli is supported in modern browsers via `CompressionStream`. Fall back to E1 if older browsers matter.

Confirm bundle size of any added libs before merge.

### Decision F: schema versioning

Schema will change (PR #11 adds `ancestrySelection`, PR #10 splits into loadout/vault, etc.).

```
v3:<base64url-brotli-json>
```

Decoder switches on prefix. Migration logic per version.

### Decision G: URL length budget

GitHub Pages: no real limit. Twitter / iMessage / share sheets: practical truncation at ~2KB.

State explicitly: target encoded URL ≤ 2KB. If a character exceeds (bloated by Notes / many cards), surface a "Character too large to share via URL — try removing Notes" warning.

### Decision H: privacy scope picker

Default-share-everything is wrong. Notes can contain GM secrets.

#### Options considered

| Option | UX |
|---|---|
| **H1. All-or-nothing** | One "Share" button. **Reject.** |
| **H2. Mini-step picker** | "Share with: [☑ stats] [☑ cards] [☐ notes] [☑ inventory]" | Right. |
| **H3. Pre-redaction profile** | Saved scopes ("Public", "GM-only"). | Heavy for v1. |

**Recommendation: H2.** Defaults: stats / cards / inventory ON; notes OFF.

Add a one-line privacy note: "Anyone with this link can view your character. Links can't be revoked."

### Decision I: read-only HandView

Same `ReadOnlyContext` as PDF. Coordinated.

### Decision J: QR library

"qrcode.js, ~2 KB gz" — there are several. `qrcode-generator` is the actual tiny one. Pin it.

### Decision K: cross-device hydration

`/share` route reads URL fragment. Hydrates a `HandView` from the encoded payload. Does NOT write to LocalStorage (read-only).

If user wants to import the shared character, surface "Import to my characters" button → writes a copy with a fresh ID.

### Share-link acceptance

- [ ] `/share` route hydrates from `#v3:<payload>` fragment.
- [ ] Encoded payload includes schema version byte.
- [ ] Encoder respects privacy scope (notes / experiences / inventory toggleable).
- [ ] Encoded URL ≤ 2KB for typical characters; warning if exceeded.
- [ ] `/share` view uses ReadOnlyContext; no edit affordances.
- [ ] "Import to my characters" button on shared view writes a new character with a new ID.
- [ ] QR code generated via `qrcode-generator`; bundle size verified ≤ 4KB gz.
- [ ] Privacy disclaimer rendered in share dialog.
- [ ] Cross-browser test: hydrate URL on different device with empty LocalStorage; matches source.

## Out of scope

- Server-side share links (revocable).
- Account-based shares.
- Print-friendly version of share view.
- VTT export (Roll20 / Foundry).
