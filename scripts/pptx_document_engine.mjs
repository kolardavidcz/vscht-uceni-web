/**
 * Pre-AG1 PowerPoint Document Flow Engine
 * Renders slides in a pure 1:1 linear document flow matching the website reader / print layout:
 * - 16:9 widescreen pages (13.333" x 7.5") with pure white background
 * - Full-width headings, paragraphs (with inline bold/italic), and bullet lists
 * - Full-width callout boxes ([!NOTE], [!TIP], [!WARNING]) with orange left accent bar
 * - Full-width dark code blocks (#160F0B, Courier New)
 * - Full-width native tables with styled header and alternating rows
 * - Dedicated video placeholder slides and spoiler solution slides
 * - Global FONT_DELTA constant for instantaneous text size adjustment (+1, +2, -1, -2, ...)
 */

import nodeFs from "node:fs";

// ============================================================================
// GLOBAL CONFIGURATION: FONT SIZING (1.5x - 2x BIGGER)
// FONT_SCALE: Overall scale multiplier (1.6 = ~1.6x bigger, 1.0 = standard)
// FONT_DELTA: Incremental point adjustment (+1, +2, -1, -2, ...)
// ============================================================================
export const FONT_SCALE = 1.6;
export const FONT_DELTA = 0;

/**
 * Responsive font size calculation based on FONT_SCALE and FONT_DELTA.
 * @param {number} base Base font size in points
 * @returns {number} Scaled font size
 */
export function fs(base) {
  return Math.max(9, Math.round(base * FONT_SCALE + FONT_DELTA));
}

// ============================================================================
// BRAND COLOR TOKENS (Hex without '#')
// ============================================================================
export const colors = {
  bgLight: "FFFFFF",
  bgDark: "0F0906",

  // Typography
  textPrimary: "0F172A",    // Slate 900
  textSecondary: "334155",  // Slate 700
  textMuted: "64748B",      // Slate 500
  textLightMuted: "94A3B8", // Slate 400
  borderSubtle: "E2E8F0",   // Slate 200

  // Brand Orange
  brandOrange: "F95D12",
  brandOrangeDark: "C2410C",
  brandOrangeLight: "FED7AA",

  // Callout Boxes (Warm tints matching web)
  calloutWarmBg: "FFF7ED",
  calloutWarmBorder: "F95D12",
  calloutNoteBg: "FFF7ED",
  calloutNoteBorder: "F95D12",
  calloutWarningBg: "FEF2F2",
  calloutWarningBorder: "EF4444",
  calloutInfoBg: "F0F9FF",
  calloutInfoBorder: "0284C7",

  // Code Blocks
  bgCode: "160F0B",
  borderCode: "2D1E16",
  codeText: "F8FAFC",
  codeAccent: "F95D12",

  // Tables
  tableHeaderBg: "F8FAFC",
  tableHeaderBorder: "CBD5E1",
  tableRowEvenBg: "FFFFFF",
  tableRowOddBg: "F8FAFC",
  tableBorder: "E2E8F0",
};

// Standard safe fonts
export const fonts = {
  sans: "Calibri",
  heading: "Calibri",
  mono: "Courier New",
};

/**
 * Clean text for PowerPoint XML to prevent entity parse errors.
 */
export function cleanText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/\\_/g, "_");
}

/**
 * Converts basic LaTeX math syntax to readable Unicode characters.
 */
