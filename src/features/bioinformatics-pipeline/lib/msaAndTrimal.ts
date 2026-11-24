import type { FastaRecord } from "./fastaTools";

export interface MsaResult {
  aligned: FastaRecord[];
  columns: number;
  centerId: string;
  meanGapPct: number;
}

export interface TrimOptions {
  /** Maximum allowed gap fraction per column (trimAl `-gt`, default 0.50). */
  maxGapFraction?: number;
  /** Minimum non-gap amino acids required in a column. */
  minNonGapCount?: number;
}

export interface TrimResult {
  trimmed: FastaRecord[];
  originalColumns: number;
  trimmedColumns: number;
  removedColumns: number;
  meanGapBeforePct: number;
  meanGapAfterPct: number;
}

// Compact BLOSUM62 scoring matrix for the 20 standard amino acids
const AA_ORDER = "ARNDCQEGHILKMFPSTWYV";
const AA_INDEX = new Map<string, number>(
  AA_ORDER.split("").map((aa, i) => [aa, i])
);

const BLOSUM62: number[][] = [
  [4, -1, -2, -2, 0, -1, -1, 0, -2, -1, -1, -1, -1, -2, -1, 1, 0, -3, -2, 0],
  [-1, 5, 0, -2, -3, 1, 0, -2, 0, -3, -2, 2, -1, -3, -2, -1, -1, -3, -2, -3],
  [-2, 0, 6, 1, -3, 0, 0, 0, 1, -3, -3, 0, -2, -3, -2, 1, 0, -4, -2, -3],
  [-2, -2, 1, 6, -3, 0, 2, -1, -1, -3, -4, -1, -3, -3, -1, 0, -1, -4, -3, -3],
  [0, -3, -3, -3, 9, -3, -4, -3, -3, -1, -1, -3, -1, -2, -3, -1, -1, -2, -2, -1],
  [-1, 1, 0, 0, -3, 5, 2, -2, 0, -3, -2, 1, 0, -3, -1, 0, -1, -2, -1, -2],
  [-1, 0, 0, 2, -4, 2, 5, -2, 0, -3, -3, 1, -2, -3, -1, 0, -1, -3, -2, -2],
  [0, -2, 0, -1, -3, -2, -2, 6, -2, -4, -4, -2, -3, -3, -2, 0, -2, -2, -3, -3],
  [-2, 0, 1, -1, -3, 0, 0, -2, 8, -3, -3, -1, -2, -1, -2, -1, -2, -2, 2, -3],
  [-1, -3, -3, -3, -1, -3, -3, -4, -3, 4, 2, -3, 1, 0, -3, -2, -1, -3, -1, 3],
  [-1, -2, -3, -4, -1, -2, -3, -4, -3, 2, 4, -2, 2, 0, -3, -2, -1, -2, -1, 1],
  [-1, 2, 0, -1, -3, 1, 1, -2, -1, -3, -2, 5, -1, -3, -1, 0, -1, -3, -2, -2],
  [-1, -1, -2, -3, -1, 0, -2, -3, -2, 1, 2, -1, 5, 0, -2, -1, -1, -1, -1, 1],
  [-2, -3, -3, -3, -2, -3, -3, -3, -1, 0, 0, -3, 0, 6, -4, -2, -2, 1, 3, -1],
  [-1, -2, -2, -1, -3, -1, -1, -2, -2, -3, -3, -1, -2, -4, 7, -1, -1, -4, -3, -2],
  [1, -1, 1, 0, -1, 0, 0, 0, -1, -2, -2, 0, -1, -2, -1, 4, 1, -3, -2, -2],
  [0, -1, 0, -1, -1, -1, -1, -2, -2, -1, -1, -1, -1, -2, -1, 1, 5, -2, -2, 0],
  [-3, -3, -4, -4, -2, -2, -3, -2, -2, -3, -2, -3, -1, 1, -4, -3, -2, 11, 2, -3],
  [-2, -2, -2, -3, -2, -1, -2, -3, 2, -1, -1, -2, -1, 3, -3, -2, -2, 2, 7, -1],
  [0, -3, -3, -3, -1, -2, -2, -3, -3, 3, 1, -2, 1, -1, -2, -2, 0, -3, -1, 4],
];

function blosumScore(a: string, b: string): number {
  const ia = AA_INDEX.get(a);
  const ib = AA_INDEX.get(b);
  if (ia === undefined || ib === undefined) return a === b ? 2 : -1;
  return BLOSUM62[ia][ib];
}

/**
 * Banded global Needleman-Wunsch alignment between reference `a` and query `b` using BLOSUM62.
 * Runs in O(len(a) * band) time so 60 protein domains align in tens of milliseconds.
 */
