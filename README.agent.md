# Agent instructions — VŠCHT Učení

This file is for AI agents and maintainers working on this repo.  
Human-facing product docs live in `README.md`. Prefer this file for architecture, env, deploy gotchas, and non-obvious invariants.

**Repo:** `kolardavidcz/vscht-uceni-web`  
**Production:** https://vscht-uceni-web.vercel.app  
**Product language:** Czech UI copy; English is fine for code comments and commit messages when consistent with nearby code.

---

## 1. What this project is

Greenfield SPA (not Next.js) with three features:

| Feature | Routes | Data |
|--------|--------|------|
| Systematika bakterií | `/mikrobiologie/*` | Bundled taxonomy + Upstash Redis admin store |
| Obor Bioinformatika | `/obor-bioinformatika/*` | Markdown under `src/features/bioinformatics/content/` |
| Python Analyzátor | `/python-analyza` | In-bundle annotated script + mock terminal |

Stack (do not casually upgrade major versions without reason):

- React 19 + TypeScript + Vite 6 (**multi-chunk** build; do not reintroduce `vite-plugin-singlefile` without product need)
- Tailwind CSS 4 (`@theme` tokens)
- React Router 7 (`BrowserRouter`) with **lazy feature routes**
- Vercel: static `dist` + Node serverless under `api/`
- `"type": "module"` in `package.json` (ESM everywhere on the server)

### Performance invariants (hot path = `/mikrobiologie`)

~95% of users deep-link to micro. Keep wiki/markdown/MathJax off that path:

1. **Lazy routes** in `App.tsx` — micro / wiki / python are separate chunks.
2. **MathJax** loads on demand via `src/lib/loadMathJax.ts` only when wiki MD looks like it has math — never in `index.html`.
3. **PA2 overview** + `materialsData` load only when that wiki page opens (`React.lazy` in `WikiPage`).
4. **highlight.js** — only C/C++/bash/python/json grammars in `MarkdownView` (not the full language pack).
5. Prefer growing wiki content carefully; still eager-glob MD today — async MD is a future win if content balloons.

---

## 2. Directory map (what belongs where)

```
api/                          # Vercel serverless handlers ONLY (one file = one endpoint)
  get-data.ts                 # GET  microbiology snapshot
  save-data.ts                # POST admin password + changes/data
  suggest-edit.ts             # POST wiki → GitHub branch + PR

lib/server/                   # Shared Node logic — NOT under api/
  githubSuggest.ts            # createSuggestBranch, path allowlist, GitHub API
  redis.ts                    # @upstash/redis client + env fallbacks

src/
  pages/HomePage.tsx          # Landing (stretched-link cards)
  components/{ui,layout}/     # Shared UI
  features/
    microbiology/             # Quiz, study modes, admin, domain data
    bioinformatics/           # Wiki, SuggestEditModal, content/*.md
    python-analyzer/

vite-plugin-local-api.ts      # Dev-only middleware for POST /api/suggest-edit
scripts/vercel-ignore-build.mjs
vercel.json
```

### Hard rules

1. **Never put shared modules under `api/`.**  
   Vercel treats every file under `api/` as a potential function. Shared code lived in `api/lib/` once and caused production failures / weird routing. Put shared server code in `lib/server/`.

2. **API handler imports must use explicit `.js` extensions** when importing local modules (Node ESM on Vercel):
   ```ts
   import { getRedis } from "../lib/server/redis.js";
   import { createSuggestBranch, getGithubConfigFromEnv } from "../lib/server/githubSuggest.js";
   ```
   Source files are still `.ts`. Omitting `.js` → production `ERR_MODULE_NOT_FOUND` / empty 500 / `FUNCTION_INVOCATION_FAILED`.  
   The Vite local plugin imports TypeScript paths without `.js` (bundler/ts resolution) — that is intentional and separate.

3. **Client code stays in `src/`.** Alias `@/*` → `src/*` (Vite + tsconfig). Do not import `lib/server/*` from React components.

4. **Do not reintroduce `@vercel/kv`.** Use `@upstash/redis` via `lib/server/redis.ts`.

---

## 3. Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit && vite build (multi-chunk dist; no singlefile)
npm run preview
```

### Env (local)

Create `.env.local` (gitignored). Vite loads it **only on process start** — always restart `npm run dev` after edits.

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` or `GH_TOKEN` | Wiki “Navrhnout úpravu” → GitHub |
| `GITHUB_OWNER` | Default `kolardavidcz` |
| `GITHUB_REPO` | Default `vscht-uceni-web` |
| `GITHUB_DEFAULT_BRANCH` | Default `main` |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Micro admin store (optional locally) |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Legacy fallback for Redis |
| `MICROBIOLOGY_ADMIN_PASSWORD` | Admin gate (server); legacy classroom default if unset |

### Local API behavior (critical)