export function texToUnicode(text) {
  if (!text) return "";
  let s = String(text);

  // Greek letters
  s = s.replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\delta/g, "δ")
    .replace(/\\epsilon/g, "ε")
    .replace(/\\zeta/g, "ζ")
    .replace(/\\theta/g, "θ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\mu/g, "μ")
    .replace(/\\pi/g, "π")
    .replace(/\\sigma/g, "σ")
    .replace(/\\omega/g, "ω")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\Theta/g, "Θ")
    .replace(/\\Omega/g, "Ω");

  // Logic and set symbols
  s = s.replace(/\\forall/g, "∀")
    .replace(/\\exists!/g, "∃!")
    .replace(/\\exists/g, "∃")
    .replace(/\\neg/g, "¬")
    .replace(/\\lor/g, "∨")
    .replace(/\\land/g, "∧")
    .replace(/\\implies/g, "⇒")
    .replace(/\\Rightarrow/g, "⇒")
    .replace(/\\iff/g, "⇔")
    .replace(/\\Leftrightarrow/g, "⇔")
    .replace(/\\bot/g, "⊥")
    .replace(/\\top/g, "⊤")
    .replace(/\\models/g, "⊨")
    .replace(/\\in/g, "∈")
    .replace(/\\notin/g, "∉")
    .replace(/\\subset/g, "⊂")
    .replace(/\\subsetneq/g, "⊊")
    .replace(/\\subseteq/g, "⊆")
    .replace(/\\cup/g, "∪")
    .replace(/\\cap/g, "∩")
    .replace(/\\setminus/g, "∖")
    .replace(/\\emptyset/g, "∅");

  // Relational & math operators
  s = s.replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\equiv/g, "≡")
    .replace(/\\sum/g, "∑")
    .replace(/\\prod/g, "∏")
    .replace(/\\mathbb\{N\}/g, "ℕ")
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\mathbb\{Z\}/g, "ℤ")
    .replace(/\\mathcal\{E\}/g, "ℰ")
    .replace(/\\mathcal\{S\}/g, "𝒮")
    .replace(/\\binom\{n\}\{k\}/g, "(n nad k)")
    .replace(/\\triangle/g, "△")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\dots/g, "…")
    .replace(/\\ldots/g, "…")
    .replace(/\\deg/g, "deg")
    .replace(/\\{/g, "{")
    .replace(/\\}/g, "}")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/_\{([^}]+)\}/g, "_$1")
    .replace(/\^\{([^}]+)\}/g, "^$1");

  return cleanText(s);
}

/**
 * Parses markdown inline formatting (**bold**, *italic*, `code`, math) into an array of pptxgenjs text runs.
 * @param {string} text Raw markdown text
 * @param {object} baseOpts Base options for runs
 * @returns {Array<object>} Array of text run objects { text, options }
 */
export function mdToRuns(text, baseOpts = {}) {
  if (!text) return [{ text: "", options: baseOpts }];

  // First convert TeX tokens in the text
  const clean = cleanText(texToUnicode(text));

  // Tokenize by **bold**, *italic*, and `code`
  const runs = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(clean)) !== null) {
    if (match.index > lastIndex) {
      runs.push({
        text: clean.slice(lastIndex, match.index),
        options: { ...baseOpts },
      });
    }

    if (match[2]) {
      // **bold**
      runs.push({
        text: match[2],
        options: { ...baseOpts, bold: true },
      });
    } else if (match[3]) {
      // *italic*
      runs.push({
        text: match[3],
        options: { ...baseOpts, italic: true },
      });
    } else if (match[4]) {
      // `code`
      runs.push({
        text: match[4],
        options: { ...baseOpts, fontFace: fonts.mono, color: colors.brandOrangeDark },
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < clean.length) {
    runs.push({
      text: clean.slice(lastIndex),
      options: { ...baseOpts },
    });
  }

  return runs.length > 0 ? runs : [{ text: clean, options: baseOpts }];
}

// ============================================================================
// DOCUMENT SLIDE PRIMITIVES
// ============================================================================

/**
 * Creates a standard 1:1 document slide with clean white background,
 * subtle muted breadcrumb, and bottom page footer.
 */
export function createDocSlide(pres, { breadcrumb = "", continuationHeader = "" } = {}) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };

  // Top category breadcrumb
  if (breadcrumb) {
    slide.addText(cleanText(breadcrumb).toUpperCase(), {
      x: 0.8,
      y: 0.28,
      w: 11.733,
      h: 0.26,
      fontFace: fonts.heading,
      fontSize: fs(8.5),
      color: colors.brandOrangeDark,
      bold: true,
      charSpacing: 1.0,
      valign: "middle",
      margin: 0,
    });
  }

  // Continuation subtitle if section flows over multiple slides
  if (continuationHeader) {
    slide.addText(cleanText(continuationHeader) + " (pokračování)", {
      x: 0.8,
      y: 0.56,
      w: 11.733,
      h: 0.32,
      fontFace: fonts.sans,
      fontSize: fs(12),
      color: colors.textMuted,
      italic: true,
      valign: "middle",
      margin: 0,
    });
  }

  // Bottom footer bar
  slide.addText("VŠCHT Učení · Obor Bioinformatika · pre-AG1 (Algoritmy a Grafy)", {
    x: 0.8,
    y: 7.15,
    w: 9.0,
    h: 0.22,
    fontFace: fonts.sans,
    fontSize: fs(8),
    color: colors.textLightMuted,
    valign: "middle",
    margin: 0,
  });

  return slide;
}

