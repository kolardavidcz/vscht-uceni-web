import { computeFitchRetentionIndex, getLeaves, type PhyloNode } from "./newickParser";

export interface FimoHit {
  motifId: string;
  motifAltId: string;
  sequenceName: string;
  start: number;
  stop: number;
  strand: string;
  score: number;
  pValue: number;
  qValue: number | null;
  matchedSequence: string;
}

export interface FimoAnalysisOptions {
  pValueCutoff?: number;
  minVariance?: number;
  minBinaryCoverage?: number;
  maxBinaryCoverage?: number;
  treeRoot?: PhyloNode | null;
}

export type MotifCategory = "core" | "clade-specific" | "variable" | "rare";

export interface MotifStatsRow {
  motif: string;
  consensus: string;
  width: number;
  coverage: number;
  coverageCount: number;
  totalSequences: number;
  variance: number;
  meanNegLogP: number;
  maxNegLogP: number;
  inHeatmap: boolean;
  inBinary: boolean;
  retentionIndex: number | null;
  parsimonySteps: number | null;
  category: MotifCategory;
}

export interface FimoAnalysisResult {
  motifs: MotifStatsRow[];
  sequenceOrder: string[];
  /** sequenceId -> motifName -> best -log10(p) */
  scoreMatrix: Map<string, Map<string, number>>;
  /** motifName -> Set<sequenceId> passing pValueCutoff */
  presentByMotif: Map<string, Set<string>>;
  totalHitsParsed: number;
  passingHits: number;
}

/** Parse MEME Suite `fimo.tsv` tab-delimited output. */
export function parseFimoTsv(text: string): FimoHit[] {
  const hits: FimoHit[] = [];
  let headerCols: string[] | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (cols.length < 8) continue;

    if (
      !headerCols &&
      (cols[0].toLowerCase() === "motif_id" || cols[2].toLowerCase() === "sequence_name")
    ) {
      headerCols = cols.map((c) => c.trim().toLowerCase());
      continue;
    }

    const idx = (name: string, fallback: number) => {
      if (!headerCols) return fallback;
      const found = headerCols.indexOf(name);
      return found >= 0 ? found : fallback;
    };

    const motifId = (cols[idx("motif_id", 0)] ?? "").trim();
    const motifAltId = (cols[idx("motif_alt_id", 1)] ?? motifId).trim() || motifId;
    const sequenceName = (cols[idx("sequence_name", 2)] ?? "").trim();
    const start = Number.parseInt(cols[idx("start", 3)] ?? "0", 10);
    const stop = Number.parseInt(cols[idx("stop", 4)] ?? "0", 10);
    const strand = (cols[idx("strand", 5)] ?? "+").trim();
    const score = Number.parseFloat(cols[idx("score", 6)] ?? "0");
    const pValue = Number.parseFloat(cols[idx("p-value", 7)] ?? "1");
    const qRaw = cols[idx("q-value", 8)];
    const qValue = qRaw !== undefined && qRaw !== "" ? Number.parseFloat(qRaw) : null;
    const matchedSequence = (cols[idx("matched_sequence", 9)] ?? "").trim();

    if (!sequenceName || !motifAltId || !Number.isFinite(pValue)) continue;

    hits.push({
      motifId,
      motifAltId,
      sequenceName,
      start: Number.isFinite(start) ? start : 0,
      stop: Number.isFinite(stop) ? stop : 0,
      strand,
      score: Number.isFinite(score) ? score : 0,
      pValue,
      qValue: qValue !== null && Number.isFinite(qValue) ? qValue : null,
      matchedSequence,
    });
  }

  return hits;
}

function classifyMotif(
  coverage: number,
  ri: number | null,
  inBinary: boolean
): MotifCategory {
  if (coverage >= 0.95) return "core";
  if (coverage < 0.1) return "rare";
  if (ri !== null && ri >= 0.7 && inBinary) return "clade-specific";
  return "variable";
}

/**
 * Compute per-motif coverage, variance of `-log10(p)`, and Fitch parsimony Retention Index (RI).
 * Mirrors GH48 `11_itol/meme/meme_visualization.py`.
 */
