import {
  useEffect,
  useRef,
  useMemo,
  useState,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
// Subset only languages we use in wiki fences - full highlight.js is huge
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import {
  contentMayHaveMath,
  loadMathJax,
  makeMathJaxContainerSelectable,
} from "@/lib/loadMathJax";
import { createHeadingSlugger } from "../lib/wikiHelpers";

type Props = {
  content: string;
};

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  node?: unknown;
};

const highlightLanguages = {
  c,
  cpp,
  bash,
  sh: bash,
  shell: bash,
  python,
  py: python,
  json,
  plaintext,
  text: plaintext,
};

const SAFE_SVG_TAGS = [
  "svg",
  "g",
  "defs",
  "marker",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "title",
];

const SVG_COMMON_ATTRS = [
  "className",
  "fill",
  "stroke",
  "strokeWidth",
  "stroke-width",
  "strokeDasharray",
  "stroke-dasharray",
  "strokeLinecap",
  "stroke-linecap",
  "strokeLinejoin",
  "stroke-linejoin",
  "opacity",
  "fillOpacity",
  "strokeOpacity",
  "transform",
  "id",
];

export const wikiSanitizeSchema = {
  ...defaultSchema,
  clobberPrefix: "",
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "div",
    "span",
    "details",
    "summary",
    "iframe",
    ...SAFE_SVG_TAGS,
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] || []),
      "className",
      "style",
      "ariaLabel",
      "aria-label",
      "ariaHidden",
      "aria-hidden",
    ],
    div: [
      ...(defaultSchema.attributes?.div || []),
      "dataLabel",
      "data-label",
    ],
    details: ["open", "className"],
    a: [
      ...(defaultSchema.attributes?.a || []),
      "target",
      "rel",
      "download",
    ],
    iframe: [
      [
        "src",
        /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/,
      ],
      "allowFullScreen",
      "allowfullscreen",
      "width",
      "height",
      "frameBorder",
      "frameborder",
      "className",
      "title",
    ],
    svg: [
      ...SVG_COMMON_ATTRS,
      "viewBox",
      "xmlns",
      "width",
      "height",
      "preserveAspectRatio",
      "role",
    ],
    g: [...SVG_COMMON_ATTRS],
    defs: ["id"],
    marker: [
      ...SVG_COMMON_ATTRS,
      "viewBox",
      "markerWidth",
      "markerHeight",
      "refX",
      "refY",
      "orient",
      "markerUnits",
    ],
    path: [...SVG_COMMON_ATTRS, "d", "markerEnd", "markerStart", "markerMid"],
    circle: [...SVG_COMMON_ATTRS, "cx", "cy", "r"],
    ellipse: [...SVG_COMMON_ATTRS, "cx", "cy", "rx", "ry"],
    rect: [...SVG_COMMON_ATTRS, "x", "y", "width", "height", "rx", "ry"],
    line: [
      ...SVG_COMMON_ATTRS,
      "x1",
      "y1",
      "x2",
      "y2",
      "markerEnd",
      "markerStart",
    ],
    polyline: [...SVG_COMMON_ATTRS, "points", "markerEnd", "markerStart"],
    polygon: [...SVG_COMMON_ATTRS, "points"],
    text: [
      ...SVG_COMMON_ATTRS,
      "x",
      "y",
      "dx",
      "dy",
      "fontFamily",
      "font-family",
      "fontSize",
      "font-size",
      "fontWeight",
      "font-weight",
      "textAnchor",
      "text-anchor",
      "dominantBaseline",
      "dominant-baseline",
    ],
    tspan: [
      ...SVG_COMMON_ATTRS,
      "x",
      "y",
      "dx",
      "dy",
      "fontSize",
      "fontWeight",
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "mailto"],
    src: ["http", "https"],
  },
};

/**
 * Normalizes lists to ensure consistent 4-space indentation for nesting.
 * This guarantees CommonMark lists parse correctly up to 5+ levels
 * even when using mixed delimiters like *, -, 1. or 1).
 */
function normalizeMarkdownLists(content: string): string {
  const lines = content.split(/\r?\n/);
  const result: string[] = [];
  const stack: number[] = [0];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    if (trimmed === "") {
      result.push(line);
      continue;
    }

    const listMatch = line.match(
      /^(\s*)([*+-]|\d+(?:\.\d+)*[.)])(?:\s+(.*)|$)$/
    );

    const matchIndent = line.match(/^(\s*)/);
    const origIndent = matchIndent ? matchIndent[0].length : 0;

    if (listMatch) {
      const marker = listMatch[2];
      const rest = listMatch[3] || "";

      if (origIndent > stack[stack.length - 1]) {
        stack.push(origIndent);
      } else {
        while (stack.length > 1 && stack[stack.length - 1] > origIndent) {
          stack.pop();
        }
        if (stack[stack.length - 1] < origIndent) {
          stack.push(origIndent);
        }
      }

      const level = stack.length - 1;
      const normalizedIndent = " ".repeat(4 * level);
      result.push(`${normalizedIndent}${marker}${rest ? " " + rest : ""}`);
    } else {
      let i = stack.length - 1;
      while (i > 0 && stack[i] > origIndent) {
        i--;
      }

      while (stack.length - 1 > i) {
        stack.pop();
      }

      const shift = 4 * i - stack[i];
      const newIndentLength = Math.max(0, origIndent + shift);
      const newIndent = " ".repeat(newIndentLength);
      const lineContent = line.slice(origIndent);
      result.push(`${newIndent}${lineContent}`);
    }
  }

  return result.join("\n");
}

