# VŠCHT Učení — Architecture (greenfield)

This document describes the **new** app built from `FROM_SCRATCH.md`.  
`.old/` is an archive of the previous implementation (product reference only).

## Why this architecture is better

The old app worked, but structure and size made change risky: multi-thousand-line feature pages, a custom regex markdown pipeline, and unclear ownership of shared UI. The rewrite keeps **product parity** while using **small modules**, **feature-local state**, an established markdown stack, and a single design-token surface. Domain content (taxonomy, emoji catalog, wiki markdown, PA2→AG1 dataset, Python script) is **re-imported as data**, not ported as components.

## Feature independence

```
features/
  microbiology/     own types, data, hooks, pages
  bioinformatics/   content loader, markdown view, PA2 overview
  python-analyzer/  static script + mock terminal
```

No feature imports another feature’s components. Shared pieces live under `components/ui` and `components/layout`.

## Routing

| Route | Owner |
|-------|--------|
| `/` | `pages/HomePage` |
| `/mikrobiologie/*` | microbiology (data hook scoped to this subtree) |
| `/obor-bioinformatika/*` | wiki splat routes |
| `/python-analyza` | python analyzer |

Microbiology state (`useMicrobiologyData`) is **not** lifted to the root app for other features.

## Data stories

### Microbiology
1. Bundle: `data/zastupci.ts` + `data/emojis.ts`  
2. Enrich: sort correct emoji sets + generate hints  
3. Runtime overrides: `localStorage` key `microbiology_data`  
4. Optional: `GET /api/get-data` in non-localhost (same payload shape)

Scoring = **set equality** of emoji answers (order independent). Groups use field ids `itemId_groupId`.

### Bioinformatics
- Vite `import.meta.glob('../content/**/*.md', { query: '?raw', eager: true })`
- Labels/order from `content/config.json`
- Render: `react-markdown` + remark-gfm + rehype-raw
- MathJax typesets after content mount
- Special key `pa2-ag1-overview` → React matrix (`materialsData.ts`), not markdown

### Python analyzer
- Pure static strings; mock “Run” after ~1.2s delay

## Design tokens

Defined in `src/index.css` `@theme`:

- `brand-orange` `#f95d12`
- `brand-orange-text` `#c2410c`
- `brand-espresso` `#0f0906`
- warm brown family: roast / mocha / latte / peach / ivory

Layout chrome: `.page-header` (light pages), `.page-header-dark` (dark pages).

## Build

- Dev: normal Vite multi-module
- Prod: `vite-plugin-singlefile` inlines JS/CSS into one HTML (favicon may remain external)
- Deploy: Vercel SPA rewrite → `index.html`

## Admin threat model

Password `bavi_nas_mikrobiologie` is checked only in the browser. Anyone can bypass it. Acceptable for local answer-key editing; **not** suitable for protecting secrets. Prefer server-side auth if admin becomes multi-user production tooling.

## Intentional product differences vs archive

- Markdown via library (better CommonMark/GFM) instead of hand-rolled regex
- Study UI split into smaller components (tree / flashcards / matrix)
- Clearer localStorage payload schema
- New docs describe principles, not an immutable file tree
