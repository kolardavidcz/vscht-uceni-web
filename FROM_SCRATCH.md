# VSCHT Učení — Rewrite From Scratch (LLM Instructions)

You are building the **VŠCHT Učení** study portal **from a clean slate**.

There is an existing implementation. Treat it as a **product reference and content archive**, not as a codebase to extend, refactor, or “clean up”. Previous structure, component sizes, custom parsers, and layering decisions may be wrong. **Do not inherit them.**

---

## 0. First action: archive the old project

Before writing any new application code:

1. Create a folder `.old/` at the repo root.
2. Move **everything that belongs to the current app** into `.old/`, including:
   - `src/`, `index.html`, `package.json`, `package-lock.json`
   - `vite.config.ts`, `tsconfig.json`, `vercel.json`
   - `AI_ARCHITECTURE.md`, `readme.md`
   - feature docs such as `**/AI_CONTEXT.md` (they will live under `.old/` after the move)
3. Keep **this file** (`FROM_SCRATCH.md`) at the **repo root** so it remains your active brief.
4. Keep `.git/`, `.gitignore`, and any deploy secrets / env files at the root if present.
5. Do **not** keep a half-old / half-new hybrid tree. After the move, the live project root should be empty of app code except this brief (and git metadata).

Optional but recommended:

```text
.old/
  README_POINTER.md   ← one short note: "Archived previous implementation. Product intent docs live here."
```

You may later **copy domain content** out of `.old/` (markdown notes, taxonomy data, emoji definitions, PDF). You may **not** paste old React components “as a starting point”.

---

## 1. What to read first (intent only)

Read these **after** archiving, from their new paths under `.old/`. Use them for **what the product is**, **routes/features**, **visual constraints**, and **domain content**. Do **not** use them as a license to recreate the same file tree or architecture.

| Priority | File (after archive) | Use for |
|----------|----------------------|---------|
| 1 | `.old/readme.md` | Product overview, features, stack intent, deploy notes |
| 2 | `.old/AI_ARCHITECTURE.md` | Global design rules, routes, brand colors, fonts, build goals |
| 3 | `.old/src/features/microbiology/AI_CONTEXT.md` | Microbiology UX, data model concepts, routes |
| 4 | `.old/src/features/bioinformatics/AI_CONTEXT.md` | Wiki behavior, content layout, MathJax, special PA2→AG1 view |
| 5 | `.old/src/features/python-analyzer/AI_CONTEXT.md` | Python analyzer UX (view / copy / mock run) |

If something in an old doc conflicts with **this** file, **this file wins**.

---

## 2. Mindset rules (absolute)

1. **Greenfield.** Scaffold a new app. Choose structure that is simple, modular, and easy to maintain.
2. **No cargo-cult.** Do not recreate giant monoliths, custom markdown engines by default, or odd coupling.
3. **Product parity, not code parity.** Match user-facing capabilities unless you deliberately improve UX.
4. **Content is sacred; implementation is disposable.**
5. **Prefer boring, standard tools** over clever bespoke engines.
6. **Do not “port line by line”.** Redesign modules; re-import data/content.

---

## 3. Product requirements (must ship)

### 3.1 Overall product

Student learning portal for **UCT Prague (VŠCHT)** with:

- A **landing page** linking to three independent tools
- Client-side SPA suitable for **Vercel**
- Prefer a **single HTML production artifact** (or document why multi-file is better)

### 3.2 Landing (`/`)

- Dark, polished portal
- Three entry cards: Systematika bakterií, Obor: Bioinformatika, Python Analyzátor

### 3.3 Microbiology — Systematika bakterií (`/mikrobiologie/*`)

Interactive emoji taxonomy worksheet / quiz with study modes and admin.

### 3.4 Bioinformatics wiki (`/obor-bioinformatika/*`)

Markdown study hub with sidebar, MathJax, config, PA2→AG1 special view.

### 3.5 Python analyzer (`/python-analyza`)

Annotated Python DNA/RNA script, copy, mock run.

### 3.6 Visual / brand

| Token | Value / rule |
|-------|----------------|
| Primary accent | Orange `#f95d12` only |
| Accent text | Darker orange e.g. `#c2410c` |
| Dark bg | Espresso-like `#0f0906` and warm brown family |
| Forbidden | Blue / green / purple **backgrounds** as brand accents |
| Light pages | White or warm light gray (`stone-50` / similar) |
| Headers | Dark for contrast |
| Fonts | Plus Jakarta Sans (body), Outfit (headings) |

---

## 4. Technical freedom

Suggested: React + TypeScript + Vite, Tailwind CSS v4, React Router, Lucide, Vercel SPA rewrites.

Prefer established markdown libraries over custom regex engines.

---

## 5–10. See full brief in conversation / build order

**Archive the old app → read old docs only for product intent → rebuild a clean modern SPA that preserves content and brand, not legacy structure.**
