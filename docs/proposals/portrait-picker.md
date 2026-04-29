## User story

**As a player who wants my Hero Card to feel like my character, I'd like a finished portrait flow that handles presets, quota errors, and the wizard step gracefully, so the half-built modal that's already in the tree gets to ship.**

## Reality check

[`src/hand/PortraitModal.tsx`](../../src/hand/PortraitModal.tsx) already exists. It's wired into [`src/hand/CharacterHeader.tsx`](../../src/hand/CharacterHeader.tsx). It does:

- Modal shell (mobile bottom sheet via Vaul-shaped pattern, desktop centered modal)
- Upload via `<input type="file">`
- Resize to **256×256**, JPEG **q=0.8** (the original review used 512/0.85 numbers; the existing constants are 256/0.8)
- Setting / removing portrait via `useCharacterStore.setPortrait(id, dataUrl)`
- Hand-view trigger via the character header

**The original draft of this proposal described the work from scratch and disagreed with the constants in the existing file.** This rewrite reconciles against what's there and scopes the actual delta.

## What's actually undone

| Area | Status |
|---|---|
| Modal shell, upload, resize, remove, hand-view trigger | **Done** |
| Preset gallery | Not built |
| Wizard step integration | Not built |
| Quota / error handling on `localStorage` | Silently fails today |
| Async cancel safety (close-during-resize) | Race exists |
| Image cropping / aspect ratio handling | Not built (`objectFit: cover` truncation) |
| Remove-vs-unset semantics | `setPortrait(id, '')` + `portrait?: string` is inconsistent |
| Accessibility (focus trap, keyboard nav, restore focus) | Mostly missing |

That's the real PR surface.

## Decision A: preset gallery — source policy

This is a public repo. Bundling images means a license review.

### Options considered

| Option | Approach | Notes |
|---|---|---|
| **A1. CC0 fantasy portrait pack** | Find an existing CC0 set (e.g., Heroforge silhouette CC0, OpenGameArt sets). Bundle in `/public/portraits/`. | Cheap. Style consistency low (mixed sources). License has to be verified per asset. |
| **A2. Generated/AI-rendered set, owned by author** | Generate 8–12 illustrations consistent with the Daggerheart-y aesthetic. License: project owner. | Style-consistent. Requires generation effort + license clarity (most AI tools have ambiguous output ownership; check terms). |
| **A3. Silhouettes** | Class/ancestry silhouettes only, no faces. Low-info but no licensing exposure. | Cheap. Less expressive than faces but matches the card aesthetic. |
| **A4. Skip presets in this PR** | Upload-only for v1. Filed as a follow-up. | Simplest. Reduces scope. |

**Recommendation: A4 in this PR, file A2/A3 as follow-up.** Until source is confirmed, presets are a risk. Upload-only is shippable today.

If A4 is rejected and we want presets in v1, **default to A3** (silhouettes); ask for a separate decision on faces.

## Decision B: quota / error handling

`localStorage.setItem` throws `QuotaExceededError` when full. Zustand's `persist` middleware silently swallows the throw. Result: portrait *appears* to save, vanishes on refresh.

### Options considered

| Option | Approach |
|---|---|
| **B1. Catch in `setPortrait`** | Wrap the store mutation in a try/catch via custom storage. On quota exceeded, surface an error to the modal. | Solves the symptom. Doesn't address that *other* writes also silently fail. |
| **B2. Custom `persist` storage with size budget** | Wrap `localStorage` with a quota-aware adapter. Reject writes > N MB. Surface a typed error event. | Solves the class of bug. ~40 lines. Useful for everything we'll add later. |
| **B3. IndexedDB for binary** | Store portrait dataURLs in IDB instead of `localStorage`. `localStorage` keeps small JSON state. | Right answer eventually. Three days of work to migrate the persist layer. |

**Recommendation: B2 for this PR.** B3 is the right long-term answer but blocks on a persist-layer migration that's out of scope. B2 is a pragmatic intermediate that surfaces the problem instead of hiding it.

```ts
// store/quota-storage.ts
const MAX_BYTES = 4 * 1024 * 1024  // 4MB; tune
export const safeStorage: PersistStorage<unknown> = {
  getItem, setItem(name, value) {
    const size = new Blob([JSON.stringify(value)]).size
    if (size > MAX_BYTES) throw new QuotaExceededError('character store too large')
    try { localStorage.setItem(name, JSON.stringify(value)) }
    catch (e) { /* re-throw, modal listens */ }
  },
  removeItem,
}
```

PortraitModal subscribes to a quota-error event and shows: "Couldn't save portrait — your device storage is full. Try a smaller image or remove an old character."

## Decision C: cropping

Photos are rarely square. `objectFit: cover` clips heads.

### Options considered

