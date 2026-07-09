import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorksheetItem as WorksheetItemComponent } from '../components/WorksheetItem';
import { EmojiPalette } from '../components/EmojiPalette';
import { CheckCheck, RotateCcw, FileDown, BookOpen, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useQuizState } from '../hooks/useQuizState';
import { countTotal, countAnswered, countCorrect as getCountCorrect } from '../utils/scoring';
import { WorksheetItem, EmojiOption } from '../../../types';

interface QuizPageProps {
  currentWorksheetData: WorksheetItem[];
  emojiOptions: EmojiOption[];
  emojiCategories: { key: string, label: string }[];
  isLocalMode?: boolean;
}

export function QuizPage({ 
  currentWorksheetData, 
  emojiOptions,
  emojiCategories,
  isLocalMode = false
}: QuizPageProps) {
  const navigate = useNavigate();

  const {
    selectedEmojis,
    activeItemId,
    showResults,
    isPalettePinned,
    handleTogglePin,
    handleActivate,
    handleSelectEmoji,
    handleRemoveEmoji,
    handleClearAll,
    handleClosePalette,
    handleCheck,
    handleReset
  } = useQuizState(emojiOptions);

  useEffect(() => {
    document.title = "Taxonomie mikroorganizmů - Kvíz";
  }, []);

  const totalQ = countTotal(currentWorksheetData);
  const answeredQ = countAnswered(currentWorksheetData, selectedEmojis);
  const countCorrect = getCountCorrect(currentWorksheetData, selectedEmojis);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 antialiased selection:bg-brand-orange selection:text-white">
      {/* Header - Keeps the dark theme for strong contrast */}
      <header className="page-header bg-[#1a0f0a] border-b border-[#0f0906] sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost shrink-0 text-stone-400 hover:text-white hover:bg-orange-950 transition-colors"
              title="Zpět na rozcestník"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">
                📋 Pracovní list: Systematika bakterií
              </h1>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <p className="text-orange-200/80 text-xs sm:text-sm font-medium tracking-wide">Doplň správné emoji vlastnosti k jednotlivým taxonům</p>
                {isLocalMode && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-wider bg-orange-500/25 text-orange-200 border border-orange-500/35">
                    Offline vývoj (localStorage)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/mikrobiologie/studijni-strom')}
                className="btn-dark bg-orange-950/80 hover:bg-orange-900 text-stone-200 border border-orange-900/50 text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2"
              >
                <BookOpen size={16} className="text-orange-400" />
                <span className="hidden sm:inline">Studovat</span>
              </button>
              <button
                onClick={() => navigate('/mikrobiologie/admin')}
                className="btn-ghost text-stone-400 hover:text-white hover:bg-orange-950 transition-colors"
                title="Admin panel"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
 
          {/* Progress bar */}
          <div className="mt-6">
            <ProgressBar 
              value={totalQ > 0 ? (answeredQ / totalQ) * 100 : 0} 
              variant="orange" 
              label={
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black tracking-wider text-stone-200 bg-orange-950/50 border border-orange-900/50 px-2.5 py-1 rounded-md whitespace-nowrap shadow-sm">
                    {answeredQ} / {totalQ} HOTOVO
                  </span>
                  {showResults && (
                    <Badge variant="green" className="animate-bounce-subtle bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1">
                      ✅ {countCorrect} / {totalQ} SPRÁVNĚ
                    </Badge>
                  )}
                </div>
              }
            />
          </div>
        </div>
      </header>
 
      {/* Main content */}
      <main className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-300 ${activeItemId && isPalettePinned ? 'pb-[280px] sm:pb-[340px] md:pb-[380px] lg:pb-12' : 'pb-12'}`}>
        {/* Action bar - Light version */}
        <Card className="p-4 mb-6 flex flex-wrap items-center gap-4 bg-white border border-stone-200 shadow-sm shadow-stone-200/50">
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <div className="p-2 bg-orange-50 rounded-xl text-brand-orange border border-orange-100 shadow-inner">
              <FileDown size={18} />
            </div>
            <span className="font-bold tracking-wide text-xs uppercase text-slate-500">Vyplňovací tabulka</span>
          </div>
          <div className="flex-1" />
          <Button
            onClick={handleCheck}
            disabled={answeredQ === 0}
            variant="primary"
            className="shadow-md shadow-brand-orange/20"
          >
            <CheckCheck size={16} />
            Zkontrolovat
          </Button>
          <Button
            onClick={handleReset}
            variant="secondary"
            className="bg-stone-50 hover:bg-stone-100 text-slate-600 border-stone-200 hover:text-slate-900"
          >
            <RotateCcw size={16} className="text-brand-orange" />
            Reset
          </Button>
        </Card>

        {/* Instructions banner - Light version */}
        {!showResults && answeredQ === 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-200 shadow-md shadow-orange-100/50 rounded-2xl p-6 mb-8 animate-fade-in-up flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <span className="text-3xl shrink-0 filter drop-shadow-sm select-none z-10">💡</span>
            <div className="z-10">
              <p className="text-sm font-black text-amber-800 uppercase tracking-wider">Jak pracovat s pracovním listem:</p>
              <ol className="text-sm text-amber-900/80 mt-3 space-y-2 font-medium list-decimal list-inside">
                <li>Klikni na pole s textem <span className="font-bold text-slate-900">„Klikni a vyber..."</span> u jakéhokoliv taxonu.</li>
                <li>Zobrazí se paleta emoji přímo pod otázkou — kliknutím vybíráš.</li>
                <li>Pro odebrání klikni na vybrané emoji v taxonové buňce.</li>
                <li>Až budeš mít hotovo, klikni nahoře na tlačítko <span className="font-bold text-brand-orange">„Zkontrolovat“</span>.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Worksheet Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200 p-6 sm:p-8 animate-scale-in">
            <div className="space-y-1">
              {currentWorksheetData.map(item => (
                <WorksheetItemComponent
                  key={item.id}
                  item={item}
                  emojiOptions={emojiOptions}
                  emojiCategories={emojiCategories}
                  selectedEmojis={selectedEmojis}
                  activeItemId={activeItemId}
                  showResults={showResults}
                  onActivate={handleActivate}
                  onSelectEmoji={handleSelectEmoji}
                  onRemoveEmoji={handleRemoveEmoji}
                  onClearAll={handleClearAll}
                  onClosePalette={handleClosePalette}
                  isPalettePinned={isPalettePinned}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          </div>

          {/* Desktop Sticky Sidebar Selection Palette */}
          {activeItemId && isPalettePinned && (
            <div 
              className="hidden lg:block lg:w-[380px] xl:w-[420px] lg:sticky lg:top-[160px] z-30 shrink-0 h-[calc(100vh-12rem)] animate-scale-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white shadow-2xl shadow-stone-300/50 rounded-2xl border border-stone-200 p-4 h-full flex flex-col">
                <EmojiPalette
                  onSelect={(emoji) => handleSelectEmoji(activeItemId, emoji)}
                  onRemove={(emoji) => handleRemoveEmoji(activeItemId, emoji)}
                  onClearAll={() => handleClearAll(activeItemId)}
                  onClose={handleClosePalette}
                  currentEmojis={selectedEmojis[activeItemId] || []}
                  emojiOptions={emojiOptions}
                  emojiCategories={emojiCategories}
                  filterCategory={(() => {
                    const parts = activeItemId.split('::');
                    return parts.length > 1 ? parts[1] : undefined;
                  })()}
                  isPinned={true}
                  onTogglePin={handleTogglePin}
                  activeItemId={activeItemId}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Pinned Bottom Selection Palette */}
        {activeItemId && isPalettePinned && (
          <div 
            className="block lg:hidden fixed bottom-0 left-0 right-0 z-45 bg-white border-t border-stone-200 shadow-[0_-12px_42px_rgba(0,0,0,0.1)] rounded-t-3xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-10 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto">
              <EmojiPalette
                onSelect={(emoji) => handleSelectEmoji(activeItemId, emoji)}
                onRemove={(emoji) => handleRemoveEmoji(activeItemId, emoji)}
                onClearAll={() => handleClearAll(activeItemId)}
                onClose={handleClosePalette}
                currentEmojis={selectedEmojis[activeItemId] || []}
                emojiOptions={emojiOptions}
                emojiCategories={emojiCategories}
                filterCategory={(() => {
                  const parts = activeItemId.split('::');
                  return parts.length > 1 ? parts[1] : undefined;
                })()}
                isPinned={true}
                onTogglePin={handleTogglePin}
                activeItemId={activeItemId}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer - Light Version */}
      <footer className="border-t border-stone-200 py-6 text-center text-sm mt-12 bg-stone-100">
        <p className="text-stone-500">Pracovní list k procvičení systematiky bakterií • Doplň správné emoji k jednotlivým taxonům</p>
        <p className="mt-2 text-stone-500">Kontakt: <a href="mailto:kolarv@vscht.cz" className="text-brand-orange hover:text-brand-orange-text transition-colors">kolarv@vscht.cz</a></p>
      </footer>
    </div>
  );
}
