import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Dna,
  Download,
  FlaskConical,
  Play,
  Terminal,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PYTHON_SCRIPT } from "../data/script";
import {
  analyzeSequence,
  SEQUENCE_PRESETS,
  type Nucleotide,
} from "../lib/sequenceAnalyzer";

const NT_BAR_COLORS: Record<Nucleotide, string> = {
  A: "bg-emerald-500",
  T: "bg-amber-500",
  U: "bg-amber-400",
  C: "bg-orange-500",
  G: "bg-rose-500",
};

export function PythonAnalyzerPage() {
  const [sequenceInput, setSequenceInput] = useState(
    SEQUENCE_PRESETS[0].sequence
  );
  const [activeFrame, setActiveFrame] = useState<0 | 1 | 2>(0);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedRevComp, setCopiedRevComp] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showScript, setShowScript] = useState(true);

  useEffect(() => {
    document.title = "DNA/RNA & Python Analyzátor - VŠCHT Učení";
  }, []);

  const analysis = useMemo(
    () => analyzeSequence(sequenceInput),
    [sequenceInput]
  );

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      window.setTimeout(() => setter(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const downloadScript = () => {
    const blob = new Blob([PYTHON_SCRIPT], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analyze_sequence.py";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell
      title="🐍 DNA/RNA & Python Analyzátor"
      subtitle="Živá bioinformatická analýza v prohlížeči + čistý Python 3 skript"
      theme="dark"
      className="relative overflow-hidden"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-mocha/25 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Interactive Sequence Workbench */}
        <section className="bg-slate-950/55 border border-brand-orange/15 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-orange/10 border border-brand-orange/20 rounded-xl text-brand-orange shrink-0">
                <Dna size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight">
                  Interaktivní analýza sekvence (FASTA / DNA / RNA)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vložte vlastní sekvenci nebo vyberte příklad — výsledky se
                  počítají okamžitě.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEQUENCE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.description}
                  onClick={() => {
                    setSequenceInput(preset.sequence);
                    setShowTerminal(true);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer",
                    sequenceInput === preset.sequence
                      ? "bg-brand-orange text-white border-brand-orange"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-brand-orange/30"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={sequenceInput}
            onChange={(e) => setSequenceInput(e.target.value)}
            rows={3}
            spellCheck={false}
            placeholder=">Vlastni_sekvence&#10;ATGCGATCGATCG..."
            className="w-full rounded-xl bg-black/40 border border-white/10 focus:border-brand-orange outline-none p-3.5 font-mono text-xs sm:text-sm text-amber-100 placeholder:text-slate-600 resize-y leading-relaxed"
          />

          {analysis ? (
            <div className="space-y-4">
              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Délka · Typ
                  </div>
                  <div className="text-xl font-black text-white mt-1 tabular-nums">
                    {analysis.length}{" "}
                    <span className="text-xs font-bold text-brand-orange">
                      nt ({analysis.moleculeType})
                    </span>
                  </div>
                  {analysis.ignoredChars > 0 && (
                    <div className="text-[10px] text-amber-400 mt-0.5">
                      Ignorováno {analysis.ignoredChars} neplatných znaků
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Obsah GC
                  </div>
                  <div className="text-xl font-black text-white mt-1 tabular-nums">
                    {analysis.gcPercent.toFixed(1)}{" "}
                    <span className="text-xs font-bold text-brand-orange">%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-brand-orange rounded-full transition-all"
                      style={{ width: `${Math.min(100, analysis.gcPercent)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Odhad Tₘ
                  </div>
                  <div className="text-xl font-black text-white mt-1 tabular-nums">
                    {analysis.meltingTempC != null
                      ? `${analysis.meltingTempC.toFixed(1)} °C`
                      : "—"}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {analysis.length < 14 ? "Wallace pravidlo" : "Marmur-Doty"}
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Nejdelší ORF
                  </div>
                  <div className="text-xl font-black text-white mt-1 tabular-nums">
                    {analysis.longestOrf ? (
                      <>
                        {analysis.longestOrf.lengthAa}{" "}
                        <span className="text-xs font-bold text-emerald-400">
                          AA (rámec +{analysis.longestOrf.frame})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">Nenalezen</span>
                    )}
                  </div>
                  {analysis.longestOrf && (
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      nt {analysis.longestOrf.startNt}–{analysis.longestOrf.endNt}
                    </div>
                  )}
                </div>
              </div>

              {/* Nucleotide composition bar */}
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                    Zastoupení bází
                  </span>
                  <div className="flex flex-wrap gap-3 font-mono">
                    {(["A", "T", "U", "C", "G"] as Nucleotide[])
                      .filter((n) => analysis.counts[n] > 0 || (n !== "U" && analysis.moleculeType !== "RNA"))
                      .map((n) => (
                        <span key={n} className="inline-flex items-center gap-1.5 text-slate-200">
                          <span className={cn("w-2 h-2 rounded-full", NT_BAR_COLORS[n])} />
                          {n}: {analysis.counts[n]} (
                          {((analysis.counts[n] / analysis.length) * 100).toFixed(1)}%)
                        </span>
                      ))}
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-white/5">
                  {(["A", "T", "U", "C", "G"] as Nucleotide[]).map((n) => {
                    const pct = (analysis.counts[n] / analysis.length) * 100;
                    if (pct <= 0) return null;
                    return (
                      <div
                        key={n}
                        className={cn(NT_BAR_COLORS[n], "h-full transition-all")}
                        style={{ width: `${pct}%` }}
                        title={`${n}: ${analysis.counts[n]} (${pct.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Reverse complement & 3-frame translation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Reverzní komplement (5&apos; → 3&apos;)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(analysis.reverseComplement, setCopiedRevComp)
                      }
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-orange hover:underline cursor-pointer"
                    >
                      {copiedRevComp ? <Check size={12} /> : <Copy size={12} />}
                      {copiedRevComp ? "Zkopírováno" : "Kopírovat"}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-amber-100/90 break-all max-h-24 overflow-y-auto leading-relaxed">
                    {analysis.reverseComplement}
                  </p>
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <FlaskConical size={12} className="text-brand-orange" />
                      Překlad do aminokyselin
                    </span>
                    <div className="flex gap-1">
                      {([0, 1, 2] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setActiveFrame(f)}
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-black cursor-pointer transition-colors",
                            activeFrame === f
                              ? "bg-brand-orange text-white"
                              : "bg-white/5 text-slate-400 hover:text-white"
                          )}
                        >
                          +{f + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="font-mono text-xs text-emerald-300/90 break-all max-h-24 overflow-y-auto leading-relaxed">
                    {analysis.frames[activeFrame] || (
                      <span className="text-slate-500">
                        Příliš krátká sekvence pro tento čtecí rámec.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 p-6 text-center text-xs text-slate-400">
              Zadejte alespoň jeden platný nukleotid (A, T, C, G nebo U).
            </div>
          )}
        </section>

        {/* Action bar for Python script & Terminal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/40 border border-brand-orange/10 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-orange/10 border border-brand-orange/20 rounded-xl text-brand-orange shrink-0">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                analyze_sequence.py
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Čistý Python 3 • Žádné externí závislosti
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="dark"
              size="sm"
              onClick={() => copyText(PYTHON_SCRIPT, setCopiedScript)}
            >
              {copiedScript ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} />
              )}
              {copiedScript ? "Zkopírováno!" : "Kopírovat .py"}
            </Button>
            <Button variant="dark" size="sm" onClick={downloadScript}>
              <Download size={14} />
              Stáhnout .py
            </Button>
            <Button
              size="sm"
              onClick={() => setShowTerminal((v) => !v)}
            >
              <Play size={14} />
              {showTerminal ? "Skrýt terminál" : "Zobrazit terminál"}
            </Button>
          </div>
        </div>

        {showTerminal && analysis && (
          <div className="bg-slate-950/75 border border-brand-orange/15 rounded-2xl overflow-hidden animate-[fade-in-up_0.3s_ease]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-950/40">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-[11px] text-brand-orange font-mono font-bold uppercase tracking-wider">
                Terminal Output (živý výpočet)
              </span>
              <span className="ml-auto text-emerald-400 text-[11px] font-semibold">
                ✓ {analysis.length} bp
              </span>
            </div>
            <pre className="font-mono text-xs text-slate-300 leading-relaxed p-5 whitespace-pre-wrap overflow-x-auto">
              {analysis.terminalOutput}
            </pre>
          </div>
        )}

        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowScript((v) => !v)}
            className="w-full flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 hover:bg-slate-950/80 transition-colors cursor-pointer text-left"
          >
            <span className="w-3 h-3 rounded-full bg-rose-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <Code2 size={14} className="ml-2 text-brand-orange" />
            <span className="text-[11px] text-slate-300 font-mono font-bold">
              analyze_sequence.py
            </span>
            <span className="ml-auto text-[11px] text-slate-500 font-semibold">
              {showScript ? "Skrýt kód" : "Zobrazit kód"}
            </span>
          </button>
          {showScript && (
            <pre className="text-amber-100/80 p-5 font-mono text-xs overflow-auto leading-relaxed whitespace-pre-wrap">
              {PYTHON_SCRIPT}
            </pre>
          )}
        </div>
      </div>
    </PageShell>
  );
}
