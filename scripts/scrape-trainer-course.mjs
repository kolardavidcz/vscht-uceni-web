/**
 * Scrape KSI Trainer course outline → one Markdown file per week.
 *
 * Hierarchy:
 *   Week (chapter) → Lesson (subchapter) → Module (exercise title)
 *
 * API (from trainer frontend source map):
 *   GET /api/courses/:id              → { name, weeks: [{ id, name, from, until, lessons: [...] }] }
 *   GET /api/week/:weekId/items       → [{ id, type: 'LESSON'|'TOOL', order }]
 *   GET /api/lessons/:id/modules      → modules with names
 *
 * Auth: Trainer uses HTTP session cookies (OAuth / CTU login).
 *
 * Usage:
 *   # 1) Log in at https://trainer.ksi.fit.cvut.cz in your browser
 *   # 2) DevTools → Application → Cookies → copy Cookie header value
 *   #    or Network tab → any /api request → Request Headers → cookie
 *
 *   set TRAINER_COOKIE=JSESSIONID=...; other=...
 *   node scripts/scrape-trainer-course.mjs
 *   node scripts/scrape-trainer-course.mjs --course 81
 *   node scripts/scrape-trainer-course.mjs --course 81 --out src/features/bioinformatics/content/1-semestr/bi-pa1/trainer
 *
 * Optional:
 *   TRAINER_BASE=https://trainer.ksi.fit.cvut.cz
 *   --cookie-file path.txt   # raw Cookie header contents
 *   --json-out dump.json     # save full tree JSON
 *   --dry-run                # print tree only, no files
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {
    course: 81,
    out: path.join(
      ROOT,
      "src/features/bioinformatics/content/1-semestr/bi-pa1/trainer"
    ),
    cookieFile: null,
    jsonOut: null,
    dryRun: false,
    base: process.env.TRAINER_BASE || "https://trainer.ksi.fit.cvut.cz",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--course") args.course = Number(argv[++i]);
    else if (a === "--out") args.out = path.resolve(argv[++i]);
    else if (a === "--cookie-file") args.cookieFile = path.resolve(argv[++i]);
    else if (a === "--json-out") args.jsonOut = path.resolve(argv[++i]);
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--base") args.base = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function loadCookie(args) {
  if (args.cookieFile) {
    return fs.readFileSync(args.cookieFile, "utf8").trim();
  }
  return (process.env.TRAINER_COOKIE || process.env.COOKIE || "").trim();
}

function request(base, method, apiPath, cookie) {
  const url = new URL(apiPath, base);
  const lib = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(
      url,
      {
        method,
        headers: {
          Accept: "application/json",
          "User-Agent": "vscht-uceni-trainer-scraper/1.0",
          ...(cookie ? { Cookie: cookie } : {}),
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            body,
            headers: res.headers,
          });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function apiGet(base, apiPath, cookie) {
  const res = await request(base, "GET", `/api${apiPath}`, cookie);
  if (res.status === 401 || res.status === 403) {
    const err = new Error(
      `Auth failed (${res.status}) for ${apiPath}. Set TRAINER_COOKIE to a logged-in session cookie.`
    );
    err.status = res.status;
    err.body = res.body;
    throw err;
  }
  if (res.status < 200 || res.status >= 300) {
    const err = new Error(`HTTP ${res.status} for ${apiPath}: ${res.body.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  try {
    return JSON.parse(res.body);
  } catch {
    throw new Error(`Non-JSON response for ${apiPath}: ${res.body.slice(0, 200)}`);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "untitled";
}

function pickName(obj) {
  if (!obj || typeof obj !== "object") return null;
  return (
    obj.name ||
    obj.title ||
    obj.shortName ||
    obj.nameCs ||
    obj.titleCs ||
    obj.label ||
    null
  );
}

function moduleTitle(m) {
  return (
    pickName(m) ||
    m?.module?.name ||
    m?.moduleName ||
    (m?.id != null ? `Module ${m.id}` : "Untitled module")
  );
}

function lessonTitle(l) {
  return pickName(l) || (l?.id != null ? `Lesson ${l.id}` : "Untitled lesson");
}

function weekTitle(w, index) {
  return pickName(w) || `Týden ${String(index + 1).padStart(2, "0")}`;
}

/**
 * Build full outline tree for a course.
 */