/**
 * Renders a full-width heading matching website style:
 * H1: 22pt bold, H2: 17pt bold with subtle horizontal rule underneath,
 * H3: 14.5pt bold, H4: 13pt bold.
 * Returns the Y position for the next element.
 */
export function renderDocHeading(pres, slide, text, { level = 2, y = 0.85, showUnderline = true } = {}) {
  const clean = cleanText(text);

  if (level === 1) {
    const fontSize = fs(20);
    const h = Math.max(0.65, (fontSize * 1.3) / 72);
    slide.addText(clean, {
      x: 0.8,
      y,
      w: 11.733,
      h,
      fontFace: fonts.heading,
      fontSize,
      color: colors.textPrimary,
      bold: true,
      valign: "middle",
      margin: 0,
    });
    return y + h + 0.16;
  }

  if (level === 2) {
    const fontSize = fs(15);
    const h = Math.max(0.50, (fontSize * 1.3) / 72);
    slide.addText(clean, {
      x: 0.8,
      y,
      w: 11.733,
      h,
      fontFace: fonts.heading,
      fontSize,
      color: colors.textPrimary,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    if (showUnderline) {
      slide.addShape(pres.ShapeType.line, {
        x: 0.8,
        y: y + h + 0.04,
        w: 11.733,
        h: 0,
        line: { color: colors.borderSubtle, width: 0.75 },
      });
    }

    return y + h + 0.16;
  }

  if (level === 3) {
    const fontSize = fs(13);
    const h = Math.max(0.42, (fontSize * 1.3) / 72);
    slide.addText(clean, {
      x: 0.8,
      y,
      w: 11.733,
      h,
      fontFace: fonts.heading,
      fontSize,
      color: colors.textPrimary,
      bold: true,
      valign: "middle",
      margin: 0,
    });
    return y + h + 0.12;
  }

  // Level 4
  const fontSize = fs(11.5);
  const h = Math.max(0.36, (fontSize * 1.3) / 72);
  slide.addText(clean, {
    x: 0.8,
    y,
    w: 11.733,
    h,
    fontFace: fonts.heading,
    fontSize,
    color: colors.textSecondary,
    bold: true,
    valign: "middle",
    margin: 0,
  });
  return y + h + 0.10;
}

/**
 * Renders a full-width paragraph with inline bold/italic/code support.
 * Returns the Y position for the next element.
 */
export function renderDocParagraph(slide, textOrRuns, { y = 0.85, fontSize = fs(10.5), color = colors.textSecondary, lineSpacing = 1.25 } = {}) {
  let runs;
  let rawText = "";

  if (Array.isArray(textOrRuns)) {
    runs = textOrRuns;
    rawText = runs.map(r => r.text || "").join("");
  } else {
    rawText = String(textOrRuns);
    runs = mdToRuns(rawText, {
      fontFace: fonts.sans,
      fontSize,
      color,
    });
  }

  // Responsive character wrap and line height based on scaled fontSize
  const charsPerLine = Math.max(50, Math.floor(115 / FONT_SCALE));
  const lineCount = Math.max(1, Math.ceil(rawText.length / charsPerLine));
  const lineHeight = Math.max(0.28, (fontSize * 1.25) / 72);
  const h = Math.max(0.32, lineCount * lineHeight);

  slide.addText(runs, {
    x: 0.8,
    y,
    w: 11.733,
    h,
    fontFace: fonts.sans,
    fontSize,
    color,
    lineSpacingMultiple: lineSpacing,
    valign: "top",
    margin: 0,
  });

  return y + h + 0.12;
}

/**
 * Renders a bulleted list matching the website.
 * Returns the Y position for the next element.
 */
export function renderDocList(slide, items, { y = 0.85, fontSize = fs(10.5), spacing = 0.08 } = {}) {
  let currentY = y;

  items.forEach((item) => {
    const rawText = String(item);
    const runs = mdToRuns(rawText, {
      fontFace: fonts.sans,
      fontSize,
      color: colors.textSecondary,
    });

    const charsPerLine = Math.max(48, Math.floor(110 / FONT_SCALE));
    const lineCount = Math.max(1, Math.ceil((rawText.length + 4) / charsPerLine));
    const lineHeight = Math.max(0.28, (fontSize * 1.25) / 72);
    const h = Math.max(0.30, lineCount * lineHeight);

    // Bullet symbol
    slide.addText("•", {
      x: 0.8,
      y: currentY,
      w: 0.25,
      h: 0.30,
      fontFace: fonts.sans,
      fontSize,
      color: colors.brandOrangeDark,
      bold: true,
      valign: "top",
      margin: 0,
    });

    // Item text
    slide.addText(runs, {
      x: 1.1,
      y: currentY,
      w: 11.433,
      h,
      fontFace: fonts.sans,
      fontSize,
      color: colors.textSecondary,
      lineSpacingMultiple: 1.2,
      valign: "top",
      margin: 0,
    });

    currentY += h + spacing;
  });

  return currentY + 0.06;
}

/**
 * Renders a callout box ([!NOTE], [!TIP], [!WARNING], [!INFO]) matching the website.
 * Full-width warm background (#FFF7ED) with a prominent 3.5pt left orange accent bar (#F95D12).
 * Returns the Y position for the next element.
 */
export function renderDocCallout(pres, slide, {
  type = "tip",
  title = "",
  text = "",
  items = [],
  y = 0.85
} = {}) {
  let bg = colors.calloutWarmBg;
  let borderColor = colors.calloutWarmBorder;
  let prefix = "[!TIP]";

  if (type === "warning") {
    bg = colors.calloutWarningBg;
    borderColor = colors.calloutWarningBorder;
    prefix = "[!WARNING]";
  } else if (type === "note") {
    bg = colors.calloutNoteBg;
    borderColor = colors.calloutNoteBorder;
    prefix = "[!NOTE]";
  } else if (type === "info") {
    bg = colors.calloutInfoBg;
    borderColor = colors.calloutInfoBorder;
    prefix = "[!INFO]";
  }

  // Calculate content text
  let combinedChars = 0;
  if (title) combinedChars += title.length + 15;
  if (text) combinedChars += text.length;
  if (items.length > 0) combinedChars += items.join(" ").length + 20;

  const charsPerLine = Math.max(48, Math.floor(105 / FONT_SCALE));
  const lineCount = Math.max(2, Math.ceil(combinedChars / charsPerLine));
  const lineHeight = Math.max(0.28, (fs(10.5) * 1.25) / 72);
  const boxH = Math.max(0.85, lineCount * lineHeight + (title ? 0.42 : 0.28));

  // Background box
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y,
    w: 11.733,
    h: boxH,
    fill: { color: bg },
    line: { color: bg, width: 0.5 },
  });

  // Left solid accent bar (3.5pt thick)
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y,
    w: 0.055,
    h: boxH,
    fill: { color: borderColor },
    line: { color: borderColor, width: 0.5 },
  });

  // Inner runs
  const innerRuns = [];

  // Prefix & title
  const headerText = title ? `${prefix} ${title}` : (text.startsWith("[!") ? "" : prefix);
  if (headerText) {
    innerRuns.push({
      text: headerText + (text ? "\n" : ""),
      options: {
        fontFace: fonts.sans,
        fontSize: fs(11.5),
        bold: true,
        color: colors.brandOrangeDark,
      },
    });
  }

  // Main text
  if (text) {
    const textRuns = mdToRuns(text, {
      fontFace: fonts.sans,
      fontSize: fs(10.5),
      color: colors.textSecondary,
    });
    innerRuns.push(...textRuns);
  }

  // Bullet items if present
  if (items.length > 0) {
    if (innerRuns.length > 0) innerRuns.push({ text: "\n", options: {} });
    items.forEach((item, idx) => {
      innerRuns.push({
        text: `• ${cleanText(texToUnicode(item))}${idx < items.length - 1 ? "\n" : ""}`,
        options: {
          fontFace: fonts.sans,
          fontSize: fs(10),
          color: colors.textSecondary,
        },
      });
    });
  }

  slide.addText(innerRuns, {
    x: 1.05,
    y: y + 0.1,
    w: 11.333,
    h: boxH - 0.2,
    fontFace: fonts.sans,
    fontSize: fs(10.5),
    color: colors.textSecondary,
    lineSpacingMultiple: 1.2,
    valign: "top",
    margin: 0,
  });

  return y + boxH + 0.18;
}

