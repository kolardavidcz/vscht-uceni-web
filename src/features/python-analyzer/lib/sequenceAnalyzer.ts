/**
 * Pure TypeScript bioinformatics DNA/RNA sequence analyzer.
 * Matches analyze_sequence.py output exactly while adding reverse complement,
 * Tm estimation, 3-frame translation, and ORF discovery.
 */

export type Nucleotide = "A" | "T" | "C" | "G" | "U";

export type OrfResult = {
  frame: 1 | 2 | 3;
  startNt: number; // 1-based nucleotide index
  endNt: number;
  protein: string;
  lengthAa: number;
};

export type SequenceAnalysis = {
  header?: string;
  cleaned: string;
  ignoredChars: number;
  moleculeType: "DNA" | "RNA" | "mixed";
  length: number;
  counts: Record<Nucleotide, number>;
  gcPercent: number;
  meltingTempC: number | null;
  reverseComplement: string;
  rna: string;
  frames: [string, string, string];
  longestOrf: OrfResult | null;
  terminalOutput: string;
};

export const CODON_TABLE: Record<string, string> = {
  AUG: "M", UUU: "F", UUC: "F", UUA: "L", UUG: "L",
  UCU: "S", UCC: "S", UCA: "S", UCG: "S",
  UAU: "Y", UAC: "Y", UAA: "*", UAG: "*",
  UGU: "C", UGC: "C", UGA: "*", UGG: "W",
  CUU: "L", CUC: "L", CUA: "L", CUG: "L",
  CCU: "P", CCC: "P", CCA: "P", CCG: "P",
  CAU: "H", CAC: "H", CAA: "Q", CAG: "Q",
  CGU: "R", CGC: "R", CGA: "R", CGG: "R",
  AUU: "I", AUC: "I", AUA: "I",
  ACU: "T", ACC: "T", ACA: "T", ACG: "T",
  AAU: "N", AAC: "N", AAA: "K", AAG: "K",
  AGU: "S", AGC: "S", AGA: "R", AGG: "R",
  GUU: "V", GUC: "V", GUA: "V", GUG: "V",
  GCU: "A", GCC: "A", GCA: "A", GCG: "A",
  GAU: "D", GAC: "D", GAA: "E", GAG: "E",
  GGU: "G", GGC: "G", GGA: "G", GGG: "G",
};

export type SequencePreset = {
  id: string;
  label: string;
  description: string;
  sequence: string;
};

export const SEQUENCE_PRESETS: SequencePreset[] = [
  {
    id: "default",
    label: "Výchozí demo (44 bp)",
    description: "Stejná sekvence jako v analyze_sequence.py",
    sequence: "ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC",
  },
  {
    id: "insulin",
    label: "Lidský inzulin (INS)",
    description: "Začátek kódující oblasti (signální peptid + B-řetězec)",
    sequence:
      ">Homo_sapiens_INS_partial\nATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGTAG",
  },
  {
    id: "gfp",
    label: "GFP (Aequorea victoria)",
    description: "N-terminální fragment zeleného fluorescenčního proteinu",
    sequence:
      ">Aequorea_victoria_GFP_fragment\nATGAGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCACTTAA",
  },
  {
    id: "mrna",
    label: "Ukázka mRNA",
    description: "Krátký RNA transkript s kodonem AUG a stop kodonem UGA",
    sequence:
      ">Sample_mRNA\nGCAUGGAAUUCCCUUGGCACUACGACUUCGGUAAACGUGACUAAGCU",
  },
];

export function translateRna(rna: string, offset = 0): string {
  const aa: string[] = [];
  for (let i = offset; i + 2 < rna.length; i += 3) {
    const codon = rna.slice(i, i + 3);
    aa.push(CODON_TABLE[codon] ?? "?");
  }
  return aa.join("");
}

export function computeReverseComplement(seq: string, isRna: boolean): string {
  const map: Record<string, string> = isRna
    ? { A: "U", U: "A", T: "A", C: "G", G: "C" }
    : { A: "T", T: "A", U: "A", C: "G", G: "C" };
  let out = "";
  for (let i = seq.length - 1; i >= 0; i--) {
    out += map[seq[i]] ?? seq[i];
  }
  return out;
}

