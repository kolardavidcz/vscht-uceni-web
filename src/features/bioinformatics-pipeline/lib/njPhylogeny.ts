import type { FastaRecord } from "./fastaTools";

interface NjNode {
  name: string;
  branchLength: number;
  support: number | null;
  children: NjNode[];
  leafSet: string[];
}

export interface PhylogenyBuildOptions {
  /** Number of nonparametric bootstrap replicates (default 40). */
  bootstrapReplicates?: number;
  /** Deterministic PRNG seed for reproducible trees. */
  seed?: number;
}

export interface PhylogenyBuildResult {
  newick: string;
  taxonCount: number;
  sitesUsed: number;
  bootstrapReplicates: number;
  meanDistance: number;
}

/** Kimura protein evolutionary distance from aligned sequences (over specified column indices). */
function computeDistanceMatrix(
  seqs: string[],
  colIndices: number[]
): Float64Array[] {
  const n = seqs.length;
  const dist: Float64Array[] = Array.from({ length: n }, () => new Float64Array(n));
  const m = colIndices.length;

  for (let i = 0; i < n; i++) {
    const si = seqs[i];
    for (let j = i + 1; j < n; j++) {
      const sj = seqs[j];
      let valid = 0;
      let diff = 0;
      for (let k = 0; k < m; k++) {
        const col = colIndices[k];
        const a = si[col];
        const b = sj[col];
        if (!a || !b || a === "-" || b === "-" || a === "X" || b === "X") continue;
        valid++;
        if (a !== b) diff++;
      }

      let d = 0;
      if (valid === 0) {
        d = 2.0;
      } else {
        const p = diff / valid;
        if (p === 0) {
          d = 0;
        } else {
          // Kimura 1983 protein distance: d = -ln(1 - p - 0.2 p^2)
          const inner = 1 - p - 0.2 * p * p;
          d = inner > 0.03 ? -Math.log(inner) : 3.5;
        }
      }

      dist[i][j] = d;
      dist[j][i] = d;
    }
  }
  return dist;
}

/** Exact Saitou-Nei Neighbor-Joining tree construction from a distance matrix. */
function runNeighborJoining(names: string[], distInput: Float64Array[]): NjNode {
  const n0 = names.length;
  if (n0 === 1) {
    return {
      name: names[0],
      branchLength: 0,
      support: null,
      children: [],
      leafSet: [names[0]],
    };
  }
  if (n0 === 2) {
    const half = Math.max(0.001, distInput[0][1] / 2);
    return {
      name: "",
      branchLength: 0,
      support: null,
      children: [
        { name: names[0], branchLength: half, support: null, children: [], leafSet: [names[0]] },
        { name: names[1], branchLength: half, support: null, children: [], leafSet: [names[1]] },
      ],
      leafSet: [names[0], names[1]],
    };
  }

  let nodes: NjNode[] = names.map((name) => ({
    name,
    branchLength: 0,
    support: null,
    children: [],
    leafSet: [name],
  }));
  let dist = distInput.map((row) => Float64Array.from(row));

  while (nodes.length > 2) {
    const n = nodes.length;
    const rowSum = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += dist[i][j];
      rowSum[i] = s;
    }

    // Find pair (bestI, bestJ) minimizing Q(i, j) = (n - 2) * d(i, j) - r_i - r_j
    let bestI = 0;
    let bestJ = 1;
    let bestQ = Number.POSITIVE_INFINITY;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const q = (n - 2) * dist[i][j] - rowSum[i] - rowSum[j];
        if (q < bestQ) {
          bestQ = q;
          bestI = i;
          bestJ = j;
        }
      }
    }

    const dij = dist[bestI][bestJ];
    const delta = (rowSum[bestI] - rowSum[bestJ]) / (n - 2);
    const limbI = Math.max(0.0005, 0.5 * (dij + delta));
    const limbJ = Math.max(0.0005, 0.5 * (dij - delta));

    const nodeI = { ...nodes[bestI], branchLength: limbI };
    const nodeJ = { ...nodes[bestJ], branchLength: limbJ };
    const merged: NjNode = {
      name: "",
      branchLength: 0,
      support: null,
      children: [nodeI, nodeJ],
      leafSet: [...nodeI.leafSet, ...nodeJ.leafSet],
    };

    // Build reduced distance matrix (n - 1) x (n - 1)
    const remaining: number[] = [];
    for (let k = 0; k < n; k++) {
      if (k !== bestI && k !== bestJ) remaining.push(k);
    }

    const nextN = remaining.length + 1;
    const nextDist: Float64Array[] = Array.from(
      { length: nextN },
      () => new Float64Array(nextN)
    );

    for (let a = 0; a < remaining.length; a++) {
      const oldA = remaining[a];
      for (let b = a + 1; b < remaining.length; b++) {
        const oldB = remaining[b];
        nextDist[a][b] = dist[oldA][oldB];
        nextDist[b][a] = dist[oldB][oldA];
      }
      const dNew = Math.max(0, 0.5 * (dist[bestI][oldA] + dist[bestJ][oldA] - dij));
      nextDist[a][nextN - 1] = dNew;
      nextDist[nextN - 1][a] = dNew;
    }

    nodes = [...remaining.map((k) => nodes[k]), merged];
    dist = nextDist;
  }

  const finalLen = Math.max(0.001, dist[0][1] / 2);
  return {
    name: "",
    branchLength: 0,
    support: null,
    children: [
      { ...nodes[0], branchLength: finalLen },
      { ...nodes[1], branchLength: finalLen },
    ],
    leafSet: [...nodes[0].leafSet, ...nodes[1].leafSet],
  };
}

