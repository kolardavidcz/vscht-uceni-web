/**
 * Pre-AG1 PowerPoint Engine
 * Provides website-matched branding, font scaling (FONT_DELTA), layout primitives,
 * and mathematical Unicode text helpers for generating slides via pptxgenjs.
 */

// ============================================================================
// GLOBAL CONFIGURATION: FONT SIZE DELTA
// Change this value to adjust the font size across the entire presentation:
// 0 = Default, +1, +2 = Larger, -1, -2 = Smaller
// ============================================================================
export const FONT_DELTA = 0;

/**
 * Calculates responsive font size based on the base size and FONT_DELTA.
 * @param {number} base Base font size in points
 * @returns {number} Scaled font size (never lower than 7pt)
 */
export function fs(base) {
  return Math.max(7, Math.round(base + FONT_DELTA));
}

// ============================================================================
// BRAND COLOR TOKENS (Hex without '#', matching VŠCHT Učení web)
// ============================================================================
export const colors = {
  // Dark theme (Title / Section Divider)
  bgDark: "0F0906",
  bgCardDark: "1E140E",
  bgCardDarkBorder: "38241A",
  textDarkHeading: "FFFFFF",
  textDarkSub: "D6D3D1",
  textDarkMuted: "A8A29E",

  // Light theme (Content slides)
  bgLight: "FFFFFF",
  bgCardNeutral: "FBF9F7",
  bgCardNeutralBorder: "E7E5E4",

  // Semantic card tints
  bgCardWarm: "FFF7ED",
  borderWarm: "FED7AA",
  textWarmHeader: "C2410C",

  bgCardRose: "FFF1F2",
  borderRose: "FECDD3",
  textRoseHeader: "BE123C",

  bgCardEmerald: "F0FDF4",
  borderEmerald: "BBF7D0",
  textEmeraldHeader: "15803D",

  bgCardBlue: "F0F9FF",
  borderBlue: "BAE6FD",
  textBlueHeader: "0369A1",

  // Code blocks
  bgCode: "160F0B",
  borderCode: "2D1E16",
  codeText: "F5F0EA",
  codeMuted: "94A3B8",
  codeAccent: "F97316",

  // Primary brand accents
  brandOrange: "F95D12",
  brandOrangeDark: "C2410C",
  brandOrangeLight: "FED7AA",

  // Text colors
  textPrimary: "0F172A",
  textSecondary: "334155",
  textMuted: "64748B",
  textLightMuted: "94A3B8",
};

// Safe universal fonts for PowerPoint rendering
export const fonts = {
  sans: "Calibri",
  heading: "Calibri",
  mono: "Courier New",
};

/**
 * Clean text for PowerPoint XML to prevent entity parse errors.
 * Replaces unescaped ampersands.
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
    .replace(/\\exists/g, "∃")
    .replace(/\\neg/g, "¬")
    .replace(/\\lor/g, "∨")
    .replace(/\\land/g, "∧")
    .replace(/\\implies/g, "⇒")
    .replace(/\\iff/g, "⇔")
    .replace(/\\bot/g, "⊥")
    .replace(/\\in/g, "∈")
    .replace(/\\notin/g, "∉")
    .replace(/\\subset/g, "⊂")
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

// ============================================================================
// SLIDE PRIMITIVE BUILDERS
// ============================================================================

/**
 * Standard content slide header and footer chrome.
 */
export function addSlideChrome(slide, breadcrumb, title) {
  // Top category breadcrumb
  slide.addText(cleanText(breadcrumb).toUpperCase(), {
    x: 0.8,
    y: 0.35,
    w: 11.733,
    h: 0.25,
    fontFace: fonts.heading,
    fontSize: fs(9),
    color: colors.brandOrangeDark,
    bold: true,
    charSpacing: 1.5,
    margin: 0,
  });

  // Slide Title
  slide.addText(cleanText(title), {
    x: 0.8,
    y: 0.58,
    w: 11.733,
    h: 0.55,
    fontFace: fonts.heading,
    fontSize: fs(21),
    color: colors.textPrimary,
    bold: true,
    margin: 0,
  });

  // Bottom footer bar
  slide.addText("VŠCHT Učení · Obor Bioinformatika · pre-AG1 (Algoritmy a Grafy)", {
    x: 0.8,
    y: 7.02,
    w: 9.0,
    h: 0.25,
    fontFace: fonts.sans,
    fontSize: fs(8.5),
    color: colors.textLightMuted,
    margin: 0,
  });
}

/**
 * Creates the master presentation title slide.
 */
