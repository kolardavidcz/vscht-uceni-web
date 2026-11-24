import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Download,
  ExternalLink,
  FileCode2,
  FileUp,
  Play,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  classifyUploadedFile,
  FILE_KIND_LABELS,
  type DetectedFileKind,
  type RoutedFile,
} from "../lib/fileRouter";
import {
  runFullPipeline,
  type FullPipelineConfig,
  type FullPipelineInputs,
  type FullPipelineOutput,
} from "../lib/fullPipelineRunner";
import { buildZipBlob } from "../lib/zipExporter";
import {
  GH48_DEMO_ADJACENCY,
  GH48_DEMO_CHAR_FASTA,
  GH48_DEMO_DB_DOMAINS_FASTA,
  GH48_DEMO_FIMO,
  GH48_DEMO_HMM_REPORT,
  GH48_DEMO_NEWICK,
  GH48_DEMO_RAW_FASTA,
  GH48_DEMO_TAXONOMY,
} from "../data/gh48DemoData";

interface FullPipelinePanelProps {
  onApplyOutputs: (output: FullPipelineOutput) => void;
  onJumpToTab: (tab: "fasta" | "hmm" | "mmseqs" | "fimo" | "tree") => void;
}

const EXTERNAL_WORKBENCH_LINKS = [
  {
    step: "1",
    name: "NCBI Protein",
    role: "Stažení surové FASTA",
    url: "https://www.ncbi.nlm.nih.gov/protein/",
  },
  {
    step: "3",
    name: "EBI HMMER",
    role: "hmmsearch → --domtblout",
    url: "https://www.ebi.ac.uk/Tools/hmmer/search/hmmsearch",
  },
  {
    step: "4 & 6",
    name: "UseGalaxy.eu",
    role: "MMseqs2 & trimAl",
    url: "https://usegalaxy.eu/",
  },
  {
    step: "5",
    name: "MAFFT Web",
    role: "Zarovnání L-INS-i (MSA)",
    url: "https://www.ebi.ac.uk/jdispatcher/msa/mafft",
  },
  {
    step: "7",
    name: "IQ-TREE Web",
    role: "ML strom + UFBoot 1000",
    url: "https://iqtree.cibiv.univie.ac.at/",
  },
  {
    step: "8–10",
    name: "MEME Suite",
    role: "MEME, TOMTOM & FIMO",
    url: "https://meme-suite.org/",
  },
  {
    step: "11",
    name: "iTOL",
    role: "Vizualizace stromu & anotací",
    url: "https://itol.embl.de/upload.cgi",
  },
  {
    step: "Ref",
    name: "UniProt / CAZy",
    role: "Charakterizované enzymy",
    url: "https://www.uniprot.org/",
  },
];

