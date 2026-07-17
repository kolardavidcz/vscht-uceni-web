# 🧬 Bioinformatics Wiki Module Context

You are working on the **Bioinformatics Wiki** ("Obor: Bioinformatika a chemická informatika") of the VSCHT Učení web app. This is a **Markdown-powered study hub** — completely separate from the Microbiology quiz and the Python Analyzer tool.

## What This Feature Does
A sidebar-navigated wiki that dynamically loads `.md` files at build time, parses them through a custom regex-based markdown renderer, and organizes them by semester and course. Students browse lecture notes, cheat sheets, and study materials.

## File Map
```
src/features/bioinformatics/
├── AI_CONTEXT.md                    ← You are here
├── components/
│   ├── BioinformaticsDashboard.tsx  ← Main wiki page (sidebar + content viewer, 502 lines)
│   └── PA2ToAG1Overview.tsx        ← Custom interactive C++ curriculum matrix (547 lines)
├── content/
│   ├── config.json                 ← Category ordering, labels, custom titles
│   ├── 0-obecne/                   ← General study materials
│   ├── 1-semestr/                  ← First semester course notes
│   ├── 2-semestr/                  ← Second semester course notes
│   ├── 3-semestr/                  ← Third semester course notes
│   └── ag1/                        ← AG1 (Algorithms) specific materials
├── data/
│   ├── materialsData.ts            ← 50KB dataset for PA2ToAG1Overview matrix
│   └── raw_data/                   ← Raw data files
├── htmlPrototypes/                  ← HTML prototypes
└── utils/
    └── markdownParser.ts           ← Custom markdown→HTML parser (259 lines, NO library)
```

## Key Components

### BioinformaticsDashboard.tsx
- **Markdown loading**: Uses Vite's `import.meta.glob('/src/features/bioinformatics/content/**/*.md', { query: '?raw', import: 'default', eager: true })` to load ALL `.md` files at build time.
- **Content organization**: Reads `content/config.json` for category ordering, labels, and custom file titles. Groups materials by folder (semester/course), with optional subcategories.
- **Sidebar**: Collapsible folder tree with search. Active item gets `brand-orange` background.
- **Content viewer**: Renders parsed markdown HTML with `dangerouslySetInnerHTML`. Special-cases `pa2-ag1-overview` to render the `PA2ToAG1Overview` React component instead of markdown.
- **Shared UI**: Uses `Card`, `Button`, `Badge` from `src/components/ui/`.

### PA2ToAG1Overview.tsx
- A custom interactive component (NOT markdown content).
- Shows a 12-week C++ curriculum matrix mapping PA2 topics to AG1 prerequisites.
- Uses `materialsData.ts` (50KB tree structure of `SchoolMaterialNode` objects).
- Rendered inline when the user navigates to the `pa2-ag1-overview` material key.

### markdownParser.ts
Custom regex-based pipeline (NO external markdown library):
1. HTML escape → whitelist restore (`<img>`, `<iframe>`, `<video>`, `<table>` elements)
2. Fenced code blocks with C/VBA syntax highlighting
3. Horizontal rules → Blockquote alerts (TIP, IMPORTANT, WARNING) → Headings (h1-h6)
4. Markdown links → Inline code → Markdown tables (with hover effects)
5. Nested list support → Bold/Italic → Paragraph wrapping

## Content Authoring Guide
To add new wiki content:
1. Create a `.md` file under the appropriate `content/` subfolder (e.g. `content/1-semestr/my-notes.md`)
2. Start the file with a `# H1 Heading` — this becomes the title in the sidebar
3. (Optional) Add an entry in `content/config.json` for custom title override and sort order
4. The file is **automatically discovered** by Vite's glob import — no registration needed

## Routing
All routes render the same `BioinformaticsDashboard` which reads URL params internally:
- `/obor-bioinformatika` → Dashboard landing (shows first material or welcome)
- `/obor-bioinformatika/:materialKey` → Direct material (e.g. top-level files)
- `/obor-bioinformatika/:courseKey/:materialKey` → Course-scoped material
- `/obor-bioinformatika/:courseKey/:subcategoryKey/:materialKey` → Subcategory material

## Styling Rules
- **Theme**: LIGHT — `bg-slate-50` body, `text-slate-800` text, white cards
- **Header**: `page-header` class (dark roast gradient, sticky, orange line on top)
- **Accent color**: `brand-orange` (`#f95d12`) — the ONLY allowed accent. **NO BLUE ANYWHERE.**
- **Cards**: `card-surface` class (glassmorphic white-to-ivory gradient)
- **Sidebar active item**: `bg-brand-orange` with white text
- **Code blocks**: light theme (`bg-slate-50`, `text-slate-800`, `border-slate-200`)
- **Links in markdown**: Styled with `text-brand-orange hover:text-brand-orange-text` to align with the global color system.

