import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Database,
  Download,
  Eye,
  FileDiff,
  FileEdit,
  Loader2,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { loadWikiMaterials } from "../lib/contentLoader";
import { buildCompactDiff, computeLineDiff } from "../lib/lineDiff";
import { MarkdownView } from "./MarkdownView";
import { materialToRepoPath } from "./SuggestEditModal";

type WikiSuggestion = {
  id: string;
  filePath: string;
  title: string;
  markdown: string;
  note?: string;
  authorName?: string;
  createdAt: string;
};

type WikiOverride = {
  markdown: string;
  updatedAt: string;
  updatedBy?: string;
  note?: string;
};

type Props = {
  password: string;
  onPendingCountChange?: (count: number) => void;
};

type ReviewView = "diff" | "edit" | "preview";

function downloadMarkdown(filePath: string, content: string) {
  const filename = filePath.split("/").pop() || "wiki.md";
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function WikiAdminPanel({ password, onPendingCountChange }: Props) {
  const bundledByPath = useMemo(() => {
    const map = new Map<string, { title: string; raw: string }>();
    for (const m of loadWikiMaterials()) {
      map.set(materialToRepoPath(m), { title: m.title, raw: m.raw });
    }
    return map;
  }, []);

  const [suggestions, setSuggestions] = useState<WikiSuggestion[]>([]);
  const [overrides, setOverrides] = useState<Record<string, WikiOverride>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ReviewView>("diff");
  const [editedMarkdown, setEditedMarkdown] = useState("");

  const flashStatus = (text: string) => {
    setStatusMsg(text);
    window.setTimeout(() => setStatusMsg(""), 4000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wiki-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "list" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        suggestions?: WikiSuggestion[];
        overrides?: Record<string, WikiOverride>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || `API ${res.status}`);
        return;
      }
      const list = data.suggestions || [];
      setSuggestions(list);
      setOverrides(data.overrides || {});
      onPendingCountChange?.(list.length);
      setSelectedId((prev) =>
        prev && list.some((s) => s.id === prev) ? prev : list[0]?.id ?? null
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba připojení k API");
    } finally {
      setLoading(false);
    }
  }, [password, onPendingCountChange]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const selected = useMemo(
    () => suggestions.find((s) => s.id === selectedId) ?? null,
    [suggestions, selectedId]
  );

  useEffect(() => {
    if (selected) {
      setEditedMarkdown(selected.markdown);
      setView("diff");
    }
  }, [selected?.id]);

  const currentBaseMarkdown = useMemo(() => {
    if (!selected) return "";
    return (
      overrides[selected.filePath]?.markdown ??
      bundledByPath.get(selected.filePath)?.raw ??
      ""
    );
  }, [selected, overrides, bundledByPath]);

  const diffSummary = useMemo(() => {
    if (!selected) return null;
    return computeLineDiff(currentBaseMarkdown, editedMarkdown);
  }, [selected, currentBaseMarkdown, editedMarkdown]);

  const compactDiff = useMemo(() => {
    if (!diffSummary) return [];
    return buildCompactDiff(diffSummary.lines, 3);
  }, [diffSummary]);

  const handleApprove = async (suggestion: WikiSuggestion) => {
    setBusyId(suggestion.id);
    setError("");
    try {
      const res = await fetch("/api/wiki-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "approve",
          id: suggestion.id,
          markdown: editedMarkdown,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        suggestions?: WikiSuggestion[];
        overrides?: Record<string, WikiOverride>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || `Schválení selhalo (${res.status})`);
        return;
      }
      const nextList = data.suggestions || [];
      setSuggestions(nextList);
      setOverrides(data.overrides || {});
      onPendingCountChange?.(nextList.length);
      setSelectedId(nextList[0]?.id ?? null);
      flashStatus(`Publikováno živě: ${suggestion.title}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (suggestion: WikiSuggestion) => {
    if (!confirm(`Zamítnout a smazat návrh pro „${suggestion.title}“?`)) return;
    setBusyId(suggestion.id);
    setError("");
    try {
      const res = await fetch("/api/wiki-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "reject",
          id: suggestion.id,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        suggestions?: WikiSuggestion[];
        overrides?: Record<string, WikiOverride>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || `Zamítnutí selhalo (${res.status})`);
        return;
      }
      const nextList = data.suggestions || [];
      setSuggestions(nextList);
      setOverrides(data.overrides || {});
      onPendingCountChange?.(nextList.length);
      setSelectedId(nextList[0]?.id ?? null);
      flashStatus(`Návrh zamítnut: ${suggestion.title}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleRevertOverride = async (filePath: string) => {
    if (
      !confirm(
        `Vrátit „${filePath.replace("src/features/bioinformatics/content/", "")}“ na původní verzi z gitu?`
      )
    ) {
      return;
    }
    setBusyId(filePath);
    setError("");
    try {
      const res = await fetch("/api/wiki-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "revert",
          filePath,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        suggestions?: WikiSuggestion[];
        overrides?: Record<string, WikiOverride>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || `Vrácení selhalo (${res.status})`);
        return;
      }
      setSuggestions(data.suggestions || []);
      setOverrides(data.overrides || {});
      flashStatus("Stránka vrácena na verzi z repozitáře.");
    } finally {
      setBusyId(null);
    }
  };

  const overrideEntries = Object.entries(overrides);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-stone-50/50">
      <div className="shrink-0 px-5 py-3 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Database size={16} className="text-brand-orange" />
          <div>
            <h2 className="text-sm font-black text-stone-900">
              Wiki návrhy & živé přepisy (Upstash Redis)
            </h2>
            <p className="text-[11px] text-stone-500 font-medium">
              {suggestions.length} čekajících návrhů · {overrideEntries.length}{" "}
              živých přepisů v databázi
            </p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => void fetchAll()} disabled={loading}>
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Obnovit
        </Button>
      </div>

      {statusMsg && (
        <div className="shrink-0 px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-xs font-bold text-emerald-700 text-center">
          {statusMsg}
        </div>
      )}
      {error && (
        <div className="shrink-0 px-4 py-2 bg-rose-50 border-b border-rose-200 text-xs font-bold text-rose-700 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center gap-2 text-stone-500 text-xs font-bold">
          <Loader2 size={16} className="animate-spin text-brand-orange" />
          Načítám návrhy z databáze…
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left column: pending queue + live overrides */}
          <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-stone-200 bg-white flex flex-col min-h-0 max-h-[38vh] lg:max-h-none overflow-y-auto">
            <div className="p-3 border-b border-stone-100 bg-stone-50/70">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                Čekající návrhy ({suggestions.length})
              </h3>
            </div>
            {suggestions.length === 0 ? (
              <p className="p-4 text-xs text-stone-400 font-medium">
                Žádné nevyřízené návrhy úprav.
              </p>
            ) : (
              <div className="divide-y divide-stone-100">
                {suggestions.map((s) => {
                  const active = selected?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className={cn(
                        "w-full text-left p-3.5 transition-colors cursor-pointer border-l-4",
                        active
                          ? "bg-orange-50/80 border-l-brand-orange"
                          : "border-l-transparent hover:bg-stone-50"
                      )}
                    >
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {s.title}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                        {s.filePath.replace(
                          "src/features/bioinformatics/content/",
                          ""
                        )}
                      </div>
                      {s.note && (
                        <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                          {s.note}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-400 font-semibold">
                        <span>{s.authorName || "Anonymní student"}</span>
                        <span>
                          {new Date(s.createdAt).toLocaleString("cs-CZ", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active live overrides */}
            <div className="p-3 border-y border-stone-100 bg-stone-50/70 mt-auto">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                Živé přepisy v DB ({overrideEntries.length})
              </h3>
            </div>
            {overrideEntries.length === 0 ? (
              <p className="p-4 text-xs text-stone-400 font-medium">
                Všechny články běží přímo ze souborů v gitu.
              </p>
            ) : (
              <div className="divide-y divide-stone-100">
                {overrideEntries.map(([filePath, ov]) => {
                  const title =
                    bundledByPath.get(filePath)?.title ||
                    filePath.split("/").pop();
                  return (
                    <div
                      key={filePath}
                      className="p-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-800 truncate">
                          {title}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {new Date(ov.updatedAt).toLocaleDateString("cs-CZ")}
                          {ov.updatedBy ? ` · ${ov.updatedBy}` : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => downloadMarkdown(filePath, ov.markdown)}
                          title="Stáhnout .md pro commit do gitu"
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-brand-orange hover:border-brand-orange/40 cursor-pointer"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={busyId === filePath}
                          onClick={() => void handleRevertOverride(filePath)}
                          title="Smazat přepis z DB a vrátit verzi z gitu"
                          className="p-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right pane: diff / edit / preview of selected suggestion */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {selected ? (
              <>
                <div className="shrink-0 p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-stone-900 truncate">
                      {selected.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                      <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                        {selected.filePath.replace(
                          "src/features/bioinformatics/content/",
                          ""
                        )}
                      </code>
                      {diffSummary && (
                        <span className="font-mono font-bold">
                          <span className="text-emerald-600">
                            +{diffSummary.added}
                          </span>{" "}
                          <span className="text-rose-600">
                            -{diffSummary.removed}
                          </span>
                        </span>
                      )}
                      {selected.authorName && (
                        <span>· Od: {selected.authorName}</span>
                      )}
                    </div>
                    {selected.note && (
                      <p className="text-xs text-stone-700 mt-1.5 bg-orange-50/70 border border-orange-100 rounded-lg px-2.5 py-1.5">
                        <strong>Poznámka:</strong> {selected.note}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadMarkdown(selected.filePath, editedMarkdown)
                      }
                      title="Stáhnout .md soubor"
                    >
                      <Download size={13} /> .md
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={busyId === selected.id}
                      onClick={() => void handleReject(selected)}
                    >
                      <Trash2 size={13} /> Zamítnout
                    </Button>
                    <Button
                      size="sm"
                      disabled={busyId === selected.id}
                      onClick={() => void handleApprove(selected)}
                    >
                      {busyId === selected.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Check size={13} />
                      )}
                      Schválit & publikovat
                    </Button>
                  </div>
                </div>

                {/* View switcher */}
                <div className="shrink-0 px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center gap-1.5">
                  {(
                    [
                      { id: "diff", label: "Rozdíl (Diff)", icon: FileDiff },
                      { id: "edit", label: "Upravit před schválením", icon: FileEdit },
                      { id: "preview", label: "Náhled", icon: Eye },
                    ] as const
                  ).map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setView(tab.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors",
                          view === tab.id
                            ? "bg-brand-orange text-white"
                            : "text-stone-600 hover:bg-stone-200/70"
                        )}
                      >
                        <Icon size={13} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {view === "diff" && (
                    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden font-mono text-xs">
                      {compactDiff.length === 0 ? (
                        <p className="p-6 text-center text-stone-400">
                          Obsah je shodný s aktuální verzí.
                        </p>
                      ) : (
                        compactDiff.map((row, idx) => {
                          if (row.type === "skip") {
                            return (
                              <div
                                key={`skip-${idx}`}
                                className="px-3 py-1 bg-stone-100 text-stone-400 text-[10px] font-sans font-bold border-y border-stone-200/60"
                              >
                                … {row.count} nezměněných řádků …
                              </div>
                            );
                          }
                          return (
                            <div
                              key={idx}
                              className={cn(
                                "flex whitespace-pre-wrap break-words px-3 py-0.5 leading-relaxed",
                                row.type === "add" &&
                                  "bg-emerald-50 text-emerald-950",
                                row.type === "remove" &&
                                  "bg-rose-50 text-rose-950 line-through decoration-rose-400/60"
                              )}
                            >
                              <span className="w-8 shrink-0 text-right pr-2 text-stone-400 select-none text-[10px]">
                                {row.oldLine ?? ""}
                              </span>
                              <span className="w-8 shrink-0 text-right pr-2 text-stone-400 select-none text-[10px]">
                                {row.newLine ?? ""}
                              </span>
                              <span
                                className={cn(
                                  "w-4 shrink-0 font-bold select-none",
                                  row.type === "add"
                                    ? "text-emerald-600"
                                    : row.type === "remove"
                                      ? "text-rose-600"
                                      : "text-stone-300"
                                )}
                              >
                                {row.type === "add"
                                  ? "+"
                                  : row.type === "remove"
                                    ? "-"
                                    : " "}
                              </span>
                              <span className="flex-1 min-w-0">{row.text}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {view === "edit" && (
                    <textarea
                      value={editedMarkdown}
                      onChange={(e) => setEditedMarkdown(e.target.value)}
                      spellCheck={false}
                      className="w-full h-full min-h-[420px] rounded-xl border border-stone-200 bg-white p-4 font-mono text-xs leading-relaxed text-stone-800 focus:outline-none focus:border-brand-orange"
                    />
                  )}

                  {view === "preview" && (
                    <div className="rounded-xl border border-stone-200 bg-white p-5">
                      <MarkdownView content={editedMarkdown} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-8 text-center gap-2">
                <FileDiff size={34} className="text-stone-300" />
                <p className="text-xs font-black uppercase tracking-widest">
                  Vyberte návrh vlevo
                </p>
                <p className="text-xs max-w-xs text-stone-500">
                  Když student klikne ve Wiki na „Navrhnout úpravu“, návrh se
                  objeví tady s řádkovým diffem a můžete ho jedním klikem
                  publikovat živě.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
