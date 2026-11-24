import type { FastaRecord } from "./fastaTools";

export interface HmmDomainHit {
  targetName: string;
  targetLen: number;
  queryName: string;
  queryAccession: string;
  queryLen: number;
  fullEvalue: number;
  fullScore: number;
  domainIndex: number;
  domainTotal: number;
  cEvalue: number;
  iEvalue: number;
  domainScore: number;
  hmmFrom: number;
  hmmTo: number;
  aliFrom: number;
  aliTo: number;
  envFrom: number;
  envTo: number;
  accuracy: number;
  description: string;
}

export interface HmmCutOptions {
  coordMode?: "env" | "ali";
  dedupMode?: "longest" | "best-evalue" | "all";
  padding?: number;
  maxIEvalue?: number;
  minDomainLength?: number;
}

export interface HmmCutRow {
  id: string;
  targetName: string;
  queryName: string;
  originalLength: number;
  start: number; // 1-based inclusive
  end: number; // 1-based inclusive
  croppedLength: number;
  hmmCoveragePct: number;
  iEvalue: number;
  domainScore: number;
  organism: string;
}

export interface HmmCutResult {
  croppedRecords: FastaRecord[];
  rows: HmmCutRow[];
  totalHitsParsed: number;
  hitsPassingFilter: number;
  missingInFasta: string[];
  unmatchedFastaIds: string[];
}

/**
 * Parse HMMER3 `--domtblout` whitespace-delimited table.
 * Matches column indices used in GH48 `03_hmmsearch_cutting/hmm_to_fasta_script.py`:
 * target_name=0, tlen=2, query=3, qacc=4, qlen=5, E-val=6, score=7,
 * #=9, of=10, c-Evalue=11, i-Evalue=12, domScore=13,
 * hmm_from=15, hmm_to=16, ali_from=17, ali_to=18, env_from=19, env_to=20, acc=21.
 */
export function parseDomtblout(text: string): HmmDomainHit[] {
  const hits: HmmDomainHit[] = [];

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const parts = line.split(/\s+/);
    if (parts.length < 22) continue;

    const targetLen = Number.parseInt(parts[2], 10);
    const queryLen = Number.parseInt(parts[5], 10);
    const hmmFrom = Number.parseInt(parts[15], 10);
    const hmmTo = Number.parseInt(parts[16], 10);
    const aliFrom = Number.parseInt(parts[17], 10);
    const aliTo = Number.parseInt(parts[18], 10);
    const envFrom = Number.parseInt(parts[19], 10);
    const envTo = Number.parseInt(parts[20], 10);

    if (
      !Number.isFinite(envFrom) ||
      !Number.isFinite(envTo) ||
      !Number.isFinite(aliFrom) ||
      !Number.isFinite(aliTo)
    ) {
      continue;
    }

    hits.push({
      targetName: parts[0],
      targetLen: Number.isFinite(targetLen) ? targetLen : 0,
      queryName: parts[3],
      queryAccession: parts[4],
      queryLen: Number.isFinite(queryLen) ? queryLen : 0,
      fullEvalue: Number.parseFloat(parts[6]),
      fullScore: Number.parseFloat(parts[7]),
      domainIndex: Number.parseInt(parts[9], 10) || 1,
      domainTotal: Number.parseInt(parts[10], 10) || 1,
      cEvalue: Number.parseFloat(parts[11]),
      iEvalue: Number.parseFloat(parts[12]),
      domainScore: Number.parseFloat(parts[13]),
      hmmFrom,
      hmmTo,
      aliFrom,
      aliTo,
      envFrom,
      envTo,
      accuracy: Number.parseFloat(parts[21]),
      description: parts.slice(22).join(" "),
    });
  }

  return hits;
}

/**
 * Crop protein FASTA sequences to HMMER domain coordinates.
 * Mirrors `hmm_to_fasta_script.py` (longest domain per sequence, env coords, ±padding)
 * with optional E-value/length filtering and alternative deduplication strategies.
 */
