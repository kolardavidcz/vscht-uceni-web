import { parseFasta } from "./fastaTools";
import { isAlignedFasta } from "./msaAndTrimal";

export type DetectedFileKind =
  | "raw_fasta"
  | "aligned_fasta"
  | "characterized_fasta"
  | "db_domains_fasta"
  | "hmm_domtblout"
  | "adjacency_tsv"
  | "newick"
  | "fimo_tsv"
  | "taxonomy_tsv"
  | "unknown";

export interface RoutedFile {
  filename: string;
  kind: DetectedFileKind;
  label: string;
  content: string;
  summary: string;
}

export const FILE_KIND_LABELS: Record<DetectedFileKind, string> = {
  raw_fasta: "Hrubá FASTA (krok 1–2)",
  aligned_fasta: "MSA zarovnání (krok 5–6)",
  characterized_fasta: "Charakterizované enzymy (krok 11)",
  db_domains_fasta: "Oříznuté domény DB (krok 3–4)",
  hmm_domtblout: "HMMER --domtblout (krok 3)",
  adjacency_tsv: "MMseqs2 adjacency_list (krok 4)",
  newick: "Fylogenetický strom Newick/NHX (krok 7)",
  fimo_tsv: "FIMO motivy fimo.tsv (krok 10)",
  taxonomy_tsv: "NCBI taxonomie taxonomy.tsv (krok 11)",
  unknown: "Nerozpoznaný soubor",
};

/**
 * Automatically classify any uploaded bioinformatics file by inspecting its content
 * (and filename hints for disambiguating FASTA roles).
 */
export function classifyUploadedFile(filename: string, content: string): RoutedFile {
  const lowerName = filename.toLowerCase();
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const firstNonComment = lines.find((l) => !l.startsWith("#")) ?? "";

  const make = (kind: DetectedFileKind, summary: string): RoutedFile => ({
    filename,
    kind,
    label: FILE_KIND_LABELS[kind],
    content,
    summary,
  });

  if (!trimmed) return make("unknown", "Prázdný soubor");

  // 1. HMMER --domtblout
  if (
    lines.some((l) => l.includes("env coord") && l.includes("target name")) ||
    (firstNonComment.split(/\s+/).length >= 22 &&
      !firstNonComment.startsWith(">") &&
      /^\d+$/.test(firstNonComment.split(/\s+/)[19] ?? "") &&
      /^\d+$/.test(firstNonComment.split(/\s+/)[20] ?? ""))
  ) {
    const hitCount = lines.filter((l) => !l.startsWith("#") && l.split(/\s+/).length >= 22).length;
    return make("hmm_domtblout", `${hitCount} doménových hitů`);
  }

  // 2. FIMO TSV
  const firstCols = firstNonComment.split("\t").map((c) => c.trim().toLowerCase());
  if (
    (firstCols.includes("motif_id") && firstCols.includes("sequence_name")) ||
    (firstCols.length >= 8 &&
      firstCols[5] !== undefined &&
      (firstCols[5] === "+" || firstCols[5] === "-") &&
      Number.isFinite(Number.parseFloat(firstCols[7])))
  ) {
    const rows = Math.max(0, lines.filter((l) => !l.startsWith("#")).length - (firstCols.includes("motif_id") ? 1 : 0));
    return make("fimo_tsv", `${rows} FIMO hitů`);
  }

  // 3. Taxonomy TSV
  if (
    firstCols.includes("accession") &&
    (firstCols.includes("phylum") ||
      firstCols.includes("scientific_name") ||
      firstCols.includes("taxid"))
  ) {
    const rows = Math.max(0, lines.filter((l) => !l.startsWith("#")).length - 1);
    return make("taxonomy_tsv", `${rows} taxonomických záznamů`);
  }

  // 4. FASTA (disambiguate aligned vs characterized vs db_domains vs raw)
  if (trimmed.startsWith(">") || lines.some((l) => l.startsWith(">"))) {
    const recs = parseFasta(content);
    if (recs.length > 0) {
      if (
        isAlignedFasta(recs) ||
        lowerName.includes("align") ||
        lowerName.includes("mafft") ||
        lowerName.includes("trimal") ||
        lowerName.includes("msa")
      ) {
        if (isAlignedFasta(recs)) {
          return make("aligned_fasta", `${recs.length} zarovnaných sekvencí × ${recs[0].length} sloupců`);
        }
      }

      const uniprotRatio =
        recs.filter((r) => /^(sp|tr)\|/.test(r.id)).length / recs.length;
      if (
        lowerName.includes("char") ||
        lowerName.includes("cazy") ||
        lowerName.includes("uniprot") ||
        lowerName.includes("reviewed") ||
        uniprotRatio >= 0.5
      ) {
        return make("characterized_fasta", `${recs.length} charakterizovaných sekvencí`);
      }

      if (lowerName.includes("domain") || lowerName.includes("crop")) {
        return make("db_domains_fasta", `${recs.length} doménových sekvencí`);
      }

      return make("raw_fasta", `${recs.length} proteinových sekvencí`);
    }
  }

  // 5. Newick / NHX tree
  if (
    (trimmed.startsWith("(") && trimmed.includes(")") && trimmed.endsWith(";")) ||
    lowerName.endsWith(".nwk") ||
    lowerName.endsWith(".nhx") ||
    lowerName.endsWith(".treefile") ||
    lowerName.endsWith(".tre")
  ) {
    const leafApprox = (trimmed.match(/,/g)?.length ?? 0) + 1;
    return make("newick", `strom (~${leafApprox} listů)`);
  }

  // 6. MMseqs2 adjacency list (2 columns: rep \t member)
  const nonComment = lines.filter((l) => !l.startsWith("#"));
  const twoColRatio =
    nonComment.length > 0
      ? nonComment.filter((l) => l.split(/\t|\s+/).length === 2).length / nonComment.length
      : 0;
  if (twoColRatio >= 0.85 || lowerName.includes("adjacency") || lowerName.includes("cluster")) {
    return make("adjacency_tsv", `${nonComment.length} vazeb reprezentant → člen`);
  }

  return make("unknown", `${lines.length} řádků`);
}
