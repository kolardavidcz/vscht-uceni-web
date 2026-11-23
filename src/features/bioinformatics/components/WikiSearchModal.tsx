import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CornerDownLeft,
  ExternalLink,
  FileText,
  Hash,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { materialHref, type WikiMaterial } from "../lib/contentLoader";
import { searchMaterialsFullText } from "../lib/wikiHelpers";

type Props = {
  materials: WikiMaterial[];
  onClose: () => void;
};

export function WikiSearchModal({ materials, onClose }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hits = useMemo(
    () => searchMaterialsFullText(materials, query, 12),
    [materials, query]
  );

  useEffect(() => {
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const openMaterial = (material: WikiMaterial) => {
    onClose();
    if (material.externalUrl) {
      window.open(material.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(materialHref(material));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (hits.length ? (i + 1) % hits.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) =>
          hits.length ? (i - 1 + hits.length) % hits.length : 0
        );
      } else if (e.key === "Enter" && hits[selectedIndex]) {
        e.preventDefault();
        openMaterial(hits[selectedIndex].material);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hits, selectedIndex, onClose]);

  const quickTopics = [
    "Valgrind",
    "Progtest",
    "Dijkstra",
    "WSL",
    "KOS",
    "Indukce",
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] px-3 sm:px-4 print:hidden">
      <button
        type="button"
        aria-label="Zavřít vyhledávání"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Fulltextové vyhledávání ve Wiki"
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-stone-200 bg-stone-50/70">
          <Search size={18} className="text-brand-orange shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat v názvech, nadpisech i obsahu článků…"
            className="flex-1 bg-transparent text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
              aria-label="Vymazat dotaz"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-stone-400 bg-white border border-stone-200 rounded-md">
            ESC
          </kbd>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Rychlé dotazy
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setQuery(topic)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-orange-50 hover:text-brand-orange-text text-stone-700 border border-stone-200/70 transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 pt-1">
                Hledání ignoruje diakritiku a prohledává všech {materials.length}{" "}
                materiálů.
              </p>
            </div>
          ) : hits.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              Pro dotaz <strong className="text-stone-800">„{query}“</strong>{" "}
              nebylo nic nalezeno.
            </div>
          ) : (
            <ul className="space-y-1">
              {hits.map((hit, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li key={hit.material.path}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => openMaterial(hit.material)}
                      className={cn(
                        "w-full text-left rounded-xl px-3.5 py-2.5 transition-colors cursor-pointer flex items-start gap-3",
                        isSelected
                          ? "bg-orange-50/90 ring-1 ring-brand-orange/30"
                          : "hover:bg-stone-50"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 p-1.5 rounded-lg shrink-0",
                          isSelected
                            ? "bg-brand-orange text-white"
                            : "bg-stone-100 text-stone-500"
                        )}
                      >
                        {hit.matchType === "heading" ? (
                          <Hash size={14} />
                        ) : hit.material.externalUrl ? (
                          <ExternalLink size={14} />
                        ) : (
                          <FileText size={14} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "text-xs sm:text-sm font-bold truncate",
                              isSelected
                                ? "text-brand-orange-text"
                                : "text-stone-900"
                            )}
                          >
                            {hit.material.title}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                            {hit.material.categoryLabel}
                          </span>
                        </div>
                        {hit.snippet && (
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                            {hit.snippet}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <CornerDownLeft
                          size={14}
                          className="text-brand-orange shrink-0 mt-1"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between text-[10px] font-semibold text-stone-400">
          <span>↑↓ navigace · Enter otevřít</span>
          <span>Ctrl+K / ⌘K</span>
        </div>
      </div>
    </div>
  );
}
