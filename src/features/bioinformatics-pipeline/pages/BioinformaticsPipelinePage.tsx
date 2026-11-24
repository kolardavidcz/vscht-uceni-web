import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  Database,
  Dna,
  Download,
  ExternalLink,
  Filter,
  GitBranch,
  Layers,
  RotateCcw,
  Scissors,
  Sparkles,
  Trash2,
  Upload,
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
import { getLeaves, parseNewick } from "../lib/newickParser";
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
import { FullPipelinePanel } from "../components/FullPipelinePanel";
import type { FullPipelineOutput } from "../lib/fullPipelineRunner";

type TabId = "runner" | "overview" | "fasta" | "hmm" | "mmseqs" | "fimo" | "tree";

const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "runner", label: "Celá pipeline (Soubory → ZIP)", short: "Celá pipeline" },
  { id: "overview", label: "Přehled (11 kroků)", short: "Přehled" },
  { id: "fasta", label: "1–2 · FASTA filtr", short: "FASTA filtr" },
  { id: "hmm", label: "3 · HMM ořez domén", short: "HMM ořez" },
  { id: "mmseqs", label: "4 & 11 · MMseqs2 & Charakterizované", short: "MMseqs2" },
  { id: "fimo", label: "8–10 · FIMO/MEME & RI", short: "FIMO & RI" },
  { id: "tree", label: "7 & 11 · Strom, Taxonomie & χ²", short: "Strom & χ²" },
];

function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
  onLoad: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onLoad(reader.result);
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

function CopyCommandButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer shrink-0"
      aria-label="Kopírovat příkaz"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Zkopírováno" : "Kopírovat"}
    </button>
  );
}

function MetricCard({
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
      className={`rounded-xl border p-3.5 ${
        accent
          ? "border-brand-orange/35 bg-brand-orange/[0.08]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-xl sm:text-2xl font-black tabular-nums ${
          accent ? "text-brand-orange" : "text-white"
        }`}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>}
    </div>
  );
}