export function cutDomainsFromFasta(
  records: FastaRecord[],
  hits: HmmDomainHit[],
  options: HmmCutOptions = {}
): HmmCutResult {
  const coordMode = options.coordMode ?? "env";
  const dedupMode = options.dedupMode ?? "longest";
  const padding = Math.max(0, Math.floor(options.padding ?? 0));
  const maxIEvalue = options.maxIEvalue ?? 1e-5;
  const minDomainLength = Math.max(1, Math.floor(options.minDomainLength ?? 50));

  const fastaById = new Map<string, FastaRecord>();
  for (const r of records) {
    fastaById.set(r.id, r);
  }

  const passingHits = hits.filter((h) => {
    const from = coordMode === "env" ? h.envFrom : h.aliFrom;
    const to = coordMode === "env" ? h.envTo : h.aliTo;
    const len = to - from + 1;
    const eOk = !Number.isFinite(h.iEvalue) || h.iEvalue <= maxIEvalue;
    return eOk && len >= minDomainLength;
  });

  // Group hits by targetName
  const grouped = new Map<string, HmmDomainHit[]>();
  for (const h of passingHits) {
    const list = grouped.get(h.targetName);
    if (list) list.push(h);
    else grouped.set(h.targetName, [h]);
  }

  const selectedHits: HmmDomainHit[] = [];
  for (const [, list] of grouped) {
    if (dedupMode === "all") {
      selectedHits.push(...list);
    } else if (dedupMode === "best-evalue") {
      const best = [...list].sort(
        (a, b) => a.iEvalue - b.iEvalue || b.domainScore - a.domainScore
      )[0];
      selectedHits.push(best);
    } else {
      // GH48 default: longest domain per sequence
      const longest = [...list].sort((a, b) => {
        const lenA = (coordMode === "env" ? a.envTo - a.envFrom : a.aliTo - a.aliFrom);
        const lenB = (coordMode === "env" ? b.envTo - b.envFrom : b.aliTo - b.aliFrom);
        return lenB - lenA || a.iEvalue - b.iEvalue;
      })[0];
      selectedHits.push(longest);
    }
  }

  const croppedRecords: FastaRecord[] = [];
  const rows: HmmCutRow[] = [];
  const missingInFasta: string[] = [];
  const matchedFastaIds = new Set<string>();
  const idCounter = new Map<string, number>();

  for (const hit of selectedHits) {
    const rec = fastaById.get(hit.targetName);
    if (!rec) {
      if (!missingInFasta.includes(hit.targetName)) {
        missingInFasta.push(hit.targetName);
      }
      continue;
    }
    matchedFastaIds.add(rec.id);

    const rawFrom = coordMode === "env" ? hit.envFrom : hit.aliFrom;
    const rawTo = coordMode === "env" ? hit.envTo : hit.aliTo;

    // 0-based start/end with safe bounds clamping
    const start0 = Math.max(0, rawFrom - 1 - padding);
    const end0 = Math.min(rec.sequence.length, rawTo + padding);
    const croppedSeq = rec.sequence.slice(start0, end0);
    if (!croppedSeq) continue;

    const count = (idCounter.get(hit.targetName) ?? 0) + 1;
    idCounter.set(hit.targetName, count);
    const outId =
      dedupMode === "all" && (grouped.get(hit.targetName)?.length ?? 0) > 1
        ? `${hit.targetName}_dom${count}`
        : hit.targetName;

    const hmmCovPct =
      hit.queryLen > 0
        ? Math.min(100, Math.round(((hit.hmmTo - hit.hmmFrom + 1) / hit.queryLen) * 1000) / 10)
        : 0;

    const outHeader = rec.description
      ? `${outId} [domain=${start0 + 1}..${end0}] ${rec.description}`
      : `${outId} [domain=${start0 + 1}..${end0}]`;

    croppedRecords.push({
      id: outId,
      header: outHeader,
      description: rec.description,
      organism: rec.organism,
      sequence: croppedSeq,
      length: croppedSeq.length,
    });

    rows.push({
      id: outId,
      targetName: hit.targetName,
      queryName: hit.queryName,
      originalLength: rec.length,
      start: start0 + 1,
      end: end0,
      croppedLength: croppedSeq.length,
      hmmCoveragePct: hmmCovPct,
      iEvalue: hit.iEvalue,
      domainScore: hit.domainScore,
      organism: rec.organism,
    });
  }

  const unmatchedFastaIds = records
    .filter((r) => !matchedFastaIds.has(r.id))
    .map((r) => r.id);

  return {
    croppedRecords,
    rows,
    totalHitsParsed: hits.length,
    hitsPassingFilter: passingHits.length,
    missingInFasta,
    unmatchedFastaIds,
  };
}
