import { describe, expect, it } from "vitest";
import {
  DEFAULT_EXCLUDE_TERMS,
  filterFasta,
  parseFasta,
  serializeFasta,
} from "./fastaTools";
import { cutDomainsFromFasta, parseDomtblout } from "./hmmCutter";
import {
  computeFitchRetentionIndex,
  getLeaves,
  layoutPhylogram,
  parseNewick,
} from "./newickParser";
import {
  analyzeFimoMotifs,
  generateItolBinary,
  generateItolHeatmap,
  generateMotifStatsTsv,
  parseFimoTsv,
} from "./fimoAndItol";
import {
  generateCharacterizedSymbols,
  generateCharacterizedTreeColors,
  mapCharacterizedToTree,
  parseAdjacencyList,
} from "./characterizedMapper";
import {
  analyzeMotifByTaxonomy,
  computeChiSquare,
  generateItolTaxonomyColorstrip,
  generateItolTaxonomyLabels,
  parseTaxonomyTsv,
} from "./taxonomyStats";
import { clusterSequencesGreedy } from "./sequenceClustering";
import { buildCenterStarMsa, isAlignedFasta, trimAlignment } from "./msaAndTrimal";
import { buildNeighborJoiningTree } from "./njPhylogeny";
import { discoverAndScanMotifs } from "./motifDiscovery";
import { classifyUploadedFile } from "./fileRouter";
import { buildZipBytes } from "./zipExporter";
import { runFullPipeline } from "./fullPipelineRunner";
import {
  GH48_DEMO_ADJACENCY,
  GH48_DEMO_CHAR_FASTA,
  GH48_DEMO_DB_DOMAINS_FASTA,
  GH48_DEMO_FIMO,
  GH48_DEMO_HMM_REPORT,
  GH48_DEMO_NEWICK,
  GH48_DEMO_RAW_FASTA,
  GH48_DEMO_TAXONOMY,
} from "../data/gh48DemoData";

describe("fastaTools", () => {
  it("parses, filters partial/hypothetical records, and round-trips FASTA", () => {
    const records = parseFasta(GH48_DEMO_RAW_FASTA);
    expect(records.length).toBe(12);

    const res = filterFasta(records, {
      excludeTerms: DEFAULT_EXCLUDE_TERMS,
      minLength: 100,
      deduplicateById: true,
    });

    expect(res.kept.length).toBe(8);
    expect(res.removed.length).toBe(4);
    expect(res.lengthStats.min).toBeGreaterThan(500);
    expect(res.histogram.length).toBeGreaterThanOrEqual(4);
    expect(res.topOrganisms.length).toBeGreaterThan(0);

    const roundTrip = parseFasta(serializeFasta(res.kept, 60));
    expect(roundTrip.map((r) => r.id)).toEqual(res.kept.map((r) => r.id));
    expect(roundTrip.map((r) => r.sequence)).toEqual(res.kept.map((r) => r.sequence));
  });

  it("removes duplicate IDs and identical sequences when enabled", () => {
    const fasta = [
      ">SEQ1 enzyme [Bacillus sp.]",
      "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRV",
      ">SEQ1 duplicate id [Bacillus sp.]",
      "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRV",
      ">SEQ2 identical seq [Clostridium sp.]",
      "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRV",
    ].join("\n");
    const records = parseFasta(fasta);
    const res = filterFasta(records, {
      excludeTerms: [],
      deduplicateById: true,
      deduplicateBySequence: true,
    });
    expect(res.kept.map((r) => r.id)).toEqual(["SEQ1"]);
    expect(res.removed.length).toBe(2);
  });
});

describe("hmmCutter", () => {
  it("parses HMMER domtblout and crops GH48 catalytic domains with safe padding", () => {
    const fasta = filterFasta(parseFasta(GH48_DEMO_RAW_FASTA), {
      excludeTerms: DEFAULT_EXCLUDE_TERMS,
    }).kept;
    const hits = parseDomtblout(GH48_DEMO_HMM_REPORT);
    expect(hits.length).toBeGreaterThanOrEqual(8);

    const cut = cutDomainsFromFasta(fasta, hits, {
      coordMode: "env",
      dedupMode: "longest",
      padding: 10,
      maxIEvalue: 1e-5,
      minDomainLength: 100,
    });

    expect(cut.croppedRecords.length).toBe(8);
    for (const row of cut.rows) {
      expect(row.croppedLength).toBeGreaterThan(450);
      expect(row.croppedLength).toBe(row.end - row.start + 1);
      expect(row.croppedLength).toBeLessThanOrEqual(row.originalLength);
      expect(row.hmmCoveragePct).toBeGreaterThan(70);
    }
  });
});

