import type { FastaRecord } from "./fastaTools";

export interface AdjacencySummary {
  memberToRep: Map<string, string>;
  repToMembers: Map<string, string[]>;
  totalMembers: number;
  totalClusters: number;
  largestClusters: { rep: string; size: number }[];
}

export type MappingStatus = "direct" | "proxy" | "unmatched";

export interface CharacterizedMatch {
  charId: string;
  charHeader: string;
  organism: string;
  length: number;
  status: MappingStatus;
  matchedDbId: string | null;
  treeLeafId: string | null;
  matchMethod: "id" | "exact" | "substring" | "kmer" | "none";
  similarityPct: number;
  clusterSize: number;
}

export interface CharacterizedMappingResult {
  matches: CharacterizedMatch[];
  directCount: number;
  proxyCount: number;
  unmatchedCount: number;
}

/**
 * Parse MMseqs2 `adjacency_list_int.tabular` (`representative_id\tmember_id`).
 */
export function parseAdjacencyList(text: string): AdjacencySummary {
  const memberToRep = new Map<string, string>();
  const repToMembers = new Map<string, string[]>();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(/\t|\s+/);
    if (parts.length < 2) continue;
    const rep = parts[0].trim();
    const member = parts[1].trim();
    if (!rep || !member) continue;

    memberToRep.set(member, rep);
    const list = repToMembers.get(rep);
    if (list) list.push(member);
    else repToMembers.set(rep, [member]);
  }

  const largestClusters = [...repToMembers.entries()]
    .map(([rep, members]) => ({ rep, size: members.length }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 12);

  return {
    memberToRep,
    repToMembers,
    totalMembers: memberToRep.size,
    totalClusters: repToMembers.size,
    largestClusters,
  };
}

function makeKmers(seq: string, k = 5): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i <= seq.length - k; i++) {
    out.add(seq.slice(i, i + k));
  }
  return out;
}

function kmerContainment(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let shared = 0;
  for (const k of small) {
    if (large.has(k)) shared++;
  }
  return shared / small.size;
}

/**
 * Map characterized reference enzymes (e.g. CAZy / UniProt reviewed FASTA)
 * onto IQ-TREE leaves directly or via MMseqs2 cluster representatives (`proxy`).
 * Mirrors GH48 `11_itol/characterized/nalezeni_v_db.py`.
 */
export function mapCharacterizedToTree(
  charRecords: FastaRecord[],
  dbRecords: FastaRecord[],
  treeLeaves: Set<string>,
  adjacency: AdjacencySummary,
  options: { minKmerSimilarity?: number } = {}
): CharacterizedMappingResult {
  const minKmer = options.minKmerSimilarity ?? 0.55;

  // Precompute 5-mers for DB records
  const dbIndex = dbRecords.map((rec) => ({
    rec,
    kmers: makeKmers(rec.sequence, 5),
  }));

  const matches: CharacterizedMatch[] = [];

  for (const ch of charRecords) {
    let matchedDbId: string | null = null;
    let matchMethod: CharacterizedMatch["matchMethod"] = "none";
    let similarityPct = 0;

    // 1. Direct ID lookup in tree or adjacency list
    if (treeLeaves.has(ch.id) || adjacency.memberToRep.has(ch.id)) {
      matchedDbId = ch.id;
      matchMethod = "id";
      similarityPct = 100;
    }

    // 2. Exact / substring sequence match against DB (e.g. cropped GH48 domain inside full-length UniProt entry)
    if (!matchedDbId) {
      for (const { rec } of dbIndex) {
        if (rec.sequence === ch.sequence) {
          matchedDbId = rec.id;
          matchMethod = "exact";
          similarityPct = 100;
          break;
        }
        if (
          rec.sequence.length >= 40 &&
          (ch.sequence.includes(rec.sequence) || rec.sequence.includes(ch.sequence))
        ) {
          matchedDbId = rec.id;
          matchMethod = "substring";
          similarityPct = 100;
          break;
        }
      }
    }

    // 3. Fast 5-mer containment fallback (tolerates minor strain mutations)
    if (!matchedDbId && ch.sequence.length >= 20 && dbIndex.length > 0) {
      const chKmers = makeKmers(ch.sequence, 5);
      let bestScore = 0;
      let bestId: string | null = null;
      for (const { rec, kmers } of dbIndex) {
        const sim = kmerContainment(chKmers, kmers);
        if (sim > bestScore) {
          bestScore = sim;
          bestId = rec.id;
        }
      }
      if (bestId && bestScore >= minKmer) {
        matchedDbId = bestId;
        matchMethod = "kmer";
        similarityPct = Math.round(bestScore * 1000) / 10;
      }
    }

    // Resolve onto tree leaf (direct vs MMseqs2 cluster proxy)
    let status: MappingStatus = "unmatched";
    let treeLeafId: string | null = null;
    let clusterSize = 0;

    if (matchedDbId) {
      if (treeLeaves.has(matchedDbId)) {
        status = "direct";
        treeLeafId = matchedDbId;
        clusterSize = adjacency.repToMembers.get(matchedDbId)?.length ?? 1;
      } else {
        const rep = adjacency.memberToRep.get(matchedDbId);
        if (rep && (treeLeaves.size === 0 || treeLeaves.has(rep))) {
          status = "proxy";
          treeLeafId = rep;
          clusterSize = adjacency.repToMembers.get(rep)?.length ?? 1;
        } else if (treeLeaves.size === 0) {
          status = "direct";
          treeLeafId = matchedDbId;
          clusterSize = 1;
        }
      }
    }

    matches.push({
      charId: ch.id,
      charHeader: ch.header,
      organism: ch.organism,
      length: ch.length,
      status,
      matchedDbId,
      treeLeafId,
      matchMethod,
      similarityPct,
      clusterSize,
    });
  }

  return {
    matches,
    directCount: matches.filter((m) => m.status === "direct").length,
    proxyCount: matches.filter((m) => m.status === "proxy").length,
    unmatchedCount: matches.filter((m) => m.status === "unmatched").length,
  };
}

