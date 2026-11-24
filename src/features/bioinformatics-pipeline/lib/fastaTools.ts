export interface FastaRecord {
  id: string;
  header: string;
  description: string;
  organism: string;
  sequence: string;
  length: number;
}

export interface FastaFilterOptions {
  excludeTerms: string[];
  minLength?: number;
  maxLength?: number;
  deduplicateById?: boolean;
  deduplicateBySequence?: boolean;
  stripIdSuffix?: boolean;
}

export interface RemovedFastaEntry {
  record: FastaRecord;
  reason: string;
}

export interface LengthHistogramBin {
  from: number;
  to: number;
  label: string;
  kept: number;
  removed: number;
}

export interface FastaFilterResult {
  total: number;
  kept: FastaRecord[];
  removed: RemovedFastaEntry[];
  removedByReason: Record<string, number>;
  lengthStats: {
    min: number;
    median: number;
    mean: number;
    max: number;
  };
  histogram: LengthHistogramBin[];
  topOrganisms: { organism: string; count: number }[];
}

export const DEFAULT_EXCLUDE_TERMS = [
  "partial",
  "hypothetical protein",
  "uncharacterized protein",
  "unknown protein",
];

/** Extract organism name from NCBI `[Species name]` or UniProt `OS=... OX=` headers. */
export function extractOrganism(header: string): string {
  const bracketMatch = header.match(/\[([^\[\]]+)\]\s*$/);
  if (bracketMatch?.[1]) return bracketMatch[1].trim();

  const osMatch = header.match(/\bOS=([^=]+?)(?:\s+(?:OX|GN|PE|SV)=|$)/);
  if (osMatch?.[1]) return osMatch[1].trim();

  return "Neznámý organismus";
}

/** Parse standard single- or multi-line FASTA text into structured records. */
export function parseFasta(text: string): FastaRecord[] {
  const records: FastaRecord[] = [];
  let currentHeader: string | null = null;
  let seqParts: string[] = [];

  const flush = () => {
    if (currentHeader === null) return;
    const sequence = seqParts.join("").replace(/\s+/g, "").toUpperCase();
    if (!sequence) return;
    const trimmed = currentHeader.trim();
    const spaceIdx = trimmed.search(/\s/);
    const id = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
    const description = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1).trim();
    records.push({
      id,
      header: trimmed,
      description,
      organism: extractOrganism(trimmed),
      sequence,
      length: sequence.length,
    });
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith(">")) {
      flush();
      currentHeader = line.slice(1).trim();
      seqParts = [];
    } else if (currentHeader !== null) {
      seqParts.push(line);
    }
  }
  flush();
  return records;
}

/** Serialize FASTA records with fixed-width line wrapping (default 80 aa/line). */
export function serializeFasta(records: FastaRecord[], lineWidth = 80): string {
  const out: string[] = [];
  for (const r of records) {
    out.push(`>${r.header || r.id}`);
    if (lineWidth <= 0) {
      out.push(r.sequence);
    } else {
      for (let i = 0; i < r.sequence.length; i += lineWidth) {
        out.push(r.sequence.slice(i, i + lineWidth));
      }
    }
  }
  return out.join("\n") + (out.length > 0 ? "\n" : "");
}

function cleanRecordId(record: FastaRecord, stripSuffix: boolean): FastaRecord {
  if (!stripSuffix) return record;
  // Strip trailing _1 / _2 domain suffixes if requested
  const cleanedId = record.id.replace(/_\d+$/, "");
  if (cleanedId === record.id) return record;
  const header = record.description ? `${cleanedId} ${record.description}` : cleanedId;
  return { ...record, id: cleanedId, header };
}

/**
 * Filter FASTA sequences mirroring GH48 step 2 (`partial_filter_script.py`)
 * plus length bounds and duplicate removal.
 */
