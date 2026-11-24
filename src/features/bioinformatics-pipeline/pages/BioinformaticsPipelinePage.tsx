import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ArrowDown,
  ArrowLeft,
  Check,
  Copy,
  Dna,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import "../pipeline.css";
import {
  DEFAULT_EXCLUDE_TERMS,
  filterFasta,
  parseFasta,
  serializeFasta,
  type FastaRecord,
} from "../lib/fastaTools";
import { cutDomainsFromFasta, parseDomtblout, type HmmCutRow } from "../lib/hmmCutter";
import { clusterSequencesGreedy } from "../lib/sequenceClustering";
import { buildCenterStarMsa, isAlignedFasta, trimAlignment } from "../lib/msaAndTrimal";
import { buildNeighborJoiningTree } from "../lib/njPhylogeny";
import { getLeaves, parseNewick } from "../lib/newickParser";
import { discoverAndScanMotifs } from "../lib/motifDiscovery";
import {
  analyzeFimoMotifs,
  generateItolBinary,
  generateItolHeatmap,
  generateMotifStatsTsv,
  parseFimoTsv,
  type MotifStatsRow,
} from "../lib/fimoAndItol";
import {
  generateCharacterizedMappingTsv,
  generateCharacterizedSymbols,
  generateCharacterizedTreeColors,
  mapCharacterizedToTree,
  parseAdjacencyList,
  type CharacterizedMatch,
} from "../lib/characterizedMapper";
import {
  analyzeMotifByTaxonomy,
  buildTaxonColorMap,
  generateItolTaxonomyColorstrip,
  generateItolTaxonomyLabels,
  parseTaxonomyTsv,
  type TaxRank,
  type TaxonomyRecord,
} from "../lib/taxonomyStats";
import {
  classifyUploadedFile,
  type DetectedFileKind,
} from "../lib/fileRouter";
import {
  runFullPipeline,
  synthesizeTaxonomyFromFasta,
  type FullPipelineOutput,
} from "../lib/fullPipelineRunner";
import { buildZipBlob, type ZipEntry } from "../lib/zipExporter";
import {
  GH48_DEMO_ADJACENCY,
  GH48_DEMO_CHAR_FASTA,
  GH48_DEMO_DB_DOMAINS_FASTA,
  GH48_DEMO_FIMO,
  GH48_DEMO_HMM_REPORT,
  GH48_DEMO_NEWICK,
  GH48_DEMO_RAW_FASTA,
  GH48_DEMO_TAXONOMY,
  GH48_PIPELINE_STEPS,
} from "../data/gh48DemoData";
import {
  SortableDataTable,
  type TableColumn,
} from "../components/SortableDataTable";
import { PhyloTreeSvg } from "../components/PhyloTreeSvg";
import { MotifHeatmapSvg } from "../components/MotifHeatmapSvg";

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

function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
) {
  downloadBlob(filename, new Blob([content], { type: mime }));
}

function formatPValue(p: number): string {
  if (!Number.isFinite(p)) return "—";
  if (p < 1e-4) return p.toExponential(2);
  return p.toFixed(4);
}