export function createCourseTitleSlide(pres, { title, subtitle, note, date = "2026", author = "VŠCHT Učení · Obor Bioinformatika" }) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgDark };

  // Subtle background glow/card container
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 0.8,
    w: 11.733,
    h: 5.9,
    rectRadius: 0.2,
    fill: { color: colors.bgCardDark },
    line: { color: colors.bgCardDarkBorder, width: 1.5 },
  });

  // Orange badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: 1.4,
    y: 1.4,
    w: 4.8,
    h: 0.38,
    rectRadius: 0.1,
    fill: { color: colors.brandOrangeDark },
    line: { color: colors.brandOrange, width: 1 },
  });
  slide.addText("OBOR BIOINFORMATIKA · PŘEDMĚT AG1", {
    x: 1.4,
    y: 1.4,
    w: 4.8,
    h: 0.38,
    fontFace: fonts.heading,
    fontSize: fs(10),
    color: colors.textWhite,
    bold: true,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // Main Title
  slide.addText(cleanText(title), {
    x: 1.4,
    y: 2.0,
    w: 10.5,
    h: 1.4,
    fontFace: fonts.heading,
    fontSize: fs(34),
    color: colors.textDarkHeading,
    bold: true,
    lineSpacingMultiple: 1.1,
    margin: 0,
  });

  // Subtitle
  slide.addText(cleanText(subtitle), {
    x: 1.4,
    y: 3.5,
    w: 10.5,
    h: 0.9,
    fontFace: fonts.sans,
    fontSize: fs(15),
    color: colors.textDarkSub,
    lineSpacingMultiple: 1.2,
    margin: 0,
  });

  // Course Highlights Grid
  const highlights = [
    "8 tématicky navazujících modulů",
    "Přechod z C++ (PA2) k rigorózní matematice",
    "Zkouškové šablony důkazů & eliminace pastí",
    "Grafové bioinformatické reprezentace"
  ];
  slide.addShape(pres.ShapeType.roundRect, {
    x: 1.4,
    y: 4.6,
    w: 10.5,
    h: 1.0,
    rectRadius: 0.1,
    fill: { color: colors.bgDark },
    line: { color: colors.bgCardDarkBorder, width: 1 },
  });

  highlights.forEach((hl, idx) => {
    const colX = 1.6 + idx * 2.55;
    slide.addText(cleanText(hl), {
      x: colX,
      y: 4.75,
      w: 2.4,
      h: 0.7,
      fontFace: fonts.sans,
      fontSize: fs(9.5),
      color: colors.brandOrangeLight,
      bold: true,
      lineSpacingMultiple: 1.1,
      margin: 0,
    });
  });

  // Footer metadata
  slide.addText(`${cleanText(author)} · ${date}`, {
    x: 1.4,
    y: 6.2,
    w: 8.0,
    h: 0.3,
    fontFace: fonts.sans,
    fontSize: fs(10),
    color: colors.textDarkMuted,
    margin: 0,
  });

  return slide;
}

/**
 * Creates a section divider slide introducing one of the 8 lectures.
 */
export function createLectureDividerSlide(pres, { lectureNumber, title, subtitle, goal, topics = [] }) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgDark };

  // Outer framed container
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 0.8,
    w: 11.733,
    h: 5.9,
    rectRadius: 0.2,
    fill: { color: colors.bgCardDark },
    line: { color: colors.bgCardDarkBorder, width: 1.5 },
  });

  // Category chip
  slide.addText(`LEKCE ${lectureNumber} · PRE-AG1 KURZ`, {
    x: 1.4,
    y: 1.25,
    w: 6.0,
    h: 0.3,
    fontFace: fonts.heading,
    fontSize: fs(11),
    color: colors.brandOrange,
    bold: true,
    charSpacing: 2.0,
    margin: 0,
  });

  // Lecture Title
  slide.addText(cleanText(title), {
    x: 1.4,
    y: 1.6,
    w: 10.5,
    h: 1.1,
    fontFace: fonts.heading,
    fontSize: fs(28),
    color: colors.textDarkHeading,
    bold: true,
    lineSpacingMultiple: 1.1,
    margin: 0,
  });

  // Goal Box
  if (goal) {
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.4,
      y: 2.8,
      w: 10.5,
      h: 1.2,
      rectRadius: 0.1,
      fill: { color: colors.bgDark },
      line: { color: colors.brandOrangeDark, width: 1.2 },
    });

    slide.addText("CÍL TÉTO KAPITOLY:", {
      x: 1.65,
      y: 2.95,
      w: 10.0,
      h: 0.25,
      fontFace: fonts.heading,
      fontSize: fs(10),
      color: colors.brandOrange,
      bold: true,
      margin: 0,
    });

    slide.addText(cleanText(goal), {
      x: 1.65,
      y: 3.25,
      w: 10.0,
      h: 0.65,
      fontFace: fonts.sans,
      fontSize: fs(11),
      color: colors.textDarkSub,
      lineSpacingMultiple: 1.2,
      margin: 0,
    });
  }

  // Topics Grid
  if (topics.length > 0) {
    slide.addText("PŘEHLED PROBÍRANÝCH TÉMAT:", {
      x: 1.4,
      y: 4.25,
      w: 10.0,
      h: 0.25,
      fontFace: fonts.heading,
      fontSize: fs(10),
      color: colors.textDarkMuted,
      bold: true,
      margin: 0,
    });

    const colWidth = 5.1;
    topics.forEach((top, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const topX = 1.4 + col * (colWidth + 0.3);
      const topY = 4.6 + row * 0.45;

      slide.addText(`• ${cleanText(top)}`, {
        x: topX,
        y: topY,
        w: colWidth,
        h: 0.4,
        fontFace: fonts.sans,
        fontSize: fs(10.5),
        color: colors.textDarkSub,
        margin: 0,
      });
    });
  }

  return slide;
}

