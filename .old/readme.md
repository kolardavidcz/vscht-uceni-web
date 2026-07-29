# VŠCHT Učení – Web Learning Portal

An interactive web portal and student resource hub developed for **UCT Prague (VŠCHT)**. Built with **React 19 + Vite 8 + Tailwind CSS 4**, hosted on **Vercel** as a single-page application (SPA).

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (hot reload)
pnpm dev

# Production build (single HTML file)
pnpm build
```

---

## Project Structure

```
vscht_uceni_web/
├── AI_ARCHITECTURE.md           ← Global AI context (design rules, routing, styling)
├── index.html                   ← Entry point (MathJax CDN, Google Fonts, favicon)
├── package.json                 ← React 19, Vite 8, Tailwind 4
├── vite.config.ts               ← react + tailwindcss plugins, singlefile (build only)
├── vercel.json                  ← SPA rewrite (all routes → /index.html)
├── tsconfig.json                ← ESNext, bundler resolution, strict mode
│
└── src/
    ├── main.tsx                 ← React DOM root
    ├── App.tsx                  ← BrowserRouter routing hub
    ├── index.css                ← Tailwind v4 @theme, all custom CSS classes
    ├── types.ts                 ← Shared TypeScript types
    │
    ├── components/ui/           ← Shared UI library
    │   ├── Card.tsx             ← variant="light"|"dark", glassmorphic
    │   ├── Button.tsx           ← variant="primary"|"secondary"|"ghost"|"dark"
    │   ├── Badge.tsx            ← Semantic color tags
    │   └── ProgressBar.tsx      ← variant="orange"|"green"
    │
    ├── pages/
    │   └── Home.tsx             ← Landing portal (dark theme, 3 feature cards)
    │
    └── features/                ← Three independent feature modules
        ├── microbiology/        ← 🦠 Emoji taxonomy quiz
        │   └── AI_CONTEXT.md    ← Feature-specific AI instructions
        ├── bioinformatics/      ← 🧬 Markdown wiki
        │   └── AI_CONTEXT.md    ← Feature-specific AI instructions
        └── python-analyzer/     ← 🐍 Python script viewer
            └── AI_CONTEXT.md    ← Feature-specific AI instructions
```

---

## Feature Modules

### 🦠 Microbiology — Bacterial Taxonomy Quiz
**Route:** `/mikrobiologie`

An interactive quiz where students match bacterial taxons with correct physiological properties using emoji. Features include:
- **Quiz Page** — Fill-in worksheet with emoji palette (floating or pinned sidebar)
- **Study Page** — Three tabs: taxonomy tree browser, spaced-repetition flashcards, comparison matrix
- **Admin Panel** — Edit correct answers and manage emoji categories

### 🧬 Bioinformatics Wiki
**Route:** `/obor-bioinformatika`

A Markdown-powered study hub that dynamically loads `.md` files via Vite's `import.meta.glob`. Features:
- Sidebar navigation grouped by semester and course
- Custom regex-based markdown parser with C/VBA syntax highlighting
- Interactive PA2→AG1 curriculum matrix component
- MathJax support for LaTeX equations

### 🐍 Python Analyzer
**Route:** `/python-analyza`

A standalone code viewer displaying a Python DNA/RNA analysis script. Users can copy the script or trigger a mock execution with simulated terminal output.

---

## AI Agent Instructions

Each feature module contains an `AI_CONTEXT.md` file with detailed instructions for AI coding agents. The root-level `AI_ARCHITECTURE.md` contains global design rules and constraints.

### Key Design Rules
1. **ONLY ORANGE** (`#f95d12`) is allowed as an accent color — no blue, green, or purple backgrounds
2. Light pages use **white** or `stone-50` backgrounds; headers are always **dark**
3. The app builds to a **single HTML file** via `vite-plugin-singlefile`
4. The custom markdown parser does NOT support full CommonMark — see `markdownParser.ts` for supported features

### Build Constraint
All assets must be inlineable. Do not introduce external CSS imports or heavy local files that would break single-file bundling.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Bundler | Vite 8.1 |
| Styling | Tailwind CSS 4 (v4 syntax, no config file) |
| Routing | React Router 7 |
| Icons | Lucide React |
| Fonts | Plus Jakarta Sans, Outfit (Google Fonts) |
| Math | MathJax 3 (CDN) |
| Deploy | Vercel (SPA mode) |
| Build | `vite-plugin-singlefile` (single HTML output) |

---

## Contact

Questions and feedback: [kolarv@vscht.cz](mailto:kolarv@vscht.cz)
