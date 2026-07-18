import { useState, useMemo } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, BookOpen, GraduationCap, Users, Terminal } from 'lucide-react';
import { materialsData, SchoolMaterial, SchoolMaterialNode } from '../data/materialsData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Helper function to extract all leaf topics (nodes with no children or empty children)
function getLeafNodes(node: SchoolMaterialNode): SchoolMaterialNode[] {
  if (!node.children || node.children.length === 0) {
    return [node];
  }
  return node.children.flatMap(getLeafNodes);
}

// Helper function to parse markdown-style links [text](url) inside names
function renderNameWithLinks(name: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(name)) !== null) {
    const textBefore = name.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(textBefore);
    }

    const linkText = match[1];
    const linkUrl = match[2];

    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-orange hover:text-brand-orange-text underline"
        onClick={(e) => e.stopPropagation()}
      >
        {linkText}
      </a>
    );

    lastIndex = linkRegex.lastIndex;
  }

  const textAfter = name.substring(lastIndex);
  if (textAfter) {
    parts.push(textAfter);
  }

  return parts.length > 0 ? parts : name;
}

export function PA2ToAG1Overview() {
  // Collapse by default — expanding all 12 weeks was a large first-paint cost
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
    );
  };


  const weekInfo = useMemo(() => [
    { num: 1, title: "Základní konstrukce C++", desc: "Základní syntax, správa paměti, namespacy, reference, const" },
    { num: 2, title: "Úvod do OOP", desc: "Třídy, zapouzdření, konstruktory/destruktory, konstantní metody" },
    { num: 3, title: "Operátory", desc: "Přetěžování operátorů (včetně porovnávání pro set/map)" },
    { num: 4, title: "Základní kontejnery", desc: "Znakové řetězce std::string, vector, list, iterátory" },
    { num: 5, title: "Pokročilejší STL", desc: "Statistiky slov, mapy, benchmarky kontejnerů v C++" },
    { num: 6, title: "Kopie a přesouvání", desc: "Hluboká kopie, Rule of Five, Move sémantika" },
    { num: 7, title: "Procházení grafů", desc: "Ošetření chyb (Exceptions) a procházení grafů (BFS/DFS/Dijkstra)" },
    { num: 8, title: "Šablony", desc: "Šablony funkcí a tříd, stack, queue, priority_queue" },
    { num: 9, title: "Šablony II", desc: "Šablony polí, spojové seznamy, binární vyhledávací stromy" },
    { num: 10, title: "Polymorfismus I", desc: "Dědičnost, virtuální metody, abstraktní třídy, vtabulka" },
    { num: 11, title: "Polymorfismus II", desc: "Polymorfní kontejnery, heterogenní seznamy" },
    { num: 12, title: "Procvičování", desc: "Vyhledávání v textu, balíčkovací systém, opakování před zkouškou" },
  ], []);

  const getWeekNumber = (item: SchoolMaterial): number => {
    if (item.category === 'Trainer') {
      const match = item.name.match(/(?:Tyden|Týden)\s+(\d+)/i);
      if (match) {
        const weekNum = parseInt(match[1], 10);
        switch (weekNum) {
          case 1: return 1;
          case 2: return 2;
          case 3: return 4;
          case 4: return 3;
          case 5: return 6;
          case 6: return 5;
          case 7: return 7;
          case 8: return 10;
          case 9: return 11;
          case 10: return 8;
          case 11: return 9;
          case 12: return 12;
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
          case 4: return 6;
          case 5: return 4;
          case 6: return 7;
          case 7: return 10;
          case 8: return 11;
          case 9: return 8;
          case 10: return 9;
          case 11: return 5;
          case 12: return 12;
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
          case 3: return 3;
          case 4: return 8;
          case 5: return 10;
          case 6: return 12;
          default: return semNum;
        }
      }
      return 12;
    }
    if (item.category === 'E-learning') {
      if (item.id === 'el-ch11-pt1') {
        return 4;
      }
      if (item.id === 'el-ch11-pt2') {
        return 5;
      }
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
            return 6;
          case 8:
            return 4;
          case 9:
            return 7;
          case 10:
            return 8;
          case 11:
            return 5;
          case 12:
            return 7;
          case 13:
            return 10;
          default:
            return 1;
        }
      }
    }
    return 12;
  };

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
    materialsData.forEach(item => {
      const w = getWeekNumber(item);
      if (groups[w] && groups[w][item.category]) {
        groups[w][item.category].push(item);
      }
    });
    return groups;
  }, []);

  const visibleWeeks = useMemo(() => {
    return weekInfo.filter(week => {
      const categories = groupedByWeek[week.num];
      if (!categories) return false;
      return Object.values(categories).some(list => list.length > 0);
    });
  }, [groupedByWeek, weekInfo]);

  // Statistics summaries
  const stats = useMemo(() => {
    const allLeafNodes = materialsData.flatMap(item => getLeafNodes(item));
    const total = allLeafNodes.length;
    const critical = allLeafNodes.filter(m => (m.relevance ?? 0) === 100).length;
    const important = allLeafNodes.filter(m => (m.relevance ?? 0) >= 70 && (m.relevance ?? 0) < 100).length;
    const lowRelevance = allLeafNodes.filter(m => (m.relevance ?? 0) < 70).length;

    // Quality groupings
    const badQuality = allLeafNodes.filter(m => m.quality === false).length;
    const highQuality = allLeafNodes.filter(m => m.quality !== false).length;

    return { total, critical, important, lowRelevance, badQuality, highQuality };
  }, []);

  return (
    <div className="space-y-6">
      <style>{`
        .mega-epic-glow {
          border-color: rgba(249, 93, 18, 0.5) !important;
          box-shadow: 0 0 16px rgba(249, 93, 18, 0.25), 0 0 8px rgba(139, 92, 246, 0.15);
          border-width: 1.5px !important;
        }
        .mega-cool-week {
          border-color: rgba(192, 132, 252, 0.45) !important;
          box-shadow: 
            0 0 12px rgba(249, 93, 18, 0.35), 
            0 0 25px rgba(139, 92, 246, 0.32), 
            0 0 50px rgba(139, 92, 246, 0.15);
          background: linear-gradient(to bottom right, #ffffff, rgba(254, 243, 199, 0.15)) !important;
          border-width: 1.5px !important;
        }
      `}</style>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-white/70">
          <span className="text-2xl font-black text-slate-850">{stats.total}</span>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">Celkem témat</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-orange-600/[0.03] border-orange-600/20">
          <span className="text-2xl font-black text-orange-700">{stats.critical + stats.important}</span>
          <span className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider mt-1">Relevantní (&ge;70%)</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-orange-500/[0.02] border-amber-500/20">
          <span className="text-2xl font-black text-amber-600">{stats.badQuality}</span>
          <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider mt-1">Nekvalitní</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-rose-500/[0.02] border-rose-500/10">
          <span className="text-2xl font-black text-rose-500">{stats.lowRelevance}</span>
          <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider mt-1">Nepodstatné (&lt;70%)</span>
        </Card>
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
              const leaves = getLeafNodes(item);
              leaves.forEach((node) => {
                totalCount++;
                const relevance = node.relevance ?? 0;
                if (relevance >= 70) {
                  relevantCount++;
                  if (node.quality === false) {
                    warningCount++;
                  }
                }
              });
            });
          });

          const isMegaCoolWeek = Object.values(weekCategories).some((list) =>
            list.some((item) => item.tags?.includes('mega-cool') || item.tags?.includes('mega_cool'))
          );

          const hasRelevant = relevantCount > 0;
          const hasWarning = warningCount > 0;
          const stripeColor = isMegaCoolWeek
            ? 'bg-gradient-to-b from-brand-orange to-purple-600'
            : hasRelevant
              ? (hasWarning ? 'bg-amber-500' : 'bg-orange-600')
              : 'bg-slate-300';

          const headerBg = isMegaCoolWeek
            ? isExpanded
              ? 'bg-linear-to-r from-orange-50/20 via-purple-50/10 to-white shadow-xs'
              : 'bg-white hover:bg-orange-50/10'
            : isExpanded
              ? 'bg-linear-to-r from-slate-50 to-white border-slate-300 shadow-xs'
              : 'bg-white hover:bg-slate-50/50 border-slate-200 hover:border-slate-350';

          const containerClass = isMegaCoolWeek
            ? "border rounded-2xl overflow-hidden transition-all duration-300 mega-cool-week"
            : "border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 bg-white";

          return (
            <div key={week.num} className={containerClass}>
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
                    <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
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
                      <Badge variant="orange" className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase bg-orange-600/10 border-orange-600/20 text-orange-700">
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
                <div className="border-t border-slate-150 bg-slate-50/20 divide-y divide-slate-100/80">
                  {(['Trainer', 'Lectures', 'Seminars', 'E-learning'] as const).map((categoryKey) => {
                    const items = weekCategories[categoryKey];
                    const leafTopics = items.flatMap(item => getLeafNodes(item));

                    let categoryIcon = null;
                    let categoryLabel = '';
                    let categoryColorClass = '';

                    switch (categoryKey) {
                      case 'Trainer':
                        categoryIcon = <Terminal size={12} />;
                        categoryLabel = 'Trainer';
                        categoryColorClass = 'text-orange-600 bg-orange-50 border-orange-200/50';
                        break;
                      case 'Lectures':
                        categoryIcon = <GraduationCap size={12} />;
                        categoryLabel = 'Přednášky';
                        categoryColorClass = 'text-amber-700 bg-amber-50/70 border-amber-200/50';
                        break;
                      case 'Seminars':
                        categoryIcon = <Users size={12} />;
                        categoryLabel = 'Prosemináře';
                        categoryColorClass = 'text-slate-700 bg-slate-100 border-slate-200/50';
                        break;
                      case 'E-learning':
                        categoryIcon = <BookOpen size={12} />;
                        categoryLabel = 'E-learning';
                        categoryColorClass = 'text-rose-700 bg-rose-50 border-rose-200/50';
                        break;
                    }

                    return (
                      <div key={categoryKey} className="p-4 flex flex-col md:flex-row md:items-start gap-3 min-w-0">
                        {/* Category and Parent Topics Info - aligned to the left */}
                        <div className="md:w-44 shrink-0 flex flex-col gap-2">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border self-start ${categoryColorClass}`}>
                            {categoryIcon}
                            <span>{categoryLabel}</span>
                          </div>

                          {/* Parent Topics Details */}
                          {items.map(item => (
                            <div key={item.id} className="border-l border-slate-200 pl-2 py-0.5">
                              <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                                {renderNameWithLinks(item.name)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* List of micro cards wrapping horizontally */}
                        <div className="flex-1">
                          {leafTopics.length === 0 ? (
                            <p className="text-[10px] text-slate-350 italic py-1">—</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {leafTopics.map((node) => {
                                const relevance = node.relevance ?? 0;
                                const quality = node.quality ?? true;
                                const isMegaEpic = node.badges?.includes('mega_epic');
                                const isLowQuality = !quality;

                                const isHigh = relevance >= 90;
                                const isMedium = relevance >= 70 && relevance < 90;

                                let cardClass = 'w-fit max-w-[180px] p-2 rounded-lg border text-[10px] font-bold inline-flex flex-col gap-1.5 transition-all hover:scale-[1.02]';
                                if (isMegaEpic) {
                                  cardClass += ' mega-epic-glow';
                                }
                                let barColor = '';

                                if (isLowQuality) {
                                  cardClass += ' bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                                  barColor = 'bg-slate-300';
                                } else if (isHigh || isMegaEpic) {
                                  cardClass += ' bg-orange-50/80 border-brand-orange/30 text-orange-950';
                                  barColor = 'bg-brand-orange';
                                } else if (isMedium) {
                                  cardClass += ' bg-amber-100/50 border-amber-300/60 text-amber-900';
                                  barColor = 'bg-amber-500';
                                } else {
                                  // relevance <= 70
                                  cardClass += ' bg-slate-50/50 border-slate-200 text-slate-500';
                                  if (relevance >= 60) {
                                    barColor = 'bg-amber-500';
                                  } else if (relevance >= 50) {
                                    barColor = 'bg-yellow-400';
                                  } else {
                                    barColor = 'bg-slate-300';
                                    cardClass = 'w-fit max-w-[180px] p-2 rounded-lg border text-[10px] font-bold inline-flex flex-col gap-1.5 transition-all hover:scale-[1.02] bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                                  }
                                }

                                return (
                                  <div
                                    key={node.id}
                                    className={cardClass}
                                    title={`${node.name} (Relevance: ${relevance}%, Quality: ${quality ? 'Good' : 'Bad'})`}
                                  >
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                      {(node.badges || isLowQuality) && (
                                        <div className="flex flex-wrap gap-1 items-center">
                                          {node.badges?.includes('mega_epic') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm bg-gradient-to-r from-amber-500 via-orange-500 to-[#ea580c] text-white leading-none">
                                              MEGA EPIC
                                            </span>
                                          )}
                                          {node.badges?.includes('epic') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm bg-[#c2410c] text-white leading-none">
                                              EPIC
                                            </span>
                                          )}
                                          {node.badges?.includes('insight') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white leading-none">
                                              INSIGHT
                                            </span>
                                          )}
                                          {node.badges?.includes('challenge') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm bg-[#9f1239] text-white leading-none">
                                              CHALLENGE
                                            </span>
                                          )}
                                          {node.badges?.includes('practice') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm bg-[#fae8ff] text-[#701a75] border border-[#d8b4fe] leading-none">
                                              PRACTICE
                                            </span>
                                          )}
                                          {node.badges?.includes('showcase') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm border border-dashed border-[#7c3aed] text-[#6d28d9] bg-transparent leading-none">
                                              SHOWCASE
                                            </span>
                                          )}
                                          {node.badges?.includes('no_code') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] bg-[#fffbeb] text-[#b45309] border-l-[3px] border-[#f59e0b] rounded-[2px_6px_6px_2px] leading-none">
                                              NO CODE NEEDED
                                            </span>
                                          )}
                                          {node.badges?.includes('not_checked') && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm bg-white text-black leading-none">
                                              NOT CHECKED
                                            </span>
                                          )}
                                          {isLowQuality && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-2 py-[2px] rounded-full bg-[#e2e8f0] text-[#475569] leading-none">
                                              LOW QUALITY
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <span className="leading-tight break-words">
                                        {renderNameWithLinks(node.name)}
                                      </span>
                                    </div>

                                    {/* Importance bar */}
                                    <div className="h-1 w-28 bg-slate-200/50 rounded-full overflow-hidden shrink-0 mt-auto">
                                      <div
                                        className={`h-full rounded-full ${barColor}`}
                                        style={{ width: `${Math.max(relevance, 5)}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {visibleWeeks.length === 0 && (
          <div className="py-12 text-center bg-white/50 rounded-2xl border border-dashed border-slate-350">
            <AlertTriangle className="mx-auto text-amber-500 mb-2 animate-bounce-subtle" size={28} />
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide">Nebyly nalezeny žádné materiály</h4>
          </div>
        )}
      </div>
    </div>
  );
}
