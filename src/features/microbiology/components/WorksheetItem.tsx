import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { WorksheetItem as WorksheetItemType } from '../../../types';
import { EmojiPalette } from './EmojiPalette';

interface WorksheetItemProps {
  item: WorksheetItemType;
  level?: number;
  selectedEmojis: Record<string, string[]>;
  activeItemId: string | null;
  showResults: boolean;
  onActivate: (id: string) => void;
  onSelectEmoji: (id: string, emoji: string) => void;
  onRemoveEmoji: (id: string, emoji: string) => void;
  onClearAll: (id: string) => void;
  onClosePalette: () => void;
  emojiOptions: any[];
  emojiCategories: { key: string; label: string }[];
  isPalettePinned?: boolean;
  onTogglePin?: () => void;
}

const getRankRowStyles = (type?: string) => {
  switch (type) {
    case 'Kmen': return 'border-l-4 border-l-brand-orange bg-orange-50/10 hover:bg-orange-50/20';
    case 'Třída': return 'border-l-4 border-l-amber-500 bg-amber-50/10 hover:bg-amber-50/20';
    case 'Čeleď': return 'border-l-4 border-l-yellow-500 bg-yellow-50/10 hover:bg-yellow-50/20';
    case 'Rod': return 'border-l-4 border-l-brand-orange-text bg-orange-50/5 hover:bg-orange-50/15';
    case 'Zástupce': return 'border-l-4 border-l-rose-500 bg-rose-50/15 hover:bg-rose-50/25';
    default: return 'border-l-4 border-l-slate-300 bg-slate-50/15 hover:bg-slate-50/25';
  }
};

const getTypeStyle = (type?: string) => {
  switch (type) {
    case 'Kmen': return 'bg-orange-100/70 text-brand-orange-text border-orange-200/50';
    case 'Třída': return 'bg-amber-100/70 text-amber-900 border-amber-200/50';
    case 'Čeleď': return 'bg-yellow-100/75 text-yellow-900 border-yellow-200/50';
    case 'Rod': return 'bg-orange-100/40 text-brand-orange-text/90 border-orange-200/45';
    case 'Zástupce': return 'bg-rose-100/70 text-rose-800 border-rose-200/50';
    default: return 'bg-slate-100 text-slate-650 border-slate-200/50';
  }
};