| Option | Approach |
|---|---|
| **C1. Document the limitation** | Spec says: "Center crop. For best results, upload a square image." | Cheapest. v1-acceptable for a hobby app. |
| **C2. Square mask + reposition** | Show a square preview the user can drag/scale within. Commit on save. | Real work. Touch ergonomics on mobile. ~1.5 days. |
| **C3. Smart-crop** | Use the canvas to find the centermost area or a face-detection library. | Library dependency. Edge cases. |

**Recommendation: C1 for this PR.** File a follow-up for C2 when there's user feedback that the crop matters. `objectFit: cover` on a square-ratio image is acceptable for v1.

## Decision D: async race

Existing `PortraitModal`:

```ts
const dataUrl = await resizeImage(file)
setPreview(dataUrl)
setPortrait(character.id, dataUrl)
```

If the user closes the modal mid-resize, `setPortrait` fires after unmount.

**Recommendation:** mounted-ref guard. Cheaper than `AbortController` (which would require restructuring the FileReader / Image promise chain).

```ts
const mounted = useRef(true)
useEffect(() => () => { mounted.current = false }, [])
// ...
const dataUrl = await resizeImage(file)
if (!mounted.current) return
setPreview(dataUrl)
setPortrait(character.id, dataUrl)
```

## Decision E: remove-vs-unset semantics

Today: `setPortrait(id, '')` writes empty string. `Character.portrait?: string`. `''` is the de facto "removed" sentinel, but consumers checking `character.portrait` get `''` (truthy-ish in some checks) instead of `undefined`.

### Options considered

| Option | Approach |
|---|---|
| **E1. `setPortrait(id, null)` removes; `null` cleared on persist** | Type changes to `string | null | undefined`. Migration: existing `''` → `undefined`. | Cleanest. Migration cost. |
| **E2. `removePortrait(id)` action; `setPortrait` only sets non-empty** | Two actions, no nullable type changes. `removePortrait` calls `{...c, portrait: undefined}`. | Cheapest. Slightly more API. |

**Recommendation: E2.** No type change, no migration, intent is explicit at every call site.

## Decision F: wizard step integration

Spec originally said "between Equipment and Traits." That's a one-line UX direction that elides:

- A new step in `deck-builder/steps/`
- `deck-store` field for in-progress portrait
- Step ordering / step indicator update
- Validation: is a portrait required to advance? (Almost certainly no, but state it.)
- Wizard portrait → created character flow (carry-through)

**Recommendation: split.** This PR ships hand-view modal hardening (preset/quota/race/a11y). A follow-up PR adds the wizard step.

## Decision G: accessibility

Today's modal has no focus trap, no keyboard preset navigation, partial focus restoration after the file picker.

**Recommendation in this PR (minimum bar):**

1. Focus trap inside the modal (small util or `focus-trap-react`).
2. `Escape` closes (already partially handled in `DeleteConfirmModal` pattern; copy it).
3. Focus restored to the trigger element on close.
4. `aria-label` on the file-input `<label>`: "Upload a character portrait."
5. (Deferred to wizard PR with presets) Grid arrow-key navigation for preset gallery.

## Decision H: privacy footnote

Portrait dataURLs persist in `localStorage`, accessible to any same-origin script. For a TTRPG app a child might use, "don't upload anything sensitive" is worth documenting.

**Recommendation:** one-line copy under the upload button: "Portraits are saved on this device only." Not a blocker, just a one-line callout.

## Suggested scope of *this* PR

- ✅ Reconcile spec against existing `PortraitModal.tsx`. Acknowledge what's done.
- ✅ Add quota-aware persist storage + error surface.
- ✅ Add async-cancel safety via mounted-ref.
- ✅ Switch removal to a dedicated `removePortrait` action.
- ✅ A11y minimum: focus trap, focus restore, escape, aria-label, "saved on device only" copy.
- ⛔ Preset gallery — deferred to a follow-up with explicit source policy.
- ⛔ Wizard step integration — separate PR with deck-store changes.
- ⛔ In-app cropping — separate PR after user feedback.

## Acceptance

- [ ] Quota-aware persist storage exists; quota errors are catchable in the modal layer.
- [ ] Modal surfaces a "couldn't save — storage full" message on quota exceed.
- [ ] Mounted-ref guard added; `setPortrait` is not called after unmount.
- [ ] `removePortrait(id)` action exists; modal calls it instead of `setPortrait(id, '')`.
- [ ] Migration: existing `portrait: ''` becomes `portrait: undefined`.
- [ ] Focus trap and focus restoration implemented in modal.
- [ ] `Escape` closes modal.
- [ ] File input has `aria-label`.
- [ ] "Portraits are saved on this device only" copy under the upload button.
- [ ] Follow-up issues filed for: preset gallery, wizard step integration, in-app cropping.

## Out of scope

- Preset gallery (license review needed first).
- Wizard step integration (separate deck-store work).
- IndexedDB migration (right long-term answer; out of scope here).
- In-app crop UI.
- Face detection / smart cropping.
