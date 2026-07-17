import configJson from "../content/config.json";

export type FileConfig = {
  title?: string;
  order?: number;
};

export type CategoryConfig = {
  label: string;
  order: number;
  files?: Record<string, FileConfig>;
};

export type WikiConfig = {
  categories: Record<string, CategoryConfig>;
};

export type WikiMaterial = {
  key: string;
  title: string;
  categoryKey: string;
  categoryLabel: string;
  categoryOrder: number;
  fileOrder: number;
  path: string;
  raw: string;
  /** route segments after /obor-bioinformatika/ */
  segments: string[];
};

const config = configJson as WikiConfig;

const rawModules = import.meta.glob("../content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function titleFromMarkdown(raw: string, fallback: string): string {
  const match = raw.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

function pathToParts(modulePath: string): { categoryKey: string; fileKey: string; segments: string[] } {
  // e.g. ../content/1-semestr/bi-pa-1.md or ../content/ag1/pa2-ag1-overview.md
  const cleaned = modulePath
    .replace(/^\.\.\/content\//, "")
    .replace(/\\/g, "/");
  const withoutExt = cleaned.replace(/\.md$/, "");
  const parts = withoutExt.split("/");
  const fileKey = parts[parts.length - 1];
  const categoryKey = parts.length > 1 ? parts[0] : "root";
  return { categoryKey, fileKey, segments: parts };
}

export function loadWikiMaterials(): WikiMaterial[] {
  const materials: WikiMaterial[] = [];

  for (const [modulePath, raw] of Object.entries(rawModules)) {
    const { categoryKey, fileKey, segments } = pathToParts(modulePath);
    const catCfg = config.categories[categoryKey];
    const fileCfg = catCfg?.files?.[fileKey];
    const fallbackTitle = fileKey.replace(/-/g, " ");
    const title =
      fileCfg?.title || titleFromMarkdown(raw, fallbackTitle);

    materials.push({
      key: fileKey,
      title,
      categoryKey,
      categoryLabel: catCfg?.label || categoryKey,
      categoryOrder: catCfg?.order ?? 999,
      fileOrder: fileCfg?.order ?? 999,
      path: modulePath,
      raw,
      segments,
    });
  }

  materials.sort((a, b) => {
    if (a.categoryOrder !== b.categoryOrder) {
      return a.categoryOrder - b.categoryOrder;
    }
    if (a.fileOrder !== b.fileOrder) return a.fileOrder - b.fileOrder;
    return a.title.localeCompare(b.title, "cs");
  });

  return materials;
}

export function groupByCategory(materials: WikiMaterial[]) {
  const map = new Map<
    string,
    { label: string; order: number; items: WikiMaterial[] }
  >();
  for (const m of materials) {
    if (!map.has(m.categoryKey)) {
      map.set(m.categoryKey, {
        label: m.categoryLabel,
        order: m.categoryOrder,
        items: [],
      });
    }
    map.get(m.categoryKey)!.items.push(m);
  }
  return Array.from(map.entries())
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => a.order - b.order);
}

export function findMaterial(
  materials: WikiMaterial[],
  segments: string[]
): WikiMaterial | undefined {
  if (segments.length === 0) return materials[0];

  // Try exact path match first
  const joined = segments.join("/");
  const byPath = materials.find((m) => m.segments.join("/") === joined);
  if (byPath) return byPath;

  // Fallback: last segment is material key
  const key = segments[segments.length - 1];
  return materials.find((m) => m.key === key);
}

export function materialHref(m: WikiMaterial): string {
  return `/obor-bioinformatika/${m.segments.join("/")}`;
}
