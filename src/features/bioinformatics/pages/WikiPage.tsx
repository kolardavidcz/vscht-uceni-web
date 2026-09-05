import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Menu,
  MessageSquarePlus,
  Printer,
  Search,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { MarkdownView } from "../components/MarkdownView";
import {
  SuggestEditModal,
  materialToRepoPath,
} from "../components/SuggestEditModal";

const prefetchPA2 = () => {
  void import("../components/PA2ToAG1Overview").catch(() => {});
};

/** Heavy materialsData tree — only load when opening the PA2 overview page */
const PA2ToAG1Overview = lazyWithRetry(() =>
  import("../components/PA2ToAG1Overview").then((m) => ({
    default: m.PA2ToAG1Overview,
  }))
);
import {
  filterNavTree,
  findMaterial,
  groupByCategoryTree,
  loadWikiMaterials,
  materialHref,
  navNodeContainsPath,
  type NavNode,
  type WikiMaterial,
} from "../lib/contentLoader";

function NavTreeList({
  nodes,
  activePath,
  depth = 0,
}: {
  nodes: NavNode[];
  activePath?: string;
  depth?: number;
}) {
  return (
    <ul className={cn("space-y-0.5", depth > 0 && "ml-2 pl-2 border-l border-stone-100")}>
      {nodes.map((node) => (
        <NavTreeItem
          key={`${node.type}-${node.key}`}
          node={node}
          activePath={activePath}
          depth={depth}
        />
      ))}
    </ul>
  );
}

function NavTreeItem({
  node,
  activePath,
  depth,
}: {
  node: NavNode;
  activePath?: string;
  depth: number;
}) {
  const containsActive = navNodeContainsPath(node, activePath);
  const [open, setOpen] = useState(containsActive || depth === 0);

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive, activePath]);

  if (node.type === "file") {
    const href = materialHref(node.material);
    const isActive = activePath === node.material.path;
    const isPA2 = node.material.path.includes("pa2-ag1-overview");
    return (
      <li>
        <Link
          to={href}
          onMouseEnter={isPA2 ? prefetchPA2 : undefined}
          onTouchStart={isPA2 ? prefetchPA2 : undefined}
          className={cn(
            "block rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            isActive
              ? "bg-brand-orange text-white shadow-sm"
              : "text-stone-700 hover:bg-stone-100"
          )}
        >
          {node.title}
        </Link>
      </li>
    );
  }

  const hubHref = node.hub ? materialHref(node.hub) : undefined;
  const folderActive =
    node.hub && activePath === node.hub.path && node.children.length > 0;

  return (
    <li>
      <div className="flex items-stretch gap-0.5">
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Sbalit" : "Rozbalit"}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-lg px-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {hubHref ? (
          <Link
            to={hubHref}
            className={cn(
              "flex-1 min-w-0 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors",
              folderActive || (containsActive && !open)
                ? "text-brand-orange-text bg-brand-orange/10"
                : "text-stone-800 hover:bg-stone-100"
            )}
          >
            {node.title}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex-1 min-w-0 text-left rounded-lg px-2 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-100 cursor-pointer"
          >
            {node.title}
          </button>
        )}
      </div>
      {open && (
        <div className="mt-0.5">
          <NavTreeList
            nodes={node.children}
            activePath={activePath}
            depth={depth + 1}
          />
        </div>
      )}
    </li>
  );
}

