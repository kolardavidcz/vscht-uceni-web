import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Filter,
  Frown,
  HelpCircle,
  Network,
  RefreshCw,
  Search,
  Smile,
  Table2,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { CellMorphology } from "../components/CellMorphology";
import type { MicrobiologyData } from "../hooks/useMicrobiologyData";
import { sortEmojis } from "../data/emojis";
import type { EmojiOption, WorksheetItem } from "../types";

type Tab = "tree" | "flashcards" | "matrix";

type TaxonContext = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  hint?: string;
  correctEmojis: string[];
  groups?: WorksheetItem["groups"];
  breadcrumbs: { name: string; type?: string }[];
};

const tabFromPath = (path: string): Tab => {
  if (path.includes("samostudium")) return "flashcards";
  if (path.includes("srovnavaci-matice")) return "matrix";
  return "tree";
};

const SELECTABLE_TRAITS = [
  { emoji: "🔵", label: "G+" },
  { emoji: "🔴", label: "G-" },
  { emoji: "🌭", label: "Tyčinky" },
  { emoji: "⚪", label: "Koky" },
  { emoji: "💨", label: "Aerobní" },
  { emoji: "🚫💨", label: "Anaerobní" },
  { emoji: "🌗", label: "Fakultativně anaerobní" },
  { emoji: "🏃", label: "Pohyblivé" },
  { emoji: "🛡️", label: "Spory" },
  { emoji: "🦠", label: "Patogeny" },
];

const MATRIX_HEADERS = [
  { key: "G+", emoji: "🔵", label: "Gram +" },
  { key: "G-", emoji: "🔴", label: "Gram -" },
  { key: "tycka", emoji: "🌭", label: "Tyčinka" },
  { key: "kok", emoji: "⚪", label: "Kok" },
  { key: "spirala", emoji: "〰️", label: "Spirála" },
  { key: "aerob", emoji: "💨", label: "Aerobní" },
  { key: "anaerob", emoji: "🚫💨", label: "Anaerobní" },
  { key: "fakultativ", emoji: "🌗", label: "Fakultativní" },
  { key: "pohyb", emoji: "🏃", label: "Pohyblivé" },
  { key: "spory", emoji: "🛡️", label: "Spory" },
  { key: "patogen", emoji: "🦠", label: "Patogen" },
];

function getRankStyles(type?: string) {
  switch (type) {
    case "Kmen":
      return {
        borderL: "border-l-brand-orange",
        bg: "bg-orange-50 text-orange-700 border-orange-100",
        text: "text-orange-950 font-black",
      };
    case "Třída":
      return {
        borderL: "border-l-amber-500",
        bg: "bg-amber-50 text-amber-700 border-amber-100",
        text: "text-amber-950 font-bold",
      };
    case "Čeleď":
      return {
        borderL: "border-l-yellow-500",
        bg: "bg-yellow-50 text-yellow-800 border-yellow-100",
        text: "text-yellow-950 font-semibold",
      };
    case "Rod":
      return {
        borderL: "border-l-brand-orange-text",
        bg: "bg-orange-50/70 text-orange-800 border-orange-100",
        text: "text-orange-900 italic font-bold",
      };
    case "Zástupce":
      return {
        borderL: "border-l-rose-500",
        bg: "bg-rose-50 text-rose-700 border-rose-100",
        text: "text-rose-950 font-semibold",
      };
    default:
      return {
        borderL: "border-l-stone-300",
        bg: "bg-stone-50 text-stone-600 border-stone-200",
        text: "text-stone-900 font-semibold",
      };
  }
}

function allItemEmojis(item: {
  correctEmojis?: string[];
  groups?: { correctEmojis: string[] }[];
}): string[] {
  return [
    ...(item.correctEmojis || []),
    ...(item.groups?.flatMap((g) => g.correctEmojis || []) || []),
  ];
}

function matchesTrait(allEmojis: string[], traitEmoji: string): boolean {
  if (traitEmoji === "🌭") {
    return allEmojis.some((e) => ["🌭", "🌭🌭", "🌭🌭🌭"].includes(e));
  }
  if (traitEmoji === "⚪") {
    return allEmojis.some((e) =>
      ["⚪", "🟣", "🟣🟣", "🟣🟣🟣", "🍇", "8", "⛓️"].includes(e)
    );
  }
  return allEmojis.includes(traitEmoji);
}

