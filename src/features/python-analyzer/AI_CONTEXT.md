# 🐍 Python Analyzer Module Context

You are working on the **Python Analyzátor** feature of the VSCHT Učení web app. This is a **standalone, self-contained feature** — it has NO connection to the Bioinformatics Wiki or any other feature module.

## What This Feature Does
A single-page tool that displays a Python script for DNA/RNA bioinformatic analysis. Users can:
1. **Read** the annotated Python source code in a styled code viewer
2. **Copy** the script to clipboard with one click
3. **"Run"** a mock execution that shows simulated terminal output (the script does NOT actually execute in the browser)

## File Map
```
src/features/python-analyzer/
├── AI_CONTEXT.md           ← You are here
└── components/
    └── PythonAnalyzer.tsx  ← The entire feature (single self-contained component)
```

### PythonAnalyzer.tsx (185 lines)
- **Imports**: `react`, `react-router-dom`, `lucide-react` icons. NO shared UI components used — fully standalone.
- **State**: `copied` (clipboard feedback), `executing` / `execDone` (mock execution animation)
- **`pythonScript`**: Hardcoded Python 3 source string (~57 lines). Analyzes DNA sequences: nucleotide frequency, GC content, RNA transcription, protein translation via codon table.
- **`mockOutput`**: Pre-computed terminal output matching the script's test case (`ATGCGATCGATC...`).
- **UI structure**:
  - Dark full-page layout (`bg: #0f0906`) with orange ambient glows
  - `page-header-dark` sticky header with back-navigation to `/`
  - Action bar: "Copy" button + "Run" button (triggers 1.2s animation → shows mock output)
  - Terminal output panel: macOS-style dot header, monospace output
  - Code viewer panel: macOS-style dot header, monospace Python source

## Routing
- **Single route**: `/python-analyza` → `<PythonAnalyzer />`
- **Back button** navigates to `/` (Home)
- Defined in `src/App.tsx` line 23

## Styling Rules
- **Theme**: DARK — `#0f0906` espresso background, amber/orange text on dark
- **Accent color**: `brand-orange` (`#f95d12`) — the ONLY allowed accent. NO BLUE.
- **Header**: `page-header-dark` class (transparent espresso, sticky)
- **Buttons**: dark slate bg with brand-orange primary CTA
- **Terminal**: `bg-slate-950/70` with emerald status indicators

## Important Notes
- This component is **100% static** — no API calls, no data fetching, no external dependencies beyond React and Lucide icons.
- The Python script is embedded as a template literal string. To update the script content, edit the `pythonScript` const directly.
- The "Run" button does NOT execute real Python. It shows `mockOutput` after a 1.2-second delay. If you add real execution, you would need a backend endpoint.
- This feature was previously located inside `src/features/bioinformatics/components/` but has been extracted into its own feature folder because it is completely independent.
