import type { FastaRecord } from "./fastaTools";

export interface MotifDiscoveryOptions {
  /** Number of motifs to discover (mix of conserved core + variable clade motifs). */
  numMotifs?: number;
  /** Width of each discovered motif window in amino acids (default 15). */
  motifWidth?: number;
  /** P-value threshold for FIMO hit reporting (default 1e-4). */
  pValueThreshold?: number;
}

export interface DiscoveredMotifResult {
  /** Standard MEME Suite `fimo.tsv` content ready for `parseFimoTsv` & iTOL export. */
  fimoTsv: string;
  motifsFound: number;
  hitsReported: number;
}

const STANDARD_AA = "ACDEFGHIKLMNPQRSTVWY";
const AA_TO_IDX = new Map<string, number>(
  STANDARD_AA.split("").map((a, i) => [a, i])
);
const BG_PROB = 1 / 20;

// Standard normal survival function 1 - Phi(z) (Abramowitz & Stegun 7.1.26)
function normalUpperTail(z: number): number {
  if (z <= 0) return 0.5;
  const x = z / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    t *
    (0.254829592 +
      t *
        (-0.284496736 +
          t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erfcVal = poly * Math.exp(-x * x);
  return Math.max(1e-300, 0.5 * erfcVal);
}

interface CandidateWindow {
  startCol: number;
  width: number;
  meanIc: number;
  occupancy: number;
  entropyVariance: number;
  kind: "core" | "variable";
  rankScore: number;
}

/**
 * In-browser de novo protein motif discovery & PWM scanning (MEME + FIMO equivalent).
 * Discovers both conserved catalytic-core windows (high Shannon IC, high occupancy)
 * and clade-differential windows (partial occupancy / bimodal conservation), builds
 * pseudocount-smoothed log-odds PWMs, scans all ungapped representative sequences,
 * and outputs standard `fimo.tsv`.
 */
export function discoverAndScanMotifs(
  alignedRecords: FastaRecord[],
  options: MotifDiscoveryOptions = {}
): DiscoveredMotifResult {
  const numMotifs = Math.max(1, Math.min(25, options.numMotifs ?? 10));
  const width = Math.max(8, Math.min(30, options.motifWidth ?? 15));
  const pThresh = options.pValueThreshold ?? 1e-4;

  const header = [
    "motif_id",
    "motif_alt_id",
    "sequence_name",
    "start",
    "stop",
    "strand",
    "score",
    "p-value",
    "q-value",
    "matched_sequence",
  ].join("\t");

  if (alignedRecords.length < 2) {
    return { fimoTsv: header + "\n", motifsFound: 0, hitsReported: 0 };
  }

  const cols = alignedRecords[0].sequence.length;
  const n = alignedRecords.length;
  if (cols < width) {
    return { fimoTsv: header + "\n", motifsFound: 0, hitsReported: 0 };
  }

  // Per-column information content & occupancy
  const colIc = new Float64Array(cols);
  const colOcc = new Float64Array(cols);
  const colTopFreq = new Float64Array(cols);

  for (let c = 0; c < cols; c++) {
    const counts = new Int32Array(20);
    let nonGap = 0;
    for (let r = 0; r < n; r++) {
      const idx = AA_TO_IDX.get(alignedRecords[r].sequence[c]);
      if (idx !== undefined) {
        counts[idx]++;
        nonGap++;
      }
    }
    colOcc[c] = nonGap / n;
    if (nonGap === 0) continue;

    let h = 0;
    let maxF = 0;
    for (let a = 0; a < 20; a++) {
      if (counts[a] > 0) {
        const p = counts[a] / nonGap;
        h -= p * Math.log2(p);
        if (p > maxF) maxF = p;
      }
    }
    colIc[c] = Math.max(0, Math.log2(20) - h);
    colTopFreq[c] = maxF;
  }

  // Score candidate windows across the alignment
  const coreCandidates: CandidateWindow[] = [];
  const varCandidates: CandidateWindow[] = [];

  for (let s = 0; s <= cols - width; s++) {
    let sumIc = 0;
    let sumOcc = 0;
    let sumBimodal = 0;
    for (let k = 0; k < width; k++) {
      const ic = colIc[s + k];
      const occ = colOcc[s + k];
      const top = colTopFreq[s + k];
      sumIc += ic;
      sumOcc += occ;
      // Clade-differential signal: moderate occupancy (20%-85%) OR bimodal amino-acid split (top freq 30%-75%) with solid IC
      const cladeOccBonus = occ >= 0.18 && occ <= 0.88 ? 1.4 : 0.4;
      const bimodalBonus = top >= 0.28 && top <= 0.78 ? 1.3 : 0.5;
      sumBimodal += ic * cladeOccBonus * bimodalBonus;
    }
    const meanIc = sumIc / width;
    const occupancy = sumOcc / width;

    if (occupancy >= 0.7 && meanIc >= 1.2) {
      coreCandidates.push({
        startCol: s,
        width,
        meanIc,
        occupancy,
        entropyVariance: sumBimodal / width,
        kind: "core",
        rankScore: meanIc * occupancy,
      });
    } else if (occupancy >= 0.18 && occupancy <= 0.92 && meanIc >= 0.9) {
      varCandidates.push({
        startCol: s,
        width,
        meanIc,
        occupancy,
        entropyVariance: sumBimodal / width,
        kind: "variable",
        rankScore: sumBimodal / width,
      });
    }
  }

  coreCandidates.sort((a, b) => b.rankScore - a.rankScore);
  varCandidates.sort((a, b) => b.rankScore - a.rankScore);

  // Pick non-overlapping mix (~60% core + ~40% clade-variable motifs)
  const selected: CandidateWindow[] = [];
  const overlaps = (start: number) =>
    selected.some((w) => Math.abs(w.startCol - start) < width);

  const targetCore = Math.ceil(numMotifs * 0.6);
  for (const cand of coreCandidates) {
    if (selected.length >= targetCore) break;
    if (!overlaps(cand.startCol)) selected.push(cand);
  }
  for (const cand of varCandidates) {
    if (selected.length >= numMotifs) break;
    if (!overlaps(cand.startCol)) selected.push(cand);
  }
  // Top up from remaining core if variable list was small
  for (const cand of coreCandidates) {
    if (selected.length >= numMotifs) break;
    if (!overlaps(cand.startCol)) selected.push(cand);
  }

  // Ungapped sequences for scanning (exact FIMO coordinates!)
  const ungapped = alignedRecords.map((r) => ({
    id: r.id,
    seq: r.sequence.replace(/-/g, ""),
  }));

  interface RawHit {
    motifId: string;
    altId: string;
    seqId: string;
    start: number;
    stop: number;
    score: number;
    pValue: number;
    matched: string;
  }

  const allHits: RawHit[] = [];

  selected.forEach((win, mIdx) => {
    const altId = `MEME-${mIdx + 1}`;

    // Build PWM from non-gapped rows covering >= 70% of this window
    const pwm: Float64Array[] = Array.from({ length: width }, () => new Float64Array(20));
    const consensusChars: string[] = [];

    // For clade-variable windows, seed PWM from the dominant cluster of rows present in the window
    const activeRows: string[] = [];
    for (const rec of alignedRecords) {
      const sub = rec.sequence.slice(win.startCol, win.startCol + width);
      const nonGap = sub.replace(/-/g, "").length;
      if (nonGap >= Math.ceil(width * 0.7)) {
        activeRows.push(sub);
      }
    }
    if (activeRows.length < 2) return;

    const pseudo = 0.5;
    let bgMean = 0;
    let bgVar = 0;

    for (let k = 0; k < width; k++) {
      const counts = new Float64Array(20);
      let total = 0;
      for (const row of activeRows) {
        const idx = AA_TO_IDX.get(row[k]);
        if (idx !== undefined) {
          counts[idx]++;
          total++;
        }
      }
      const denom = total + 20 * pseudo;
      let bestAa = 0;
      let bestC = -1;
      let colMean = 0;
      for (let a = 0; a < 20; a++) {
        if (counts[a] > bestC) {
          bestC = counts[a];
          bestAa = a;
        }
        const prob = (counts[a] + pseudo) / denom;
        const llr = Math.log2(prob / BG_PROB);
        pwm[k][a] = llr;
        colMean += llr * BG_PROB;
      }
      let colVar = 0;
      for (let a = 0; a < 20; a++) {
        const d = pwm[k][a] - colMean;
        colVar += d * d * BG_PROB;
      }
      bgMean += colMean;
      bgVar += colVar;
      consensusChars.push(STANDARD_AA[bestAa]);
    }

    const consensus = consensusChars.join("");
    const bgStd = Math.sqrt(Math.max(1e-6, bgVar));

    // Scan each ungapped sequence for the best PWM match
    for (const u of ungapped) {
      if (u.seq.length < width) continue;
      let bestScore = Number.NEGATIVE_INFINITY;
      let bestPos = 0;

      for (let pos = 0; pos <= u.seq.length - width; pos++) {
        let sc = 0;
        for (let k = 0; k < width; k++) {
          const idx = AA_TO_IDX.get(u.seq[pos + k]);
          sc += idx !== undefined ? pwm[k][idx] : -1;
        }
        if (sc > bestScore) {
          bestScore = sc;
          bestPos = pos;
        }
      }

      const z = (bestScore - bgMean) / bgStd;
      // Analytical normal-tail p-value scaled for PWM log-odds
      const pValue = normalUpperTail(z);
      if (pValue <= pThresh) {
        allHits.push({
          motifId: consensus,
          altId,
          seqId: u.id,
          start: bestPos + 1,
          stop: bestPos + width,
          score: Math.round(bestScore * 1000) / 1000,
          pValue,
          matched: u.seq.slice(bestPos, bestPos + width),
        });
      }
    }
  });

  // Benjamini-Hochberg q-values
  allHits.sort((a, b) => a.pValue - b.pValue);
  const totalTests = Math.max(1, allHits.length);
  const qValues = new Float64Array(allHits.length);
  let minQ = 1;
  for (let i = allHits.length - 1; i >= 0; i--) {
    const q = Math.min(1, (allHits[i].pValue * totalTests) / (i + 1));
    if (q < minQ) minQ = q;
    qValues[i] = minQ;
  }

  const lines = [header];
  allHits.forEach((h, i) => {
    lines.push(
      [
        h.motifId,
        h.altId,
        h.seqId,
        h.start,
        h.stop,
        "+",
        h.score.toFixed(3),
        h.pValue.toExponential(2),
        qValues[i].toExponential(2),
        h.matched,
      ].join("\t")
    );
  });

  return {
    fimoTsv: lines.join("\n") + "\n",
    motifsFound: selected.length,
    hitsReported: allHits.length,
  };
}
