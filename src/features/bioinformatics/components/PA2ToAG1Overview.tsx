import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Layers, Star, ChevronDown, ChevronUp, BookOpen, GraduationCap, Users, Terminal } from 'lucide-react';
import { materialsData, SchoolMaterial, SchoolMaterialNode } from '../data/materialsData';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';


const MaterialTreeNodeRenderer = ({ node, depth = 0 }: { node: SchoolMaterialNode, depth?: number }) => {
  const isRelevant = node.relevance >= 70;
  const isGoodQuality = node.quality >= 3;
  
  let rowStyle = 'flex flex-col py-1.5 border-b border-slate-100/50 last:border-0';
  if (depth > 0) {
     rowStyle += ' ml-2 pl-2 border-l border-slate-200/60 mt-0.5';
  }
  if (isRelevant && !isGoodQuality) {
     rowStyle += ' grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all';
  } else if (!isRelevant) {
     rowStyle += ' opacity-50 hover:opacity-80 transition-all';
  }

  return (
    <div className={rowStyle}>
       <div className="flex justify-between items-start gap-2">
         <span className={`text-[10px] leading-tight ${depth === 0 ? 'font-bold text-slate-700' : 'font-medium text-slate-500'}`}>
            {node.name}
         </span>
         
         <div className="flex gap-2.5 items-center shrink-0 mt-0.5">
            <div className="flex items-center gap-1.5 w-12" title={`Relevance: ${node.relevance}%`}>
               <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${isRelevant ? 'bg-emerald-400' : 'bg-slate-300'}`} style={{ width: `${Math.max(node.relevance, 5)}%` }} />
               </div>
            </div>
            
            <div className="flex w-8" title={`Kvalita: ${node.quality}/5`}>
               {[1,2,3,4,5].map(star => (
                 <Star key={star} size={6} className={star <= node.quality ? "fill-amber-400 text-amber-400" : "text-slate-100"} />
               ))}
            </div>
         </div>
       </div>
       
       {node.aiReasoning && (
         <p className="text-[8.5px] text-slate-400 mt-0.5 italic leading-tight">{node.aiReasoning}</p>
       )}
       
       {node.children && node.children.length > 0 && (
         <div className="mt-1 flex flex-col">
           {node.children.map(child => <MaterialTreeNodeRenderer key={child.id} node={child} depth={depth + 1} />)}
         </div>
       )}
    </div>
  );
};

export function PA2ToAG1Overview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'E-learning' | 'Lectures' | 'Seminars' | 'Trainer'>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hideNotNeeded, setHideNotNeeded] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
    );
  };

  const expandAllWeeks = () => setExpandedWeeks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const collapseAllWeeks = () => setExpandedWeeks([]);

  const weekInfo = useMemo(() => [
    { num: 1, title: "Úvod do C++ & Reference", desc: "Základní syntax, správa paměti, namespacy, reference, const" },
    { num: 2, title: "Zapouzdření & Třídy", desc: "Třídy, zapouzdření, konstruktory/destruktory, konstantní metody" },
    { num: 3, title: "Přetěžování operátorů", desc: "Přetěžování operátorů (včetně porovnávání pro set/map)" },
    { num: 4, title: "Kopírování & Move sémantika", desc: "Hluboká kopie, Rule of Five, Move sémantika" },
    { num: 5, title: "Řetězce & Knihovna STL", desc: "Znakové řetězce std::string, vector, list, iterátory" },
    { num: 6, title: "Pokročilé STL", desc: "Statistiky slov, mapy, benchmarky kontejnerů v C++" },
    { num: 7, title: "Výjimky & Hledání cest", desc: "Ošetření chyb (Exceptions) a procházení grafů (BFS/DFS/Dijkstra)" },
    { num: 8, title: "Dědičnost & Polymorfismus", desc: "Dědičnost, virtuální metody, abstraktní třídy, vtabulka" },
    { num: 9, title: "Šablony & Datové struktury", desc: "Šablony funkcí a tříd, stack, queue, priority_queue" },
    { num: 10, title: "Šablony II & Vyhledávací stromy", desc: "Šablony polí, spojové seznamy, binární vyhledávací stromy" },
    { num: 11, title: "Grafové algoritmy", desc: "Reprezentace grafů, BFS a DFS průchody, stromy a grafy" },
    { num: 12, title: "Textové algoritmy & Opakování", desc: "Vyhledávání v textu, balíčkovací systém, opakování před zkouškou" },
  ], []);

  const getWeekNumber = (item: SchoolMaterial): number => {
    if (item.category === 'Trainer') {
      const match = item.name.match(/(?:Tyden|Týden)\s+(\d+)/i);
      if (match) {
        const weekNum = parseInt(match[1], 10);
        switch (weekNum) {
          case 1: return 1;
          case 2: return 2;
          case 3: return 5; // Základní kontejnery -> Week 5
          case 4: return 3; // Operátory -> Week 3
          case 5: return 4; // Kopie a přesouvání -> Week 4
          case 6: return 6; // Pokročilejší STL -> Week 6
          case 7: return 7; // Procházení grafů -> Week 7
          case 8: return 8; // Polymorfismus I -> Week 8
          case 9: return 8; // Polymorfismus II -> Week 8
          case 10: return 10; // Šablony -> Week 10
          case 11: return 10; // Šablony II -> Week 10
          case 12: return 12; // Procvičování -> Week 12
          default: return weekNum;
        }
      }
      return 12;
    }
    if (item.category === 'Lectures') {
      const match = item.name.match(/Téma\s+(\d+)/i);
      if (match) {
        const temaNum = parseInt(match[1], 10);
        switch (temaNum) {
          case 1: return 1;
          case 2: return 2;
          case 3: return 3;
          case 4: return 4;
          case 5: return 5;
          case 6: return 7; // Základní grafové algoritmy -> Week 7
          case 7: return 8; // Dědění a polymorfismus -> Week 8
          case 8: return 8; // Abstraktní třídy -> Week 8
          case 9: return 9; // Šablony -> Week 9
          case 10: return 10; // Binary Heap -> Week 10
          case 11: return 6; // Hash Tables -> Week 6
          case 12: return 12; // Textové algoritmy -> Week 12
          default: return temaNum;
        }
      }
      return 12;
    }
    if (item.category === 'Seminars') {
      const match = item.name.match(/(?:Proseminář|Proseminar)\s+(\d+)/i);
      if (match) {
        const semNum = parseInt(match[1], 10);
        switch (semNum) {
          case 1: return 1;
          case 2: return 2;
          case 3: return 5; // Iterátory, vector/list -> Week 5
          case 4: return 3; // Přetěžování operátorů -> Week 3
          case 5: return 4; // Správa paměti -> Week 4
          case 6: return 4; // Move sémantika -> Week 4
          case 7: return 7; // Grafy a BFS/DFS -> Week 7
          case 8: return 8; // Dědění -> Week 8
          case 9: return 8; // Polymorfní kontejnery -> Week 8
          case 10: return 9; // Šablony -> Week 9
          case 11: return 7; // Výjimky -> Week 7
          case 12: return 12; // Opakování -> Week 12
          default: return semNum;
        }
      }
      return 12;
    }
    if (item.category === 'E-learning') {
      const match = item.name.match(/Kapitola\s+(\d+)/i);
      if (match) {
        const cap = parseInt(match[1], 10);
        switch (cap) {
          case 2:
          case 3:
            return 1;
          case 4:
            return 2;
          case 5:
            return 2;
          case 6:
            return 3;
          case 7:
            return 4;
          case 8:
            return 5;
          case 9:
            return 7;
          case 10:
            return 9;
          case 11:
            return 9;
          case 12:
            return 11;
          case 13:
            return 8;
          default:
            return 1;
        }
      }
    }
    return 12;
  };


  // Unique tags mapping for filtering
  const tagList = [
    { key: "basics", label: "Základy C++", variant: "slate" as const },
    { key: "oop", label: "Objektově orientované (OOP)", variant: "blue" as const },
    { key: "stl", label: "Knihovna STL", variant: "purple" as const },
    { key: "templates", label: "Šablony (Templates)", variant: "rose" as const },
    { key: "algorithms-graphs", label: "Grafy & Algoritmy", variant: "green" as const },
    { key: "architecture", label: "Architektura / OOP koncept", variant: "orange" as const },
    { key: "development-tools", label: "Vývojové nástroje", variant: "slate" as const },
    { key: "bad-material", label: "Nekvalitní texty (Špatné vysvětlení)", variant: "red" as const },
    { key: "easy", label: "Snadné", variant: "slate" as const },
    { key: "not-needed", label: "Není v AG1", variant: "red" as const },
  ];

  const handleToggleTag = (tagKey: string) => {
    setSelectedTags(prev =>
      prev.includes(tagKey) ? prev.filter(t => t !== tagKey) : [...prev, tagKey]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTags([]);
    setHideNotNeeded(false);
  };

  // Filter materials based on search, category, tag selections, and hidden status
  const filteredMaterials = useMemo(() => {
    return materialsData.filter(item => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.aiReasoning.toLowerCase().includes(query) ||
        item.tags.some(t => t.toLowerCase().includes(query));

      // 2. Category Tab
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      // 3. Tag Selection (AND selection)
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => item.tags.includes(tag));

      // 4. Hide low relevance (relevance < 70)
      const matchesHideNotNeeded = !hideNotNeeded || item.relevance >= 70;

      return matchesSearch && matchesCategory && matchesTags && matchesHideNotNeeded;
    });
  }, [searchQuery, selectedCategory, selectedTags, hideNotNeeded]);

  const groupedByWeek = useMemo(() => {
    const groups: Record<number, Record<string, SchoolMaterial[]>> = {};
    for (let w = 1; w <= 12; w++) {
      groups[w] = {
        'Trainer': [],
        'Lectures': [],
        'Seminars': [],
        'E-learning': []
      };
    }
    filteredMaterials.forEach(item => {
      const w = getWeekNumber(item);
      if (groups[w] && groups[w][item.category]) {
        groups[w][item.category].push(item);
      }
    });
    return groups;
  }, [filteredMaterials]);

  const visibleWeeks = useMemo(() => {
    return weekInfo.filter(week => {
      const categories = groupedByWeek[week.num];
      if (!categories) return false;
      return Object.values(categories).some(list => list.length > 0);
    });
  }, [groupedByWeek, weekInfo]);

  // Statistics summaries
  const stats = useMemo(() => {
    const total = materialsData.length;
    const critical = materialsData.filter(m => m.relevance === 100).length;
    const important = materialsData.filter(m => m.relevance >= 70 && m.relevance < 100).length;
    const lowRelevance = materialsData.filter(m => m.relevance < 70).length;
    
    // Quality groupings
    const badQuality = materialsData.filter(m => m.quality < 3).length;
    const highQuality = materialsData.filter(m => m.quality >= 3).length;

    return { total, critical, important, lowRelevance, badQuality, highQuality };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-linear-to-br from-amber-50/50 to-orange-50/40 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="p-3 bg-brand-orange/10 rounded-2xl border border-brand-orange/20 text-brand-orange flex-shrink-0">
          <Layers size={28} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-wide">
            C++ PA2 → AG1 Kompatibilita (AI Přehled osnov)
          </h2>
          <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-medium">
            Materiály byly kompletně přehodnoceny z pohledu požadavků navazujícího předmětu <strong>AG1 (Algoritmy a Grafy 1)</strong>. 
            Můžete filtrovat a barevně odlišit užitečné a kvalitní pasáže od nekvalitních textů či nepodstatné teorie.
          </p>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-white/70">
          <span className="text-2xl font-black text-slate-850">{stats.total}</span>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">Celkem témat</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-emerald-500/[0.03] border-emerald-500/20">
          <span className="text-2xl font-black text-emerald-600">{stats.critical + stats.important}</span>
          <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider mt-1">Relevantní (&ge;70%)</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-orange-500/[0.02] border-amber-500/20">
          <span className="text-2xl font-black text-amber-600">{stats.badQuality}</span>
          <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider mt-1">Nekvalitní (Kvalita &lt; 3)</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-rose-500/[0.02] border-rose-500/10">
          <span className="text-2xl font-black text-rose-500">{stats.lowRelevance}</span>
          <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider mt-1">Nepodstatné (&lt;70%)</span>
        </Card>
      </div>

      {/* Filtering and Search Controls Card */}
      <Card className="p-5 space-y-4 bg-white/80">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Vyhledat v názvu, značkách nebo AI zdůvodnění..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-brand-orange rounded-xl outline-hidden transition-all text-xs font-semibold"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['All', 'Trainer', 'Lectures', 'Seminars', 'E-learning'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-brand-orange-text shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat === 'All' ? 'Vše' : cat === 'Trainer' ? 'Trainer (Fav)' : cat === 'Lectures' ? 'Přednášky' : cat === 'Seminars' ? 'Prosemináře' : 'E-learning'}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox toggles */}
        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideNotNeeded}
              onChange={(e) => setHideNotNeeded(e.target.checked)}
              className="rounded-sm border-slate-300 text-brand-orange focus:ring-brand-orange"
            />
            Skrýt nepotřebné materiály (Relevance &lt; 70%)
          </label>
        </div>

        {/* Tag filters selection */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Filtrovat podle štítků (AND):</p>
          <div className="flex flex-wrap gap-1.5">
            {tagList.map(tag => {
              const isSelected = selectedTags.includes(tag.key);
              return (
                <button
                  key={tag.key}
                  onClick={() => handleToggleTag(tag.key)}
                  className={`
                    px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer active:scale-95
                    ${isSelected 
                      ? 'bg-brand-orange border-brand-orange text-white shadow-xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                    }
                  `}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset filters button */}
        {(searchQuery || selectedCategory !== 'All' || selectedTags.length > 0 || hideNotNeeded) && (
          <div className="flex justify-end border-t border-slate-100 pt-2.5">
            <Button
              onClick={handleClearFilters}
              variant="secondary"
              size="sm"
            >
              Resetovat filtry
            </Button>
          </div>
        )}
      </Card>

      {/* Accordion Controls */}
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200/80 rounded-xl p-3 shadow-xs">
        <span className="text-xs font-bold text-slate-500">
          Zobrazeno {filteredMaterials.length} z {materialsData.length} témat
        </span>
        <div className="flex gap-2">
          <Button
            onClick={expandAllWeeks}
            variant="secondary"
            size="sm"
            className="text-[10px] font-bold px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-all"
          >
            Rozbalit vše
          </Button>
          <Button
            onClick={collapseAllWeeks}
            variant="secondary"
            size="sm"
            className="text-[10px] font-bold px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-all"
          >
            Sbalit vše
          </Button>
        </div>
      </div>

      {/* Tree structure of Weeks Accordion */}
      <div className="space-y-4">
        {visibleWeeks.map((week) => {
          const isExpanded = expandedWeeks.includes(week.num);
          const weekCategories = groupedByWeek[week.num];
          
          let totalCount = 0;
          let relevantCount = 0;
          let warningCount = 0;
          
          Object.values(weekCategories).forEach((list) => {
            list.forEach((item) => {
              totalCount++;
              if (item.relevance >= 70) {
                relevantCount++;
                if (item.quality < 3) {
                  warningCount++;
                }
              }
            });
          });
          
          const hasRelevant = relevantCount > 0;
          const hasWarning = warningCount > 0;
          const stripeColor = hasRelevant 
            ? (hasWarning ? 'bg-amber-500' : 'bg-emerald-500') 
            : 'bg-slate-300';
            
          const headerBg = isExpanded
            ? 'bg-linear-to-r from-slate-50 to-white border-slate-300 shadow-xs'
            : 'bg-white hover:bg-slate-50/50 border-slate-200 hover:border-slate-350';

          return (
            <div key={week.num} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 bg-white">
              {/* Clickable Week Header */}
              <div
                onClick={() => toggleWeek(week.num)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer select-none transition-all duration-200 relative ${headerBg}`}
              >
                {/* Left accent stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripeColor}`} />
                
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pl-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-brand-orange-text bg-brand-orange/10 px-2 py-0.5 rounded-lg border border-brand-orange/20 min-w-[70px] text-center">
                      {week.num}. Týden
                    </span>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">
                      {week.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 max-w-sm line-clamp-1">
                    {week.desc}
                  </span>
                </div>
                
                {/* Week Stats Summary & Chevron */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="hidden sm:flex gap-1.5 items-center">
                    <Badge variant="slate" className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase">
                      {totalCount} celkem
                    </Badge>
                    {relevantCount > 0 && (
                      <Badge variant="green" className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase bg-emerald-500/10 border-emerald-500/20 text-emerald-600">
                        {relevantCount} relevantní
                      </Badge>
                    )}
                    {warningCount > 0 && (
                      <Badge variant="orange" className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase bg-amber-500/10 border-amber-500/20 text-amber-600 animate-pulse">
                        {warningCount} varování
                      </Badge>
                    )}
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Week Body */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-x divide-slate-100">
                    {(['Trainer', 'Lectures', 'Seminars', 'E-learning'] as const).map((categoryKey) => {
                      const items = weekCategories[categoryKey];
                      
                      let categoryIcon = null;
                      let categoryLabel = '';
                      let categoryColorClass = '';
                      let columnBg = '';
                      
                      switch (categoryKey) {
                        case 'Trainer':
                          categoryIcon = <Terminal size={10} />;
                          categoryLabel = 'Trainer';
                          categoryColorClass = 'text-orange-600 bg-orange-50/80 border-orange-200/40';
                          columnBg = 'bg-orange-50/20';
                          break;
                        case 'Lectures':
                          categoryIcon = <GraduationCap size={10} />;
                          categoryLabel = 'Přednášky';
                          categoryColorClass = 'text-indigo-600 bg-indigo-50/80 border-indigo-200/40';
                          columnBg = 'bg-indigo-50/10';
                          break;
                        case 'Seminars':
                          categoryIcon = <Users size={10} />;
                          categoryLabel = 'Prosemináře';
                          categoryColorClass = 'text-blue-600 bg-blue-50/80 border-blue-200/40';
                          columnBg = 'bg-blue-50/10';
                          break;
                        case 'E-learning':
                          categoryIcon = <BookOpen size={10} />;
                          categoryLabel = 'E-learning';
                          categoryColorClass = 'text-rose-600 bg-rose-50/80 border-rose-200/40';
                          columnBg = 'bg-rose-50/10';
                          break;
                      }
                      
                      return (
                        <div key={categoryKey} className={`p-3 flex flex-col gap-2 min-w-0 ${columnBg}`}>
                          {/* Column Header */}
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border self-start ${categoryColorClass}`}>
                            {categoryIcon}
                            <span>{categoryLabel}</span>
                          </div>
                          
                          {items.length === 0 ? (
                            <p className="text-[9px] text-slate-300 italic py-2">—</p>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {items.map((item) => {
                                const isRelevant = item.relevance >= 70;
                                const isGoodQuality = item.quality >= 3;
                                
                                let rowClass = 'rounded-lg border p-2 transition-all duration-200';
                                let barColor = '';
                                
                                if (isRelevant && isGoodQuality) {
                                  rowClass += ' bg-white border-emerald-200/40 hover:border-emerald-400/60';
                                  barColor = 'bg-emerald-500';
                                } else if (isRelevant && !isGoodQuality) {
                                  rowClass += ' bg-slate-50/60 border-amber-300/30 grayscale-[0.7] opacity-65 hover:grayscale-0 hover:opacity-100';
                                  barColor = 'bg-amber-400';
                                } else {
                                  rowClass += ' bg-slate-50/40 border-slate-200/40 opacity-50 hover:opacity-80';
                                  barColor = 'bg-slate-300';
                                }
                                
                                return (
                                  <div key={item.id} className={rowClass}>
                                    {/* Item Header Row */}
                                    <div className="flex items-start gap-1.5">
                                      <div className={`w-0.5 h-full min-h-3 rounded-full shrink-0 mt-0.5 ${barColor}`} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                          <h4 className="text-[10px] font-bold text-slate-700 leading-tight line-clamp-2">
                                            {item.name}
                                          </h4>
                                          <span className={`text-[8px] font-black shrink-0 ${item.relevance >= 70 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {item.relevance}%
                                          </span>
                                        </div>
                                        
                                        {/* Compact metrics row */}
                                        <div className="flex items-center gap-2 mt-1">
                                          {/* Relevance bar */}
                                          <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                              className={`h-full rounded-full ${item.relevance >= 80 ? 'bg-emerald-400' : item.relevance >= 70 ? 'bg-amber-400' : 'bg-slate-300'}`}
                                              style={{ width: `${Math.max(item.relevance, 3)}%` }}
                                            />
                                          </div>
                                          
                                          {/* Quality stars */}
                                          <div className="flex shrink-0">
                                            {[1,2,3,4,5].map(s => (
                                              <Star key={s} size={7} className={s <= item.quality ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                            ))}
                                          </div>
                                        </div>
                                        
                                        {/* AI reasoning (compact) */}
                                        {item.aiReasoning && (
                                          <p className="text-[8px] text-slate-400 mt-1 leading-tight italic line-clamp-2">
                                            {item.aiReasoning}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Children tree */}
                                    {item.children && item.children.length > 0 && (
                                      <div className="mt-1.5 pt-1.5 border-t border-dashed border-slate-100">
                                        {item.children.map(child => (
                                          <MaterialTreeNodeRenderer key={child.id} node={child} depth={0} />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visibleWeeks.length === 0 && (
          <div className="py-12 text-center bg-white/50 rounded-2xl border border-dashed border-slate-350">
            <AlertTriangle className="mx-auto text-amber-500 mb-2 animate-bounce-subtle" size={28} />
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide">Nebyly nalezeny žádné materiály</h4>
            <p className="text-xs text-slate-450 mt-1">Zkuste resetovat vyhledávání nebo filtry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
