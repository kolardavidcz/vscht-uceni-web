import {
  DEFAULT_EXCLUDE_TERMS,
  filterFasta,
  parseFasta,
  serializeFasta,
  type FastaRecord,
} from "./fastaTools";
import { cutDomainsFromFasta, parseDomtblout } from "./hmmCutter";
import { clusterSequencesGreedy } from "./sequenceClustering";
import { buildCenterStarMsa, isAlignedFasta, trimAlignment } from "./msaAndTrimal";
import { buildNeighborJoiningTree } from "./njPhylogeny";
import { getLeaves, parseNewick } from "./newickParser";
import { discoverAndScanMotifs } from "./motifDiscovery";
import {
  analyzeFimoMotifs,
  generateItolBinary,
  generateItolHeatmap,
  generateMotifStatsTsv,
  parseFimoTsv,
} from "./fimoAndItol";
import {
  generateCharacterizedMappingTsv,
  generateCharacterizedSymbols,
  generateCharacterizedTreeColors,
  mapCharacterizedToTree,
  parseAdjacencyList,
} from "./characterizedMapper";
import {
  analyzeMotifByTaxonomy,
  generateItolTaxonomyColorstrip,
  generateItolTaxonomyLabels,
  parseTaxonomyTsv,
  type TaxRank,
  type TaxonomyRecord,
} from "./taxonomyStats";
import type { ZipEntry } from "./zipExporter";

export interface FullPipelineInputs {
  rawFasta?: string;
  hmmReport?: string;
  adjacencyTsv?: string;
  alignedFasta?: string;
  newick?: string;
  fimoTsv?: string;
  taxonomyTsv?: string;
  characterizedFasta?: string;
  dbDomainsFasta?: string;
}

export interface FullPipelineConfig {
  excludeTerms?: string[];
  minLength?: number;
  maxLength?: number;
  hmmCoordMode?: "env" | "ali";
  hmmPadding?: number;
  clusterMinSeqId?: number;
  clusterMinCoverage?: number;
  trimalMaxGap?: number;
  njBootstrapReplicates?: number;
  discoverMotifCount?: number;
  discoverMotifWidth?: number;
  fimoPValue?: number;
  taxRank?: TaxRank;
  /** Safety cap on sequences entering in-browser O(N^2) MSA/NJ so browser stays fast. */
  maxBrowserAlignSeqs?: number;
}

export type StageOrigin = "uploaded" | "computed" | "skipped";

export interface StageOutcome {
  step: number;
  id: string;
  title: string;
  origin: StageOrigin;
  detail: string;
  externalTool?: { label: string; url: string };
  outputFile?: { name: string; content: string };
}

export interface PipelineProgress {
  percent: number;
  stageLabel: string;
}

export interface FullPipelineOutput {
  stages: StageOutcome[];
  /** Synced texts to push back into every tab of BioinformaticsPipelinePage! */
  resolvedTexts: {
    rawFasta: string;
    filteredFasta: string;
    croppedFasta: string;
    repsFasta: string;
    adjacencyTsv: string;
    alignedFasta: string;
    trimmedFasta: string;
    newick: string;
    fimoTsv: string;
    taxonomyTsv: string;
    dbDomainsFasta: string;
  };
  /** All downloadable files bundled into the one-click ZIP export. */
  artifacts: ZipEntry[];
  reportMarkdown: string;
  durationMs: number;
}

const yieldFrame = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** Synthesize a clean `taxonomy.tsv` directly from FASTA `[Genus species]` organism headers when NCBI taxonomy.tsv wasn't uploaded. */
function synthesizeTaxonomyFromFasta(records: FastaRecord[]): string {
  const header =
    "accession\ttaxid\tscientific_name\tsuperkingdom\tkingdom\tphylum\tclass\torder\tfamily\tgenus\tspecies\ttitle";
  const rows = records.map((r) => {
    const org = r.organism && r.organism !== "Neznámý organismus" ? r.organism : "";
    const parts = org.split(/\s+/).filter(Boolean);
    const genus = parts[0] ?? "";
    const species = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : org;
    return [
      r.id,
      "",
      org || r.id,
      "",
      "",
      genus || "Nezařazeno", // Populate phylum fallback with genus so rank switcher stays informative
      "",
      "",
      "",
      genus,
      species,
      r.description,
    ].join("\t");
  });
  return [header, ...rows].join("\n") + "\n";
}

