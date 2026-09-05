import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const raw = fs.readFileSync(
  path.join(ROOT, "src/features/bioinformatics/data/materialsData.ts"),
  "utf8"
);
const jsonMatch = raw.match(
  /export const materialsData:\s*SchoolMaterial\[\]\s*=\s*([\s\S]*);/
);
const data = JSON.parse(jsonMatch[1]);
const trainer = data.filter((c) => c.category === "Trainer");

for (const w of trainer) {
  console.log(w.id, "::", w.name);
  if (w.children) {
    for (const l of w.children) {
      console.log("  ", l.id, "::", l.name);
      if (l.children) {
        for (const m of l.children) {
          console.log("    ", m.id, "::", m.name);
        }
      }
    }
  }
}
