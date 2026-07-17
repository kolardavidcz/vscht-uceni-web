import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCheck,
  FileDown,
  RotateCcw,
  Settings,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { EmojiPalette } from "../components/EmojiPalette";
import { WorksheetRow } from "../components/WorksheetRow";
import type { MicrobiologyData } from "../hooks/useMicrobiologyData";
import { useQuizState } from "../hooks/useQuizState";
import { countAnswered, countCorrect, countTotal } from "../lib/scoring";

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

  useEffect(() => {
    document.title = "Systematika bakterií — VŠCHT Učení";
  }, []);

  const total = countTotal(worksheetData);
  const answered = countAnswered(worksheetData, quiz.selectedEmojis);
  const correct = quiz.showResults
    ? countCorrect(worksheetData, quiz.selectedEmojis)
    : 0;

  const activeSelected =
    (quiz.activeFieldId && quiz.selectedEmojis[quiz.activeFieldId]) || [];

  const pinnedActive = Boolean(quiz.activeFieldId && quiz.isPalettePinned);

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
            title="Admin — úprava správných odpovědí"
            className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-white/30 transition-all"
          >
            <Settings size={22} strokeWidth={2} />
          </Link>
        </div>
      }
    >
      <div
        className={
          pinnedActive
            ? "pb-[280px] sm:pb-[340px] lg:pb-8"
            : "pb-8"
        }
      >
        {/* Action bar */}
        <Card className="p-4 mb-6 flex flex-wrap items-center gap-3">
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
          <Button onClick={quiz.checkAnswers} disabled={answered === 0}>
            <CheckCheck size={16} />
            Zkontrolovat
          </Button>
          <Button variant="secondary" onClick={quiz.resetAll}>
            <RotateCcw size={16} />
            Reset
          </Button>
        </Card>

        <div className="mb-6">
          <ProgressBar
            value={answered}
            max={total}
            label="Vyplněno"
          />
          {quiz.showResults && (
            <div className="mt-2">
              <Badge tone="success">
                ✅ {correct} / {total} správně
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 w-full bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200 p-4 sm:p-6">
            {worksheetData.map((item) => (
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
              />
            ))}
          </div>

          {/* Desktop sticky sidebar when pinned */}
          {/* Desktop sticky sidebar — old widths ~380–420px, full viewport height */}
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

        {/* Mobile bottom sheet — half-ish viewport, pin + X in palette header */}
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