/** Generate iTOL `TREE_COLORS` (red=#ff0000 direct, orange=#ff8c00 cluster proxy). */
export function generateCharacterizedTreeColors(result: CharacterizedMappingResult): string {
  const lines = [
    "TREE_COLORS",
    "SEPARATOR TAB",
    "DATA",
  ];
  const seen = new Set<string>();
  for (const m of result.matches) {
    if (!m.treeLeafId || m.status === "unmatched" || seen.has(m.treeLeafId)) continue;
    seen.add(m.treeLeafId);
    const color = m.status === "direct" ? "#ff0000" : "#ff8c00";
    lines.push(`${m.treeLeafId}\tlabel\t${color}\tbold\t1.1`);
  }
  return lines.join("\n") + "\n";
}

/** Generate iTOL `DATASET_SYMBOL` (star=3 for direct, circle=2 for cluster proxy). */
export function generateCharacterizedSymbols(result: CharacterizedMappingResult): string {
  const lines = [
    "DATASET_SYMBOL",
    "SEPARATOR COMMA",
    "DATASET_LABEL,Characterized_enzymes",
    "COLOR,#ea580c",
    "MAXIMUM_SIZE,10",
    "DATA",
  ];
  const seen = new Set<string>();
  for (const m of result.matches) {
    if (!m.treeLeafId || m.status === "unmatched" || seen.has(m.treeLeafId)) continue;
    seen.add(m.treeLeafId);
    const shape = m.status === "direct" ? 3 : 2;
    const color = m.status === "direct" ? "#dc2626" : "#f97316";
    const label = m.charId.replace(/,/g, " ");
    lines.push(`${m.treeLeafId},${shape},8,${color},1,1,${label}`);
  }
  return lines.join("\n") + "\n";
}

/** Generate TSV table of characterized enzyme mappings. */
export function generateCharacterizedMappingTsv(result: CharacterizedMappingResult): string {
  const header = [
    "char_id",
    "organism",
    "status",
    "matched_db_id",
    "tree_leaf_id",
    "match_method",
    "similarity_pct",
    "cluster_size",
  ].join("\t");
  const rows = result.matches.map((m) =>
    [
      m.charId,
      m.organism,
      m.status,
      m.matchedDbId ?? "NA",
      m.treeLeafId ?? "NA",
      m.matchMethod,
      m.similarityPct.toFixed(1),
      m.clusterSize,
    ].join("\t")
  );
  return [header, ...rows].join("\n") + "\n";
}