export function filterFasta(
  records: FastaRecord[],
  options: FastaFilterOptions
): FastaFilterResult {
  const terms = options.excludeTerms
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const minLen = options.minLength ?? 0;
  const maxLen = options.maxLength ?? Number.POSITIVE_INFINITY;
  const dedupId = options.deduplicateById ?? true;
  const dedupSeq = options.deduplicateBySequence ?? false;
  const stripSuffix = options.stripIdSuffix ?? false;

  const kept: FastaRecord[] = [];
  const removed: RemovedFastaEntry[] = [];
  const removedByReason: Record<string, number> = {};
  const seenIds = new Set<string>();
  const seenSeqs = new Set<string>();

  const recordRemoval = (rec: FastaRecord, reason: string) => {
    removed.push({ record: rec, reason });
    removedByReason[reason] = (removedByReason[reason] ?? 0) + 1;
  };

  for (const raw of records) {
    const rec = cleanRecordId(raw, stripSuffix);
    const headerLower = rec.header.toLowerCase();

    const matchedTerm = terms.find((term) => headerLower.includes(term));
    if (matchedTerm) {
      recordRemoval(rec, `klíčové slovo „${matchedTerm}“`);
      continue;
    }

    if (rec.length < minLen) {
      recordRemoval(rec, `kratší než ${minLen} aa`);
      continue;
    }

    if (rec.length > maxLen) {
      recordRemoval(rec, `delší než ${maxLen} aa`);
      continue;
    }

    if (dedupId && seenIds.has(rec.id)) {
      recordRemoval(rec, "duplicitní ID");
      continue;
    }

    if (dedupSeq && seenSeqs.has(rec.sequence)) {
      recordRemoval(rec, "100% identická sekvence");
      continue;
    }

    seenIds.add(rec.id);
    seenSeqs.add(rec.sequence);
    kept.push(rec);
  }

  // Length stats on kept sequences
  const lengths = kept.map((r) => r.length).sort((a, b) => a - b);
  const lengthStats =
    lengths.length === 0
      ? { min: 0, median: 0, mean: 0, max: 0 }
      : {
          min: lengths[0],
          max: lengths[lengths.length - 1],
          mean: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length),
          median:
            lengths.length % 2 === 1
              ? lengths[(lengths.length - 1) / 2]
              : Math.round(
                  (lengths[lengths.length / 2 - 1] + lengths[lengths.length / 2]) / 2
                ),
        };

  // Build 10-bin histogram across all input lengths
  const allLengths = records.map((r) => r.length);
  const histogram: LengthHistogramBin[] = [];
  if (allLengths.length > 0) {
    const lo = Math.min(...allLengths);
    const hi = Math.max(...allLengths);
    const binCount = Math.min(10, Math.max(4, Math.ceil(Math.sqrt(allLengths.length))));
    const span = Math.max(1, hi - lo + 1);
    const step = Math.max(1, Math.ceil(span / binCount));

    for (let i = 0; i < binCount; i++) {
      const from = lo + i * step;
      const to = i === binCount - 1 ? Math.max(hi, from + step - 1) : from + step - 1;
      histogram.push({
        from,
        to,
        label: `${from}–${to}`,
        kept: 0,
        removed: 0,
      });
    }

    const place = (len: number, isKept: boolean) => {
      const idx = Math.min(binCount - 1, Math.max(0, Math.floor((len - lo) / step)));
      if (isKept) histogram[idx].kept++;
      else histogram[idx].removed++;
    };
    for (const r of kept) place(r.length, true);
    for (const r of removed) place(r.record.length, false);
  }

  // Top organisms among kept records
  const orgCounts = new Map<string, number>();
  for (const r of kept) {
    orgCounts.set(r.organism, (orgCounts.get(r.organism) ?? 0) + 1);
  }
  const topOrganisms = [...orgCounts.entries()]
    .map(([organism, count]) => ({ organism, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    total: records.length,
    kept,
    removed,
    removedByReason,
    lengthStats,
    histogram,
    topOrganisms,
  };
}
