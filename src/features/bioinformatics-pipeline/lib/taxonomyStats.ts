export type TaxRank = "kingdom" | "phylum" | "class" | "order" | "family" | "genus";

export interface TaxonomyRecord {
  accession: string;
  taxid: string;
  scientificName: string;
  superkingdom: string;
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  title: string;
}

export interface ChiSquareResult {
  chi2: number;
  df: number;
  pValue: number;
  cramersV: number;
  total: number;
}

export interface TaxonCrosstabRow {
  taxon: string;
  present: number;
  absent: number;
  total: number;
  presentPct: number;
  color: string;
}

export interface MotifTaxonomyAnalysis {
  motif: string;
  rank: TaxRank;
  rows: TaxonCrosstabRow[];
  stats: ChiSquareResult;
}

export const TAXONOMY_PALETTE = [
  "#ea580c", // orange-600 (brand)
  "#0f766e", // teal-700
  "#b45309", // amber-700
  "#2563eb", // blue-600
  "#be123c", // rose-700
  "#4d7c0f", // lime-700
  "#7c3aed", // violet-600
  "#0369a1", // sky-700
  "#9a3412", // orange-800
  "#475569", // slate-600
];

/** Parse GH48 `taxonomy.tsv` table. */
export function parseTaxonomyTsv(text: string): TaxonomyRecord[] {
  const records: TaxonomyRecord[] = [];
  let colsHeader: string[] | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (cols.length < 2) continue;

    if (!colsHeader && cols[0].toLowerCase() === "accession") {
      colsHeader = cols.map((c) => c.trim().toLowerCase());
      continue;
    }

    const get = (name: string, fallbackIdx: number) => {
      const i = colsHeader ? colsHeader.indexOf(name) : fallbackIdx;
      return i >= 0 ? (cols[i] ?? "").trim() : "";
    };

    const accession = get("accession", 0);
    if (!accession) continue;

    records.push({
      accession,
      taxid: get("taxid", 1),
      scientificName: get("scientific_name", 2),
      superkingdom: get("superkingdom", 3),
      kingdom: get("kingdom", 4),
      phylum: get("phylum", 5),
      class: get("class", 6),
      order: get("order", 7),
      family: get("family", 8),
      genus: get("genus", 9),
      species: get("species", 10),
      title: get("title", 11),
    });
  }

  return records;
}

/** Assign consistent deterministic hex colors to unique taxa at a chosen rank. */
export function buildTaxonColorMap(
  records: TaxonomyRecord[],
  rank: TaxRank
): Map<string, string> {
  const counts = new Map<string, number>();
  for (const r of records) {
    const label = r[rank] || "Nezařazeno";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const map = new Map<string, string>();
  sorted.forEach(([taxon], i) => {
    map.set(
      taxon,
      taxon === "Nezařazeno"
        ? "#64748b"
        : TAXONOMY_PALETTE[i % TAXONOMY_PALETTE.length]
    );
  });
  return map;
}

// Lanczos approximation for ln(Gamma(z))
function logGamma(z: number): number {
  const coeffs = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -0.000005395239384953,
  ];
  let x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < coeffs.length; j++) {
    y += 1;
    ser += coeffs[j] / y;
  }
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

/** Upper regularized incomplete gamma function Q(a, x) = P(Chi2_df >= 2x) for a = df/2. */
function regularizedGammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  if (a <= 0) return 0;

  const gln = logGamma(a);
  if (x < a + 1) {
    // Series representation for P(a, x), return 1 - P
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let n = 1; n <= 200; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-12) break;
    }
    const p = sum * Math.exp(-x + a * Math.log(x) - gln);
    return Math.max(0, Math.min(1, 1 - p));
  }

  // Lentz continued fraction for Q(a, x)
  const fpMin = 1e-300;
  let b = x + 1 - a;
  let c = 1 / fpMin;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= 200; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < fpMin) d = fpMin;
    c = b + an / c;
    if (Math.abs(c) < fpMin) c = fpMin;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return Math.max(0, Math.min(1, Math.exp(-x + a * Math.log(x) - gln) * h));
}

/**
 * Pearson chi-square test of independence on an R x C contingency table.
 * Returns chi2, degrees of freedom, exact asymptotic p-value, and Cramér's V effect size.
 */