function formatBytes(len: number): string {
  if (len < 1024) return `${len} B`;
  return `${(len / 1024).toFixed(1)} kB`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadText(filename: string, content: string) {
  downloadBlob(filename, new Blob([content], { type: "text/plain;charset=utf-8" }));
}

export function FullPipelinePanel({
  onApplyOutputs,
  onJumpToTab,
}: FullPipelinePanelProps) {
  const progressId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<RoutedFile[]>([
    classifyUploadedFile("01_gh48_raw_sample.fasta", GH48_DEMO_RAW_FASTA),
    classifyUploadedFile("03_hmmsearch_report.txt", GH48_DEMO_HMM_REPORT),
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Configurable runner parameters
  const [clusterSeqIdPct, setClusterSeqIdPct] = useState(90);
  const [trimalMaxGapPct, setTrimalMaxGapPct] = useState(50);
  const [bootstrapReps, setBootstrapReps] = useState(40);
  const [motifCount, setMotifCount] = useState(10);

  // Run state
  const [isRunning, setIsRunning] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastOutput, setLastOutput] = useState<FullPipelineOutput | null>(null);

  const ingestFileList = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    const routed: RoutedFile[] = [];
    for (const f of incoming) {
      const text = await f.text();
      routed.push(classifyUploadedFile(f.name, text));
    }
    setFiles((prev) => {
      // Replace existing file of the same kind (except unknown) so dropping a new MAFFT or IQ-TREE file upgrades that step cleanly
      const next = [...prev];
      for (const item of routed) {
        const existingIdx =
          item.kind === "unknown"
            ? -1
            : next.findIndex((p) => p.kind === item.kind);
        if (existingIdx >= 0) next[existingIdx] = item;
        else next.push(item);
      }
      return next;
    });
    setStatusMessage(`Načteno a rozpoznáno ${routed.length} souborů.`);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      void ingestFileList(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      void ingestFileList(e.target.files);
      e.target.value = "";
    }
  };

  const updateFileKind = (index: number, kind: DetectedFileKind) => {
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, kind, label: FILE_KIND_LABELS[kind] } : f
      )
    );
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const executeWithFiles = async (targetFiles: RoutedFile[]) => {
    const inputs: FullPipelineInputs = {};
    for (const f of targetFiles) {
      if (f.kind === "raw_fasta") inputs.rawFasta = f.content;
      else if (f.kind === "hmm_domtblout") inputs.hmmReport = f.content;
      else if (f.kind === "adjacency_tsv") inputs.adjacencyTsv = f.content;
      else if (f.kind === "aligned_fasta") inputs.alignedFasta = f.content;
      else if (f.kind === "newick") inputs.newick = f.content;
      else if (f.kind === "fimo_tsv") inputs.fimoTsv = f.content;
      else if (f.kind === "taxonomy_tsv") inputs.taxonomyTsv = f.content;
      else if (f.kind === "characterized_fasta") inputs.characterizedFasta = f.content;
      else if (f.kind === "db_domains_fasta") inputs.dbDomainsFasta = f.content;
    }

    const config: FullPipelineConfig = {
      clusterMinSeqId: clusterSeqIdPct / 100,
      trimalMaxGap: trimalMaxGapPct / 100,
      njBootstrapReplicates: bootstrapReps,
      discoverMotifCount: motifCount,
    };

    setIsRunning(true);
    setProgressPct(5);
    setProgressLabel("Spouštím kompletní bioinformatickou pipeline…");

    try {
      const out = await runFullPipeline(inputs, config, (p) => {
        setProgressPct(p.percent);
        setProgressLabel(p.stageLabel);
      });
      setLastOutput(out);
      onApplyOutputs(out);
      setStatusMessage(
        `Pipeline dokončena za ${out.durationMs} ms. Připraveno ${out.artifacts.length} výstupních souborů ke stažení.`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const loadPresetAndRun = (mode: "fasta-only" | "full-gh48") => {
    const preset: RoutedFile[] =
      mode === "fasta-only"
        ? [
            classifyUploadedFile("01_gh48_raw_sample.fasta", GH48_DEMO_RAW_FASTA),
            classifyUploadedFile("03_hmmsearch_report.txt", GH48_DEMO_HMM_REPORT),
          ]
        : [
            classifyUploadedFile("01_gh48_raw_sample.fasta", GH48_DEMO_RAW_FASTA),
            classifyUploadedFile("03_hmmsearch_report.txt", GH48_DEMO_HMM_REPORT),
            classifyUploadedFile("04_adjacency_list.tabular", GH48_DEMO_ADJACENCY),
            classifyUploadedFile("07_iqtree_phylogeny.nhx", GH48_DEMO_NEWICK),
            classifyUploadedFile("10_fimo_out.tsv", GH48_DEMO_FIMO),
            classifyUploadedFile("11_taxonomy.tsv", GH48_DEMO_TAXONOMY),
            classifyUploadedFile("11_characterized.fasta", GH48_DEMO_CHAR_FASTA),
            classifyUploadedFile("03_gh48_domains.fasta", GH48_DEMO_DB_DOMAINS_FASTA),
          ];
    setFiles(preset);
    void executeWithFiles(preset);
  };

  const handleDownloadZip = () => {
    if (!lastOutput) return;
    const blob = buildZipBlob(lastOutput.artifacts);
    downloadBlob("gh48_pipeline_outputs.zip", blob);
  };

  return (
    <div className="space-y-6">
      <div role="status" className="bio-sr-status">
        {statusMessage}
      </div>

      {/* Hero: Dropzone + Run Controls */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b0e08] to-[#120a06] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
              <Cpu size={13} />
              Soubory dovnitř → Kompletní výsledky &amp; ZIP ven
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">
              Automatický běh celé pipeline (kroky 2–11)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Vložte libovolnou kombinaci souborů (třeba jen samotnou surovou{" "}
              <code className="text-amber-200">.fasta</code>, nebo už hotové výstupy z MAFFT,
              IQ-TREE, HMMER a FIMO). Chybějící kroky se automaticky dopočítají lokálně v prohlížeči
              a vygenerují se všechny výstupy i kompletní ZIP balíček pro iTOL a protokol.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => loadPresetAndRun("fasta-only")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Sparkles size={13} className="text-brand-orange" />
              Test: jen FASTA → vše lokálně
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => loadPresetAndRun("full-gh48")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer disabled:opacity-40"
            >
              <FileCode2 size={13} className="text-brand-orange" />
              Test: plná GH48 sada (8 souborů)
            </button>
          </div>
        </div>

        {/* Multi-file smart dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-brand-orange bg-brand-orange/15"
              : "border-white/15 bg-black/30 hover:border-brand-orange/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".fasta,.fa,.faa,.txt,.tsv,.tab,.tabular,.nwk,.nhx,.treefile,.tre,.out"
            onChange={handleFileInput}
            className="hidden"
          />
          <UploadCloud size={28} className="mx-auto text-brand-orange mb-2" />
          <div className="text-sm font-bold text-white">
            Přetáhněte sem soubory (`.fasta`, `--domtblout`, `MAFFT`, `.treefile`, `fimo.tsv`, `taxonomy.tsv`)
          </div>
          <div className="text-xs text-slate-400 mt-1 mb-3">
            Formát každého souboru se automaticky rozpozná podle obsahu · nic se neodesílá na server
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <FileUp size={14} className="text-brand-orange" />
            Vybrat soubory z počítače
          </button>
        </div>

        {/* Detected files roster */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                Vstupní soubory ve frontě ({files.length})
              </span>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-slate-400 hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} />
                Vyprázdnit frontu
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {files.map((f, i) => (
                <div
                  key={`${f.filename}-${i}`}
                  className="rounded-xl border border-white/10 bg-[#140b07] px-3 py-2.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-bold text-white truncate">
                      {f.filename}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {f.summary} · {formatBytes(f.content.length)}
                    </div>
                  </div>
                  <select
                    aria-label={`Typ souboru ${f.filename}`}
                    value={f.kind}
                    onChange={(e) =>
                      updateFileKind(i, e.target.value as DetectedFileKind)
                    }
                    className="rounded-lg bg-black/50 border border-white/15 px-2 py-1 text-[11px] text-amber-200 max-w-[175px]"
                  >
                    {(Object.keys(FILE_KIND_LABELS) as DetectedFileKind[]).map((k) => (
                      <option key={k} value={k}>
                        {FILE_KIND_LABELS[k]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label={`Odebrat ${f.filename}`}
                    className="p-1 text-slate-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameters + Execute CTA */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-3 text-xs">
            <label className="space-y-1">
              <span className="block text-[11px] font-bold uppercase text-slate-400">
                Shlukování id ({clusterSeqIdPct} %)
              </span>
              <input
                type="number"
                min={50}
                max={100}
                value={clusterSeqIdPct}
                onChange={(e) => setClusterSeqIdPct(Number(e.target.value) || 90)}
                className="w-24 rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-bold uppercase text-slate-400">
                trimAl max mezery ({trimalMaxGapPct} %)
              </span>
              <input
                type="number"
                min={10}
                max={95}
                value={trimalMaxGapPct}
                onChange={(e) => setTrimalMaxGapPct(Number(e.target.value) || 50)}
                className="w-24 rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-bold uppercase text-slate-400">
                NJ Bootstrap ({bootstrapReps}×)
              </span>
              <input
                type="number"
                min={0}
                max={100}
                step={10}
                value={bootstrapReps}
                onChange={(e) => setBootstrapReps(Number(e.target.value) || 0)}
                className="w-24 rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-bold uppercase text-slate-400">
                Počet motivů
              </span>
              <input
                type="number"
                min={3}
                max={25}
                value={motifCount}
                onChange={(e) => setMotifCount(Number(e.target.value) || 10)}
                className="w-24 rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={isRunning || files.length === 0}
            onClick={() => void executeWithFiles(files)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-sm font-black shadow-lg shadow-brand-orange/20 transition-colors cursor-pointer"
          >
            <Play size={15} />
            {isRunning ? "Počítám pipeline…" : "Spustit celou pipeline"}
          </button>
        </div>

        {/* Native accessible <progress> bar (modern-web-guidance: progress) */}
        {(isRunning || progressPct > 0) && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor={progressId} className="font-semibold text-slate-200">
                {progressLabel}
              </label>
              <span className="font-mono text-brand-orange font-bold">
                {progressPct} %
              </span>
            </div>
            <progress
              id={progressId}
              className="bio-progress"
              value={progressPct}
              max={100}
            />
          </div>
        )}
      </section>

      {/* External Bioinformatic Web Servers Strip */}
      <section className="rounded-2xl border border-white/10 bg-[#140b07] p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-sm font-black uppercase tracking-wider text-white">
            Externí webové nástroje pro kroky vyžadující HPC (MAFFT, IQ-TREE, MEME, iTOL)
          </h3>
          <span className="text-[11px] text-slate-400">
            Výstup z externího serveru stačí přetáhnout zpět nahoru — pipeline ho automaticky zařadí
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EXTERNAL_WORKBENCH_LINKS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-white/10 bg-black/30 hover:border-brand-orange/50 hover:bg-brand-orange/[0.06] p-3 transition-colors flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="px-1.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange font-mono text-[10px] font-bold">
                  Krok {tool.step}
                </span>
                <ExternalLink
                  size={12}
                  className="text-slate-400 group-hover:text-brand-orange transition-colors"
                />
              </div>
              <div className="font-bold text-xs text-white group-hover:text-brand-orange transition-colors">
                {tool.name}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">{tool.role}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Pipeline Results + One-Click ZIP + Stage Provenance */}
      {lastOutput && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-brand-orange/35 bg-brand-orange/[0.08] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 size={15} />
                Hotovo za {lastOutput.durationMs} ms · výsledky propsány do všech záložek
              </div>
              <h3 className="font-display text-lg font-black text-white">
                Připraveno {lastOutput.artifacts.length} výstupních souborů (FASTA, MSA, Newick, FIMO, iTOL, protokol)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadZip}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-black transition-colors cursor-pointer"
              >
                <Archive size={15} />
                Stáhnout vše (.zip)
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadText("12_pipeline_report.md", lastOutput.reportMarkdown)
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Download size={14} />
                Protokol (.md)
              </button>
              <button
                type="button"
                onClick={() => onJumpToTab("tree")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Zobrazit strom &amp; χ²
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Per-stage execution log with individual downloads + external links */}
          <div className="space-y-2">
            <h3 className="font-display text-sm font-black uppercase tracking-wider text-slate-300">
              Průběh kroků &amp; mezivýstupy (stáhněte pro MAFFT / IQ-TREE / MEME / iTOL)
            </h3>
            <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-[#140b07] overflow-hidden">
              {lastOutput.stages.map((s) => {
                const badgeCls =
                  s.origin === "uploaded"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/35"
                    : s.origin === "computed"
                    ? "bg-brand-orange/15 text-brand-orange border-brand-orange/35"
                    : "bg-white/5 text-slate-400 border-white/10";
                const badgeText =
                  s.origin === "uploaded"
                    ? "Ze souboru"
                    : s.origin === "computed"
                    ? "Vypočteno lokálně"
                    : "Přeskočeno";
                return (
                  <div
                    key={s.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 font-mono text-xs font-black text-brand-orange flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {s.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeCls}`}
                          >
                            {badgeText}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.detail}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {s.outputFile && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadText(s.outputFile!.name, s.outputFile!.content)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-semibold text-slate-200 transition-colors cursor-pointer"
                        >
                          <Download size={12} className="text-brand-orange" />
                          {s.outputFile.name}
                        </button>
                      )}
                      {s.externalTool && (
                        <a
                          href={s.externalTool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/25 text-[11px] font-bold text-brand-orange transition-colors"
                        >
                          {s.externalTool.label}
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All downloadable output files */}
          <div className="space-y-2">
            <h3 className="font-display text-sm font-black uppercase tracking-wider text-slate-300">
              Všechny vygenerované soubory ({lastOutput.artifacts.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {lastOutput.artifacts.map((art) => {
                const len =
                  typeof art.content === "string"
                    ? art.content.length
                    : art.content.byteLength;
                return (
                  <button
                    key={art.name}
                    type="button"
                    onClick={() =>
                      typeof art.content === "string"
                        ? downloadText(art.name, art.content)
                        : downloadBlob(art.name, new Blob([new Uint8Array(art.content)]))
                    }
                    className="rounded-xl border border-white/10 bg-[#140b07] hover:border-brand-orange/50 px-3 py-2.5 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-white truncate">
                        {art.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{formatBytes(len)}</div>
                    </div>
                    <Download size={14} className="text-brand-orange shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
