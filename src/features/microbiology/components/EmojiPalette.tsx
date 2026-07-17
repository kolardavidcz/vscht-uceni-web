import { useEffect, useMemo, useRef } from "react";
import { Pin, Trash2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { EmojiCategory, EmojiOption } from "../types";

type Props = {
  emojiOptions: EmojiOption[];
  categories: EmojiCategory[];
  currentEmojis: string[];
  onSelect: (emoji: string) => void;
  onRemove: (emoji: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  activeItemId?: string | null;
  className?: string;
};

export function EmojiPalette({
  emojiOptions,
  categories,
  currentEmojis,
  onSelect,
  onRemove,
  onClearAll,
  onClose,
  isPinned = false,
  onTogglePin,
  activeItemId,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const byCategory = useMemo(() => {
    const map = new Map<string, EmojiOption[]>();
    for (const opt of emojiOptions) {
      if (!map.has(opt.category)) map.set(opt.category, []);
      map.get(opt.category)!.push(opt);
    }
    return map;
  }, [emojiOptions]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [activeItemId]);

  // Desktop pinned: compact 2-col list; floating / mobile: denser multi-col grid
  const gridCols = isPinned
    ? "grid-cols-1 xl:grid-cols-2 gap-1.5"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2";

  return (
    <div
      className={cn(
        "w-full flex flex-col min-h-0 transition-all",
        isPinned
          ? "bg-transparent p-0 h-full"
          : "bg-white shadow-2xl rounded-2xl border border-stone-200/90 p-4 sm:p-5",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header + quick tip */}
      <div
        className={cn(
          "flex-shrink-0 flex items-center gap-2 mb-2.5",
          isPinned
            ? "pb-2 border-b border-stone-200/80"
            : "pb-2 border-b border-stone-100"
        )}
      >
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-black tracking-tight text-stone-800 leading-none",
              isPinned ? "text-sm" : "text-xs"
            )}
          >
            Vlastnosti
          </p>
          <p className="text-[10px] text-stone-400 font-medium mt-0.5 truncate">
            {currentEmojis.length > 0
              ? `${currentEmojis.length} vybráno · kliknutím přidáš nebo odebereš`
              : "Kliknutím přidáš nebo odebereš"}
          </p>
        </div>
        {onTogglePin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer shrink-0",
              isPinned
                ? "px-2.5 py-1.5 bg-brand-orange text-white border-brand-orange shadow-sm shadow-brand-orange/20"
                : "p-1.5 bg-stone-50 text-stone-500 border-stone-200 hover:border-brand-orange/40 hover:text-brand-orange"
            )}
            title={
              isPinned
                ? "Odepnout panel"
                : "Připnout (PC: vpravo · mobil: dole)"
            }
          >
            <Pin size={13} className={isPinned ? "fill-white" : ""} />
            {isPinned && <span className="hidden xl:inline">Připnuto</span>}
          </button>
        )}

        {currentEmojis.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="p-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
            title="Smazat vše z tohoto pole"
          >
            <Trash2 size={13} />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-50 cursor-pointer shrink-0"
          title="Zavřít"
        >
          <X size={14} />
        </button>
      </div>

      {/* Selected strip on desktop pin — quick overview */}
      {isPinned && currentEmojis.length > 0 && (
        <div className="flex-shrink-0 flex flex-wrap gap-1 mb-3 p-2 rounded-xl bg-orange-50/80 border border-orange-100/80">
          {currentEmojis.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onRemove(e)}
              className="relative group text-lg leading-none px-1.5 py-0.5 bg-white border border-orange-100 rounded-lg hover:border-rose-300 cursor-pointer"
              title="Odebrat"
            >
              {e}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "pr-1 overscroll-contain overflow-y-auto min-h-0 space-y-4",
          isPinned
            ? "flex-1 max-h-none"
            : "max-h-[36vh] sm:max-h-[42vh]"
        )}
      >
        {categories.map((cat) => {
          const items = byCategory.get(cat.key) || [];
          if (items.length === 0) return null;
          return (
            <section key={cat.key}>
              <h4
                className={cn(
                  "font-black text-stone-400 uppercase tracking-wider mb-1.5 sticky top-0 bg-white/95 backdrop-blur-sm py-1 z-[1]",
                  isPinned ? "text-[9px]" : "text-[10px]"
                )}
              >
                {cat.label}
              </h4>
              <div className={cn("grid", gridCols)}>
                {items.map((opt) => {
                  const isSelected = currentEmojis.includes(opt.emoji);
                  return (
                    <button
                      key={opt.emoji + opt.label}
                      type="button"
                      onClick={() =>
                        isSelected ? onRemove(opt.emoji) : onSelect(opt.emoji)
                      }
                      className={cn(
                        "group flex items-center gap-2 rounded-xl transition-all text-left cursor-pointer border",
                        isPinned ? "p-2" : "p-2 sm:p-2.5",
                        isSelected
                          ? "bg-brand-orange/10 border-brand-orange/35 shadow-sm ring-1 ring-brand-orange/10"
                          : "bg-stone-50/70 border-transparent hover:bg-white hover:border-stone-200 hover:shadow-sm"
                      )}
                      title={opt.label}
                    >
                      <span
                        className={cn(
                          "shrink-0 select-none leading-none group-hover:scale-110 transition-transform",
                          isPinned ? "text-lg" : "text-xl"
                        )}
                      >
                        {opt.emoji}
                      </span>
                      <span
                        className={cn(
                          "font-bold flex-1 leading-snug line-clamp-2",
                          isPinned ? "text-[10px]" : "text-[11px]",
                          isSelected
                            ? "text-brand-orange-text"
                            : "text-stone-600"
                        )}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
