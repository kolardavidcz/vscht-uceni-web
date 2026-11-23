import { describe, expect, it } from "vitest";
import {
  analyzeSequence,
  computeReverseComplement,
  findLongestOrf,
  SEQUENCE_PRESETS,
  translateRna,
} from "./sequenceAnalyzer";

describe("bioinformatics DNA/RNA sequenceAnalyzer", () => {
  it("computes exact GC%, nucleotide frequencies, RNA, and protein for the default script sequence", () => {
    const res = analyzeSequence(SEQUENCE_PRESETS[0].sequence);
    expect(res).not.toBeNull();
    expect(res!.length).toBe(44);
    expect(res!.counts).toEqual({ A: 11, T: 11, C: 11, G: 11, U: 0 });
    expect(res!.gcPercent).toBeCloseTo(50.0, 2);
    expect(res!.moleculeType).toBe("DNA");
    expect(res!.rna).toBe("AUGCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUC");
    expect(res!.frames[0]).toBe("MRSIDRSIDRSIDR");
    expect(res!.terminalOutput).toContain("Obsah GC:        50.00 %");
    expect(res!.terminalOutput).toContain("Délka sekvence: 44 bp");
  });

  it("strips FASTA headers, whitespace, and counts ignored characters", () => {
    const res = analyzeSequence(">seq_1 test\n atg cga 123\nTAA ");
    expect(res).not.toBeNull();
    expect(res!.header).toBe("seq_1 test");
    expect(res!.cleaned).toBe("ATGCGATAA");
    expect(res!.ignoredChars).toBe(3);
    expect(res!.frames[0]).toBe("MR*");
  });

  it("returns null on empty or non-nucleotide input", () => {
    expect(analyzeSequence("")).toBeNull();
    expect(analyzeSequence(">only_header\n   12345  ")).toBeNull();
  });

  it("computes reverse complement correctly for DNA and RNA", () => {
    expect(computeReverseComplement("ATGC", false)).toBe("GCAT");
    expect(computeReverseComplement("AUGC", true)).toBe("GCAU");
  });

  it("translates all 3 frames and discovers the longest ORF across frames", () => {
    expect(translateRna("CCAUGUUUUGGUGA", 2)).toBe("MFW*");
    const orf = findLongestOrf("CCAUGUUUUGGUGA");
    expect(orf).toEqual({
      frame: 3,
      startNt: 3,
      endNt: 14,
      protein: "MFW",
      lengthAa: 3,
    });
  });

  it("detects human insulin preset ORF cleanly", () => {
    const res = analyzeSequence(SEQUENCE_PRESETS[1].sequence);
    expect(res).not.toBeNull();
    expect(res!.longestOrf?.frame).toBe(1);
    expect(res!.longestOrf?.protein.startsWith("MALWMRLLPLLALLALW")).toBe(true);
  });
});
