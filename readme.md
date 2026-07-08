# VŠCHT Učení – Web Learning Portal

An interactive web portal and student resource hub developed for **UCT Prague (VŠCHT)**. Hosted on **Vercel**, this single-page application (SPA) serves as a platform for microbiology practice worksheets, python sequence analysis tools, and bioinformatics study materials.

---

## 🤖 AI Agent Quick Start & System Guardrails

If you are an AI Coding Agent working on this repository, you **MUST** adhere to the following architectural constraints:

### 1. Build and Assets Constraint (Single-File Bundling)
*   **The Constraint:** The application compiles to a **single static HTML file** using `vite-plugin-singlefile`.
*   **The Rule:** All stylesheets, JS, components, and SVG assets must be inlineable. Do NOT introduce external CSS imports or large local file assets (like heavy images or fonts) that would break the single-file inline bundling limit. Prefer fetching large resources remotely or inlining them as Base64/SVG where appropriate.

### 2. Database & API Synchronization
*   **The Constraint:** Database states are stored in **Vercel KV (Redis)**.
*   **The Rule:** Always support the fallback mechanism. If `.env` KV variables are missing (e.g. during local development), endpoints `/api/get-data.ts` and `/api/save-data.ts` must fall back to the static files in `src/features/microbiology/data/zastupci.ts` and `emojis.ts`.
*   **State Updates:** When writing UI updates, prefer using **Delta Updates** (sending a `changes` array of delta operations) instead of full state replacements to prevent database race conditions.

### 3. Custom Markdown Parser Limits
*   **The Constraint:** The Bioinformatics Wiki uses a custom regex-based parser (`parseMarkdown` in `BioinformaticsDashboard.tsx`). It does **not** support full CommonMark spec features (e.g. complex nested lists, nested HTML divs, or advanced footnotes).
*   **The Rule:** Only add markdown features that this parser supports:
    *   Headers `#` through `######`
    *   Bold (`**text**`) and Italic (`*text*`)
    *   Standard links `[label](url)`
    *   Bullet lists `* ` or `- ` (single-level)
    *   Tables `| Header |`
    *   Code blocks ` ```c ` or ` ```vba ` (custom syntax highlighted)
    *   MathJax equations: Inline `\( ... \)` and Display `\[ ... \]`
    *   Alerts: `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`

### 4. Admin Credentials & Keys
*   *Admin Panel Password:* Hardcoded in save API and client code as `'bavi_nas_mikrobiologie'`. Do not change this unless requested.
*   *Vercel KV Keys:* The microbiology state key is `microbiology_worksheet_data`. Other subjects map to `subject_data:${subject}`.

---

## 1. Project Directory Structure

```text
vscht_uceni_web/
├── api/                     # Vercel Edge API Endpoints (Backend)
│   ├── get-data.ts          # Reads taxonomy data from Vercel KV (or defaults locally)
│   └── save-data.ts         # Saves delta changes or full state to Vercel KV (authorized)
├── src/                     # React App Frontend
│   ├── components/
│   │   └── ui/              # Reusable UI elements (Badge, Button, Card, ProgressBar)
│   ├── features/            # Feature modules
│   │   ├── bioinformatics/  # Wiki curriculum & Python Analyzer
│   │   │   ├── components/  # Dashboard, Python sequence runner component
│   │   │   └── content/     # Raw Markdown (.md) documents sorted by course folders
│   │   └── microbiology/    # Staining worksheet tree & Study layouts
│   │       ├── components/  # Admin panel, Interactive Tree, flashcards, comparison matrix
│   │       └── data/        # Hardcoded fallback datasets (zastupci.ts, emojis.ts)
│   ├── pages/               # Top-level page views (Home portal, UIShowcase)
│   ├── App.tsx              # Main routing & application state provider
│   ├── index.css            # Custom styling theme, Tailwind v4 imports
│   ├── types.ts             # TypeScript definitions
│   └── main.tsx             # DOM entry point
├── vercel.json              # Vercel single-page router rewrites
├── vite.config.ts           # Vite bundler options (aliases, plugins, single-file plugin)
├── tsconfig.json            # TypeScript compile configurations
└── package.json             # App dependencies & scripts
```

---

## 2. Core Feature Modules

### A) Microbiology: Bacterial Taxonomy Worksheet
An interactive quiz where students match bacterial taxons (Phylum, Class, Family, Genus) with correct physiological, morphological, and ecological properties using a pinnable emoji palette.

#### TypeScript Types & Schema (`src/types.ts`)
```typescript
export type WorksheetItem = {
  id: string;              // Unique identifier (e.g. 'aquificota')
  name: string;            // Visual name (e.g. 'Rod Aquifex')
  type?: string;           // Rank level (Kmen, Třída, Čeleď, Rod, Zástupce, Skupina)
  description?: string;    // Text description / details
  correctEmojis: string[]; // Correct emoji characters for this taxon level
  hint?: string;           // Autogenerated list of English label names (from emojis)
  children?: WorksheetItem[]; // Recursive array of sub-taxons
  checked?: boolean;       // Checking state
  groups?: {               // Section group properties
    id: string;
    label: string;
    correctEmojis: string[];
  }[];
};

export type EmojiOption = {
  emoji: string;           // Emoji string (e.g. '🔴')
  label: string;           // Label description (e.g. 'Gram-negativní')
  category: string;        // Category group (e.g. 'Buněčná stěna')
};
```