function labelEmojis(emojis: string[], options: EmojiOption[]) {
  const sorted = sortEmojis(emojis, options);
  return sorted.map((e) => ({
    emoji: e,
    label: options.find((o) => o.emoji === e)?.label || e,
  }));
}

/** Compact trait chips: emoji + short text label (core of old study UX) */
function TraitChips({
  emojis,
  options,
  tone = "indigo",
}: {
  emojis: string[];
  options: EmojiOption[];
  tone?: "indigo" | "orange";
}) {
  const items = labelEmojis(emojis, options);
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <div
          key={item.emoji + item.label}
          className={cn(
            "inline-flex items-center gap-1 border px-1.5 py-0.5 rounded-md text-[9px] font-bold cursor-help",
            tone === "orange"
              ? "bg-orange-50 border-orange-100 text-orange-950"
              : "bg-orange-50/40 border-orange-100/80 text-stone-800"
          )}
          title={item.label}
        >
          <span className="text-sm leading-none">{item.emoji}</span>
          <span className="text-[8px] font-semibold text-stone-600 max-w-[9rem] truncate">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

type MatrixSort = "tree" | "name" | "traits-desc" | "traits-asc" | "rank";

function MatrixPanel({
  rows,
  totalCount,
  emojiOptions,
  availablePhyla,
  activePhylumFilter,
  setActivePhylumFilter,
  activeRankFilter,
  setActiveRankFilter,
  searchQuery,
  setSearchQuery,
  selectedTraits,
  setSelectedTraits,
}: {
  rows: TaxonContext[];
  totalCount: number;
  emojiOptions: EmojiOption[];
  availablePhyla: string[];
  activePhylumFilter: string;
  setActivePhylumFilter: (v: string) => void;
  activeRankFilter: string;
  setActiveRankFilter: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedTraits: string[];
  setSelectedTraits: (v: string[] | ((p: string[]) => string[])) => void;
}) {
  const [visibleCols, setVisibleCols] = useState<string[]>(() =>
    MATRIX_HEADERS.map((h) => h.key)
  );
  /** Default = same order as worksheet / quiz tree (depth-first) */
  const [sortBy, setSortBy] = useState<MatrixSort>("tree");
  const [showEmoji, setShowEmoji] = useState(true);
  const [compareId, setCompareId] = useState<string | "">("");

  const headers = MATRIX_HEADERS.filter((h) => visibleCols.includes(h.key));

  const compareEmojis = useMemo(() => {
    if (!compareId) return null;
    const row = rows.find((r) => r.id === compareId);
    return row ? allItemEmojis(row) : null;
  }, [compareId, rows]);

  const sortedRows = useMemo(() => {
    // `rows` already follows taxonFlatList tree order (same as kvíz)
    if (sortBy === "tree") return rows;

    const list = [...rows];
    const traitCount = (t: TaxonContext) =>
      headers.filter((h) => matchesTrait(allItemEmojis(t), h.emoji)).length;
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "cs");
      if (sortBy === "rank")
        return (
          (a.type || "").localeCompare(b.type || "", "cs") ||
          a.name.localeCompare(b.name, "cs")
        );
      const ca = traitCount(a);
      const cb = traitCount(b);
      if (sortBy === "traits-desc")
        return cb - ca || a.name.localeCompare(b.name, "cs");
      return ca - cb || a.name.localeCompare(b.name, "cs");
    });
    return list;
  }, [rows, sortBy, headers]);

  const toggleCol = (key: string) => {
    setVisibleCols((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const toggleTraitFilterFromHeader = (emoji: string) => {
    setSelectedTraits((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActivePhylumFilter("Vše");
    setActiveRankFilter("Vše");
    setSelectedTraits([]);
    setCompareId("");
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-start justify-between">
          <div>
            <h2 className="text-sm font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Table2 size={16} className="text-brand-orange" />
              Srovnávací matice
            </h2>
            <p className="text-[10px] text-stone-500 font-semibold mt-1">
              Porovnejte znaky napříč taxony ·{" "}
              <span className="text-brand-orange-text font-black">
                {sortedRows.length}/{totalCount}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat taxon…"
                className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs w-40 sm:w-48"
              />
            </div>
            <select
              value={activePhylumFilter}
              onChange={(e) => setActivePhylumFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold cursor-pointer"
            >
              <option value="Vše">Všechny kmeny</option>
              {availablePhyla.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={activeRankFilter}
              onChange={(e) => setActiveRankFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold cursor-pointer"
            >
              <option value="Vše">Všechny ranky</option>
              {["Kmen", "Třída", "Čeleď", "Rod", "Zástupce"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MatrixSort)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold cursor-pointer"
            >
              <option value="tree">Řadit: pořadí ve stromu (kvíz)</option>
              <option value="name">Řadit: název</option>
              <option value="rank">Řadit: rank</option>
              <option value="traits-desc">Řadit: více znaků</option>
              <option value="traits-asc">Řadit: méně znaků</option>
            </select>
          </div>
        </div>

        {/* Column visibility + compare */}
        <div className="flex flex-wrap gap-1.5 items-center border-t border-stone-100 pt-3">
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider mr-1">
            Sloupce:
          </span>
          {MATRIX_HEADERS.map((h) => {
            const on = visibleCols.includes(h.key);
            const filtered = selectedTraits.includes(h.emoji);
            return (
              <button
                key={h.key}
                type="button"
                onClick={() => toggleCol(h.key)}
                onDoubleClick={() => toggleTraitFilterFromHeader(h.emoji)}
                title={`${h.label} · klik = sloupec · dvojklik = filtr`}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all",
                  on
                    ? filtered
                      ? "bg-brand-orange text-white border-brand-orange"
                      : "bg-orange-50 text-brand-orange-text border-orange-200"
                    : "bg-stone-50 text-stone-400 border-stone-200 opacity-60"
                )}
              >
                <span className="text-sm leading-none">{h.emoji}</span>
                <span className="hidden sm:inline">{h.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setVisibleCols(MATRIX_HEADERS.map((h) => h.key))}
            className="px-2 py-1 text-[9px] font-black text-stone-500 border border-dashed border-stone-300 rounded-lg cursor-pointer"
          >
            Vše
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center border-t border-stone-100 pt-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showEmoji}
              onChange={(e) => setShowEmoji(e.target.checked)}
              className="accent-brand-orange"
            />
            Zobrazit emoji ve buňkách
          </label>
          <div className="h-4 w-px bg-stone-200 hidden sm:block" />
          <label className="text-[10px] font-bold text-stone-500">
            Porovnat s:
          </label>
          <select
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
            className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold max-w-[14rem] cursor-pointer"
          >
            <option value="">— žádný referenční taxon —</option>
            {sortedRows.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {(searchQuery ||
            activePhylumFilter !== "Vše" ||
            activeRankFilter !== "Vše" ||
            selectedTraits.length > 0 ||
            compareId) && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto px-2 py-1 text-[9px] font-black text-rose-500 border border-dashed border-rose-200 rounded-lg cursor-pointer"
            >
              Reset filtrů
            </button>
          )}
        </div>
        {compareId && (
          <p className="text-[10px] text-stone-500">
            Zvýraznění:{" "}
            <span className="text-emerald-700 font-bold">zelená = shoda</span>
            {" · "}
            <span className="text-amber-700 font-bold">
              jantar = navíc oproti referenci
            </span>
            {" · "}
            <span className="text-stone-400 font-bold">šedá = chybí u obou / jen u reference</span>
          </p>
        )}
      </Card>

      {sortedRows.length > 0 ? (
        <Card className="overflow-hidden p-0 border border-stone-200">
          {/* Full height table — page scrolls, no inner max-height */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-stone-100/95 backdrop-blur-sm border-b border-stone-200 text-[9px] font-black text-stone-500 uppercase tracking-wider">
                  <th className="p-2.5 sticky left-0 bg-stone-100 z-30 min-w-[12rem] border-r border-stone-200 shadow-sm">
                    Taxon
                  </th>
                  <th className="p-2.5 border-r border-stone-200 w-20">Rank</th>
                  <th
                    className="p-2.5 border-r border-stone-200 w-12 text-center"
                    title="Počet zobrazených znaků"
                  >
                    Σ
                  </th>
                  {headers.map((h) => (
                    <th
                      key={h.key}
                      className={cn(
                        "p-2 text-center border-r border-stone-200 min-w-[3rem] cursor-pointer hover:bg-orange-50/80 transition-colors",
                        selectedTraits.includes(h.emoji) && "bg-orange-50"
                      )}
                      title={`${h.label} — klik pro filtr podle znaku`}
                      onClick={() => toggleTraitFilterFromHeader(h.emoji)}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-base leading-none">{h.emoji}</span>
                        <span className="text-[7px] font-bold text-stone-400 normal-case tracking-tight max-w-[3.5rem] truncate">
                          {h.label}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedRows.map((t) => {
                  const emojis = allItemEmojis(t);
                  const styles = getRankStyles(t.type);
                  const count = headers.filter((h) =>
                    matchesTrait(emojis, h.emoji)
                  ).length;
                  const isRef = compareId === t.id;
                  return (
                    <tr
                      key={t.id}
                      className={cn(
                        "text-xs font-semibold text-stone-700 group",
                        isRef
                          ? "bg-brand-orange/5 ring-1 ring-inset ring-brand-orange/20"
                          : "hover:bg-stone-50/80"
                      )}
                    >
                      <td className="p-2.5 sticky left-0 bg-white group-hover:bg-stone-50 z-10 border-r border-stone-200 shadow-sm">
                        <div className="font-extrabold text-stone-900 text-[11px] leading-snug">
                          {t.name}
                        </div>
                        {t.breadcrumbs.length > 0 && (
                          <div className="text-[8px] text-stone-400 font-medium truncate max-w-[14rem] mt-0.5">
                            {t.breadcrumbs.map((b) => b.name).join(" › ")}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border-r border-stone-200">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 text-[8px] font-black rounded-md uppercase border",
                            styles.bg
                          )}
                        >
                          {t.type || "—"}
                        </span>
                      </td>
                      <td className="p-2 border-r border-stone-200 text-center tabular-nums text-[10px] font-black text-brand-orange-text">
                        {count}
                      </td>
                      {headers.map((h) => {
                        const has = matchesTrait(emojis, h.emoji);
                        const refHas =
                          compareEmojis != null
                            ? matchesTrait(compareEmojis, h.emoji)
                            : null;
                        let cellTone = "";
                        if (compareEmojis) {
                          if (has && refHas) cellTone = "bg-emerald-50/80";
                          else if (has && !refHas) cellTone = "bg-amber-50";
                          else if (!has && refHas) cellTone = "bg-stone-100/80";
                        } else if (has) {
                          cellTone = "bg-orange-50/40";
                        }
                        const label =
                          emojiOptions.find((o) => o.emoji === h.emoji)?.label ||
                          h.label;
                        return (
                          <td
                            key={h.key}
                            className={cn(
                              "p-1.5 text-center border-r border-stone-100",
                              cellTone
                            )}
                            title={
                              has
                                ? `${t.name}: ${label}`
                                : `${t.name}: nemá ${label}`
                            }
                          >
                            {has ? (
                              showEmoji ? (
                                <span className="text-base leading-none select-none">
                                  {h.emoji}
                                </span>
                              ) : (
                                <span className="inline-flex w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 items-center justify-center font-black text-[10px]">
                                  ✓
                                </span>
                              )
                            ) : (
                              <span className="text-stone-300 select-none">·</span>
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
          <div className="px-3 py-2 border-t border-stone-100 bg-stone-50/80 text-[9px] text-stone-500 font-medium">
            Tip: klik na sloupec = filtr podle znaku · dvojklik na chip nahoře =
            totéž · referenční taxon zvýrazní shody/rozdíly
          </div>
        </Card>
      ) : (
        <Card className="py-12 text-center space-y-3">
          <p className="text-sm font-bold text-stone-700">Matice je prázdná</p>
          <p className="text-xs text-stone-500">Upravte filtry nebo hledání.</p>
          <Button size="sm" onClick={clearFilters}>
            Resetovat filtry
          </Button>
        </Card>
      )}
    </div>
  );
}

type Props = { data: MicrobiologyData };

export function StudyPage({ data }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = tabFromPath(location.pathname);
  const { worksheetData, emojiOptions } = data;

  const [searchQuery, setSearchQuery] = useState("");
  const [activePhylumFilter, setActivePhylumFilter] = useState("Vše");
  const [activeRankFilter, setActiveRankFilter] = useState("Vše");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  // Default: expand through Rod (Kmen → Třída → Čeleď → Rod)
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>(
    () => {
      const expanded: Record<string, boolean> = {};
      const walk = (items: WorksheetItem[]) => {
        for (const item of items) {
          if (item.children?.length) {
            const t = item.type;
            expanded[item.id] =
              t === "Kmen" ||
              t === "Třída" ||
              t === "Čeleď" ||
              t === "Rod" ||
              !t; // section headers without type
            walk(item.children);
          }
        }
      };
      walk(data.worksheetData);
      return expanded;
    }
  );
  const [cellModels, setCellModels] = useState<Record<string, boolean>>({});

  const [flashcardPool, setFlashcardPool] = useState<TaxonContext[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [flashcardFilterPhylum, setFlashcardFilterPhylum] = useState("Vše");
  const [flashcardFilterRank, setFlashcardFilterRank] = useState("Vše");
  const [flashcardHistory, setFlashcardHistory] = useState<
    Record<string, "easy" | "medium" | "hard">
  >({});

  useEffect(() => {
    document.title = "Studijní přehled — Systematika bakterií";
  }, []);

  const taxonFlatList = useMemo(() => {
    const list: TaxonContext[] = [];
    const traverse = (
      items: WorksheetItem[],
      ancestors: { name: string; type?: string }[] = []
    ) => {
      for (const item of items) {
        const hasTraits =
          (item.correctEmojis && item.correctEmojis.length > 0) ||
          (item.groups && item.groups.length > 0);
        if (hasTraits) {
          list.push({
            id: item.id,
            name: item.name,
            type: item.type,
            breadcrumbs: ancestors,
            description: item.description,
            hint: item.hint,
            correctEmojis: item.correctEmojis || [],
            groups: item.groups,
          });
        }
        if (item.children) {
          traverse(item.children, [
            ...ancestors,
            { name: item.name, type: item.type },
          ]);
        }
      }
    };
    traverse(worksheetData);
    return list;
  }, [worksheetData]);

  const availablePhyla = useMemo(() => {
    const set = new Set<string>();
    for (const item of worksheetData) {
      if (item.type === "Kmen" && item.name) set.add(item.name);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "cs"));
  }, [worksheetData]);

  const visibleNodeIds = useMemo(() => {
    const visible = new Set<string>();
    const query = searchQuery.toLowerCase().trim();

    const check = (item: WorksheetItem): boolean => {
      const emojis = allItemEmojis(item);
      const labels = emojis.map(
        (e) => emojiOptions.find((o) => o.emoji === e)?.label.toLowerCase() || ""
      );
      const textMatch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.hint?.toLowerCase().includes(query) ||
        labels.some((l) => l.includes(query)) ||
        emojis.some((e) => e.includes(query));

      const traitMatch =
        selectedTraits.length === 0 ||
        selectedTraits.every((t) => matchesTrait(emojis, t));

      let childMatch = false;
      if (item.children) {
        for (const child of item.children) {
          if (check(child)) childMatch = true;
        }
      }

      const hasDirect =
        (item.correctEmojis && item.correctEmojis.length > 0) ||
        (item.groups && item.groups.length > 0);
      const selfMatches = hasDirect
        ? textMatch && traitMatch
        : query
          ? textMatch
          : false;
      const isVisible = selfMatches || childMatch;
      if (isVisible) visible.add(item.id);
      return isVisible;
    };

    for (const item of worksheetData) {
      if (activePhylumFilter !== "Vše" && item.name !== activePhylumFilter) {
        continue;
      }
      check(item);
    }
    return visible;
  }, [
    worksheetData,
    searchQuery,
    selectedTraits,
    activePhylumFilter,
    emojiOptions,
  ]);

  // Auto-expand when filtering
  useEffect(() => {
    if (
      !searchQuery &&
      selectedTraits.length === 0 &&
      activePhylumFilter === "Vše"
    ) {
      return;
    }
    const expanded: Record<string, boolean> = {};
    const walk = (items: WorksheetItem[]) => {
      for (const item of items) {
        if (visibleNodeIds.has(item.id) && item.children?.length) {
          expanded[item.id] = true;
        }
        if (item.children) walk(item.children);
      }
    };
    walk(worksheetData);
    setTreeExpanded((prev) => ({ ...prev, ...expanded }));
  }, [
    visibleNodeIds,
    searchQuery,
    selectedTraits,
    activePhylumFilter,
    worksheetData,
  ]);

  const filteredList = useMemo(() => {
    return taxonFlatList.filter((taxon) => {
      const emojis = allItemEmojis(taxon);
      const query = searchQuery.toLowerCase().trim();
      const labels = emojis.map(
        (e) => emojiOptions.find((o) => o.emoji === e)?.label.toLowerCase() || ""
      );
      const matchesText =
        !query ||
        taxon.name.toLowerCase().includes(query) ||
        taxon.description?.toLowerCase().includes(query) ||
        taxon.hint?.toLowerCase().includes(query) ||
        labels.some((l) => l.includes(query));
      const matchesPhylum =
        activePhylumFilter === "Vše" ||
        taxon.name === activePhylumFilter ||
        taxon.breadcrumbs.some((b) => b.name === activePhylumFilter);
      const matchesRank =
        activeRankFilter === "Vše" || taxon.type === activeRankFilter;
      const matchesTraits =
        selectedTraits.length === 0 ||
        selectedTraits.every((t) => matchesTrait(emojis, t));
      return matchesText && matchesPhylum && matchesRank && matchesTraits;
    });
  }, [
    taxonFlatList,
    searchQuery,
    activePhylumFilter,
    activeRankFilter,
    selectedTraits,
    emojiOptions,
  ]);

  const initFlashcards = () => {
    const pool = taxonFlatList.filter((t) => {
      const matchesPhylum =
        flashcardFilterPhylum === "Vše" ||
        t.name === flashcardFilterPhylum ||
        t.breadcrumbs.some((b) => b.name === flashcardFilterPhylum);
      const matchesRank =
        flashcardFilterRank === "Vše" || t.type === flashcardFilterRank;
      return matchesPhylum && matchesRank;
    });
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setFlashcardPool(shuffled);
    setFlashcardIndex(0);
    setShowFlashcardAnswer(false);
  };

  useEffect(() => {
    if (tab === "flashcards") initFlashcards();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-init when filters/tab change
  }, [tab, flashcardFilterPhylum, flashcardFilterRank, taxonFlatList]);

  const currentCard = flashcardPool[flashcardIndex];

  const rateCard = (difficulty: "easy" | "medium" | "hard") => {
    if (!currentCard) return;
    setFlashcardHistory((h) => ({ ...h, [currentCard.id]: difficulty }));
    if (flashcardIndex < flashcardPool.length - 1) {
      setFlashcardIndex((i) => i + 1);
      setShowFlashcardAnswer(false);
    } else {
      initFlashcards();
    }
  };

  const expandAll = () => {
    const expanded: Record<string, boolean> = {};
    const walk = (items: WorksheetItem[]) => {
      for (const item of items) {
        if (item.children?.length) {
          expanded[item.id] = true;
          walk(item.children);
        }
      }
    };
    walk(worksheetData);
    setTreeExpanded(expanded);
  };

  const collapseAll = () => {
    setTreeExpanded({});
    setCellModels({});
  };

  const renderTreeNode = (item: WorksheetItem, depth = 0): ReactNode => {
    if (!visibleNodeIds.has(item.id)) return null;
    const hasChildren = Boolean(item.children?.length);
    // Explicit map: true = open; missing = closed (defaults set for ranks → Rod)
    const isExpanded = treeExpanded[item.id] === true;
    const styles = getRankStyles(item.type);
    const traits = allItemEmojis(item);
    const hasTraits = traits.length > 0;
    const showModel = !!cellModels[item.id];

    return (
      <div key={item.id} className="flex flex-col">
        <div
          className={cn(
            "relative flex items-start py-2.5 px-3 my-0.5 rounded-xl border border-stone-200/60 bg-white shadow-sm transition-all hover:bg-stone-50/60 border-l-4",
            styles.borderL
          )}
          style={{ marginLeft: depth * 14 }}
        >
          <div className="shrink-0 mt-0.5 w-5 flex items-center justify-center text-stone-400">
            {hasChildren ? (
              <button
                type="button"
                onClick={() =>
                  setTreeExpanded((p) => ({
                    ...p,
                    [item.id]: !p[item.id],
                  }))
                }
                className="p-0.5 hover:bg-stone-200 rounded-md cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            )}
          </div>

          <div className="flex-1 ml-1.5 min-w-0 space-y-1">
            <div className="flex items-center flex-wrap gap-2 leading-none">
              <span className={cn("text-xs tracking-tight", styles.text)}>
                {item.name}
              </span>
              {item.type && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider border",
                    styles.bg
                  )}
                >
                  {item.type}
                </span>
              )}
              {hasTraits && (
                <button
                  type="button"
                  onClick={() =>
                    setCellModels((p) => ({ ...p, [item.id]: !p[item.id] }))
                  }
                  className="px-1.5 py-0.5 text-[10px] font-black text-brand-orange-text hover:bg-orange-50 border border-orange-200/50 rounded-md cursor-pointer"
                >
                  🔬 {showModel ? "Skrýt model" : "Model buňky"}
                </button>
              )}
            </div>

            {item.description && (
              <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                {item.description}
              </p>
            )}

            {/* Always show emoji + label chips (old atlas style) */}
            {hasTraits && (
              <div className="pt-1">
                {item.groups && item.groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2 items-center">
                    {item.groups.map((g) => (
                      <div
                        key={g.id}
                        className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/70 px-1.5 py-0.5 rounded-md"
                      >
                        <span className="text-[9px] font-black text-stone-500 uppercase tracking-wider">
                          {g.label}:
                        </span>
                        <TraitChips
                          emojis={g.correctEmojis || []}
                          options={emojiOptions}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <TraitChips emojis={item.correctEmojis || []} options={emojiOptions} />
                )}
              </div>
            )}

            {showModel && hasTraits && (
              <div className="pt-2">
                <CellMorphology taxonEmojis={traits} className="bg-white/90" />
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 border-l border-stone-200/60 ml-2 space-y-0.5">
            {item.children!.map((c) => renderTreeNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tabs: { id: Tab; label: string; icon: typeof Network; to: string }[] = [
    {
      id: "tree",
      label: "Studijní strom",
      icon: Network,
      to: "/mikrobiologie/studijni-strom",
    },
    {
      id: "flashcards",
      label: "Samostudium",
      icon: Brain,
      to: "/mikrobiologie/samostudium",
    },
    {
      id: "matrix",
      label: "Srovnávací matice",
      icon: Table2,
      to: "/mikrobiologie/srovnavaci-matice",
    },
  ];

  return (
    <PageShell
      title="Studijní přehled: Atlas bakterií"
      subtitle="Interaktivní studijní centrum systematiky"
      backTo="/mikrobiologie"
      maxWidth="max-w-6xl"
      actions={
        <Link to="/mikrobiologie">
          <Button variant="dark" size="sm">
            Kvíz
          </Button>
        </Link>
      }
    >
      {/* Tabs in header style */}
      <div className="flex flex-wrap gap-1.5 mb-5 p-1 rounded-xl bg-stone-100 border border-stone-200 w-full sm:w-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(t.to)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                tab === t.id
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-stone-600 hover:bg-white hover:text-stone-900"
              )}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TREE */}
      {tab === "tree" && (
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={15}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Vyhledat podle názvu, popisu nebo vlastností…"
                  className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 focus:border-brand-orange outline-none rounded-xl text-xs sm:text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <select
                value={activePhylumFilter}
                onChange={(e) => setActivePhylumFilter(e.target.value)}
                className="w-full sm:w-52 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
              >
                <option value="Vše">Všechny kmeny</option>
                {availablePhyla.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center border-t border-stone-100 pt-3">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter size={10} /> Znaky:
              </span>
              {SELECTABLE_TRAITS.map((trait) => {
                const on = selectedTraits.includes(trait.emoji);
                return (
                  <button
                    key={trait.emoji}
                    type="button"
                    onClick={() =>
                      setSelectedTraits((prev) =>
                        on
                          ? prev.filter((e) => e !== trait.emoji)
                          : [...prev, trait.emoji]
                      )
                    }
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border cursor-pointer transition-all",
                      on
                        ? "bg-brand-orange border-orange-600 text-white"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    )}
                  >
                    <span>{trait.emoji}</span>
                    <span>{trait.label}</span>
                  </button>
                );
              })}
              {selectedTraits.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTraits([])}
                  className="px-2 py-1 text-[9px] font-black text-rose-500 border border-dashed border-rose-200 rounded-lg cursor-pointer"
                >
                  Vymazat
                </button>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-3 py-1 bg-brand-peach/50 hover:bg-brand-peach text-brand-orange-text rounded-lg text-[10px] font-black border border-brand-orange/20 cursor-pointer"
                >
                  Rozbalit vše
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-3 py-1 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-[10px] font-black border border-stone-200 cursor-pointer"
                >
                  Zabalit vše
                </button>
              </div>
              <span className="text-[10px] font-bold text-stone-400">
                Nalezeno: {visibleNodeIds.size} uzlů · {taxonFlatList.length} s
                vlastnostmi
              </span>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 space-y-1">
            {visibleNodeIds.size > 0 ? (
              worksheetData.map((item) => renderTreeNode(item))
            ) : (
              <div className="py-12 text-center text-stone-400 text-xs font-bold">
                Žádné shody. Upravte vyhledávání nebo filtry znaků.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* FLASHCARDS */}
      {tab === "flashcards" && (
        <div className="max-w-xl mx-auto space-y-5">
          <Card className="p-3.5 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-stone-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Filter size={11} /> Procvičit:
              </span>
              <select
                value={flashcardFilterPhylum}
                onChange={(e) => setFlashcardFilterPhylum(e.target.value)}
                className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-extrabold cursor-pointer"
              >
                <option value="Vše">Všechny kmeny</option>
                {availablePhyla.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={flashcardFilterRank}
                onChange={(e) => setFlashcardFilterRank(e.target.value)}
                className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-extrabold cursor-pointer"
              >
                <option value="Vše">Všechny ranky</option>
                {["Kmen", "Třída", "Čeleď", "Rod", "Zástupce"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <Button size="sm" variant="secondary" onClick={initFlashcards}>
              <RefreshCw size={11} /> Restart
            </Button>
          </Card>

          {currentCard ? (
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 px-1">
                <span>
                  Otázka: {flashcardIndex + 1} / {flashcardPool.length}
                </span>
                <span className="text-brand-orange-text font-extrabold">
                  Umím:{" "}
                  {
                    Object.values(flashcardHistory).filter((v) => v === "easy")
                      .length
                  }
                </span>
              </div>

              <div
                className={cn(
                  "bg-white rounded-2xl border-2 p-6 min-h-[200px] shadow-sm flex flex-col justify-between transition-all",
                  showFlashcardAnswer
                    ? "border-brand-orange shadow-[0_0_0_3px_rgba(249,93,18,0.1)]"
                    : "border-stone-200"
                )}
              >
                <div className="space-y-3">
                  {currentCard.breadcrumbs.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 text-[8px] font-black text-stone-400 uppercase tracking-wider">
                      {currentCard.breadcrumbs.map((c, i) => (
                        <span key={i} className="flex items-center gap-0.5">
                          {c.name}
                          {i < currentCard.breadcrumbs.length - 1 && (
                            <span>❯</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-lg font-black text-stone-900 tracking-tight">
                      {currentCard.name}
                    </h3>
                    {currentCard.type && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[8px] font-black rounded-md uppercase border",
                          getRankStyles(currentCard.type).bg
                        )}
                      >
                        {currentCard.type}
                      </span>
                    )}
                  </div>
                  {currentCard.description && (
                    <p className="text-xs text-stone-600 bg-stone-50 border border-stone-100 p-3 rounded-lg leading-relaxed font-semibold">
                      {currentCard.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-stone-100 pt-4 space-y-4">
                  {!showFlashcardAnswer ? (
                    <div className="text-center space-y-3">
                      <p className="text-xs text-stone-500 font-bold flex items-center justify-center gap-1">
                        <HelpCircle size={13} className="text-amber-500" />
                        Vybavte si vlastnosti (emoji) pro tento taxon
                      </p>
                      <Button onClick={() => setShowFlashcardAnswer(true)}>
                        Odhalit správné vlastnosti
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-[scale-in_0.25s_ease]">
                      <TraitChips
                        emojis={allItemEmojis(currentCard)}
                        options={emojiOptions}
                        tone="orange"
                      />
                      <CellMorphology
                        taxonEmojis={allItemEmojis(currentCard)}
                        className="bg-white"
                      />
                      <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">
                          Úroveň odpovědi:
                        </span>
                        <div className="flex gap-1.5 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => rateCard("hard")}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            <Frown size={13} /> Neumím
                          </button>
                          <button
                            type="button"
                            onClick={() => rateCard("medium")}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-100/70 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            <HelpCircle size={13} /> Skoro
                          </button>
                          <button
                            type="button"
                            onClick={() => rateCard("easy")}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-1.5 bg-brand-orange hover:bg-brand-orange-text text-white rounded-lg text-[11px] font-extrabold cursor-pointer"
                          >
                            <Smile size={13} /> Umím!
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
              <Brain className="mx-auto text-stone-400" size={24} />
              <p className="text-sm font-bold text-stone-800">Prázdný balíček</p>
              <Button
                onClick={() => {
                  setFlashcardFilterPhylum("Vše");
                  setFlashcardFilterRank("Vše");
                }}
              >
                Resetovat filtry
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* MATRIX */}
      {tab === "matrix" && (
        <MatrixPanel
          rows={filteredList}
          totalCount={taxonFlatList.length}
          emojiOptions={emojiOptions}
          availablePhyla={availablePhyla}
          activePhylumFilter={activePhylumFilter}
          setActivePhylumFilter={setActivePhylumFilter}
          activeRankFilter={activeRankFilter}
          setActiveRankFilter={setActiveRankFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTraits={selectedTraits}
          setSelectedTraits={setSelectedTraits}
        />
      )}
    </PageShell>
  );
}
