import fs from "fs";
import path from "path";
import { worksheetData } from "../src/features/microbiology/data/zastupci.ts";
import { emojiOptions, emojiCategories } from "../src/features/microbiology/data/emojis.ts";

async function main() {
  const backupDir = path.resolve("backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().replace(/[:.]/g, "-");

  // 1. Export static catalog database
  const fullCatalog = {
    version: "1.0",
    backedUpAt: new Date().toISOString(),
    worksheetData,
    emojiOptions,
    emojiCategories,
  };

  const catalogBackupFile = path.join(backupDir, `microbiology_catalog_${dateStr}.json`);
  const catalogLatestFile = path.join(backupDir, "microbiology_catalog_latest.json");

  fs.writeFileSync(catalogBackupFile, JSON.stringify(fullCatalog, null, 2), "utf-8");
  fs.writeFileSync(catalogLatestFile, JSON.stringify(fullCatalog, null, 2), "utf-8");

  console.log("✅ Taxonomy catalog database exported successfully!");
  console.log(`Saved catalog backup: ${catalogBackupFile} (${(fs.statSync(catalogBackupFile).size / 1024).toFixed(2)} KB)`);

  // 2. Fetch live production store snapshot
  try {
    const res = await fetch("https://vscht-uceni-web.vercel.app/api/get-data");
    if (res.ok) {
      const liveData = await res.json();
      const liveFile = path.join(backupDir, `redis_production_snapshot_${dateStr}.json`);
      const liveLatest = path.join(backupDir, "redis_production_snapshot_latest.json");
      fs.writeFileSync(liveFile, JSON.stringify(liveData, null, 2), "utf-8");
      fs.writeFileSync(liveLatest, JSON.stringify(liveData, null, 2), "utf-8");
      console.log(`✅ Production Redis snapshot exported: ${liveFile}`);
    } else {
      console.log(`ℹ️ Production API returned status ${res.status} (No custom Redis admin patches exist currently).`);
    }
  } catch (err) {
    console.warn("Could not reach production API:", err instanceof Error ? err.message : err);
  }

  // 3. Export wiki metadata & content index backup
  try {
    const wikiConfigPath = path.resolve("src/features/bioinformatics/content/config.json");
    if (fs.existsSync(wikiConfigPath)) {
      const wikiConfig = JSON.parse(fs.readFileSync(wikiConfigPath, "utf-8"));
      const wikiBackupFile = path.join(backupDir, `wiki_structure_${dateStr}.json`);
      fs.writeFileSync(wikiBackupFile, JSON.stringify(wikiConfig, null, 2), "utf-8");
      console.log(`✅ Wiki content metadata backed up: ${wikiBackupFile}`);
    }
  } catch (wikiErr) {
    console.warn("Could not backup wiki structure:", wikiErr);
  }

  console.log("\n🎉 Database backup completed! All files saved in ./backups/");
}

main().catch(console.error);
