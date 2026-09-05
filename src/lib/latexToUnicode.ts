/**
 * Utility to convert LaTeX math formulas into readable, clean Unicode strings.
 * Used for clipboard copying and accessible text selection across wiki formulas.
 */

// Greek letter dictionary
const GREEK: Record<string, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  varepsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  vartheta: "ϑ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  pi: "π",
  varpi: "ϖ",
  rho: "ρ",
  varrho: "ϱ",
  sigma: "σ",
  varsigma: "ς",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  varphi: "ϕ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  Gamma: "Γ",
  Delta: "Δ",
  Theta: "Θ",
  Lambda: "Λ",
  Xi: "Ξ",
  Pi: "Π",
  Sigma: "Σ",
  Upsilon: "Υ",
  Phi: "Φ",
  Psi: "Ψ",
  Omega: "Ω",
};

// Math symbol dictionary
const SYMBOLS: Record<string, string> = {
  // Logic
  forall: "∀",
  exists: "∃",
  nexists: "∄",
  neg: "¬",
  lnot: "¬",
  land: "∧",
  lor: "∨",
  wedge: "∧",
  vee: "∨",
  implies: "⇒",
  Longrightarrow: "⇒",
  Rightarrow: "⇒",
  iff: "⇔",
  Longleftrightarrow: "⇔",
  Leftrightarrow: "⇔",
  to: "→",
  rightarrow: "→",
  leftarrow: "←",
  gets: "←",
  leftrightarrow: "↔",
  top: "⊤",
  bot: "⊥",
  models: "⊨",
  thus: "⊨",
  logi: "|≡|",
  equiv: "≡",
  vdash: "⊢",
  dashv: "⊣",
  coloneqq: ":=",
  ceq: ":=",

  // Sets & Relations
  in: "∈",
  notin: "∉",
  ni: "∋",
  subset: "⊂",
  subseteq: "⊆",
  subsetneq: "⊊",
  varsubsetneq: "⊊",
  supset: "⊃",
  supseteq: "⊇",
  cap: "∩",
  cup: "∪",
  setminus: "\\",
  smallsetminus: "\\",
  times: "×",
  emptyset: "∅",
  varnothing: "∅",

  // Numbers & Blackboard Bold
  N: "ℕ",
  mathbbN: "ℕ",
  Z: "ℤ",
  mathbbZ: "ℤ",
  Q: "ℚ",
  mathbbQ: "ℚ",
  R: "ℝ",
  mathbbR: "ℝ",
  C: "ℂ",
  CC: "ℂ",
  mathbbC: "ℂ",

  // Calligraphic
  PP: "𝒫",
  mathcalP: "𝒫",
  mathcalU: "𝒰",
  mathcalO: "𝒪",
  lanO: "𝒪",

  // Arithmetic & Calculus
  sum: "∑",
  prod: "∏",
  le: "≤",
  leq: "≤",
  ge: "≥",
  geq: "≥",
  neq: "≠",
  ne: "≠",
  approx: "≈",
  pm: "±",
  mp: "∓",
  cdot: "·",
  circ: "∘",
  dots: "…",
  cdots: "…",
  ldots: "…",
  vdots: "⋮",
  ddots: "⋱",
  infty: "∞",
  sqrt: "√",
  blacksquare: "■",
  square: "□",
  mid: "|",
  nmid: "∤",
  vert: "|",
  Vert: "‖",

  // Functions / Keywords
  deg: "deg",
  gcd: "gcd",
  lcm: "lcm",
  mod: "mod",
  bmod: "mod",
  pmod: "mod",
};

// Unicode superscripts
const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  n: "ⁿ",
  i: "ⁱ",
  k: "ᵏ",
  m: "ᵐ",
  t: "ᵗ",
  x: "ˣ",
  y: "ʸ",
};

// Unicode subscripts
const SUBSCRIPTS: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎",
  a: "ₐ",
  e: "ₑ",
  h: "ₕ",
  i: "ᵢ",
  j: "ⱼ",
  k: "ₖ",
  l: "ₗ",
  m: "ₘ",
  n: "ₙ",
  o: "ₒ",
  p: "ₚ",
  r: "ᵣ",
  s: "ₛ",
  t: "ₜ",
  u: "ᵤ",
  v: "ᵥ",
  x: "ₓ",
};

