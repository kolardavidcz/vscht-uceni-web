import { useState } from "react";
import {
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { setsEqual } from "../lib/scoring";
import type { EmojiCategory, EmojiOption, WorksheetItem } from "../types";
import { EmojiPalette } from "./EmojiPalette";

type Props = {
  item: WorksheetItem;
  depth?: number;
  selectedEmojis: Record<string, string[]>;
  activeFieldId: string | null;
  showResults: boolean;
  isPalettePinned: boolean;
  emojiOptions: EmojiOption[];
  emojiCategories: EmojiCategory[];
  onActivate: (fieldId: string) => void;
  onSelectEmoji: (fieldId: string, emoji: string) => void;
  onRemoveEmoji: (fieldId: string, emoji: string) => void;
  onClearField: (fieldId: string) => void;
  onClosePalette: () => void;
  onTogglePin: () => void;
};

const rankTone: Record<string, "orange" | "amber" | "stone" | "danger"> = {
  Kmen: "orange",
  Třída: "amber",
  Čeleď: "stone",
  Rod: "orange",
  Zástupce: "danger",
};

function AnswerField({
  fieldId,
  label,
  correct,
  selected,
  active,
  showResults,
  isPalettePinned,
  emojiOptions,
  emojiCategories,
  onActivate,
  onSelectEmoji,
  onRemoveEmoji,
  onClearField,
  onClosePalette,
  onTogglePin,
  activeFieldId,
}: {
  fieldId: string;
  label?: string;
  correct: string[];
  selected: string[];
  active: boolean;
  showResults: boolean;
  isPalettePinned: boolean;
  emojiOptions: EmojiOption[];
  emojiCategories: EmojiCategory[];
  onActivate: (id: string) => void;
  onSelectEmoji: (id: string, e: string) => void;
  onRemoveEmoji: (id: string, e: string) => void;
  onClearField: (id: string) => void;
  onClosePalette: () => void;
  onTogglePin: () => void;
  activeFieldId: string | null;
}) {
  const isCorrect = showResults && setsEqual(selected, correct);
  const isWrong =
    showResults && correct.length > 0 && !setsEqual(selected, correct);
  const missing =
    showResults && correct.length > 0
      ? correct.filter((e) => !selected.includes(e))
      : [];
  const extras =
    showResults && correct.length > 0
      ? selected.filter((e) => !correct.includes(e))
      : [];

  // Group selected by category for separators (old UX)
  const grouped: { key: string; emojis: string[] }[] = [];
  for (const cat of emojiCategories) {
    const catEmojis = selected.filter(
      (e) => emojiOptions.find((o) => o.emoji === e)?.category === cat.key
    );
    if (catEmojis.length) grouped.push({ key: cat.key, emojis: catEmojis });
  }
  const uncategorized = selected.filter(
    (e) => !emojiOptions.find((o) => o.emoji === e)
  );
  if (uncategorized.length) {
    grouped.push({ key: "_other", emojis: uncategorized });
  }

  return (
    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
      {label && (
        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
          {label}
        </div>
      )}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onActivate(fieldId)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onActivate(fieldId);
        }}
        className={cn(
          "w-full text-left min-h-[2.5rem] rounded-xl border-2 px-2.5 py-1.5 transition-all cursor-pointer",
          active
            ? "border-brand-orange bg-white ring-4 ring-brand-orange/15 shadow-md"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm",
          isCorrect && "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10",
          isWrong && "border-rose-400 bg-rose-50/30 ring-4 ring-rose-500/10"
        )}
      >
        <div className="flex items-center gap-1.5 flex-wrap min-h-[1.75rem]">
          {selected.length === 0 ? (
            <span className="text-[11px] text-stone-400 font-semibold flex items-center gap-1.5 select-none">
              <HelpCircle size={14} />
              Klikni a vyber…
            </span>
          ) : (
            grouped.map((group, gi) => (
              <div key={group.key} className="flex items-center gap-1.5">
                {group.emojis.map((emoji) => {
                  const isExtra = extras.includes(emoji);
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveEmoji(fieldId, emoji);
                      }}
                      className={cn(
                        "relative text-xl p-0.5 bg-white border border-stone-100 rounded-lg shadow-xs transition-all hover:scale-110 active:scale-95 cursor-pointer group",
                        isExtra && "opacity-40"
                      )}
                      title="Klikni pro odebrání"
                    >
                      <span className="select-none">{emoji}</span>
                      {/* Hover X badge on each emoji chip */}
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-md border border-white transition-opacity">
                        ×
                      </span>
                    </button>
                  );
                })}
                {gi < grouped.length - 1 && (
                  <div className="h-5 w-0.5 bg-stone-200 mx-0.5 rounded-full" />
                )}
              </div>
            ))
          )}
          {showResults && isCorrect && (
            <Check size={16} className="text-emerald-600 ml-auto" />
          )}
          {showResults && isWrong && (
            <X size={16} className="text-rose-600 ml-auto" />
          )}
        </div>

        {showResults && missing.length > 0 && (
          <div className="w-full mt-1.5 pt-1.5 border-t border-rose-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-rose-500 font-bold">⚠️ Chybí:</span>
            <span className="text-lg flex flex-wrap gap-1">
              {missing.map((e) => (
                <span key={e}>{e}</span>
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Floating palette under the active field (when not pinned) */}
      {active && !isPalettePinned && (
        <div className="mt-2 relative z-40">
          <EmojiPalette
            emojiOptions={emojiOptions}
            categories={emojiCategories}
            currentEmojis={selected}
            onSelect={(e) => onSelectEmoji(fieldId, e)}
            onRemove={(e) => onRemoveEmoji(fieldId, e)}
            onClearAll={() => onClearField(fieldId)}
            onClose={onClosePalette}
            isPinned={false}
            onTogglePin={onTogglePin}
            activeItemId={activeFieldId}
          />
        </div>
      )}
    </div>
  );
}

export function WorksheetRow({
  item,
  depth = 0,
  selectedEmojis,
  activeFieldId,
  showResults,
  isPalettePinned,
  emojiOptions,
  emojiCategories,
  onActivate,
  onSelectEmoji,
  onRemoveEmoji,
  onClearField,
  onClosePalette,
  onTogglePin,
}: Props) {
  // Expand Kmen → Třída → Čeleď → Rod by default; only Zástupce/deep leaves start collapsed
  const [open, setOpen] = useState(() => {
    if (!item.children?.length) return false;
    const t = item.type;
    if (t === "Zástupce") return false;
    // Expand ranks through Rod, and unnamed section headers at shallow depth
    return (
      t === "Kmen" ||
      t === "Třída" ||
      t === "Čeleď" ||
      t === "Rod" ||
      depth < 3
    );
  });
  const hasChildren = Boolean(item.children?.length);
  const hasAnswerSlots =
    (item.groups && item.groups.length > 0) ||
    (item.correctEmojis && item.correctEmojis.length > 0);

  const fieldActive =
    activeFieldId === item.id ||
    activeFieldId?.startsWith(`${item.id}_`) ||
    false;

  let rowStatus: "ok" | "bad" | null = null;
  if (showResults && hasAnswerSlots) {
    if (item.groups?.length) {
      const allOk = item.groups.every((g) =>
        setsEqual(selectedEmojis[`${item.id}_${g.id}`] || [], g.correctEmojis || [])
      );
      rowStatus = allOk ? "ok" : "bad";
    } else if (item.correctEmojis?.length) {
      rowStatus = setsEqual(selectedEmojis[item.id] || [], item.correctEmojis)
        ? "ok"
        : "bad";
    }
  }

  return (
    <div
      className={cn(
        depth > 0 && "ml-3 sm:ml-5 border-l border-stone-200 pl-3 sm:pl-4"
      )}
    >
      <div
        className={cn(
          "relative rounded-2xl border-2 p-3 sm:p-4 shadow-sm mb-2 transition-all",
          fieldActive
            ? "border-brand-orange/50 ring-2 ring-brand-orange/20 bg-white z-20"
            : "border-stone-200/80 bg-white/90 z-10",
          rowStatus === "ok" && "bg-emerald-50/40 border-emerald-200",
          rowStatus === "bad" && "bg-rose-50/30 border-rose-200"
        )}
      >
        <div className="flex items-start gap-2">
          {hasChildren ? (
            <button
              type="button"
              className="mt-0.5 p-1 rounded-md hover:bg-stone-100 text-stone-500 cursor-pointer"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-6 mt-1 flex justify-center">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full border-2",
                  hasAnswerSlots
                    ? "border-brand-orange/60 bg-brand-orange/15"
                    : "border-stone-200 bg-stone-100"
                )}
              />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {rowStatus === "ok" && (
                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              )}
              {rowStatus === "bad" && (
                <XCircle size={18} className="text-rose-500 shrink-0" />
              )}
              {item.type && (
                <Badge tone={rankTone[item.type] || "stone"}>{item.type}</Badge>
              )}
              <h3
                className={cn(
                  "font-display font-bold text-stone-900",
                  depth === 0 ? "text-base sm:text-lg" : "text-sm sm:text-base"
                )}
              >
                {item.name}
              </h3>
            </div>

            {item.description && (
              <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Nápověda collapsed by default — open on click */}
            {item.hint && !showResults && hasAnswerSlots && (
              <details className="mt-2.5 group">
                <summary className="text-[10px] font-black uppercase tracking-widest text-stone-400 cursor-pointer hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 select-none list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/70 group-open:bg-brand-orange" />
                  <span>💡 Nápověda</span>
                </summary>
                <div className="text-xs text-stone-600 mt-1.5 italic pl-4 py-2 border-l-2 border-brand-orange bg-orange-50/30 rounded-r-xl leading-relaxed">
                  {item.hint}
                </div>
              </details>
            )}

            {hasAnswerSlots &&
              (item.groups && item.groups.length > 0
                ? item.groups.map((g) => {
                    const fieldId = `${item.id}_${g.id}`;
                    return (
                      <AnswerField
                        key={fieldId}
                        fieldId={fieldId}
                        label={g.label}
                        correct={g.correctEmojis || []}
                        selected={selectedEmojis[fieldId] || []}
                        active={activeFieldId === fieldId}
                        showResults={showResults}
                        isPalettePinned={isPalettePinned}
                        emojiOptions={emojiOptions}
                        emojiCategories={emojiCategories}
                        onActivate={onActivate}
                        onSelectEmoji={onSelectEmoji}
                        onRemoveEmoji={onRemoveEmoji}
                        onClearField={onClearField}
                        onClosePalette={onClosePalette}
                        onTogglePin={onTogglePin}
                        activeFieldId={activeFieldId}
                      />
                    );
                  })
                : (
                    <AnswerField
                      fieldId={item.id}
                      correct={item.correctEmojis || []}
                      selected={selectedEmojis[item.id] || []}
                      active={activeFieldId === item.id}
                      showResults={showResults}
                      isPalettePinned={isPalettePinned}
                      emojiOptions={emojiOptions}
                      emojiCategories={emojiCategories}
                      onActivate={onActivate}
                      onSelectEmoji={onSelectEmoji}
                      onRemoveEmoji={onRemoveEmoji}
                      onClearField={onClearField}
                      onClosePalette={onClosePalette}
                      onTogglePin={onTogglePin}
                      activeFieldId={activeFieldId}
                    />
                  ))}
          </div>
        </div>
      </div>

      {open &&
        item.children?.map((child) => (
          <WorksheetRow
            key={child.id}
            item={child}
            depth={depth + 1}
            selectedEmojis={selectedEmojis}
            activeFieldId={activeFieldId}
            showResults={showResults}
            isPalettePinned={isPalettePinned}
            emojiOptions={emojiOptions}
            emojiCategories={emojiCategories}
            onActivate={onActivate}
            onSelectEmoji={onSelectEmoji}
            onRemoveEmoji={onRemoveEmoji}
            onClearField={onClearField}
            onClosePalette={onClosePalette}
            onTogglePin={onTogglePin}
          />
        ))}
    </div>
  );
}
