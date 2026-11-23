# Plexopus public website — launch branch

Bilingual static website for the Plexopus v1 launch. A.4 aligns with the Studio product name, advanced workflows and the opt-in ChatGPT → MCP → Studio link. English: `index.html`. Italian: `it/index.html`.
The CSS is split into `assets/tokens.css` (Design System v1 semantic token snapshot, from the approved November 2026 styleguide) and `assets/site.css`; interactive educational examples use `assets/site.js`. Both pages work without JavaScript.

## Preview locally
```sh
python3 -m http.server 8080
```
Open http://localhost:8080/ or http://localhost:8080/it/. No framework build, remote fonts, CDN, analytics or external JavaScript is used.

## Brand and messaging
The existing binary assets in `assets/` are identical to the canonical Plexopus application icons/wordmark. Do not redraw the logo. Light editorial page sections follow the Plexopus Design System v1.

The public copy focuses on Plexopus Studio guided workflows, the network engine through REST, MCP integrations with compatible AI assistants, GIS and non-GIS interoperability, and MPL-2.0. Illustration and simulated chat buttons do not call APIs, operate valves, or represent a verified network analysis.

## A.4 images and claims

`assets/studio-login-light-en.png` and `assets/studio-login-light-it.png` are **unaltered** Studio screenshots copied from `manvento/plexopus` branch `integration/map-first-v1`, under `docs/web/screenshots/studio-login/` (PR #153). They illustrate the real login UI only, not the map or analysis. All other network imagery on this site remains an educational illustration and is not a product screenshot.

The ChatGPT → MCP → Studio storyboard explains the feature-gated paired-tab pilot (PR #143) with an explicit deployment/access note. It is not a site-hosted AI chat, does not perform real network analysis and does not imply general availability until the pilot is validated.

## Internal launch checklist
- [ ] Merge/release Plexopus Studio map-first UX, MCP endpoint and the intended v1 AI experience before publishing; validate the feature-gated paired-tab integration with real OAuth and ChatGPT client.
- [ ] Verify MCP OAuth, per-network permissions, connected/upstream/downstream trace, isolation and maps against a release tag; review E2E and production security.
- [ ] When the Core source repository becomes public, point the "Read the license" link to the actual public source and use an accurate "Explore the source" label.
- [ ] Add a real Web/demo link only when its URL, auth requirements, and data are public.
- [ ] Verify EN/IT, keyboard/touch, responsive widths, JS-disabled HTML, CSS reduced-motion, color contrast and alt labels.
- [ ] Confirm domain plexopus.org, CNAME, canonical/alternate/OG URLs, sitemap, robots and 404. Re-check after transferring into the Plexopus organization.
- [ ] Merge into `main` only when publication is approved: GitHub Pages publishes from main.

No public-facing progress banners or incomplete-feature promises are used; this checklist stays internal to the repository.

- [ ] Reconfirm the screenshots and Studio naming match the final shipped release. Do not publish outdated audit screenshots.