export function analyzeFimoMotifs(
  hits: FimoHit[],
  options: FimoAnalysisOptions = {}
): FimoAnalysisResult {
  const pCutoff = options.pValueCutoff ?? 1e-4;
  const minVariance = options.minVariance ?? 10;
  const minCov = options.minBinaryCoverage ?? 0.1;
  const maxCov = options.maxBinaryCoverage ?? 0.98;
  const treeRoot = options.treeRoot ?? null;

  const passing = hits.filter((h) => h.pValue <= pCutoff);

  const consensusByMotif = new Map<string, string>();
  const widthByMotif = new Map<string, number>();
  const seqSet = new Set<string>();
  const bestP = new Map<string, Map<string, number>>(); // seq -> motif -> min p-value

  for (const h of passing) {
    seqSet.add(h.sequenceName);
    if (!consensusByMotif.has(h.motifAltId)) {
      consensusByMotif.set(h.motifAltId, h.motifId || h.matchedSequence);
    }
    const w = h.stop >= h.start && h.start > 0 ? h.stop - h.start + 1 : h.motifId.length;
    if (!widthByMotif.has(h.motifAltId) && w > 0) {
      widthByMotif.set(h.motifAltId, w);
    }

    let seqMap = bestP.get(h.sequenceName);
    if (!seqMap) {
      seqMap = new Map();
      bestP.set(h.sequenceName, seqMap);
    }
    const prev = seqMap.get(h.motifAltId);
    if (prev === undefined || h.pValue < prev) {
      seqMap.set(h.motifAltId, h.pValue);
    }
  }

  // Determine canonical sequence universe (tree leaves take precedence if provided)
  const treeLeaves = treeRoot ? getLeaves(treeRoot).map((l) => l.name) : [];
  const sequenceOrder =
    treeLeaves.length > 0
      ? treeLeaves
      : [...seqSet].sort((a, b) => a.localeCompare(b));

  const totalSeqs = sequenceOrder.length;
  const motifNames = [...consensusByMotif.keys()].sort((a, b) => {
    const na = Number.parseInt(a.replace(/\D+/g, ""), 10);
    const nb = Number.parseInt(b.replace(/\D+/g, ""), 10);
    if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
    return a.localeCompare(b);
  });

  // Build -log10(p) matrix and presence sets
  const scoreMatrix = new Map<string, Map<string, number>>();
  const presentByMotif = new Map<string, Set<string>>();
  for (const m of motifNames) presentByMotif.set(m, new Set());

  for (const seqId of sequenceOrder) {
    const row = new Map<string, number>();
    const pMap = bestP.get(seqId);
    for (const m of motifNames) {
      const p = pMap?.get(m);
      if (p !== undefined) {
        const negLogP = -Math.log10(Math.max(p, 1e-300));
        row.set(m, Math.round(negLogP * 100) / 100);
        presentByMotif.get(m)!.add(seqId);
      } else {
        row.set(m, 0);
      }
    }
    scoreMatrix.set(seqId, row);
  }

  const motifs: MotifStatsRow[] = motifNames.map((motif) => {
    const values = sequenceOrder.map((seqId) => scoreMatrix.get(seqId)?.get(motif) ?? 0);
    const present = presentByMotif.get(motif) ?? new Set<string>();
    const coverageCount = present.size;
    const coverage = totalSeqs > 0 ? coverageCount / totalSeqs : 0;

    const mean =
      values.length > 0 ? values.reduce((acc, v) => acc + v, 0) / values.length : 0;
    const variance =
      values.length > 0
        ? values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / values.length
        : 0;
    const maxNegLogP = values.length > 0 ? Math.max(...values) : 0;

    const inHeatmap = variance >= minVariance;
    const inBinary = coverage >= minCov && coverage <= maxCov;

    let retentionIndex: number | null = null;
    let parsimonySteps: number | null = null;
    if (treeRoot) {
      const fitch = computeFitchRetentionIndex(treeRoot, present);
      retentionIndex = fitch.retentionIndex;
      parsimonySteps = fitch.steps;
    }

    return {
      motif,
      consensus: consensusByMotif.get(motif) ?? motif,
      width: widthByMotif.get(motif) ?? 0,
      coverage: Math.round(coverage * 10000) / 10000,
      coverageCount,
      totalSequences: totalSeqs,
      variance: Math.round(variance * 100) / 100,
      meanNegLogP: Math.round(mean * 100) / 100,
      maxNegLogP: Math.round(maxNegLogP * 100) / 100,
      inHeatmap,
      inBinary,
      retentionIndex,
      parsimonySteps,
      category: classifyMotif(coverage, retentionIndex, inBinary),
    };
  });

  // Sort by variance descending (matches GH48 motif_stats.tsv)
  motifs.sort((a, b) => b.variance - a.variance);

  return {
    motifs,
    sequenceOrder,
    scoreMatrix,
    presentByMotif,
    totalHitsParsed: hits.length,
    passingHits: passing.length,
  };
}

