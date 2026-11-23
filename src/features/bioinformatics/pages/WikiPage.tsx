import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  List,
  Menu,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  Search,
  X,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { MarkdownView } from "../components/MarkdownView";
import {
  SuggestEditModal,
  materialToRepoPath,
} from "../components/SuggestEditModal";
import { WikiSearchModal } from "../components/WikiSearchModal";
import {
  findMaterial,
  groupByCategoryTree,
  loadWikiMaterials,
  materialHref,
  navNodeContainsPath,
  searchNavTree,
  type NavNode,
  type WikiMaterial,
} from "../lib/contentLoader";
import {
  extractHeadings,
  flattenNavOrder,
  type WikiHeading,
} from "../lib/wikiHelpers";

const prefetchPA2 = () => {
  void import("../components/PA2ToAX1Overview").catch(() => {});
};

/** Heavy materialsData tree - only load when opening the PA2 overview page */
const PA2ToAX1Overview = lazyWithRetry(() =>
  import("../components/PA2ToAX1Overview").then((m) => ({
    default: m.PA2ToAX1Overview,
  }))
);

function NavTreeList({
  nodes,
  activePath,
  depth = 0,
  isSearching = false,
}: {
  nodes: NavNode[];
  activePath?: string;
  depth?: number;
  isSearching?: boolean;
}) {
  return (
    <ul
      className={cn(
        "space-y-0.5 min-w-0",
        depth > 0 && "ml-1.5 pl-1.5 border-l border-stone-100"
      )}
    >
      {nodes.map((node) => (
        <NavTreeItem
          key={`${node.type}-${node.key}`}
          node={node}
          activePath={activePath}
          depth={depth}
          isSearching={isSearching}
        />
      ))}
    </ul>
  );
}