export function WorksheetItem({
  item,
  level = 0,
  selectedEmojis,
  activeItemId,
  showResults,
  onActivate,
  onSelectEmoji,
  onRemoveEmoji,
  onClearAll,
  onClosePalette,
  emojiOptions,
  emojiCategories,
  isPalettePinned = false,
  onTogglePin,
}: WorksheetItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeFieldCategory = useMemo(() => {
    if (!activeItemId) return undefined;
    const parts = activeItemId.split('::');
    if (parts.length > 1) return parts[1];
    return undefined;
  }, [activeItemId]);
  const hasChildren = item.children && item.children.length > 0;

  const correct = item.correctEmojis || [];

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };



  const getSelectedForField = (fieldId: string) => {
    const merged = emojiCategories.flatMap(cat => selectedEmojis[`${fieldId}::${cat.key}`] || []);
    if (merged.length > 0) return merged;
    return selectedEmojis[fieldId] || [];
  };

  const statusIcon = () => {
    if (!showResults) return null;
    const hasGroups = item.groups && item.groups.length > 0;
    
    if (hasGroups) {
      const allGroupsCorrect = item.groups!.every(g => {
        const fieldId = `${item.id}_${g.id}`;
        const sel = getSelectedForField(fieldId);
        const corr = g.correctEmojis || [];
        return corr.length > 0 && corr.every(e => sel.includes(e)) && sel.every(e => corr.includes(e));
      });
      if (allGroupsCorrect) return <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 animate-bounce-subtle" />;
      return <XCircle size={20} className="text-rose-500 flex-shrink-0 animate-bounce-subtle" />;
    }

    if (correct.length === 0) return null;
    const sel = getSelectedForField(item.id);
    const isCorrect = correct.every(e => sel.includes(e)) && sel.every(e => correct.includes(e));
    if (isCorrect) return <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 animate-bounce-subtle" />;
    return <XCircle size={20} className="text-rose-500 flex-shrink-0 animate-bounce-subtle" />;
  };

  const renderEmojiField = (fieldId: string, label?: string, correctList: string[] = []) => {
    const isActive = activeItemId === fieldId;
    const selected = selectedEmojis[fieldId] || [];
    
    // Scoring for this specific field
    const isCorrect = showResults && correctList.length > 0 && correctList.every(e => selected.includes(e)) && selected.every(e => correctList.includes(e));
    const isWrong = showResults && correctList.length > 0 && !isCorrect;
    const extraEmojis = showResults && correctList.length > 0 ? selected.filter(e => !correctList.includes(e)) : [];
    const missingEmojis = showResults && correctList.length > 0 ? correctList.filter(e => !selected.includes(e)) : [];

    const groupedSelected: { categoryKey: string; emojis: string[] }[] = [];
    for (const cat of emojiCategories) {
      const catEmojis = selected.filter(e => {
        const opt = emojiOptions.find(o => o.emoji === e);
        return opt?.category === cat.key;
      });
      if (catEmojis.length > 0) {
        groupedSelected.push({ categoryKey: cat.key, emojis: catEmojis });
      }
    }
    const uncategorized = selected.filter(e => !emojiOptions.find(o => o.emoji === e));
    if (uncategorized.length > 0) {
      groupedSelected.push({ categoryKey: 'uncategorized', emojis: uncategorized });
    }

    return (
      <div key={fieldId}>
        {label && <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-0.5 truncate" title={label}>{label}</p>}
        <div
          className={`
            flex items-center gap-1.5 flex-wrap min-h-[2.5rem] px-2.5 py-1.5 rounded-xl border-2 cursor-pointer transition-all duration-300
            ${isActive
              ? 'border-brand-orange bg-white ring-4 ring-brand-orange/15 shadow-md shadow-brand-orange/5'
              : 'border-slate-200 bg-white hover:bg-slate-50/50 hover:border-slate-350 hover:shadow-xs'}
            ${isCorrect && showResults ? 'border-emerald-500 bg-emerald-50/20 ring-4 ring-emerald-500/10' : ''}
            ${isWrong && showResults ? 'border-rose-500 bg-rose-50/20 ring-4 ring-rose-500/10' : ''}
          `}
          onClick={(e) => { e.stopPropagation(); onActivate(fieldId); }}
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2">
              {groupedSelected.map((group, groupIdx) => (
                <div key={group.categoryKey} className="flex items-center gap-1.5">
                  {group.emojis.map((emoji, i) => {
                    const isExtra = showResults && extraEmojis.includes(emoji);
                    return (
                      <button
                        key={i}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onRemoveEmoji(fieldId, emoji); 
                        }}
                        className={`
                          text-xl drop-shadow-xs transition-all hover:scale-115 active:scale-95 group relative flex items-center justify-center p-0.5 bg-white border border-slate-100 rounded-lg shadow-xs whitespace-nowrap flex-shrink-0 cursor-pointer
                          ${isExtra ? 'opacity-40' : ''}
                        `}
                        title={isExtra ? 'Špatná odpověď (Klikni pro odebrání)' : 'Klikni pro odebrání'}
                      >
                        <span>{emoji}</span>
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-md transition-opacity border border-white">
                          ×
                        </span>
                      </button>
                    );
                  })}
                  {groupIdx < groupedSelected.length - 1 && (
                    <div className="h-5 w-[2px] bg-slate-200 mx-1 rounded-full flex-shrink-0 self-center" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5 select-none">
              <HelpCircle size={14} className="text-slate-400" />
              {label ? `Vyber...` : 'Klikni a vyber...'}
            </span>
          )}

          {showResults && missingEmojis.length > 0 && (
            <div className="w-full mt-1.5 pt-1.5 border-t border-rose-100 flex flex-wrap items-center gap-x-1.5">
              <span className="text-[10px] text-rose-500 font-bold flex-shrink-0">⚠️ Chybí:</span>
              <span className="text-lg flex flex-wrap gap-1">
                {missingEmojis.map((emoji, idx) => (
                  <span key={idx} className="whitespace-nowrap filter drop-shadow-xs select-none">{emoji}</span>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const hasGroups = item.groups && item.groups.length > 0;
  const sel = getSelectedForField(item.id);
  const isCorrect = !hasGroups ? (showResults && correct.length > 0 && correct.every(e => sel.includes(e)) && sel.every(e => correct.includes(e))) : false;
  const isWrong = !hasGroups ? (showResults && correct.length > 0 && !isCorrect) : false;

  return (
    <div className="flex flex-col">
      {/* Main row */}
      <div
        className={`
          relative flex items-start py-3.5 px-4 my-1 rounded-2xl border-2 transition-all duration-300
          ${getRankRowStyles(item.type)}
          ${activeItemId?.startsWith(item.id) ? 'ring-2 ring-brand-orange/50 shadow-xs border-brand-orange/60 z-30' : 'border-transparent z-10'}
          ${isCorrect && showResults ? 'bg-emerald-500/[0.03] border-emerald-500/30' : ''}
          ${isWrong && showResults ? 'bg-rose-500/[0.03] border-rose-500/30' : ''}
          ${hasChildren ? 'cursor-pointer' : ''}
        `}
        onClick={() => {
          if (hasChildren) handleToggle();
        }}
      >
        {/* Chevron or dot */}
        <div className="flex-shrink-0 mt-1.5 w-6 flex items-center justify-center text-slate-400 select-none">
          {hasChildren ? (
            <div className="p-1 hover:bg-slate-200/50 rounded-lg transition-colors">
              {isOpen ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
            </div>
          ) : (
            <div className={`w-3 h-3 rounded-full flex items-center justify-center border-2 transition-colors ${
              (correct.length > 0 || hasGroups) ? 'border-brand-orange/65 bg-brand-orange/10' : 'border-slate-200 bg-slate-100'
            }`}>
              {(correct.length > 0 || hasGroups) && <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
            </div>
          )}
        </div>

        <div className="flex-1 ml-2.5 min-w-0">
          {/* Name and type */}
          <div className="flex items-center flex-wrap gap-2">
            {statusIcon()}
            <span className={`font-bold leading-snug tracking-tight ${
              level === 0 ? 'text-lg sm:text-xl text-slate-900' : level === 1 ? 'text-base sm:text-lg text-slate-800' : 'text-sm text-slate-700 font-semibold'
            }`}>
              {item.name}
            </span>
            {item.type && (
              <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider flex-shrink-0 border ${getTypeStyle(item.type)}`}>
                {item.type}
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              {item.description}
            </p>
          )}

          {/* Hint */}
          {item.hint && !showResults && (correct.length > 0 || hasGroups) && (
            <details className="mt-2.5 group">
              <summary className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 select-none outline-none">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/70 group-open:bg-brand-orange transition-colors" />
                <span>💡 Nápověda</span>
              </summary>
              <div className="text-xs text-slate-600 mt-1.5 italic pl-4 py-2 border-l-2 border-brand-orange bg-orange-50/20 rounded-r-xl leading-relaxed animate-in fade-in-50 duration-200">
                {item.hint}
              </div>
            </details>
          )}

          {/* Emoji answer fields */}
          <div className="mt-3.5">
            {hasGroups ? (
              <div className="space-y-3">
                {item.groups!.map(g => (
                  <div key={g.id} className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">{g.label}</p>
                    {renderEmojiField(`${item.id}_${g.id}`, undefined, g.correctEmojis)}
                  </div>
                ))}
              </div>
            ) : (
              correct.length > 0 && renderEmojiField(item.id, undefined, correct)
            )}
          </div>

        </div>

        {/* Absolute Floating Emoji Palette */}
        {!isPalettePinned && activeItemId && activeItemId.startsWith(item.id) && (
          <div 
            className="absolute top-[calc(100%+0.25rem)] left-4 right-4 z-50 animate-scale-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <EmojiPalette
              onSelect={(emoji) => onSelectEmoji(activeItemId, emoji)}
              onRemove={(emoji) => onRemoveEmoji(activeItemId, emoji)}
              onClearAll={() => onClearAll(activeItemId)}
              onClose={onClosePalette}
              currentEmojis={selectedEmojis[activeItemId] || []}
              emojiOptions={emojiOptions}
              emojiCategories={emojiCategories}
              filterCategory={activeFieldCategory}
              isPinned={false}
              onTogglePin={onTogglePin}
              activeItemId={activeItemId}
            />
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="flex flex-col pl-4 sm:pl-6 gap-1.5 mt-1.5">
          {item.children!.map((child) => (
            <WorksheetItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedEmojis={selectedEmojis}
              activeItemId={activeItemId}
              showResults={showResults}
              onActivate={onActivate}
              onSelectEmoji={onSelectEmoji}
              onRemoveEmoji={onRemoveEmoji}
              onClearAll={onClearAll}
              onClosePalette={onClosePalette}
              emojiOptions={emojiOptions}
              emojiCategories={emojiCategories}
              isPalettePinned={isPalettePinned}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