/**
 * Renders a full-width dark code block (#160F0B, Courier New).
 * Returns the Y position for the next element.
 */
export function renderDocCode(pres, slide, code, {
  lang = "cpp",
  title = "",
  y = 0.85
} = {}) {
  const lines = code.trim().split("\n");
  const lineCount = lines.length;
  const hasHeader = Boolean(title || lang);
  const codeFontSize = fs(9.5);
  const lineHeight = Math.max(0.26, (codeFontSize * 1.42) / 72);
  const codeH = Math.max(1.0, lineCount * lineHeight + (hasHeader ? 0.65 : 0.35));

  // Dark container
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y,
    w: 11.733,
    h: codeH,
    rectRadius: 0.08,
    fill: { color: colors.bgCode },
    line: { color: colors.borderCode, width: 1 },
  });

  // Code header bar
  if (hasHeader) {
    slide.addText(`${cleanText(title || lang.toUpperCase())}`, {
      x: 1.1,
      y: y + 0.1,
      w: 11.133,
      h: 0.25,
      fontFace: fonts.heading,
      fontSize: fs(8.5),
      color: colors.codeAccent,
      bold: true,
      valign: "middle",
      margin: 0,
    });
  }

  // Code body
  slide.addText(code.trim(), {
    x: 1.1,
    y: y + (hasHeader ? 0.38 : 0.15),
    w: 11.133,
    h: codeH - (hasHeader ? 0.48 : 0.25),
    fontFace: fonts.mono,
    fontSize: codeFontSize,
    color: colors.codeText,
    lineSpacingMultiple: 1.18,
    valign: "top",
    margin: 0,
  });

  return y + codeH + 0.18;
}

