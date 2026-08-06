import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.URL || "http://localhost:5174";
const OUT_DIR = path.resolve(process.cwd(), "docs/screenshots");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const routes = [
  { name: "homepage.png", path: "/" },
  { name: "microbiology_quiz.png", path: "/mikrobiologie" },
  { name: "taxonomy_tree.png", path: "/mikrobiologie/studijni-strom" },
  { name: "bioinformatics_wiki.png", path: "/obor-bioinformatika" },
  { name: "python_analyzer.png", path: "/python-analyza" },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const route of routes) {
    console.log(`Capturing ${route.path} -> ${route.name}...`);
    await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT_DIR, route.name), fullPage: false });
  }

  await browser.close();
  console.log("Screenshots captured successfully to docs/screenshots/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
