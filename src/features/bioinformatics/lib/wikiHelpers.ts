import type { NavNode, WikiMaterial } from "./contentLoader";

export type WikiHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type WikiSearchHit = {
  material: WikiMaterial;
  score: number;
  snippet: string;
  matchType: "title" | "heading" | "content";
};

/** Removes Czech/Unicode diacritics and lowercases for forgiving search & slugs. */
export function stripDiacritics(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Strips inline markdown formatting from a heading or text fragment. */
export function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generates a deterministic ASCII URL-safe anchor slug for a Markdown heading.
 * Matches existing Czech cross-links (e.g. `4. Lokální testování ze souborů (testshell.sh)` -> `4-lokalni-testovani-ze-souboru-testshellsh`).
 */
export function slugifyHeading(text: string): string {
  const clean = stripMarkdownFormatting(text);
  return stripDiacritics(clean)
    .replace(/[().`'"„“‚‘:;,!?/\\]/g, "")
    .replace(/[^a-z0-9\s-]+/g, " ")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Creates a slug allocator that deduplicates repeated headings within a single document.
 */
export function createHeadingSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugifyHeading(text) || "sekce";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

/**
 * Extracts level 2 and 3 headings from Markdown outside fenced code blocks.
 */
export function extractHeadings(markdown: string): WikiHeading[] {
  const headings: WikiHeading[] = [];
  const nextSlug = createHeadingSlugger();
  let inCodeBlock = false;

  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = stripMarkdownFormatting(match[2]);
    if (!text) continue;

    headings.push({
      level,
      text,
      id: nextSlug(text),
    });
  }

  return headings;
}

/** Strips raw HTML, SVG diagrams, and markdown noise for clean full-text search & snippets. */
export function markdownToPlainText(raw: string): string {
  return raw
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/```[a-zA-Z0-9_-]*\n?/g, " ")
    .replace(/[`*_~#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Diacritic-insensitive full-text search across wiki titles, headings, paths, and body text.
 */
export function searchMaterialsFullText(
  materials: WikiMaterial[],
  query: string,
  limit = 12
): WikiSearchHit[] {
  const normalizedQuery = stripDiacritics(query.trim());
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const hits: WikiSearchHit[] = [];

  for (const material of materials) {
    const normTitle = stripDiacritics(material.title);
    const normPath = stripDiacritics(
      `${material.categoryLabel} ${material.segments.join(" ")}`
    );
    const plain = markdownToPlainText(material.raw);
    const normPlain = stripDiacritics(plain);

    const allTokensMatch = tokens.every(
      (t) => normTitle.includes(t) || normPath.includes(t) || normPlain.includes(t)
    );
    if (!allTokensMatch) continue;

    let score = 0;
    let matchType: WikiSearchHit["matchType"] = "content";

    if (normTitle.includes(normalizedQuery)) {
      score += 120;
      matchType = "title";
    } else if (tokens.every((t) => normTitle.includes(t))) {
      score += 90;
      matchType = "title";
    } else if (normPath.includes(normalizedQuery)) {
      score += 65;
      matchType = "title";
    }

    // Check heading match
    const headings = extractHeadings(material.raw);
    const matchedHeading = headings.find((h) =>
      tokens.every((t) => stripDiacritics(h.text).includes(t))
    );
    if (matchedHeading) {
      score += 50;
      if (matchType === "content") matchType = "heading";
    }

    // Extract context snippet around first occurrence in plain text
    let matchIndex = normPlain.indexOf(normalizedQuery);
    if (matchIndex < 0) {
      matchIndex = normPlain.indexOf(tokens[0]);
    }

    if (matchIndex >= 0) {
      score += 20;
    }

    let snippet = "";
    if (matchedHeading && matchType === "heading") {
      snippet = `Sekce: ${matchedHeading.text}`;
    } else if (matchIndex >= 0) {
      const start = Math.max(0, matchIndex - 55);
      const end = Math.min(plain.length, matchIndex + normalizedQuery.length + 95);
      snippet =
        (start > 0 ? "…" : "") +
        plain.slice(start, end).trim() +
        (end < plain.length ? "…" : "");
    } else {
      snippet = plain.slice(0, 130).trim() + (plain.length > 130 ? "…" : "");
    }

    hits.push({ material, score, snippet, matchType });
  }

  hits.sort(
    (a, b) =>
      b.score - a.score ||
      a.material.categoryOrder - b.material.categoryOrder ||
      a.material.title.localeCompare(b.material.title, "cs")
  );

  return hits.slice(0, limit);
}

/** Flattens the sidebar tree into linear reading order (skipping external redirect links). */
export function flattenNavOrder(
  groups: Array<{ tree: NavNode[] }>
): WikiMaterial[] {
  const out: WikiMaterial[] = [];
  const walk = (nodes: NavNode[]) => {
    for (const node of nodes) {
      if (node.type === "file") {
        if (!node.material.externalUrl) {
          out.push(node.material);
        }
      } else {
        walk(node.children);
      }
    }
  };
  for (const g of groups) {
    walk(g.tree);
  }
  return out;
}