export function BioinformaticsPipelinePage() {
  const [activeTab, setActiveTab] = useState<TabId>("runner");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    runner: null,
    overview: null,
    fasta: null,
    hmm: null,
    mmseqs: null,
    fimo: null,
    tree: null,
  });

  // Pipeline data inputs (pre-loaded with real GH48 showcase dataset)
  const [rawFastaText, setRawFastaText] = useState(GH48_DEMO_RAW_FASTA);
  const [hmmFastaText, setHmmFastaText] = useState(GH48_DEMO_RAW_FASTA);
  const [hmmReportText, setHmmReportText] = useState(GH48_DEMO_HMM_REPORT);
  const [adjacencyText, setAdjacencyText] = useState(GH48_DEMO_ADJACENCY);
  const [charFastaText, setCharFastaText] = useState(GH48_DEMO_CHAR_FASTA);
  const [dbDomainsText, setDbDomainsText] = useState(GH48_DEMO_DB_DOMAINS_FASTA);
  const [fimoText, setFimoText] = useState(GH48_DEMO_FIMO);
  const [newickText, setNewickText] = useState(GH48_DEMO_NEWICK);
  const [taxonomyText, setTaxonomyText] = useState(GH48_DEMO_TAXONOMY);

  // Step 2: FASTA filter options
  const [excludeTermsText, setExcludeTermsText] = useState(
    DEFAULT_EXCLUDE_TERMS.join(", ")
  );
  const [minLen, setMinLen] = useState(100);
  const [maxLen, setMaxLen] = useState(4000);
  const [dedupId, setDedupId] = useState(true);
  const [dedupSeq, setDedupSeq] = useState(false);

  // Step 3: HMM cutter options
  const [coordMode, setCoordMode] = useState<"env" | "ali">("env");
  const [dedupMode, setDedupMode] = useState<"longest" | "best-evalue" | "all">("longest");
  const [padding, setPadding] = useState(0);
  const [maxIEvalueExp, setMaxIEvalueExp] = useState(-5);
  const [minDomainLen, setMinDomainLen] = useState(100);

  // Step 10: FIMO & RI options
  const [fimoPExp, setFimoPExp] = useState(-4);
  const [minVariance, setMinVariance] = useState(10);
  const [minCovPct, setMinCovPct] = useState(10);
  const [maxCovPct, setMaxCovPct] = useState(98);
  const [heatmapFilter, setHeatmapFilter] = useState<"all" | "heatmap" | "binary">("all");

  // Step 7 & 11: Tree & Taxonomy options
  const [cladogram, setCladogram] = useState(false);
  const [showBootstrap, setShowBootstrap] = useState(true);
  const [bootstrapThreshold, setBootstrapThreshold] = useState(85);
  const [colorMode, setColorMode] = useState<"taxonomy" | "motif">("taxonomy");
  const [taxRank, setTaxRank] = useState<TaxRank>("phylum");
  const [selectedMotifForStats, setSelectedMotifForStats] = useState("MEME-23");
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>("BAE94320.1");

  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  useEffect(() => {
    document.title = "GH48 Bioinformatická pipeline · VŠCHT Učení";
  }, []);

  const flashNotice = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 2600);
  };

  const selectTab = (id: TabId, focusTab = false) => {
    setActiveTab(id);
    const el = tabRefs.current[id];
    if (el) {
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (focusTab) el.focus();
    }
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (idx < 0) return;
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = TABS.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      selectTab(TABS[nextIdx].id, true);
    }
  };

  const loadGh48Demo = () => {
    setRawFastaText(GH48_DEMO_RAW_FASTA);
    setHmmFastaText(GH48_DEMO_RAW_FASTA);
    setHmmReportText(GH48_DEMO_HMM_REPORT);
    setAdjacencyText(GH48_DEMO_ADJACENCY);
    setCharFastaText(GH48_DEMO_CHAR_FASTA);
    setDbDomainsText(GH48_DEMO_DB_DOMAINS_FASTA);
    setFimoText(GH48_DEMO_FIMO);
    setNewickText(GH48_DEMO_NEWICK);
    setTaxonomyText(GH48_DEMO_TAXONOMY);
    setSelectedMotifForStats("MEME-23");
    setSelectedLeaf("BAE94320.1");
    flashNotice("Načtena vzorová data GH48 (29 reprezentantů, IQ-TREE, FIMO, taxonomie).");
  };

  const clearAllData = () => {
    setRawFastaText("");
    setHmmFastaText("");
    setHmmReportText("");
    setAdjacencyText("");
    setCharFastaText("");
    setDbDomainsText("");
    setFimoText("");
    setNewickText("");
    setTaxonomyText("");
    setSelectedLeaf(null);
    flashNotice("Všechna vstupní pole byla vymazána — můžete nahrát vlastní soubory.");
  };

  // --- Computed pipeline outputs ---
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

  const hmmCutResult = useMemo(() => {
    const recs = parseFasta(hmmFastaText);
    const hits = parseDomtblout(hmmReportText);
    return cutDomainsFromFasta(recs, hits, {
      coordMode,
      dedupMode,
      padding,
      maxIEvalue: Math.pow(10, maxIEvalueExp),
      minDomainLength: minDomainLen,
    });
  }, [hmmFastaText, hmmReportText, coordMode, dedupMode, padding, maxIEvalueExp, minDomainLen]);

  const treeRoot = useMemo(() => parseNewick(newickText), [newickText]);
  const treeLeafSet = useMemo(
    () => new Set(treeRoot ? getLeaves(treeRoot).map((l) => l.name) : []),
    [treeRoot]
  );

  const adjacencySummary = useMemo(
    () => parseAdjacencyList(adjacencyText),
    [adjacencyText]
  );

  const charMappingResult = useMemo(() => {
    const chars = parseFasta(charFastaText);
    const db = parseFasta(dbDomainsText);
    return mapCharacterizedToTree(chars, db, treeLeafSet, adjacencySummary);
  }, [charFastaText, dbDomainsText, treeLeafSet, adjacencySummary]);

  const charStatusByLeaf = useMemo(() => {
    const map = new Map<string, CharacterizedMatch["status"]>();
    for (const m of charMappingResult.matches) {
      if (m.treeLeafId && m.status !== "unmatched") {
        // Direct takes precedence over proxy
        if (map.get(m.treeLeafId) !== "direct") {
          map.set(m.treeLeafId, m.status);
        }
      }
    }
    return map;
  }, [charMappingResult]);

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

  const heatmapMotifs = useMemo(() => {
    if (heatmapFilter === "heatmap") return fimoAnalysis.motifs.filter((m) => m.inHeatmap);
    if (heatmapFilter === "binary") return fimoAnalysis.motifs.filter((m) => m.inBinary);
    return fimoAnalysis.motifs;
  }, [fimoAnalysis, heatmapFilter]);

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

  const activeMotifName = useMemo(() => {
    if (fimoAnalysis.presentByMotif.has(selectedMotifForStats)) {
      return selectedMotifForStats;
    }
    return fimoAnalysis.motifs[0]?.motif ?? "";
  }, [fimoAnalysis, selectedMotifForStats]);

  const motifTaxAnalysis = useMemo(() => {
    if (!activeMotifName || taxonomyRecords.length === 0) return null;
    const present = fimoAnalysis.presentByMotif.get(activeMotifName) ?? new Set<string>();
    return analyzeMotifByTaxonomy(activeMotifName, present, taxonomyRecords, taxRank);
  }, [activeMotifName, fimoAnalysis, taxonomyRecords, taxRank]);

  // --- Table column definitions ---
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
        render: (r) => (
          <span className="font-mono text-white">{r.treeLeafId ?? "—"}</span>
        ),
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
        label: "Velikost klastru",
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
            <span className="text-slate-500">bez stromu</span>
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
            {r.consensus.length > 28 ? `${r.consensus.slice(0, 28)}…` : r.consensus}
          </span>
        ),
      },
    ],
    []
  );

  // Leaf inspector data
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

  const exportTreeSvg = () => {
    const svgEl = document.getElementById("gh48-phylo-svg");
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    downloadTextFile("phylogeny_tree.svg", source, "image/svg+xml;charset=utf-8");
  };

  const applyFullPipelineOutputs = (out: FullPipelineOutput) => {
    const r = out.resolvedTexts;
    if (r.rawFasta) setRawFastaText(r.rawFasta);
    if (r.filteredFasta) setHmmFastaText(r.filteredFasta);
    if (r.adjacencyTsv) setAdjacencyText(r.adjacencyTsv);
    if (r.dbDomainsFasta) setDbDomainsText(r.dbDomainsFasta);
    if (r.newick) setNewickText(r.newick);
    if (r.fimoTsv) setFimoText(r.fimoTsv);
    if (r.taxonomyTsv) setTaxonomyText(r.taxonomyTsv);
    flashNotice(
      `Celá pipeline dokončena (${out.durationMs} ms) — všechny záložky aktualizovány (${out.artifacts.length} výstupů).`
    );
  };

  return (
    <div className="bio-pipeline-root min-h-screen bg-brand-espresso text-slate-100 flex flex-col">
      {/* Top sticky header */}
      <header className="page-header-dark">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
            >
              <ArrowLeft size={14} />
              Rozcestník
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Dna size={18} className="text-brand-orange shrink-0" />
                <h1 className="font-display text-base sm:text-lg font-black tracking-tight text-white truncate">
                  GH48 Bioinformatická pipeline
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                  VŠCHT · Lokálně v prohlížeči
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadGh48Demo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              Vzorová data GH48
            </button>
            <button
              type="button"
              onClick={clearAllData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Vymazat
            </button>
            <a
              href="https://github.com/kolardavidcz/GH48"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              GitHub GH48
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Accessible single-row horizontally scrollable tablist (modern-web-guidance: tabs) */}
        <div className="max-w-7xl mx-auto px-4 border-t border-white/5">
          <div
            role="tablist"
            aria-label="Kroky bioinformatické pipeline"
            onKeyDown={handleTabKeyDown}
            className="bio-tablist gap-1"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  id={`bio-tab-${tab.id}`}
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(tab.id)}
                  className="bio-tab px-3.5 py-3 text-xs sm:text-[13px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-[-2px]"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {bannerNotice && (
        <div
          role="status"
          className="max-w-7xl mx-auto w-full px-4 pt-3"
        >
          <div className="rounded-xl border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-2 text-xs font-semibold text-orange-100 flex items-center gap-2">
            <Sparkles size={14} className="text-brand-orange shrink-0" />
            {bannerNotice}
          </div>
        </div>
      )}

      {/* Tab Panels: no padding/margin/border on role="tabpanel" itself */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* ================= TAB 0: FULL PIPELINE RUNNER ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-runner"
          hidden={activeTab !== "runner"}
        >
          <FullPipelinePanel
            onApplyOutputs={applyFullPipelineOutputs}
            onJumpToTab={(t) => selectTab(t)}
          />
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-overview"
          hidden={activeTab !== "overview"}
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b0e08] to-[#120a06] p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                    <Sparkles size={13} />
                    Semestrální práce Základy bioinformatiky · VŠCHT Praha
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                    Pracovní prostředí pro fylogenezi a motivy proteinových rodin
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Webová implementace pipeline z projektu{" "}
                    <strong className="text-white">GH48 (Glycoside Hydrolase Family 48)</strong>.
                    Veškeré výpočty běží 100 % lokálně ve vašem prohlížeči bez odesílání dat na server —
                    nahrajte vlastní soubory z NCBI, HMMER, MMseqs2, IQ-TREE a FIMO, nebo prozkoumejte
                    přednačtený reálný dataset GH48.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => selectTab("tree")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <GitBranch size={15} />
                    Prohlédnout GH48 strom & χ²
                  </button>
                  <button
                    type="button"
                    onClick={() => selectTab("fimo")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <BarChart3 size={15} />
                    FIMO motivy & Fitch RI
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                <MetricCard
                  label="Aktivní strom"
                  value={treeLeafSet.size}
                  hint="reprezentantů v IQ-TREE"
                  accent
                />
                <MetricCard
                  label="FIMO motivy"
                  value={fimoAnalysis.motifs.length}
                  hint={`${fimoAnalysis.motifs.filter((m) => m.category === "clade-specific").length} kladových (RI ≥ 0.7)`}
                />
                <MetricCard
                  label="Charakterizované"
                  value={`${charMappingResult.directCount + charMappingResult.proxyCount}/${charMappingResult.matches.length}`}
                  hint={`${charMappingResult.directCount} přímých · ${charMappingResult.proxyCount} proxy`}
                />
                <MetricCard
                  label="χ² asociace (MEME-23)"
                  value={motifTaxAnalysis ? formatPValue(motifTaxAnalysis.stats.pValue) : "—"}
                  hint={
                    motifTaxAnalysis
                      ? `Cramér V = ${motifTaxAnalysis.stats.cramersV.toFixed(2)}`
                      : "nahrajte FIMO + taxonomii"
                  }
                />
              </div>
            </section>

            {/* GH48 Biological highlight box */}
            <section className="rounded-2xl border border-brand-orange/25 bg-brand-orange/[0.05] p-5">
              <h3 className="font-display text-sm font-black uppercase tracking-wider text-brand-orange mb-2">
                Klíčový biologický nález přednačteného datasetu GH48
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
                <div>
                  <strong className="text-white block mb-1">
                    Bifurkace MEME-23+ vs. MEME-25+
                  </strong>
                  Motiv <span className="font-mono text-brand-orange">MEME-23</span> vykazuje
                  vysoký Fitchův Retention Index (RI &gt; 0.85) a odděluje větev{" "}
                  <em>Actinomycetota + Coleoptera</em> od ancestrální větve{" "}
                  <span className="font-mono text-amber-200">MEME-25</span> (
                  <em>Bacillota, Neocallimastigomycota</em>).
                </div>
                <div>
                  <strong className="text-white block mb-1">
                    Horizontální přenos genu (HGT) u brouků
                  </strong>
                  Celulázy mandelinek (<em>Gastrophysa, Chrysomela, Phaedon</em>) se vnořují přímo do
                  aktinobakteriálního kladu a sdílejí motiv <span className="font-mono">MEME-23</span>{" "}
                  — silný důkaz bakteriálního HGT do hmyzu.
                </div>
                <div>
                  <strong className="text-white block mb-1">
                    Konzervované katalytické jádro
                  </strong>
                  Motivy <span className="font-mono">MEME-1..4</span> jsou přítomny napříč &gt;95 %
                  rodiny (RI ≈ 0, univerzální jádro), zatímco redukovaná linie{" "}
                  <em>Paenibacillaceae</em> ztrácí okrajové motivy.
                </div>
              </div>
            </section>

            {/* 11-step Pipeline Checklist */}
            <section className="space-y-3">
              <h3 className="font-display text-lg font-black text-white">
                11 kroků standardní fylogenetické pipeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GH48_PIPELINE_STEPS.map((s) => (
                  <div
                    key={s.step}
                    className="rounded-xl border border-white/10 bg-[#140b07] p-4 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-brand-orange/15 border border-brand-orange/35 text-brand-orange font-mono text-xs font-black flex items-center justify-center shrink-0">
                          {s.step}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-white leading-snug">
                            {s.title}
                          </div>
                          <div className="text-[11px] text-slate-400">{s.tool}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                          s.where === "browser"
                            ? "bg-brand-orange/15 text-brand-orange border-brand-orange/35"
                            : s.where === "galaxy"
                            ? "bg-amber-500/10 text-amber-200 border-amber-500/25"
                            : "bg-white/5 text-slate-400 border-white/10"
                        }`}
                      >
                        {s.where === "browser"
                          ? "Zde v prohlížeči"
                          : s.where === "galaxy"
                          ? "Galaxy / CLI"
                          : "Externí DB"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{s.summary}</p>

                    <div className="rounded-lg bg-black/40 border border-white/5 px-2.5 py-2 flex items-center justify-between gap-2">
                      <code className="text-[11px] font-mono text-amber-100/90 overflow-x-auto whitespace-nowrap">
                        {s.command}
                      </code>
                      <CopyCommandButton text={s.command} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 mt-auto text-[11px]">
                      <span className="text-slate-400 font-mono">GH48: {s.gh48Metric}</span>
                      <div className="flex items-center gap-3">
                        {s.externalUrl && (
                          <a
                            href={s.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-amber-200 hover:text-brand-orange hover:underline"
                          >
                            {s.externalLabel ?? "Externí nástroj"}
                            <ExternalLink size={11} />
                          </a>
                        )}
                        {s.tabId && (
                          <button
                            type="button"
                            onClick={() => selectTab(s.tabId!)}
                            className="inline-flex items-center gap-1 font-bold text-brand-orange hover:underline cursor-pointer"
                          >
                            Otevřít nástroj
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ================= TAB 2: FASTA FILTER ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-fasta"
          hidden={activeTab !== "fasta"}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Input column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="raw-fasta-input"
                      className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                    >
                      <Filter size={14} className="text-brand-orange" />
                      Vstupní FASTA (NCBI / UniProt)
                    </label>
                    <FileUploadButton
                      label="Nahrát .fasta"
                      accept=".fasta,.fa,.faa,.txt"
                      onLoad={setRawFastaText}
                    />
                  </div>
                  <textarea
                    id="raw-fasta-input"
                    value={rawFastaText}
                    onChange={(e) => setRawFastaText(e.target.value)}
                    rows={10}
                    spellCheck={false}
                    placeholder=">AAA91086.1 cellulase [Caldicellulosiruptor saccharolyticus]&#10;MKTAYIAK..."
                    className="w-full rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Pravidla filtrace
                  </div>
                  <div>
                    <label
                      htmlFor="exclude-terms-input"
                      className="block text-[11px] font-semibold text-slate-400 mb-1"
                    >
                      Vyloučit hlavičky obsahující (oddělené čárkou)
                    </label>
                    <input
                      id="exclude-terms-input"
                      type="text"
                      value={excludeTermsText}
                      onChange={(e) => setExcludeTermsText(e.target.value)}
                      className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-xs text-slate-100 focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="min-len-input"
                        className="block text-[11px] font-semibold text-slate-400 mb-1"
                      >
                        Min. délka (aa)
                      </label>
                      <input
                        id="min-len-input"
                        type="number"
                        min={0}
                        value={minLen}
                        onChange={(e) => setMinLen(Number(e.target.value) || 0)}
                        className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="max-len-input"
                        className="block text-[11px] font-semibold text-slate-400 mb-1"
                      >
                        Max. délka (aa)
                      </label>
                      <input
                        id="max-len-input"
                        type="number"
                        min={1}
                        value={maxLen}
                        onChange={(e) => setMaxLen(Number(e.target.value) || 10000)}
                        className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dedupId}
                        onChange={(e) => setDedupId(e.target.checked)}
                        className="accent-brand-orange"
                      />
                      Odstranit duplicitní ID
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dedupSeq}
                        onChange={(e) => setDedupSeq(e.target.checked)}
                        className="accent-brand-orange"
                      />
                      Odstranit 100% identické sekvence
                    </label>
                  </div>
                </div>
              </div>

              {/* Output column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricCard label="Vstup" value={fastaFilterResult.total} />
                  <MetricCard
                    label="Ponecháno"
                    value={fastaFilterResult.kept.length}
                    accent
                  />
                  <MetricCard
                    label="Vyřazeno"
                    value={fastaFilterResult.removed.length}
                  />
                  <MetricCard
                    label="Medián délky"
                    value={`${fastaFilterResult.lengthStats.median} aa`}
                    hint={`${fastaFilterResult.lengthStats.min}–${fastaFilterResult.lengthStats.max} aa`}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={fastaFilterResult.kept.length === 0}
                    onClick={() =>
                      downloadTextFile(
                        "02_filtered_sequences.fasta",
                        serializeFasta(fastaFilterResult.kept)
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    Stáhnout filtrovanou FASTA ({fastaFilterResult.kept.length})
                  </button>
                  <button
                    type="button"
                    disabled={fastaFilterResult.kept.length === 0}
                    onClick={() => {
                      setHmmFastaText(serializeFasta(fastaFilterResult.kept));
                      selectTab("hmm");
                      flashNotice(
                        `Předáno ${fastaFilterResult.kept.length} vyčištěných sekvencí do kroku 3 (HMM ořez).`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Předat do HMM ořezu
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Removal reasons & length histogram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#140b07] p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Distribuce délek (ponechané vs. vyřazené)
                    </div>
                    {fastaFilterResult.histogram.length === 0 ? (
                      <div className="text-xs text-slate-500">Vložte FASTA sekvence.</div>
                    ) : (
                      <div className="space-y-1.5">
                        {(() => {
                          const maxBin = Math.max(
                            1,
                            ...fastaFilterResult.histogram.map((b) => b.kept + b.removed)
                          );
                          return fastaFilterResult.histogram.map((b) => (
                            <div
                              key={b.label}
                              className="grid grid-cols-[88px_1fr_36px] items-center gap-2 text-[11px]"
                            >
                              <span className="font-mono text-slate-400 text-right">
                                {b.label}
                              </span>
                              <div className="h-3 rounded bg-white/5 overflow-hidden flex">
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
                    )}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#140b07] p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Důvody vyřazení
                    </div>
                    {Object.keys(fastaFilterResult.removedByReason).length === 0 ? (
                      <div className="text-xs text-slate-400">
                        Žádná sekvence nebyla vyřazena.
                      </div>
                    ) : (
                      <ul className="space-y-1.5 text-xs">
                        {Object.entries(fastaFilterResult.removedByReason).map(
                          ([reason, count]) => (
                            <li
                              key={reason}
                              className="flex items-center justify-between gap-2 border-b border-white/5 pb-1 last:border-none"
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

                <SortableDataTable
                  caption="Ponechané FASTA sekvence po filtraci"
                  rows={fastaFilterResult.kept}
                  rowKey={(r) => r.id}
                  columns={fastaColumns}
                  defaultSortKey="length"
                  defaultSortDir="descending"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= TAB 3: HMM DOMAIN CUTTER ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-hmm"
          hidden={activeTab !== "hmm"}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="hmm-fasta-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                  >
                    <Scissors size={14} className="text-brand-orange" />
                    Plné proteinové sekvence (FASTA)
                  </label>
                  <FileUploadButton
                    label="Nahrát .fasta"
                    accept=".fasta,.fa,.faa,.txt"
                    onLoad={setHmmFastaText}
                  />
                </div>
                <textarea
                  id="hmm-fasta-input"
                  value={hmmFastaText}
                  onChange={(e) => setHmmFastaText(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="hmm-report-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300"
                  >
                    HMMER3 tabulka (`--domtblout`)
                  </label>
                  <FileUploadButton
                    label="Nahrát domtblout"
                    accept=".txt,.tsv,.out,.tbl"
                    onLoad={setHmmReportText}
                  />
                </div>
                <textarea
                  id="hmm-report-input"
                  value={hmmReportText}
                  onChange={(e) => setHmmReportText(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            {/* Controls bar */}
            <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="hmm-coord-mode"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Souřadnice
                </label>
                <select
                  id="hmm-coord-mode"
                  value={coordMode}
                  onChange={(e) => setCoordMode(e.target.value as "env" | "ali")}
                  className="rounded-lg bg-black/50 border border-white/15 px-3 py-1.5 text-xs text-white"
                >
                  <option value="env">Envelope (env_from..env_to) · GH48</option>
                  <option value="ali">Alignment (ali_from..ali_to)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="hmm-dedup-mode"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Více domén v 1 proteinu
                </label>
                <select
                  id="hmm-dedup-mode"
                  value={dedupMode}
                  onChange={(e) =>
                    setDedupMode(e.target.value as "longest" | "best-evalue" | "all")
                  }
                  className="rounded-lg bg-black/50 border border-white/15 px-3 py-1.5 text-xs text-white"
                >
                  <option value="longest">Nejdelší doména (GH48)</option>
                  <option value="best-evalue">Nejlepší i-Evalue</option>
                  <option value="all">Ponechat všechny (_dom1, _dom2)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="hmm-padding"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Přesah ±padding ({padding} aa)
                </label>
                <input
                  id="hmm-padding"
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-36 accent-brand-orange"
                />
              </div>
              <div>
                <label
                  htmlFor="hmm-eval"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Max i-Evalue (10^{maxIEvalueExp})
                </label>
                <input
                  id="hmm-eval"
                  type="number"
                  min={-100}
                  max={0}
                  value={maxIEvalueExp}
                  onChange={(e) => setMaxIEvalueExp(Number(e.target.value))}
                  className="w-24 rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="hmm-minlen"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Min. délka (aa)
                </label>
                <input
                  id="hmm-minlen"
                  type="number"
                  min={1}
                  value={minDomainLen}
                  onChange={(e) => setMinDomainLen(Number(e.target.value) || 1)}
                  className="w-24 rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs font-mono text-white"
                />
              </div>
              <button
                type="button"
                disabled={hmmCutResult.croppedRecords.length === 0}
                onClick={() =>
                  downloadTextFile(
                    "03_cropped_domains.fasta",
                    serializeFasta(hmmCutResult.croppedRecords)
                  )
                }
                className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Download size={14} />
                Stáhnout oříznuté domény ({hmmCutResult.croppedRecords.length})
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="Načtené HMM hity" value={hmmCutResult.totalHitsParsed} />
              <MetricCard
                label="Vyříznuté domény"
                value={hmmCutResult.croppedRecords.length}
                accent
              />
              <MetricCard
                label="Chybí ve FASTA"
                value={hmmCutResult.missingInFasta.length}
              />
              <MetricCard
                label="Bez HMM hitu"
                value={hmmCutResult.unmatchedFastaIds.length}
              />
            </div>

            <SortableDataTable
              caption="Vyříznuté proteinové domény z HMMER domtblout"
              rows={hmmCutResult.rows}
              rowKey={(r) => `${r.id}-${r.start}-${r.end}`}
              columns={hmmColumns}
              defaultSortKey="score"
              defaultSortDir="descending"
            />
          </div>
        </div>

        {/* ================= TAB 4: MMSEQS2 & CHARACTERIZED ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-mmseqs"
          hidden={activeTab !== "mmseqs"}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="adj-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                  >
                    <Layers size={14} className="text-brand-orange" />
                    MMseqs2 adjacency_list
                  </label>
                  <FileUploadButton
                    label="Nahrát .tsv"
                    accept=".tabular,.tsv,.txt"
                    onLoad={setAdjacencyText}
                  />
                </div>
                <textarea
                  id="adj-input"
                  value={adjacencyText}
                  onChange={(e) => setAdjacencyText(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  placeholder="REP_ID&#9;MEMBER_ID"
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="char-fasta-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300"
                  >
                    Charakterizované (UniProt/CAZy)
                  </label>
                  <FileUploadButton
                    label="Nahrát .fasta"
                    accept=".fasta,.fa,.faa,.txt"
                    onLoad={setCharFastaText}
                  />
                </div>
                <textarea
                  id="char-fasta-input"
                  value={charFastaText}
                  onChange={(e) => setCharFastaText(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="db-domains-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                  >
                    <Database size={14} className="text-brand-orange" />
                    Domény z DB (před clusteringem)
                  </label>
                  <FileUploadButton
                    label="Nahrát .fasta"
                    accept=".fasta,.fa,.faa,.txt"
                    onLoad={setDbDomainsText}
                  />
                </div>
                <textarea
                  id="db-domains-input"
                  value={dbDomainsText}
                  onChange={(e) => setDbDomainsText(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <MetricCard
                label="MMseqs2 klastry"
                value={adjacencySummary.totalClusters}
                hint={`${adjacencySummary.totalMembers} členů`}
              />
              <MetricCard
                label="Komprese"
                value={
                  adjacencySummary.totalClusters > 0
                    ? `${(
                        adjacencySummary.totalMembers / adjacencySummary.totalClusters
                      ).toFixed(1)}×`
                    : "—"
                }
              />
              <MetricCard
                label="Přímá shoda (červená)"
                value={charMappingResult.directCount}
                accent
              />
              <MetricCard
                label="MMseqs2 proxy (oranžová)"
                value={charMappingResult.proxyCount}
              />
              <MetricCard
                label="Nenalezeno"
                value={charMappingResult.unmatchedCount}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  downloadTextFile(
                    "itol_char_tree_colors.txt",
                    generateCharacterizedTreeColors(charMappingResult)
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Download size={14} />
                iTOL TREE_COLORS
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadTextFile(
                    "itol_char_symbols.txt",
                    generateCharacterizedSymbols(charMappingResult)
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download size={14} />
                iTOL DATASET_SYMBOL
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadTextFile(
                    "characterized_mapping.tsv",
                    generateCharacterizedMappingTsv(charMappingResult),
                    "text/tab-separated-values;charset=utf-8"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download size={14} />
                Tabulka mapping.tsv
              </button>
            </div>

            <SortableDataTable
              caption="Mapování charakterizovaných enzymů na listy fylogenetického stromu"
              rows={charMappingResult.matches}
              rowKey={(r) => r.charId}
              columns={charColumns}
              defaultSortKey="status"
              defaultSortDir="ascending"
            />
          </div>
        </div>

        {/* ================= TAB 5: FIMO / MEME & FITCH RI ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-fimo"
          hidden={activeTab !== "fimo"}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="fimo-tsv-input"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300"
                  >
                    Výstup FIMO (`fimo.tsv`)
                  </label>
                  <FileUploadButton
                    label="Nahrát fimo.tsv"
                    accept=".tsv,.txt,.tab"
                    onLoad={setFimoText}
                  />
                </div>
                <textarea
                  id="fimo-tsv-input"
                  value={fimoText}
                  onChange={(e) => setFimoText(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#140b07] p-4 flex flex-col justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label
                      htmlFor="fimo-pexp"
                      className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                    >
                      Prahové p (10^{fimoPExp})
                    </label>
                    <input
                      id="fimo-pexp"
                      type="number"
                      min={-50}
                      max={0}
                      value={fimoPExp}
                      onChange={(e) => setFimoPExp(Number(e.target.value))}
                      className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fimo-var"
                      className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                    >
                      Min. rozptyl (heatmapa)
                    </label>
                    <input
                      id="fimo-var"
                      type="number"
                      min={0}
                      value={minVariance}
                      onChange={(e) => setMinVariance(Number(e.target.value) || 0)}
                      className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fimo-mincov"
                      className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                    >
                      Binární min. (%)
                    </label>
                    <input
                      id="fimo-mincov"
                      type="number"
                      min={0}
                      max={100}
                      value={minCovPct}
                      onChange={(e) => setMinCovPct(Number(e.target.value) || 0)}
                      className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fimo-maxcov"
                      className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                    >
                      Binární max. (%)
                    </label>
                    <input
                      id="fimo-maxcov"
                      type="number"
                      min={0}
                      max={100}
                      value={maxCovPct}
                      onChange={(e) => setMaxCovPct(Number(e.target.value) || 100)}
                      className="w-full rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                  <div className="text-xs text-slate-400">
                    {treeRoot ? (
                      <span>
                        Napojeno na IQ-TREE strom ({treeLeafSet.size} listů) →{" "}
                        <strong className="text-brand-orange">Fitchův RI aktivní</strong>
                      </span>
                    ) : (
                      <span>
                        Pro výpočet Fitchova RI nahrajte Newick strom v záložce Strom & χ².
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          "itol_meme_heatmap.txt",
                          generateItolHeatmap(fimoAnalysis, { onlyPassingVariance: true })
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download size={13} />
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      motif_stats.tsv
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <SortableDataTable
              caption="Statistiky MEME/FIMO motivů a Fitchův Retention Index"
              rows={fimoAnalysis.motifs}
              rowKey={(r) => r.motif}
              columns={motifColumns}
              defaultSortKey="ri"
              defaultSortDir="descending"
            />

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-white">
                  Heatmapa -log₁₀(p) zarovnaná k pořadí listů stromu
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  {(
                    [
                      ["all", "Všechny"],
                      ["heatmap", `Rozptyl ≥ ${minVariance}`],
                      ["binary", "Kladové (binární)"],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHeatmapFilter(val)}
                      className={`px-2.5 py-1 rounded-lg font-semibold border transition-colors cursor-pointer ${
                        heatmapFilter === val
                          ? "bg-brand-orange/20 text-brand-orange border-brand-orange/45"
                          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
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
          </div>
        </div>

        {/* ================= TAB 6: TREE, TAXONOMY & CHI-SQUARE ================= */}
        <div
          role="tabpanel"
          aria-labelledby="bio-tab-tree"
          hidden={activeTab !== "tree"}
        >
          <div className="space-y-5">
            {/* Collapsible raw Newick + Taxonomy inputs */}
            <details className="rounded-xl border border-white/10 bg-[#140b07] p-4">
              <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>
                  Vstupní soubory: IQ-TREE Newick/NHX ({treeLeafSet.size} listů) &amp;
                  taxonomy.tsv ({taxonomyRecords.length} záznamů)
                </span>
                <span className="text-brand-orange text-[11px] normal-case font-semibold">
                  Rozbalit pro nahrání vlastních dat
                </span>
              </summary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="newick-input"
                      className="text-xs font-semibold text-slate-300"
                    >
                      Newick / NHX strom (`.treefile`, `.nhx`, `.nwk`)
                    </label>
                    <FileUploadButton
                      label="Nahrát strom"
                      accept=".nwk,.nhx,.treefile,.tre,.txt"
                      onLoad={setNewickText}
                    />
                  </div>
                  <textarea
                    id="newick-input"
                    value={newickText}
                    onChange={(e) => setNewickText(e.target.value)}
                    rows={5}
                    spellCheck={false}
                    className="w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="tax-input"
                      className="text-xs font-semibold text-slate-300"
                    >
                      NCBI taxonomie (`taxonomy.tsv`)
                    </label>
                    <FileUploadButton
                      label="Nahrát taxonomy.tsv"
                      accept=".tsv,.txt,.tab"
                      onLoad={setTaxonomyText}
                    />
                  </div>
                  <textarea
                    id="tax-input"
                    value={taxonomyText}
                    onChange={(e) => setTaxonomyText(e.target.value)}
                    rows={5}
                    spellCheck={false}
                    className="w-full rounded-lg bg-black/40 border border-white/10 p-2.5 font-mono text-xs text-slate-200 focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>
            </details>

            {/* Controls bar */}
            <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="tree-color-mode"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Barvení listů
                </label>
                <select
                  id="tree-color-mode"
                  value={colorMode}
                  onChange={(e) =>
                    setColorMode(e.target.value as "taxonomy" | "motif")
                  }
                  className="rounded-lg bg-black/50 border border-white/15 px-3 py-1.5 text-xs text-white"
                >
                  <option value="taxonomy">Podle taxonomie</option>
                  <option value="motif">Podle přítomnosti motivu</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tree-tax-rank"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Taxonomická úroveň
                </label>
                <select
                  id="tree-tax-rank"
                  value={taxRank}
                  onChange={(e) => setTaxRank(e.target.value as TaxRank)}
                  className="rounded-lg bg-black/50 border border-white/15 px-3 py-1.5 text-xs text-white"
                >
                  <option value="kingdom">Říše (kingdom)</option>
                  <option value="phylum">Kmen (phylum)</option>
                  <option value="class">Třída (class)</option>
                  <option value="order">Řád (order)</option>
                  <option value="family">Čeleď (family)</option>
                  <option value="genus">Rod (genus)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tree-motif-select"
                  className="block text-[11px] font-bold uppercase text-slate-400 mb-1"
                >
                  Testovaný motiv (χ² &amp; zvýraznění)
                </label>
                <select
                  id="tree-motif-select"
                  value={activeMotifName}
                  onChange={(e) => setSelectedMotifForStats(e.target.value)}
                  className="rounded-lg bg-black/50 border border-white/15 px-3 py-1.5 text-xs text-white font-mono"
                >
                  {fimoAnalysis.motifs.map((m) => (
                    <option key={m.motif} value={m.motif}>
                      {m.motif} (RI={m.retentionIndex?.toFixed(2) ?? "—"})
                    </option>
                  ))}
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-1.5">
                <input
                  type="checkbox"
                  checked={cladogram}
                  onChange={(e) => setCladogram(e.target.checked)}
                  className="accent-brand-orange"
                />
                Kladogram (zarovnat listy)
              </label>

              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-1.5">
                <input
                  type="checkbox"
                  checked={showBootstrap}
                  onChange={(e) => setShowBootstrap(e.target.checked)}
                  className="accent-brand-orange"
                />
                UFBoot ≥ {bootstrapThreshold}
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
                  className="w-24 accent-brand-orange mb-1.5"
                />
              )}

              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFile(
                      `itol_taxonomy_${taxRank}.txt`,
                      generateItolTaxonomyColorstrip(taxonomyRecords, taxRank)
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-text text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download size={13} />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  iTOL LABELS
                </button>
                <button
                  type="button"
                  onClick={exportTreeSvg}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  SVG
                </button>
              </div>
            </div>

            {/* Tree + Right inspector / Chi-square panel */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              <div className="xl:col-span-8 space-y-3">
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
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
                          {activeMotifName}+ přítomen
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                        <span className="text-slate-400 font-mono">
                          {activeMotifName}− chybí
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {treeRoot ? (
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
                ) : (
                  <div className="rounded-xl border border-white/10 bg-[#140b07] p-8 text-center text-sm text-slate-400">
                    Nahrajte platný Newick/NHX strom pro vykreslení fylogeneze.
                  </div>
                )}
              </div>

              {/* Right sidebar: Leaf Inspector + Chi-square table */}
              <div className="xl:col-span-4 space-y-4">
                {/* Leaf Inspector */}
                <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                    Detail vybraného listu
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
                          Pro tento accession chybí záznam v taxonomy.tsv.
                        </div>
                      )}

                      <div>
                        <div className="text-[11px] font-bold text-slate-400 mb-1">
                          Detekované FIMO motivy ({inspectedLeafInfo.presentMotifs.length})
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
                      Klikněte na jakýkoli list ve stromu pro zobrazení taxonomie a motivů.
                    </div>
                  )}
                </div>

                {/* Chi-square association panel */}
                {motifTaxAnalysis && (
                  <div className="rounded-xl border border-white/10 bg-[#140b07] p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-white">
                        χ² test: <span className="font-mono text-brand-orange">{motifTaxAnalysis.motif}</span> × {taxRank}
                      </div>
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

                    <div className="grid grid-cols-3 gap-2 text-center bg-black/30 rounded-lg p-2.5 border border-white/5 text-xs">
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
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${r.presentPct}%`,
                                backgroundColor: r.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