/**
 * Creates a standard 2-card side-by-side content slide.
 */
export function createTwoCardSlide(pres, {
  breadcrumb,
  title,
  leftCard: { title: lTitle, items: lItems, type: lType = "neutral", badge: lBadge },
  rightCard: { title: rTitle, items: rItems, type: rType = "warm", badge: rBadge },
  notes = ""
}) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };
  addSlideChrome(slide, breadcrumb, title);

  const cardY = 1.25;
  const cardH = 5.5;
  const cardW = 5.7;

  // Render Left Card
  renderContentCard(pres, slide, {
    x: 0.8,
    y: cardY,
    w: cardW,
    h: cardH,
    title: lTitle,
    items: lItems,
    type: lType,
    badge: lBadge
  });

  // Render Right Card
  renderContentCard(pres, slide, {
    x: 6.8,
    y: cardY,
    w: cardW,
    h: cardH,
    title: rTitle,
    items: rItems,
    type: rType,
    badge: rBadge
  });

  if (notes) slide.addNotes(notes);
  return slide;
}

export function createSingleCardSlide(pres, {
  breadcrumb,
  title,
  card,
  cardTitle,
  cardSubtitle,
  items,
  type = "neutral",
  badge,
  notes = ""
}) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };
  addSlideChrome(slide, breadcrumb, title);

  const cObj = typeof card === "object" && card !== null ? card : {};
  const finalTitle = cObj.title || cardTitle || "";
  const finalSubtitle = cObj.subtitle || cardSubtitle || "";
  const finalItems = cObj.items || items || [];
  const finalType = cObj.type || type || "neutral";
  const finalBadge = cObj.badge || badge;

  renderContentCard(pres, slide, {
    x: 0.8,
    y: 1.25,
    w: 11.733,
    h: 5.5,
    title: finalTitle,
    subtitle: finalSubtitle,
    items: finalItems,
    type: finalType,
    badge: finalBadge
  });

  if (notes) slide.addNotes(notes);
  return slide;
}