/**
 * Renders a full-width native table.
 * Returns the Y position for the next element.
 */
export function renderDocTable(slide, {
  headers = [],
  rows = [],
  colWidths = [],
  y = 0.85
} = {}) {
  const tableRows = [];

  // Header row
  if (headers.length > 0) {
    tableRows.push(
      headers.map(h => ({
        text: cleanText(texToUnicode(h)),
        options: {
          fontFace: fonts.heading,
          fontSize: fs(11),
          bold: true,
          color: colors.brandOrangeDark,
          fill: { color: colors.calloutWarmBg },
          align: "left",
          valign: "middle",
          margin: [6, 8, 6, 8],
        },
      }))
    );
  }

  // Data rows
  rows.forEach((row, rIdx) => {
    const isEven = rIdx % 2 === 0;
    tableRows.push(
      row.map((cell, cIdx) => ({
        text: cleanText(texToUnicode(cell)),
        options: {
          fontFace: fonts.sans,
          fontSize: fs(10.5),
          color: colors.textSecondary,
          fill: { color: isEven ? colors.bgLight : colors.tableRowOddBg },
          bold: cIdx === 0,
          align: "left",
          valign: "top",
          margin: [5, 8, 5, 8],
        },
      }))
    );
  });

  // Accurate table height calculation based on font size & character wrap
  const cellFontSize = fs(10.5);
  const headerFontSize = fs(11);
  const cellLineH = Math.max(0.24, (cellFontSize * 1.3) / 72);
  const headerLineH = Math.max(0.26, (headerFontSize * 1.3) / 72);
  const avgCharWidth = (cellFontSize * 0.55) / 72; // in inches

  // Compute header height
  let headerH = headerLineH + 0.22;
  if (headers.length > 0 && colWidths.length === headers.length) {
    let maxHeaderLines = 1;
    headers.forEach((h, i) => {
      const colW = colWidths[i] - 0.22;
      const charsPerLine = Math.max(8, Math.floor(colW / avgCharWidth));
      const lines = Math.ceil(cleanText(h).length / charsPerLine);
      if (lines > maxHeaderLines) maxHeaderLines = lines;
    });
    headerH = maxHeaderLines * headerLineH + 0.22;
  }

  // Compute data rows heights
  let totalDataH = 0;
  rows.forEach(row => {
    let maxLines = 1;
    row.forEach((cell, i) => {
      const colW = (colWidths[i] || (11.733 / row.length)) - 0.22;
      const charsPerLine = Math.max(8, Math.floor(colW / avgCharWidth));
      const lines = Math.ceil(cleanText(cell).length / charsPerLine);
      if (lines > maxLines) maxLines = lines;
    });
    const rowH = Math.max(0.36, maxLines * cellLineH + 0.18);
    totalDataH += rowH;
  });

  const totalH = headerH + totalDataH;

  slide.addTable(tableRows, {
    x: 0.8,
    y,
    w: 11.733,
    colW: colWidths.length > 0 ? colWidths : undefined,
    border: { pt: 0.5, color: colors.tableBorder },
  });

  return y + totalH + 0.2;
}