async function scrapeCourse(base, courseId, cookie) {
  console.log(`Fetching course ${courseId}…`);
  const course = await apiGet(base, `/courses/${courseId}`, cookie);
  const weeks = Array.isArray(course.weeks) ? course.weeks : [];
  console.log(`  course: ${pickName(course) || courseId} (${weeks.length} weeks)`);

  const tree = {
    id: course.id ?? courseId,
    name: pickName(course) || `Course ${courseId}`,
    shortName: course.shortName || null,
    url: `${base}/courses/${courseId}`,
    scrapedAt: new Date().toISOString(),
    weeks: [],
  };

  for (let wi = 0; wi < weeks.length; wi++) {
    const week = weeks[wi];
    const wName = weekTitle(week, wi);
    console.log(`  week ${wi + 1}/${weeks.length}: ${wName}`);

    // Prefer ordered items when available
    let orderedLessonIds = null;
    try {
      const items = await apiGet(base, `/week/${week.id}/items`, cookie);
      if (Array.isArray(items)) {
        orderedLessonIds = items
          .filter((it) => it.type === "LESSON" || it.type === "lesson")
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((it) => it.id);
      }
    } catch (e) {
      console.warn(`    warn: week items failed (${e.message})`);
    }

    const lessonsRaw = Array.isArray(week.lessons) ? [...week.lessons] : [];
    if (orderedLessonIds?.length) {
      const byId = new Map(lessonsRaw.map((l) => [l.id, l]));
      const ordered = [];
      for (const id of orderedLessonIds) {
        if (byId.has(id)) {
          ordered.push(byId.get(id));
          byId.delete(id);
        }
      }
      // leftover lessons not in items
      ordered.push(...byId.values());
      lessonsRaw.length = 0;
      lessonsRaw.push(...ordered);
    }

    const weekNode = {
      id: week.id,
      name: wName,
      from: week.from || null,
      until: week.until || null,
      lessons: [],
    };

    for (let li = 0; li < lessonsRaw.length; li++) {
      const lesson = lessonsRaw[li];
      const lName = lessonTitle(lesson);
      process.stdout.write(`    lesson: ${lName}… `);

      // Prefer lesson detail — `/lessons/:id/modules` is often 403 for students
      let modules = [];
      let detailName = lName;
      let detailType = lesson.type || null;
      let detailHidden = !!lesson.hidden;
      try {
        const detail = await apiGet(base, `/lessons/${lesson.id}`, cookie);
        detailName = pickName(detail) || lName;
        detailType = detail.type || detailType;
        detailHidden = !!(detail.hidden ?? detailHidden);
        const mods = Array.isArray(detail.modules) ? detail.modules : [];
        modules = mods
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        console.log(`${modules.length} modules`);
      } catch (e) {
        console.log(`lesson detail fail (${e.message})`);
      }

      weekNode.lessons.push({
        id: lesson.id,
        name: detailName,
        type: detailType,
        hidden: detailHidden,
        url: `${base}/lessons/${lesson.id}`,
        modules: modules.map((m) => ({
          id: m.id ?? m.moduleId ?? null,
          name: moduleTitle(m),
          type: m.type || null,
          difficulty: m.difficulty ?? null,
          url:
            m.id != null
              ? `${base}/lessons/${lesson.id}/modules/${m.id}`
              : null,
        })),
      });

      await sleep(80);
    }

    tree.weeks.push(weekNode);
  }

  return tree;
}

