# Plexopus · Scrollytelling concept 01

This is a **standalone, non-production prototype** at \`/concept/\` on branch \`concept/scroll-storytelling-v1\`.
The existing bilingual marketing site stays untouched. The proof-of-concept is in Italian only.

## Scope

Two scroll-scrubbed, reversible scenes:

1. **The descent**: a Plexopus brand symbol travels from the surface to a deeper network, with the ocean changing depth/color and a connected network being drawn. The official PNG artwork is used unchanged and moved as a whole.
2. **AI → MCP → Studio**: an illustrative phone enters, a question is progressively composed, an authorized analysis is depicted, then a conceptual Studio map reveals the result. The phone is a generic, explicitly illustrative assistant interface; it is **not** a ChatGPT screenshot. The Studio map is conceptual and contains no production data.

The other segments provide a quiet hero, an explanation bridge, and a concluding CTA linking back to the current website. Navigation anchors and the full content remain available without JavaScript, with static fallbacks where needed.

## Local preview

Run from repository root:

\`\`\`bash
python3 -m http.server 8000
\`\`\`

Then open http://localhost:8000/concept/. To preview this specific Git commit without publication, use a GitHub raw-content preview that correctly rewrites HTML/CSS/JS (e.g. raw.githack pinned to the PR commit).

## Implementation

- Plain HTML / CSS / JavaScript, no GSAP, external images, third-party fonts, CDNs, analytics, API calls or bundling. This is deliberately dependency-free; a library may be evaluated later if the project needs a more elaborate production timeline.
- Scroll progress is calculated from a sticky section's travel range; a single passive scroll listener schedules a coalesced \`requestAnimationFrame\`. Geometry/style properties are updated from progress, so scrolling upward reverses each sequence.
- The page uses Plexopus Design System foundations via \`../assets/tokens.css\` and the unchanged official \`../assets/plexopus-symbol-128.png\`.
- On narrow viewports, the smartphone leaves the frame fully before a brief MCP transfer cue appears; Plexopus Studio then enters alone. The transition is sequential on desktop too, without overlapping devices. The chat typing and first underwater descent are unchanged.
- \`prefers-reduced-motion\` disables the scroll effects and presents a simplified static layout with the full example.
- No fake production result is claimed: the network paths and response are placeholders; the ChatGPT ⇄ Studio linked-tab handoff is a **feature-gated pilot**, subject to real integration sign-off, login and network permissions.
- \`noindex, nofollow\` explicitly prevents the prototype page being promoted as a production marketing destination.

## Review checklist

- [ ] Desktop: full forward/reverse scroll of both scenes in Safari and Chromium.
- [ ] iPhone Safari portrait and landscape: legible copy, validate the exclusive phone-exit → transfer cue → Studio-entry handoff, no clipping or scroll trap.
- [ ] iPad/tablet, narrow split-screen, browser reflow, screen zoom.
- [ ] \`prefers-reduced-motion\`: static sections remain useful, no motion essential to meaning.
- [ ] Keyboard-only navigation, focus indicators, VoiceOver screen-reader flow and color contrast.
- [ ] Performance: dropped frames, style/layout recalculations, power use and paint areas on midrange phones.
- [ ] Determine whether the underwater metaphor is too dominant; ensure positioning remains multi-utility (water, energy, gas, telecom).
- [ ] Keep the production site bilingual and independently navigable, with direct links to features and integrations after final design approval.

**Never merge this prototype into the publishing branch until the concept has been approved and adapted for production.**
