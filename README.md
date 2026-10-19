# Bennett Law Office — homepage

Static desktop build of the Paper design ("Bennett Website" file). No build step.

## Run locally

```bash
node dev-server.js 4321
```

Then open http://localhost:4321.

## Structure

- `index.html`: markup (fixed hero, morphing wordmark + nav, scroll layer)
- `css/styles.css`: layout. Every size is design px × `--u` (1px at the 1440 artboard), so the page scales with browser width.
- `js/main.js`: GSAP ScrollTrigger, scrubbed across the first screen of scroll. The fixed hero's background fades off-white → green while the wordmark (column 1 → 5 columns centered) and nav (right side → top center) morph. After that, the "Serving the Missoula Valley since 1997" view holds for 10% of a screen of scroll (`--hold` in CSS and `HOLD` in JS, kept in sync) before the text scrolls up over the wordmark.
- Smooth scroll: Lenis (`lerp: 0.28`, very subtle), driven by GSAP's ticker so ScrollTrigger stays in sync. It's off for visitors with reduced motion turned on, and touch devices keep native scrolling. Lower `lerp` = smoother/floatier.
- `assets/`: fonts, wordmark/logo SVGs, compressed photos.

## Stacking order

| z | Layer |
|---|-------|
| 1 | Hero (fixed; off-white fading to green = the page backdrop) |
| 2 | Wordmark (fixed) |
| 3 | Reveal-section bottom text + content section |
| 4 | Nav (fixed) |

## Before launch

- **Fonts are trial versions** (Successor Trial, Malamocco Unlicensed Trial). Buy web licenses and swap in the licensed `.woff2` files.
- GSAP loads from cdnjs and Lenis from jsDelivr. Self-host it in `js/vendor/` if preferred.
- Nav items don't link anywhere yet; they only have the blue-grey hover state.
- Desktop only. The mobile layout is designed in Paper but not coded yet.
- `dev-server.js` is for local preview only and doesn't need to be deployed.