#### Study Layouts
*   **Tree (Studijní strom):** Displays the full taxonomy tree with answers visible.
*   **Flashcards (Samostudium):** Card-based interface showing name/details on front, and correct emojis on the back.
*   **Comparison Matrix (Srovnávací matice):** Side-by-side comparative table comparing genus characteristics.

#### Admin Control Panel (`/mikrobiologie/admin`)
*   Password-protected page (`bavi_nas_mikrobiologie`).
*   Allows live editing of the hierarchy (add, delete, reorder nodes).
*   Allows category & emoji configuration.
*   Supports **AI alignment exports** (Download JSON / Upload JSON) to synchronise the taxonomy state easily.
*   Saves directly to database endpoints.

### B) Bioinformatics Wiki
A modular wiki that automatically scans and parses markdown content files.

#### Glob Load Mechanism
The wiki fetches all Markdown documents inside `/src/features/bioinformatics/content` automatically using Vite's eager glob features:
```typescript
const rawFiles = import.meta.glob('/src/features/bioinformatics/content/**/*.md', { query: '?raw', import: 'default', eager: true });
```
Adding a new markdown file into this directory automatically maps and routes the document inside the dashboard sidebar dynamically.

### C) Python Analyzer
A client-side simulated coding terminal allowing students to run sequence translations (DNA -> RNA -> Protein) and nucleotide GC content calculations, providing copyable raw Python code with no dependencies.

---

## 3. Database APIs (`/api`)

The backend consists of Vercel Edge functions communicating with Vercel KV:

### 1. `GET /api/get-data`
*   Loads key `microbiology_worksheet_data` (or defaults to parameter `subject`).
*   If KV connection is inactive or env variables are undefined, returns data in [data.ts](file:///c:/Users/kolar/Desktop/local%20projects/vscht_uceni_web/src/features/microbiology/data/data.ts).
*   Enforces cache headers: `Cache-Control: public, s-maxage=60, stale-while-revalidate=86400`.

### 2. `POST /api/save-data`
*   Accepts `password`, `subject`, and either `data` (overwrite payload) or `changes` (delta modifications).
*   Requires `password === 'bavi_nas_mikrobiologie'`.
*   Supported delta updates: `UPDATE_ITEM`, `DELETE_ITEM`, `ADD_ITEM`, `MOVE_ITEM`, `ADD_EMOJI`, `UPDATE_EMOJI`, `DELETE_EMOJI`, `ADD_CATEGORY`, `DELETE_CATEGORY`, `MOVE_CATEGORY`.
*   Saves back to Vercel KV.

---

## 4. Styling & Custom Theme Tokens

Tailwind CSS v4 configures custom theme variables inside `@theme` in `src/index.css`:
*   `--color-brand-orange`: `#f95d12` (Main UCT Prague corporate orange)
*   `--color-brand-orange-text`: `#c2410c` (Dark orange for readability)
*   `--color-brand-peach`: `#ffedd5` (Warm cream color)
*   `--color-brand-espresso`: `#0f0906` (Primary dark background base)
*   `--color-brand-roast`: `#1c0d06` (Secondary dark card base)
*   `--color-brand-mocha`: `#3d1f0d` (Glow accent color)
*   `--color-brand-latte`: `#7c3f1e` (Warm brown highlight color)

---

## 5. Development & Deployment Workflow

### Local Development
1.  Install packages:
    ```bash
    npm install
    ```
2.  Start Vite local server:
    ```bash
    npm run dev
    ```
3.  Access the web at `http://localhost:5173`.
4.  *Optional Database Integration:* To test KV locally, create a `.env` in the root folder with Vercel KV connection strings (`KV_REST_API_URL` and `KV_REST_API_TOKEN`). Otherwise, the app falls back to local data imports.

### Adding New Wiki Content
1.  Create a `.md` file inside `/src/features/bioinformatics/content/`.
2.  Sort it under specific folders to structure the sidebar (e.g. `/content/pa1/prednasky/01-uvod.md`).
3.  Ensure the first line starts with `# Article Title` (used as the menu label).

### Building for Production
Run the build script:
```bash
npm run build
```
This generates a single `index.html` file in `dist/` containing all CSS/JS inline, which can be deployed to any static host.

### Vercel Deployment
*   Main branch changes automatically trigger a Vercel production deployment.
*   `vercel.json` ensures all route requests fallback to `index.html` for client-side routing.

---

**Contact / Support:** [kolarv@vscht.cz](mailto:kolarv@vscht.cz)