/** Generate iTOL `DATASET_HEATMAP` file (-log10 p-value per sequence × motif). */
export function generateItolHeatmap(
  result: FimoAnalysisResult,
  options: { label?: string; onlyPassingVariance?: boolean } = {}
): string {
  const label = options.label ?? "MEME_motifs_negLogP";
  const selected = options.onlyPassingVariance
    ? result.motifs.filter((m) => m.inHeatmap)
    : result.motifs;
  const cols = selected.length > 0 ? selected : result.motifs;
  const fieldLabels = cols.map((m) => m.motif).join(",");

  const lines = [
    "DATASET_HEATMAP",
    "SEPARATOR COMMA",
    `DATASET_LABEL,${label}`,
    "COLOR,#f95d12",
    `FIELD_LABELS,${fieldLabels}`,
    "COLOR_MIN,#fff7ed",
    "COLOR_MID,#f97316",
    "COLOR_MAX,#7c2d12",
    "USE_MID_COLOR,1",
    "SHOW_LABELS,1",
    "SIZE_FACTOR,1",
    "DATA",
  ];

  for (const seqId of result.sequenceOrder) {
    const row = result.scoreMatrix.get(seqId);
    const vals = cols.map((m) => (row?.get(m.motif) ?? 0).toFixed(2));
    lines.push(`${seqId},${vals.join(",")}`);
  }

  return lines.join("\n") + "\n";
}

/** Generate iTOL `DATASET_BINARY` file (1 = motif present, 0 = absent). */
export function generateItolBinary(
  result: FimoAnalysisResult,
  options: { label?: string; onlyInformative?: boolean } = {}
): string {
  const label = options.label ?? "MEME_clade_motifs_binary";
  const selected = options.onlyInformative
    ? result.motifs.filter((m) => m.inBinary)
    : result.motifs;
  const cols = selected.length > 0 ? selected : result.motifs;

  const palette = [
    "#ea580c",
    "#0f766e",
    "#b45309",
    "#be123c",
    "#1d4ed8",
    "#4d7c0f",
    "#7c2d12",
    "#0369a1",
  ];

  const fieldLabels = cols.map((m) => m.motif).join(",");
  const fieldShapes = cols.map(() => "1").join(",");
  const fieldColors = cols.map((_, i) => palette[i % palette.length]).join(",");

  const lines = [
    "DATASET_BINARY",
    "SEPARATOR COMMA",
    `DATASET_LABEL,${label}`,
    "COLOR,#c2410c",
    `FIELD_LABELS,${fieldLabels}`,
    `FIELD_SHAPES,${fieldShapes}`,
    `FIELD_COLORS,${fieldColors}`,
    "SHOW_LABELS,1",
    "DATA",
  ];

  for (const seqId of result.sequenceOrder) {
    const vals = cols.map((m) =>
      result.presentByMotif.get(m.motif)?.has(seqId) ? "1" : "0"
    );
    lines.push(`${seqId},${vals.join(",")}`);
  }

  return lines.join("\n") + "\n";
}

/** Generate `motif_stats.tsv` matching GH48 `11_itol/meme/motif_stats.tsv`. */
export function generateMotifStatsTsv(result: FimoAnalysisResult): string {
  const header = [
    "motif",
    "consensus",
    "width",
    "coverage",
    "coverage_n",
    "total_sequences",
    "variance",
    "mean_neglogp",
    "in_heatmap",
    "in_binary",
    "retention_index",
    "category",
  ].join("\t");

  const rows = result.motifs.map((m) =>
    [
      m.motif,
      m.consensus,
      m.width,
      m.coverage.toFixed(4),
      m.coverageCount,
      m.totalSequences,
      m.variance.toFixed(4),
      m.meanNegLogP.toFixed(4),
      m.inHeatmap ? "True" : "False",
      m.inBinary ? "True" : "False",
      m.retentionIndex !== null ? m.retentionIndex.toFixed(4) : "NA",
      m.category,
    ].join("\t")
  );

  return [header, ...rows].join("\n") + "\n";
}