/**
 * Execute the complete end-to-end GH48 bioinformatics pipeline (Steps 2–11):
 * Uses any user-uploaded intermediate files (HMMER, MMseqs2, MAFFT, IQ-TREE, FIMO, Taxonomy)
 * and automatically computes every missing stage locally in TypeScript, yielding all
 * iTOL datasets, alignments, trees, tables, and a Markdown summary report.
 */
export async function runFullPipeline(
  inputs: FullPipelineInputs,
  config: FullPipelineConfig = {},
  onProgress?: (p: PipelineProgress) => void
): Promise<FullPipelineOutput> {
  const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  const stages: StageOutcome[] = [];
  const artifacts: ZipEntry[] = [];

  const report = async (percent: number, stageLabel: string) => {
    onProgress?.({ percent, stageLabel });
    await yieldFrame();
  };

  // --- Stage 2: FASTA filter ---
  await report(8, "Krok 2/11 · Filtrace vstupních FASTA sekvencí…");
  const rawFastaText = (inputs.rawFasta ?? "").trim();
  const rawRecords = rawFastaText ? parseFasta(rawFastaText) : [];
  let filteredRecords: FastaRecord[] = [];
  let filteredFastaText = "";

  if (rawRecords.length > 0) {
    const fRes = filterFasta(rawRecords, {
      excludeTerms: config.excludeTerms ?? DEFAULT_EXCLUDE_TERMS,
      minLength: config.minLength ?? 100,
      maxLength: config.maxLength ?? 4000,
      deduplicateById: true,
    });
    filteredRecords = fRes.kept;
    filteredFastaText = serializeFasta(filteredRecords);
    artifacts.push({ name: "02_filtered_sequences.fasta", content: filteredFastaText });
    stages.push({
      step: 2,
      id: "fasta",
      title: "FASTA filtr (partial / hypothetical)",
      origin: "computed",
      detail: `${rawRecords.length} → ${filteredRecords.length} plných sekvencí (medián ${fRes.lengthStats.median} aa)`,
      externalTool: { label: "NCBI Protein", url: "https://www.ncbi.nlm.nih.gov/protein/" },
      outputFile: { name: "02_filtered_sequences.fasta", content: filteredFastaText },
    });
  } else {
    stages.push({
      step: 2,
      id: "fasta",
      title: "FASTA filtr (partial / hypothetical)",
      origin: "skipped",
      detail: "Nebyl vložen hrubý FASTA soubor (navazuje se z dalších vstupů).",
      externalTool: { label: "NCBI Protein", url: "https://www.ncbi.nlm.nih.gov/protein/" },
    });
  }

  // --- Stage 3: HMMER domain cutting ---
  await report(18, "Krok 3/11 · Ořez domén podle HMMER --domtblout…");
  const hmmReportText = (inputs.hmmReport ?? "").trim();
  let domainRecords: FastaRecord[] = filteredRecords;
  let croppedFastaText = filteredFastaText;

  if (hmmReportText && filteredRecords.length > 0) {
    const hits = parseDomtblout(hmmReportText);
    const cut = cutDomainsFromFasta(filteredRecords, hits, {
      coordMode: config.hmmCoordMode ?? "env",
      dedupMode: "longest",
      padding: config.hmmPadding ?? 0,
      maxIEvalue: 1e-5,
      minDomainLength: 50,
    });
    if (cut.croppedRecords.length > 0) {
      domainRecords = cut.croppedRecords;
      croppedFastaText = serializeFasta(domainRecords);
      artifacts.push({ name: "03_cropped_domains.fasta", content: croppedFastaText });
      stages.push({
        step: 3,
        id: "hmm",
        title: "HMMER ořez katalytické domény",
        origin: "uploaded",
        detail: `Vyříznuto ${cut.croppedRecords.length} domén z ${hits.length} HMMER hitů`,
        externalTool: {
          label: "EBI HMMER",
          url: "https://www.ebi.ac.uk/Tools/hmmer/search/hmmsearch",
        },
        outputFile: { name: "03_cropped_domains.fasta", content: croppedFastaText },
      });
    } else {
      stages.push({
        step: 3,
        id: "hmm",
        title: "HMMER ořez katalytické domény",
        origin: "skipped",
        detail: "Žádný HMMER hit neodpovídal ID ve FASTA — použity plné sekvence.",
        externalTool: {
          label: "EBI HMMER",
          url: "https://www.ebi.ac.uk/Tools/hmmer/search/hmmsearch",
        },
      });
    }
  } else {
    stages.push({
      step: 3,
      id: "hmm",
      title: "HMMER ořez katalytické domény",
      origin: "skipped",
      detail: "Bez --domtblout souboru — pokračuje se s plnými filtrovanými sekvencemi.",
      externalTool: {
        label: "EBI HMMER",
        url: "https://www.ebi.ac.uk/Tools/hmmer/search/hmmsearch",
      },
    });
  }

  // --- Stage 4: Sequence clustering (MMseqs2-compatible) ---
  await report(30, "Krok 4/11 · Shlukování sekvencí (MMseqs2 greedy)…");
  let adjacencyTsv = (inputs.adjacencyTsv ?? "").trim();
  let repRecords: FastaRecord[] = domainRecords;
  let repsFastaText = croppedFastaText;

  if (adjacencyTsv) {
    const adj = parseAdjacencyList(adjacencyTsv);
    if (domainRecords.length > 0) {
      const repIds = new Set(adj.repToMembers.keys());
      const matchedReps = domainRecords.filter((r) => repIds.has(r.id));
      if (matchedReps.length > 0) {
        repRecords = matchedReps;
        repsFastaText = serializeFasta(repRecords);
      }
    }
    artifacts.push({ name: "04_adjacency_list.tabular", content: adjacencyTsv + "\n" });
    if (repsFastaText) {
      artifacts.push({ name: "04_clustered_reps.fasta", content: repsFastaText });
    }
    stages.push({
      step: 4,
      id: "cluster",
      title: "Shlukování sekvencí (MMseqs2)",
      origin: "uploaded",
      detail: `Načteno ${adj.totalClusters} klastrů (${adj.totalMembers} členů) ze souboru`,
      externalTool: { label: "UseGalaxy.eu", url: "https://usegalaxy.eu/" },
      outputFile: { name: "04_adjacency_list.tabular", content: adjacencyTsv + "\n" },
    });
  } else if (domainRecords.length > 0) {
    const cl = clusterSequencesGreedy(domainRecords, {
      minSeqId: config.clusterMinSeqId ?? 0.9,
      minCoverage: config.clusterMinCoverage ?? 0.8,
    });
    repRecords = cl.representatives;
    repsFastaText = serializeFasta(repRecords);
    adjacencyTsv = cl.adjacencyTsv;
    artifacts.push({ name: "04_clustered_reps.fasta", content: repsFastaText });
    artifacts.push({ name: "04_adjacency_list.tabular", content: adjacencyTsv });
    stages.push({
      step: 4,
      id: "cluster",
      title: "Shlukování sekvencí (MMseqs2)",
      origin: "computed",
      detail: `${cl.inputCount} → ${cl.clusterCount} reprezentantů (komprese ${cl.compressionRatio}×, ≥${Math.round((config.clusterMinSeqId ?? 0.9) * 100)} % id)`,
      externalTool: { label: "UseGalaxy.eu", url: "https://usegalaxy.eu/" },
      outputFile: { name: "04_clustered_reps.fasta", content: repsFastaText },
    });
  } else {
    stages.push({
      step: 4,
      id: "cluster",
      title: "Shlukování sekvencí (MMseqs2)",
      origin: "skipped",
      detail: "Žádné sekvence k shlukování.",
      externalTool: { label: "UseGalaxy.eu", url: "https://usegalaxy.eu/" },
    });
  }

  // --- Stage 5: Multiple Sequence Alignment (MAFFT / in-browser BLOSUM62) ---
  await report(44, "Krok 5/11 · Mnohonásobné zarovnání MSA (BLOSUM62)…");
  let alignedFastaText = (inputs.alignedFasta ?? "").trim();
  let alignedRecords: FastaRecord[] = alignedFastaText ? parseFasta(alignedFastaText) : [];

  if (alignedRecords.length >= 2 && isAlignedFasta(alignedRecords)) {
    artifacts.push({ name: "05_msa_aligned.fasta", content: alignedFastaText + "\n" });
    stages.push({
      step: 5,
      id: "msa",
      title: "Mnohonásobné zarovnání (MAFFT / MSA)",
      origin: "uploaded",
      detail: `Načteno externí MSA: ${alignedRecords.length} sekvencí × ${alignedRecords[0].length} sloupců`,
      externalTool: {
        label: "MAFFT Web (EBI)",
        url: "https://www.ebi.ac.uk/jdispatcher/msa/mafft",
      },
      outputFile: { name: "05_msa_aligned.fasta", content: alignedFastaText + "\n" },
    });
  } else if (repRecords.length >= 2) {
    const cap = config.maxBrowserAlignSeqs ?? 80;
    const toAlign = repRecords.slice(0, cap);
    const msa = buildCenterStarMsa(toAlign);
    alignedRecords = msa.aligned;
    alignedFastaText = serializeFasta(alignedRecords);
    artifacts.push({ name: "05_msa_aligned.fasta", content: alignedFastaText });
    stages.push({
      step: 5,
      id: "msa",
      title: "Mnohonásobné zarovnání (MAFFT / MSA)",
      origin: "computed",
      detail: `Lokální BLOSUM62 MSA: ${alignedRecords.length} sekvencí × ${msa.columns} sloupců (${msa.meanGapPct} % mezer)${
        repRecords.length > cap ? ` · omezeno na ${cap} pro rychlost (pro větší použijte MAFFT Web)` : ""
      }`,
      externalTool: {
        label: "MAFFT Web (EBI)",
        url: "https://www.ebi.ac.uk/jdispatcher/msa/mafft",
      },
      outputFile: { name: "05_msa_aligned.fasta", content: alignedFastaText },
    });
  } else {
    stages.push({
      step: 5,
      id: "msa",
      title: "Mnohonásobné zarovnání (MAFFT / MSA)",
      origin: "skipped",
      detail: "Pro MSA jsou potřeba alespoň 2 sekvence (nebo nahrajte vlastní MAFFT výstup).",
      externalTool: {
        label: "MAFFT Web (EBI)",
        url: "https://www.ebi.ac.uk/jdispatcher/msa/mafft",
      },
    });
  }

  // --- Stage 6: Alignment Trimming (trimAl) ---
  await report(58, "Krok 6/11 · Ořezání mezer v zarovnání (trimAl)…");
  let trimmedRecords: FastaRecord[] = alignedRecords;
  let trimmedFastaText = alignedFastaText;

  if (alignedRecords.length >= 2) {
    const tr = trimAlignment(alignedRecords, {
      maxGapFraction: config.trimalMaxGap ?? 0.5,
    });
    trimmedRecords = tr.trimmed;
    trimmedFastaText = serializeFasta(trimmedRecords);
    artifacts.push({ name: "06_trimmed_alignment.fasta", content: trimmedFastaText });
    stages.push({
      step: 6,
      id: "trimal",
      title: "Ořez zarovnání (trimAl)",
      origin: "computed",
      detail: `${tr.originalColumns} → ${tr.trimmedColumns} pozic (mezery ${tr.meanGapBeforePct} % → ${tr.meanGapAfterPct} %)`,
      externalTool: { label: "UseGalaxy trimAl", url: "https://usegalaxy.eu/" },
      outputFile: { name: "06_trimmed_alignment.fasta", content: trimmedFastaText },
    });
  } else {
    stages.push({
      step: 6,
      id: "trimal",
      title: "Ořez zarovnání (trimAl)",
      origin: "skipped",
      detail: "Přeskočeno (chybí MSA).",
      externalTool: { label: "UseGalaxy trimAl", url: "https://usegalaxy.eu/" },
    });
  }

  // --- Stage 7: Phylogeny (IQ-TREE uploaded or NJ + Kimura + Bootstrap in-browser) ---
  await report(70, "Krok 7/11 · Rekonstrukce fylogenetického stromu & bootstrap…");
  let newickText = (inputs.newick ?? "").trim();

  if (newickText && parseNewick(newickText)) {
    const leafCount = getLeaves(parseNewick(newickText)!).length;
    artifacts.push({ name: "07_phylogeny.nwk", content: newickText + "\n" });
    stages.push({
      step: 7,
      id: "tree",
      title: "Fylogenetický strom (IQ-TREE / NJ)",
      origin: "uploaded",
      detail: `Načten externí Newick/NHX strom (${leafCount} listů)`,
      externalTool: { label: "IQ-TREE Web", url: "https://iqtree.cibiv.univie.ac.at/" },
      outputFile: { name: "07_phylogeny.nwk", content: newickText + "\n" },
    });
  } else if (trimmedRecords.length >= 3) {
    const nj = buildNeighborJoiningTree(trimmedRecords, {
      bootstrapReplicates: config.njBootstrapReplicates ?? 40,
    });
    newickText = nj.newick;
    artifacts.push({ name: "07_phylogeny.nwk", content: newickText + "\n" });
    stages.push({
      step: 7,
      id: "tree",
      title: "Fylogenetický strom (IQ-TREE / NJ)",
      origin: "computed",
      detail: `Neighbor-Joining (Kimura) + ${nj.bootstrapReplicates}× bootstrap (${nj.taxonCount} listů, ${nj.sitesUsed} pozic)`,
      externalTool: { label: "IQ-TREE Web", url: "https://iqtree.cibiv.univie.ac.at/" },
      outputFile: { name: "07_phylogeny.nwk", content: newickText + "\n" },
    });
  } else {
    stages.push({
      step: 7,
      id: "tree",
      title: "Fylogenetický strom (IQ-TREE / NJ)",
      origin: "skipped",
      detail: "Pro stavbu stromu jsou potřeba alespoň 3 sekvence (nebo nahrajte .treefile/.nwk).",
      externalTool: { label: "IQ-TREE Web", url: "https://iqtree.cibiv.univie.ac.at/" },
    });
  }

  const treeRoot = newickText ? parseNewick(newickText) : null;
  const treeLeafSet = new Set(treeRoot ? getLeaves(treeRoot).map((l) => l.name) : []);

  // --- Stage 8-10: Motif discovery + FIMO + Fitch RI ---
  await report(82, "Krok 8–10/11 · Objev motivů (MEME/FIMO) a výpočet Fitchova RI…");
  let fimoTsv = (inputs.fimoTsv ?? "").trim();
  let fimoOrigin: StageOrigin = "skipped";

  if (fimoTsv) {
    fimoOrigin = "uploaded";
  } else if (alignedRecords.length >= 2) {
    const disc = discoverAndScanMotifs(alignedRecords, {
      numMotifs: config.discoverMotifCount ?? 10,
      motifWidth: config.discoverMotifWidth ?? 15,
      pValueThreshold: config.fimoPValue ?? 1e-4,
    });
    fimoTsv = disc.fimoTsv;
    fimoOrigin = "computed";
  }

  const fimoAnalysis = fimoTsv
    ? analyzeFimoMotifs(parseFimoTsv(fimoTsv), {
        pValueCutoff: config.fimoPValue ?? 1e-4,
        minVariance: 10,
        minBinaryCoverage: 0.1,
        maxBinaryCoverage: 0.98,
        treeRoot,
      })
    : null;

  if (fimoTsv && fimoAnalysis && fimoAnalysis.motifs.length > 0) {
    const itolHeatmap = generateItolHeatmap(fimoAnalysis, { onlyPassingVariance: false });
    const itolBinary = generateItolBinary(fimoAnalysis, { onlyInformative: false });
    const statsTsv = generateMotifStatsTsv(fimoAnalysis);

    artifacts.push({ name: "10_fimo_hits.tsv", content: fimoTsv + "\n" });
    artifacts.push({ name: "10_motif_stats.tsv", content: statsTsv });
    artifacts.push({ name: "11_itol_meme_heatmap.txt", content: itolHeatmap });
    artifacts.push({ name: "11_itol_meme_binary.txt", content: itolBinary });

    const cladeCount = fimoAnalysis.motifs.filter(
      (m) => m.retentionIndex !== null && m.retentionIndex >= 0.7
    ).length;

    stages.push({
      step: 10,
      id: "fimo",
      title: "Motivy (MEME / FIMO) & Fitch RI",
      origin: fimoOrigin,
      detail: `${fimoAnalysis.motifs.length} motivů (${fimoAnalysis.passingHits} hitů, ${cladeCount} s RI ≥ 0.70) + iTOL heatmap/binary`,
      externalTool: {
        label: "MEME Suite",
        url: "https://meme-suite.org/meme/tools/meme",
      },
      outputFile: { name: "10_motif_stats.tsv", content: statsTsv },
    });
  } else {
    stages.push({
      step: 10,
      id: "fimo",
      title: "Motivy (MEME / FIMO) & Fitch RI",
      origin: "skipped",
      detail: "Nebyla nalezena žádná signifikantní shoda motivů.",
      externalTool: {
        label: "MEME Suite",
        url: "https://meme-suite.org/meme/tools/meme",
      },
    });
  }

  // --- Stage 11: Characterized mapping + Taxonomy & Chi-square + iTOL ---
  await report(93, "Krok 11/11 · iTOL anotace, charakterizované enzymy & χ² taxonomie…");
  const dbDomainsFasta = (inputs.dbDomainsFasta ?? "").trim() || croppedFastaText;
  const charFastaText = (inputs.characterizedFasta ?? "").trim();

  let charSummaryLine = "Bez nahraných charakterizovaných sekvencí (UniProt/CAZy).";
  if (charFastaText) {
    const adj = parseAdjacencyList(adjacencyTsv);
    const mapped = mapCharacterizedToTree(
      parseFasta(charFastaText),
      parseFasta(dbDomainsFasta),
      treeLeafSet,
      adj
    );
    const treeColors = generateCharacterizedTreeColors(mapped);
    const symbols = generateCharacterizedSymbols(mapped);
    const mapTsv = generateCharacterizedMappingTsv(mapped);

    artifacts.push({ name: "11_itol_char_tree_colors.txt", content: treeColors });
    artifacts.push({ name: "11_itol_char_symbols.txt", content: symbols });
    artifacts.push({ name: "11_characterized_mapping.tsv", content: mapTsv });
    charSummaryLine = `Namapováno ${mapped.directCount + mapped.proxyCount}/${mapped.matches.length} (${mapped.directCount} přímých, ${mapped.proxyCount} proxy)`;
  }

  let taxonomyTsv = (inputs.taxonomyTsv ?? "").trim();
  let taxOrigin: StageOrigin = "uploaded";
  if (!taxonomyTsv) {
    const sourceRecs = repRecords.length > 0 ? repRecords : alignedRecords;
    if (sourceRecs.length > 0) {
      taxonomyTsv = synthesizeTaxonomyFromFasta(sourceRecs);
      taxOrigin = "computed";
    } else {
      taxOrigin = "skipped";
    }
  }

  const taxRecords: TaxonomyRecord[] = taxonomyTsv ? parseTaxonomyTsv(taxonomyTsv) : [];
  const rank: TaxRank =
    taxOrigin === "computed" ? "genus" : config.taxRank ?? "phylum";

  let topChiSummary = "";
  if (taxRecords.length > 0) {
    const colorstrip = generateItolTaxonomyColorstrip(taxRecords, rank);
    const labels = generateItolTaxonomyLabels(taxRecords);
    artifacts.push({ name: "11_taxonomy.tsv", content: taxonomyTsv + "\n" });
    artifacts.push({ name: `11_itol_taxonomy_${rank}.txt`, content: colorstrip });
    artifacts.push({ name: "11_itol_taxonomy_labels.txt", content: labels });

    if (fimoAnalysis && fimoAnalysis.motifs.length > 0) {
      // Test the highest-RI informative motif against taxonomy
      const candidate =
        [...fimoAnalysis.motifs].sort(
          (a, b) => (b.retentionIndex ?? -1) - (a.retentionIndex ?? -1)
        )[0] ?? fimoAnalysis.motifs[0];
      const present =
        fimoAnalysis.presentByMotif.get(candidate.motif) ?? new Set<string>();
      const chi = analyzeMotifByTaxonomy(candidate.motif, present, taxRecords, rank);
      topChiSummary = `χ²(${candidate.motif} × ${rank}) = ${chi.stats.chi2.toFixed(2)}, p = ${
        chi.stats.pValue < 1e-4 ? chi.stats.pValue.toExponential(2) : chi.stats.pValue.toFixed(4)
      }, V = ${chi.stats.cramersV.toFixed(3)}`;
    }
  }

  stages.push({
    step: 11,
    id: "itol",
    title: "iTOL anotace, charakterizované & χ² taxonomie",
    origin: taxOrigin === "skipped" && !charFastaText ? "skipped" : taxOrigin,
    detail: [
      taxRecords.length > 0 ? `${taxRecords.length} taxonomických štítků (${rank})` : null,
      topChiSummary || null,
      charFastaText ? charSummaryLine : null,
    ]
      .filter(Boolean)
      .join(" · ") || "Žádná data pro iTOL export.",
    externalTool: { label: "Otevřít iTOL", url: "https://itol.embl.de/upload.cgi" },
    outputFile:
      taxRecords.length > 0
        ? {
            name: `11_itol_taxonomy_${rank}.txt`,
            content: generateItolTaxonomyColorstrip(taxRecords, rank),
          }
        : undefined,
  });

  // --- Stage 12: Automated Markdown Report ---
  const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
  const durationMs = Math.max(1, Math.round(t1 - t0));

  const reportLines = [
    "# Souhrnný protokol bioinformatické pipeline (VŠCHT Učení · GH48 Workbench)",
    "",
    `- **Datum běhu:** ${new Date().toISOString().slice(0, 19).replace("T", " ")} UTC`,
    `- **Doba výpočtu v prohlížeči:** ${durationMs} ms`,
    `- **Vygenerované výstupní soubory:** ${artifacts.length + 1}`,
    "",
    "## Přehled provedených kroků",
    "",
    "| Krok | Název | Zdroj | Výsledek |",
    "|---:|---|---|---|",
    ...stages.map((s) => {
      const originCz =
        s.origin === "uploaded"
          ? "Ze souboru"
          : s.origin === "computed"
          ? "Vypočteno v prohlížeči"
          : "Přeskočeno";
      return `| ${s.step} | ${s.title} | ${originCz} | ${s.detail} |`;
    }),
    "",
  ];

  if (fimoAnalysis && fimoAnalysis.motifs.length > 0) {
    reportLines.push("## Top motivy (Fitchův Retention Index & pokrytí)", "");
    reportLines.push("| Motiv | Typ | Pokrytí | Rozptyl | Fitch RI | Konsenzus |");
    reportLines.push("|---|---|---:|---:|---:|---|");
    for (const m of fimoAnalysis.motifs.slice(0, 15)) {
      reportLines.push(
        `| ${m.motif} | ${m.category} | ${(m.coverage * 100).toFixed(1)} % | ${m.variance.toFixed(1)} | ${
          m.retentionIndex !== null ? m.retentionIndex.toFixed(4) : "NA"
        } | \`${m.consensus}\` |`
      );
    }
    reportLines.push("");
  }

  reportLines.push(
    "## Doporučené externí webové nástroje pro finální publikační kvalitu",
    "",
    "- **MAFFT (L-INS-i zarovnání):** https://www.ebi.ac.uk/jdispatcher/msa/mafft",
    "- **IQ-TREE 2 (ML fylogeneze + UFBoot):** https://iqtree.cibiv.univie.ac.at/",
    "- **MEME Suite (MEME / TOMTOM / FIMO):** https://meme-suite.org/",
    "- **iTOL (vizualizace stromu & drag-and-drop datasetů):** https://itol.embl.de/upload.cgi",
    ""
  );

  const reportMarkdown = reportLines.join("\n");
  artifacts.push({ name: "12_pipeline_report.md", content: reportMarkdown });

  await report(100, `Hotovo za ${durationMs} ms · připraveno ${artifacts.length} výstupních souborů.`);

  return {
    stages,
    resolvedTexts: {
      rawFasta: rawFastaText,
      filteredFasta: filteredFastaText,
      croppedFasta: croppedFastaText,
      repsFasta: repsFastaText,
      adjacencyTsv,
      alignedFasta: alignedFastaText,
      trimmedFasta: trimmedFastaText,
      newick: newickText,
      fimoTsv,
      taxonomyTsv,
      dbDomainsFasta,
    },
    artifacts,
    reportMarkdown,
    durationMs,
  };
}
