export type PlanTopic = {
  weekNum: number;
  weekTitle: string;
  category: string;
  source: string;
  topic: string;
  relevance: number;
  quality: boolean;
  badges: string[];
};

/** LVL1: specially highlighted weeks */
export const LVL1_WEEKS = new Set([1, 7]);

/** Relevance bar + label color (website mapping). */
export function printRelClasses(t: PlanTopic): { bar: string; pct: string } {
  const r = t.relevance;
  const isMega = t.badges.includes("mega_epic");
  if (t.quality === false) return { bar: "bar-slate", pct: "pct-muted" };
  if (isMega || r >= 90) return { bar: "bar-orange", pct: "pct-high" };
  if (r >= 70) return { bar: "bar-amber", pct: "pct-mid" };
  if (r >= 60) return { bar: "bar-amber", pct: "pct-ok" };
  if (r >= 50) return { bar: "bar-yellow", pct: "pct-ok" };
  return { bar: "bar-slate", pct: "pct-muted" };
}

export function printBadgeHtml(badges: string[], lowQuality: boolean): string {
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
    chips.push(`<span class="chip chip-nocode">NO CODE NEEDED</span>`);
  if (badges.includes("not_checked"))
    chips.push(`<span class="chip chip-unchecked">NOT CHECKED</span>`);
  if (lowQuality)
    chips.push(`<span class="chip chip-lowq">LOW QUALITY</span>`);
  return chips.length ? `<span class="chips">${chips.join("")}</span>` : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Print via hidden iframe + system Print dialog.
 * Multiline checklist; colorful tags + relevance; light/transparent row bg.
 */
export function printPlanDocument(title: string, topics: PlanTopic[]) {
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
