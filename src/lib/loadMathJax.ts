import { latexToUnicode } from "./latexToUnicode";

/**
 * Load MathJax 3 only when wiki markdown may contain math.
 * Keeps `/mikrobiologie` free of the MathJax CDN parse cost.
 */

const MATHJAX_SRC =
  "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

let loadPromise: Promise<void> | null = null;
let copyListenerRegistered = false;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
          const clean = unicode.trim();

          // Replace mjx-container with clean visible span in the cloned DOM.
          // Explicit color: inherit and fontFamily: inherit guarantee that
          // rich-text note apps (Apple Notes, OneNote, Word, Google Docs)
          // will never paste transparent or white text.
          const span = document.createElement("span");
          span.style.color = "inherit";
          span.style.fontFamily = "inherit";
          span.textContent = isDisplay ? `\n${clean}\n` : ` ${clean} `;
          cnt.parentNode?.replaceChild(span, cnt);
        });

        cloned.querySelectorAll(".mjx-selectable-unicode, mjx-assistive-mml").forEach((s) => s.remove());

        // Normalize any transparent inline styling in the cloned tree
        cloned.querySelectorAll<HTMLElement>("[style*='transparent']").forEach((el) => {
          el.style.color = "inherit";
        });

        const wrapper = document.createElement("div");
        wrapper.appendChild(cloned);

        let plainText = wrapper.textContent || "";
        plainText = plainText.replace(/ {2,}/g, " ");
        const html = wrapper.innerHTML;

        if (e.clipboardData) {
          e.clipboardData.setData("text/plain", plainText);
          e.clipboardData.setData("text/html", html);
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
          const clean = unicode.trim();
          if (clean && e.clipboardData) {
            e.clipboardData.setData("text/plain", clean);
            e.clipboardData.setData(
              "text/html",
              `<span style="color: inherit; font-family: inherit;">${escapeHtml(clean)}</span>`
            );
            e.preventDefault();
          }
        }
      }
    } catch {
      // Graceful fallback to default browser copy if selection cloning fails
    }
  });
}

const SUPER_MAP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
  "n": "ⁿ", "i": "ⁱ", "x": "ˣ", "y": "ʸ", "k": "ᵏ", "m": "ᵐ"
};

const SUB_MAP: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
  "a": "ₐ", "e": "ₑ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "m": "ₘ",
  "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ",
  "u": "ᵤ", "v": "ᵥ", "x": "ₓ"
};

export function makeMathJaxContainerSelectable(container: HTMLElement): void {
  // Remove assistive MathML which MathJax marks unselectable="on" with user-select: none
  container.querySelectorAll("mjx-assistive-mml").forEach((a) => a.remove());

  // Allow browser selection on container and math elements
  container.style.userSelect = "text";
  const math = container.querySelector("mjx-math");
  if (math) {
    math.removeAttribute("aria-hidden");
    (math as HTMLElement).style.userSelect = "text";
  }

  // Populate each mjx-c with its corresponding Unicode character
  const chars = container.querySelectorAll<HTMLElement>("mjx-c");
  chars.forEach((c) => {
    c.style.userSelect = "text";
    if (c.textContent) return;

    const match = c.className.match(/mjx-c([0-9A-Fa-f]+)/);
    let ch = "";
    if (match) {
      let code = parseInt(match[1], 16);
      // Map italic letters (0x1D44E-0x1D467 -> a-z, 0x1D434-0x1D44D -> A-Z) to standard ASCII
      if (code >= 0x1D44E && code <= 0x1D467) {
        code = 97 + (code - 0x1D44E); // a-z
      } else if (code >= 0x1D434 && code <= 0x1D44D) {
        code = 65 + (code - 0x1D434); // A-Z
      }
      try {
        ch = String.fromCodePoint(code);
      } catch {}
    }

    if (!ch) {
      const before = window.getComputedStyle(c, "::before").content;
      if (before && before !== "none" && before !== '""') {
        ch = before.replace(/^["']|["']$/g, "");
      }
    }

    if (ch) {
      if (c.closest("mjx-script")) {
        if (c.closest("mjx-msup") && SUPER_MAP[ch]) ch = SUPER_MAP[ch];
        if (c.closest("mjx-msub") && SUB_MAP[ch]) ch = SUB_MAP[ch];
      }
      c.textContent = ch;
    }
  });

  const fullText = container.textContent || "";
  container.setAttribute("data-unicode", fullText);
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
      coloneqq: "\\mathrel{:=}",
      ...existingMacros,
    },
  };
  current.options = {
    ignoreHtmlClass: "tex2jax_ignore",
    processHtmlClass: "tex2jax_process",
    enableAssistiveMml: false,
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