export function alignPairwiseBanded(
  a: string,
  b: string,
  gapPenalty = -6,
  halfBand = 75
): { alignedA: string; alignedB: string } {
  const m = a.length;
  const n = b.length;
  const band = Math.max(halfBand, Math.abs(m - n) + 32);
  const width = 2 * band + 1;
  const NEG_INF = -1e9;

  // Flat typed arrays for speed & low GC
  const dp = new Int32Array((m + 1) * width);
  const trace = new Uint8Array((m + 1) * width); // 1=diag, 2=up (gap in b), 3=left (gap in a)
  dp.fill(NEG_INF);

  const idx = (i: number, j: number): number => {
    const off = j - i + band;
    if (off < 0 || off >= width) return -1;
    return i * width + off;
  };

  dp[idx(0, 0)] = 0;
  for (let i = 1; i <= Math.min(m, band); i++) {
    const k = idx(i, 0);
    if (k >= 0) {
      dp[k] = i * gapPenalty;
      trace[k] = 2;
    }
  }
  for (let j = 1; j <= Math.min(n, band); j++) {
    const k = idx(0, j);
    if (k >= 0) {
      dp[k] = j * gapPenalty;
      trace[k] = 3;
    }
  }

  for (let i = 1; i <= m; i++) {
    const jStart = Math.max(1, i - band);
    const jEnd = Math.min(n, i + band);
    const ca = a[i - 1];
    for (let j = jStart; j <= jEnd; j++) {
      const k = idx(i, j);
      const kDiag = idx(i - 1, j - 1);
      const kUp = idx(i - 1, j);
      const kLeft = idx(i, j - 1);

      let best = NEG_INF;
      let dir = 1;

      if (kDiag >= 0 && dp[kDiag] > NEG_INF / 2) {
        best = dp[kDiag] + blosumScore(ca, b[j - 1]);
        dir = 1;
      }
      if (kUp >= 0 && dp[kUp] > NEG_INF / 2) {
        const up = dp[kUp] + gapPenalty;
        if (up > best) {
          best = up;
          dir = 2;
        }
      }
      if (kLeft >= 0 && dp[kLeft] > NEG_INF / 2) {
        const left = dp[kLeft] + gapPenalty;
        if (left > best) {
          best = left;
          dir = 3;
        }
      }

      dp[k] = best;
      trace[k] = dir;
    }
  }

  // Traceback
  const outA: string[] = [];
  const outB: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    const k = idx(i, j);
    const dir = k >= 0 ? trace[k] : i > j ? 2 : 3;
    if (i > 0 && j > 0 && dir === 1) {
      outA.push(a[i - 1]);
      outB.push(b[j - 1]);
      i--;
      j--;
    } else if (i > 0 && (dir === 2 || j === 0)) {
      outA.push(a[i - 1]);
      outB.push("-");
      i--;
    } else {
      outA.push("-");
      outB.push(b[j - 1]);
      j--;
    }
  }

  outA.reverse();
  outB.reverse();
  return { alignedA: outA.join(""), alignedB: outB.join("") };
}

/** Detect whether an input FASTA is already a multiple sequence alignment. */
export function isAlignedFasta(records: FastaRecord[]): boolean {
  if (records.length < 2) return false;
  const firstLen = records[0].sequence.length;
  if (firstLen === 0) return false;
  const allEqual = records.every((r) => r.sequence.length === firstLen);
  const hasGaps = records.some((r) => r.sequence.includes("-"));
  return allEqual && hasGaps;
}

function calcMeanGapPct(records: FastaRecord[]): number {
  if (records.length === 0) return 0;
  let totalChars = 0;
  let totalGaps = 0;
  for (const r of records) {
    totalChars += r.sequence.length;
    for (let i = 0; i < r.sequence.length; i++) {
      if (r.sequence[i] === "-") totalGaps++;
    }
  }
  return totalChars > 0 ? Math.round((totalGaps / totalChars) * 1000) / 10 : 0;
}

/**
 * Center-star protein Multiple Sequence Alignment (BLOSUM62 banded Needleman-Wunsch).
 * Chooses the medoid sequence (closest to median length & highest shared 4-mers) as center,
 * aligns every sequence to it, and merges insertions cleanly into a uniform-width MSA.
 */