- `npm run dev` does **not** run Vercel serverless functions.
- Only **`POST /api/suggest-edit`** is implemented in `vite-plugin-local-api.ts` (middleware, `enforce: "pre"` so SPA fallback cannot swallow it).
- **`/api/get-data` and `/api/save-data` are not mocked locally** by that plugin. Micro falls back to bundled data + `localStorage` when Redis API is unavailable.
- After changing local-api or env, restart the dev server.
- Empty / hung suggest-edit responses: check the Vite terminal for `[local-api]` logs; ensure `GITHUB_TOKEN` is set and restart was done.

---

## 4. Serverless API contracts

### `GET /api/get-data`

- Redis key: `microbiology:data`
- **404** if empty → client uses bundled static data
- **500** if Redis env missing / error

### `POST /api/save-data`

Body (prefer patch mode):

```json
{ "password": "...", "changes": [ /* AdminChange[] */ ], "baseline": { /* optional seed */ } }
```

Or full replace:

```json
{ "password": "...", "data": { "worksheetData", "emojiOptions", "emojiCategories" } }
```

- Password: `MICROBIOLOGY_ADMIN_PASSWORD` or built-in legacy default (see `api/save-data.ts`).
- Patches apply against latest Redis snapshot (not only client state).

### `POST /api/suggest-edit`

```json
{
  "filePath": "src/features/bioinformatics/content/....md",
  "title": "page title",
  "markdown": "...",
  "note": "optional",
  "authorName": "optional"
}
```

Success (200):

```json
{
  "success": true,
  "branch": "suggest/...",
  "branchUrl": "...",
  "compareUrl": "...",
  "prUrl": "...",
  "prNumber": 8,
  "message": "..."
}
```

Behavior (`lib/server/githubSuggest.ts`):

1. Allow only paths under `src/features/bioinformatics/content/` ending in `.md` (no `..`).
2. Create branch `suggest/<slug>-<timestamp>` from default branch SHA.
3. Commit file via Contents API as **token owner** identity (not fake noreply-only author that confuses Vercel).
4. Open **PR into main — never auto-merge**.
5. Commit message and PR body include `[skip vercel]` as backup.

Required GitHub token permissions (fine-grained):

- Contents: Read and write  
- Pull requests: Read and write  
- Metadata: Read-only  

---

## 5. Vercel deploy invariants

### Build / routing

- Build: `npm run build`, output directory `dist`
- `vercel.json` SPA rewrite: `/((?!api/).*)` → `/index.html` (API must stay outside SPA rewrite)
- `ignoreCommand`: `node scripts/vercel-ignore-build.mjs`
  - Exit **0** = skip deploy
  - Exit **1** = build
  - Skips when branch starts with `suggest/` or commit message matches `[skip vercel]` / `[vercel skip]`

### Where “Skipped Deployment” appears

- **Vercel → Project → Deployments** (status often **Canceled**), not in the GitHub PR conversation thread.
- Log line example: `SKIPPED because of [skip vercel] / suggest/* branch`
- Skip is **intentional** for wiki suggestion branches. Do not “fix” skip by removing `ignoreCommand` unless product requirements change.

### Production empty 500 on `/api/*` — checklist

If Network tab shows status 500 with **empty body** / `FUNCTION_INVOCATION_FAILED`:

1. Open Vercel function logs for the deployment (not only the browser).
2. Classic failure: `ERR_MODULE_NOT_FOUND` for imports without `.js` or modules still under `api/lib/`.
3. Missing env: `GITHUB_TOKEN` → 503 with JSON error (if handler boots); Redis missing → 500 on get/save-data.
4. After changing env vars, **redeploy** (or ensure new deployment picks them up).
5. Local works but production fails → almost always ESM import layout or env, not React code.

### Suggest-edit product policy

- PR only; human merges on GitHub.
- Do not enable auto-merge from the API.
- Suggestion branches should not create preview deploys (ignoreCommand must be on **main** for the base config Vercel uses when evaluating the branch).

---

## 6. Frontend architecture notes

### Routing

Defined in `src/App.tsx`:

- `/` → `HomePage`
- `/mikrobiologie/*` → nested quiz / study / admin (data hook at layout level)
- `/obor-bioinformatika/*` → `WikiPage`
- `/python-analyza` → analyzer
- Unknown → redirect home

### HomePage click / navigation (stretched link)

Cards use a full-card absolute `Link` with `z-[1]`. Nested shortcut chips (PA1, AG1, Wiki) use `relative z-[2]` so they receive clicks.

**Do not** put the overlay link under content with `z-0` while content is `z-10` without `pointer-events-none` on non-interactive chrome — icons and text will intercept clicks and navigation will feel broken.

Pattern:

```tsx
<Card className="relative overflow-hidden ...">
  <Link to="..." className="absolute inset-0 z-[1] rounded-2xl" aria-label="..." />
  {/* icons/text: no higher stacking that blocks the link unless intentional */}
  <div className="relative z-[2]">{/* nested links only */}</div>
</Card>
```

### Microbiology data resolution order

See `useMicrobiologyData.ts`:

1. Fresh load path / version bump may clear stale `localStorage`
2. Production: `GET /api/get-data` (Redis)
3. Fallback: `localStorage` / bundled static data
4. Admin saves: prefer `POST /api/save-data`, always mirror local

Storage key versioning exists so bad encodings do not poison UI forever.

### Wiki content

- Files: `src/features/bioinformatics/content/**/*.md` + `config.json`
- Loaded via feature `contentLoader` / materials data
- Suggest-edit only for repo-relative content paths (allowlist in server)

### Brand constraints (UX)

- Accent orange only: `#f95d12` / text `#c2410c`
- Dark surfaces: espresso `#0f0906` + warm browns
- Fonts: Plus Jakarta Sans (body), Outfit (display)
- Avoid blue/green/purple brand backgrounds

---

## 7. What not to do

| Don’t | Why |
|-------|-----|
| Put shared code in `api/lib/` | Treated as endpoints / broke production ESM |
| Import server modules without `.js` in `api/*.ts` | `ERR_MODULE_NOT_FOUND` on Vercel |
| Expect `npm run dev` to run all Vercel APIs | Only suggest-edit is local-middleware’d |
| Auto-merge wiki PRs | Product rule: manual review |
| “Fix” skipped `suggest/*` deploys by deleting ignoreCommand | Skip is required |
| Use `@vercel/kv` | Deprecated; use Upstash Redis wrapper |
| Nested interactive elements under home cards without z-index plan | Broken navigation on text/icons |
| Commit secrets (tokens, passwords) | Use `.env.local` / Vercel env only |

---

## 8. Debugging playbooks

### Suggest-edit works locally, fails on production

1. Confirm production response: empty 500 vs JSON 503/502.
2. Check Vercel function logs for `MODULE_NOT_FOUND` or GitHub API errors.
3. Verify `GITHUB_TOKEN` on Vercel for Production (and Preview if needed).
4. Verify handler imports: `../lib/server/*.js`, shared code under `lib/server/`.
5. Redeploy after env or import fixes.

### Suggest-edit empty response in local dev

1. Restart Vite after setting `GITHUB_TOKEN` in `.env.local`.
2. Confirm Network request hits `POST /api/suggest-edit` (not SPA HTML).
3. Read Vite console `[local-api]` lines.
4. Token scopes / repo access if GitHub returns 401/403 (surfaced as 502 with `detail`).

### Micro admin does not persist across devices

1. Redis env on Vercel (`UPSTASH_*` or legacy `KV_REST_*`).
2. Password match on server.
3. Without Redis, only `localStorage` on that browser.

### Home card does not navigate when clicking text/icon

1. Inspect stacking: card link must be above non-interactive content or content must not capture pointer events.
2. Nested chips need higher z-index than the stretched link.
3. See `src/pages/HomePage.tsx` for the current correct pattern.

---

## 9. Safe change guidelines for agents

1. **Prefer smallest fix** that preserves product behavior (three tools + suggest-edit PR flow + Redis admin).
2. **Touch `api/` and `lib/server/` carefully** — production ESM and env coupling.
3. After API changes: verify both **local** (where applicable) and reason about **Vercel ESM** (`.js` imports).
4. After UI navigation changes: click **padding, text, and icons** on home cards, plus bio chips.
5. Do not add new frameworks (Next, Express, etc.) without an explicit human request.
6. User-facing product README is `README.md`; keep agent-only depth here.
7. Commits: only when asked; no force-push; no amending published history.

---

## 10. Quick reference — env on Vercel

| Name | Required for |
|------|----------------|
| `UPSTASH_REDIS_REST_URL` | Micro shared store |
| `UPSTASH_REDIS_REST_TOKEN` | Micro shared store |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Optional legacy pair |
| `GITHUB_TOKEN` | Wiki suggest → PR |
| `MICROBIOLOGY_ADMIN_PASSWORD` | Recommended for admin |

Optional overrides: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_DEFAULT_BRANCH`.

---

## 11. Related files to open first

| Task | Start here |
|------|------------|
| Home navigation / cards | `src/pages/HomePage.tsx` |
| Routes | `src/App.tsx` |
| Wiki suggest UI | `src/features/bioinformatics/components/SuggestEditModal.tsx` |
| GitHub PR logic | `lib/server/githubSuggest.ts` |
| Production handler | `api/suggest-edit.ts` |
| Local API | `vite-plugin-local-api.ts` |
| Redis | `lib/server/redis.ts`, `api/get-data.ts`, `api/save-data.ts` |
| Micro client data | `src/features/microbiology/hooks/useMicrobiologyData.ts` |
| Skip preview builds | `scripts/vercel-ignore-build.mjs`, `vercel.json` |
| Product deploy docs | `README.md` |

---

*Last updated from production incident notes: ESM import layout (`lib/server` + `.js`), Upstash Redis migration, suggest/* Vercel skip, local-api plugin, HomePage stretched-link stacking.*
