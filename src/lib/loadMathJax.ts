/**
 * Load MathJax 3 only when wiki markdown may contain math.
 * Keeps `/mikrobiologie` free of the MathJax CDN parse cost.
 */

const MATHJAX_SRC =
  "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

let loadPromise: Promise<void> | null = null;

function ensureConfig() {
  if (typeof window === "undefined") return;
  if (!window.MathJax) {
    // Cast through unknown to satisfy TypeScript — MathJax is a global
    // configured before the script loads, so the full type isn't available yet.
    window.MathJax = {} as unknown as typeof window.MathJax;
  }
  const current = window.MathJax;
  if (!current) return;
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
    ...(current.tex || {}),
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