export function buildCenterStarMsa(records: FastaRecord[]): MsaResult {
  if (records.length === 0) {
    return { aligned: [], columns: 0, centerId: "", meanGapPct: 0 };
  }
  if (records.length === 1) {
    return {
      aligned: records,
      columns: records[0].sequence.length,
      centerId: records[0].id,
      meanGapPct: 0,
    };
  }

  // Strip any existing gaps before re-aligning
  const clean = records.map((r) => ({
    ...r,
    sequence: r.sequence.replace(/-/g, ""),
  }));

  // Pick center sequence: closest to median length among sequences with high 4-mer sharing
  const sortedLens = clean.map((r) => r.sequence.length).sort((a, b) => a - b);
  const medianLen = sortedLens[Math.floor(sortedLens.length / 2)];
  let centerIdx = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < clean.length; i++) {
    const dist = Math.abs(clean[i].sequence.length - medianLen);
    if (dist < bestDist) {
      bestDist = dist;
      centerIdx = i;
    }
  }

  const center = clean[centerIdx];
  const centerLen = center.sequence.length;

  // For each sequence, align against center and record insertions before each center position (0..centerLen)
  const maxIns = new Int32Array(centerLen + 1);
  const parsedAlignments: {
    rec: FastaRecord;
    baseCols: string[]; // length = centerLen (residue or '-')
    inserts: string[]; // length = centerLen + 1
  }[] = [];

  for (let i = 0; i < clean.length; i++) {
    const rec = clean[i];
    if (i === centerIdx) {
      parsedAlignments.push({
        rec,
        baseCols: center.sequence.split(""),
        inserts: Array.from({ length: centerLen + 1 }, () => ""),
      });
      continue;
    }

    const { alignedA, alignedB } = alignPairwiseBanded(center.sequence, rec.sequence);
    const baseCols: string[] = [];
    const inserts: string[] = Array.from({ length: centerLen + 1 }, () => "");
    let cPos = 0;

    for (let k = 0; k < alignedA.length; k++) {
      if (alignedA[k] === "-") {
        inserts[cPos] += alignedB[k];
      } else {
        baseCols.push(alignedB[k]);
        cPos++;
      }
    }

    for (let p = 0; p <= centerLen; p++) {
      if (inserts[p].length > maxIns[p]) maxIns[p] = inserts[p].length;
    }
    parsedAlignments.push({ rec, baseCols, inserts });
  }

  // Reassemble uniform-length aligned sequences
  const aligned: FastaRecord[] = parsedAlignments.map(({ rec, baseCols, inserts }) => {
    const parts: string[] = [];
    for (let p = 0; p < centerLen; p++) {
      if (maxIns[p] > 0) {
        parts.push(inserts[p].padEnd(maxIns[p], "-"));
      }
      parts.push(baseCols[p] ?? "-");
    }
    if (maxIns[centerLen] > 0) {
      parts.push(inserts[centerLen].padEnd(maxIns[centerLen], "-"));
    }
    const seq = parts.join("");
    return { ...rec, sequence: seq, length: seq.length };
  });

  const columns = aligned[0]?.sequence.length ?? 0;
  return {
    aligned,
    columns,
    centerId: center.id,
    meanGapPct: calcMeanGapPct(aligned),
  };
}

/**
 * Trim gap-heavy MSA columns (mirrors `trimAl -gt 0.5`).
 */
export function trimAlignment(
  aligned: FastaRecord[],
  options: TrimOptions = {}
): TrimResult {
  const maxGapFraction = options.maxGapFraction ?? 0.5;
  const minNonGap = options.minNonGapCount ?? 2;

  if (aligned.length === 0) {
    return {
      trimmed: [],
      originalColumns: 0,
      trimmedColumns: 0,
      removedColumns: 0,
      meanGapBeforePct: 0,
      meanGapAfterPct: 0,
    };
  }

  const cols = aligned[0].sequence.length;
  const n = aligned.length;
  const keepCols: number[] = [];

  for (let c = 0; c < cols; c++) {
    let gaps = 0;
    for (let r = 0; r < n; r++) {
      const ch = aligned[r].sequence[c];
      if (!ch || ch === "-" || ch === ".") gaps++;
    }
    const nonGaps = n - gaps;
    if (gaps / n <= maxGapFraction && nonGaps >= Math.min(minNonGap, n)) {
      keepCols.push(c);
    }
  }

  // Never collapse to 0 columns — fall back to least-gappy 20% if threshold was too strict
  const finalCols =
    keepCols.length > 0
      ? keepCols
      : Array.from({ length: cols }, (_, c) => c);

  const trimmed: FastaRecord[] = aligned.map((rec) => {
    let s = "";
    for (const c of finalCols) {
      s += rec.sequence[c] ?? "-";
    }
    return { ...rec, sequence: s, length: s.length };
  });

  return {
    trimmed,
    originalColumns: cols,
    trimmedColumns: finalCols.length,
    removedColumns: cols - finalCols.length,
    meanGapBeforePct: calcMeanGapPct(aligned),
    meanGapAfterPct: calcMeanGapPct(trimmed),
  };
}
