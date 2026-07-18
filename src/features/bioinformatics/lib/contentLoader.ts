import configJson from "../content/config.json";

/** Leaf page or nested folder under a category. */
export type FileConfig = {
  title?: string;
  order?: number;
  /** Nested children — folder node in the sidebar tree */
  files?: Record<string, FileConfig>;
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
  /** Orders along path segments after category (for tree sort) */
  pathOrders: number[];
  path: string;
  raw: string;
  /** route segments after /obor-bioinformatika/ */
  segments: string[];
};

/** Sidebar tree node */
export type NavNode =
  | {
      type: "file";
      key: string;
      title: string;
      order: number;
      material: WikiMaterial;
    }
  | {
      type: "folder";
      key: string;
      title: string;
      order: number;
      /** First page in folder (hub), if any */
      hub?: WikiMaterial;
      children: NavNode[];
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

function pathToParts(modulePath: string): {
  categoryKey: string;
  fileKey: string;
  segments: string[];
} {
  // e.g. ../content/1-semestr/bi-pa1/00-rozcestnik.md
  const cleaned = modulePath
    .replace(/^\.\.\/content\//, "")
    .replace(/\\/g, "/");
  const withoutExt = cleaned.replace(/\.md$/, "");
  const parts = withoutExt.split("/");
  const fileKey = parts[parts.length - 1];
  const categoryKey = parts.length > 1 ? parts[0] : "root";
  return { categoryKey, fileKey, segments: parts };
}

/** Walk category.files for nested path parts after the category key. */
function resolveConfigPath(
  catCfg: CategoryConfig | undefined,
  relParts: string[]
): { leaf?: FileConfig; pathOrders: number[]; folderTitles: string[] } {
  const pathOrders: number[] = [];
  const folderTitles: string[] = [];
  let files = catCfg?.files;
  let leaf: FileConfig | undefined;

  for (let i = 0; i < relParts.length; i++) {
    const part = relParts[i];
    const node = files?.[part];
    if (!node) {
      // No config entry — still allow default orders
      pathOrders.push(999);
      if (i < relParts.length - 1) folderTitles.push(part.replace(/-/g, " "));
      continue;
    }
    pathOrders.push(node.order ?? 999);
    leaf = node;
    if (i < relParts.length - 1) {
      folderTitles.push(node.title || part.replace(/-/g, " "));
      files = node.files;
    }
  }

  return { leaf, pathOrders, folderTitles };
}

function comparePathOrders(a: number[], b: number[]): number {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const ao = a[i] ?? 0;
    const bo = b[i] ?? 0;
    if (ao !== bo) return ao - bo;
  }
  return 0;
}

export function loadWikiMaterials(): WikiMaterial[] {
  const materials: WikiMaterial[] = [];

  for (const [modulePath, raw] of Object.entries(rawModules)) {
    const { categoryKey, fileKey, segments } = pathToParts(modulePath);
    const catCfg = config.categories[categoryKey];
    const relParts = segments.slice(1);
    const { leaf, pathOrders } = resolveConfigPath(catCfg, relParts);
    const fallbackTitle = fileKey.replace(/-/g, " ");
    const title = leaf?.title || titleFromMarkdown(raw, fallbackTitle);
    const fileOrder = pathOrders[pathOrders.length - 1] ?? 999;

    materials.push({
      key: fileKey,
      title,
      categoryKey,
      categoryLabel: catCfg?.label || categoryKey,
      categoryOrder: catCfg?.order ?? 999,
      fileOrder,
      pathOrders,
      path: modulePath,
      raw,
      segments,
    });
  }

  materials.sort((a, b) => {
    if (a.categoryOrder !== b.categoryOrder) {
      return a.categoryOrder - b.categoryOrder;
    }
    const byPath = comparePathOrders(a.pathOrders, b.pathOrders);
    if (byPath !== 0) return byPath;
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

/**
 * Build a nested nav tree for one category from materials + config folder labels.
 */
export function buildCategoryTree(
  categoryKey: string,
  items: WikiMaterial[]
): NavNode[] {
  const catCfg = config.categories[categoryKey];

  type MutableFolder = {
    type: "folder";
    key: string;
    title: string;
    order: number;
    hub?: WikiMaterial;
    children: Map<string, MutableFolder | NavNode>;
    childList: NavNode[];
  };

  const rootChildren = new Map<string, MutableFolder | NavNode>();

  function ensureFolder(
    parent: Map<string, MutableFolder | NavNode>,
    key: string,
    title: string,
    order: number
  ): MutableFolder {
    const existing = parent.get(key);
    if (existing && existing.type === "folder") {
      return existing as MutableFolder;
    }
    const folder: MutableFolder = {
      type: "folder",
      key,
      title,
      order,
      children: new Map(),
      childList: [],
    };
    parent.set(key, folder);
    return folder;
  }

  for (const m of items) {
    const rel = m.segments.slice(1); // drop category
    if (rel.length === 0) continue;

    let parentMap = rootChildren;
    let filesCfg = catCfg?.files;

    for (let i = 0; i < rel.length; i++) {
      const part = rel[i];
      const isLeaf = i === rel.length - 1;
      const nodeCfg = filesCfg?.[part];
      const order = nodeCfg?.order ?? m.pathOrders[i] ?? 999;
      const title =
        nodeCfg?.title ||
        (isLeaf ? m.title : part.replace(/-/g, " "));

      if (isLeaf) {
        parentMap.set(part, {
          type: "file",
          key: part,
          title: m.title,
          order,
          material: m,
        });
      } else {
        const folder = ensureFolder(parentMap, part, title, order);
        // Prefer lowest-order child as hub later; seed hub with first seen
        if (!folder.hub) folder.hub = m;
        parentMap = folder.children;
        filesCfg = nodeCfg?.files;
      }
    }
  }

  // After insert, set hub to lowest-order file descendant for each folder
  function finalize(
    map: Map<string, MutableFolder | NavNode>
  ): NavNode[] {
    const nodes: NavNode[] = [];
    for (const node of map.values()) {
      if (node.type === "file") {
        nodes.push(node);
      } else {
        const folder = node as MutableFolder;
        const children = finalize(folder.children);
        // hub = first file in sorted children (or nested)
        const hub =
          children.find((c) => c.type === "file")?.material ??
          children.find((c) => c.type === "folder")?.hub;
        nodes.push({
          type: "folder",
          key: folder.key,
          title: folder.title,
          order: folder.order,
          hub: hub ?? folder.hub,
          children,
        });
      }
    }
    nodes.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title, "cs");
    });
    return nodes;
  }

  return finalize(rootChildren);
}

export function groupByCategoryTree(materials: WikiMaterial[]) {
  return groupByCategory(materials).map((g) => ({
    ...g,
    tree: buildCategoryTree(g.key, g.items),
  }));
}

/** Filter tree: keep folders that still have matching descendants. */
export function filterNavTree(
  nodes: NavNode[],
  predicate: (m: WikiMaterial) => boolean
): NavNode[] {
  const out: NavNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      if (predicate(node.material)) out.push(node);
    } else {
      const children = filterNavTree(node.children, predicate);
      if (children.length > 0) {
        out.push({ ...node, children });
      } else if (node.hub && predicate(node.hub)) {
        // folder title itself matched via hub title handled by predicate on materials
        out.push({ ...node, children });
      }
    }
  }
  return out;
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

  // Fallback: last segment is material key (prefer unique)
  const key = segments[segments.length - 1];
  const matches = materials.filter((m) => m.key === key);
  if (matches.length === 1) return matches[0];
  // Prefer match where segments end with the same tail
  return (
    matches.find((m) =>
      segments.every(
        (s, i) => m.segments[m.segments.length - segments.length + i] === s
      )
    ) || matches[0]
  );
}

export function materialHref(m: WikiMaterial): string {
  return `/obor-bioinformatika/${m.segments.join("/")}`;
}

export function navNodeContainsPath(
  node: NavNode,
  materialPath: string | undefined
): boolean {
  if (!materialPath) return false;
  if (node.type === "file") return node.material.path === materialPath;
  return node.children.some((c) => navNodeContainsPath(c, materialPath));
}
