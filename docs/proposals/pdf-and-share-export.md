## User story

**As a player joining a one-shot or moving between devices, I'd like to export my character to PDF or a read-only link, so I can email it to my GM or print it for a session without WiFi.**

## Problem

Demiplane supports both PDF export and shareable QR/link with privacy controls. This project supports neither. The data lives in LocalStorage on a single device; there's no out-of-band representation.

## Source

- Demiplane FAQ confirming PDF export and QR/link sharing: https://support.demiplane.com/hc/en-us/articles/25810842657687-Daggerheart-NEXUS-Frequently-Asked-Questions

## Suggestion

Two cheap, static-site-friendly approaches:

**PDF (print-styled HTML):**
- Add a `/print/<characterId>` route.
- Style the existing hand view with print media queries: solid background, no glass, full-bleed sheet.
- "Export to PDF" button calls `window.print()`.
- This is one afternoon of CSS.

**Shareable link (read-only, no server):**
- Serialize the character to a compact JSON, gzip + base64url it into a URL fragment: `https://.../share#<base64url-gz-json>`.
- A `/share` route reads the fragment, hydrates a read-only `HandView`.
- No server, no costs, no accounts.
- Caveat: long URLs. ~2–4 KB for a typical character. Fragments are not sent to GitHub Pages servers.

QR generation: tiny JS lib (qrcode.js, ~2 KB gz) renders the share URL.

## Acceptance

- [ ] Print-styled `/print` route.
- [ ] "Export PDF" button on the hand view.
- [ ] `/share` route hydrates a read-only sheet from a URL fragment.
- [ ] "Share" button generates the fragment URL and a QR code.
- [ ] Read-only `HandView` mode hides edit affordances (or a `readOnly` prop on `HandView`).