function weekToMarkdown(course, week, weekIndex) {
  const n = String(weekIndex + 1).padStart(2, "0");
  const lines = [];
  lines.push(`# ${week.name}`);
  lines.push("");
  lines.push(`**Kurz:** [${course.name}](${course.url})`);
  lines.push(`**Zdroj:** [Trainer course](${course.url})`);
  if (week.from || week.until) {
    const from = week.from ? new Date(week.from).toLocaleDateString("cs-CZ") : "?";
    const until = week.until
      ? new Date(week.until).toLocaleDateString("cs-CZ")
      : "?";
    lines.push(`**Termín:** ${from} – ${until}`);
  }
  lines.push("");
  lines.push(`> Scraped outline only (week → lesson → exercise titles).`);
  lines.push("");
  lines.push("---");
  lines.push("");

  if (!week.lessons.length) {
    lines.push("_Žádné lekce v tomto týdnu._");
    lines.push("");
    return lines.join("\n");
  }

  for (let i = 0; i < week.lessons.length; i++) {
    const lesson = week.lessons[i];
    const hidden = lesson.hidden ? " 👻" : "";
    const type = lesson.type ? ` \`${lesson.type}\`` : "";
    lines.push(`## ${i + 1}. ${lesson.name}${hidden}${type}`);
    lines.push("");
    if (lesson.url) lines.push(`*Lekce:* [${lesson.url}](${lesson.url})`);
    lines.push("");

    if (!lesson.modules.length) {
      lines.push("- _(žádné cvičení / modules)_");
      lines.push("");
      continue;
    }

    for (const mod of lesson.modules) {
      if (mod.url) {
        lines.push(`- [${mod.name}](${mod.url})`);
      } else {
        lines.push(`- ${mod.name}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

function indexMarkdown(course) {
  const lines = [];
  lines.push(`# ${course.name} — Trainer outline`);
  lines.push("");
  lines.push(`Zdroj: [${course.url}](${course.url})`);
  lines.push("");
  lines.push(`Staženo: ${course.scrapedAt}`);
  lines.push("");
  lines.push("Hierarchie: **týden (chapter)** → **lekce (subchapter)** → **cvičení / module (exercise)**");
  lines.push("");
  lines.push("---");
  lines.push("");
  for (let i = 0; i < course.weeks.length; i++) {
    const w = course.weeks[i];
    const n = String(i + 1).padStart(2, "0");
    const file = `${n}-${slugify(w.name)}.md`;
    const lessonCount = w.lessons.length;
    const modCount = w.lessons.reduce((a, l) => a + l.modules.length, 0);
    lines.push(
      `* [${w.name}](./${file}) — ${lessonCount} lekcí, ${modCount} cvičení`
    );
  }
  lines.push("");
  return lines.join("\n");
}

function printTree(course) {
  console.log("\n" + course.name);
  for (const w of course.weeks) {
    console.log(`├── ${w.name}`);
    for (const l of w.lessons) {
      console.log(`│   ├── ${l.name}`);
      for (const m of l.modules) {
        console.log(`│   │   • ${m.name}`);
      }
    }
  }
}

/**
 * Register scraped week files under 1-semestr → bi-pa1 → trainer in config.json.
 */
function patchWikiConfig(course, outDir) {
  const configPath = path.join(
    ROOT,
    "src/features/bioinformatics/content/config.json"
  );
  if (!fs.existsSync(configPath)) return;

  const rel = path
    .relative(
      path.join(ROOT, "src/features/bioinformatics/content"),
      outDir
    )
    .replace(/\\/g, "/");
  // expect 1-semestr/bi-pa1/trainer
  const parts = rel.split("/").filter(Boolean);
  if (parts[0] !== "1-semestr" || parts[1] !== "bi-pa1") {
    console.log("Skip config patch (out dir not under 1-semestr/bi-pa1)");
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const sem = config.categories?.["1-semestr"];
  if (!sem?.files?.["bi-pa1"]) return;

  const biPa1 = sem.files["bi-pa1"];
  if (!biPa1.files) biPa1.files = {};

  const trainerKey = parts[2] || "trainer";
  const trainerNode = biPa1.files[trainerKey] || {
    title: "🏋️ Trainer KSI (course 81)",
    order: 20,
    files: {},
  };
  trainerNode.files = trainerNode.files || {};
  trainerNode.files["00-index"] = {
    title: "00 · Trainer outline",
    order: 0,
  };

  for (let i = 0; i < course.weeks.length; i++) {
    const w = course.weeks[i];
    const n = String(i + 1).padStart(2, "0");
    const key = `${n}-${slugify(w.name)}`;
    trainerNode.files[key] = {
      title: `${n} · ${w.name}`,
      order: i + 1,
    };
  }

  biPa1.files[trainerKey] = trainerNode;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log("Updated config.json trainer entries");
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage: node scripts/scrape-trainer-course.mjs [options]
  --course <id>       Course id (default 81)
  --out <dir>         Output directory for .md files
  --cookie-file <f>   File containing Cookie header
  --json-out <f>      Also write full JSON tree
  --dry-run           Print tree only
  --base <url>        Trainer origin (default https://trainer.ksi.fit.cvut.cz)

Env:
  TRAINER_COOKIE      Session cookie string from browser
  TRAINER_BASE        Override base URL`);
    process.exit(0);
  }

  const cookie = loadCookie(args);
  if (!cookie) {
    console.error(`
Missing session cookie.

Trainer API requires CTU login. Steps:
  1. Open https://trainer.ksi.fit.cvut.cz and log in
  2. DevTools → Network → click any /api/... request
  3. Copy the Cookie request header
  4. Run:

     # PowerShell
     $env:TRAINER_COOKIE = "paste-cookie-here"
     node scripts/scrape-trainer-course.mjs --course ${args.course}

     # or
     node scripts/scrape-trainer-course.mjs --cookie-file cookie.txt
`);
    process.exit(1);
  }

  try {
    const tree = await scrapeCourse(args.base, args.course, cookie);
    printTree(tree);

    if (args.jsonOut) {
      fs.mkdirSync(path.dirname(args.jsonOut), { recursive: true });
      fs.writeFileSync(args.jsonOut, JSON.stringify(tree, null, 2), "utf8");
      console.log("Wrote JSON", args.jsonOut);
    }

    if (args.dryRun) {
      console.log("(dry-run — no markdown written)");
      return;
    }

    fs.mkdirSync(args.out, { recursive: true });
    fs.writeFileSync(path.join(args.out, "00-index.md"), indexMarkdown(tree), "utf8");
    console.log("Wrote 00-index.md");

    for (let i = 0; i < tree.weeks.length; i++) {
      const w = tree.weeks[i];
      const n = String(i + 1).padStart(2, "0");
      const file = `${n}-${slugify(w.name)}.md`;
      const md = weekToMarkdown(tree, w, i);
      fs.writeFileSync(path.join(args.out, file), md, "utf8");
      console.log("Wrote", file);
    }

    // Optionally patch wiki config.json so new week pages appear in the sidebar
    try {
      patchWikiConfig(tree, args.out);
    } catch (e) {
      console.warn("Could not patch config.json:", e.message);
    }

    console.log(`\nDone → ${args.out}`);
  } catch (e) {
    console.error("\nScrape failed:", e.message);
    if (e.status === 401 || e.status === 403) {
      console.error(
        "Cookie expired or missing rights. Log in again and refresh TRAINER_COOKIE."
      );
    }
    process.exit(1);
  }
}

main();
