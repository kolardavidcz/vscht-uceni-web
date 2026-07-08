# 🦠 Microbiology Module Context

You are working on the Microbiology ("Systematika bakterií") department of the VSCHT Učení web app.

## Architecture Overview
The microbiology feature is an interactive emoji-based quiz for bacterial taxonomy. Students fill in emoji answers (e.g. 🔴 = Gram-negative, 🌭 = Rod-shaped) for each taxon, then check their answers against hidden correct answers.

## File Map
- **`components/AdminPanel.tsx`**: Password-protected admin (pw: `bavi_nas_mikrobiologie`). Two tabs: edit correct emoji answers per taxon; manage emoji options/categories. Saves via API POST or localStorage fallback.
- **`components/EmojiPalette.tsx`**: Categorized emoji picker. Supports floating (per-item) and pinned (sidebar) modes.
- **`components/StudyPage.tsx`**: Largest component (1179 lines). Three tabs: "tree" (taxonomy browser with CellMorphology simulator), "flashcards" (spaced-repetition self-study), "matrix" (comparison matrix view).
- **`components/WorksheetItem.tsx`**: Single taxonomy row with expand/collapse, emoji answer field, inline EmojiPalette, result scoring (✅/❌), hints. Recursively renders children.
- **`data/emojis.ts`**: 46 EmojiOption objects in 7 categories, plus helper functions: `sortEmojis()`, `generateHint()`, `enrichWorksheetData()`.
- **`data/zastupci.ts`**: Full taxonomy tree (895 lines). Hierarchical `WorksheetItem[]` with sections A-E, phyla, classes, families, genera, species.
- **`hooks/useMicrobiologyData.ts`**: Initializes data from static imports → tries `/api/get-data` fetch → falls back to localStorage.
- **`hooks/useQuizState.ts`**: Quiz interaction state: `selectedEmojis`, `activeItemId`, `showResults`, `isPalettePinned`.
- **`pages/QuizPage.tsx`**: Main quiz page. Dark header with gradient, progress bar (answered/total), action bar (check/reset), instruction banner.
- **`utils/scoring.ts`**: Three recursive scoring functions: `countTotal`, `countAnswered`, `countCorrect`. Uses bidirectional set equality for correctness.

## Core Data Model
```ts
type WorksheetItem = {
  id: string; name: string; type?: string; description?: string;
  correctEmojis: string[];   // hidden answers
  hint?: string;             // auto-generated from correctEmojis labels
  children?: WorksheetItem[]; // recursive tree
  checked?: boolean;
  groups?: { id: string; label: string; correctEmojis: string[]; }[];
};

type EmojiOption = {
  emoji: string;    // e.g. "🔴"
  label: string;    // e.g. "Gram-negativní (G-)"
  category: string; // e.g. "Buněčná stěna"
};
```

## Routing (App.tsx)
- `/mikrobiologie` → `QuizPage`
- `/mikrobiologie/studijni-strom` → `StudyPage` (activeTab="tree")
- `/mikrobiologie/samostudium` → `StudyPage` (activeTab="flashcards")
- `/mikrobiologie/srovnavaci-matice` → `StudyPage` (activeTab="matrix")
- `/mikrobiologie/admin` → `AdminPanel`

## Styling Rules
- **Theme**: LIGHT with a dark header accent.
- **Background**: `bg-stone-50` (warm light gray), cards are `bg-white`.
- **Header**: dark brown gradient (`#1a0f0a`) with orange/amber text gradient.
- **Accent color**: `brand-orange` (`#f95d12`) — the ONLY allowed accent color. NO BLUE ANYWHERE.
- **Rank color coding**: Kmen→orange, Třída→amber, Čeleď→yellow, Rod→deep-orange, Zástupce→rose.
