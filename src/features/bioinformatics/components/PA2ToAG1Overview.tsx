import { useState, useMemo, useCallback } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  GraduationCap,
  Users,
  Terminal,
  Printer,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-react";
import {
  materialsData,
  SchoolMaterial,
  SchoolMaterialNode,
} from "../data/materialsData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type PlanLevel = 1 | 2 | 3 | 4;

/** LVL1: specially highlighted weeks */
const LVL1_WEEKS = new Set([1, 7]);

function getLeafNodes(node: SchoolMaterialNode): SchoolMaterialNode[] {
  if (!node.children || node.children.length === 0) {
    return [node];
  }
  return node.children.flatMap(getLeafNodes);
}

function renderNameWithLinks(name: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(name)) !== null) {
    const textBefore = name.substring(lastIndex, match.index);
    if (textBefore) parts.push(textBefore);
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-orange hover:text-brand-orange-text underline"
        onClick={(e) => e.stopPropagation()}
      >
        {match[1]}
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }
  const textAfter = name.substring(lastIndex);
  if (textAfter) parts.push(textAfter);
  return parts.length > 0 ? parts : name;
}

function stripMarkdownLinks(name: string): string {
  return name.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

type PlanTopic = {
  weekNum: number;
  weekTitle: string;
  category: string;
  source: string;
  topic: string;
  relevance: number;
  quality: boolean;
  badges: string[];
};

/** Relevance bar + label color (website mapping). */
function printRelClasses(t: PlanTopic): { bar: string; pct: string } {
  const r = t.relevance;
  const isMega = t.badges.includes("mega_epic");
  if (t.quality === false) return { bar: "bar-slate", pct: "pct-muted" };
  if (isMega || r >= 90) return { bar: "bar-orange", pct: "pct-high" };
  if (r >= 70) return { bar: "bar-amber", pct: "pct-mid" };
  if (r >= 60) return { bar: "bar-amber", pct: "pct-ok" };
  if (r >= 50) return { bar: "bar-yellow", pct: "pct-ok" };
  return { bar: "bar-slate", pct: "pct-muted" };
}

function printBadgeHtml(badges: string[], lowQuality: boolean): string {
  const chips: string[] = [];
  if (badges.includes("mega_epic"))
    chips.push(`<span class="chip chip-mega">MEGA EPIC</span>`);
  if (badges.includes("epic"))
    chips.push(`<span class="chip chip-epic">EPIC</span>`);
  if (badges.includes("insight"))
    chips.push(`<span class="chip chip-insight">INSIGHT</span>`);
  if (badges.includes("challenge"))
    chips.push(`<span class="chip chip-challenge">CHALLENGE</span>`);
  if (badges.includes("practice"))
    chips.push(`<span class="chip chip-practice">PRACTICE</span>`);
  if (badges.includes("showcase"))
    chips.push(`<span class="chip chip-showcase">SHOWCASE</span>`);
  if (badges.includes("no_code"))
    chips.push(`<span class="chip chip-nocode">NO CODE</span>`);
  if (badges.includes("not_checked"))
    chips.push(`<span class="chip chip-unchecked">NOT CHECKED</span>`);
  if (lowQuality)
    chips.push(`<span class="chip chip-lowq">LOW QUALITY</span>`);
  return chips.length ? `<span class="chips">${chips.join("")}</span>` : "";
}

/**
 * Print via hidden iframe + system Print dialog.
 * Multiline checklist; colorful tags + relevance; light/transparent row bg.
 */
function printPlanDocument(title: string, topics: PlanTopic[]) {
  const byWeek = new Map<number, PlanTopic[]>();
  for (const t of topics) {
    if (!byWeek.has(t.weekNum)) byWeek.set(t.weekNum, []);
    byWeek.get(t.weekNum)!.push(t);
  }
  const weekNums = [...byWeek.keys()].sort((a, b) => a - b);

  const rows = weekNums
    .map((w) => {
      const list = byWeek.get(w)!;
      const weekTitle = list[0]?.weekTitle ?? `${w}. týden`;
      const isLvl1 = LVL1_WEEKS.has(w);
      const items = list
        .map((t) => {
          const rel = printRelClasses(t);
          const hasEpic =
            t.badges.includes("epic") || t.badges.includes("mega_epic");
          return `<li class="item${t.quality === false ? " item-lowq" : ""}${hasEpic ? " item-epic" : ""}">
  <span class="check" aria-hidden="true">☐</span>
  <div class="item-body">
    <div class="item-main">
      <span class="topic">${escapeHtml(t.topic)}</span>
      ${printBadgeHtml(t.badges, t.quality === false)}
    </div>
    <div class="item-sub">
      <span class="meta">${escapeHtml(t.category)} · ${escapeHtml(t.source)}</span>
      <span class="rel">
        <span class="pct ${rel.pct}">${t.relevance}%</span>
        <span class="bar-track"><span class="bar ${rel.bar}" style="width:${Math.max(t.relevance, 5)}%"></span></span>
      </span>
    </div>
  </div>
</li>`;
        })
        .join("\n");
      return `<section class="week${isLvl1 ? " week-lvl1" : ""}">
  <h2><span class="week-badge">${w}. Týden</span> ${escapeHtml(weekTitle)}${isLvl1 ? ' <span class="lvl1-tag">LVL1</span>' : ""}</h2>
  <ul class="list">${items}</ul>
</section>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      max-width: 760px; margin: 1.25rem auto; padding: 0 1rem;
      color: #1c1917; line-height: 1.4; background: #fff;
    }
    h1 { font-size: 1.3rem; margin: 0 0 0.85rem; color: #0c0a09; }

    .week { margin: 0 0 1rem; }
    .week h2 {
      font-size: 0.98rem; margin: 0 0 0.35rem; padding: 0.35rem 0 0.35rem 0.55rem;
      border-bottom: 1px solid rgba(231, 229, 228, 0.85);
      border-left: 3px solid rgba(203, 213, 225, 0.9);
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem;
      background: transparent;
    }
    .week-lvl1 h2 {
      border-left-color: #f95d12;
      background: linear-gradient(90deg, rgba(249,93,18,0.07), transparent);
    }
    .week-badge {
      font-size: 0.62rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.04em;
      color: #c2410c; background: rgba(249,93,18,0.12); border: 1px solid rgba(249,93,18,0.28);
      border-radius: 0.35rem; padding: 0.12rem 0.35rem;
    }
    .lvl1-tag {
      font-size: 0.55rem; font-weight: 900; color: #fff; background: #f95d12;
      border-radius: 0.2rem; padding: 0.08rem 0.3rem; letter-spacing: 0.04em;
    }

    /* Multiline checklist */
    .list {
      list-style: none; margin: 0; padding: 0;
    }
    .item {
      display: flex; align-items: flex-start; gap: 0.45rem;
      padding: 0.4rem 0.45rem;
      margin: 0 0 0.2rem;
      border-radius: 0.4rem;
      border: 1px solid rgba(226, 232, 240, 0.55);
      /* light / transparent gray-white row (not heavy solid boxes) */
      background: rgba(248, 250, 252, 0.28);
      page-break-inside: avoid;
    }
    .item-epic {
      border-color: rgba(249, 93, 18, 0.28);
      background: rgba(255, 247, 237, 0.35);
    }
    .item-lowq {
      opacity: 0.72;
      background: rgba(241, 245, 249, 0.22);
    }

    .check {
      flex-shrink: 0;
      width: 1.05rem; height: 1.05rem;
      margin-top: 0.08rem;
      border: 1.5px solid #a8a29e;
      border-radius: 0.22rem;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 0.75rem; line-height: 1; color: transparent;
      background: rgba(255,255,255,0.5);
      /* empty checkbox for students to tick by hand */
      content: "";
    }
    .check::before { content: ""; }

    .item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.22rem; }
    .item-main {
      display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.3rem 0.45rem;
    }
    .topic {
      font-size: 0.82rem; font-weight: 700; color: #1c1917;
      line-height: 1.3; word-break: break-word;
    }
    .item-sub {
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem 0.75rem;
    }
    .meta {
      font-size: 0.65rem; font-weight: 600; color: #78716c; line-height: 1.25;
    }

    .chips { display: inline-flex; flex-wrap: wrap; gap: 0.18rem; vertical-align: middle; }
    .chip {
      font-size: 0.52rem; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase;
      border-radius: 0.15rem; padding: 0.1rem 0.3rem; line-height: 1.15; color: #fff;
    }
    .chip-mega { background: linear-gradient(90deg, #f59e0b, #ea580c); }
    .chip-epic { background: #c2410c; }
    .chip-insight { background: linear-gradient(90deg, #10b981, #0d9488); }
    .chip-challenge { background: #9f1239; }
    .chip-practice { background: #fae8ff; color: #701a75; border: 1px solid #d8b4fe; }
    .chip-showcase { background: transparent; color: #6d28d9; border: 1px dashed #7c3aed; }
    .chip-nocode { background: #fffbeb; color: #b45309; border-left: 3px solid #f59e0b; }
    .chip-unchecked { background: #fff; color: #000; border: 1px solid #e2e8f0; }
    .chip-lowq { background: #e2e8f0; color: #475569; border-radius: 999px; }

    .rel { display: inline-flex; align-items: center; gap: 0.3rem; min-width: 5.5rem; }
    .pct { font-size: 0.62rem; font-weight: 800; min-width: 1.7rem; }
    .pct-high { color: #c2410c; }
    .pct-mid { color: #b45309; }
    .pct-ok { color: #a16207; }
    .pct-muted { color: #94a3b8; }
    .bar-track {
      width: 3.5rem; height: 0.3rem;
      background: rgba(226, 232, 240, 0.65);
      border-radius: 999px; overflow: hidden;
    }
    .bar { display: block; height: 100%; border-radius: 999px; }
    .bar-orange { background: #f95d12; }
    .bar-amber { background: #f59e0b; }
    .bar-yellow { background: #facc15; }
    .bar-slate { background: #cbd5e1; }

    footer { margin-top: 1.25rem; font-size: 0.68rem; color: #a8a29e; }

    @media print {
      body { margin: 0; max-width: none; padding: 0.35rem 0.65rem; }
      .week { break-inside: avoid; }
      .item { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${rows || "<p><em>Žádná témata pro tuto úroveň.</em></p>"}
  <footer>PA2 → AG1 · ${new Date().toLocaleString("cs-CZ")} · vscht-uceni</footer>
</body>
</html>`;

  const IFRAME_ID = "pa2-ag1-print-frame";
  document.getElementById(IFRAME_ID)?.remove();

  const iframe = document.createElement("iframe");
  iframe.id = IFRAME_ID;
  iframe.setAttribute("title", "Tisk studijního plánu");
  iframe.setAttribute("aria-hidden", "true");
  Object.assign(iframe.style, {
    position: "fixed",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0",
    border: "0",
    opacity: "0",
    pointerEvents: "none",
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    window.print();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const win = iframe.contentWindow;
  if (!win) {
    iframe.remove();
    return;
  }

  const cleanup = () => {
    window.setTimeout(() => iframe.remove(), 500);
  };

  window.setTimeout(() => {
    try {
      win.focus();
      win.addEventListener("afterprint", cleanup, { once: true });
      win.print();
      window.setTimeout(cleanup, 60_000);
    } catch {
      cleanup();
    }
  }, 100);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PA2ToAG1Overview() {
  // Default: LVL1 weeks expanded (1 & 7)
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 7]);

  const weekInfo = useMemo(
    () => [
      {
        num: 1,
        title: "Základní konstrukce C++",
        desc: "Základní syntax, správa paměti, namespacy, reference, const",
      },
      {
        num: 2,
        title: "Úvod do OOP",
        desc: "Třídy, zapouzdření, konstruktory/destruktory, konstantní metody",
      },
      {
        num: 3,
        title: "Operátory",
        desc: "Přetěžování operátorů (včetně porovnávání pro set/map)",
      },
      {
        num: 4,
        title: "Základní kontejnery",
        desc: "Znakové řetězce std::string, vector, list, iterátory",
      },
      {
        num: 5,
        title: "Pokročilejší STL",
        desc: "Statistiky slov, mapy, benchmarky kontejnerů v C++",
      },
      {
        num: 6,
        title: "Kopie a přesouvání",
        desc: "Hluboká kopie, Rule of Five, Move sémantika",
      },
      {
        num: 7,
        title: "Procházení grafů",
        desc: "Ošetření chyb (Exceptions) a procházení grafů (BFS/DFS/Dijkstra)",
      },
      {
        num: 8,
        title: "Šablony",
        desc: "Šablony funkcí a tříd, stack, queue, priority_queue",
      },
      {
        num: 9,
        title: "Šablony II",
        desc: "Šablony polí, spojové seznamy, binární vyhledávací stromy",
      },
      {
        num: 10,
        title: "Polymorfismus I",
        desc: "Dědičnost, virtuální metody, abstraktní třídy, vtabulka",
      },
      {
        num: 11,
        title: "Polymorfismus II",
        desc: "Polymorfní kontejnery, heterogenní seznamy",
      },
      {
        num: 12,
        title: "Procvičování",
        desc: "Vyhledávání v textu, balíčkovací systém, opakování před zkouškou",
      },
    ],
    []
  );

  const weekTitleByNum = useMemo(() => {
    const m = new Map<number, string>();
    for (const w of weekInfo) m.set(w.num, w.title);
    return m;
  }, [weekInfo]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNum)
        ? prev.filter((w) => w !== weekNum)
        : [...prev, weekNum]
    );
  };

  const expandAll = () =>
    setExpandedWeeks(weekInfo.map((w) => w.num));
  const collapseAll = () => setExpandedWeeks([]);

  const getWeekNumber = (item: SchoolMaterial): number => {
    if (item.category === "Trainer") {
      const match = item.name.match(/(?:Tyden|Týden)\s+(\d+)/i);
      if (match) {
        const weekNum = parseInt(match[1], 10);
        switch (weekNum) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 3:
            return 4;
          case 4:
            return 3;
          case 5:
            return 6;
          case 6:
            return 5;
          case 7:
            return 7;
          case 8:
            return 10;
          case 9:
            return 11;
          case 10:
            return 8;
          case 11:
            return 9;
          case 12:
            return 12;
          default:
            return weekNum;
        }
      }
      return 12;
    }
    if (item.category === "Lectures") {
      const match = item.name.match(/Téma\s+(\d+)/i);
      if (match) {
        const temaNum = parseInt(match[1], 10);
        switch (temaNum) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 3:
            return 3;
          case 4:
            return 6;
          case 5:
            return 4;
          case 6:
            return 7;
          case 7:
            return 10;
          case 8:
            return 11;
          case 9:
            return 8;
          case 10:
            return 9;
          case 11:
            return 5;
          case 12:
            return 12;
          default:
            return temaNum;
        }
      }
      return 12;
    }
    if (item.category === "Seminars") {
      const match = item.name.match(/(?:Proseminář|Proseminar)\s+(\d+)/i);
      if (match) {
        const semNum = parseInt(match[1], 10);
        switch (semNum) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 3:
            return 3;
          case 4:
            return 8;
          case 5:
            return 10;
          case 6:
            return 12;
          default:
            return semNum;
        }
      }
      return 12;
    }
    if (item.category === "E-learning") {
      if (item.id === "el-ch11-pt1") return 4;
      if (item.id === "el-ch11-pt2") return 5;
      const match = item.name.match(/Kapitola\s+(\d+)/i);
      if (match) {
        const cap = parseInt(match[1], 10);
        switch (cap) {
          case 2:
          case 3:
            return 1;
          case 4:
            return 2;
          case 5:
            return 2;
          case 6:
            return 3;
          case 7:
            return 6;
          case 8:
            return 4;
          case 9:
            return 7;
          case 10:
            return 8;
          case 11:
            return 5;
          case 12:
            return 7;
          case 13:
            return 10;
          default:
            return 1;
        }
      }
    }
    return 12;
  };

  const groupedByWeek = useMemo(() => {
    const groups: Record<number, Record<string, SchoolMaterial[]>> = {};
    for (let w = 1; w <= 12; w++) {
      groups[w] = {
        Trainer: [],
        Lectures: [],
        Seminars: [],
        "E-learning": [],
      };
    }
    materialsData.forEach((item) => {
      const w = getWeekNumber(item);
      if (groups[w]?.[item.category]) {
        groups[w][item.category].push(item);
      }
    });
    return groups;
  }, []);

  const visibleWeeks = useMemo(() => {
    return weekInfo.filter((week) => {
      const categories = groupedByWeek[week.num];
      if (!categories) return false;
      return Object.values(categories).some((list) => list.length > 0);
    });
  }, [groupedByWeek, weekInfo]);

  const allPlanTopics = useMemo((): PlanTopic[] => {
    const out: PlanTopic[] = [];
    for (const item of materialsData) {
      const weekNum = getWeekNumber(item);
      const weekTitle = weekTitleByNum.get(weekNum) ?? `${weekNum}. týden`;
      for (const leaf of getLeafNodes(item)) {
        out.push({
          weekNum,
          weekTitle,
          category: item.category,
          source: stripMarkdownLinks(item.name),
          topic: stripMarkdownLinks(leaf.name),
          relevance: leaf.relevance ?? 0,
          quality: leaf.quality !== false,
          badges: leaf.badges ? [...leaf.badges] : [],
        });
      }
    }
    return out.sort(
      (a, b) =>
        a.weekNum - b.weekNum ||
        a.category.localeCompare(b.category) ||
        b.relevance - a.relevance
    );
  }, [weekTitleByNum]);

  const filterPlan = useCallback(
    (level: PlanLevel): PlanTopic[] => {
      switch (level) {
        case 1:
          // LVL1: weeks 1 & 7, and only topics with relevance ≥ 70%
          return allPlanTopics.filter(
            (t) => LVL1_WEEKS.has(t.weekNum) && t.relevance >= 70
          );
        case 2:
          return allPlanTopics.filter((t) => t.relevance >= 70);
        case 3:
          return allPlanTopics.filter((t) => t.relevance >= 50);
        case 4:
          // LVL3 (≥50%) + all EPIC / MEGA EPIC themes
          return allPlanTopics.filter(
            (t) =>
              t.relevance >= 50 ||
              t.badges.includes("epic") ||
              t.badges.includes("mega_epic")
          );
        default:
          return allPlanTopics;
      }
    },
    [allPlanTopics]
  );

  // LVL4 user wording: "relevance 50%+ and in addition themes set as epic"
  // Interpret as: (relevance >= 50) UNION (epic themes) — so epic below 50% still included
  // Alternative strict AND would drop non-epic 50%+ which defeats LVL3⊂LVL4. Using union of sets:
  // base: relevance >= 50, plus any epic/mega_epic even if lower relevance.
  // Re-read: "with relevance 50%+ and in addition to that themes set as epic"
  // = LVL3 set PLUS epic themes (that may not be in LVL3). Yes union.

  const printLevel = (level: PlanLevel) => {
    const topics = filterPlan(level);
    const meta: Record<
      PlanLevel,
      { title: string; description: string }
    > = {
      1: {
        title: "LVL1 — Týdny 1 & 7 · relevance ≥ 70 %",
        description:
          "Minimální plán: speciálně zvýrazněné týdny (1. a 7.) a pouze témata s relevancí 70 % a více.",
      },
      2: {
        title: "LVL2 — Relevance ≥ 70 %",
        description:
          "Témata s relevancí 70 %+ k AG1 (barevný rámeček a pozadí v přehledu).",
      },
      3: {
        title: "LVL3 — Relevance ≥ 50 %",
        description:
          "Témata s relevancí 50 %+ (včetně barevného baru relevance).",
      },
      4: {
        title: "LVL4 — Relevance ≥ 50 % + EPIC / MEGA EPIC",
        description:
          "Vše z LVL3 a navíc témata s badge EPIC nebo MEGA EPIC (např. šablony).",
      },
    };
    printPlanDocument(meta[level].title, topics);
  };

  const stats = useMemo(() => {
    const allLeafNodes = materialsData.flatMap((item) => getLeafNodes(item));
    const total = allLeafNodes.length;
    const critical = allLeafNodes.filter(
      (m) => (m.relevance ?? 0) === 100
    ).length;
    const important = allLeafNodes.filter(
      (m) => (m.relevance ?? 0) >= 70 && (m.relevance ?? 0) < 100
    ).length;
    const lowRelevance = allLeafNodes.filter(
      (m) => (m.relevance ?? 0) < 70
    ).length;
    const badQuality = allLeafNodes.filter((m) => m.quality === false).length;
    const highQuality = allLeafNodes.filter((m) => m.quality !== false).length;
    return {
      total,
      critical,
      important,
      lowRelevance,
      badQuality,
      highQuality,
    };
  }, []);

  const allExpanded =
    visibleWeeks.length > 0 &&
    visibleWeeks.every((w) => expandedWeeks.includes(w.num));

  return (
    <div className="space-y-6">
      <style>{`
        .mega-epic-glow {
          border-color: rgba(249, 93, 18, 0.5) !important;
          box-shadow: 0 0 16px rgba(249, 93, 18, 0.25), 0 0 8px rgba(139, 92, 246, 0.15);
          border-width: 1.5px !important;
        }
        .mega-cool-week {
          border-color: rgba(192, 132, 252, 0.45) !important;
          box-shadow:
            0 0 12px rgba(249, 93, 18, 0.35),
            0 0 25px rgba(139, 92, 246, 0.32),
            0 0 50px rgba(139, 92, 246, 0.15);
          background: linear-gradient(to bottom right, #ffffff, rgba(254, 243, 199, 0.15)) !important;
          border-width: 1.5px !important;
        }
      `}</style>

      {/* Introductory comments (from author) */}
      <Card className="p-5 sm:p-6 bg-white border-stone-200 space-y-3">
        <h2 className="font-display text-lg sm:text-xl font-black text-stone-900 tracking-tight">
          Přehled FIT zdrojů z PA2 pro AG1
        </h2>
        <div className="text-sm text-stone-600 font-medium leading-relaxed space-y-2.5">
          <p>
            Vzhledem k tomu, že již existuje mnoho kvalitních studijních zdrojů
            o C++, nevěřím, že bych dokázal vytvořit nějaký „lepší“ materiál,
            který by je mohl nahradit.
          </p>
          <p>
            Místo toho jsem připravil přehled materiálů z{" "}
            <strong className="text-stone-800">PA2 z FITu</strong> o C++,
            protože{" "}
            <strong className="text-stone-800">
              právě ty potkávají studenti absolvující AG1
            </strong>
            .
          </p>
          <p>
            <strong className="text-stone-800">Manuálně</strong> jsem{" "}
            <strong className="text-stone-800">každé téma</strong> prošel{" "}
            <strong className="text-stone-800">v každém týdnu</strong>{" "}
            <strong className="text-stone-800">v každém zdroji</strong>{" "}
            (minulé prázdniny, když jsem se na AG1 připravoval) a ohodnotil jejich:{" "}
            <em>relevanci k AG1</em> a{" "}
            <em>jestli se vůbec jedná o kvalitní/dobrý zdroj</em>.
          </p>
          <p className="text-brand-orange-text font-bold">
            Čím více se toho naučíte, tím více toho budete umět &lt;3
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-700">
            <li>
              <strong>LVL1</strong>: týdny{" "}
              <em>1. &amp; 7.</em> a pouze témata s relevancí{" "}
              <em>70&nbsp;%+</em>
            </li>
            <li>
              <strong>LVL2</strong>: témata s relevancí{" "}
              <em>70&nbsp;%+</em>{" "}
              <em>(barevný rámeček a pozadí)</em>
            </li>
            <li>
              <strong>LVL3</strong>: témata s relevancí{" "}
              <em>50&nbsp;%+</em>{" "}
              <em>(barevný bar relevance)</em>
            </li>
            <li>
              <strong>LVL4</strong>: LVL3 + témata s{" "}
              <strong>EPIC</strong> / <strong>MEGA EPIC</strong>{" "}
              <em>(obzvlášť fascinující jsou šablony)</em>
            </li>
          </ul>
          <p className="text-xs text-stone-500">
            Není třeba procházet jedno téma všemi zdroji — vyberte si to, které
            vám nejvíce sedne.
          </p>
        </div>
      </Card>

      {/* Print plan levels */}
      <Card className="p-4 sm:p-5 border-stone-200 bg-stone-50/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-black text-stone-800 tracking-tight flex items-center gap-2">
              <Printer size={16} className="text-brand-orange" />
              Vytisknout studijní plán
            </h3>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              Spustí systémový dialog Tisk (Ctrl/Cmd+P) s filtrovaným plánem.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              {
                level: 1 as const,
                label: "LVL1",
                hint: "Týdny 1 & 7 · ≥ 70 %",
              },
              {
                level: 2 as const,
                label: "LVL2",
                hint: "≥ 70 %",
              },
              {
                level: 3 as const,
                label: "LVL3",
                hint: "≥ 50 %",
              },
              {
                level: 4 as const,
                label: "LVL4",
                hint: "≥ 50 % + EPIC / MEGA",
              },
            ] as const
          ).map(({ level, label, hint }) => (
            <button
              key={level}
              type="button"
              onClick={() => printLevel(level)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-orange/25 bg-white hover:bg-brand-orange/5 text-left transition-colors cursor-pointer shadow-sm"
            >
              <Printer size={14} className="text-brand-orange shrink-0" />
              <span>
                <span className="block text-xs font-black text-stone-800">
                  {label}
                </span>
                <span className="block text-[10px] font-semibold text-stone-500">
                  {hint} · {filterPlan(level).length} témat
                </span>
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-white/70">
          <span className="text-2xl font-black text-slate-850">
            {stats.total}
          </span>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">
            Celkem témat
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-orange-600/[0.03] border-orange-600/20">
          <span className="text-2xl font-black text-orange-700">
            {stats.critical + stats.important}
          </span>
          <span className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider mt-1">
            Relevantní (&ge;70%)
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-orange-500/[0.02] border-amber-500/20">
          <span className="text-2xl font-black text-amber-600">
            {stats.badQuality}
          </span>
          <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider mt-1">
            Nekvalitní
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-rose-500/[0.02] border-rose-500/10">
          <span className="text-2xl font-black text-rose-500">
            {stats.lowRelevance}
          </span>
          <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider mt-1">
            Nepodstatné (&lt;70%)
          </span>
        </Card>
      </div>

      {/* Expand / collapse toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-stone-500">
          Ve výchozím stavu jsou rozbalené týdny{" "}
          <strong className="text-stone-700">LVL1 (1 &amp; 7)</strong>.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={allExpanded ? collapseAll : expandAll}
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp size={14} /> Sbalit vše
              </>
            ) : (
              <>
                <ChevronsUpDown size={14} /> Rozbalit vše
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Weeks accordion */}
      <div className="space-y-4">
        {visibleWeeks.map((week) => {
          const isExpanded = expandedWeeks.includes(week.num);
          const weekCategories = groupedByWeek[week.num];

          let totalCount = 0;
          let relevantCount = 0;
          let warningCount = 0;

          Object.values(weekCategories).forEach((list) => {
            list.forEach((item) => {
              getLeafNodes(item).forEach((node) => {
                totalCount++;
                const relevance = node.relevance ?? 0;
                if (relevance >= 70) {
                  relevantCount++;
                  if (node.quality === false) warningCount++;
                }
              });
            });
          });

          const isMegaCoolWeek = Object.values(weekCategories).some((list) =>
            list.some(
              (item) =>
                item.tags?.includes("mega-cool") ||
                item.tags?.includes("mega_cool")
            )
          );

          const hasRelevant = relevantCount > 0;
          const hasWarning = warningCount > 0;
          const isLvl1Week = LVL1_WEEKS.has(week.num);
          const stripeColor = isMegaCoolWeek
            ? "bg-gradient-to-b from-brand-orange to-purple-600"
            : isLvl1Week
              ? "bg-brand-orange"
              : hasRelevant
                ? hasWarning
                  ? "bg-amber-500"
                  : "bg-orange-600"
                : "bg-slate-300";

          const headerBg = isMegaCoolWeek
            ? isExpanded
              ? "bg-linear-to-r from-orange-50/20 via-purple-50/10 to-white shadow-xs"
              : "bg-white hover:bg-orange-50/10"
            : isExpanded
              ? "bg-linear-to-r from-slate-50 to-white border-slate-300 shadow-xs"
              : "bg-white hover:bg-slate-50/50 border-slate-200 hover:border-slate-350";

          const containerClass = isMegaCoolWeek
            ? "border rounded-2xl overflow-hidden transition-all duration-300 mega-cool-week"
            : "border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 bg-white";

          return (
            <div key={week.num} className={containerClass}>
              <div
                onClick={() => toggleWeek(week.num)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer select-none transition-all duration-200 relative ${headerBg}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleWeek(week.num);
                  }
                }}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripeColor}`}
                />

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pl-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-brand-orange-text bg-brand-orange/10 px-2 py-0.5 rounded-lg border border-brand-orange/20 min-w-[70px] text-center">
                      {week.num}. Týden
                    </span>
                    {isLvl1Week && (
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-orange text-white">
                        LVL1
                      </span>
                    )}
                    <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                      {week.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 max-w-sm line-clamp-1">
                    {week.desc}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="hidden sm:flex gap-1.5 items-center">
                    <Badge
                      variant="slate"
                      className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase"
                    >
                      {totalCount} celkem
                    </Badge>
                    {relevantCount > 0 && (
                      <Badge
                        variant="orange"
                        className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase bg-orange-600/10 border-orange-600/20 text-orange-700"
                      >
                        {relevantCount} relevantní
                      </Badge>
                    )}
                    {warningCount > 0 && (
                      <Badge
                        variant="orange"
                        className="text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded uppercase bg-amber-500/10 border-amber-500/20 text-amber-600 animate-pulse"
                      >
                        {warningCount} varování
                      </Badge>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-150 bg-slate-50/20 divide-y divide-slate-100/80">
                  {(
                    ["Trainer", "Lectures", "Seminars", "E-learning"] as const
                  ).map((categoryKey) => {
                    const items = weekCategories[categoryKey];
                    const leafTopics = items.flatMap((item) =>
                      getLeafNodes(item)
                    );

                    let categoryIcon = null;
                    let categoryLabel = "";
                    let categoryColorClass = "";

                    switch (categoryKey) {
                      case "Trainer":
                        categoryIcon = <Terminal size={12} />;
                        categoryLabel = "Trainer";
                        categoryColorClass =
                          "text-orange-600 bg-orange-50 border-orange-200/50";
                        break;
                      case "Lectures":
                        categoryIcon = <GraduationCap size={12} />;
                        categoryLabel = "Přednášky";
                        categoryColorClass =
                          "text-amber-700 bg-amber-50/70 border-amber-200/50";
                        break;
                      case "Seminars":
                        categoryIcon = <Users size={12} />;
                        categoryLabel = "Prosemináře";
                        categoryColorClass =
                          "text-slate-700 bg-slate-100 border-slate-200/50";
                        break;
                      case "E-learning":
                        categoryIcon = <BookOpen size={12} />;
                        categoryLabel = "E-learning";
                        categoryColorClass =
                          "text-rose-700 bg-rose-50 border-rose-200/50";
                        break;
                    }

                    return (
                      <div
                        key={categoryKey}
                        className="p-4 flex flex-col md:flex-row md:items-start gap-3 min-w-0"
                      >
                        <div className="md:w-44 shrink-0 flex flex-col gap-2">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border self-start ${categoryColorClass}`}
                          >
                            {categoryIcon}
                            <span>{categoryLabel}</span>
                          </div>
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="border-l border-slate-200 pl-2 py-0.5"
                            >
                              <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                                {renderNameWithLinks(item.name)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex-1">
                          {leafTopics.length === 0 ? (
                            <p className="text-[10px] text-slate-350 italic py-1">
                              —
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {leafTopics.map((node) => {
                                const relevance = node.relevance ?? 0;
                                const quality = node.quality ?? true;
                                const isMegaEpic =
                                  node.badges?.includes("mega_epic");
                                const isLowQuality = !quality;
                                const isHigh = relevance >= 90;
                                const isMedium =
                                  relevance >= 70 && relevance < 90;

                                let cardClass =
                                  "w-fit max-w-[180px] p-2 rounded-lg border text-[10px] font-bold inline-flex flex-col gap-1.5 transition-all hover:scale-[1.02]";
                                if (isMegaEpic) cardClass += " mega-epic-glow";
                                let barColor = "";

                                if (isLowQuality) {
                                  cardClass +=
                                    " bg-slate-50/50 border-slate-200 text-slate-400 opacity-60";
                                  barColor = "bg-slate-300";
                                } else if (isHigh || isMegaEpic) {
                                  cardClass +=
                                    " bg-orange-50/80 border-brand-orange/30 text-orange-950";
                                  barColor = "bg-brand-orange";
                                } else if (isMedium) {
                                  cardClass +=
                                    " bg-amber-100/50 border-amber-300/60 text-amber-900";
                                  barColor = "bg-amber-500";
                                } else {
                                  cardClass +=
                                    " bg-slate-50/50 border-slate-200 text-slate-500";
                                  if (relevance >= 60) barColor = "bg-amber-500";
                                  else if (relevance >= 50)
                                    barColor = "bg-yellow-400";
                                  else {
                                    barColor = "bg-slate-300";
                                    cardClass =
                                      "w-fit max-w-[180px] p-2 rounded-lg border text-[10px] font-bold inline-flex flex-col gap-1.5 transition-all hover:scale-[1.02] bg-slate-50/50 border-slate-200 text-slate-400 opacity-60";
                                  }
                                }

                                return (
                                  <div
                                    key={node.id}
                                    className={cardClass}
                                    title={`${node.name} (Relevance: ${relevance}%, Quality: ${quality ? "Good" : "Bad"})`}
                                  >
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                      {(node.badges || isLowQuality) && (
                                        <div className="flex flex-wrap gap-1 items-center">
                                          {node.badges?.includes(
                                            "mega_epic"
                                          ) && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm bg-gradient-to-r from-amber-500 via-orange-500 to-[#ea580c] text-white leading-none">
                                              MEGA EPIC
                                            </span>
                                          )}
                                          {node.badges?.includes("epic") && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm bg-[#c2410c] text-white leading-none">
                                              EPIC
                                            </span>
                                          )}
                                          {node.badges?.includes("insight") && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white leading-none">
                                              INSIGHT
                                            </span>
                                          )}
                                          {node.badges?.includes(
                                            "challenge"
                                          ) && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm bg-[#9f1239] text-white leading-none">
                                              CHALLENGE
                                            </span>
                                          )}
                                          {node.badges?.includes(
                                            "practice"
                                          ) && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm bg-[#fae8ff] text-[#701a75] border border-[#d8b4fe] leading-none">
                                              PRACTICE
                                            </span>
                                          )}
                                          {node.badges?.includes(
                                            "showcase"
                                          ) && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-sm border border-dashed border-[#7c3aed] text-[#6d28d9] bg-transparent leading-none">
                                              SHOWCASE
                                            </span>
                                          )}
                                          {node.badges?.includes("no_code") && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-[2px] bg-[#fffbeb] text-[#b45309] border-l-[3px] border-[#f59e0b] rounded-[2px_6px_6px_2px] leading-none">
                                              NO CODE NEEDED
                                            </span>
                                          )}
                                          {node.badges?.includes(
                                            "not_checked"
                                          ) && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm bg-white text-black leading-none">
                                              NOT CHECKED
                                            </span>
                                          )}
                                          {isLowQuality && (
                                            <span className="text-[7.5px] font-black uppercase tracking-wider px-2 py-[2px] rounded-full bg-[#e2e8f0] text-[#475569] leading-none">
                                              LOW QUALITY
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <span className="leading-tight break-words">
                                        {renderNameWithLinks(node.name)}
                                      </span>
                                    </div>
                                    <div className="h-1 w-28 bg-slate-200/50 rounded-full overflow-hidden shrink-0 mt-auto">
                                      <div
                                        className={`h-full rounded-full ${barColor}`}
                                        style={{
                                          width: `${Math.max(relevance, 5)}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {visibleWeeks.length === 0 && (
          <div className="py-12 text-center bg-white/50 rounded-2xl border border-dashed border-slate-350">
            <AlertTriangle
              className="mx-auto text-amber-500 mb-2 animate-bounce-subtle"
              size={28}
            />
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide">
              Nebyly nalezeny žádné materiály
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}