/**
 * Splits markdown into non-code segments (even indices) and code blocks/inline code (odd indices)
 * so text transforms never corrupt code snippets (such as bash `$VAR_1` variables).
 */
function mapOutsideCode(content: string, transform: (chunk: string) => string): string {
  const parts = content.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g);
  return parts
    .map((part, i) => (i % 2 === 1 ? part : transform(part)))
    .join("");
}

/**
 * Escapes unescaped underscores and preserves escaped braces inside LaTeX math ($...$ and $$...$$)
 * outside code blocks so CommonMark does not turn subscripts into <em> tags
 * or corrupt shell variables like `$IN_FILE` inside fenced code blocks.
 */
export function protectMathSyntax(content: string): string {
  const protect = (math: string) =>
    math
      .replace(/(?<!\\)_/g, "\\_")
      .replace(/(?<!\\)\\{/g, "\\\\{")
      .replace(/(?<!\\)\\}/g, "\\\\}");

  return mapOutsideCode(content, (chunk) => {
    // 1. Display math $$ ... $$
    let res = chunk.replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => {
      return "$$" + protect(math) + "$$";
    });
    // 2. Inline math $ ... $ (excluding escaped \$)
    res = res.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (_match, math) => {
      return "$" + protect(math) + "$";
    });
    return res;
  });
}

/**
 * Replaces checkmark and cross emojis outside code blocks with clean SVG badge spans.
 */
export function replaceEmojis(content: string): string {
  return mapOutsideCode(content, (chunk) =>
    chunk
      .replace(
        /✅|✔/g,
        '<span class="inline-icon-check" aria-label="ano"></span>'
      )
      .replace(
        /❌|✖/g,
        '<span class="inline-icon-cross" aria-label="ne"></span>'
      )
  );
}

function extractNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractNodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractNodeText(node.props.children);
  }
  return "";
}

function CodeBlockPre({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = extractNodeText(children).replace(/\n$/, "");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="relative group/code my-3">
      <button
        type="button"
        onClick={handleCopy}
        title="Kopírovat kód"
        className="print:hidden absolute top-2 right-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-white/90 hover:bg-white text-stone-600 hover:text-brand-orange-text border border-stone-200/80 shadow-xs opacity-80 sm:opacity-0 sm:group-hover/code:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
      >
        {copied ? (
          <>
            <Check size={12} className="text-emerald-600" />
            <span className="text-emerald-700">Zkopírováno</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span>Kopírovat</span>
          </>
        )}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
}

function isInternalSpaLink(href: string | undefined, download?: string): boolean {
  if (!href || download !== undefined) return false;
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  // Static assets under public/ must remain normal browser links
  if (/\.(cpp|c|h|py|sh|pdf|png|jpe?g|svg|gif|webp|zip|pptx|txt)$/i.test(href)) {
    return false;
  }
  return true;
}

export function MarkdownView({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const processedContent = useMemo(
    () => replaceEmojis(protectMathSyntax(normalizeMarkdownLists(content))),
    [content]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!contentMayHaveMath(content)) return;

    let cancelled = false;
    const run = async () => {
      try {
        await loadMathJax();
        if (cancelled || !ref.current) return;
        if (window.MathJax?.typesetPromise) {
          try {
            window.MathJax.typesetClear?.([ref.current]);
          } catch {}
          await window.MathJax.typesetPromise([ref.current]);
          if (cancelled || !ref.current) return;

          const containers =
            ref.current.querySelectorAll<HTMLElement>("mjx-container");
          containers.forEach((container) => {
            makeMathJaxContainerSelectable(container);
          });
        }
      } catch (err) {
        console.error("MathJax typesetting error:", err);
      }
    };
    const t = window.setTimeout(() => {
      void run();
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [content, processedContent]);

  // Allocate fresh deterministic heading IDs on each render to match extractHeadings()
  const nextSlug = createHeadingSlugger();

  return (
    <div ref={ref} className="wiki-prose tex2jax_process">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, wikiSanitizeSchema],
          [
            rehypeHighlight,
            {
              languages: highlightLanguages,
              // Unknown language tags fall back to plaintext instead of shipping all grammars
              plainText: ["txt", "text", "plain"],
            },
          ],
        ]}
        components={{
          h2({ children, id, className, node: _node, ...props }) {
            const headingId = id || nextSlug(extractNodeText(children));
            return (
              <h2
                id={headingId}
                className={className ? `${className} scroll-mt-24` : "scroll-mt-24"}
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, id, className, node: _node, ...props }) {
            const headingId = id || nextSlug(extractNodeText(children));
            return (
              <h3
                id={headingId}
                className={className ? `${className} scroll-mt-24` : "scroll-mt-24"}
                {...props}
              >
                {children}
              </h3>
            );
          },
          pre({ children, node: _node, ...props }) {
            return <CodeBlockPre {...props}>{children}</CodeBlockPre>;
          },
          code({ className, children, inline: _inline, node: _node, ...props }: CodeProps) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children, download, target, rel, node: _node, ...props }) {
            if (isInternalSpaLink(href, typeof download === "string" ? download : download ? "" : undefined)) {
              return (
                <Link to={href!} {...props}>
                  {children}
                </Link>
              );
            }
            const isExternal = Boolean(href && /^https?:\/\//i.test(href));
            return (
              <a
                href={href}
                download={download}
                target={isExternal ? target || "_blank" : target}
                rel={isExternal ? rel || "noopener noreferrer" : rel}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
