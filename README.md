# Plexopus — official website

The public website at **https://plexopus.org** is a bilingual, static GitHub Pages site.

- **English:** `index.html`, published at `/`
- **Italian:** `it/index.html`, published at `/it/`
- **Host:** GitHub Pages, publishing from `main`, custom domain set by `CNAME`

## Official scrollytelling experience

The new site evolves the approved scroll-driven concept in PR #4 into launch-ready public pages:

1. **Beneath the surface:** an octopus descends into a connected network.
2. **Network intelligence:** tracing, a hypothetical before/after closure on a single diagram, and proposed isolation relative to declared supplies.
3. **Plexopus Studio:** explore, build and validate a network from the map.
4. **AI network assistant:** an illustrative natural-language request via Plexopus MCP. It is an independent channel from Studio, not a prerequisite or automatic Studio handoff.
5. **Ecosystem:** network → Plexopus Core → REST/MCP → GIS, business systems and custom applications.
6. **Open source:** product positioning and link to the Mozilla Public License 2.0.

Copy is maintained in English and Italian. Scroll scene IDs are identical between the languages, allowing the language switch to preserve the current section.

## Architecture

Plain HTML, CSS and JavaScript, without frontend frameworks, remote fonts or tracking.

- `assets/tokens.css` — existing Plexopus Design System v1 tokens
- `assets/story.css` — approved storytelling base
- `assets/story-scenes.css` — pinned chapters and SVG illustrations
- `assets/story-mobile.css` — responsive, readability and reduced-motion adjustments
- `assets/story-official.css` — official header/nav, language switch and open-source footer
- `assets/story.js` — narrative scroll state, English and Italian copy
- `assets/story-official.js` — progressive enhancement of native navigation
- `qa/site-smoke.mjs` — development-only Playwright browser gate

The original mark and favicon in `assets/` are used unchanged. No route, backend, database or authentication connection is required to view the website.

## Preview locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/it/`.

## Run the browser gate

```bash
npm install --no-save --no-package-lock playwright@1.56.1
node qa/site-smoke.mjs
```

The GitHub Actions workflow also runs on PRs targeting `main`. Tests include all seven narrative chapters, both languages, canonical/hreflang metadata, pinned scenes, scenario state reversibility, Studio Build endpoint consistency (S1 → J4), phone/text clearance, readability on six viewports and reduced-motion.

Playwright is only a QA dependency; no package is loaded by the browser for the public website.

## Accuracy and launch gates

- The network, Studio and conversation illustrations are **examples**, not live Core responses, a connected customer deployment or physical network-flow simulations.
- Tracing and isolation rely on the declared data and available directionality, sources and device model. Plexopus does **not** guarantee physical hydraulic/electrical outcomes or operate valves.
- MCP requires compatible assistants and authorization; an optional ChatGPT–Studio paired-tab workflow must not be presented as generally available before its integration gate is confirmed.
- **The public Core repository link is intentionally omitted until the source is actually public**; the MPL-2.0 license page is linked instead.
- [ ] Verify actual iPhone Safari and desktop Safari rendering and scrolling, including orientation changes
- [ ] Check contrast, keyboard focus, screen-reader landmark/navigation and motion reduction
- [ ] Perform final EN/IT editorial review and product claims verification
- [ ] Confirm responsive screenshots and CI on the final commit
- [ ] Confirm `CNAME`, `robots.txt`, `sitemap.xml`, `404.html` and canonical/hreflang links
- [ ] Approve publication and merge production PR into `main`; GitHub Pages then deploys automatically

**Do not merge the production PR until the launch gates have been approved.** The draft prototype PR #4 remains separate and is not used as the source branch for production.
