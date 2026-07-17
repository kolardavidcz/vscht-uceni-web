import { useMemo, useEffect, useRef } from 'react';
import { X, Trash2, Pin } from 'lucide-react';
import { EmojiOption } from '../../../types';

interface EmojiPaletteProps {
  onSelect: (emoji: string) => void;
  onRemove: (emoji: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  currentEmojis: string[];
  emojiOptions: EmojiOption[];
  emojiCategories: { key: string; label: string }[];
  filterCategory?: string;
  isPinned?: boolean;
  onTogglePin?: () => void;
  activeItemId?: string | null;
}

export function EmojiPalette({ 
  onSelect, 
  onRemove, 
  onClearAll, 
  onClose, 
  currentEmojis,
  emojiOptions,
  emojiCategories,
  filterCategory,
  isPinned = false,
  onTogglePin,
  activeItemId
}: EmojiPaletteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const emojisByCategory = useMemo(() => {
    const map = new Map<string, EmojiOption[]>();
    for (const option of emojiOptions) {
      if (!map.has(option.category)) {
        map.set(option.category, []);
      }
      map.get(option.category)!.push(option);
    }
    return map;
  }, [emojiOptions]);

  const categoriesToRender = useMemo(() => {
    if (filterCategory) {
      return emojiCategories.filter(c => c.key === filterCategory);
    }
    return emojiCategories;
  }, [emojiCategories, filterCategory]);

  // Scroll to top when active taxon/group changes, especially useful for pinned sheets
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeItemId]);

  // If pinned: 2 columns on mobile, 3-4 on tablet, 2 on desktop sidebar.
  // If unpinned: 2 on mobile, 3-4 on tablet, 5 on desktop layout.
  const gridColsClass = isPinned 
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-2.5' 
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5';

  return (
    <div className={`w-full mx-auto transition-all flex flex-col ${
      isPinned 
        ? 'bg-transparent shadow-none border-none p-0 max-w-5xl h-full' 
        : 'bg-white shadow-2xl rounded-2xl border border-slate-200 p-5 max-w-4xl'
    }`}>
      {/* Header with Title and Tip aligned next to each other */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4 pb-2 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-1 h-3.5 bg-indigo-500 rounded-full animate-pulse" />
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Výběr vlastností</h3>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md select-none shrink-0 sm:ml-1.5">
            💡 Tip: Kliknutím zapneš/vypneš
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onTogglePin && (
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
              className={`p-1 rounded-xl transition-all cursor-pointer border ${
                isPinned 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-650 hover:bg-indigo-100' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-650 border-slate-100'
              }`}
              title={isPinned ? "Odepnout panel" : "Připnout panel (Bok / Spodek)"}
            >
              <Pin size={13} className={isPinned ? 'fill-indigo-500 text-indigo-600' : ''} />
            </button>
          )}
          {currentEmojis.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-black text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-100 transition-all cursor-pointer"
            >
              <Trash2 size={11} />
              <span>SMAZAT VŠE</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors border border-slate-100 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Emoji categories */}
      <div 
        ref={containerRef}
        className={`pr-2 overscroll-contain overflow-y-auto scrollbar-thin ${
          filterCategory 
            ? 'space-y-6' 
            : isPinned 
              ? 'space-y-6 max-h-[25vh] sm:max-h-[35vh] lg:max-h-none lg:flex-1' 
              : 'space-y-6 max-h-[35vh]'
        }`}
      >
        {categoriesToRender.map(cat => {
          const items = emojisByCategory.get(cat.key) || [];
          return (
            <div key={cat.key} className="space-y-2">
              {!filterCategory && (
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-350 rounded-full" />
                  {cat.label}
                </h4>
              )}
              <div className={`grid ${gridColsClass}`}>
                {items.map(opt => {
                  const isSelected = currentEmojis.includes(opt.emoji);
                  return (
                    <button
                      key={opt.emoji}
                      onClick={() => isSelected ? onRemove(opt.emoji) : onSelect(opt.emoji)}
                      className={`
                        group flex items-center gap-2 p-2 rounded-xl transition-all text-left text-xs cursor-pointer border
                        ${isSelected 
                          ? 'bg-linear-to-br from-indigo-50/70 to-indigo-100/50 border-indigo-300 text-indigo-900 shadow-xs ring-1 ring-indigo-200/20' 
                          : 'bg-slate-50/50 hover:bg-white border-transparent hover:border-indigo-300/50 hover:shadow-xs text-slate-600'
                        }
                      `}
                    >
                      <span className="text-xl flex-shrink-0 drop-shadow-xs group-hover:scale-110 transition-transform whitespace-nowrap select-none">
                        {opt.emoji}
                      </span>
                      <span className={`text-[11px] font-bold flex-1 leading-snug whitespace-normal break-words ${isSelected ? 'text-indigo-800' : 'text-slate-655 group-hover:text-indigo-600'}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
