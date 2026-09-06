/**
 * Master PowerPoint Generator for pre-AG1 Course
 * Assembles all 8 modules into pre-ag1-kurz.pptx with 1:1 fidelity to website markdown.
 */
import pptxgen from "pptxgenjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FONT_DELTA, createCourseTitleSlide } from "./pptx_engine.mjs";
import { addModule2Slides } from "./modules/module2_dml_summer.mjs";
import { addModule3Slides } from "./modules/module3_bio_graphs.mjs";
import { addModule4Slides } from "./modules/module4_logic.mjs";
import { addModule5Slides } from "./modules/module5_induction.mjs";
import { addModule6Slides } from "./modules/module6_contradiction.mjs";
import { addModule7Slides } from "./modules/module7_representation.mjs";
import { addModule8Slides } from "./modules/module8_workshop.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function generate() {
  console.log("================================================================");
  console.log("  PRE-AG1 POWERPOINT GENERATOR (MODULES 2-8)");
  console.log(`  Font Delta: ${FONT_DELTA >= 0 ? "+" : ""}${FONT_DELTA} pt`);
  console.log("================================================================");

  const pres = new pptxgen();

  // 16:9 Widescreen Layout (13.333" x 7.5")
  pres.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
  pres.layout = "WIDESCREEN_16_9";

  // Document metadata
  pres.title = "pre-AG1: Letní Průvodce Grafovou Matematikou pro Bioinformatiky";
  pres.author = "VŠCHT Učení · Obor Bioinformatika";
  pres.company = "VŠCHT Praha / FIT ČVUT";
  pres.subject = "Příprava na Algoritmy a Grafy 1 (AG1 FIT ČVUT)";

  // 0. Master Course Title Slide
  console.log("Generating Course Title Slide...");
  createCourseTitleSlide(pres, {
    title: "pre-AG1: Letní Průvodce Grafovou Matematikou",
    subtitle: "Kompletní 1:1 příprava pro bioinformatiky na Algoritmy a Grafy 1 (FIT ČVUT) z pohledu studenta VŠCHT",
    author: "VŠCHT Učení · Obor Bioinformatika",
    date: "2026"
  });

  // 2. Module 2: Summer Guide to Graph Math
  console.log("Generating Module 2: Letní Průvodce Grafovou Matematikou...");
  addModule2Slides(pres);

  // 3. Module 3: Bio Intuition & What is a Graph
  console.log("Generating Module 3: Bio-Intuice & Co je Graf...");
  addModule3Slides(pres);

  // 4. Module 4: Logic and Proof Foundation
  console.log("Generating Module 4: Logický & Důkazový základ...");
  addModule4Slides(pres);

  // 5. Module 5: Induction on Graphs & Reduction Trap
  console.log("Generating Module 5: Indukce na Grafech & Redukční Past...");
  addModule5Slides(pres);

  // 6. Module 6: Contradiction & Extremal Principle
  console.log("Generating Module 6: Důkazy Sporem & Extremální Princip...");
  addModule6Slides(pres);

  // 7. Module 7: Graphs in C++ & Memory Representation
  console.log("Generating Module 7: Grafy v C++ & Reprezentace v Paměti...");
  addModule7Slides(pres);

  // 8. Module 8: Exam Workshop & Proof Templates
  console.log("Generating Module 8: Zkouškový Workshop & Šablony Důkazů...");
  addModule8Slides(pres);

  const outputPath = path.join(rootDir, "pre-ag1-kurz.pptx");
  const publicPath = path.join(rootDir, "public", "pre-ag1-kurz.pptx");

  console.log(`\nWriting presentation to ${outputPath}...`);
  await pres.writeFile({ fileName: outputPath });

  // Also copy to public/ so users can download it directly from web
  try {
    fs.copyFileSync(outputPath, publicPath);
    console.log(`Copied presentation to ${publicPath}`);
  } catch (err) {
    console.warn("Could not copy to public folder:", err.message);
  }

  console.log("\n================================================================");
  console.log("  SUCCESSFULLY GENERATED pre-ag1-kurz.pptx!");
  console.log(`  Output: ${outputPath}`);
  console.log("================================================================\n");
}

generate().catch((err) => {
  console.error("FATAL ERROR generating presentation:", err);
  process.exit(1);
});
