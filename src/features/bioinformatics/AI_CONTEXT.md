# 🧬 Bioinformatics Module Context

You are working on the Bioinformatics Wiki ("Obor: Bioinformatika a chemická informatika") department of the VSCHT Učení web app.

## Architecture Overview
The bioinformatics section is a Markdown-powered wiki/study-hub. It dynamically loads `.md` files at build time via Vite's `import.meta.glob`, renders them through a custom regex-based markdown parser, and organizes them into a sidebar-navigated dashboard grouped by semesters and courses.

## File Map
- **`components/BioinformaticsDashboard.tsx`**: Main wiki dashboard. Sidebar + content viewer. Uses Vite's `import.meta.glob('/src/features/bioinformatics/content/**/*.md', { query: '?raw', import: 'default', eager: true })` to load ALL markdown at build time. Reads `config.json` for ordering, labels, and titles.
- **`components/PA2ToAG1Overview.tsx`**: Custom interactive component (NOT markdown) mapped to `pa2-ag1-overview.md`. Shows a C++ curriculum matrix.
- **`components/PythonAnalyzer.tsx`**: Standalone page (route: `/python-analyza`). Displays a Python script with mock execution in a terminal.
- **`content/config.json`**: Category ordering, labels, file titles. 5 categories (ag1, 0-obecne, 1-semestr, 2-semestr, 3-semestr).
- **`data/materialsData.ts`**: 85KB dataset for the `PA2ToAG1Overview` matrix component.
- **`utils/markdownParser.ts`**: Custom regex-based markdown→HTML parser (NO library dependency). Pipeline: HTML escape → whitelist restore → C/VBA syntax highlighting in fenced blocks → horizontal rules → alerts → headings → links → tables → lists → formatting.

## Content Authoring
To add new content:
1. Create a `.md` file under the appropriate `content/` subfolder.
2. Start the file with a `# H1` heading (used as the title).
3. (Optional) Add an entry in `config.json` for custom title and ordering.
*The file is automatically picked up by Vite's glob import at build time.*

## Routing (App.tsx)
- `/obor-bioinformatika` → `BioinformaticsDashboard`
- `/obor-bioinformatika/:materialKey` → `BioinformaticsDashboard`
- `/obor-bioinformatika/:courseKey/:materialKey` → `BioinformaticsDashboard`
- `/obor-bioinformatika/:courseKey/:subcategoryKey/:materialKey` → `BioinformaticsDashboard`
- `/python-analyza` → `PythonAnalyzer`

*(All wiki routes render the same BioinformaticsDashboard which reads `window.location.pathname` internally.)*

## Styling Rules
- **Theme**: LIGHT (`bg-slate-50`, `text-slate-800`) with dark header.
- **Header**: `page-header` class (dark roast gradient, sticky, orange line on top).
- **Accent color**: `brand-orange` (`#f95d12`) — the ONLY allowed accent. NO BLUE ANYWHERE.
- **Cards**: `card-surface` class (glassmorphic white-to-ivory gradient).
- **Sidebar active item**: brand-orange background with white text.
- **Code blocks**: light theme (`bg-slate-50`, `text-slate-800`).