/** Canonical bipartition key (unrooted split invariant) for bootstrap matching. */
function splitKey(subset: string[], allSorted: string[]): string {
  if (subset.length <= 1 || subset.length >= allSorted.length - 1) return "";
  const subSet = new Set(subset);
  const comp = allSorted.filter((x) => !subSet.has(x));
  const a = [...subset].sort().join("\0");
  const b = comp.join("\0");
  return a < b ? a : b;
}

function collectSplits(node: NjNode, allSorted: string[], out: Set<string>) {
  if (node.children.length === 0) return;
  const k = splitKey(node.leafSet, allSorted);
  if (k) out.add(k);
  for (const c of node.children) collectSplits(c, allSorted, out);
}

// Fast Mulberry32 deterministic PRNG for reproducible bootstrap draws
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function serializeNjNewick(node: NjNode, isRoot = true): string {
  const safeName = (s: string) =>
    /[,():;\s]/.test(s) ? `'${s.replace(/'/g, "''")}'` : s;

  if (node.children.length === 0) {
    return `${safeName(node.name)}:${node.branchLength.toFixed(5)}`;
  }
  const inner = node.children.map((c) => serializeNjNewick(c, false)).join(",");
  if (isRoot) return `(${inner});`;
  const sup = node.support !== null ? `${Math.round(node.support)}` : "";
  return `(${inner})${sup}:${node.branchLength.toFixed(5)}`;
}

/**
 * Reconstruct a Neighbor-Joining phylogenetic tree with Kimura protein distances
 * and nonparametric column bootstrap supports directly in the browser.
 */
export function buildNeighborJoiningTree(
  alignedRecords: FastaRecord[],
  options: PhylogenyBuildOptions = {}
): PhylogenyBuildResult {
  const n = alignedRecords.length;
  if (n === 0) {
    return {
      newick: "",
      taxonCount: 0,
      sitesUsed: 0,
      bootstrapReplicates: 0,
      meanDistance: 0,
    };
  }

  const names = alignedRecords.map((r) => r.id);
  const seqs = alignedRecords.map((r) => r.sequence);
  const sites = seqs[0]?.length ?? 0;
  const allCols = Array.from({ length: sites }, (_, i) => i);

  const dist = computeDistanceMatrix(seqs, allCols);
  let sumDist = 0;
  let pairs = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      sumDist += dist[i][j];
      pairs++;
    }
  }
  const meanDistance = pairs > 0 ? Math.round((sumDist / pairs) * 10000) / 10000 : 0;

  const refTree = runNeighborJoining(names, dist);

  // Nonparametric bootstrap replicates (only meaningful for >= 4 taxa and >= 5 sites)
  const replicates =
    n >= 4 && sites >= 5
      ? Math.max(0, Math.min(200, options.bootstrapReplicates ?? 40))
      : 0;

  if (replicates > 0) {
    const allSorted = [...names].sort();
    const splitCounts = new Map<string, number>();
    const rand = mulberry32(options.seed ?? 482026);

    for (let r = 0; r < replicates; r++) {
      const sampleCols = new Array<number>(sites);
      for (let c = 0; c < sites; c++) {
        sampleCols[c] = Math.floor(rand() * sites);
      }
      const bDist = computeDistanceMatrix(seqs, sampleCols);
      const bTree = runNeighborJoining(names, bDist);
      const bSplits = new Set<string>();
      collectSplits(bTree, allSorted, bSplits);
      for (const s of bSplits) {
        splitCounts.set(s, (splitCounts.get(s) ?? 0) + 1);
      }
    }

    const annotateSupport = (node: NjNode) => {
      if (node.children.length === 0) return;
      const k = splitKey(node.leafSet, allSorted);
      if (k) {
        node.support = Math.round(((splitCounts.get(k) ?? 0) / replicates) * 100);
      }
      for (const c of node.children) annotateSupport(c);
    };
    annotateSupport(refTree);
  }

  return {
    newick: serializeNjNewick(refTree, true),
    taxonCount: n,
    sitesUsed: sites,
    bootstrapReplicates: replicates,
    meanDistance,
  };
}
