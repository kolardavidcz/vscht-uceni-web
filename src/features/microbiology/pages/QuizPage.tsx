import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  CheckCheck,
  ChevronsDownUp,
  ChevronsUpDown,
  FileDown,
  RotateCcw,
  Search,
  Settings,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { EmojiPalette } from "../components/EmojiPalette";
import { WorksheetRow } from "../components/WorksheetRow";
import type { MicrobiologyData } from "../hooks/useMicrobiologyData";
import { useQuizState } from "../hooks/useQuizState";
import {
  filterWorksheetTree,
  getQuizScoreBreakdown,
} from "../lib/scoring";

type Props = {
  data: MicrobiologyData;
};

export function QuizPage({ data }: Props) {
  const {
    worksheetData,
    emojiOptions,
    emojiCategories,
    isLocalMode,
    storageLabel,
  } = data;

  const quiz = useQuizState(emojiOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [phylumFilter, setPhylumFilter] = useState("Vše");
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  const [expandCommand, setExpandCommand] = useState<{
    open: boolean;
    seq: number;
  } | null>(null);

  useEffect(() => {
    document.title = "Systematika bakterií - VŠCHT Učení";
  }, []);

  const availablePhyla = useMemo(() => {
    const names = worksheetData
      .filter((i) => i.type === "Kmen" && i.name)
      .map((i) => i.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "cs"));
  }, [worksheetData]);

  const stats = useMemo(
    () => getQuizScoreBreakdown(worksheetData, quiz.selectedEmojis),
    [worksheetData, quiz.selectedEmojis]
  );

  const visibleTree = useMemo(
    () =>
      filterWorksheetTree(worksheetData, {
        query: searchQuery,
        phylum: phylumFilter,
        onlyMistakes: onlyMistakes && quiz.showResults,
        selected: quiz.selectedEmojis,
      }),
    [
      worksheetData,
      searchQuery,
      phylumFilter,
      onlyMistakes,
      quiz.showResults,
      quiz.selectedEmojis,
    ]
  );

  const activeSelected =
    (quiz.activeFieldId && quiz.selectedEmojis[quiz.activeFieldId]) || [];

  const pinnedActive = Boolean(quiz.activeFieldId && quiz.isPalettePinned);

  const handleReset = () => {
    quiz.resetAll();
    setOnlyMistakes(false);
  };

  return (
    <PageShell
      title="📋 Pracovní list: Systematika bakterií"
      subtitle="Doplň správné emoji vlastnosti k jednotlivým taxonům"
      theme="light"
      actions={
        <div className="flex items-center gap-2.5">
          <Link to="/mikrobiologie/studijni-strom">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-text text-white text-sm font-black shadow-lg shadow-brand-orange/25 border border-orange-400/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <BookOpen size={20} strokeWidth={2.25} className="shrink-0" />
              <span className="hidden sm:inline tracking-wide">Studovat</span>
            </button>
          </Link>
          <Link
            to="/mikrobiologie/admin"
            title="Admin - úprava správných odpovědí"
            className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-white/30 transition-all"
          >
            <Settings size={22} strokeWidth={2} />
          </Link>
        </div>
      }
    >
      <div
        className={
          pinnedActive ? "pb-[280px] sm:pb-[340px] lg:pb-8" : "pb-8"
        }
      >
        {/* Action bar */}
        <Card className="p-4 mb-5 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 text-sm text-stone-700">
              <div className="p-2 bg-orange-50 rounded-xl text-brand-orange border border-orange-100">
                <FileDown size={18} />
              </div>
              <div>
                <span className="font-bold tracking-wide text-xs uppercase text-stone-500">
                  Vyplňovací tabulka
                </span>
                {isLocalMode && (
                  <p className="text-[10px] text-brand-orange-text font-semibold">
                    {storageLabel}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1" />
            <Button onClick={quiz.checkAnswers} disabled={stats.answered === 0}>
              <CheckCheck size={16} />
              Zkontrolovat
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={stats.answered === 0 && !quiz.showResults}
            >
              <RotateCcw size={16} />
              Reset
            </Button>
          </div>

          {/* Search, phylum filter, expand/collapse & mistakes-only toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200/60">
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Najít taxon v listu…"
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-none focus:border-brand-orange"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Vymazat hledání"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <select
              value={phylumFilter}
              onChange={(e) => setPhylumFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 cursor-pointer"
            >
              <option value="Vše">Všechny kmeny</option>
              {availablePhyla.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setExpandCommand((prev) => ({
                  open: true,
                  seq: (prev?.seq ?? 0) + 1,
                }))
              }
              title="Rozbalit vše"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-[11px] font-bold cursor-pointer"
            >
              <ChevronsUpDown size={13} />
              <span className="hidden sm:inline">Rozbalit</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setExpandCommand((prev) => ({
                  open: false,
                  seq: (prev?.seq ?? 0) + 1,
                }))
              }
              title="Zabalit vše"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-[11px] font-bold cursor-pointer"
            >
              <ChevronsDownUp size={13} />
              <span className="hidden sm:inline">Zabalit</span>
            </button>
            {quiz.showResults && stats.correct < stats.total && (
              <button
                type="button"
                onClick={() => setOnlyMistakes((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer",
                  onlyMistakes
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                )}
              >
                <AlertCircle size={13} />
                Jen chyby ({stats.total - stats.correct})
              </button>
            )}
          </div>
        </Card>

        <div className="mb-6">
          <ProgressBar
            value={stats.answered}
            max={stats.total}
            label="Vyplněno"
          />
          {quiz.showResults && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge tone="success">
                ✓ {stats.correct} / {stats.total} správně
              </Badge>
              {stats.partial > 0 && (
                <Badge tone="amber">≈ {stats.partial} částečně</Badge>
              )}
              {stats.wrong > 0 && (
                <Badge tone="danger">✕ {stats.wrong} špatně</Badge>
              )}
              {stats.total - stats.answered > 0 && (
                <Badge tone="stone">
                  {stats.total - stats.answered} nevyplněno
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 w-full bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200 p-4 sm:p-6">
            {visibleTree.length > 0 ? (
              visibleTree.map((item) => (
                <WorksheetRow
                  key={item.id}
                  item={item}
                  selectedEmojis={quiz.selectedEmojis}
                  activeFieldId={quiz.activeFieldId}
                  showResults={quiz.showResults}
                  isPalettePinned={quiz.isPalettePinned}
                  emojiOptions={emojiOptions}
                  emojiCategories={emojiCategories}
                  onActivate={quiz.activate}
                  onSelectEmoji={quiz.selectEmoji}
                  onRemoveEmoji={quiz.removeEmoji}
                  onClearField={quiz.clearField}
                  onClosePalette={quiz.closePalette}
                  onTogglePin={quiz.togglePin}
                  expandCommand={expandCommand}
                />
              ))
            ) : (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm font-bold text-stone-700">
                  {onlyMistakes && quiz.showResults
                    ? "Všechno máš správně!"
                    : "Žádný taxon neodpovídá filtru."}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setPhylumFilter("Vše");
                    setOnlyMistakes(false);
                  }}
                >
                  Zobrazit vše
                </Button>
              </div>
            )}
          </div>

          {/* Desktop sticky sidebar when pinned */}
          {pinnedActive && (
            <aside
              className="hidden lg:block lg:w-[380px] xl:w-[420px] lg:sticky lg:top-[7.5rem] shrink-0 h-[calc(100vh-10rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white shadow-2xl shadow-stone-300/50 rounded-2xl border border-stone-200 p-4 h-full flex flex-col min-h-0">
                <EmojiPalette
                  emojiOptions={emojiOptions}
                  categories={emojiCategories}
                  currentEmojis={activeSelected}
                  onSelect={(emoji) =>
                    quiz.selectEmoji(quiz.activeFieldId!, emoji)
                  }
                  onRemove={(emoji) =>
                    quiz.removeEmoji(quiz.activeFieldId!, emoji)
                  }
                  onClearAll={() => quiz.clearField(quiz.activeFieldId!)}
                  onClose={quiz.closePalette}
                  isPinned
                  onTogglePin={quiz.togglePin}
                  activeItemId={quiz.activeFieldId}
                />
              </div>
            </aside>
          )}
        </div>

        {/* Mobile bottom sheet - half-ish viewport, pin + X in palette header */}
        {pinnedActive && (
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-[0_-12px_42px_rgba(0,0,0,0.1)] rounded-t-3xl p-4 sm:p-5 max-h-[48vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto w-full min-h-0 flex-1 flex flex-col">
              <EmojiPalette
                emojiOptions={emojiOptions}
                categories={emojiCategories}
                currentEmojis={activeSelected}
                onSelect={(emoji) =>
                  quiz.selectEmoji(quiz.activeFieldId!, emoji)
                }
                onRemove={(emoji) =>
                  quiz.removeEmoji(quiz.activeFieldId!, emoji)
                }
                onClearAll={() => quiz.clearField(quiz.activeFieldId!)}
                onClose={quiz.closePalette}
                isPinned
                onTogglePin={quiz.togglePin}
                activeItemId={quiz.activeFieldId}
                className="min-h-0 flex-1"
              />
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