/**
 * Renders a dedicated 16:9 YouTube video placeholder slide.
 */
export function renderDocVideoPlaceholder(pres, slide, {
  title = "Úvodní výukové video",
  subtitle = "Diskrétní matematika & Grafy pro Bioinformatiky",
  url = "https://youtu.be/Rr_I0tdgubY",
  y = 1.4
} = {}) {
  // Title text above frame
  slide.addText(`📺 ${cleanText(title)}`, {
    x: 0.8,
    y: 0.85,
    w: 11.733,
    h: 0.45,
    fontFace: fonts.heading,
    fontSize: fs(18),
    color: colors.textPrimary,
    bold: true,
    margin: 0,
  });

  // Video Frame (16:9 placeholder)
  const frameW = 8.5;
  const frameH = 4.78; // 8.5 / (16/9)
  const frameX = (13.333 - frameW) / 2;

  slide.addShape(pres.ShapeType.roundRect, {
    x: frameX,
    y: 1.55,
    w: frameW,
    h: frameH,
    rectRadius: 0.15,
    fill: { color: "F8FAFC" },
    line: { color: "CBD5E1", width: 1.5 },
  });

  // Play icon circle
  slide.addShape(pres.ShapeType.ellipse, {
    x: frameX + (frameW - 1.2) / 2,
    y: 1.55 + 1.2,
    w: 1.2,
    h: 1.2,
    fill: { color: colors.brandOrange },
    line: { color: colors.brandOrange, width: 1 },
  });

  // Play triangle
  slide.addText("▶", {
    x: frameX + (frameW - 1.2) / 2 + 0.05,
    y: 1.55 + 1.2,
    w: 1.2,
    h: 1.2,
    fontFace: fonts.heading,
    fontSize: fs(24),
    color: "FFFFFF",
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // Subtitle & Link info
  slide.addText(`${cleanText(subtitle)}\n\nOdkaz na video: ${url}\n(Místo pro vložení videa přímo v aplikaci PowerPoint)`, {
    x: frameX + 0.5,
    y: 1.55 + 2.7,
    w: frameW - 1.0,
    h: 1.6,
    fontFace: fonts.sans,
    fontSize: fs(12),
    color: colors.textMuted,
    align: "center",
    valign: "top",
    lineSpacingMultiple: 1.2,
    margin: 0,
  });
}

/**
 * Renders an image with optional caption.
 * Returns the Y position for the next element.
 */
export function renderDocImage(slide, imagePath, {
  x = 0.8,
  y = 0.85,
  w = 6.0,
  h = 3.5,
  caption = ""
} = {}) {
  if (nodeFs.existsSync(imagePath)) {
    slide.addImage({
      path: imagePath,
      x,
      y,
      w,
      h,
    });

    if (caption) {
      slide.addText(cleanText(caption), {
        x,
        y: y + h + 0.08,
        w,
        h: 0.25,
        fontFace: fonts.sans,
        fontSize: fs(9.5),
        color: colors.textMuted,
        align: "center",
        italic: true,
        margin: 0,
      });
      return y + h + 0.42;
    }

    return y + h + 0.18;
  }
  return y;
}

/**
 * Renders a Solution / Spoiler Banner at the top of a spoiler solution slide.
 * Returns the Y position for the next element.
 */
export function renderSolutionBanner(pres, slide, {
  title = "Vzorové Řešení & Rozbor",
  y = 0.85
} = {}) {
  const h = 0.52;

  // Orange banner container
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y,
    w: 11.733,
    h,
    rectRadius: 0.08,
    fill: { color: colors.calloutWarmBg },
    line: { color: colors.brandOrange, width: 1.5 },
  });

  slide.addText(`💡 ${cleanText(title)}`, {
    x: 1.05,
    y,
    w: 11.3,
    h,
    fontFace: fonts.heading,
    fontSize: fs(14.5),
    color: colors.brandOrangeDark,
    bold: true,
    valign: "middle",
    margin: 0,
  });

  return y + h + 0.2;
}