function NavTreeItem({
  node,
  activePath,
  depth,
  isSearching = false,
}: {
  node: NavNode;
  activePath?: string;
  depth: number;
  isSearching?: boolean;
}) {
  const containsActive = navNodeContainsPath(node, activePath);
  const [open, setOpen] = useState(containsActive);

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive, activePath]);

  if (node.type === "file") {
    if (node.material.externalUrl) {
      return (
        <li className="min-w-0">
          <a
            href={node.material.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${node.title} (otevře externí stránku)`}
            className="flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-brand-orange transition-colors truncate group cursor-pointer"
          >
            <span className="truncate">{node.title}</span>
            <ExternalLink
              size={12}
              className="shrink-0 text-stone-400 group-hover:text-brand-orange transition-colors"
            />
          </a>
        </li>
      );
    }

    const href = materialHref(node.material);
    const isActive = activePath === node.material.path;
    const isPA2 = node.material.path.includes("pa2-ax1-overview");
    return (
      <li className="min-w-0">
        <Link
          to={href}
          title={node.title}
          onMouseEnter={isPA2 ? prefetchPA2 : undefined}
          onTouchStart={isPA2 ? prefetchPA2 : undefined}
          className={cn(
            "block rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors truncate",
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

  const hubHref =
    node.hub && !node.hub.externalUrl ? materialHref(node.hub) : undefined;
  const folderActive =
    node.hub && activePath === node.hub.path && node.children.length > 0;
  const isOpen = isSearching || open;

  return (
    <li className="min-w-0">
      <div className="flex items-stretch gap-0.5 min-w-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Sbalit" : "Rozbalit"}
          onClick={() => setOpen(!isOpen)}
          className="shrink-0 rounded-lg px-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {hubHref ? (
          <Link
            to={hubHref}
            title={node.title}
            className={cn(
              "flex-1 min-w-0 rounded-lg px-1.5 py-1.5 text-xs font-bold transition-colors truncate",
              folderActive || (containsActive && !isOpen)
                ? "text-brand-orange-text bg-brand-orange/10"
                : "text-stone-800 hover:bg-stone-100"
            )}
          >
            {node.title}
          </Link>
        ) : (
          <button
            type="button"
            title={node.title}
            onClick={() => setOpen(!isOpen)}
            className="flex-1 min-w-0 text-left rounded-lg px-1.5 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-100 cursor-pointer truncate"
          >
            {node.title}
          </button>
        )}
      </div>
      {isOpen && (
        <div className="mt-0.5">
          <NavTreeList
            nodes={node.children}
            activePath={activePath}
            depth={depth + 1}
            isSearching={isSearching}
          />
        </div>
      )}
    </li>
  );
}

function TableOfContents({
  headings,
  activeId,
}: {
  headings: WikiHeading[];
  activeId: string;
}) {
  if (headings.length < 2) return null;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] print:hidden">
      <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-3.5 shadow-xs flex flex-col min-h-0">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2.5 shrink-0">
          <List size={12} className="text-brand-orange" />
          <span>Na této stránce</span>
        </div>
        <nav className="overflow-y-auto space-y-1 pr-1 [scrollbar-width:thin]">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => jumpTo(h.id)}
                title={h.text}
                className={cn(
                  "block w-full text-left text-[11px] leading-snug rounded-lg px-2 py-1 transition-colors cursor-pointer truncate",
                  h.level === 3 && "pl-4 text-[10.5px]",
                  isActive
                    ? "bg-orange-50 text-brand-orange-text font-bold border-l-2 border-brand-orange rounded-l-none"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50 font-medium"
                )}
              >
                {h.text}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function WikiPage() {
  const params = useParams();
  const location = useLocation();
  const splat = params["*"] || "";
  const segments = splat ? splat.split("/").filter(Boolean) : [];

  const materials = useMemo(() => loadWikiMaterials(), []);
  const groups = useMemo(() => groupByCategoryTree(materials), [materials]);
  const linearMaterials = useMemo(() => flattenNavOrder(groups), [groups]);
  const active = findMaterial(materials, segments);

  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return (
        localStorage.getItem("wiki_sidebar_collapsed") === "true" ||
        localStorage.getItem("wiki_sidebar_hidden") === "true"
      );
    } catch {
      return false;
    }
  });

  const isSpecial = active?.key === "pa2-ax1-overview";
  /** Interactive special pages & external redirect pages aren't a single .md source for full-file PR */
  const canSuggestMarkdown = Boolean(
    active && !isSpecial && !active.externalUrl
  );

  const headings = useMemo(() => {
    if (!active || isSpecial || active.externalUrl) return [];
    return extractHeadings(active.raw);
  }, [active, isSpecial]);

  const { prevMaterial, nextMaterial } = useMemo(() => {
    if (!active) return { prevMaterial: undefined, nextMaterial: undefined };
    const idx = linearMaterials.findIndex((m) => m.path === active.path);
    if (idx < 0) return { prevMaterial: undefined, nextMaterial: undefined };
    return {
      prevMaterial: idx > 0 ? linearMaterials[idx - 1] : undefined,
      nextMaterial:
        idx < linearMaterials.length - 1 ? linearMaterials[idx + 1] : undefined,
    };
  }, [active, linearMaterials]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("wiki_sidebar_collapsed", String(next));
        localStorage.setItem("wiki_sidebar_hidden", String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && key === "b") {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.title = active
      ? `${active.title} - Bioinformatika`
      : "Obor: Bioinformatika - VŠCHT Učení";
  }, [active]);

  useEffect(() => {
    if (active?.externalUrl) {
      try {
        const parsed = new URL(active.externalUrl, window.location.origin);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          window.location.replace(parsed.href);
        } else {
          console.warn(
            "Zablokován pokus o přesměrování na nepovolený protokol:",
            active.externalUrl
          );
        }
      } catch {
        console.error("Neplatná externí URL:", active.externalUrl);
      }
    }
  }, [active?.externalUrl]);

  // Reset transient overlays and scroll cleanly on route or hash changes
  useEffect(() => {
    setSidebarOpen(false);
    setSuggestOpen(false);

    const rawHash = location.hash.replace(/^#/, "");
    if (!rawHash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    const decodedHash = decodeURIComponent(rawHash);
    const timer = window.setTimeout(() => {
      let target = document.getElementById(decodedHash);
      if (!target) {
        // Forgiving suffix/substring match for legacy section hashes (e.g. without leading number)
        const allHeadings = Array.from(
          document.querySelectorAll<HTMLElement>(".wiki-prose h2[id], .wiki-prose h3[id]")
        );
        target =
          allHeadings.find(
            (el) => el.id.endsWith(decodedHash) || el.id.includes(decodedHash)
          ) ?? null;
      }
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [splat, location.hash]);

  // Track active heading in Table of Contents
  useEffect(() => {
    if (headings.length < 2 || typeof IntersectionObserver === "undefined") {
      setActiveHeadingId("");
      return;
    }
    setActiveHeadingId(headings[0].id);

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]?.target?.id) {
          setActiveHeadingId(visible[0].target.id);
        }
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0.1 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [headings, active?.path]);

  const filteredGroups = useMemo(() => {
    const q = query.trim();
    if (!q) return groups;

    return groups
      .map((g) => ({
        ...g,
        tree: searchNavTree(g.tree, q),
      }))
      .filter((g) => g.tree.length > 0);
  }, [groups, query]);

  const renderSidebarContent = (collapsed: boolean) => (
    <aside className="flex flex-col h-full min-h-0 max-h-full">
      <div className="h-13 px-2 border-b border-stone-200 shrink-0 flex items-center justify-between gap-1 overflow-hidden">
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Rozbalit postranní panel (Ctrl+B)"
            className="w-full flex items-center justify-between gap-1 px-1.5 py-2 rounded-xl text-stone-700 hover:text-brand-orange-text hover:bg-orange-50/60 transition-colors cursor-pointer group min-w-0"
            aria-label="Rozbalit postranní panel"
          >
            <span className="text-xs font-bold truncate text-stone-800 group-hover:text-brand-orange">
              Materiály
            </span>
            <PanelLeftOpen
              size={16}
              className="text-brand-orange shrink-0 group-hover:scale-110 transition-transform"
            />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 w-full min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrovat materiály…"
                className="w-full rounded-xl border border-stone-200 bg-white pl-8 pr-7 py-1.5 text-xs focus:outline-none focus:border-brand-orange"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Vymazat filtr"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Sbalit postranní panel (Ctrl+B)"
              className="flex items-center justify-center p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              aria-label="Sbalit postranní panel"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
        )}
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-3 [scrollbar-width:thin]">
        {filteredGroups.map((g) => (
          <div key={g.key} className="min-w-0">
            <div
              title={g.label}
              className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-stone-400 sticky top-0 bg-white/95 backdrop-blur-sm z-[1] truncate"
            >
              {g.label}
            </div>
            <NavTreeList
              nodes={g.tree}
              activePath={active?.path}
              isSearching={Boolean(query.trim())}
            />
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <p className="text-xs text-stone-400 p-3">Nic nenalezeno.</p>
        )}
      </nav>
    </aside>
  );

  const prevNextFooter =
    prevMaterial || nextMaterial ? (
      <div className="mt-8 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
        {prevMaterial ? (
          <Link
            to={materialHref(prevMaterial)}
            className="group flex items-center gap-3 p-3.5 rounded-xl border border-stone-200/90 hover:border-brand-orange/40 hover:bg-orange-50/30 transition-colors min-w-0"
          >
            <ArrowLeft
              size={16}
              className="shrink-0 text-stone-400 group-hover:text-brand-orange group-hover:-translate-x-0.5 transition-all"
            />
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                Předchozí
              </div>
              <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-brand-orange-text truncate">
                {prevMaterial.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
        {nextMaterial && (
          <Link
            to={materialHref(nextMaterial)}
            className="group flex items-center justify-end gap-3 p-3.5 rounded-xl border border-stone-200/90 hover:border-brand-orange/40 hover:bg-orange-50/30 transition-colors text-right min-w-0"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                Další
              </div>
              <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-brand-orange-text truncate">
                {nextMaterial.title}
              </div>
            </div>
            <ArrowRight
              size={16}
              className="shrink-0 text-stone-400 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        )}
      </div>
    ) : null;

  const suggestFooter = (material: WikiMaterial) => (
    <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <p className="text-xs text-stone-500 font-medium">
        Našli jste chybu nebo máte doplnění k tomuto materiálu?
      </p>
      <div className="flex items-center gap-2">
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
      subtitle="Studijní wiki · zápisky, rozcestníky, PA2→AX1"
      theme="light"
      maxWidth="max-w-[1600px]"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="dark"
            size="sm"
            onClick={() => setSearchModalOpen(true)}
            title="Fulltextové vyhledávání ve všech materiálech (Ctrl+K)"
            className="text-xs font-bold gap-1.5 border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-brand-orange/50 hover:text-brand-orange cursor-pointer"
          >
            <Search size={14} className="text-brand-orange" />
            <span className="hidden sm:inline">Hledat</span>
            <kbd className="hidden md:inline-block ml-0.5 px-1 py-0.5 text-[9px] rounded bg-white/10 text-orange-100/90 border border-white/15">
              Ctrl+K
            </kbd>
          </Button>
          <Button
            variant="dark"
            size="sm"
            onClick={toggleSidebar}
            title={
              isSidebarCollapsed
                ? "Rozbalit postranní panel (Ctrl+B)"
                : "Sbalit postranní panel pro širší zobrazení (Ctrl+B)"
            }
            className="hidden lg:inline-flex text-xs font-bold gap-1.5 border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-brand-orange/50 hover:text-brand-orange cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <>
                <PanelLeftOpen size={15} className="text-brand-orange" />
                <span>Rozbalit panel</span>
              </>
            ) : (
              <>
                <PanelLeftClose size={15} className="text-brand-orange" />
                <span>Sbalit panel</span>
              </>
            )}
          </Button>
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
      <div className="flex gap-4 lg:gap-6 items-start min-h-[70vh]">
        {/* Desktop Sidebar: stays permanently mounted, smoothly animates width between w-72 and w-36 */}
        <div
          className={cn(
            "hidden lg:flex flex-col rounded-2xl border border-stone-200 bg-white shadow-sm sticky top-24 self-start h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] min-h-0 overflow-hidden print:hidden shrink-0 transition-[width] duration-300 ease-in-out",
            isSidebarCollapsed ? "w-36" : "w-72"
          )}
        >
          {renderSidebarContent(isSidebarCollapsed)}
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
                {renderSidebarContent(false)}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 print:w-full transition-all duration-300 ease-in-out">
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5 sm:p-8 lg:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
            {!active ? (
              <div className="text-center py-16 text-stone-500">
                <BookOpen
                  className="mx-auto mb-3 text-brand-orange"
                  size={32}
                />
                <p className="font-semibold">
                  Vyberte materiál v bočním panelu
                </p>
              </div>
            ) : active.externalUrl ? (
              <div className="text-center py-16 px-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center mx-auto mb-4 border border-brand-orange/20">
                  <ExternalLink size={26} />
                </div>
                <h1 className="text-xl font-bold text-stone-900 mb-2">
                  Přesměrování na externí stránku
                </h1>
                <p className="text-sm text-stone-600 mb-6">
                  Probíhá přesměrování na{" "}
                  <strong className="text-stone-800">{active.title}</strong>:
                  <br />
                  <a
                    href={active.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-brand-orange hover:underline font-semibold break-all mt-1 inline-block"
                  >
                    {active.externalUrl}
                  </a>
                </p>
                <a
                  href={active.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white font-bold text-sm shadow-sm hover:bg-orange-600 transition-colors"
                >
                  Přejít na stránku <ExternalLink size={14} />
                </a>
              </div>
            ) : isSpecial ? (
              <>
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <p className="text-sm text-stone-500 font-semibold py-8 text-center">
                        Načítám PA2→AX1 přehled…
                      </p>
                    }
                  >
                    <PA2ToAX1Overview />
                  </Suspense>
                </ErrorBoundary>
                {prevNextFooter}
                {suggestFooter(active)}
              </>
            ) : (
              <>
                <MarkdownView key={active.path} content={active.raw} />
                {prevNextFooter}
                {suggestFooter(active)}
              </>
            )}
          </div>
        </div>

        <TableOfContents headings={headings} activeId={activeHeadingId} />
      </div>

      {suggestOpen && active && canSuggestMarkdown && (
        <SuggestEditModal
          material={active}
          repoFilePath={materialToRepoPath(active)}
          onClose={() => setSuggestOpen(false)}
        />
      )}

      {searchModalOpen && (
        <WikiSearchModal
          materials={materials}
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </PageShell>
  );
}
