import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const outDir = path.join(
  ROOT,
  "src/features/bioinformatics/content/1-semestr/bi-pa1/trainer"
);
const tree = JSON.parse(fs.readFileSync(path.join(outDir, "tree.json"), "utf8"));

function slugify(s) {
  return (
    String(s || "")
      // drop leading "01 - " style week numbers (we add our own)
      .replace(/^\d+\s*[-–.]\s*/u, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "untitled"
  );
}

function weekMd(course, week) {
  const lines = [];
  lines.push(`# ${week.name}`);
  lines.push("");
  lines.push(`**Kurz:** [${course.name}](${course.url})`);
  lines.push(`**Zdroj:** [Trainer](${course.url})`);
  if (week.from || week.until) {
    const from = week.from
      ? new Date(week.from).toLocaleDateString("cs-CZ")
      : "?";
    const until = week.until
      ? new Date(week.until).toLocaleDateString("cs-CZ")
      : "?";
    lines.push(`**Termín:** ${from} – ${until}`);
  }
  lines.push("");
  lines.push(
    "> Outline: **týden** → **lekce** → **cvičení** (scraped from logged-in Trainer session)."
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  for (let li = 0; li < week.lessons.length; li++) {
    const lesson = week.lessons[li];
    const hidden = lesson.hidden ? " 👻" : "";
    const type = lesson.type ? ` \`${lesson.type}\`` : "";
    lines.push(`## ${li + 1}. ${lesson.name}${hidden}${type}`);
    lines.push("");
    lines.push(`*Lekce:* [${lesson.url}](${lesson.url})`);
    lines.push("");
    if (!lesson.modules.length) {
      lines.push("- _(žádná cvičení)_");
      lines.push("");
      continue;
    }
    for (const m of lesson.modules) {
      const bits = [];
      if (m.type) bits.push(m.type);
      if (m.difficulty) bits.push(m.difficulty);
      const meta = bits.length ? ` _(${bits.join(", ")})_` : "";
      if (m.url) lines.push(`- [${m.name}](${m.url})${meta}`);
      else lines.push(`- ${m.name}${meta}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function indexMd(course) {
  const lines = [];
  lines.push(`# ${course.name} — Trainer outline`);
  lines.push("");
  lines.push(`Zdroj: [${course.url}](${course.url})`);
  lines.push("");
  lines.push(`Staženo: ${course.scrapedAt}`);
  lines.push("");
  lines.push(
    "Hierarchie: **týden (chapter)** → **lekce (subchapter)** → **cvičení (exercise)**"
  );
  lines.push("");
  lines.push("| Týden | Lekcí | Cvičení |");
  lines.push("|-------|------:|--------:|");
  for (let i = 0; i < course.weeks.length; i++) {
    const w = course.weeks[i];
    const n = String(i + 1).padStart(2, "0");
    const file = `${n}-${slugify(w.name)}.md`;
    const lc = w.lessons.length;
    const mc = w.lessons.reduce((a, l) => a + l.modules.length, 0);
    lines.push(`| [${w.name}](./${file}) | ${lc} | ${mc} |`);
  }
  lines.push("");
  return lines.join("\n");
}

fs.writeFileSync(path.join(outDir, "00-index.md"), indexMd(tree), "utf8");

const configPath = path.join(
  ROOT,
  "src/features/bioinformatics/content/config.json"
);
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const bi = config.categories["1-semestr"].files["bi-pa1"];
bi.files = bi.files || {};
bi.files.trainer = {
  title: "🏋️ Trainer KSI (course 81)",
  order: 20,
  files: {
    "00-index": { title: "00 · Trainer outline", order: 0 },
  },
};

for (let i = 0; i < tree.weeks.length; i++) {
  const w = tree.weeks[i];
  const n = String(i + 1).padStart(2, "0");
  const key = `${n}-${slugify(w.name)}`;
  fs.writeFileSync(path.join(outDir, `${key}.md`), weekMd(tree, w), "utf8");
  bi.files.trainer.files[key] = {
    title: `${n} · ${w.name}`,
    order: i + 1,
  };
  console.log(
    "wrote",
    key + ".md",
    "L",
    w.lessons.length,
    "M",
    w.lessons.reduce((a, l) => a + l.modules.length, 0)
  );
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
console.log("done");