/**
 * Renders a line between two points (x1, y1) and (x2, y2).
 * Guarantees strictly positive width and height (with flipV where appropriate)
 * to prevent corrupted OpenXML shape extents.
 */
export function renderDocConnectingLine(pres, slide, x1, y1, x2, y2, {
  color = colors.brandOrangeDark,
  width = 1.5,
  dashType = "solid"
} = {}) {
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const w = Math.max(0.001, Math.abs(x2 - x1));
  const h = Math.max(0.001, Math.abs(y2 - y1));
  const dx = x2 - x1;
  const dy = y2 - y1;

  const shapeOpts = {
    x: minX,
    y: minY,
    w,
    h,
    line: { color, width, dashType }
  };

  if ((dx > 0 && dy < 0) || (dx < 0 && dy > 0)) {
    shapeOpts.flipV = true;
  }

  slide.addShape(pres.ShapeType.line, shapeOpts);
}

/**
 * Creates the Master Title Slide for pre-AG1 presentation.
 */
export function createDocMasterTitleSlide(pres, {
  title = "pre-AG1: Příprava na Algoritmy a Grafy",
  subtitle = "Kompletní 1:1 příprava pro bioinformatiky na Algoritmy a Grafy 1 (FIT ČVUT)",
  author = "VŠCHT Učení · Obor Bioinformatika",
  date = "2026"
} = {}) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };

  // Subtle warm top accent border line
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 0.5,
    w: 11.733,
    h: 0.08,
    fill: { color: colors.brandOrange },
    line: { color: colors.brandOrange, width: 0.5 },
  });

  // Breadcrumb / Category
  slide.addText("OBOR BIOINFORMATIKA · PŘEDMĚT AG1 · FIT ČVUT", {
    x: 0.8,
    y: 0.75,
    w: 11.733,
    h: 0.35,
    fontFace: fonts.heading,
    fontSize: fs(10),
    color: colors.brandOrangeDark,
    bold: true,
    charSpacing: 1.5,
    margin: 0,
  });

  // Title
  slide.addText(cleanText(title), {
    x: 0.8,
    y: 1.25,
    w: 11.733,
    h: 1.2,
    fontFace: fonts.heading,
    fontSize: fs(24),
    color: colors.textPrimary,
    bold: true,
    lineSpacingMultiple: 1.15,
    margin: 0,
  });

  // Horizontal divider
  slide.addShape(pres.ShapeType.line, {
    x: 0.8,
    y: 2.65,
    w: 11.733,
    h: 0,
    line: { color: colors.borderSubtle, width: 1.5 },
  });

  // Subtitle
  slide.addText(cleanText(subtitle), {
    x: 0.8,
    y: 2.85,
    w: 11.733,
    h: 0.65,
    fontFace: fonts.sans,
    fontSize: fs(13),
    color: colors.textSecondary,
    lineSpacingMultiple: 1.2,
    margin: 0,
  });

  // Overview box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 3.75,
    w: 11.733,
    h: 2.8,
    rectRadius: 0.1,
    fill: { color: colors.calloutWarmBg },
    line: { color: colors.brandOrangeLight, width: 1 },
  });

  slide.addText("OBSAH KURZU (MODULY 2 AŽ 8):", {
    x: 1.1,
    y: 3.95,
    w: 11.1,
    h: 0.35,
    fontFace: fonts.heading,
    fontSize: fs(11),
    color: colors.brandOrangeDark,
    bold: true,
    margin: 0,
  });

  const modules = [
    "Modul 2 · Letní průvodce grafovou matematikou",
    "Modul 3 · Bio-Intuice & Co je Graf",
    "Modul 4 · Logický & Důkazový základ (včetně Anatomie Důkazu)",
    "Modul 5 · Indukce na Grafech & Redukční Past",
    "Modul 6 · Důkazy Sporem & Extremální Princip",
    "Modul 7 · Grafy v C++ & Reprezentace v Paměti",
    "Modul 8 · Zkouškový Workshop & Šablony Důkazů",
  ];

  const col1 = modules.slice(0, 4).join("\n");
  const col2 = modules.slice(4).join("\n");

  slide.addText(col1, {
    x: 1.1,
    y: 4.45,
    w: 5.4,
    h: 1.9,
    fontFace: fonts.sans,
    fontSize: fs(10),
    color: colors.textSecondary,
    lineSpacingMultiple: 1.25,
    margin: 0,
  });

  slide.addText(col2, {
    x: 6.7,
    y: 4.45,
    w: 5.4,
    h: 1.9,
    fontFace: fonts.sans,
    fontSize: fs(10),
    color: colors.textSecondary,
    lineSpacingMultiple: 1.25,
    margin: 0,
  });

  // Footer
  slide.addText(`${author} · ${date}`, {
    x: 0.8,
    y: 6.8,
    w: 11.733,
    h: 0.25,
    fontFace: fonts.sans,
    fontSize: fs(8.5),
    color: colors.textLightMuted,
    margin: 0,
  });

  return slide;
}
