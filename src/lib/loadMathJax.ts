import { latexToUnicode } from "./latexToUnicode";

/**
 * Load MathJax 3 only when wiki markdown may contain math.
 * Keeps `/mikrobiologie` free of the MathJax CDN parse cost.
 */

const MATHJAX_SRC =
  "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

let loadPromise: Promise<void> | null = null;
let copyListenerRegistered = false;

export function setupMathJaxCopyListener(): void {
  if (typeof document === "undefined" || copyListenerRegistered) return;
  copyListenerRegistered = true;

  document.addEventListener("copy", (e: ClipboardEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    try {
      const range = selection.getRangeAt(0);
      const cloned = range.cloneContents();
      const mathContainers = cloned.querySelectorAll("mjx-container");

      if (mathContainers.length > 0) {
        mathContainers.forEach((cnt) => {
          const unicode =
            cnt.getAttribute("data-unicode") ||
            cnt.querySelector(".mjx-selectable-unicode")?.textContent ||
            cnt.querySelector("mjx-assistive-mml")?.textContent ||
            latexToUnicode(cnt.getAttribute("data-latex") || "") ||
            cnt.textContent ||
            "";
          const isDisplay = cnt.getAttribute("display") === "true" || cnt.classList.contains("MJX-DISPLAY");
          const replacement = document.createTextNode(isDisplay ? `\n${unicode.trim()}\n` : ` ${unicode.trim()} `);
          cnt.parentNode?.replaceChild(replacement, cnt);
        });

        cloned.querySelectorAll(".mjx-selectable-unicode").forEach((s) => s.remove());

        let plainText = cloned.textContent || "";
        plainText = plainText.replace(/ {2,}/g, " ");

        if (e.clipboardData) {
          e.clipboardData.setData("text/plain", plainText);
          e.preventDefault();
        }
      } else {
        const targetEl =
          range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            ? (range.commonAncestorContainer as Element)
            : range.commonAncestorContainer.parentElement;
        const enclosing = targetEl?.closest("mjx-container");
        if (enclosing) {
          const unicode =
            enclosing.getAttribute("data-unicode") ||
            enclosing.querySelector(".mjx-selectable-unicode")?.textContent ||
            enclosing.querySelector("mjx-assistive-mml")?.textContent ||
            latexToUnicode(enclosing.getAttribute("data-latex") || "") ||
            enclosing.textContent ||
            "";
          if (unicode && e.clipboardData) {
            e.clipboardData.setData("text/plain", unicode.trim());
            e.preventDefault();
          }
        }
      }
    } catch {
      // Graceful fallback to default browser copy if selection cloning fails
    }
  });
}

function ensureConfig() {
  if (typeof window === "undefined") return;
  if (!window.MathJax) {
    // Cast through unknown to satisfy TypeScript — MathJax is a global
    // configured before the script loads, so the full type isn't available yet.
    window.MathJax = {} as unknown as typeof window.MathJax;
  }
  const current = window.MathJax;
  if (!current) return;
  const existingTex = current.tex || {};
  const existingMacros = (existingTex.macros as Record<string, unknown> | undefined) || {};

  current.tex = {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
    ...existingTex,
    macros: {
      thus: "\\mathrel{\\vert\\mkern-3mu{=}}",
      logi: "\\mathrel{\\vert\\mkern-3mu{=}\\mkern-3mu\\vert}",
      ...existingMacros,
    },
  };
  current.options = {
    ignoreHtmlClass: "tex2jax_ignore",
    processHtmlClass: "tex2jax_process",
    ...(current.options || {}),
  };
}

export function loadMathJax(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  ensureConfig();
  setupMathJaxCopyListener();

  if (window.MathJax?.typesetPromise) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("MathJax-script");
    if (existing) {
      if (window.MathJax?.typesetPromise) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("MathJax load failed")),
          { once: true }
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "MathJax-script";
    script.async = true;
    script.src = MATHJAX_SRC;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("MathJax load failed"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Cheap check whether markdown likely needs MathJax. */
export function contentMayHaveMath(content: string): boolean {
  return (
    content.includes("$") ||
    content.includes("\\(") ||
    content.includes("\\[") ||
    content.includes("$$")
  );
}