describe("newickParser & Fitch parsimony", () => {
  it("computes RI = 1.0 for strictly monophyletic trait and RI = 0.0 for maximally dispersed trait", () => {
    const tree = parseNewick("(((A:0.1,B:0.1)95/98:0.1,(C:0.1,D:0.1)90/92:0.1)100/100:0.1,(E:0.1,F:0.1)88/90:0.1);");
    expect(tree).not.toBeNull();
    expect(getLeaves(tree!).map((l) => l.name)).toEqual(["A", "B", "C", "D", "E", "F"]);

    // Strictly monophyletic {A, B} -> 1 step, min=1, max=2 -> RI = 1.0
    const mono = computeFitchRetentionIndex(tree!, new Set(["A", "B"]));
    expect(mono.steps).toBe(1);
    expect(mono.retentionIndex).toBe(1);

    // Maximally homoplasious {A, C, E} -> 3 steps, min=1, max=3 -> RI = 0.0
    const homoplasy = computeFitchRetentionIndex(tree!, new Set(["A", "C", "E"]));
    expect(homoplasy.steps).toBe(3);
    expect(homoplasy.retentionIndex).toBe(0);
  });

  it("parses real GH48 IQ-TREE subtree with dual SH-aLRT/UFBoot supports and lays out SVG coordinates", () => {
    const root = parseNewick(GH48_DEMO_NEWICK);
    expect(root).not.toBeNull();
    const leaves = getLeaves(root!);
    expect(leaves.length).toBe(29);

    const layout = layoutPhylogram(root!, { plotWidth: 400, rowHeight: 22 });
    expect(layout.leafOrder.length).toBe(29);
    expect(layout.edges.length).toBeGreaterThan(28);
    expect(layout.nodes.some((n) => !n.isLeaf && n.node.ufboot !== null)).toBe(true);
  });
});

describe("fimoAndItol", () => {
  it("recovers GH48 core motifs and high-RI clade bifurcation (MEME-23) and exports valid iTOL datasets", () => {
    const root = parseNewick(GH48_DEMO_NEWICK);
    const hits = parseFimoTsv(GH48_DEMO_FIMO);
    expect(hits.length).toBeGreaterThan(200);

    const analysis = analyzeFimoMotifs(hits, {
      pValueCutoff: 1e-4,
      minVariance: 10,
      minBinaryCoverage: 0.1,
      maxBinaryCoverage: 0.98,
      treeRoot: root,
    });

    const meme1 = analysis.motifs.find((m) => m.motif === "MEME-1");
    const meme23 = analysis.motifs.find((m) => m.motif === "MEME-23");
    const meme25 = analysis.motifs.find((m) => m.motif === "MEME-25");

    expect(meme1).toBeDefined();
    expect(meme1!.coverage).toBeGreaterThanOrEqual(0.95);
    expect(meme1!.category).toBe("core");

    expect(meme23).toBeDefined();
    expect(meme23!.retentionIndex).not.toBeNull();
    expect(meme23!.retentionIndex!).toBeGreaterThanOrEqual(0.85);
    expect(meme23!.inBinary).toBe(true);

    expect(meme25).toBeDefined();
    expect(meme25!.inBinary).toBe(true);

    const heatmap = generateItolHeatmap(analysis, { onlyPassingVariance: true });
    expect(heatmap).toContain("DATASET_HEATMAP");
    expect(heatmap).toContain("AAB00822.1,");

    const binary = generateItolBinary(analysis, { onlyInformative: true });
    expect(binary).toContain("DATASET_BINARY");
    expect(binary).toContain("MEME-23");

    const statsTsv = generateMotifStatsTsv(analysis);
    expect(statsTsv.split("\n")[0]).toContain("retention_index");
  });
});