export function WikiPage() {
  const params = useParams();
  const splat = params["*"] || "";
  const segments = splat ? splat.split("/").filter(Boolean) : [];

  const materials = useMemo(() => loadWikiMaterials(), []);
  const groups = useMemo(() => groupByCategoryTree(materials), [materials]);
  const active = findMaterial(materials, segments);

  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  useEffect(() => {
    document.title = active
      ? `${active.title} — Bioinformatika`
      : "Obor: Bioinformatika — VŠCHT Učení";
  }, [active]);

  useEffect(() => {
    setSidebarOpen(false);
    setSuggestOpen(false);
  }, [splat]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;

    return groups
      .map((g) => {
        const byMaterial = filterNavTree(g.tree, (m) => {
          return (
            m.title.toLowerCase().includes(q) ||
            m.key.toLowerCase().includes(q) ||
            m.segments.some((s) => s.toLowerCase().includes(q))
          );
        });
        // Folder title match (e.g. "pa1") → whole subject subtree
        const byFolderTitle = expandFoldersMatchingTitle(g.tree, q);
        const tree = mergeNavTrees(byMaterial, byFolderTitle);
        return { ...g, tree };
      })
      .filter((g) => g.tree.length > 0);
  }, [groups, query]);

  const isSpecial = active?.key === "pa2-ag1-overview";
  /** Interactive special pages aren't a single .md source for full-file PR */
  const canSuggestMarkdown = Boolean(active && !isSpecial);

  const sidebar = (
    <aside className="flex flex-col h-full min-h-0 max-h-full">
      <div className="p-3 border-b border-stone-200 shrink-0">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat materiály…"
            className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs"
          />
        </div>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-3">
        {filteredGroups.map((g) => (
          <div key={g.key}>
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-stone-400 sticky top-0 bg-white/95 backdrop-blur-sm z-[1]">
              {g.label}
            </div>
            <NavTreeList nodes={g.tree} activePath={active?.path} />
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="text-xs text-stone-400 p-3">Nic nenalezeno.</p>
        )}
      </nav>
    </aside>
  );

  const suggestFooter = (material: WikiMaterial) => (
    <div className="mt-8 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <p className="text-xs text-stone-500 font-medium">
        Našli jste chybu nebo máte doplnění k tomuto materiálu?
      </p>
      <div className="flex items-center gap-2">
        {canSuggestMarkdown && (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
            title="Vytisknout stránku nebo uložit do PDF"
          >
            <Printer size={16} />
            Tisk / PDF
          </button>
        )}
        {canSuggestMarkdown ? (
          <button
            type="button"
            onClick={() => setSuggestOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-orange/25 bg-brand-orange/5 text-brand-orange-text hover:bg-brand-orange/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageSquarePlus size={16} />
            Navrhnout úpravu
          </button>
        ) : (
          <a
            href={`mailto:kolarv@vscht.cz?subject=${encodeURIComponent(
              `Návrh úpravy: ${material.title}`
            )}&body=${encodeURIComponent(
              `Stránka: ${material.title}\n\nNávrh:\n`
            )}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-orange/25 bg-brand-orange/5 text-brand-orange-text hover:bg-brand-orange/10 text-xs font-bold transition-colors"
          >
            <MessageSquarePlus size={16} />
            Navrhnout úpravu (e-mail)
          </a>
        )}
      </div>
    </div>
  );

  return (
    <PageShell
      title="Obor: Bioinformatika"
      subtitle="Studijní wiki · zápisky, rozcestníky, PA2→AG1"
      theme="light"
      maxWidth="max-w-7xl"
      actions={
        <div className="flex items-center gap-2">
          {active && !isSpecial && (
            <Button
              variant="dark"
              size="sm"
              onClick={() => window.print()}
              title="Vytisknout nebo uložit do PDF"
              className="text-xs font-bold gap-1.5 hidden sm:inline-flex border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-brand-orange/50 hover:text-brand-orange cursor-pointer"
            >
              <Printer size={15} className="text-brand-orange" /> Tisk / PDF
            </Button>
          )}
          <Button
            variant="dark"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} /> Materiály
          </Button>
        </div>
      }
    >
      <div className="flex gap-6 items-start min-h-[70vh]">
        <div className="hidden lg:flex w-72 shrink-0 flex-col rounded-2xl border border-stone-200 bg-white shadow-sm sticky top-24 self-start h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] min-h-0 overflow-hidden print:hidden">
          {sidebar}
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden print:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[min(20rem,90vw)] bg-white shadow-xl flex flex-col min-h-0">
              <div className="flex items-center justify-between p-3 border-b shrink-0">
                <span className="font-bold text-sm">Materiály</span>
                <button
                  type="button"
                  className="p-2 cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {sidebar}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 print:w-full">
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5 sm:p-8 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
            {!active ? (
              <div className="text-center py-16 text-stone-500">
                <BookOpen className="mx-auto mb-3 text-brand-orange" size={32} />
                <p className="font-semibold">Vyberte materiál v bočním panelu</p>
              </div>
            ) : isSpecial ? (
              <>
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <p className="text-sm text-stone-500 font-semibold py-8 text-center">
                        Načítám PA2→AG1 přehled…
                      </p>
                    }
                  >
                    <PA2ToAG1Overview />
                  </Suspense>
                </ErrorBoundary>
                {suggestFooter(active)}
              </>
            ) : (
              <>
                <MarkdownView key={active.path} content={active.raw} />
                {suggestFooter(active)}
              </>
            )}
          </div>
        </div>
      </div>

      {suggestOpen && active && canSuggestMarkdown && (
        <SuggestEditModal
          material={active}
          repoFilePath={materialToRepoPath(active)}
          onClose={() => setSuggestOpen(false)}
        />
      )}
    </PageShell>
  );
}

/** If a folder title matches the query, include the full original subtree. */
function expandFoldersMatchingTitle(nodes: NavNode[], q: string): NavNode[] {
  const out: NavNode[] = [];
  for (const node of nodes) {
    if (node.type === "folder") {
      if (node.title.toLowerCase().includes(q) || node.key.toLowerCase().includes(q)) {
        out.push(node);
      } else {
        const children = expandFoldersMatchingTitle(node.children, q);
        if (children.length > 0) {
          out.push({ ...node, children });
        }
      }
    } else if (
      node.title.toLowerCase().includes(q) ||
      node.key.toLowerCase().includes(q)
    ) {
      out.push(node);
    }
  }
  return out;
}

function mergeNavTrees(a: NavNode[], b: NavNode[]): NavNode[] {
  const byKey = new Map<string, NavNode>();
  for (const n of [...a, ...b]) {
    const k = `${n.type}:${n.key}`;
    const prev = byKey.get(k);
    if (!prev) {
      byKey.set(k, n);
      continue;
    }
    if (prev.type === "folder" && n.type === "folder") {
      byKey.set(k, {
        ...prev,
        children: mergeNavTrees(prev.children, n.children),
      });
    }
  }
  return Array.from(byKey.values()).sort((x, y) => {
    if (x.order !== y.order) return x.order - y.order;
    return x.title.localeCompare(y.title, "cs");
  });
}
