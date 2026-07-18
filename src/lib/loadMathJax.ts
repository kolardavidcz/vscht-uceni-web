/**
 * Load MathJax 3 only when wiki markdown may contain math.
 * Keeps `/mikrobiologie` free of the MathJax CDN parse cost.
 */

const MATHJAX_SRC =
  "https://cdn.jsdelivr.net/npm/mathjax@3/es/tex-mml-chtml.js";

let loadPromise: Promise<void> | null = null;

function ensureConfig() {
  if (window.MathJax?.typesetPromise) return;
  window.MathJax = {
    ...(window.MathJax || {}),
    tex: {
      inlineMath: [
        ["\\(", "\\)"],
        ["$", "$"],
      ],
      displayMath: [
        ["\\[", "\\]"],
        ["$$", "$$"],
      ],
      processEscapes: true,
    },
    options: {
      ignoreHtmlClass: "tex2jax_ignore",
      processHtmlClass: "tex2jax_process",
    },
  } as typeof window.MathJax;
}

export function loadMathJax(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.MathJax?.typesetPromise) return Promise.resolve();
  if (loadPromise) return loadPromise;

  ensureConfig();

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("MathJax-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("MathJax load failed")),
        { once: true }
      );
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
