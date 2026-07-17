# VŠCHT Učení

Studijní portál pro studenty **VŠCHT Praha (UCT Prague)** — React SPA s třemi nezávislými nástroji:

1. **Systematika bakterií** — emoji taxonomický kvíz a studijní režimy  
2. **Obor: Bioinformatika** — Markdown wiki + MathJax + PA2→AG1 přehled  
3. **Python Analyzátor** — anotovaný DNA/RNA skript s mock během  

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # single-file dist/index.html (+ favicon)
npm run preview
```

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript |
| Bundler | Vite 6 + `vite-plugin-singlefile` (prod) |
| CSS | Tailwind CSS 4 (`@theme` tokens) |
| Router | React Router 7 |
| Markdown | `react-markdown` + GFM + `rehype-raw` |
| Math | MathJax 3 (CDN) |
| Deploy | Vercel SPA (`vercel.json` rewrites) |

## Project layout

```
src/
  components/ui/          shared Button, Card, Badge, ProgressBar
  components/layout/      PageShell
  pages/HomePage.tsx
  features/
    microbiology/         quiz, study modes, admin + domain data
    bioinformatics/       wiki, PA2→AG1, content/*.md
    python-analyzer/      script viewer + mock terminal
```

## Routes

| Path | Feature |
|------|---------|
| `/` | Landing |
| `/mikrobiologie` | Quiz |
| `/mikrobiologie/studijni-strom` | Taxonomy tree study |
| `/mikrobiologie/samostudium` | Flashcards |
| `/mikrobiologie/srovnavaci-matice` | Comparison matrix |
| `/mikrobiologie/admin` | Admin: správné odpovědi + emoji katalog (Upstash Redis) |
| `/obor-bioinformatika/*` | Wiki |
| `/python-analyza` | Python analyzer |

## Brand

- Accent: **orange only** `#f95d12` / text `#c2410c`
- Dark surfaces: espresso `#0f0906` + warm browns
- Fonts: Plus Jakarta Sans (body), Outfit (headings)
- No blue/green/purple brand backgrounds

## Data notes

- **Microbiology**: taxonomy + emoji catalog ship in the bundle.
- **Shared store**: Upstash Redis via `GET/POST /api/get-data` and `/api/save-data` (`@upstash/redis`; `@vercel/kv` is deprecated).
- **Offline/admin fallback**: `localStorage` on this browser.
- **Admin password**: UI gate + server check. Prefer env `MICROBIOLOGY_ADMIN_PASSWORD` on Vercel (legacy classroom default still accepted if unset).
- **Wiki content**: `src/features/bioinformatics/content/**/*.md` + `config.json`.
- **Archive**: previous implementation lives in `.old/` for reference only.

## Deploy (Vercel)

1. Connect the repo; build `npm run build`, output `dist`.
2. Add **Redis** from [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=redis) (Upstash).  
   Env: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`  
   (Legacy migrated KV still works via `KV_REST_API_URL` + `KV_REST_API_TOKEN`.)
3. Optional: set `MICROBIOLOGY_ADMIN_PASSWORD`.
4. SPA rewrites skip `/api/*` (see `vercel.json`).

### Wiki „Navrhnout úpravu“ → GitHub PR (no auto-merge)

In-page markdown editor posts to `POST /api/suggest-edit`, which:

1. Creates a branch on [kolardavidcz/vscht-uceni-web](https://github.com/kolardavidcz/vscht-uceni-web)
2. Commits the edited `.md`
3. Opens a **pull request** into `main`
4. **Does not merge** — you review and merge in the GitHub UI

#### Fine-grained Personal Access Token (recommended)

1. GitHub → avatar → **Settings** → **Developer settings** (left bottom)  
   → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. **Token name:** e.g. `vscht-uceni-wiki-suggest`
3. **Expiration:** e.g. 90 days (or custom)
4. **Resource owner:** your user (`kolardavidcz`)
5. **Repository access:** **Only select repositories** → `vscht-uceni-web`
6. **Permissions → Repository permissions:**
   - **Contents:** Read and write *(branch + commit)*
   - **Pull requests:** Read and write *(open PR; never auto-merge)*
   - **Metadata:** Read-only *(required)*
7. Generate → copy the token once
8. **Local:** put in `.env.local` (gitignored):
   ```env
   GITHUB_TOKEN=github_pat_...
   ```
   Then **restart** `npm run dev` (Vite loads env only on start).  
   Local `/api/suggest-edit` is provided by `vite-plugin-local-api.ts`.

9. **Vercel:** project → **Settings → Environment Variables** → same `GITHUB_TOKEN` → Redeploy.

Classic PATs also work (`repo` scope) but fine-grained is safer (one repo only).

Only files under `src/features/bioinformatics/content/**/*.md` are allowed.

#### Skip Vercel builds for suggestion branches

`vercel.json` → `"ignoreCommand": "node scripts/vercel-ignore-build.mjs"`

| Branch / commit | Vercel build? |
|-----------------|---------------|
| `main` | **Yes** |
| `suggest/*` | **No** (skipped) |
| Commit message contains `[skip vercel]` | **No** |

**Where you see the skip message (not in the PR comment thread):**  
Vercel → Project → **Deployments** → open the entry → log line like:

```text
SKIPPED because of [skip vercel] / suggest/* branch
```

GitHub PR “Conversation” will **not** show that text — only Vercel build logs (status usually **Canceled**).

**Required:** push `vercel.json` + `scripts/vercel-ignore-build.mjs` to **`main`** first.  
Until that is on GitHub `main`, suggestion PRs are based on old config → **no ignore script runs** → no skip message, and Vercel may still try to deploy.

Optional dashboard mirror: Project Settings → **Git** → **Ignored Build Step** →  
`node scripts/vercel-ignore-build.mjs`  
(and enable **Automatically expose System Environment Variables**)

**Git author:** commits use the **token owner** (`kolardavidcz`). Suggestor name is only in the PR body.

## Contact

[kolarv@vscht.cz](mailto:kolarv@vscht.cz)
