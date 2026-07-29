# 🏗️ VSCHT Učení — Global Architecture & AI Rules

You are working on the **VSCHT Učení** web app — a study portal for VŠCHT Prague students. This file describes the overall project structure, shared systems, and absolute design rules that apply everywhere.

## Project Structure
```
vscht_uceni_web/
├── AI_ARCHITECTURE.md              ← You are here (global rules)
├── index.html                      ← Entry point (loads MathJax CDN, Google Fonts)
├── package.json                    ← Vite 8 + React 19 + Tailwind 4
├── vite.config.ts                  ← react, tailwindcss, singlefile (build-only)
├── vercel.json                     ← Rewrites all routes → /index.html (SPA)
├── tsconfig.json                   ← ESNext, bundler resolution, strict mode
│
└── src/
    ├── main.tsx                    ← React DOM root + global error interceptors
    ├── App.tsx                     ← BrowserRouter routing hub
    ├── index.css                   ← Tailwind v4 @theme, all custom CSS classes
    ├── types.ts                    ← Shared TypeScript types (WorksheetItem, EmojiOption, etc.)
    │
    ├── components/ui/              ← Shared UI component library
    │   ├── Card.tsx                ← variant="light"|"dark", glassmorphic
    │   ├── Button.tsx              ← variant="primary"|"secondary"|"ghost"|"dark"
    │   ├── Badge.tsx               ← Semantic color tags (orange, slate, green, red, etc.)
    │   └── ProgressBar.tsx         ← variant="orange"|"green"
    │
    ├── pages/
    │   └── Home.tsx                ← Landing portal (dark theme, 3 feature cards)
    │
    └── features/                   ← Three independent feature modules
        ├── microbiology/           ← 🦠 Emoji taxonomy quiz (has its own AI_CONTEXT.md)
        ├── bioinformatics/         ← 🧬 Markdown wiki (has its own AI_CONTEXT.md)
        └── python-analyzer/        ← 🐍 Python script viewer (has its own AI_CONTEXT.md)
```

## Feature Modules
Each feature is **fully independent**. Read its `AI_CONTEXT.md` for feature-specific details:

| Feature | Route(s) | Theme | AI_CONTEXT.md |
|---------|----------|-------|---------------|
| 🦠 Microbiology | `/mikrobiologie/*` | Light (stone-50) | `src/features/microbiology/AI_CONTEXT.md` |
| 🧬 Bioinformatics Wiki | `/obor-bioinformatika/*` | Light (slate-50) | `src/features/bioinformatics/AI_CONTEXT.md` |
| 🐍 Python Analyzer | `/python-analyza` | Dark (espresso) | `src/features/python-analyzer/AI_CONTEXT.md` |

## Routing (App.tsx)
```
/                           → Home (landing portal)
/mikrobiologie              → QuizPage
/mikrobiologie/studijni-strom    → StudyPage (tree tab)
/mikrobiologie/samostudium       → StudyPage (flashcards tab)
/mikrobiologie/srovnavaci-matice → StudyPage (matrix tab)
/mikrobiologie/admin             → AdminPanel
/obor-bioinformatika             → BioinformaticsDashboard
/obor-bioinformatika/:key        → BioinformaticsDashboard (material view)
/obor-bioinformatika/:c/:key     → BioinformaticsDashboard (course/material)
/obor-bioinformatika/:c/:s/:key  → BioinformaticsDashboard (course/sub/material)
/python-analyza                  → PythonAnalyzer
```

**Top-level state**: `App.tsx` calls `useMicrobiologyData()` hook and passes data down to all microbiology routes. Other features are stateless at the App level.

## Styling System

### Tailwind v4 (no config file)
All theming is in `src/index.css` using the `@theme` block:
- **`brand-orange`** `#f95d12` — primary accent everywhere
- **`brand-orange-text`** `#c2410c` — darker orange for text
- **`brand-espresso`** `#0f0906` — dark page backgrounds
- **`brand-roast`**, **`brand-mocha`**, **`brand-latte`**, **`brand-peach`**, **`brand-ivory`** — warm palette

### Custom CSS Classes
| Class | Purpose |
|-------|---------|
| `.page-header` | Dark roast gradient, sticky, orange top line (for light pages) |
| `.page-header-dark` | Transparent espresso, sticky (for dark pages) |
| `.card-surface` | Glassmorphic white-to-ivory gradient (light cards) |
| `.card-surface-dark` | Espresso/mocha gradient (dark cards) |
| `.glass-panel` / `.glass-panel-dark` | Backdrop-blur glass effects |

### Fonts
Loaded via Google Fonts in `index.html`:
- **Plus Jakarta Sans** — body text
- **Outfit** — headings and UI elements

## Landing Page (Home.tsx)
- Full dark theme: `bg-brand-espresso` with animated radial gradient glows
- Three `<Card variant="dark">` portals linking to each feature:
  1. **Systematika bakterií** → `/mikrobiologie`
  2. **Obor: Bioinformatika** → `/obor-bioinformatika` (with PA1, AG1, Wiki quick-link buttons)
  3. **Python Analyzátor** → `/python-analyza`

## Build & Deploy
- **Dev server**: `pnpm dev` (Vite, hot reload). `vite-plugin-singlefile` is disabled in dev.
- **Production build**: `pnpm build` (inlines all JS/CSS into a single `index.html`)
- **Deployment**: Vercel, with `vercel.json` SPA rewrite

## Key Design Rules (ABSOLUTE — NEVER VIOLATE)
1. **ONLY ORANGE** is allowed as an accent color. No blue, green, or purple backgrounds.
2. Light-themed pages use **white** or very light warm gray (`stone-50`) backgrounds.
3. Headers are always **dark** (brown/black gradient) for strong contrast.
4. **NO BLUE** backgrounds anywhere on the site. Blue is only acceptable for standard hyperlink text color inside parsed markdown content.
5. Be obsessed with **pixel perfection** — if something looks off, fix it.

## Developer Notes
- **MathJax**: Loaded in `index.html` via CDN for LaTeX rendering in wiki content.
- **`vite-plugin-singlefile`**: Only activates during `pnpm build` (controlled by `command === 'build'` check in `vite.config.ts`).
- **Local dev mode**: `useMicrobiologyData.ts` detects `localhost` and skips the Vercel API call, falling back to static data / localStorage.
