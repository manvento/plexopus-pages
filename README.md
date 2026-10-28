# Plexopus · Public website

A lightweight, static English/Italian introduction to Plexopus: what it is, the needs it addresses, its current capabilities and its broad direction.

- **English:** https://manvento.github.io/plexopus-pages/
- **Italiano:** https://manvento.github.io/plexopus-pages/it/

## GitHub Pages

Publish directly from **`main` → `/ (root)`** in **Settings → Pages → Build and deployment → Deploy from a branch**. The `.nojekyll` file bypasses Jekyll. No compilation, package installation, secrets or custom Actions workflow is required. Subsequent commits to `main` publish automatically.

English lives in `index.html`, Italian in `it/index.html`. Both pages contain their complete translated content and work without JavaScript. Shared assets use relative URLs so the project-site prefix is supported. JavaScript only enhances the conceptual valve example and preserves the current anchor when changing language.

## Preview locally

From the repository directory:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080/ or http://localhost:8080/it/.

## Edit content

Update both HTML pages together. The stylesheet is `assets/site.css`; the optional interaction is `assets/site.js`.

Keep public copy focused on the product, user needs and benefits. The only implementation context intentionally discussed is open-source GIS compatibility and cloud/on-premises availability. The roadmap is deliberately broad, with no delivery dates. Distinguish current functionality from planned GIS integrations and later utility profiles. The connectivity illustration is original and illustrative; it is not a hydraulic simulation or a screenshot of the application.

The approved Plexopus logo, symbol and icons are reused unchanged from the project's production branding. The website contains no external fonts, analytics, third-party scripts, maps or application calls. Contact and feedback links point to this public repository; the private source repository is not linked.

When adding a custom domain, update canonical and alternate links, Open Graph URLs, `sitemap.xml`, `robots.txt` and the home links in `404.html` to match the final address.