export function computeChiSquare(table: number[][]): ChiSquareResult {
  const rowSums = table.map((row) => row.reduce((a, b) => a + b, 0));
  const numCols = table[0]?.length ?? 0;
  const colSums = Array.from({ length: numCols }, (_, c) =>
    table.reduce((acc, row) => acc + (row[c] ?? 0), 0)
  );
  const total = rowSums.reduce((a, b) => a + b, 0);

  // Filter out empty rows and columns
  const activeRows = rowSums.map((s, i) => (s > 0 ? i : -1)).filter((i) => i >= 0);
  const activeCols = colSums.map((s, j) => (s > 0 ? j : -1)).filter((j) => j >= 0);

  if (total === 0 || activeRows.length < 2 || activeCols.length < 2) {
    return { chi2: 0, df: 0, pValue: 1, cramersV: 0, total };
  }

  let chi2 = 0;
  for (const r of activeRows) {
    for (const c of activeCols) {
      const obs = table[r][c] ?? 0;
      const exp = (rowSums[r] * colSums[c]) / total;
      if (exp > 0) {
        chi2 += ((obs - exp) * (obs - exp)) / exp;
      }
    }
  }

  const df = (activeRows.length - 1) * (activeCols.length - 1);
  const pValue = regularizedGammaQ(df / 2, chi2 / 2);
  const minDim = Math.min(activeRows.length - 1, activeCols.length - 1);
  const cramersV = minDim > 0 ? Math.sqrt(chi2 / (total * minDim)) : 0;

  return {
    chi2: Math.round(chi2 * 1000) / 1000,
    df,
    pValue,
    cramersV: Math.round(cramersV * 1000) / 1000,
    total,
  };
}

/** Crosstabulate motif presence/absence against taxonomic rank and run chi-square test. */
export function analyzeMotifByTaxonomy(
  motif: string,
  presentSet: Set<string>,
  taxonomyRecords: TaxonomyRecord[],
  rank: TaxRank
): MotifTaxonomyAnalysis {
  const colorMap = buildTaxonColorMap(taxonomyRecords, rank);
  const buckets = new Map<string, { present: number; absent: number }>();

  for (const r of taxonomyRecords) {
    const label = r[rank] || "Nezařazeno";
    const entry = buckets.get(label) ?? { present: 0, absent: 0 };
    if (presentSet.has(r.accession)) entry.present++;
    else entry.absent++;
    buckets.set(label, entry);
  }

  const rows: TaxonCrosstabRow[] = [...buckets.entries()]
    .map(([taxon, counts]) => {
      const total = counts.present + counts.absent;
      return {
        taxon,
        present: counts.present,
        absent: counts.absent,
        total,
        presentPct: total > 0 ? Math.round((counts.present / total) * 1000) / 10 : 0,
        color: colorMap.get(taxon) ?? "#64748b",
      };
    })
    .sort((a, b) => b.total - a.total);

  const contingency = rows.map((r) => [r.present, r.absent]);
  const stats = computeChiSquare(contingency);

  return { motif, rank, rows, stats };
}

/** Generate iTOL `DATASET_COLORSTRIP` for a chosen taxonomic rank (matches `2_make_to_iTOL.py`). */
export function generateItolTaxonomyColorstrip(
  records: TaxonomyRecord[],
  rank: TaxRank
): string {
  const colorMap = buildTaxonColorMap(records, rank);
  const legendEntries = [...colorMap.entries()];

  const lines = [
    "DATASET_COLORSTRIP",
    "SEPARATOR TAB",
    `DATASET_LABEL\tTaxonomy_${rank}`,
    "COLOR\t#ea580c",
    `LEGEND_TITLE\tTaxonomy (${rank})`,
    `LEGEND_SHAPES\t${legendEntries.map(() => "1").join("\t")}`,
    `LEGEND_COLORS\t${legendEntries.map(([, c]) => c).join("\t")}`,
    `LEGEND_LABELS\t${legendEntries.map(([t]) => t).join("\t")}`,
    "STRIP_WIDTH\t25",
    "DATA",
  ];

  for (const r of records) {
    const label = r[rank] || "Nezařazeno";
    const color = colorMap.get(label) ?? "#64748b";
    lines.push(`${r.accession}\t${color}\t${label}`);
  }

  return lines.join("\n") + "\n";
}

/** Generate iTOL `LABELS` file replacing accession IDs with `Species (Accession)`. */
export function generateItolTaxonomyLabels(records: TaxonomyRecord[]): string {
  const lines = ["LABELS", "SEPARATOR TAB", "DATA"];
  for (const r of records) {
    const name = r.scientificName || r.species || r.accession;
    lines.push(`${r.accession}\t${name} (${r.accession})`);
  }
  return lines.join("\n") + "\n";
}
