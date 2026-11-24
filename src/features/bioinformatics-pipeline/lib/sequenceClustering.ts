import type { FastaRecord } from "./fastaTools";

export interface ClusteringOptions {
  /** Minimum sequence identity threshold in [0.4, 1.0] (GH48 default: 0.90). */
  minSeqId?: number;
  /** Minimum shorter/longer length coverage ratio in [0.3, 1.0] (GH48 default: 0.80). */
  minCoverage?: number;
}

export interface ClusteringResult {
  representatives: FastaRecord[];
  /** MMseqs2-compatible `representative_id\tmember_id` TSV. */
  adjacencyTsv: string;
  clusterMap: Map<string, string[]>;
  inputCount: number;
  clusterCount: number;
  compressionRatio: number;
}

function kmerSet(seq: string, k = 5): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i <= seq.length - k; i++) {
    s.add(seq.slice(i, i + k));
  }
  return s;
}

/**
 * Fast k-mer containment + diagonal-anchored identity estimate between two protein sequences.
 * For sequences above ~70% identity, diagonal offset alignment agrees closely with global identity.
 */
function estimatePairwiseIdentity(a: string, b: string): number {
  if (a === b) return 1;
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length <= b.length ? b : a;
  if (shorter.length === 0) return 0;

  // Find dominant diagonal offset via 5-mer seed hits
  const k = 5;
  const posMap = new Map<string, number[]>();
  for (let i = 0; i <= longer.length - k; i++) {
    const kmer = longer.slice(i, i + k);
    const arr = posMap.get(kmer);
    if (arr) {
      if (arr.length < 6) arr.push(i);
    } else {
      posMap.set(kmer, [i]);
    }
  }

  const offsetCounts = new Map<number, number>();
  for (let i = 0; i <= shorter.length - k; i++) {
    const hits = posMap.get(shorter.slice(i, i + k));
    if (!hits) continue;
    for (const j of hits) {
      const off = j - i;
      offsetCounts.set(off, (offsetCounts.get(off) ?? 0) + 1);
    }
  }

  if (offsetCounts.size === 0) return 0;

  // Test top 3 candidate offsets and pick best ungapped identity
  const topOffsets = [...offsetCounts.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, 3)
    .map(([off]) => off);

  let bestIdent = 0;
  for (const off of topOffsets) {
    let matches = 0;
    let compared = 0;
    for (let i = 0; i < shorter.length; i++) {
      const j = i + off;
      if (j >= 0 && j < longer.length) {
        compared++;
        if (shorter[i] === longer[j]) matches++;
      }
    }
    if (compared > 0) {
      const ident = matches / shorter.length;
      if (ident > bestIdent) bestIdent = ident;
    }
  }
  return bestIdent;
}

/**
 * Longest-first greedy protein clustering mirroring `mmseqs easy-cluster --min-seq-id 0.9 -c 0.8`.
 * Outputs representative FASTA records and MMseqs2-compatible `adjacency_list_int.tabular`.
 */
export function clusterSequencesGreedy(
  records: FastaRecord[],
  options: ClusteringOptions = {}
): ClusteringResult {
  const minSeqId = Math.max(0.4, Math.min(1, options.minSeqId ?? 0.9));
  const minCoverage = Math.max(0.3, Math.min(1, options.minCoverage ?? 0.8));

  // Sort longest first (CD-HIT / MMseqs2 greedy convention)
  const sorted = [...records].sort((a, b) => b.length - a.length || a.id.localeCompare(b.id));

  const reps: { rec: FastaRecord; kmers: Set<string>; members: string[] }[] = [];
  // Lower bound on 5-mer overlap to avoid unnecessary alignments
  const kmerPrefilter = Math.max(0.08, Math.pow(minSeqId, 5) * 0.45);

  for (const rec of sorted) {
    const kmers = kmerSet(rec.sequence, 5);
    let assignedRep: (typeof reps)[number] | null = null;

    for (const rep of reps) {
      const cov =
        Math.min(rec.length, rep.rec.length) / Math.max(1, Math.max(rec.length, rep.rec.length));
      if (cov < minCoverage) continue;

      // Fast k-mer containment prefilter
      let shared = 0;
      const [small, large] = kmers.size <= rep.kmers.size ? [kmers, rep.kmers] : [rep.kmers, kmers];
      for (const k of small) {
        if (large.has(k)) shared++;
      }
      const containment = small.size > 0 ? shared / small.size : 0;
      if (containment < kmerPrefilter) continue;

      const ident = estimatePairwiseIdentity(rec.sequence, rep.rec.sequence);
      if (ident >= minSeqId) {
        assignedRep = rep;
        break;
      }
    }

    if (assignedRep) {
      assignedRep.members.push(rec.id);
    } else {
      reps.push({ rec, kmers, members: [rec.id] });
    }
  }

  const clusterMap = new Map<string, string[]>();
  const adjLines: string[] = [];
  for (const r of reps) {
    clusterMap.set(r.rec.id, r.members);
    for (const memberId of r.members) {
      adjLines.push(`${r.rec.id}\t${memberId}`);
    }
  }

  const representatives = reps.map((r) => r.rec);
  const compressionRatio =
    representatives.length > 0
      ? Math.round((records.length / representatives.length) * 100) / 100
      : 1;

  return {
    representatives,
    adjacencyTsv: adjLines.join("\n") + (adjLines.length > 0 ? "\n" : ""),
    clusterMap,
    inputCount: records.length,
    clusterCount: representatives.length,
    compressionRatio,
  };
}