export function createCodeSlide(pres, {
  breadcrumb,
  title,
  leftCard,
  codeBlock,
  code,
  notes = ""
}) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };
  addSlideChrome(slide, breadcrumb, title);

  const cardY = 1.25;
  const cardH = 5.5;

  let lTitle = "Vysvětlení & Principy";
  let lItems = [];
  let lType = "warm";

  if (leftCard) {
    lTitle = leftCard.title || lTitle;
    lItems = leftCard.items || [];
    lType = leftCard.type || "warm";
  } else if (Array.isArray(notes)) {
    lItems = notes;
  }

  let cTitle = "Implementace v C++";
  let cCode = "";
  let analysisItems = [];

  if (codeBlock) {
    cTitle = codeBlock.title || cTitle;
    cCode = codeBlock.code || "";
    analysisItems = codeBlock.analysisItems || [];
  } else if (code) {
    cCode = code;
  }

  // Left explanation card
  renderContentCard(pres, slide, {
    x: 0.8,
    y: cardY,
    w: 5.4,
    h: cardH,
    title: lTitle,
    items: lItems,
    type: lType
  });

  // Right dark code card
  const rX = 6.5;
  const rW = 6.033;

  slide.addShape(pres.ShapeType.roundRect, {
    x: rX,
    y: cardY,
    w: rW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: colors.bgCode },
    line: { color: colors.borderCode, width: 1.5 },
  });

  // Code card header
  slide.addText(`💻 ${cleanText(cTitle || "Implementace v C++")}`, {
    x: rX + 0.35,
    y: cardY + 0.25,
    w: rW - 0.7,
    h: 0.35,
    fontFace: fonts.heading,
    fontSize: fs(12.5),
    color: colors.codeAccent,
    bold: true,
    valign: "top",
    margin: 0,
  });

  // Code body
  slide.addText(cCode, {
    x: rX + 0.35,
    y: cardY + 0.75,
    w: rW - 0.7,
    h: analysisItems.length > 0 ? 3.3 : 4.4,
    fontFace: fonts.mono,
    fontSize: fs(9.5),
    color: colors.codeText,
    lineSpacingMultiple: 1.15,
    valign: "top",
    margin: 0,
  });

  // Analysis / takeaway below code if provided
  if (analysisItems.length > 0) {
    slide.addShape(pres.ShapeType.roundRect, {
      x: rX + 0.25,
      y: cardY + 4.15,
      w: rW - 0.5,
      h: 1.15,
      rectRadius: 0.08,
      fill: { color: colors.bgDark },
      line: { color: colors.borderCode, width: 1 },
    });

    slide.addText("Dopad na AG1 a složitost:", {
      x: rX + 0.45,
      y: cardY + 4.25,
      w: rW - 0.9,
      h: 0.22,
      fontFace: fonts.heading,
      fontSize: fs(9.5),
      color: colors.brandOrange,
      bold: true,
      margin: 0,
    });

    const analysisTexts = analysisItems.map(item => `• ${cleanText(texToUnicode(item))}`).join("\n");
    slide.addText(analysisTexts, {
      x: rX + 0.45,
      y: cardY + 4.5,
      w: rW - 0.9,
      h: 0.75,
      fontFace: fonts.sans,
      fontSize: fs(9.5),
      color: colors.codeMuted,
      lineSpacingMultiple: 1.15,
      margin: 0,
    });
  }

  if (notes) slide.addNotes(notes);
  return slide;
}

export function createThreeCardSlide(pres, { breadcrumb, title, cards, card1, card2, card3, notes = "" }) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };
  addSlideChrome(slide, breadcrumb, title);

  const cardW = 3.65;
  const cardH = 5.5;
  const gap = 0.39;

  const cardList = Array.isArray(cards) ? cards : [card1, card2, card3].filter(Boolean);

  cardList.forEach((card, idx) => {
    const cX = 0.8 + idx * (cardW + gap);
    renderContentCard(pres, slide, {
      x: cX,
      y: 1.25,
      w: cardW,
      h: cardH,
      title: card.title,
      subtitle: card.subtitle,
      items: card.items,
      type: card.type || "neutral",
      badge: card.badge
    });
  });

  if (notes) slide.addNotes(notes);
  return slide;
}

export function createProofSlide(pres, {
  breadcrumb,
  title,
  theorem,
  statement,
  steps = [],
  takeaway,
  notes = ""
}) {
  const slide = pres.addSlide();
  slide.background = { color: colors.bgLight };
  addSlideChrome(slide, breadcrumb, title);

  const cardY = 1.25;
  const cardH = 5.5;
  const lW = 5.6;
  const rW = 5.8;

  const thObj = typeof theorem === "object" && theorem !== null ? theorem : {};
  const stmtText = thObj.statement || statement || (typeof theorem === "string" ? theorem : "");

  // Left card: Theorem statement and intuition
  renderContentCard(pres, slide, {
    x: 0.8,
    y: cardY,
    w: lW,
    h: cardH,
    title: "Věta & Formální Tvrzení",
    type: "warm",
    badge: "AG1 TEORIE",
    items: [
      { bold: "Dokazované tvrzení:", text: texToUnicode(stmtText) },
      ...(thObj.context ? [{ bold: "Kontext a význam:", text: texToUnicode(thObj.context) }] : []),
      ...(thObj.trap ? [{ bold: "⚠️ Častá past studentů:", text: texToUnicode(thObj.trap) }] : []),
      ...(thObj.strategy ? [{ bold: "Důkazová strategie:", text: texToUnicode(thObj.strategy) }] : [])
    ]
  });

  // Right card: Step-by-step formal derivation
  renderContentCard(pres, slide, {
    x: 6.7,
    y: cardY,
    w: rW,
    h: cardH,
    title: "Kroky Důkazu & Formální Zápis",
    type: "neutral",
    badge: "ŠABLONA DŮKAZU",
    items: [
      ...steps.map((s, idx) => ({
        bold: s.step ? `${s.step}:` : (s.bold || `Krok ${idx + 1}:`),
        text: texToUnicode(s.text)
      })),
      ...(takeaway ? [{ bold: "🎯 Závěr & Q.E.D.:", text: texToUnicode(takeaway) }] : [])
    ]
  });

  if (notes) slide.addNotes(notes);
  return slide;
}