function FileUploadButton({
  label,
  accept,
  onLoad,
}: {
  label: string;
  accept?: string;
  onLoad: (text: string, filename: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onLoad(reader.result, name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
      >
        <Upload size={13} className="text-brand-orange" />
        {label}
      </button>
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer shrink-0"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Zkopírováno" : "Kopírovat"}
    </button>
  );
}

function MetricCell({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2.5 ${
        accent
          ? "border-brand-orange/35 bg-brand-orange/[0.08]"
          : "border-white/10 bg-black/25"
      }`}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div
        className={`mt-0.5 font-display text-lg sm:text-xl font-black tabular-nums ${
          accent ? "text-brand-orange" : "text-white"
        }`}
      >
        {value}
      </div>
      {hint && <div className="text-[11px] text-slate-400">{hint}</div>}
    </div>
  );
}

interface StepConnectorProps {
  nextInputLabel: string;
  externalTools?: { label: string; url: string }[];
  upstreamFile?: { filename: string; content: string; label?: string } | null;
  localAction?: { label: string; onClick: () => void; disabled?: boolean } | null;
}

function StepConnector({
  nextInputLabel,
  externalTools,
  upstreamFile,
  localAction,
}: StepConnectorProps) {
  return (
    <div className="relative pl-6 sm:pl-8 py-3">
      <div
        aria-hidden="true"
        className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-brand-orange/30"
      />
      <div className="rounded-xl border border-brand-orange/25 bg-[#190e08] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <ArrowDown size={14} className="text-brand-orange shrink-0" />
          <span className="text-slate-200">{nextInputLabel}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {upstreamFile && upstreamFile.content.trim().length > 0 && (
            <button
              type="button"
              onClick={() => downloadTextFile(upstreamFile.filename, upstreamFile.content)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Download size={12} className="text-brand-orange" />
              {upstreamFile.label ?? upstreamFile.filename}
            </button>
          )}
          {externalTools?.map((tool) => (
            <a
              key={tool.label}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-amber-200 hover:text-brand-orange transition-colors"
            >
              {tool.label}
              <ExternalLink size={11} />
            </a>
          ))}
          {localAction && (
            <button
              type="button"
              disabled={localAction.disabled}
              onClick={localAction.onClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Play size={11} />
              {localAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MsaOccupancyChart({
  aligned,
  maxGapFraction,
}: {
  aligned: FastaRecord[];
  maxGapFraction: number;
}) {
  const bins = useMemo(() => {
    if (aligned.length === 0) return [];
    const cols = aligned[0].sequence.length;
    const n = aligned.length;
    const numBins = Math.min(80, Math.max(1, cols));
    const binSize = cols / numBins;
    const minOccToKeep = 1 - maxGapFraction;

    return Array.from({ length: numBins }, (_, b) => {
      const start = Math.floor(b * binSize);
      const end = Math.max(start + 1, Math.floor((b + 1) * binSize));
      let occSum = 0;
      for (let c = start; c < end; c++) {
        let nonGap = 0;
        for (let r = 0; r < n; r++) {
          const ch = aligned[r].sequence[c];
          if (ch && ch !== "-" && ch !== ".") nonGap++;
        }
        occSum += nonGap / n;
      }
      const occ = occSum / (end - start);
      return { occ, keep: occ >= minOccToKeep };
    });
  }, [aligned, maxGapFraction]);

  if (bins.length === 0) return null;

  const w = 640;
  const h = 72;
  const barW = w / bins.length;
  const thresholdY = h * maxGapFraction; // y from top: occupancy 1 - maxGapFraction -> top offset = maxGapFraction * h

  return (
    <div className="rounded-lg border border-white/10 bg-[#110906] p-3 space-y-1.5">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Profil obsazenosti sloupců MSA (ponechané vs. ořezané trimAl)</span>
        <span className="font-mono">
          práh: ≥ {Math.round((1 - maxGapFraction) * 100)} % ne-mezer
        </span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-16"
        role="img"
        aria-label="Profil obsazenosti sloupců zarovnání MSA"
      >
        {bins.map((bin, idx) => {
          const barH = Math.max(2, bin.occ * h);
          return (
            <rect
              key={idx}
              x={idx * barW + 0.5}
              y={h - barH}
              width={Math.max(1.5, barW - 1)}
              height={barH}
              rx={1}
              fill={bin.keep ? "#f95d12" : "#475569"}
            />
          );
        })}
        <line
          x1={0}
          y1={thresholdY}
          x2={w}
          y2={thresholdY}
          stroke="#fdba74"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      </svg>
    </div>
  );
}

export function BioinformaticsPipelinePage() {
  const progressId = useId();
  const multiUploadRef = useRef<HTMLInputElement>(null);

  // Stage inputs (initialized with GH48 showcase dataset)
  const [rawFastaText, setRawFastaText] = useState(GH48_DEMO_RAW_FASTA);
  const [hmmReportText, setHmmReportText] = useState(GH48_DEMO_HMM_REPORT);
  const [adjacencyText, setAdjacencyText] = useState(GH48_DEMO_ADJACENCY);
  const [clusteredRepsText, setClusteredRepsText] = useState("");
  const [alignedFastaText, setAlignedFastaText] = useState("");
  const [newickText, setNewickText] = useState(GH48_DEMO_NEWICK);
  const [taxonomyText, setTaxonomyText] = useState(GH48_DEMO_TAXONOMY);
  const [charFastaText, setCharFastaText] = useState(GH48_DEMO_CHAR_FASTA);
  const [dbDomainsText, setDbDomainsText] = useState(GH48_DEMO_DB_DOMAINS_FASTA);
  const [fimoText, setFimoText] = useState(GH48_DEMO_FIMO);

  // Source tracking labels
  const [treeOrigin, setTreeOrigin] = useState<"uploaded" | "computed">("uploaded");
  const [fimoOrigin, setFimoOrigin] = useState<"uploaded" | "computed">("uploaded");
  const [taxOrigin, setTaxOrigin] = useState<"uploaded" | "computed">("uploaded");
  const [loadedFilenames, setLoadedFilenames] = useState<
    Partial<Record<DetectedFileKind, string>>
  >({
    raw_fasta: "01_ncbi_raw.fasta",
    hmm_domtblout: "03_hmmsearch_report.txt",
    adjacency_tsv: "04_adjacency_list.tabular",
    newick: "07_iqtree_phylogeny.nhx",
    taxonomy_tsv: "11_taxonomy.tsv",
    characterized_fasta: "11_characterized.fasta",
    db_domains_fasta: "03_gh48_domains.fasta",
    fimo_tsv: "10_fimo_out.tsv",
  });

  // Step 1: FASTA filter options
  const [excludeTermsText, setExcludeTermsText] = useState(
    DEFAULT_EXCLUDE_TERMS.join(", ")
  );
  const [minLen, setMinLen] = useState(100);
  const [maxLen, setMaxLen] = useState(4000);
  const [dedupId, setDedupId] = useState(true);
  const [dedupSeq, setDedupSeq] = useState(false);

  // Step 2: HMM cutter options
  const [coordMode, setCoordMode] = useState<"env" | "ali">("env");
  const [dedupMode, setDedupMode] = useState<"longest" | "best-evalue" | "all">("longest");
  const [padding, setPadding] = useState(0);
  const [maxIEvalueExp, setMaxIEvalueExp] = useState(-5);
  const [minDomainLen, setMinDomainLen] = useState(100);

  // Step 3: Clustering options
  const [clusterSeqIdPct, setClusterSeqIdPct] = useState(90);
  const [clusterCovPct, setClusterCovPct] = useState(80);

  // Step 4: trimAl options
  const [trimalMaxGapPct, setTrimalMaxGapPct] = useState(50);

  // Step 5: Tree & Taxonomy options
  const [cladogram, setCladogram] = useState(false);
  const [showBootstrap, setShowBootstrap] = useState(true);
  const [bootstrapThreshold, setBootstrapThreshold] = useState(85);
  const [colorMode, setColorMode] = useState<"taxonomy" | "motif">("taxonomy");
  const [taxRank, setTaxRank] = useState<TaxRank>("phylum");
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>("BAE94320.1");

  // Step 6: FIMO & chi-square options
  const [fimoPExp, setFimoPExp] = useState(-4);
  const [minVariance, setMinVariance] = useState(10);
  const [minCovPct, setMinCovPct] = useState(10);
  const [maxCovPct, setMaxCovPct] = useState(98);
  const [heatmapFilter, setHeatmapFilter] = useState<"all" | "heatmap" | "binary">("all");
  const [selectedMotifForStats, setSelectedMotifForStats] = useState("MEME-23");

  // Dropzone & runner status
  const [isDragging, setIsDragging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastReportMarkdown, setLastReportMarkdown] = useState<string | null>(null);

  useEffect(() => {
    document.title = "GH48 Pipeline · VŠCHT Učení";
  }, []);

  // --- Reactive stage calculations (top -> down) ---

  // Step 1
  const parsedRawFasta = useMemo(() => parseFasta(rawFastaText), [rawFastaText]);
  const fastaFilterResult = useMemo(
    () =>
      filterFasta(parsedRawFasta, {
        excludeTerms: excludeTermsText.split(","),
        minLength: minLen,
        maxLength: maxLen,
        deduplicateById: dedupId,
        deduplicateBySequence: dedupSeq,
      }),
    [parsedRawFasta, excludeTermsText, minLen, maxLen, dedupId, dedupSeq]
  );
  const filteredFastaText = useMemo(
    () => serializeFasta(fastaFilterResult.kept),
    [fastaFilterResult.kept]
  );

  // Step 2
  const hmmBaseRecords = useMemo(
    () =>
      fastaFilterResult.kept.length > 0 ? fastaFilterResult.kept : parsedRawFasta,
    [fastaFilterResult.kept, parsedRawFasta]
  );
  const hmmCutResult = useMemo(() => {
    const hits = parseDomtblout(hmmReportText);
    return cutDomainsFromFasta(hmmBaseRecords, hits, {
      coordMode,
      dedupMode,
      padding,
      maxIEvalue: Math.pow(10, maxIEvalueExp),
      minDomainLength: minDomainLen,
    });
  }, [hmmBaseRecords, hmmReportText, coordMode, dedupMode, padding, maxIEvalueExp, minDomainLen]);

  const step2DomainRecords = useMemo(
    () =>
      hmmCutResult.croppedRecords.length > 0
        ? hmmCutResult.croppedRecords
        : hmmBaseRecords,
    [hmmCutResult.croppedRecords, hmmBaseRecords]
  );
  const croppedDomainsFastaText = useMemo(
    () => serializeFasta(step2DomainRecords),
    [step2DomainRecords]
  );

  // Step 3
  const adjacencySummary = useMemo(
    () => parseAdjacencyList(adjacencyText),
    [adjacencyText]
  );
  const repRecords = useMemo(() => {
    const explicit = clusteredRepsText ? parseFasta(clusteredRepsText) : [];
    if (explicit.length > 0) return explicit;
    if (adjacencySummary.totalClusters > 0 && step2DomainRecords.length > 0) {
      const repSet = new Set(adjacencySummary.repToMembers.keys());
      const subset = step2DomainRecords.filter((r) => repSet.has(r.id));
      if (subset.length > 0) return subset;
    }
    return step2DomainRecords;
  }, [clusteredRepsText, adjacencySummary, step2DomainRecords]);
  const repsFastaText = useMemo(() => serializeFasta(repRecords), [repRecords]);

  // Step 4
  const alignedRecords = useMemo(() => {
    const recs = alignedFastaText ? parseFasta(alignedFastaText) : [];
    return recs.length >= 2 && isAlignedFasta(recs) ? recs : [];
  }, [alignedFastaText]);

  const trimResult = useMemo(
    () =>
      trimAlignment(alignedRecords, {
        maxGapFraction: trimalMaxGapPct / 100,
      }),
    [alignedRecords, trimalMaxGapPct]
  );
  const trimmedFastaText = useMemo(
    () => serializeFasta(trimResult.trimmed),
    [trimResult.trimmed]
  );

  // Step 5
  const treeRoot = useMemo(() => parseNewick(newickText), [newickText]);
  const treeLeafSet = useMemo(
    () => new Set(treeRoot ? getLeaves(treeRoot).map((l) => l.name) : []),
    [treeRoot]
  );

  const taxonomyRecords = useMemo(
    () => parseTaxonomyTsv(taxonomyText),
    [taxonomyText]
  );
  const taxonomyByAcc = useMemo(() => {
    const map = new Map<string, TaxonomyRecord>();
    for (const r of taxonomyRecords) map.set(r.accession, r);
    return map;
  }, [taxonomyRecords]);
  const taxonColorMap = useMemo(
    () => buildTaxonColorMap(taxonomyRecords, taxRank),
    [taxonomyRecords, taxRank]
  );

  const effectiveDbDomains = dbDomainsText.trim()
    ? dbDomainsText
    : croppedDomainsFastaText;
  const charMappingResult = useMemo(() => {
    const chars = parseFasta(charFastaText);
    const db = parseFasta(effectiveDbDomains);
    return mapCharacterizedToTree(chars, db, treeLeafSet, adjacencySummary);
  }, [charFastaText, effectiveDbDomains, treeLeafSet, adjacencySummary]);

  const charStatusByLeaf = useMemo(() => {
    const map = new Map<string, CharacterizedMatch["status"]>();
    for (const m of charMappingResult.matches) {
      if (m.treeLeafId && m.status !== "unmatched") {
        if (map.get(m.treeLeafId) !== "direct") {
          map.set(m.treeLeafId, m.status);
        }
      }
    }
    return map;
  }, [charMappingResult]);

  // Step 6
  const fimoAnalysis = useMemo(() => {
    const hits = parseFimoTsv(fimoText);
    return analyzeFimoMotifs(hits, {
      pValueCutoff: Math.pow(10, fimoPExp),
      minVariance,
      minBinaryCoverage: minCovPct / 100,
      maxBinaryCoverage: maxCovPct / 100,
      treeRoot,
    });
  }, [fimoText, fimoPExp, minVariance, minCovPct, maxCovPct, treeRoot]);

  const activeMotifName = useMemo(() => {
    if (fimoAnalysis.presentByMotif.has(selectedMotifForStats)) {
      return selectedMotifForStats;
    }
    return fimoAnalysis.motifs[0]?.motif ?? "";
  }, [fimoAnalysis, selectedMotifForStats]);

  const heatmapMotifs = useMemo(() => {
    if (heatmapFilter === "heatmap") return fimoAnalysis.motifs.filter((m) => m.inHeatmap);
    if (heatmapFilter === "binary") return fimoAnalysis.motifs.filter((m) => m.inBinary);
    return fimoAnalysis.motifs;
  }, [fimoAnalysis, heatmapFilter]);

  const motifTaxAnalysis = useMemo(() => {
    if (!activeMotifName || taxonomyRecords.length === 0) return null;
    const present =
      fimoAnalysis.presentByMotif.get(activeMotifName) ?? new Set<string>();
    return analyzeMotifByTaxonomy(activeMotifName, present, taxonomyRecords, taxRank);
  }, [activeMotifName, fimoAnalysis, taxonomyRecords, taxRank]);

  const inspectedLeafInfo = useMemo(() => {
    if (!selectedLeaf) return null;
    const tax = taxonomyByAcc.get(selectedLeaf);
    const presentMotifs = fimoAnalysis.motifs
      .filter((m) => fimoAnalysis.presentByMotif.get(m.motif)?.has(selectedLeaf))
      .map((m) => ({
        motif: m.motif,
        score: fimoAnalysis.scoreMatrix.get(selectedLeaf)?.get(m.motif) ?? 0,
      }));
    const charMatch = charMappingResult.matches.find(
      (m) => m.treeLeafId === selectedLeaf
    );
    return { acc: selectedLeaf, tax, presentMotifs, charMatch };
  }, [selectedLeaf, taxonomyByAcc, fimoAnalysis, charMappingResult]);

  // --- Bundle all active outputs for bottom export bar & ZIP ---
  const activeArtifacts = useMemo<ZipEntry[]>(() => {
    const out: ZipEntry[] = [];
    if (filteredFastaText) {
      out.push({ name: "02_filtered_sequences.fasta", content: filteredFastaText });
    }
    if (hmmCutResult.croppedRecords.length > 0) {
      out.push({
        name: "03_cropped_domains.fasta",
        content: serializeFasta(hmmCutResult.croppedRecords),
      });
    }
    if (repsFastaText && adjacencySummary.totalClusters > 0) {
      out.push({ name: "04_clustered_reps.fasta", content: repsFastaText });
    }
    if (adjacencyText.trim()) {
      out.push({
        name: "04_adjacency_list.tabular",
        content: adjacencyText.trim() + "\n",
      });
    }
    if (alignedFastaText.trim()) {
      out.push({
        name: "05_msa_aligned.fasta",
        content: alignedFastaText.trim() + "\n",
      });
    }
    if (trimmedFastaText) {
      out.push({ name: "06_trimmed_alignment.fasta", content: trimmedFastaText });
    }
    if (newickText.trim()) {
      out.push({ name: "07_phylogeny.nwk", content: newickText.trim() + "\n" });
    }
    if (fimoText.trim() && fimoAnalysis.motifs.length > 0) {
      out.push({ name: "10_fimo_hits.tsv", content: fimoText.trim() + "\n" });
      out.push({
        name: "10_motif_stats.tsv",
        content: generateMotifStatsTsv(fimoAnalysis),
      });
      out.push({
        name: "11_itol_meme_heatmap.txt",
        content: generateItolHeatmap(fimoAnalysis, { onlyPassingVariance: false }),
      });
      out.push({
        name: "11_itol_meme_binary.txt",
        content: generateItolBinary(fimoAnalysis, { onlyInformative: false }),
      });
    }
    if (taxonomyRecords.length > 0) {
      out.push({ name: "11_taxonomy.tsv", content: taxonomyText.trim() + "\n" });
      out.push({
        name: `11_itol_taxonomy_${taxRank}.txt`,
        content: generateItolTaxonomyColorstrip(taxonomyRecords, taxRank),
      });
      out.push({
        name: "11_itol_taxonomy_labels.txt",
        content: generateItolTaxonomyLabels(taxonomyRecords),
      });
    }
    if (charMappingResult.matches.length > 0) {
      out.push({
        name: "11_itol_char_tree_colors.txt",
        content: generateCharacterizedTreeColors(charMappingResult),
      });
      out.push({
        name: "11_itol_char_symbols.txt",
        content: generateCharacterizedSymbols(charMappingResult),
      });
      out.push({
        name: "11_characterized_mapping.tsv",
        content: generateCharacterizedMappingTsv(charMappingResult),
      });
    }
    if (lastReportMarkdown) {
      out.push({ name: "12_pipeline_report.md", content: lastReportMarkdown });
    }
    return out;
  }, [
    filteredFastaText,
    hmmCutResult.croppedRecords,
    repsFastaText,
    adjacencySummary.totalClusters,
    adjacencyText,
    alignedFastaText,
    trimmedFastaText,
    newickText,
    fimoText,
    fimoAnalysis,
    taxonomyRecords,
    taxonomyText,
    taxRank,
    charMappingResult,
    lastReportMarkdown,
  ]);

  // --- Handlers ---
  const routeSingleFile = (kind: DetectedFileKind, content: string, filename: string) => {
    setLoadedFilenames((prev) => ({ ...prev, [kind]: filename }));
    if (kind === "raw_fasta") setRawFastaText(content);
    else if (kind === "hmm_domtblout") setHmmReportText(content);
    else if (kind === "adjacency_tsv") {
      setClusteredRepsText("");
      setAdjacencyText(content);
    } else if (kind === "aligned_fasta") setAlignedFastaText(content);
    else if (kind === "newick") {
      setNewickText(content);
      setTreeOrigin("uploaded");
    } else if (kind === "fimo_tsv") {
      setFimoText(content);
      setFimoOrigin("uploaded");
    } else if (kind === "taxonomy_tsv") {
      setTaxonomyText(content);
      setTaxOrigin("uploaded");
    } else if (kind === "characterized_fasta") setCharFastaText(content);
    else if (kind === "db_domains_fasta") setDbDomainsText(content);
  };

  const ingestMultiFiles = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    let recognized = 0;
    for (const f of arr) {
      const text = await f.text();
      const routed = classifyUploadedFile(f.name, text);
      if (routed.kind !== "unknown") {
        routeSingleFile(routed.kind, routed.content, routed.filename);
        recognized++;
      }
    }
    setStatusMessage(`Načteno ${recognized} z ${arr.length} souborů.`);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      void ingestMultiFiles(e.dataTransfer.files);
    }
  };

  const handleMultiInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      void ingestMultiFiles(e.target.files);
      e.target.value = "";
    }
  };

  const clearSlot = (kind: DetectedFileKind) => {
    setLoadedFilenames((prev) => {
      const next = { ...prev };
      delete next[kind];
      return next;
    });
    if (kind === "raw_fasta") setRawFastaText("");
    else if (kind === "hmm_domtblout") setHmmReportText("");
    else if (kind === "adjacency_tsv") {
      setAdjacencyText("");
      setClusteredRepsText("");
    } else if (kind === "aligned_fasta") setAlignedFastaText("");
    else if (kind === "newick") setNewickText("");
    else if (kind === "fimo_tsv") setFimoText("");
    else if (kind === "taxonomy_tsv") setTaxonomyText("");
    else if (kind === "characterized_fasta") setCharFastaText("");
    else if (kind === "db_domains_fasta") setDbDomainsText("");
  };

  const loadGh48Demo = () => {
    setRawFastaText(GH48_DEMO_RAW_FASTA);
    setHmmReportText(GH48_DEMO_HMM_REPORT);
    setAdjacencyText(GH48_DEMO_ADJACENCY);
    setClusteredRepsText("");
    setAlignedFastaText("");
    setNewickText(GH48_DEMO_NEWICK);
    setTaxonomyText(GH48_DEMO_TAXONOMY);
    setCharFastaText(GH48_DEMO_CHAR_FASTA);
    setDbDomainsText(GH48_DEMO_DB_DOMAINS_FASTA);
    setFimoText(GH48_DEMO_FIMO);
    setTreeOrigin("uploaded");
    setFimoOrigin("uploaded");
    setTaxOrigin("uploaded");
    setSelectedMotifForStats("MEME-23");
    setSelectedLeaf("BAE94320.1");
    setLastReportMarkdown(null);
    setLoadedFilenames({
      raw_fasta: "01_ncbi_raw.fasta",
      hmm_domtblout: "03_hmmsearch_report.txt",
      adjacency_tsv: "04_adjacency_list.tabular",
      newick: "07_iqtree_phylogeny.nhx",
      taxonomy_tsv: "11_taxonomy.tsv",
      characterized_fasta: "11_characterized.fasta",
      db_domains_fasta: "03_gh48_domains.fasta",
      fimo_tsv: "10_fimo_out.tsv",
    });
    setStatusMessage("Načten vzorový dataset GH48.");
  };

  const clearAll = () => {
    setRawFastaText("");
    setHmmReportText("");
    setAdjacencyText("");
    setClusteredRepsText("");
    setAlignedFastaText("");
    setNewickText("");
    setTaxonomyText("");
    setCharFastaText("");
    setDbDomainsText("");
    setFimoText("");
    setSelectedLeaf(null);
    setLastReportMarkdown(null);
    setProgressPct(0);
    setProgressLabel("");
    setLoadedFilenames({});
    setStatusMessage("Vstupy vymazány.");
  };

  // --- Step-by-step local compute actions ---
  const runLocalClustering = () => {
    if (step2DomainRecords.length === 0) return;
    const cl = clusterSequencesGreedy(step2DomainRecords, {
      minSeqId: clusterSeqIdPct / 100,
      minCoverage: clusterCovPct / 100,
    });
    const repsText = serializeFasta(cl.representatives);
    setClusteredRepsText(repsText);
    setAdjacencyText(cl.adjacencyTsv);
    if (!dbDomainsText.trim()) setDbDomainsText(croppedDomainsFastaText);
    setLoadedFilenames((prev) => ({
      ...prev,
      adjacency_tsv: "lokální shlukování",
    }));
    setStatusMessage(
      `Shlukováno ${cl.inputCount} → ${cl.clusterCount} reprezentantů (${cl.compressionRatio}×).`
    );
  };

  const runLocalMsa = () => {
    if (repRecords.length < 2) return;
    const toAlign = repRecords.slice(0, 80);
    const msa = buildCenterStarMsa(toAlign);
    const msaText = serializeFasta(msa.aligned);
    setAlignedFastaText(msaText);
    setLoadedFilenames((prev) => ({ ...prev, aligned_fasta: "lokální BLOSUM62 MSA" }));
    setStatusMessage(
      `Zarovnáno ${msa.aligned.length} sekvencí × ${msa.columns} sloupců.`
    );
  };

  const runLocalNjTree = () => {
    let source = trimResult.trimmed;
    if (source.length < 3) {
      if (alignedRecords.length >= 3) {
        source = alignedRecords;
      } else if (repRecords.length >= 3) {
        const msa = buildCenterStarMsa(repRecords.slice(0, 80));
        setAlignedFastaText(serializeFasta(msa.aligned));
        source = trimAlignment(msa.aligned, {
          maxGapFraction: trimalMaxGapPct / 100,
        }).trimmed;
      } else {
        return;
      }
    }
    const nj = buildNeighborJoiningTree(source, { bootstrapReplicates: 40 });
    setNewickText(nj.newick);
    setTreeOrigin("computed");
    setLoadedFilenames((prev) => ({ ...prev, newick: "lokální NJ + bootstrap" }));
    if (!taxonomyText.trim() && repRecords.length > 0) {
      setTaxonomyText(synthesizeTaxonomyFromFasta(repRecords));
      setTaxOrigin("computed");
      setTaxRank("genus");
      setLoadedFilenames((prev) => ({
        ...prev,
        taxonomy_tsv: "odvozeno z FASTA",
      }));
    }
    const parsed = parseNewick(nj.newick);
    if (parsed) {
      const first = getLeaves(parsed)[0]?.name ?? null;
      setSelectedLeaf(first);
    }
    setStatusMessage(
      `Rekonstruován NJ strom (${nj.taxonCount} listů, ${nj.bootstrapReplicates}× bootstrap).`
    );
  };

  const runLocalMotifs = () => {
    let sourceAligned = alignedRecords;
    if (sourceAligned.length < 2) {
      if (repRecords.length < 2) return;
      const msa = buildCenterStarMsa(repRecords.slice(0, 80));
      setAlignedFastaText(serializeFasta(msa.aligned));
      sourceAligned = msa.aligned;
    }
    const disc = discoverAndScanMotifs(sourceAligned, {
      numMotifs: 10,
      motifWidth: 15,
      pValueThreshold: Math.pow(10, fimoPExp),
    });
    setFimoText(disc.fimoTsv);
    setFimoOrigin("computed");
    setLoadedFilenames((prev) => ({ ...prev, fimo_tsv: "lokální PWM sken" }));
    setStatusMessage(
      `Detekováno ${disc.motifsFound} motivů (${disc.hitsReported} FIMO hitů).`
    );
  };

  const runEntirePipeline = async () => {
    setIsRunning(true);
    setProgressPct(5);
    setProgressLabel("Spouštím pipeline…");
    try {
      const out: FullPipelineOutput = await runFullPipeline(
        {
          rawFasta: rawFastaText,
          hmmReport: hmmReportText,
          adjacencyTsv: adjacencyText,
          alignedFasta: alignedFastaText,
          newick: newickText,
          fimoTsv: fimoText,
          taxonomyTsv: taxonomyText,
          characterizedFasta: charFastaText,
          dbDomainsFasta: dbDomainsText,
        },
        {
          excludeTerms: excludeTermsText.split(","),
          minLength: minLen,
          maxLength: maxLen,
          hmmCoordMode: coordMode,
          hmmPadding: padding,
          clusterMinSeqId: clusterSeqIdPct / 100,
          clusterMinCoverage: clusterCovPct / 100,
          trimalMaxGap: trimalMaxGapPct / 100,
          njBootstrapReplicates: 40,
          discoverMotifCount: 10,
          fimoPValue: Math.pow(10, fimoPExp),
          taxRank,
        },
        (p) => {
          setProgressPct(p.percent);
          setProgressLabel(p.stageLabel);
        }
      );

      const r = out.resolvedTexts;
      if (r.adjacencyTsv && !adjacencyText.trim()) setAdjacencyText(r.adjacencyTsv);
      if (r.repsFasta) setClusteredRepsText(r.repsFasta);
      if (r.alignedFasta && !alignedFastaText.trim()) {
        setAlignedFastaText(r.alignedFasta);
      }
      if (r.newick && !newickText.trim()) {
        setNewickText(r.newick);
        setTreeOrigin("computed");
        const parsed = parseNewick(r.newick);
        if (parsed) setSelectedLeaf(getLeaves(parsed)[0]?.name ?? null);
      }
      if (r.fimoTsv && !fimoText.trim()) {
        setFimoText(r.fimoTsv);
        setFimoOrigin("computed");
      }
      if (r.taxonomyTsv && !taxonomyText.trim()) {
        setTaxonomyText(r.taxonomyTsv);
        setTaxOrigin("computed");
        setTaxRank("genus");
      }
      setLastReportMarkdown(out.reportMarkdown);
      setStatusMessage(
        `Pipeline dokončena za ${out.durationMs} ms (${out.artifacts.length} výstupů).`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const exportTreeSvg = () => {
    const svgEl = document.getElementById("gh48-phylo-svg");
    if (!svgEl) return;
    const source = new XMLSerializer().serializeToString(svgEl);
    downloadTextFile("phylogeny_tree.svg", source, "image/svg+xml;charset=utf-8");
  };

  // --- Sortable table columns ---
  const fastaColumns: TableColumn<FastaRecord>[] = useMemo(
    () => [
      {
        key: "id",
        label: "Accession",
        sortable: true,
        sortValue: (r) => r.id,
        render: (r) => r.id,
      },
      {
        key: "length",
        label: "Délka (aa)",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.length,
        render: (r) => r.length,
      },
      {
        key: "organism",
        label: "Organismus",
        sortable: true,
        sortValue: (r) => r.organism,
        render: (r) => <span className="italic text-slate-300">{r.organism}</span>,
      },
      {
        key: "desc",
        label: "Popis",
        render: (r) => (
          <span className="text-slate-400 truncate max-w-[340px] inline-block align-bottom">
            {r.description || "—"}
          </span>
        ),
      },
    ],
    []
  );

  const hmmColumns: TableColumn<HmmCutRow>[] = useMemo(
    () => [
      {
        key: "id",
        label: "Sekvence",
        sortable: true,
        sortValue: (r) => r.id,
        render: (r) => r.id,
      },
      {
        key: "query",
        label: "HMM profil",
        sortable: true,
        sortValue: (r) => r.queryName,
        render: (r) => <span className="font-mono text-amber-200">{r.queryName}</span>,
      },
      {
        key: "range",
        label: "Souřadnice",
        render: (r) => (
          <span className="font-mono text-slate-300">
            {r.start}..{r.end}
          </span>
        ),
      },
      {
        key: "cropLen",
        label: "Ořez (aa)",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.croppedLength,
        render: (r) => (
          <span>
            <strong className="text-white">{r.croppedLength}</strong>
            <span className="text-slate-500"> / {r.originalLength}</span>
          </span>
        ),
      },
      {
        key: "cov",
        label: "Pokrytí HMM",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.hmmCoveragePct,
        render: (r) => (
          <div className="inline-flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-brand-orange rounded-full"
                style={{ width: `${Math.min(100, r.hmmCoveragePct)}%` }}
              />
            </div>
            <span>{r.hmmCoveragePct.toFixed(1)} %</span>
          </div>
        ),
      },
      {
        key: "score",
        label: "Skóre",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.domainScore,
        render: (r) => r.domainScore.toFixed(1),
      },
      {
        key: "evalue",
        label: "i-Evalue",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.iEvalue,
        render: (r) => (
          <span className="font-mono text-slate-300">
            {r.iEvalue === 0 ? "0" : r.iEvalue.toExponential(1)}
          </span>
        ),
      },
    ],
    []
  );

  const charColumns: TableColumn<CharacterizedMatch>[] = useMemo(
    () => [
      {
        key: "charId",
        label: "Charakterizovaný záznam",
        sortable: true,
        sortValue: (r) => r.charId,
        render: (r) => r.charId,
      },
      {
        key: "status",
        label: "Mapování",
        sortable: true,
        sortValue: (r) => r.status,
        render: (r) => {
          const styles =
            r.status === "direct"
              ? "bg-red-500/15 text-red-300 border-red-500/35"
              : r.status === "proxy"
              ? "bg-brand-orange/15 text-amber-200 border-brand-orange/35"
              : "bg-white/5 text-slate-400 border-white/10";
          const label =
            r.status === "direct"
              ? "Přímý list"
              : r.status === "proxy"
              ? "MMseqs2 proxy"
              : "Nenalezeno";
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        key: "leaf",
        label: "List ve stromu",
        sortable: true,
        sortValue: (r) => r.treeLeafId ?? "",
        render: (r) => <span className="font-mono text-white">{r.treeLeafId ?? "—"}</span>,
      },
      {
        key: "method",
        label: "Metoda / Shoda",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.similarityPct,
        render: (r) =>
          r.matchMethod === "none" ? (
            <span className="text-slate-500">—</span>
          ) : (
            <span className="font-mono text-slate-300">
              {r.matchMethod} ({r.similarityPct.toFixed(0)} %)
            </span>
          ),
      },
      {
        key: "cluster",
        label: "Klastr",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.clusterSize,
        render: (r) => (r.clusterSize > 0 ? r.clusterSize : "—"),
      },
      {
        key: "organism",
        label: "Organismus",
        sortable: true,
        sortValue: (r) => r.organism,
        render: (r) => <span className="italic text-slate-300">{r.organism}</span>,
      },
    ],
    []
  );

  const motifColumns: TableColumn<MotifStatsRow>[] = useMemo(
    () => [
      {
        key: "motif",
        label: "Motiv",
        sortable: true,
        sortValue: (r) => r.motif,
        render: (r) => r.motif,
      },
      {
        key: "category",
        label: "Typ",
        sortable: true,
        sortValue: (r) => r.category,
        render: (r) => {
          const map: Record<MotifStatsRow["category"], [string, string]> = {
            core: ["Jádro", "bg-amber-500/15 text-amber-200 border-amber-500/30"],
            "clade-specific": [
              "Kladový",
              "bg-brand-orange/20 text-orange-200 border-brand-orange/45",
            ],
            variable: ["Variabilní", "bg-white/5 text-slate-300 border-white/15"],
            rare: ["Vzácný", "bg-white/5 text-slate-400 border-white/10"],
          };
          const [lbl, cls] = map[r.category];
          return (
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${cls}`}
            >
              {lbl}
            </span>
          );
        },
      },
      {
        key: "ri",
        label: "Fitch RI",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.retentionIndex ?? -1,
        render: (r) =>
          r.retentionIndex === null ? (
            <span className="text-slate-500">—</span>
          ) : (
            <span
              className={`font-mono font-bold ${
                r.retentionIndex >= 0.75
                  ? "text-brand-orange"
                  : r.retentionIndex >= 0.4
                  ? "text-amber-200"
                  : "text-slate-400"
              }`}
            >
              {r.retentionIndex.toFixed(4)}
            </span>
          ),
      },
      {
        key: "cov",
        label: "Pokrytí",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.coverage,
        render: (r) => (
          <span>
            {(r.coverage * 100).toFixed(1)} %{" "}
            <span className="text-slate-500">
              ({r.coverageCount}/{r.totalSequences})
            </span>
          </span>
        ),
      },
      {
        key: "variance",
        label: "Rozptyl",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.variance,
        render: (r) => r.variance.toFixed(1),
      },
      {
        key: "mean",
        label: "Ø -log₁₀(p)",
        type: "number",
        align: "right",
        sortable: true,
        sortValue: (r) => r.meanNegLogP,
        render: (r) => r.meanNegLogP.toFixed(1),
      },
      {
        key: "consensus",
        label: "Konsenzus",
        render: (r) => (
          <span className="font-mono text-[11px] text-slate-400">
            {r.consensus.length > 26 ? `${r.consensus.slice(0, 26)}…` : r.consensus}
          </span>
        ),
      },
    ],
    []
  );

  const stageHeaderClass =
    "rounded-2xl border border-white/10 bg-[#140b07] p-4 sm:p-5 space-y-4";

  return (
    <div className="bio-pipeline-root min-h-screen bg-brand-espresso text-slate-100 flex flex-col">
      {/* Top sticky header */}
      <header className="page-header-dark">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
            >
              <ArrowLeft size={14} />
              Rozcestník
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <Dna size={18} className="text-brand-orange shrink-0" />
              <h1 className="font-display text-base sm:text-lg font-black tracking-tight text-white truncate">
                GH48 Pipeline
              </h1>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                Klientský výpočet
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadGh48Demo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} className="text-brand-orange" />
              GH48 vzor
            </button>
            <button
              type="button"
              disabled={isRunning || (!rawFastaText.trim() && !alignedFastaText.trim() && !newickText.trim())}
              onClick={() => void runEntirePipeline()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Play size={13} />
              {isRunning ? "Počítám…" : "Spustit vše lokálně"}
            </button>
            <button
              type="button"
              disabled={activeArtifacts.length === 0}
              onClick={() =>
                downloadBlob("gh48_pipeline_outputs.zip", buildZipBlob(activeArtifacts))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 border border-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Archive size={13} className="text-brand-orange" />
              Stáhnout .zip ({activeArtifacts.length})
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Vymazat
            </button>
            <a
              href="https://github.com/kolardavidcz/GH48"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              GitHub
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      <div role="status" className="bio-sr-status">
        {statusMessage}
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-2">
        {/* Compact Multi-File Smart Drop Bar */}
        <section
          aria-label="Hromadné nahrání vstupních souborů"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-4 transition-colors mb-4 ${
            isDragging
              ? "border-brand-orange bg-brand-orange/15"
              : "border-white/15 bg-[#140b07]"
          }`}
        >
          <input
            ref={multiUploadRef}
            type="file"
            multiple
            accept=".fasta,.fa,.faa,.txt,.tsv,.tab,.tabular,.nwk,.nhx,.treefile,.tre,.out"
            onChange={handleMultiInput}
            className="hidden"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <UploadCloud size={22} className="text-brand-orange shrink-0" />
              <div className="text-xs text-slate-300">
                Přetáhněte libovolné soubory (<span className="font-mono">.fasta</span>,{" "}
                <span className="font-mono">--domtblout</span>,{" "}
                <span className="font-mono">MAFFT</span>,{" "}
                <span className="font-mono">.treefile</span>,{" "}
                <span className="font-mono">fimo.tsv</span>,{" "}
                <span className="font-mono">taxonomy.tsv</span>) — formát se určí podle obsahu.
              </div>
            </div>
            <button
              type="button"
              onClick={() => multiUploadRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
            >
              <Upload size={13} className="text-brand-orange" />
              Vybrat soubory
            </button>
          </div>

          {Object.keys(loadedFilenames).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
              {(Object.entries(loadedFilenames) as [DetectedFileKind, string][]).map(
                ([kind, fname]) => (
                  <span
                    key={kind}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300"
                  >
                    <span className="text-brand-orange">{fname}</span>
                    <button
                      type="button"
                      onClick={() => clearSlot(kind)}
                      aria-label={`Odebrat ${fname}`}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )
              )}
            </div>
          )}

          {(isRunning || progressPct > 0) && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={progressId} className="text-slate-200 font-semibold">
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

        {/* ================= KROK 1 · FILTRACE FASTA ================= */}
        <section aria-labelledby="step-1-heading" className={stageHeaderClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-mono text-xs font-black flex items-center justify-center">
                1
              </span>
              <h2 id="step-1-heading" className="font-display text-base font-black text-white">
                Filtrace vstupních FASTA sekvencí
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
                {parsedRawFasta.length > 0
                  ? `${parsedRawFasta.length} → ${fastaFilterResult.kept.length}`
                  : "čeká na .fasta"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileUploadButton
                label="Nahrát .fasta"
                accept=".fasta,.fa,.faa,.txt"
                onLoad={(txt, name) => routeSingleFile("raw_fasta", txt, name)}
              />
              {fastaFilterResult.kept.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFile("02_filtered_sequences.fasta", filteredFastaText)
                  }
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  02_filtered.fasta
                </button>
              )}
            </div>
          </div>

          {/* Inline parameters */}
          <div className="flex flex-wrap items-end gap-3 text-xs bg-black/25 rounded-xl p-3 border border-white/5">
            <label className="flex-1 min-w-[210px] space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Vyloučit hlavičky obsahující (oddělené čárkou)
              </span>
              <input
                type="text"
                value={excludeTermsText}
                onChange={(e) => setExcludeTermsText(e.target.value)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs text-white"
              />
            </label>
            <label className="w-24 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Min (aa)
              </span>
              <input
                type="number"
                min={0}
                value={minLen}
                onChange={(e) => setMinLen(Number(e.target.value) || 0)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="w-24 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Max (aa)
              </span>
              <input
                type="number"
                min={1}
                value={maxLen}
                onChange={(e) => setMaxLen(Number(e.target.value) || 10000)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="inline-flex items-center gap-1.5 pb-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={dedupId}
                onChange={(e) => setDedupId(e.target.checked)}
              />
              Duplicitní ID
            </label>
            <label className="inline-flex items-center gap-1.5 pb-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={dedupSeq}
                onChange={(e) => setDedupSeq(e.target.checked)}
              />
              Identické sekvence
            </label>
          </div>

          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer hover:text-slate-200 select-none">
              Vložit nebo upravit surovou FASTA ({parsedRawFasta.length} záznamů)
            </summary>
            <textarea
              value={rawFastaText}
              onChange={(e) => setRawFastaText(e.target.value)}
              rows={5}
              spellCheck={false}
              placeholder=">AAA91086.1 cellulase [Caldicellulosiruptor saccharolyticus]&#10;MKTAYIAK..."
              className="mt-2 w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200"
            />
          </details>

          {parsedRawFasta.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <MetricCell label="Vstup" value={fastaFilterResult.total} />
                <MetricCell
                  label="Ponecháno"
                  value={fastaFilterResult.kept.length}
                  accent
                />
                <MetricCell label="Vyřazeno" value={fastaFilterResult.removed.length} />
                <MetricCell
                  label="Medián délky"
                  value={`${fastaFilterResult.lengthStats.median} aa`}
                  hint={`${fastaFilterResult.lengthStats.min}–${fastaFilterResult.lengthStats.max} aa`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                    Distribuce délek (aa)
                  </div>
                  {(() => {
                    const maxBin = Math.max(
                      1,
                      ...fastaFilterResult.histogram.map((b) => b.kept + b.removed)
                    );
                    return fastaFilterResult.histogram.map((b) => (
                      <div
                        key={b.label}
                        className="grid grid-cols-[84px_1fr_32px] items-center gap-2 text-[11px]"
                      >
                        <span className="font-mono text-slate-400 text-right">
                          {b.label}
                        </span>
                        <div className="h-2.5 rounded bg-white/5 overflow-hidden flex">
                          <div
                            className="h-full bg-brand-orange"
                            style={{ width: `${(b.kept / maxBin) * 100}%` }}
                            title={`Ponecháno: ${b.kept}`}
                          />
                          <div
                            className="h-full bg-rose-500/60"
                            style={{ width: `${(b.removed / maxBin) * 100}%` }}
                            title={`Vyřazeno: ${b.removed}`}
                          />
                        </div>
                        <span className="font-mono text-slate-300 text-right">
                          {b.kept + b.removed}
                        </span>
                      </div>
                    ));
                  })()}
                </div>

                <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                  <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                    Důvody vyřazení
                  </div>
                  {Object.keys(fastaFilterResult.removedByReason).length === 0 ? (
                    <div className="text-xs text-slate-400">Bez vyřazených záznamů.</div>
                  ) : (
                    <ul className="space-y-1 text-xs">
                      {Object.entries(fastaFilterResult.removedByReason).map(
                        ([reason, count]) => (
                          <li
                            key={reason}
                            className="flex items-center justify-between border-b border-white/5 pb-1 last:border-none"
                          >
                            <span className="text-slate-300">{reason}</span>
                            <span className="font-mono font-bold text-rose-300">
                              −{count}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <details className="text-xs">
                <summary className="cursor-pointer font-semibold text-slate-300 hover:text-white select-none">
                  Tabulka ponechaných sekvencí ({fastaFilterResult.kept.length})
                </summary>
                <div className="mt-2">
                  <SortableDataTable
                    caption="Ponechané FASTA sekvence"
                    rows={fastaFilterResult.kept}
                    rowKey={(r) => r.id}
                    columns={fastaColumns}
                    defaultSortKey="length"
                    defaultSortDir="descending"
                  />
                </div>
              </details>
            </div>
          )}
        </section>

        <StepConnector
          nextInputLabel="Další vstup pro krok 2: výstup hmmsearch --domtblout nad 02_filtered.fasta (volitelné — bez něj se použijí plné sekvence)."
          upstreamFile={
            filteredFastaText
              ? { filename: "02_filtered_sequences.fasta", content: filteredFastaText }
              : null
          }
          externalTools={[
            {
              label: "EBI HMMER",
              url: "https://www.ebi.ac.uk/Tools/hmmer/search/hmmsearch",
            },
            {
              label: "NCBI Protein",
              url: "https://www.ncbi.nlm.nih.gov/protein/",
            },
          ]}
        />

        {/* ================= KROK 2 · HMMER OŘEZ DOMÉN ================= */}
        <section aria-labelledby="step-2-heading" className={stageHeaderClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-mono text-xs font-black flex items-center justify-center">
                2
              </span>
              <h2 id="step-2-heading" className="font-display text-base font-black text-white">
                Ořez domén podle HMMER (`--domtblout`)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
                {hmmCutResult.croppedRecords.length > 0
                  ? `${hmmCutResult.croppedRecords.length} domén`
                  : `${hmmBaseRecords.length} plných sekvencí`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileUploadButton
                label="Nahrát --domtblout"
                accept=".txt,.tsv,.out,.tbl"
                onLoad={(txt, name) => routeSingleFile("hmm_domtblout", txt, name)}
              />
              {step2DomainRecords.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFile(
                      hmmCutResult.croppedRecords.length > 0
                        ? "03_cropped_domains.fasta"
                        : "03_sequences.fasta",
                      croppedDomainsFastaText
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  03_domains.fasta
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 text-xs bg-black/25 rounded-xl p-3 border border-white/5">
            <label className="space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Souřadnice
              </span>
              <select
                value={coordMode}
                onChange={(e) => setCoordMode(e.target.value as "env" | "ali")}
                className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-white"
              >
                <option value="env">Envelope (env)</option>
                <option value="ali">Alignment (ali)</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Více domén
              </span>
              <select
                value={dedupMode}
                onChange={(e) =>
                  setDedupMode(e.target.value as "longest" | "best-evalue" | "all")
                }
                className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-white"
              >
                <option value="longest">Nejdelší</option>
                <option value="best-evalue">Nejnižší i-Evalue</option>
                <option value="all">Všechny (_domN)</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Padding (±{padding} aa)
              </span>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-28"
              />
            </label>
            <label className="w-24 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                i-Evalue (10^{maxIEvalueExp})
              </span>
              <input
                type="number"
                min={-100}
                max={0}
                value={maxIEvalueExp}
                onChange={(e) => setMaxIEvalueExp(Number(e.target.value))}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="w-24 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Min (aa)
              </span>
              <input
                type="number"
                min={1}
                value={minDomainLen}
                onChange={(e) => setMinDomainLen(Number(e.target.value) || 1)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
          </div>

          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer hover:text-slate-200 select-none">
              Vložit nebo upravit `--domtblout` ({hmmCutResult.totalHitsParsed} hitů)
            </summary>
            <textarea
              value={hmmReportText}
              onChange={(e) => setHmmReportText(e.target.value)}
              rows={5}
              spellCheck={false}
              className="mt-2 w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200"
            />
          </details>

          {hmmCutResult.rows.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <MetricCell label="HMM hity" value={hmmCutResult.totalHitsParsed} />
                <MetricCell
                  label="Vyříznuté domény"
                  value={hmmCutResult.croppedRecords.length}
                  accent
                />
                <MetricCell
                  label="Chybí ve FASTA"
                  value={hmmCutResult.missingInFasta.length}
                />
                <MetricCell
                  label="Bez HMM hitu"
                  value={hmmCutResult.unmatchedFastaIds.length}
                />
              </div>

              <SortableDataTable
                caption="Vyříznuté domény z HMMER domtblout"
                rows={hmmCutResult.rows}
                rowKey={(r) => `${r.id}-${r.start}-${r.end}`}
                columns={hmmColumns}
                defaultSortKey="score"
                defaultSortDir="descending"
              />
            </div>
          )}
        </section>

        <StepConnector
          nextInputLabel="Další vstup pro krok 3: MMseqs2 adjacency_list.tabular nad 03_domains.fasta, nebo lokální greedy shlukování."
          upstreamFile={
            croppedDomainsFastaText
              ? { filename: "03_cropped_domains.fasta", content: croppedDomainsFastaText }
              : null
          }
          externalTools={[{ label: "UseGalaxy.eu", url: "https://usegalaxy.eu/" }]}
          localAction={{
            label: "Shlukovat lokálně",
            onClick: runLocalClustering,
            disabled: step2DomainRecords.length === 0,
          }}
        />

        {/* ================= KROK 3 · SHLUKOVÁNÍ ================= */}
        <section aria-labelledby="step-3-heading" className={stageHeaderClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-mono text-xs font-black flex items-center justify-center">
                3
              </span>
              <h2 id="step-3-heading" className="font-display text-base font-black text-white">
                Shlukování sekvencí (MMseqs2 / greedy)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
                {adjacencySummary.totalClusters > 0
                  ? `${adjacencySummary.totalClusters} klastrů`
                  : `${step2DomainRecords.length} sekvencí bez shlukování`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileUploadButton
                label="Nahrát adjacency_list"
                accept=".tabular,.tsv,.txt"
                onLoad={(txt, name) => routeSingleFile("adjacency_tsv", txt, name)}
              />
              {adjacencySummary.totalClusters > 0 && (
                <>
                  {repsFastaText && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile("04_clustered_reps.fasta", repsFastaText)
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      04_reps.fasta
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile("04_adjacency_list.tabular", adjacencyText)
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download size={13} className="text-brand-orange" />
                    adjacency.tabular
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 text-xs bg-black/25 rounded-xl p-3 border border-white/5">
            <label className="w-32 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Identita ≥ ({clusterSeqIdPct} %)
              </span>
              <input
                type="number"
                min={40}
                max={100}
                value={clusterSeqIdPct}
                onChange={(e) => setClusterSeqIdPct(Number(e.target.value) || 90)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="w-32 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Pokrytí ≥ ({clusterCovPct} %)
              </span>
              <input
                type="number"
                min={30}
                max={100}
                value={clusterCovPct}
                onChange={(e) => setClusterCovPct(Number(e.target.value) || 80)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <button
              type="button"
              disabled={step2DomainRecords.length === 0}
              onClick={runLocalClustering}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 border border-white/15 text-xs font-bold text-white cursor-pointer"
            >
              <Play size={12} className="text-brand-orange" />
              Přepočítat lokálně
            </button>
          </div>

          {adjacencySummary.totalClusters > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                <MetricCell
                  label="Klastry"
                  value={adjacencySummary.totalClusters}
                  accent
                />
                <MetricCell label="Členové" value={adjacencySummary.totalMembers} />
                <MetricCell
                  label="Komprese"
                  value={`${(
                    adjacencySummary.totalMembers / adjacencySummary.totalClusters
                  ).toFixed(1)}×`}
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                  Největší klastry (reprezentant / počet členů)
                </div>
                {(() => {
                  const maxSz = Math.max(
                    1,
                    ...adjacencySummary.largestClusters.map((c) => c.size)
                  );
                  return adjacencySummary.largestClusters.slice(0, 8).map((c) => (
                    <div
                      key={c.rep}
                      className="grid grid-cols-[120px_1fr_32px] items-center gap-2 text-[11px]"
                    >
                      <span className="font-mono text-slate-200 truncate">{c.rep}</span>
                      <div className="h-2 rounded bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-brand-orange rounded"
                          style={{ width: `${(c.size / maxSz) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-300 text-right">{c.size}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </section>

        <StepConnector
          nextInputLabel="Další vstup pro krok 4: zarovnaná FASTA z MAFFT Web (L-INS-i) nad 04_reps.fasta, nebo lokální BLOSUM62 MSA + trimAl."
          upstreamFile={
            repsFastaText ? { filename: "04_clustered_reps.fasta", content: repsFastaText } : null
          }
          externalTools={[
            {
              label: "MAFFT Web",
              url: "https://www.ebi.ac.uk/jdispatcher/msa/mafft",
            },
            { label: "Galaxy trimAl", url: "https://usegalaxy.eu/" },
          ]}
          localAction={{
            label: "Zarovnat & oříznout lokálně",
            onClick: runLocalMsa,
            disabled: repRecords.length < 2,
          }}
        />

        {/* ================= KROK 4 · MSA A TRIMAL ================= */}
        <section aria-labelledby="step-4-heading" className={stageHeaderClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-mono text-xs font-black flex items-center justify-center">
                4
              </span>
              <h2 id="step-4-heading" className="font-display text-base font-black text-white">
                Mnohonásobné zarovnání (MSA) a ořez mezer (`trimAl`)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
                {alignedRecords.length >= 2
                  ? `${trimResult.originalColumns} → ${trimResult.trimmedColumns} pozic`
                  : "čeká na MSA .fasta"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileUploadButton
                label="Nahrát MSA .fasta"
                accept=".fasta,.fa,.faa,.aln,.txt"
                onLoad={(txt, name) => routeSingleFile("aligned_fasta", txt, name)}
              />
              {trimmedFastaText && (
                <>
                  <button
                    type="button"
                    onClick={() => downloadTextFile("05_msa_aligned.fasta", alignedFastaText)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    <Download size={13} className="text-brand-orange" />
                    05_msa.fasta
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile("06_trimmed_alignment.fasta", trimmedFastaText)
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold cursor-pointer"
                  >
                    <Download size={13} />
                    06_trimmed.fasta
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 text-xs bg-black/25 rounded-xl p-3 border border-white/5">
            <label className="w-40 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Max mezer ve sloupci ({trimalMaxGapPct} %)
              </span>
              <input
                type="number"
                min={10}
                max={95}
                value={trimalMaxGapPct}
                onChange={(e) => setTrimalMaxGapPct(Number(e.target.value) || 50)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <button
              type="button"
              disabled={repRecords.length < 2}
              onClick={runLocalMsa}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 border border-white/15 text-xs font-bold text-white cursor-pointer"
            >
              <Play size={12} className="text-brand-orange" />
              Spočítat BLOSUM62 MSA ({Math.min(80, repRecords.length)} sekv.)
            </button>
          </div>

          {alignedRecords.length >= 2 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <MetricCell label="Sekvence v MSA" value={alignedRecords.length} />
                <MetricCell
                  label="Pozice před → po"
                  value={`${trimResult.originalColumns} → ${trimResult.trimmedColumns}`}
                  accent
                />
                <MetricCell
                  label="Odstraněno sloupců"
                  value={trimResult.removedColumns}
                />
                <MetricCell
                  label="Mezery před → po"
                  value={`${trimResult.meanGapBeforePct} % → ${trimResult.meanGapAfterPct} %`}
                />
              </div>

              <MsaOccupancyChart
                aligned={alignedRecords}
                maxGapFraction={trimalMaxGapPct / 100}
              />
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Zarovnání zatím není načteno (můžete jej nahrát z MAFFT nebo spočítat lokálně výše).
            </div>
          )}
        </section>

        <StepConnector
          nextInputLabel="Další vstup pro krok 5: fylogenetický strom (.treefile / .nhx / .nwk) z IQ-TREE Web nad 06_trimmed.fasta + volitelné taxonomy.tsv a charakterizované sekvence."
          upstreamFile={
            trimmedFastaText
              ? { filename: "06_trimmed_alignment.fasta", content: trimmedFastaText }
              : repsFastaText
              ? { filename: "04_clustered_reps.fasta", content: repsFastaText }
              : null
          }
          externalTools={[
            { label: "IQ-TREE Web", url: "https://iqtree.cibiv.univie.ac.at/" },
            { label: "UniProt", url: "https://www.uniprot.org/" },
          ]}
          localAction={{
            label: "Spočítat NJ strom lokálně",
            onClick: runLocalNjTree,
            disabled: trimResult.trimmed.length < 3 && alignedRecords.length < 3 && repRecords.length < 3,
          }}
        />

        {/* ================= KROK 5 · FYLOGENEZE, TAXONOMIE & CHARAKTERIZOVANÉ ================= */}
        <section aria-labelledby="step-5-heading" className={stageHeaderClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-mono text-xs font-black flex items-center justify-center">
                5
              </span>
              <h2 id="step-5-heading" className="font-display text-base font-black text-white">
                Fylogenetický strom, taxonomie a charakterizované enzymy
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
                {treeLeafSet.size > 0
                  ? `${treeLeafSet.size} listů (${treeOrigin === "uploaded" ? "soubor" : "NJ"})`
                  : "čeká na Newick"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileUploadButton
                label="Newick / .treefile"
                accept=".nwk,.nhx,.treefile,.tre,.txt"
                onLoad={(txt, name) => routeSingleFile("newick", txt, name)}
              />
              <FileUploadButton
                label="taxonomy.tsv"
                accept=".tsv,.txt,.tab"
                onLoad={(txt, name) => routeSingleFile("taxonomy_tsv", txt, name)}
              />
              <FileUploadButton
                label="Charakterizované .fasta"
                accept=".fasta,.fa,.faa,.txt"
                onLoad={(txt, name) => routeSingleFile("characterized_fasta", txt, name)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 text-xs bg-black/25 rounded-xl p-3 border border-white/5">
            <label className="space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Barvení listů
              </span>
              <select
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value as "taxonomy" | "motif")}
                className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-white"
              >
                <option value="taxonomy">Podle taxonomie</option>
                <option value="motif">Podle motivu ({activeMotifName || "—"})</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Úroveň
              </span>
              <select
                value={taxRank}
                onChange={(e) => setTaxRank(e.target.value as TaxRank)}
                className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-white"
              >
                <option value="kingdom">kingdom</option>
                <option value="phylum">phylum</option>
                <option value="class">class</option>
                <option value="order">order</option>
                <option value="family">family</option>
                <option value="genus">genus</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5 pb-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={cladogram}
                onChange={(e) => setCladogram(e.target.checked)}
              />
              Kladogram
            </label>
            <label className="inline-flex items-center gap-1.5 pb-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showBootstrap}
                onChange={(e) => setShowBootstrap(e.target.checked)}
              />
              Podpora ≥ {bootstrapThreshold}
            </label>
            {showBootstrap && (
              <input
                type="range"
                aria-label="Prahová hodnota bootstrapu"
                min={50}
                max={100}
                step={5}
                value={bootstrapThreshold}
                onChange={(e) => setBootstrapThreshold(Number(e.target.value))}
                className="w-24 mb-1.5"
              />
            )}

            {repRecords.length > 0 && taxonomyRecords.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  setTaxonomyText(synthesizeTaxonomyFromFasta(repRecords));
                  setTaxOrigin("computed");
                  setTaxRank("genus");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-bold text-amber-200 cursor-pointer"
              >
                Odvozit taxonomii z FASTA
              </button>
            )}

            <div className="ml-auto flex flex-wrap gap-1.5">
              {newickText.trim() && (
                <>
                  <button
                    type="button"
                    onClick={() => downloadTextFile("07_phylogeny.nwk", newickText)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-200 cursor-pointer"
                  >
                    <Download size={12} className="text-brand-orange" />
                    .nwk
                  </button>
                  <button
                    type="button"
                    onClick={exportTreeSvg}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-200 cursor-pointer"
                  >
                    <Download size={12} className="text-brand-orange" />
                    .svg
                  </button>
                </>
              )}
              {taxonomyRecords.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        `itol_taxonomy_${taxRank}.txt`,
                        generateItolTaxonomyColorstrip(taxonomyRecords, taxRank)
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-[11px] font-bold cursor-pointer"
                  >
                    <Download size={12} />
                    iTOL COLORSTRIP
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        "itol_taxonomy_labels.txt",
                        generateItolTaxonomyLabels(taxonomyRecords)
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-200 cursor-pointer"
                  >
                    <Download size={12} className="text-brand-orange" />
                    iTOL LABELS
                  </button>
                </>
              )}
              <a
                href="https://itol.embl.de/upload.cgi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-amber-200"
              >
                iTOL
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer hover:text-slate-200 select-none">
              Vložit nebo upravit text: Newick, taxonomy.tsv, charakterizované FASTA
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <textarea
                aria-label="Newick strom"
                value={newickText}
                onChange={(e) => {
                  setNewickText(e.target.value);
                  setTreeOrigin("uploaded");
                }}
                rows={4}
                spellCheck={false}
                placeholder="(A:0.1,B:0.2);"
                className="rounded-lg bg-black/40 border border-white/10 p-2 font-mono text-[11px] text-slate-200"
              />
              <textarea
                aria-label="taxonomy.tsv"
                value={taxonomyText}
                onChange={(e) => {
                  setTaxonomyText(e.target.value);
                  setTaxOrigin("uploaded");
                }}
                rows={4}
                spellCheck={false}
                placeholder="accession&#9;taxid&#9;scientific_name..."
                className="rounded-lg bg-black/40 border border-white/10 p-2 font-mono text-[11px] text-slate-200"
              />
              <textarea
                aria-label="Charakterizované enzymy FASTA"
                value={charFastaText}
                onChange={(e) => setCharFastaText(e.target.value)}
                rows={4}
                spellCheck={false}
                placeholder=">sp|A3DH67|..."
                className="rounded-lg bg-black/40 border border-white/10 p-2 font-mono text-[11px] text-slate-200"
              />
            </div>
          </details>

          {treeRoot ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              <div className="xl:col-span-8 space-y-2.5">
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  {colorMode === "taxonomy" ? (
                    [...taxonColorMap.entries()].map(([taxon, color]) => (
                      <span key={taxon} className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-slate-300">{taxon}</span>
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-brand-orange" />
                        <span className="text-slate-200 font-mono">
                          {activeMotifName || "motiv"}+
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                        <span className="text-slate-400 font-mono">
                          {activeMotifName || "motiv"}−
                        </span>
                      </span>
                    </>
                  )}
                </div>

                <PhyloTreeSvg
                  root={treeRoot}
                  cladogram={cladogram}
                  showBootstrap={showBootstrap}
                  bootstrapThreshold={bootstrapThreshold}
                  taxonomyByAcc={taxonomyByAcc}
                  colorMode={colorMode}
                  taxRank={taxRank}
                  taxonColorMap={taxonColorMap}
                  highlightMotif={activeMotifName || null}
                  presentMotifSet={
                    activeMotifName
                      ? fimoAnalysis.presentByMotif.get(activeMotifName) ?? null
                      : null
                  }
                  charStatusByLeaf={charStatusByLeaf}
                  selectedLeaf={selectedLeaf}
                  onSelectLeaf={setSelectedLeaf}
                />
              </div>

              <div className="xl:col-span-4 rounded-xl border border-white/10 bg-black/25 p-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  Vybraný list
                </div>
                {inspectedLeafInfo ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {inspectedLeafInfo.acc}
                      </span>
                      {inspectedLeafInfo.charMatch && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-200 border border-red-500/35">
                          Charakterizovaný ({inspectedLeafInfo.charMatch.status})
                        </span>
                      )}
                    </div>
                    {inspectedLeafInfo.tax ? (
                      <>
                        <div className="italic text-slate-200 font-semibold">
                          {inspectedLeafInfo.tax.scientificName}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-relaxed">
                          {[
                            inspectedLeafInfo.tax.kingdom,
                            inspectedLeafInfo.tax.phylum,
                            inspectedLeafInfo.tax.class,
                            inspectedLeafInfo.tax.order,
                            inspectedLeafInfo.tax.family,
                          ]
                            .filter(Boolean)
                            .join(" › ")}
                        </div>
                        {inspectedLeafInfo.tax.title && (
                          <div className="text-[11px] text-slate-300 bg-black/30 rounded-lg p-2 border border-white/5">
                            {inspectedLeafInfo.tax.title}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-slate-500">
                        Chybí záznam v taxonomy.tsv ({taxOrigin}).
                      </div>
                    )}

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 mb-1">
                        Detekované motivy ({inspectedLeafInfo.presentMotifs.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {inspectedLeafInfo.presentMotifs.map((pm) => (
                          <span
                            key={pm.motif}
                            className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                              pm.motif === activeMotifName
                                ? "bg-brand-orange/25 text-orange-100 border-brand-orange/50 font-bold"
                                : "bg-white/5 text-slate-300 border-white/10"
                            }`}
                          >
                            {pm.motif} ({pm.score.toFixed(0)})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Kliknutím na list stromu zobrazíte taxonomii a motivy.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Strom zatím není načten.
            </div>
          )}

          {charMappingResult.matches.length > 0 && (
            <details className="text-xs pt-2 border-t border-white/5">
              <summary className="cursor-pointer font-semibold text-slate-300 hover:text-white select-none flex flex-wrap items-center justify-between gap-2">
                <span>
                  Charakterizované enzymy ({charMappingResult.directCount} přímých,{" "}
                  {charMappingResult.proxyCount} proxy z {charMappingResult.matches.length})
                </span>
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadTextFile(
                        "itol_char_tree_colors.txt",
                        generateCharacterizedTreeColors(charMappingResult)
                      );
                    }}
                    className="text-brand-orange hover:underline cursor-pointer"
                  >
                    iTOL TREE_COLORS
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadTextFile(
                        "itol_char_symbols.txt",
                        generateCharacterizedSymbols(charMappingResult)
                      );
                    }}
                    className="text-brand-orange hover:underline cursor-pointer"
                  >
                    iTOL SYMBOL
                  </button>
                </span>
              </summary>
              <div className="mt-2">
                <SortableDataTable
                  caption="Mapování charakterizovaných enzymů na listy stromu"
                  rows={charMappingResult.matches}
                  rowKey={(r) => r.charId}
                  columns={charColumns}
                  defaultSortKey="status"
                  defaultSortDir="ascending"
                />
              </div>
            </details>
          )}
        </section>

        <StepConnector
          nextInputLabel="Další vstup pro krok 6: tabulka fimo.tsv z MEME Suite → FIMO nad 04_reps.fasta (anotace proti PROSITE v TOMTOM), nebo lokální objev PWM motivů."
          upstreamFile={
            repsFastaText ? { filename: "04_clustered_reps.fasta", content: repsFastaText } : null
          }
          externalTools={[
            { label: "MEME", url: "https://meme-suite.org/meme/tools/meme" },
            { label: "TOMTOM", url: "https://meme-suite.org/meme/tools/tomtom" },
            { label: "FIMO", url: "https://meme-suite.org/meme/tools/fimo" },
          ]}
          localAction={{
            label: "Objevit PWM motivy lokálně",
            onClick: runLocalMotifs,
            disabled: alignedRecords.length < 2 && repRecords.length < 2,
          }}
        />

        {/* ================= KROK 6 · MOTIVY, FITCH RI & CHI-SQUARE ================= */}
        <section aria-labelledby="step-6-heading" className={stageHeaderClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-mono text-xs font-black flex items-center justify-center">
                6
              </span>
              <h2 id="step-6-heading" className="font-display text-base font-black text-white">
                Motivy (MEME / FIMO), Fitchův RI a χ² test taxonomie
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300">
                {fimoAnalysis.motifs.length > 0
                  ? `${fimoAnalysis.motifs.length} motivů (${fimoOrigin === "uploaded" ? "fimo.tsv" : "PWM"})`
                  : "čeká na fimo.tsv"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FileUploadButton
                label="Nahrát fimo.tsv"
                accept=".tsv,.txt,.tab"
                onLoad={(txt, name) => routeSingleFile("fimo_tsv", txt, name)}
              />
              {fimoAnalysis.motifs.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        "itol_meme_heatmap.txt",
                        generateItolHeatmap(fimoAnalysis, { onlyPassingVariance: true })
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold cursor-pointer"
                  >
                    <Download size={13} />
                    iTOL HEATMAP
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        "itol_meme_binary.txt",
                        generateItolBinary(fimoAnalysis, { onlyInformative: true })
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    <Download size={13} className="text-brand-orange" />
                    iTOL BINARY
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        "motif_stats.tsv",
                        generateMotifStatsTsv(fimoAnalysis),
                        "text/tab-separated-values;charset=utf-8"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    <Download size={13} className="text-brand-orange" />
                    motif_stats.tsv
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 text-xs bg-black/25 rounded-xl p-3 border border-white/5">
            <label className="w-28 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Prahové p (10^{fimoPExp})
              </span>
              <input
                type="number"
                min={-50}
                max={0}
                value={fimoPExp}
                onChange={(e) => setFimoPExp(Number(e.target.value))}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="w-28 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Min. rozptyl
              </span>
              <input
                type="number"
                min={0}
                value={minVariance}
                onChange={(e) => setMinVariance(Number(e.target.value) || 0)}
                className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 font-mono text-white"
              />
            </label>
            <label className="w-24 space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Binární (%)
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  aria-label="Min pokrytí %"
                  min={0}
                  max={100}
                  value={minCovPct}
                  onChange={(e) => setMinCovPct(Number(e.target.value) || 0)}
                  className="w-12 rounded-lg bg-black/50 border border-white/15 px-1.5 py-1.5 font-mono text-white text-center"
                />
                <input
                  type="number"
                  aria-label="Max pokrytí %"
                  min={0}
                  max={100}
                  value={maxCovPct}
                  onChange={(e) => setMaxCovPct(Number(e.target.value) || 100)}
                  className="w-12 rounded-lg bg-black/50 border border-white/15 px-1.5 py-1.5 font-mono text-white text-center"
                />
              </div>
            </label>
            <label className="space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Testovaný motiv (χ² a strom)
              </span>
              <select
                value={activeMotifName}
                onChange={(e) => setSelectedMotifForStats(e.target.value)}
                className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-white font-mono"
              >
                {fimoAnalysis.motifs.map((m) => (
                  <option key={m.motif} value={m.motif}>
                    {m.motif} (RI={m.retentionIndex?.toFixed(2) ?? "—"})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer hover:text-slate-200 select-none">
              Vložit nebo upravit surový `fimo.tsv` ({fimoAnalysis.totalHitsParsed} hitů)
            </summary>
            <textarea
              value={fimoText}
              onChange={(e) => {
                setFimoText(e.target.value);
                setFimoOrigin("uploaded");
              }}
              rows={5}
              spellCheck={false}
              className="mt-2 w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200"
            />
          </details>

          {fimoAnalysis.motifs.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <MetricCell label="Motivy" value={fimoAnalysis.motifs.length} />
                <MetricCell
                  label="Jádrové (≥95 %)"
                  value={
                    fimoAnalysis.motifs.filter((m) => m.category === "core").length
                  }
                />
                <MetricCell
                  label="Kladové (RI ≥ 0.70)"
                  value={
                    fimoAnalysis.motifs.filter((m) => m.category === "clade-specific")
                      .length
                  }
                  accent
                />
                <MetricCell
                  label="Prochází rozptylem"
                  value={fimoAnalysis.motifs.filter((m) => m.inHeatmap).length}
                />
              </div>

              <SortableDataTable
                caption="Statistiky motivů a Fitchův Retention Index"
                rows={fimoAnalysis.motifs}
                rowKey={(r) => r.motif}
                columns={motifColumns}
                defaultSortKey="ri"
                defaultSortDir="descending"
              />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                <div className="xl:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wider text-slate-300">
                      Heatmapa -log₁₀(p) v pořadí listů stromu
                    </span>
                    <div className="flex items-center gap-1">
                      {(
                        [
                          ["all", "Vše"],
                          ["heatmap", `Rozptyl ≥ ${minVariance}`],
                          ["binary", "Kladové"],
                        ] as const
                      ).map(([val, lbl]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHeatmapFilter(val)}
                          className={`px-2 py-0.5 rounded font-semibold border cursor-pointer ${
                            heatmapFilter === val
                              ? "bg-brand-orange/20 text-brand-orange border-brand-orange/45"
                              : "bg-white/5 text-slate-300 border-white/10"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <MotifHeatmapSvg
                    analysis={fimoAnalysis}
                    motifs={heatmapMotifs}
                    taxonomyByAcc={taxonomyByAcc}
                  />
                </div>

                <div className="xl:col-span-4 rounded-xl border border-white/10 bg-black/25 p-4 space-y-3">
                  {motifTaxAnalysis ? (
                    <>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold uppercase text-white">
                          χ²:{" "}
                          <span className="font-mono text-brand-orange">
                            {motifTaxAnalysis.motif}
                          </span>{" "}
                          × {taxRank}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            motifTaxAnalysis.stats.pValue < 0.01
                              ? "bg-brand-orange/20 text-orange-200 border-brand-orange/45"
                              : "bg-white/5 text-slate-400 border-white/10"
                          }`}
                        >
                          p = {formatPValue(motifTaxAnalysis.stats.pValue)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center bg-black/35 rounded-lg p-2 border border-white/5 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400">χ²</div>
                          <div className="font-mono font-bold text-white">
                            {motifTaxAnalysis.stats.chi2.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">df</div>
                          <div className="font-mono font-bold text-white">
                            {motifTaxAnalysis.stats.df}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Cramér V</div>
                          <div className="font-mono font-bold text-brand-orange">
                            {motifTaxAnalysis.stats.cramersV.toFixed(3)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {motifTaxAnalysis.rows.map((r) => (
                          <div key={r.taxon} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-slate-200 truncate">
                                <span
                                  className="w-2 h-2 rounded-sm shrink-0"
                                  style={{ backgroundColor: r.color }}
                                />
                                <span className="truncate">{r.taxon}</span>
                              </span>
                              <span className="font-mono text-[11px] text-slate-300 shrink-0">
                                {r.present}/{r.total} ({r.presentPct.toFixed(0)} %)
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${r.presentPct}%`,
                                  backgroundColor: r.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-400">
                      Pro χ² test nahrajte nebo odvoďte `taxonomy.tsv` v kroku 5.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================= EXPORT & REFERENČNÍ PŘÍKAZY ================= */}
        <section
          aria-labelledby="export-heading"
          className="rounded-2xl border border-white/10 bg-[#140b07] p-4 sm:p-5 space-y-3 mt-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="export-heading" className="font-display text-sm font-black uppercase tracking-wider text-white">
              Výstupy pipeline ({activeArtifacts.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {lastReportMarkdown && (
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFile("12_pipeline_report.md", lastReportMarkdown)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  <Download size={13} className="text-brand-orange" />
                  12_pipeline_report.md
                </button>
              )}
              <button
                type="button"
                disabled={activeArtifacts.length === 0}
                onClick={() =>
                  downloadBlob("gh48_pipeline_outputs.zip", buildZipBlob(activeArtifacts))
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
              >
                <Archive size={13} />
                Stáhnout vše (.zip)
              </button>
            </div>
          </div>

          {activeArtifacts.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeArtifacts.map((art) => (
                <button
                  key={art.name}
                  type="button"
                  onClick={() =>
                    typeof art.content === "string"
                      ? downloadTextFile(art.name, art.content)
                      : downloadBlob(art.name, new Blob([new Uint8Array(art.content)]))
                  }
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/35 hover:border-brand-orange/50 border border-white/10 font-mono text-[11px] text-slate-200 cursor-pointer"
                >
                  <Download size={11} className="text-brand-orange" />
                  {art.name}
                </button>
              ))}
            </div>
          )}

          <details className="pt-2 border-t border-white/5 text-xs">
            <summary className="cursor-pointer font-semibold text-slate-300 hover:text-white select-none">
              Referenční příkazy CLI / Galaxy (kroky 1–11)
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
              {GH48_PIPELINE_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-lg border border-white/10 bg-black/30 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white">
                      {s.step}. {s.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {s.gh48Metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{s.summary}</p>
                  <div className="rounded bg-black/45 px-2 py-1.5 flex items-center justify-between gap-2">
                    <code className="text-[10.5px] font-mono text-amber-100/90 overflow-x-auto whitespace-nowrap">
                      {s.command}
                    </code>
                    <CopyButton text={s.command} />
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}