describe("characterizedMapper", () => {
  it("maps reviewed GH48 characterized enzymes onto tree leaves (direct & MMseqs2 proxy)", () => {
    const adj = parseAdjacencyList(GH48_DEMO_ADJACENCY);
    const chars = parseFasta(GH48_DEMO_CHAR_FASTA);
    const db = parseFasta(GH48_DEMO_DB_DOMAINS_FASTA);
    const root = parseNewick(GH48_DEMO_NEWICK)!;
    const treeLeaves = new Set(getLeaves(root).map((l) => l.name));

    const mapped = mapCharacterizedToTree(chars, db, treeLeaves, adj);
    expect(mapped.matches.length).toBe(chars.length);
    expect(mapped.directCount + mapped.proxyCount).toBeGreaterThanOrEqual(5);

    const colors = generateCharacterizedTreeColors(mapped);
    expect(colors).toContain("TREE_COLORS");
    const symbols = generateCharacterizedSymbols(mapped);
    expect(symbols).toContain("DATASET_SYMBOL");
  });
});

describe("taxonomyStats & chi-square", () => {
  it("matches exact chi-square critical value (df=1, chi2=3.8415 => p≈0.05)", () => {
    // 2x2 table with chi2 close to 3.8415
    const res = computeChiSquare([
      [20, 10],
      [10, 20],
    ]);
    expect(res.df).toBe(1);
    expect(res.chi2).toBeCloseTo(6.667, 2);
    expect(res.pValue).toBeCloseTo(0.00982, 3);
    expect(res.cramersV).toBeCloseTo(0.333, 2);
  });

  it("confirms highly significant MEME-23 vs phylum association in GH48 and generates iTOL colorstrips", () => {
    const tax = parseTaxonomyTsv(GH48_DEMO_TAXONOMY);
    expect(tax.length).toBe(29);

    const fimo = analyzeFimoMotifs(parseFimoTsv(GH48_DEMO_FIMO), {
      treeRoot: parseNewick(GH48_DEMO_NEWICK),
    });
    const m23Present = fimo.presentByMotif.get("MEME-23") ?? new Set<string>();
    const assoc = analyzeMotifByTaxonomy("MEME-23", m23Present, tax, "phylum");

    expect(assoc.stats.df).toBeGreaterThanOrEqual(4);
    expect(assoc.stats.pValue).toBeLessThan(0.001);
    expect(assoc.stats.cramersV).toBeGreaterThan(0.7);

    const strip = generateItolTaxonomyColorstrip(tax, "phylum");
    expect(strip).toContain("DATASET_COLORSTRIP");
    expect(strip).toContain("Actinomycetota");
    expect(strip).toContain("Arthropoda");

    const labels = generateItolTaxonomyLabels(tax);
    expect(labels).toContain("LABELS");
    expect(labels).toContain("Gastrophysa atrocyanea");
  });
});

