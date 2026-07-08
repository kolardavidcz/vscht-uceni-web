# 🏗️ VSCHT Učení - Global AI Architecture Rules

You are working on the general architecture and shared UI system of the "VSCHT Učení" web app.

## Project Roots
```
vscht_uceni_web/
├── api/                   — Backend serverless functions (Vercel)
├── src/
│   ├── components/ui/     — Shared UI library (Card, Button, Badge, ProgressBar)
│   ├── pages/             — Top-level pages (Home, UIShowcase)
│   ├── features/          — Feature modules (microbiology, bioinformatics)
│   ├── App.tsx            — Main routing hub
│   ├── main.tsx           — React DOM root & global error catcher
│   ├── index.css          — Global CSS, Tailwind v4 @theme, custom classes
│   └── types.ts           — Global TypeScript definitions
├── vite.config.ts         — Configured with react and singlefile plugins
└── vercel.json            — Vercel config (rewrites all routes to /index.html)
```

## Global State & Routing (App.tsx)
- Uses React Router `BrowserRouter` with `<Routes>`.
- **Top-level State**: `App.tsx` calls `useMicrobiologyData()` to fetch/load microbiology data and passes it down to all microbiology routes.
- **Routes Map**:
  - `/` → `<Home />` (Landing page portal)
  - `/ui-showcase` → `<UIShowcase />` (Interactive prototyping sandbox)
  - `/mikrobiologie/*` → Microbiology feature module
  - `/obor-bioinformatika/*` → Bioinformatics Wiki feature module
  - `/python-analyza` → Python script standalone page

## Shared UI Library (src/components/ui/)
- **`Card`**: glassmorphic container with `variant="light" | "dark"`. Light uses `card-surface` CSS class (white/ivory gradient), Dark uses `card-surface-dark` (espresso/mocha gradient). Optional `hoverEffects`.
- **`Button`**: `variant="primary" | "secondary" | "ghost" | "dark"`.
- **`Badge`**: tiny semantic tags with multiple color variants (orange, slate, green, red, etc.).
- **`ProgressBar`**: horizontal indicator with `variant="orange" | "green"`.

## Styling System (Tailwind v4 + index.css)
- Uses **Tailwind v4** syntax (no `tailwind.config.js` needed).
- Custom variables defined in `@theme` block in `index.css`:
  - `brand-orange` (#f95d12) and `brand-orange-text` (#c2410c)
  - `brand-espresso` (#0f0906) for dark pages
  - `brand-roast`, `brand-mocha`, `brand-latte`, `brand-peach`, `brand-ivory`
- **Custom CSS Classes**:
  - `.glass-panel`, `.card-surface` (light glassmorphism)
  - `.glass-panel-dark`, `.card-surface-dark` (dark glassmorphism)
  - `.page-header` (dark roast gradient, sticky, orange top line)
  - `.page-header-dark` (transparent espresso, sticky)

## Landing Page (Home.tsx)
- Full dark theme: `bg-brand-espresso` background with animated radial gradients.
- Renders three massive `<Card variant="dark">` items serving as portals to:
  1. Systematika bakterií
  2. Obor: Bioinformatika (with quick links PA1, AG1, Wiki)
  3. Python Analyzátor

## Important Developer Notes
- **Error Catcher**: `main.tsx` overrides `console.error` and `window.onerror` to capture runtime crashes and send them to a local logger endpoint (`http://localhost:9999/`).
- **MathJax**: loaded in `index.html` via CDN. Used by Bioinformatics wiki for rendering LaTeX equations.
- **Single File Build**: `vite-plugin-singlefile` inlists all JS and CSS into `index.html` on build.

## Key Design Rules (ABSOLUTE)
1. **ONLY ORANGE** is allowed as an accent color (no blue, green, purple backgrounds).
2. For light-themed pages, use **white** or very light warm gray (`stone-50`) backgrounds.
3. Keep headers **dark** (brown/black) for strong contrast.
4. **NO BLUE** backgrounds anywhere on the site.
5. You must be obsessed with **pixel perfection** — fix anything that looks off.
