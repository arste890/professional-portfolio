# Professional Portfolio

[![License: StevensIT License v1.0](https://img.shields.io/badge/License-StevensIT%20License%20v1.0-F7F5F0?style=flat-square&logoColor=white&labelColor=191F27)](./LICENSE.md)
![Built With: Eleventy](https://img.shields.io/badge/Built%20with-Eleventy-0A0A23?style=flat-square&logo=eleventy&logoColor=white&labelColor=0A0A23)
![Status: Maintained](https://img.shields.io/badge/status-maintained-0A0A23?style=flat-square&labelColor=0A0A23&color=4CAF50)
![Open Issues](https://img.shields.io/github/issues/arste890/professional-portfolio?style=flat-square&labelColor=0A0A23)
![Last Commit](https://img.shields.io/github/last-commit/arste890/professional-portfolio?style=flat-square&labelColor=0A0A23)
![Repo Size](https://img.shields.io/github/repo-size/arste890/professional-portfolio?style=flat-square&labelColor=0A0A23)

<a href="./LICENSE.md">
  <img src="https://github.com/arste890/SAC/blob/main/StevensIT-Logo.png?raw=true" alt="StevensIT Logo" width="120"/>
</a>

The personal and professional portfolio of **Alec R. Stevens**, published at
[alecstevens.com](https://alecstevens.com).

## Overview

A static site built with [Eleventy](https://www.11ty.dev/). Page content lives in
JSON data files and is rendered through shared Nunjucks layouts, so the masthead,
navigation and footer are each defined exactly once. CSS and JavaScript are
authored as small modules and bundled by [esbuild](https://esbuild.github.io/)
into one minified file each.

## Getting started

```bash
npm install      # install dependencies
npm run serve    # local dev server with live reload at http://localhost:8080
npm run build    # production build into _site/
```

`npm run build` is what CI runs; it minifies the CSS and JS bundles. `npm run serve`
skips minification and emits inline source maps.

## Project structure

```
src/
├── _data/                     Content, as data — edit these to change the site
│   ├── site.js                Name, credentials, nav, social links, portrait
│   ├── experience.json        Academic & research roles
│   ├── volunteer.json         Leadership & service roles
│   ├── education.json         Degrees, institutions, logos, the RISE award
│   ├── endorsements.json      Professional endorsement quotes
│   ├── media.json             Gallery items (images, video, Instagram posts)
│   └── projects.json          Project cards
├── _includes/
│   ├── layouts/base.njk       The single HTML shell for every page
│   └── partials/              head, masthead, nav, footer, icon macros
├── assets/
│   ├── css/                   tokens → base → layout → components/
│   └── js/                    theme, nav, accordion, dialog, lightbox, to-top
├── images/  videos/           Static media (copied through untouched)
├── index.njk  media.njk  projects.njk  404.njk  styleguide.njk
├── calculus-and-musical-consonance/
└── sitemap.njk                Generated from the indexable pages
```

### Editing content

Most updates need no template changes. To add a role, append an object to
`src/_data/experience.json`. To add a gallery item, append to
`src/_data/media.json`. To change the navigation, edit the `nav` array in
`src/_data/site.js` — it drives every page at once.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `_site/` to GitHub Pages.

> **One-time setup:** in the repository's **Settings → Pages**, set **Source** to
> **GitHub Actions**. The site previously served static files straight from the
> repository root; it now serves a build artifact instead.

Public URLs are unchanged from the previous hand-written version: pages are
emitted as `index.html`, `media.html`, `projects.html` and so on, which GitHub
Pages serves at both `/media` and `/media.html`.

## Conventions

- **Colour and type** resolve to custom properties in
  [`src/assets/css/_tokens.css`](src/assets/css/_tokens.css). Nothing else
  hard-codes a hex value, which is what makes the light and dark palettes
  swappable. Every foreground/background pair meets WCAG AA or better.
- **Interactive components** are built on native elements — `<button>` for
  disclosures and gallery tiles, `<dialog>` for modals — so keyboard support,
  focus trapping and Escape-to-close come from the platform.
- **Motion** is suppressed wherever `prefers-reduced-motion: reduce` is set.

## License & Attribution

All contents of this repository are licensed under the **StevensIT License v1.0**.
Commercial use, sublicensing, redistribution, or modification for profit is
**strictly prohibited** without prior written permission. Any permitted use must
include proper attribution:

> "Developed by StevensIT, a Division of StevensED LLC. Used under the StevensIT License v1.0."

Please refer to the [LICENSE](./LICENSE.md) file for full terms and conditions.

## Contact

**StevensIT**
Email: report@StevensED.org
Website: [IT.StevensED.org](https://IT.StevensED.org)

---

© 2025 | StevensED LLC | StevensIT | All rights reserved.