describe("full end-to-end pipeline engines", () => {
  it("clusters near-identical protein sequences and separates divergent ones", () => {
    const base = "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQ";
    const nearIdent = base.slice(0, 10) + "V" + base.slice(11);
    const divergent = "WPYFHDQMLCKNGSVATIREWPYFHDQMLCKNGSVATIREWPYFHDQMLCKNGSVATIREWPYFHDQMLCKNGSVATIRE";
    const recs = parseFasta(
      `>S1\n${base}\n>S2\n${nearIdent}\n>S3\n${divergent}\n`
    );
    const cl = clusterSequencesGreedy(recs, { minSeqId: 0.9, minCoverage: 0.8 });
    expect(cl.clusterCount).toBe(2);
    expect(cl.adjacencyTsv).toContain("S1\tS2");
    expect(cl.adjacencyTsv).toContain("S3\tS3");
  });

  it("builds BLOSUM62 MSA, trims gappy columns, reconstructs NJ bootstrap tree, and discovers PWM motifs", () => {
    const core = "NGYFSPEGIPYHSVETLIVEAPDHGHETTSEAYSYWLWLEAMPAGTPTFYGMAYDEQPVYHDPPSNQWFGFQAWSMERVAEYY";
    const fasta = [
      `>A1 [Cellulomonas fimi]\n${core}PPGGCEAGPTATGPS`,
      `>A2 [Cellulomonas flavigena]\n${core.replace("YFS", "YFT")}PPGGCEAGPTATGPS`,
      `>B1 [Clostridium cellulovorans]\n${core.replace("EGIP", "DGVP").replace("QPVY", "EPVF")}AKSGDTAAKTTAKAL`,
      `>B2 [Clostridium acetobutylicum]\n${core.replace("EGIP", "DGIP").replace("QPVY", "EPVF")}AKSGDTAAKTTAKAL`,
    ].join("\n");
    const recs = parseFasta(fasta);
    const msa = buildCenterStarMsa(recs);
    expect(isAlignedFasta(msa.aligned) || msa.aligned.every((r) => r.length === msa.columns)).toBe(true);
    expect(msa.columns).toBeGreaterThanOrEqual(core.length);

    const tr = trimAlignment(msa.aligned, { maxGapFraction: 0.5 });
    expect(tr.trimmedColumns).toBeGreaterThan(50);

    const nj = buildNeighborJoiningTree(tr.trimmed, { bootstrapReplicates: 20, seed: 42 });
    const parsedTree = parseNewick(nj.newick);
    expect(parsedTree).not.toBeNull();
    expect(getLeaves(parsedTree!).length).toBe(4);

    const disc = discoverAndScanMotifs(msa.aligned, { numMotifs: 5, motifWidth: 12 });
    expect(disc.motifsFound).toBeGreaterThanOrEqual(3);
    const parsedHits = parseFimoTsv(disc.fimoTsv);
    expect(parsedHits.length).toBeGreaterThan(0);
  });

  it("auto-classifies every uploaded bioinformatics file format by content", () => {
    expect(classifyUploadedFile("a.fasta", GH48_DEMO_RAW_FASTA).kind).toBe("raw_fasta");
    expect(classifyUploadedFile("b.txt", GH48_DEMO_HMM_REPORT).kind).toBe("hmm_domtblout");
    expect(classifyUploadedFile("c.tab", GH48_DEMO_ADJACENCY).kind).toBe("adjacency_tsv");
    expect(classifyUploadedFile("d.treefile", GH48_DEMO_NEWICK).kind).toBe("newick");
    expect(classifyUploadedFile("e.tsv", GH48_DEMO_FIMO).kind).toBe("fimo_tsv");
    expect(classifyUploadedFile("f.tsv", GH48_DEMO_TAXONOMY).kind).toBe("taxonomy_tsv");
    expect(classifyUploadedFile("g.fasta", GH48_DEMO_CHAR_FASTA).kind).toBe("characterized_fasta");
    expect(
      classifyUploadedFile("h.fa", ">A\nMKT--AY\n>B\nMKTAAAY\n").kind
    ).toBe("aligned_fasta");
  });

  it("builds a valid PKZIP archive with local headers and EOCD signature", () => {
    const zip = buildZipBytes([
      { name: "01_test.txt", content: "hello GH48" },
      { name: "02_tree.nwk", content: "(A:0.1,B:0.2);" },
    ]);
    // Local file header signature PK\x03\x04
    expect(zip[0]).toBe(0x50);
    expect(zip[1]).toBe(0x4b);
    expect(zip[2]).toBe(0x03);
    expect(zip[3]).toBe(0x04);
    // EOCD signature PK\x05\x06 at len - 22
    const eocdPos = zip.length - 22;
    expect(zip[eocdPos]).toBe(0x50);
    expect(zip[eocdPos + 1]).toBe(0x4b);
    expect(zip[eocdPos + 2]).toBe(0x05);
    expect(zip[eocdPos + 3]).toBe(0x06);
  });

  it("runs full end-to-end pipeline from raw FASTA + HMMER alone to all outputs & ZIP report", async () => {
    const out = await runFullPipeline(
      {
        rawFasta: GH48_DEMO_RAW_FASTA,
        hmmReport: GH48_DEMO_HMM_REPORT,
      },
      { njBootstrapReplicates: 15, discoverMotifCount: 6 }
    );

    expect(out.resolvedTexts.newick).toContain(";");
    expect(parseNewick(out.resolvedTexts.newick)).not.toBeNull();
    expect(out.resolvedTexts.fimoTsv).toContain("MEME-1");
    expect(out.resolvedTexts.taxonomyTsv).toContain("accession");
    expect(out.artifacts.some((a) => a.name === "07_phylogeny.nwk")).toBe(true);
    expect(out.artifacts.some((a) => a.name === "11_itol_meme_heatmap.txt")).toBe(true);
    expect(out.artifacts.some((a) => a.name === "12_pipeline_report.md")).toBe(true);
    expect(out.stages.find((s) => s.id === "msa")?.origin).toBe("computed");
    expect(out.stages.find((s) => s.id === "tree")?.origin).toBe("computed");
  });
});