// ============================================================================
// INTERNAL CARD RENDERER
// ============================================================================

function renderContentCard(pres, slide, { x, y, w, h, title, subtitle, items = [], type = "neutral", badge }) {
  let bgColor = colors.bgCardNeutral;
  let borderColor = colors.bgCardNeutralBorder;
  let headerColor = colors.textPrimary;

  if (type === "warm") {
    bgColor = colors.bgCardWarm;
    borderColor = colors.borderWarm;
    headerColor = colors.textWarmHeader;
  } else if (type === "rose") {
    bgColor = colors.bgCardRose;
    borderColor = colors.borderRose;
    headerColor = colors.textRoseHeader;
  } else if (type === "emerald") {
    bgColor = colors.bgCardEmerald;
    borderColor = colors.borderEmerald;
    headerColor = colors.textEmeraldHeader;
  } else if (type === "blue") {
    bgColor = colors.bgCardBlue;
    borderColor = colors.borderBlue;
    headerColor = colors.textBlueHeader;
  }

  // Card Background Box
  slide.addShape(pres.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: bgColor },
    line: { color: borderColor, width: 1.2 },
  });

  let currentY = y + 0.3;

  // Optional Badge
  if (badge) {
    slide.addShape(pres.ShapeType.roundRect, {
      x: x + 0.35,
      y: currentY,
      w: Math.min(w - 0.7, 2.2),
      h: 0.28,
      rectRadius: 0.08,
      fill: { color: borderColor },
      line: { color: borderColor, width: 1 },
    });

    slide.addText(cleanText(badge).toUpperCase(), {
      x: x + 0.35,
      y: currentY,
      w: Math.min(w - 0.7, 2.2),
      h: 0.28,
      fontFace: fonts.heading,
      fontSize: fs(8.5),
      color: headerColor,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    currentY += 0.38;
  }

  // Card Title
  if (title) {
    slide.addText(cleanText(texToUnicode(title)), {
      x: x + 0.35,
      y: currentY,
      w: w - 0.7,
      h: 0.38,
      fontFace: fonts.heading,
      fontSize: fs(14),
      color: headerColor,
      bold: true,
      margin: 0,
    });
    currentY += 0.42;
  }

  // Card Subtitle
  if (subtitle) {
    slide.addText(cleanText(texToUnicode(subtitle)), {
      x: x + 0.35,
      y: currentY,
      w: w - 0.7,
      h: 0.32,
      fontFace: fonts.sans,
      fontSize: fs(10),
      color: colors.textMuted,
      margin: 0,
    });
    currentY += 0.38;
  }

  // Content Items
  if (Array.isArray(items) && items.length > 0) {
    const textRuns = [];

    items.forEach((item, idx) => {
      if (typeof item === "string") {
        textRuns.push({
          text: `• ${cleanText(texToUnicode(item))}\n`,
          options: {
            fontFace: fonts.sans,
            fontSize: fs(11),
            color: colors.textSecondary,
            lineSpacingMultiple: 1.2,
          }
        });
      } else if (typeof item === "object" && item !== null) {
        if (item.bold) {
          textRuns.push({
            text: `• ${cleanText(texToUnicode(item.bold))} `,
            options: {
              fontFace: fonts.sans,
              fontSize: fs(11),
              color: colors.textPrimary,
              bold: true,
              lineSpacingMultiple: 1.2,
            }
          });
        }
        if (item.text) {
          textRuns.push({
            text: `${cleanText(texToUnicode(item.text))}\n`,
            options: {
              fontFace: fonts.sans,
              fontSize: fs(11),
              color: colors.textSecondary,
              lineSpacingMultiple: 1.2,
            }
          });
        }
      }
    });

    const remainingH = (y + h - 0.25) - currentY;
    slide.addText(textRuns, {
      x: x + 0.35,
      y: currentY,
      w: w - 0.7,
      h: Math.max(1.0, remainingH),
      valign: "top",
      margin: 0,
    });
  }
}
