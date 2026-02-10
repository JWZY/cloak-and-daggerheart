# PROMPTS.md

Key prompts used to build this project, in order. Follow these to replicate the work.

---

## 2026-02-08 | SRD Subclass Cards — Initial Build

> Build out the Syndicate (Rogue) subclass card from the Figma design. Use inline SVGs for the banner layers. Make it a reusable component.

> Add 4 more cards: School of War (Wizard), School of Knowledge (Wizard), Call of the Slayer (Warrior), Divine Wielder (Seraph). Extract domain icons into a shared data file.

> Can you make all the titles small caps?

## 2026-02-09 | SRD Card Design Lab & Typography

> Put them all in a column, and allow me to tweak the spacing, font size, colour, capitalization styles in a WYSIWYG style. Are they all the same design template?

Built the `?srdcard` design lab with sliders/toggles/selects for title, class name, body, and footer typography.

> Add a copy config button so I can transfer it to you.

> Change the footer to this: text-shadow: 0 1px 1px #4D381E; font-family: 'EB Garamond'; font-size: 13px; font-weight: 500; font-variant: small-caps; background: linear-gradient(180deg, #F9F8F3 0%, #E7BA90 100%); background-clip: text;

> Check the titles are this: text-shadow: 0 1px 1px #4D381E; font-family: 'EB Garamond'; font-size: 36px; font-weight: 400; line-height: 32px; font-variant: small-caps; (same gold gradient)

Discovered that `text-shadow` doesn't render with `background-clip: text` + `-webkit-text-fill-color: transparent`. Used `filter: drop-shadow()` on a wrapper div as a workaround.

> Can you try a few diff styles, and have them side by side in a row? So I can see the diff options.

Created 5 title shadow variants side-by-side: drop-shadow light, drop-shadow heavy, none, text-shadow CSS, solid gold + shadow.

> Let's use drop shadow heavy as the style going forward. The 'Rogue' class text should be the exact same style as the footer. Which should be small caps.

> Keep the heavy drop-shadow as the main option — delete the other variants.

## 2026-02-09 | Card Frame & Banner Refinement

> Make the borders that gold gradient too pls. The card borders — 1px.

Used wrapper div technique (outer gradient background + 1px padding, inner dark background) since CSS `border` can't do gradients with `border-radius`.

> Can you make the card border 60% opacity?

> In my designs I used this custom brush to add a bit more of a textured look to the borders — is there a way to do this in CSS?

Recommended full SVG frame overlay approach. User exported the brushstroke border from Figma as `card-frame.svg`.

> Turn the opacity of the SVG layer to be ~40%.

> Banner is still off — can you look over the code to let me know what's diff? (linked Figma node)

Analyzed Figma vs implementation: Figma uses a single pennant-shaped alpha mask (`mask-image`) on every layer, while our code used individual SVG shapes + clipPath polygon. The mask approach clips all layers consistently.

> Can you do both (current, and then Figma's approach), I want to see the diff.

Built both side by side. User chose the Figma mask approach — cleaner edges.