export function findLongestOrf(rna: string): OrfResult | null {
  let best: OrfResult | null = null;

  for (let frameIdx = 0; frameIdx < 3; frameIdx++) {
    const protein = translateRna(rna, frameIdx);
    let i = 0;
    while (i < protein.length) {
      if (protein[i] === "M") {
        let end = i + 1;
        while (end < protein.length && protein[end] !== "*") {
          end++;
        }
        const orfProt = protein.slice(i, end);
        const hasStop = end < protein.length && protein[end] === "*";
        const ntEnd = frameIdx + (hasStop ? end + 1 : end) * 3;
        if (!best || orfProt.length > best.lengthAa) {
          best = {
            frame: (frameIdx + 1) as 1 | 2 | 3,
            startNt: frameIdx + i * 3 + 1,
            endNt: ntEnd,
            protein: orfProt,
            lengthAa: orfProt.length,
          };
        }
        i = end + 1;
      } else {
        i++;
      }
    }
  }

  return best;
}

/**
 * Estimates DNA oligo melting temperature (°C).
 * Uses Wallace rule for short oligos (<14 nt) and Marmur-Doty formula for longer sequences.
 */
export function estimateMeltingTemp(
  counts: Record<Nucleotide, number>,
  length: number
): number | null {
  if (length === 0) return null;
  const gc = counts.G + counts.C;
  const at = counts.A + counts.T + counts.U;
  if (length < 14) {
    return 2 * at + 4 * gc;
  }
  return Math.round((64.9 + (41 * (gc - 16.4)) / length) * 10) / 10;
}

export function analyzeSequence(rawInput: string): SequenceAnalysis | null {
  const lines = rawInput.split(/\r?\n/);
  let header: string | undefined;
  const bodyLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(">")) {
      if (!header) header = trimmed.slice(1).trim();
      continue;
    }
    bodyLines.push(trimmed);
  }

  const joined = bodyLines.join("").toUpperCase();
  const nonWhitespace = joined.replace(/\s+/g, "");
  let cleaned = "";
  let ignoredChars = 0;

  for (const ch of nonWhitespace) {
    if (ch === "A" || ch === "T" || ch === "C" || ch === "G" || ch === "U") {
      cleaned += ch;
    } else {
      ignoredChars++;
    }
  }

  const length = cleaned.length;
  if (length === 0) return null;

  const counts: Record<Nucleotide, number> = { A: 0, T: 0, C: 0, G: 0, U: 0 };
  for (const ch of cleaned) {
    counts[ch as Nucleotide]++;
  }

  const moleculeType: SequenceAnalysis["moleculeType"] =
    counts.U > 0 && counts.T === 0
      ? "RNA"
      : counts.U > 0 && counts.T > 0
        ? "mixed"
        : "DNA";

  const gcPercent = ((counts.G + counts.C) / length) * 100;
  const meltingTempC = estimateMeltingTemp(counts, length);
  const rna = cleaned.replace(/T/g, "U");
  const reverseComplement = computeReverseComplement(
    cleaned,
    moleculeType === "RNA"
  );
  const frames: [string, string, string] = [
    translateRna(rna, 0),
    translateRna(rna, 1),
    translateRna(rna, 2),
  ];
  const longestOrf = findLongestOrf(rna);

  // Format stdout matching analyze_sequence.py
  const outLines: string[] = [
    "> python analyze_sequence.py",
    "========================================",
    " VÝSLEDKY BIOINFORMATICKÉ ANALÝZY",
    "========================================",
    `Délka sekvence: ${length} bp`,
    `Obsah GC:        ${gcPercent.toFixed(2)} %`,
    "----------------------------------------",
    "Frekvence nukleotidu:",
  ];

  for (const n of ["A", "T", "C", "G", "U"] as Nucleotide[]) {
    const count = counts[n];
    if (count > 0 || n !== "U") {
      const pct = (count / length) * 100;
      outLines.push(
        `  ${n}: ${String(count).padStart(5, " ")} (${pct.toFixed(2).padStart(6, " ")} %)`
      );
    }
  }

  outLines.push(
    "----------------------------------------",
    "RNA transkript (prvních 60 bp):",
    `  ${rna.slice(0, 60)}`,
    "Proteinový preklad (prvních 20 AA):",
    `  ${frames[0].slice(0, 20)}`,
    "========================================"
  );

  return {
    header,
    cleaned,
    ignoredChars,
    moleculeType,
    length,
    counts,
    gcPercent,
    meltingTempC,
    reverseComplement,
    rna,
    frames,
    longestOrf,
    terminalOutput: outLines.join("\n"),
  };
}
