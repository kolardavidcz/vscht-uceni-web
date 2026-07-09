import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Play, Terminal } from 'lucide-react';

export function PythonAnalyzer() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Python Analyzátor - Bioinformatika";
  }, []);

  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [execDone, setExecDone] = useState(false);

  const pythonScript = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bioinformatická analýza sekvence DNA/RNA
Autor: VSCHT Bioinf
"""

def analyze_sequence(seq):
    seq = seq.upper().strip()
    seq = "".join([c for c in seq if c in "ATCGU"])
    
    length = len(seq)
    if length == 0:
        print("Chyba: Prázdná sekvence!")
        return
        
    counts = {n: seq.count(n) for n in "ATCGU"}
    gc_content = ((counts['G'] + counts['C']) / length) * 100
    
    print("=" * 40)
    print(" VÝSLEDKY BIOINFORMATICKÉ ANALÝZY")
    print("=" * 40)
    print(f"Délka sekvence: {length} bp")
    print(f"Obsah GC:        {gc_content:.2f} %")
    print("-" * 40)
    print("Frekvence nukleotidu:")
    for n, count in counts.items():
        if count > 0 or n in "ATCG":
            pct = (count / length) * 100
            print(f"  {n}: {count:5d} ({pct:6.2f} %)")
            
    rna = seq.replace("T", "U")
    print("-" * 40)
    print(f"RNA transkript (prvních 60 bp):\n  {rna[:60]}")
    
    codon_table = {
        'AUG': 'M', 'UUU': 'F', 'UUC': 'F', 'UUA': 'L', 'UUG': 'L', 'UCU': 'S', 'UCC': 'S', 'UCA': 'S', 'UCG': 'S',
        'UAU': 'Y', 'UAC': 'Y', 'UAA': '*', 'UAG': '*', 'UGU': 'C', 'UGC': 'C', 'UGA': '*', 'UGG': 'W', 'CUU': 'L',
        'CUC': 'L', 'CUA': 'L', 'CUG': 'L', 'CCU': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P', 'CAU': 'H', 'CAC': 'H',
        'CAA': 'Q', 'CAG': 'Q', 'CGU': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'AUU': 'I', 'AUC': 'I', 'AUA': 'I',
        'ACU': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T', 'AAU': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K', 'AGU': 'S',
        'AGC': 'S', 'AGA': 'R', 'AGG': 'R', 'GUU': 'V', 'GUC': 'V', 'GUA': 'V', 'GUG': 'V', 'GCU': 'A', 'GCC': 'A',
        'GCA': 'A', 'GCG': 'A', 'GAU': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E', 'GGU': 'G', 'GGC': 'G', 'GGA': 'G',
        'GGG': 'G'
    }
    
    protein = []
    for i in range(0, len(rna) - 2, 3):
        codon = rna[i:i+3]
        protein.append(codon_table.get(codon, "?"))
        
    print(f"Proteinový preklad (prvních 20 AA):\n  {''.join(protein[:20])}")
    print("=" * 40)

if __name__ == "__main__":
    test_dna = "ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC"
    analyze_sequence(test_dna)
`;

  const copyScript = () => {
    navigator.clipboard.writeText(pythonScript);
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

  const mockOutput = `> python analyze_sequence.py\n========================================\n VÝSLEDKY BIOINFORMATICKÉ ANALÝZY\n========================================\nDélka sekvence: 44 bp\nObsah GC:        45.45 %\n----------------------------------------\nFrekvence nukleotidu:\n  A:    11 ( 25.00 %)\n  T:    13 ( 29.55 %)\n  C:     8 ( 18.18 %)\n  G:    12 ( 27.27 %)\n----------------------------------------\nRNA transkript (prvních 60 bp):\n  AUGCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUC\nProteinový preklad (prvních 20 AA):\n  MRSID*IRSID*IRSID*IR\n========================================`;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white relative overflow-hidden" style={{ background: '#0f0906' }}>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-mocha/25 blur-[120px] pointer-events-none" />

      <header className="page-header-dark">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-dark p-2.5 text-slate-350 shrink-0" title="Zpet na rozcestník">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-amber-100">
              ?? Python Bioinformatický Skript
            </h1>
            <p className="text-brand-peach text-xs font-medium tracking-wide">Analýza DNA/RNA sekvencí • Spustte lokálne nebo zkopírujte</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col gap-6">

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/40 border border-brand-orange/10 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-orange/10 border border-brand-orange/20 rounded-xl text-brand-orange shrink-0">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">analyze_sequence.py</h2>
              <p className="text-xs text-slate-400 mt-0.5">Cistý Python 3 • Žádné externí závislosti</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={copyScript}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Zkopírováno!' : 'Kopírovat kód'}</span>
            </button>
            <button
              onClick={handleExecute}
              disabled={executing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-text disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-brand-orange/20 active:scale-[0.98]"
            >
              <Play size={14} className={executing ? 'animate-pulse' : ''} />
              <span>{executing ? 'Spouštím...' : execDone ? '? Hotovo' : 'Spustit'}</span>
            </button>
          </div>
        </div>

        {/* Terminal output */}
        {(executing || execDone) && (
          <div className="bg-slate-950/70 border border-brand-orange/15 rounded-2xl overflow-hidden animate-fade-in-up">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-950/40">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-[11px] text-brand-orange font-mono font-bold uppercase tracking-wider">Terminal Output</span>
              {execDone && <span className="ml-auto text-emerald-400 text-[11px] font-semibold">? Dokonceno</span>}
            </div>
            <pre className="font-mono text-xs text-slate-300 leading-relaxed p-5">
              {executing ? '> python analyze_sequence.py\n?' : mockOutput}
            </pre>
            {execDone && (
              <p className="text-[10px] text-slate-500 px-5 pb-4 italic">
                ?? Demonstracní výstup. Pro reálné výsledky spustte skript lokálne pres Python 3.
              </p>
            )}
          </div>
        )}

        {/* Code block */}
        <div className="flex-1 bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-950/60">
            <span className="w-3 h-3 rounded-full bg-rose-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-[11px] text-slate-500 font-mono">analyze_sequence.py</span>
          </div>
          <pre className="text-amber-100/80 p-5 font-mono text-xs overflow-auto flex-1 leading-relaxed whitespace-pre-wrap">
            {pythonScript}
          </pre>
        </div>
      </main>

      <footer className="border-t border-brand-orange/15 py-6 text-center text-xs text-slate-400 mt-auto" style={{ background: '#0f0906', boxShadow: '0 -10px 30px rgba(249,93,18,0.04)' }}>
        <p>VSCHT Bioinfo Py-Analyzer • Cistý Python standard library • Bez externích modulu</p>
      </footer>
    </div>
  );
}
