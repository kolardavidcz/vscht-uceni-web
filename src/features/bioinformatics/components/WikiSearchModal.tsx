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

function isPointerOutside(e: PointerEvent, dialog: HTMLDialogElement): boolean {
  const r = dialog.getBoundingClientRect();
  return (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  );
}

export function WikiSearchModal({ materials, onClose }: Props) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hits = useMemo(
    () => searchMaterialsFullText(materials, query, 12),
    [materials, query]
  );

  // Open native modal dialog in top layer (Esc, inert background, focus return handled natively)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    inputRef.current?.focus();

    const handleClose = () => {
      dialog.returnValue = "";
      onClose();
    };
    dialog.addEventListener("close", handleClose);

    // Light-dismiss fallback for browsers without native `closedby` (e.g. Safari)
    let pressedOutside = false;
    const needsFallback = !("closedBy" in HTMLDialogElement.prototype);
    const onDown = (e: PointerEvent) => {
      pressedOutside = isPointerOutside(e, dialog);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && isPointerOutside(e, dialog)) {
        dialog.close();
      }
      pressedOutside = false;
    };
    if (needsFallback) {
      dialog.addEventListener("pointerdown", onDown);
      dialog.addEventListener("pointerup", onUp);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      if (needsFallback) {
        dialog.removeEventListener("pointerdown", onDown);
        dialog.removeEventListener("pointerup", onUp);
      }
    };
  }, [onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const openMaterial = (material: WikiMaterial) => {
    dialogRef.current?.close();
    if (material.externalUrl) {
      window.open(material.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(materialHref(material));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
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

  const quickTopics = [
    "Valgrind",
    "Progtest",
    "Dijkstra",
    "WSL",
    "KOS",
    "Indukce",
  ];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Fulltextové vyhledávání ve Wiki"
      {...({ closedby: "any" } as Record<string, string>)}
      onKeyDown={handleKeyDown}
      className="mx-auto mt-[10vh] mb-auto p-0 bg-transparent border-0 max-w-none w-[min(94vw,42rem)] max-h-[75vh] open:flex flex-col overflow-visible print:hidden"
    >
      <div className="w-full max-h-[75vh] rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-stone-200 bg-stone-50/70">
          <Search size={18} className="text-brand-orange shrink-0" />
          <input
            ref={inputRef}
            autoFocus
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
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Zavřít vyhledávání"
            className="px-1.5 py-0.5 text-[10px] font-bold text-stone-400 hover:text-stone-700 bg-white border border-stone-200 rounded-md cursor-pointer"
          >
            ESC
          </button>
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
    </dialog>
  );
}