function toSuperscript(s: string): string {
  const chars = s.split("");
  if (chars.every((c) => c in SUPERSCRIPTS)) {
    return chars.map((c) => SUPERSCRIPTS[c]).join("");
  }
  return `^(${s})`;
}

function toSubscript(s: string): string {
  const chars = s.split("");
  if (chars.every((c) => c in SUBSCRIPTS)) {
    return chars.map((c) => SUBSCRIPTS[c]).join("");
  }
  return `_(${s})`;
}

/**
 * Converts a raw LaTeX expression into clean, human-readable Unicode text.
 * @example
 * latexToUnicode("\\forall x \\in V : P(x)") // "∀x ∈ V : P(x)"
 * latexToUnicode("x^n = (x^{n/2})^2") // "xⁿ = (x^(n/2))²"
 */
export function latexToUnicode(latex: string): string {
  if (!latex) return "";

  let res = latex.trim();

  // Strip enclosing math delimiters if present
  if (res.startsWith("$$") && res.endsWith("$$")) {
    res = res.slice(2, -2).trim();
  } else if (res.startsWith("$") && res.endsWith("$")) {
    res = res.slice(1, -1).trim();
  } else if (res.startsWith("\\[") && res.endsWith("\\]")) {
    res = res.slice(2, -2).trim();
  } else if (res.startsWith("\\(") && res.endsWith("\\)")) {
    res = res.slice(2, -2).trim();
  }

  // Common macro cleanups
  res = res.replace(/\\mathbb\{([A-Z])\}/g, (_, letter) => SYMBOLS[`mathbb${letter}`] || letter);
  res = res.replace(/\\mathcal\{([A-Z])\}/g, (_, letter) => SYMBOLS[`mathcal${letter}`] || letter);
  res = res.replace(/\\mathbf\{([^}]+)\}/g, "$1");
  res = res.replace(/\\boldsymbol\{([^}]+)\}/g, "$1");
  res = res.replace(/\\text\{([^}]+)\}/g, " $1 ");
  res = res.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  res = res.replace(/\\operatorname\{([^}]+)\}/g, "$1");
  res = res.replace(/\\mathrel\{([^}]+)\}/g, "$1");
  res = res.replace(/\\mathop\{([^}]+)\}/g, "$1");
  res = res.replace(/\\left|\\right/g, "");

  // \binom{n}{k} -> (n nad k)
  res = res.replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, "($1 nad $2)");

  // \frac{a}{b} -> (a)/(b) or a/b for single chars
  res = res.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");

  // \sqrt{x} -> √(x)
  res = res.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");

  // Greek letters
  res = res.replace(/\\([a-zA-Z]+)/g, (match, word) => {
    if (word in GREEK) return GREEK[word];
    if (word in SYMBOLS) return SYMBOLS[word];
    return match;
  });

  // Handle superscripts: ^{...} or ^x
  res = res.replace(/\^\{([^}]+)\}/g, (_, exp) => toSuperscript(exp));
  res = res.replace(/\^([0-9a-zA-Z])/g, (_, exp) => toSuperscript(exp));

  // Handle subscripts: _{...} or _x
  res = res.replace(/_\{([^}]+)\}/g, (_, sub) => toSubscript(sub));
  res = res.replace(/_([0-9a-zA-Z])/g, (_, sub) => toSubscript(sub));

  // Remove spacing commands
  res = res.replace(/\\[,;:!]/g, " ");
  res = res.replace(/\\quad/g, "  ");
  res = res.replace(/\\qquad/g, "    ");
  res = res.replace(/\\ /g, " ");

  // Remaining backslashes for standard symbols that weren't captured
  res = res.replace(/\\vert/g, "|");
  res = res.replace(/\\\|/g, "|");

  // Clean remaining stray backslashes and redundant braces
  res = res.replace(/\\([a-zA-Z]+)/g, "$1");
  res = res.replace(/\{([^{}]+)\}/g, "$1");

  // Normalise spaces around operators
  res = res.replace(/\s*([=≠≤≥≈∈∉⊆⊂∩∪×·∧∨⇒⇔])\s*/g, " $1 ");
  // Tighten quantifiers and negations to their variables if followed by single letter
  res = res.replace(/([∀∃∄¬])\s+([a-zA-Z])/g, "$1$2");
  res = res.replace(/\s+/g, " ").trim();

  return res;
}
