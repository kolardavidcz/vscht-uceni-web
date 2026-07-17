import { useEffect, useState } from "react";
import { Check, Eye, FileEdit, GitPullRequest, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MarkdownView } from "./MarkdownView";
import type { WikiMaterial } from "../lib/contentLoader";

type Props = {
  material: WikiMaterial;
  /** Repo-relative path e.g. src/features/bioinformatics/content/… */
  repoFilePath: string;
  onClose: () => void;
};

type Mode = "edit" | "preview";

export function SuggestEditModal({ material, repoFilePath, onClose }: Props) {
  const [draft, setDraft] = useState(material.raw);
  const [note, setNote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [mode, setMode] = useState<Mode>("edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    branch: string;
    branchUrl: string;
    compareUrl: string;
    prUrl: string;
    prNumber: number;
  } | null>(null);

  const dirty = draft !== material.raw;

  useEffect(() => {
    setDraft(material.raw);
    setNote("");
    setError("");
    setResult(null);
    setMode("edit");
  }, [material.path, material.raw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = async () => {
    if (!dirty) {
      setError("Nejdřív něco změňte v markdownu.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/suggest-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: repoFilePath,
          title: material.title,
          markdown: draft,
          note,
          authorName,
        }),
      });
      const text = await res.text();
      let data: {
        error?: string;
        detail?: string;
        branch?: string;
        branchUrl?: string;
        compareUrl?: string;
        prUrl?: string;
        prNumber?: number;
      } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          setError(
            res.ok
              ? "Server vrátil neplatnou odpověď (ne JSON)."
              : `API ${res.status}: prázdná/neplatná odpověď. Restartujte dev server (npm run dev) — lokální /api plugin musí běžet. Na Vercelu zkontrolujte GITHUB_TOKEN.`
          );
          return;
        }
      } else if (!res.ok) {
        setError(
          `API ${res.status}: prázdná odpověď. Restartujte \`npm run dev\` po přidání .env.local, nebo nasaďte na Vercel s GITHUB_TOKEN.`
        );
        return;
      }

      if (!res.ok) {
        setError(
          [data.error, data.detail].filter(Boolean).join(" — ") ||
            `Chyba ${res.status}`
        );
        return;
      }
      if (
        data.branch &&
        data.branchUrl &&
        data.compareUrl &&
        data.prUrl &&
        data.prNumber != null
      ) {
        setResult({
          branch: data.branch,
          branchUrl: data.branchUrl,
          compareUrl: data.compareUrl,
          prUrl: data.prUrl,
          prNumber: data.prNumber,
        });
      } else {
        setError(
          "Odesláno, ale chybí odkaz na PR. Zkontrolujte oprávnění tokenu (Pull requests: write)."
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Síťová chyba");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] cursor-default"
        aria-label="Zavřít"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggest-edit-title"
        className="relative z-10 w-full sm:max-w-5xl max-h-[min(94vh,900px)] flex flex-col rounded-t-2xl sm:rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 flex items-start gap-3 px-4 sm:px-5 py-3.5 border-b border-stone-200 bg-gradient-to-r from-orange-50/80 to-white">
          <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange shrink-0">
            <FileEdit size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="suggest-edit-title"
              className="font-display font-black text-stone-900 text-base sm:text-lg leading-tight"
            >
              Navrhnout úpravu
            </h2>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5 truncate">
              {material.title}
              <span className="text-stone-400"> · </span>
              <code className="text-[10px] bg-stone-100 px-1 py-0.5 rounded">
                {repoFilePath.replace(
                  "src/features/bioinformatics/content/",
                  ""
                )}
              </code>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {result ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Check size={28} />
            </div>
            <div>
              <p className="font-black text-stone-900 text-lg">
                Pull request vytvořen
              </p>
              <p className="text-sm text-stone-500 mt-1 max-w-md">
                Návrh je na GitHubu jako{" "}
                <strong>PR #{result.prNumber}</strong> (větev{" "}
                <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                  {result.branch}
                </code>
                ).{" "}
                <strong className="text-stone-700">
                  Neslučuje se automaticky
                </strong>{" "}
                — zkontrolujte diff a merge ručně.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={result.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold shadow-md shadow-brand-orange/20 hover:bg-brand-orange-text"
              >
                <GitPullRequest size={16} />
                Otevřít PR #{result.prNumber}
              </a>
              <a
                href={result.branchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-bold hover:bg-stone-50"
              >
                Zobrazit větev
              </a>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Zavřít
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="shrink-0 flex items-center gap-1 px-4 sm:px-5 pt-3">
              {(
                [
                  { id: "edit", label: "Markdown", icon: FileEdit },
                  { id: "preview", label: "Náhled", icon: Eye },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMode(tab.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors",
                      mode === tab.id
                        ? "bg-brand-orange text-white"
                        : "text-stone-500 hover:bg-stone-100"
                    )}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
              {dirty && (
                <span className="ml-2 text-[10px] font-bold text-brand-orange-text">
                  neuložené změny
                </span>
              )}
            </div>

            {/* Editor / preview */}
            <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-5 py-3">
              {mode === "edit" ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  spellCheck={false}
                  className="w-full h-full min-h-[280px] sm:min-h-[360px] resize-none rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-3 font-mono text-[12px] sm:text-[13px] leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/25 focus:border-brand-orange"
                  placeholder="# Nadpis&#10;&#10;Text materiálu…"
                />
              ) : (
                <div className="h-full min-h-[280px] sm:min-h-[360px] overflow-y-auto rounded-xl border border-stone-200 bg-white px-4 py-3">
                  <MarkdownView content={draft} />
                </div>
              )}
            </div>

            {/* Meta + submit */}
            <div className="shrink-0 border-t border-stone-200 bg-stone-50/60 px-4 sm:px-5 py-3 space-y-2.5">
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Vaše jméno (volitelné)"
                  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:border-brand-orange"
                />
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Krátká poznámka"
                  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:border-brand-orange"
                />
              </div>
              {error && (
                <p className="text-xs font-semibold text-rose-600 leading-snug">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] text-stone-400 font-medium max-w-md">
                  Odesláním vznikne větev, commit a pull request na GitHubu.
                  Merge je ruční — Vercel preview se pro větve{" "}
                  <code className="text-[9px] bg-stone-200/80 px-1 rounded">
                    suggest/*
                  </code>{" "}
                  přeskočí.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={onClose}>
                    Zrušit
                  </Button>
                  <Button
                    size="sm"
                    onClick={submit}
                    disabled={submitting || !dirty}
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <GitPullRequest size={14} />
                    )}
                    {submitting ? "Odesílám…" : "Submit change"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Map Vite module path → repo file path */
export function materialToRepoPath(material: WikiMaterial): string {
  const cleaned = material.path
    .replace(/^\.\.\/content\//, "")
    .replace(/\\/g, "/");
  // path may still be like ../content/... depending on glob keys
  const rel = cleaned.includes("content/")
    ? cleaned.slice(cleaned.indexOf("content/") + "content/".length)
    : cleaned;
  return `src/features/bioinformatics/content/${rel.replace(/^\//, "")}`;
}
