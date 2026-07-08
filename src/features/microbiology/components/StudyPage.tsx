import { useState, useMemo, useEffect } from 'react';
import { WorksheetItem, EmojiOption } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { sortEmojis } from '../data/data';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { 
  BookOpen, 
  ArrowLeft, 
  Search, 
  X, 
  Check, 
  Filter, 
  Info, 
  Layers, 
  Tag, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  Eye, 
  Brain, 
  Network, 
  HelpCircle, 
  Trophy, 
  Sparkles, 
  Smile, 
  Frown, 
  Table, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

interface StudyPageProps {
  onBack: () => void;
  data: WorksheetItem[];
  emojiOptions: EmojiOption[];
  emojiCategories: { key: string; label: string }[];
  activeTab: 'tree' | 'flashcards' | 'matrix';
}

interface TaxonContext {
  id: string;
  name: string;
  type?: string;
  breadcrumbs: { name: string; type?: string }[];
  description?: string;
  hint?: string;
  correctEmojis: string[];
  groups?: {
    id: string;
    label: string;
    correctEmojis: string[];
  }[];
}

// Visual cell morphology simulator component (Compact version)
function CellMorphology({ taxonEmojis, className = "" }: { taxonEmojis: string[]; className?: string }) {
  const isGramPositive = taxonEmojis.includes('🔵');
  const isGramNegative = taxonEmojis.includes('🔴');
  const isWallLess = taxonEmojis.includes('🧱❌');
  
  const isRod = taxonEmojis.some(e => ['🌭', '🌭🌭', '🌭🌭🌭'].includes(e));
  const isCoccus = taxonEmojis.some(e => ['⚪', '🟣', '🟣🟣', '🟣🟣🟣', '🍇', '8', '⛓️'].includes(e));
  const isSpirillum = taxonEmojis.some(e => ['〰️'].includes(e));
  const isFilamentous = taxonEmojis.some(e => ['🌿'].includes(e));
  
  const isChain = taxonEmojis.includes('⛓️');
  const isCluster = taxonEmojis.includes('🍇');
  const isMotile = taxonEmojis.includes('🏃');
  const isSpore = taxonEmojis.includes('🛡️');

  let wallColor = "border-slate-350 bg-slate-100";
  let wallLabel = "Neznámá stěna";
  if (isGramPositive) {
    wallColor = "border-indigo-650 bg-indigo-50/80 shadow-[0_0_12px_rgba(99,102,241,0.2)] border-[4px]";
    wallLabel = "G+ (silný peptidoglykan)";
  } else if (isGramNegative) {
    wallColor = "border-rose-500 bg-rose-50 shadow-[0_0_12px_rgba(244,63,94,0.15)] border-double border-[5px]";
    wallLabel = "G- (vnější membrána)";
  } else if (isWallLess) {
    wallColor = "border-dashed border-amber-400 bg-amber-50/40";
    wallLabel = "Bez buněčné stěny";
  }

  return (
    <div className={`flex items-center gap-4 p-3 bg-slate-900/[0.03] rounded-xl border border-slate-200/50 backdrop-blur-xs ${className}`}>
      {/* 2D graphic canvas */}
      <div className="relative w-28 h-18 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden select-none">
        {/* Motility bičíky */}
        {isMotile && (
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <svg className="w-full h-full stroke-indigo-400 stroke-2 fill-none opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 5,50 C 15,35 25,65 35,50" className="animate-pulse" />
              <path d="M 95,50 C 85,65 75,35 65,50" className="animate-pulse" />
            </svg>
          </div>
        )}

        {/* Cell body */}
        <div className="z-10 relative flex items-center justify-center">
          {isRod && (
            <div className={`w-20 h-9 rounded-full flex items-center justify-center border ${wallColor} transition-all`}>
              {isSpore && (
                <div className="absolute right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-600 shadow-[0_0_4px_rgba(52,211,153,0.5)] animate-pulse" />
              )}
            </div>
          )}

          {isCoccus && (
            <div className="flex items-center justify-center">
              {isChain ? (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-5 h-5 rounded-full border-2 ${wallColor} flex items-center justify-center shadow-2xs`}>
                      {isSpore && i === 2 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </div>
                  ))}
                </div>
              ) : isCluster ? (
                <div className="relative w-12 h-10">
                  <div className={`absolute top-0 left-2 w-5 h-5 rounded-full border-2 ${wallColor} shadow-2xs`} />
                  <div className={`absolute top-0.5 left-6 w-5 h-5 rounded-full border-2 ${wallColor} shadow-2xs`} />
                  <div className={`absolute top-4 left-0 w-5 h-5 rounded-full border-2 ${wallColor} shadow-2xs`} />
                  <div className={`absolute top-4.5 left-4 w-5 h-5 rounded-full border-2 ${wallColor} shadow-2xs`} />
                </div>
              ) : (
                <div className={`w-9 h-9 rounded-full border-3 ${wallColor} flex items-center justify-center transition-all`}>
                  {isSpore && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-600 shadow-2xs animate-pulse" />}
                </div>
              )}
            </div>
          )}

          {isSpirillum && (
            <svg className="w-20 h-6" viewBox="0 0 100 40">
              <path
                d="M 5,20 C 20,2 35,38 50,20 C 65,2 80,38 95,20"
                className={`fill-none stroke-[4px] stroke-round ${isGramPositive ? 'stroke-indigo-650' : isGramNegative ? 'stroke-rose-500' : 'stroke-slate-450'}`}
              />
            </svg>
          )}

          {isFilamentous && (
            <svg className="w-18 h-8" viewBox="0 0 100 50">
              <path
                d="M 50,48 L 50,30 M 50,30 L 30,18 M 50,30 L 70,20 M 30,18 L 15,15 M 70,20 L 85,12"
                className={`fill-none stroke-[3px] stroke-round ${isGramPositive ? 'stroke-indigo-650' : isGramNegative ? 'stroke-rose-500' : 'stroke-slate-450'}`}
              />
            </svg>
          )}

          {!isRod && !isCoccus && !isSpirillum && !isFilamentous && (
            isGramPositive ? (
              <svg className="w-20 h-14 select-none" viewBox="0 0 100 70">
                {/* G+ Wall Schematic */}
                <rect x="10" y="52" width="80" height="8" rx="2" className="fill-blue-500/10 stroke-blue-500 stroke-[1.25px]" />
                <text x="50" y="58" className="fill-blue-600 text-[5px] font-black font-sans" textAnchor="middle">Membrána</text>
                
                {/* Periplasmic space */}
                <line x1="10" y1="48" x2="90" y2="48" className="stroke-slate-300 stroke-[0.75px] stroke-dashed" />
                
                {/* Thick Peptidoglycan */}
                <rect x="10" y="20" width="80" height="24" rx="3" className="fill-indigo-600/10 stroke-indigo-650 stroke-[3px]" />
                <text x="50" y="32" className="fill-indigo-800 text-[6px] font-black font-sans" textAnchor="middle">peptidoglykan</text>
                <text x="50" y="39" className="fill-indigo-600 text-[5px] font-bold font-sans" textAnchor="middle">(silná stěna)</text>
                
                {/* Teichoic acids */}
                <path d="M 25,52 C 25,38 20,28 22,12" className="fill-none stroke-amber-500 stroke-[1px]" />
                <path d="M 75,52 C 72,38 78,28 75,12" className="fill-none stroke-amber-500 stroke-[1px]" />
              </svg>
            ) : isGramNegative ? (
              <svg className="w-20 h-14 select-none" viewBox="0 0 100 70">
                {/* G- Wall Schematic */}
                {/* Inner membrane */}
                <rect x="10" y="54" width="80" height="8" rx="2" className="fill-blue-500/10 stroke-blue-500 stroke-[1.25px]" />
                <text x="50" y="60" className="fill-blue-600 text-[4.5px] font-black font-sans" textAnchor="middle">Vnitřní membrána</text>
                
                {/* Thin Peptidoglycan */}
                <rect x="10" y="44" width="80" height="4" rx="1" className="fill-indigo-600/5 stroke-indigo-500 stroke-[1px]" />
                <text x="50" y="47.5" className="fill-indigo-600 text-[4px] font-extrabold font-sans" textAnchor="middle">Peptidoglykan (tenký)</text>
                
                {/* Outer membrane */}
                <rect x="10" y="30" width="80" height="8" rx="2" className="fill-rose-500/10 stroke-rose-500 stroke-[1.25px]" />
                <text x="50" y="36" className="fill-rose-600 text-[4.5px] font-black font-sans" textAnchor="middle">Vnější membrána</text>
                
                {/* LPS */}
                <path d="M 20,30 L 18,18 M 35,30 L 37,20 M 50,30 L 48,16 M 65,30 L 67,18 M 80,30 L 78,20" className="fill-none stroke-rose-400 stroke-[1px]" />
              </svg>
            ) : isWallLess ? (
              <svg className="w-20 h-14 select-none" viewBox="0 0 100 70">
                {/* Wall-less Schematic */}
                <rect x="10" y="26" width="80" height="16" rx="3" className="fill-amber-500/5 stroke-amber-400 stroke-[2px] stroke-dashed" />
                <text x="50" y="34" className="fill-amber-700 text-[6px] font-black font-sans" textAnchor="middle">Pouze membrána</text>
                <text x="50" y="42" className="fill-amber-600 text-[5px] font-bold font-sans" textAnchor="middle">(bez stěny)</text>
              </svg>
            ) : (
              <span className="text-[7px] text-slate-450 font-black tracking-widest select-none">N/A</span>
            )
          )}
        </div>
      </div>

      {/* Description text */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black text-slate-600 leading-tight">{wallLabel}</div>
        <div className="text-[9px] text-slate-550 leading-relaxed mt-0.5">
          {[
            isRod ? "Morfologie: Tyčinka" : isCoccus ? "Morfologie: Kok" : isSpirillum ? "Morfologie: Spirála" : isFilamentous ? "Morfologie: Vláknitá" : null,
            isMotile ? "Pohyblivost: Bičíky" : null,
            isSpore ? "Ochrana: Tvorba spor" : null
          ].filter(Boolean).join(" • ")}
        </div>
      </div>
    </div>
  );
}

export function StudyPage({ onBack, data, emojiOptions, emojiCategories, activeTab }: StudyPageProps) {
  const navigate = useNavigate();
  // Tabs and general state
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhylumFilter, setActivePhylumFilter] = useState<string>('Vše');
  const [activeRankFilter, setActiveRankFilter] = useState<string>('Vše');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  // Tree expanded nodes & inline 2D models
  const [treeExpandedNodes, setTreeExpandedNodes] = useState<Record<string, boolean>>({});
  const [expandedCellModels, setExpandedCellModels] = useState<Record<string, boolean>>({});

  // Flashcards state
  const [flashcardPool, setFlashcardPool] = useState<TaxonContext[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState<boolean>(false);
  const [flashcardFilterPhylum, setFlashcardFilterPhylum] = useState<string>('Vše');
  const [flashcardFilterRank, setFlashcardFilterRank] = useState<string>('Vše');
  const [flashcardHistory, setFlashcardHistory] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({});

  // Flatten and build breadcrumbs context map for all taxons
  const taxonFlatList = useMemo(() => {
    const list: TaxonContext[] = [];
    
    const traverse = (items: WorksheetItem[], ancestors: { name: string; type?: string }[] = []) => {
      for (const item of items) {
        const currentBreadcrumbs = [...ancestors];
        
        if ((item.correctEmojis && item.correctEmojis.length > 0) || (item.groups && item.groups.length > 0)) {
          list.push({
            id: item.id,
            name: item.name,
            type: item.type,
            breadcrumbs: currentBreadcrumbs,
            description: item.description,
            hint: item.hint,
            correctEmojis: item.correctEmojis || [],
            groups: item.groups
          });
        }
        
        if (item.children) {
          traverse(item.children, [...currentBreadcrumbs, { name: item.name, type: item.type }]);
        }
      }
    };
    
    traverse(data);
    return list;
  }, [data]);

  // Extract all available phyla dynamically for filters
  const availablePhyla = useMemo(() => {
    const phyla = new Set<string>();
    for (const item of data) {
      if (item.name && item.type === 'Kmen') phyla.add(item.name);
    }
    return Array.from(phyla).sort();
  }, [data]);

  // Flat lookup for emoji options
  const getFlatEmojis = (emojis: string[]) => {
    const sorted = sortEmojis(emojis, emojiOptions);
    return sorted.map(e => {
      const opt = emojiOptions.find(o => o.emoji === e);
      return {
        emoji: e,
        label: opt?.label || e
      };
    });
  };

  // Trait list for checkbox filters
  const selectableTraits = useMemo(() => {
    return [
      { emoji: '🔵', label: 'G+' },
      { emoji: '🔴', label: 'G-' },
      { emoji: '🌭', label: 'Tyčinky' },
      { emoji: '⚪', label: 'Koky' },
      { emoji: '💨', label: 'Aerobní' },
      { emoji: '🚫💨', label: 'Anaerobní' },
      { emoji: '🌗', label: 'Fakultativně anaerobní' },
      { emoji: '🏃', label: 'Pohyblivé' },
      { emoji: '🛡️', label: 'Spory' },
      { emoji: '🦠', label: 'Patogeny' },
    ];
  }, []);

  // Determine visibility of nodes in the hierarchical tree structure
  const visibleNodeIds = useMemo(() => {
    const visibleIds = new Set<string>();
    
    const checkMatch = (item: WorksheetItem): boolean => {
      const allEmojis = [
        ...(item.correctEmojis || []),
        ...(item.groups?.flatMap(g => g.correctEmojis) || [])
      ];
      
      const flatEmojis = allEmojis.map(e => (emojiOptions || []).find(o => o.emoji === e)?.label.toLowerCase() || '');
      
      // Text Match
      const query = searchQuery.toLowerCase().trim();
      const textMatch = !query ||
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.hint?.toLowerCase().includes(query) ||
        flatEmojis.some(label => label.includes(query)) ||
        allEmojis.some(e => e.includes(query));
      
      // Traits Match
      const traitMatch = selectedTraits.length === 0 || selectedTraits.every(traitEmoji => {
        if (traitEmoji === '🌭') {
          return allEmojis.some(e => ['🌭', '🌭🌭', '🌭🌭🌭'].includes(e));
        }
        if (traitEmoji === '⚪') {
          return allEmojis.some(e => ['⚪', '🟣', '🟣🟣', '🟣🟣🟣', '🍇', '8', '⛓️'].includes(e));
        }
        return allEmojis.includes(traitEmoji);
      });
      
      let childMatch = false;
      if (item.children) {
        for (const child of item.children) {
          if (checkMatch(child)) {
            childMatch = true;
          }
        }
      }
      
      const hasDirectTraits = (item.correctEmojis && item.correctEmojis.length > 0) || (item.groups && item.groups.length > 0);
      
      const selfMatches = hasDirectTraits 
        ? (textMatch && traitMatch)
        : (query ? textMatch : false); // if folder, only show if search query matches name/desc
        
      const isVisible = selfMatches || childMatch;
      
      if (isVisible) {
        visibleIds.add(item.id);
      }
      return isVisible;
    };

    // Traverse root branches
    data.forEach(item => {
      // Apply phylum filter at root level
      if (activePhylumFilter !== 'Vše' && item.name !== activePhylumFilter) {
        return; // skip this root phylum
      }
      checkMatch(item);
    });

    return visibleIds;
  }, [searchQuery, activePhylumFilter, selectedTraits, data, emojiOptions]);

  // Auto-expand visible nodes in search/filter mode
  useEffect(() => {
    if (!searchQuery && selectedTraits.length === 0 && activePhylumFilter === 'Vše') return;
    
    const expanded: Record<string, boolean> = {};
    const traverse = (items: WorksheetItem[]) => {
      for (const item of items) {
        if (visibleNodeIds.has(item.id) && item.children && item.children.length > 0) {
          expanded[item.id] = true;
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    };
    traverse(data);
    setTreeExpandedNodes(prev => ({ ...prev, ...expanded }));
  }, [visibleNodeIds, searchQuery, selectedTraits, activePhylumFilter, data]);

  // Expand All tree folders
  const handleExpandAll = () => {
    const expanded: Record<string, boolean> = {};
    const traverse = (items: WorksheetItem[]) => {
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          expanded[item.id] = true;
          traverse(item.children);
        }
      }
    };
    traverse(data);
    setTreeExpandedNodes(expanded);
  };

  // Collapse All tree folders
  const handleCollapseAll = () => {
    setTreeExpandedNodes({});
    setExpandedCellModels({});
  };

  // Toggle trait filter
  const toggleTraitFilter = (emoji: string) => {
    setSelectedTraits(prev => 
      prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]
    );
  };

  // Flashcards: Initialize Procvičování
  const initializeFlashcards = () => {
    const pool = taxonFlatList.filter(t => {
      const matchesPhylum = flashcardFilterPhylum === 'Vše' || 
        t.name === flashcardFilterPhylum ||
        t.breadcrumbs.some(b => b.name === flashcardFilterPhylum);
      const matchesRank = flashcardFilterRank === 'Vše' || t.type === flashcardFilterRank;
      return matchesPhylum && matchesRank;
    });
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setFlashcardPool(shuffled);
    setFlashcardIndex(0);
    setShowFlashcardAnswer(false);
  };

  useEffect(() => {
    if (activeTab === 'flashcards') {
      initializeFlashcards();
    }
  }, [activeTab, flashcardFilterPhylum, flashcardFilterRank]);

  const currentFlashcard = flashcardPool[flashcardIndex];

  const handleRateFlashcard = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentFlashcard) return;
    setFlashcardHistory(prev => ({ ...prev, [currentFlashcard.id]: difficulty }));
    
    if (flashcardIndex < flashcardPool.length - 1) {
      setFlashcardIndex(prev => prev + 1);
      setShowFlashcardAnswer(false);
    } else {
      alert("Výborně! Prošli jste všechny kartičky v aktuálním výběru. Spouštíme nové kolo s promíchaným pořadím.");
      initializeFlashcards();
    }
  };

  // Styles per rank — UCT Orange warm palette tiers
  const getRankStyles = (type?: string) => {
    switch (type) {
      case 'Kmen':    return { borderL: 'border-l-brand-orange',      bg: 'bg-orange-50 text-orange-700 border-orange-150',   text: 'text-orange-950 font-black' };
      case 'Třída':  return { borderL: 'border-l-amber-500',          bg: 'bg-amber-50 text-amber-700 border-amber-150',       text: 'text-amber-950 font-bold' };
      case 'Čeleď':  return { borderL: 'border-l-yellow-500',         bg: 'bg-yellow-50 text-yellow-700 border-yellow-150',    text: 'text-yellow-950 font-semibold' };
      case 'Rod':    return { borderL: 'border-l-brand-orange-text',  bg: 'bg-orange-50/60 text-orange-800 border-orange-200', text: 'text-orange-900 italic font-bold' };
      case 'Zástupce': return { borderL: 'border-l-rose-500',         bg: 'bg-rose-50 text-rose-700 border-rose-150',          text: 'text-rose-950 font-semibold' };
      default: return { borderL: 'border-l-slate-300', bg: 'bg-slate-50 text-slate-600 border-slate-200', text: 'text-slate-900 font-semibold' };
    }
  };

  // Render tree node recursively (Inline space-optimized list)
  const renderTreeNode = (item: WorksheetItem, depth = 0) => {
    // Check search/filter visibility
    if (!visibleNodeIds.has(item.id)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = treeExpandedNodes[item.id] !== false;
    const styles = getRankStyles(item.type);
    
    const correctEmojis = item.correctEmojis || [];
    const hasGroups = item.groups && item.groups.length > 0;
    const hasDirectTraits = correctEmojis.length > 0 || hasGroups;
    const showCellModel = !!expandedCellModels[item.id];

    // Build flat emojis list
    const allTraitsEmojis = [
      ...correctEmojis,
      ...(item.groups?.flatMap(g => g.correctEmojis) || [])
    ];

    return (
      <div key={item.id} className="flex flex-col">
        {/* Row block */}
        <div
          className={`
            relative flex items-start py-2.5 px-3 my-0.5 rounded-xl border border-slate-200/50 shadow-2xs transition-all duration-200 bg-white
            ${styles.borderL} border-l-4 hover:bg-slate-50/50
          `}
          style={{ marginLeft: `${depth * 14}px` }}
        >
          {/* Collapse toggle arrow */}
          <div className="flex-shrink-0 mt-0.5 w-5 flex items-center justify-center text-slate-400 select-none">
            {hasChildren ? (
              <button 
                onClick={() => setTreeExpandedNodes(prev => ({ ...prev, [item.id]: !isExpanded }))}
                className="p-0.5 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
              </button>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            )}
          </div>

          <div className="flex-1 ml-1.5 min-w-0 space-y-1">
            {/* Title line */}
            <div className="flex items-center flex-wrap gap-2 leading-none">
              <span className={`text-xs ${styles.text} tracking-tight`}>
                {item.name}
              </span>
              {item.type && (
                <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${styles.bg}`}>
                  {item.type}
                </span>
              )}

              {/* Inline visual model toggle */}
              {hasDirectTraits && allTraitsEmojis.length > 0 && (
                <button
                  onClick={() => setExpandedCellModels(prev => ({ ...prev, [item.id]: !showCellModel }))}
                  className="px-1.5 py-0.5 text-xs font-black text-brand-orange-text hover:text-brand-orange hover:bg-orange-50 border border-orange-200/50 rounded-md transition-all cursor-pointer flex items-center gap-0.5 select-none"
                >
                  <span>🔬</span>
                  <span>{showCellModel ? "Skrýt model" : "Model buňky"}</span>
                </button>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {item.description}
              </p>
            )}



            {/* Flat Inline Emojis output (Optimized Space) */}
            {hasDirectTraits && (
              <div className="pt-1 select-none">
                {hasGroups ? (
                  // Multi groups
                  <div className="flex flex-wrap gap-2 items-center">
                    {item.groups!.map(g => (
                      <div key={g.id} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-md text-[9px] font-black">
                        <span className="text-indigo-950/75 uppercase tracking-wider">{g.label}:</span>
                        <div className="flex gap-0.5 flex-wrap">
                          {getFlatEmojis(g.correctEmojis).map((item, eIdx) => (
                            <span 
                              key={eIdx}
                              className="inline-flex items-center bg-white border border-slate-100 px-1 rounded-sm text-[8px] font-bold text-slate-650"
                              title={item.label}
                            >
                              {item.emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Flat list (no groupings, saves height)
                  <div className="flex flex-wrap gap-1">
                    {getFlatEmojis(correctEmojis).map((item, eIdx) => (
                      <div 
                        key={eIdx}
                        className="inline-flex items-center gap-0.5 bg-indigo-50/50 border border-indigo-100/50 px-1.5 py-0.5 rounded-md text-[9px] text-indigo-950 font-bold hover:bg-indigo-100/30 transition-colors cursor-help"
                        title={item.label}
                      >
                        <span className="text-sm">{item.emoji}</span>
                        <span className="text-[8px] text-indigo-900/60 font-semibold">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Render cell simulator inline inside node */}
            {showCellModel && allTraitsEmojis.length > 0 && (
              <div className="pt-2 animate-scale-in">
                <CellMorphology taxonEmojis={allTraitsEmojis} className="bg-white/80" />
              </div>
            )}

          </div>
        </div>

        {/* Children nodes */}
        {hasChildren && isExpanded && (
          <div className="mt-0.5 border-l border-slate-200/60 ml-2 pl-0.5 space-y-0.5">
            {item.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Matrix comparison header configurations
  const matrixHeaders = [
    { key: 'G+', emoji: '🔵', label: 'Gram +' },
    { key: 'G-', emoji: '🔴', label: 'Gram -' },
    { key: 'tycka', emoji: '🌭', label: 'Tyčinka' },
    { key: 'kok', emoji: '⚪', label: 'Kok' },
    { key: 'spirala', emoji: '〰️', label: 'Spirála' },
    { key: 'aerob', emoji: '💨', label: 'Aerobní' },
    { key: 'anaerob', emoji: '🚫💨', label: 'Anaerobní' },
    { key: 'fakultativ', emoji: '🌗', label: 'Fakultativní' },
    { key: 'pohyb', emoji: '🏃', label: 'Pohyblivé' },
    { key: 'spory', emoji: '🛡️', label: 'Spory' },
    { key: 'patogen', emoji: '🦠', label: 'Patogen' },
  ];

  // Filtering for table matrix and stats
  const filteredList = useMemo(() => {
    if (!taxonFlatList) return [];
    return taxonFlatList.filter(taxon => {
      const allTaxonEmojis = [
        ...(taxon.correctEmojis || []),
        ...(taxon.groups?.flatMap(g => g.correctEmojis || []) || [])
      ];
      
      const query = searchQuery ? searchQuery.toLowerCase().trim() : '';
      const flatEmojis = allTaxonEmojis.map(e => (emojiOptions || []).find(o => o.emoji === e)?.label.toLowerCase() || '');

      const matchesText = !query || 
        (taxon.name && taxon.name.toLowerCase().includes(query)) ||
        (taxon.description && taxon.description.toLowerCase().includes(query)) ||
        (taxon.hint && taxon.hint.toLowerCase().includes(query)) ||
        flatEmojis.some(label => label && label.includes(query)) ||
        allTaxonEmojis.some(e => e && e.includes(query));

      const matchesPhylum = activePhylumFilter === 'Vše' || 
        taxon.name === activePhylumFilter ||
        (taxon.breadcrumbs && taxon.breadcrumbs.some(b => b.name === activePhylumFilter));

      const matchesRank = activeRankFilter === 'Vše' || taxon.type === activeRankFilter;

      const matchesTraits = selectedTraits.length === 0 || selectedTraits.every(traitEmoji => {
        if (traitEmoji === '🌭') {
          return allTaxonEmojis.some(e => ['🌭', '🌭🌭', '🌭🌭🌭'].includes(e));
        }
        if (traitEmoji === '⚪') {
          return allTaxonEmojis.some(e => ['⚪', '🟣', '🟣🟣', '🟣🟣🟣', '🍇', '8', '⛓️'].includes(e));
        }
        return allTaxonEmojis.includes(traitEmoji);
      });

      return matchesText && matchesPhylum && matchesTraits && matchesRank;
    });
  }, [taxonFlatList, searchQuery, activePhylumFilter, activeRankFilter, selectedTraits, emojiOptions]);

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50/40 via-slate-50 to-amber-50/20 text-slate-800 antialiased font-sans pb-16">
      
      {/* Header */}
      <header className="page-header bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="btn-ghost shrink-0"
              title="Zpět do Pracovního listu"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-linear-to-r from-brand-orange to-orange-500 rounded-xl shadow-lg shadow-brand-orange/10 shrink-0">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-black bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-amber-100 leading-none">
                  Studijní přehled: Atlas bakterií
                </h1>
                <p className="text-[10px] text-brand-peach font-bold uppercase tracking-wider mt-1 truncate">Interaktivní studijní centrum systematiky</p>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto shrink-0 select-none">
            {[
              { id: 'tree', label: 'Studijní strom', icon: Network },
              { id: 'flashcards', label: 'Samostudium', icon: Brain },
              { id: 'matrix', label: 'Srovnávací matice', icon: Table }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'tree') navigate('/mikrobiologie/studijni-strom');
                    else if (tab.id === 'flashcards') navigate('/mikrobiologie/samostudium');
                    else if (tab.id === 'matrix') navigate('/mikrobiologie/srovnavaci-matice');
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 mt-5">
        
        {/* TAB 1: INTERACTIVE STUDY TREE EXPLORER (Primary view, space optimized) */}
        {activeTab === 'tree' && (
          <div className="space-y-4">
            
            {/* Filter and control panel */}
            <Card className="p-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search query input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Vyhledat v taxonomickém stromu podle názvu, popisu nebo vlastností..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-brand-orange outline-none rounded-xl text-xs sm:text-sm transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Phylum filter */}
                <div className="w-full sm:w-48 shrink-0">
                  <select
                    value={activePhylumFilter}
                    onChange={(e) => setActivePhylumFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-brand-orange rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="Vše">Všechny kmeny</option>
                    {availablePhyla.map(phylum => (
                      <option key={phylum} value={phylum}>{phylum}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Trait multi-select checkbox badges */}
              <div className="flex flex-wrap gap-1.5 items-center border-t border-slate-100 pt-3 select-none">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-2">Znaky:</span>
                {selectableTraits.map(trait => {
                  const isSelected = selectedTraits.includes(trait.emoji);
                  return (
                    <button
                      key={trait.emoji}
                      onClick={() => toggleTraitFilter(trait.emoji)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand-orange border-orange-600 text-white shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{trait.emoji}</span>
                      <span>{trait.label}</span>
                    </button>
                  );
                })}
                {selectedTraits.length > 0 && (
                  <button
                    onClick={() => setSelectedTraits([])}
                    className="px-2 py-1 text-[9px] font-black text-red-500 hover:bg-red-550 rounded-lg border border-dashed border-red-200 transition-all cursor-pointer"
                  >
                    Vymazat
                  </button>
                )}
              </div>

              {/* Expand / Collapse Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleExpandAll}
                    className="px-3 py-1 bg-brand-peach/40 hover:bg-brand-peach text-brand-orange-text rounded-lg text-[10px] font-black transition-all cursor-pointer border border-brand-orange/20"
                  >
                     Rozbalit vše
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-655 rounded-lg text-[10px] font-black transition-all cursor-pointer border border-slate-200"
                  >
                     Zabalit vše
                  </button>
                </div>
                
                <span className="text-[10px] font-bold text-slate-400">
                  Nalezeno: {visibleNodeIds.size} / {taxonFlatList.length} taxonů
                </span>
              </div>
            </Card>

            {/* Tree listing (Full-width, highly space-optimized) */}
            <Card className="p-4 sm:p-5 space-y-1">
              {visibleNodeIds.size > 0 ? (
                data.map(item => renderTreeNode(item))
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-350">
                    <Info size={20} />
                  </div>
                  <div className="text-xs font-bold">Žádné shody nebyly nalezeny</div>
                  <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                    Zkuste upravit vyhledávání nebo odkliknout vybrané emodži filtry.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 2: ACTIVE RECALL FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="max-w-xl mx-auto space-y-5">
            {/* Filter Configuration */}
            <Card className="p-3.5 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1"><Filter size={11} /> Procvičit:</span>
                <select
                  value={flashcardFilterPhylum}
                  onChange={(e) => setFlashcardFilterPhylum(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 focus:border-brand-orange outline-none rounded-lg text-xs font-extrabold text-slate-700 cursor-pointer"
                >
                  <option value="Vše">Všechny kmeny</option>
                  {availablePhyla.map(phylum => (
                    <option key={phylum} value={phylum}>{phylum}</option>
                  ))}
                </select>
                <select
                  value={flashcardFilterRank}
                  onChange={(e) => setFlashcardFilterRank(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 focus:border-brand-orange outline-none rounded-lg text-xs font-extrabold text-slate-700 cursor-pointer"
                >
                  <option value="Vše">Všechny ranky</option>
                  {['Kmen', 'Třída', 'Čeleď', 'Rod', 'Zástupce'].map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
              
              <Button
                onClick={initializeFlashcards}
                variant="secondary"
                size="sm"
              >
                <RefreshCw size={11} />
                <span>Restart</span>
              </Button>
            </Card>

            {/* Flashcard item */}
            {currentFlashcard ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-1 select-none">
                  <span>Otázka: {flashcardIndex + 1} / {flashcardPool.length}</span>
                  <span className="text-brand-orange-text font-extrabold">
                    Znalost: {Object.values(flashcardHistory).filter(v => v === 'easy').length} umím
                  </span>
                </div>
                
                <div 
                  className={`bg-white rounded-2xl border-2 p-6 flex flex-col justify-between min-h-[200px] shadow-sm transition-all duration-300 ${
                    showFlashcardAnswer ? 'border-brand-orange shadow-[0_0_0_3px_rgba(249,93,18,0.1)]' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {currentFlashcard.breadcrumbs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-0.5 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                        {currentFlashcard.breadcrumbs.map((crumb, idx) => (
                          <div key={idx} className="flex items-center gap-0.5">
                            <span>{crumb.name}</span>
                            {idx < currentFlashcard.breadcrumbs.length - 1 && <span>❯</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 flex-wrap leading-none">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{currentFlashcard.name}</h3>
                      {currentFlashcard.type && (
                        <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider border select-none ${getRankStyles(currentFlashcard.type).bg}`}>
                          {currentFlashcard.type}
                        </span>
                      )}
                    </div>

                    {currentFlashcard.description && (
                      <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed font-semibold">
                        {currentFlashcard.description}
                      </p>
                    )}
                  </div>

                  {/* Answers section */}
                  <div className="mt-6 border-t border-slate-100 pt-4 space-y-4">
                    {!showFlashcardAnswer ? (
                      <div className="text-center space-y-3">
                        <div className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1 select-none">
                          <HelpCircle size={13} className="text-amber-500" />
                          <span>Vybavte si biologické vlastnosti (emodži) pro tento taxon</span>
                        </div>
                        <Button
                          onClick={() => setShowFlashcardAnswer(true)}
                          variant="primary"
                        >
                          Odhalit správné vlastnosti
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-scale-in">
                        {/* Emojis tags list flat */}
                        {currentFlashcard.groups && currentFlashcard.groups.length > 0 ? (
                          <div className="space-y-2">
                            {currentFlashcard.groups.map(g => (
                              <div key={g.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                                <span className="text-[9px] font-black text-indigo-900 uppercase tracking-wider shrink-0">{g.label}:</span>
                                <div className="flex flex-wrap gap-1">
                                  {g.correctEmojis.map(emoji => (
                                    <span 
                                      key={emoji}
                                      className="inline-flex items-center bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-slate-650 shadow-2xs"
                                      title={(emojiOptions || []).find(o => o.emoji === emoji)?.label || emoji}
                                    >
                                      {emoji}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {getFlatEmojis(currentFlashcard.correctEmojis).map(item => (
                              <span 
                                key={item.emoji}
                                className="inline-flex items-center gap-1 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-lg text-[9px] font-extrabold text-orange-950 shadow-2xs"
                              >
                                <span>{item.emoji}</span>
                                <span>{item.label}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Cell visual model */}
                        <CellMorphology 
                          taxonEmojis={[
                            ...currentFlashcard.correctEmojis,
                            ...(currentFlashcard.groups?.flatMap(g => g.correctEmojis) || [])
                          ]} 
                          className="bg-white"
                        />

                        {/* Knowledge rating */}
                        <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 select-none">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Úroveň vaší odpovědi:</span>
                          <div className="flex gap-1.5 w-full sm:w-auto">
                            <button
                              onClick={() => handleRateFlashcard('hard')}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              <Frown size={13} className="text-orange-600" />
                              Neumím
                            </button>
                            <button
                              onClick={() => handleRateFlashcard('medium')}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-100/70 hover:bg-amber-200/70 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              <HelpCircle size={13} className="text-amber-800" />
                              Skoro
                            </button>
                            <button
                              onClick={() => handleRateFlashcard('easy')}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-1.5 bg-brand-orange hover:bg-brand-orange-text text-white rounded-lg text-[11px] font-extrabold shadow-sm shadow-brand-orange/15 cursor-pointer active:scale-[0.98] transition-all"
                            >
                              <Smile size={13} />
                              Umím!
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Card className="py-12 text-center space-y-3">
                <div className="p-3 bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-400">
                  <Brain size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Prázdný balíček</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Pro tento kmen nebo rank nebyly nalezeny žádné taxony k procvičování.
                </p>
                <Button
                  onClick={() => { setFlashcardFilterPhylum('Vše'); setFlashcardFilterRank('Vše'); }}
                  variant="primary"
                >
                  Resetovat filtry
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* TAB 3: COMPARATIVE TRAIT MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            
            {/* Table Matrix Header Controls */}
            <Card className="p-4 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Table size={16} className="text-brand-orange" />
                  Srovnávací matice vlastností a znaků
                </h2>
                <div className="flex items-center gap-2 flex-wrap mt-1 select-none">
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                    Přehledné porovnání všech vlastností u vyfiltrovaných taxonů
                  </p>
                  <span className="hidden sm:inline h-3.5 w-[1px] bg-slate-200" />
                  <span className="text-[10px] text-brand-orange-text font-black uppercase tracking-wider">
                    Zobrazeno {filteredList.length} z {taxonFlatList.length} taxonů
                  </span>
                  {(searchQuery || activePhylumFilter !== 'Vše' || activeRankFilter !== 'Vše' || selectedTraits.length > 0) && (
                    <button
                      onClick={() => { setSearchQuery(''); setActivePhylumFilter('Vše'); setActiveRankFilter('Vše'); setSelectedTraits([]); }}
                      className="ml-1 text-[9px] font-black text-red-500 hover:bg-red-50 px-1.5 py-0.5 rounded-md border border-dashed border-red-200 transition-all cursor-pointer"
                    >
                      Resetovat filtry
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={activePhylumFilter}
                  onChange={(e) => setActivePhylumFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-brand-orange outline-none rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="Vše">Všechny kmeny</option>
                  {availablePhyla.map(phylum => (
                    <option key={phylum} value={phylum}>{phylum}</option>
                  ))}
                </select>
                <select
                  value={activeRankFilter}
                  onChange={(e) => setActiveRankFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-brand-orange outline-none rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="Vše">Všechny ranky</option>
                  {['Kmen', 'Třída', 'Čeleď', 'Rod', 'Zástupce'].map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Matrix Table */}
            {filteredList.length > 0 ? (
              <Card className="overflow-hidden p-0 border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-wider select-none">
                        <th className="p-3 sticky left-0 bg-slate-50 z-10 w-60 border-r border-slate-200 shadow-2xs">Taxon</th>
                        <th className="p-3 border-r border-slate-200 w-24">Rank</th>
                        {matrixHeaders.map(h => (
                          <th key={h.key} className="p-3 text-center border-r border-slate-200" title={h.label}>
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-base leading-none">{h.emoji}</span>
                              <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{h.key}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredList.map(t => {
                        const allTaxonEmojis = [
                          ...(t.correctEmojis || []),
                          ...(t.groups?.flatMap(g => g.correctEmojis || []) || [])
                        ];
                        const styles = getRankStyles(t.type);

                        return (
                          <tr key={t.id} className="hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700">
                            {/* Taxon Name sticky */}
                            <td className="p-3 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 font-extrabold text-slate-900 shadow-2xs">
                              {t.name}
                            </td>
                            {/* Rank */}
                            <td className="p-3 border-r border-slate-200">
                              <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${styles.bg}`}>
                                {t.type || 'Neznámý'}
                              </span>
                            </td>
                            {/* Traits columns */}
                            {matrixHeaders.map(h => {
                              let hasTrait = false;
                              if (h.emoji === '🌭') {
                                hasTrait = allTaxonEmojis.some(e => ['🌭', '🌭🌭', '🌭🌭🌭'].includes(e));
                              } else if (h.emoji === '⚪') {
                                hasTrait = allTaxonEmojis.some(e => ['⚪', '🟣', '🟣🟣', '🟣🟣🟣', '🍇', '8', '⛓️'].includes(e));
                              } else {
                                hasTrait = allTaxonEmojis.includes(h.emoji);
                              }

                              return (
                                <td key={h.key} className={`p-3 text-center border-r border-slate-200 ${hasTrait ? 'bg-indigo-50/10' : ''}`}>
                                  {hasTrait ? (
                                    <div className="flex items-center justify-center">
                                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-black">
                                        ✓
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-350 font-medium select-none">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="py-12 px-4 text-center max-w-lg mx-auto space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-400">
                  <Table size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Matice je prázdná</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-2">
                  Pro zvolené filtry nebyly nalezeny žádné zástupce v matici.
                </p>
                <Button
                  onClick={() => { setSearchQuery(''); setActivePhylumFilter('Vše'); setActiveRankFilter('Vše'); setSelectedTraits([]); }}
                  variant="primary"
                >
                  Resetovat všechny filtry
                </Button>
              </Card>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
