import { useEffect, useState } from "react";
import { Check, Copy, Play, Terminal } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { MOCK_OUTPUT, PYTHON_SCRIPT } from "../data/script";

export function PythonAnalyzerPage() {
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [execDone, setExecDone] = useState(false);

  useEffect(() => {
    document.title = "Python Analyzátor — VŠCHT Učení";
  }, []);

  const copyScript = async () => {
    await navigator.clipboard.writeText(PYTHON_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    setExecuting(true);
    setExecDone(false);
    setTimeout(() => {
      setExecuting(false);
      setExecDone(true);
      setTimeout(() => setExecDone(false), 6000);
    }, 1200);
  };

  return (
    <PageShell
      title="🐍 Python Bioinformatický Skript"
      subtitle="Analýza DNA/RNA sekvencí • Spusťte lokálně nebo zkopírujte"
      theme="dark"
      className="relative overflow-hidden"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-mocha/25 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
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
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="dark" className="flex-1 sm:flex-none" onClick={copyScript}>
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Zkopírováno!" : "Kopírovat kód"}
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              onClick={handleExecute}
              disabled={executing}
            >
              <Play size={14} className={executing ? "animate-pulse" : ""} />
              {executing ? "Spouštím…" : execDone ? "Hotovo" : "Spustit"}
            </Button>
          </div>
        </div>

        {(executing || execDone) && (
          <div className="bg-slate-950/70 border border-brand-orange/15 rounded-2xl overflow-hidden animate-[fade-in-up_0.4s_ease]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-950/40">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-[11px] text-brand-orange font-mono font-bold uppercase tracking-wider">
                Terminal Output
              </span>
              {execDone && (
                <span className="ml-auto text-emerald-400 text-[11px] font-semibold">
                  ✓ Dokončeno
                </span>
              )}
            </div>
            <pre className="font-mono text-xs text-slate-300 leading-relaxed p-5 whitespace-pre-wrap">
              {executing ? "> python analyze_sequence.py\n..." : MOCK_OUTPUT}
            </pre>
            {execDone && (
              <p className="text-[10px] text-slate-500 px-5 pb-4 italic">
                💡 Demonstrační výstup. Pro reálné výsledky spusťte skript lokálně
                přes Python 3.
              </p>
            )}
          </div>
        )}

        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-950/60">
            <span className="w-3 h-3 rounded-full bg-rose-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-[11px] text-slate-500 font-mono">
              analyze_sequence.py
            </span>
          </div>
          <pre className="text-amber-100/80 p-5 font-mono text-xs overflow-auto leading-relaxed whitespace-pre-wrap">
            {PYTHON_SCRIPT}
          </pre>
        </div>
      </div>
    </PageShell>
  );
}
