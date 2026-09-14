import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const PRIMARY = "065A82";   // deep blue
const SECONDARY = "1C7293"; // teal
const DARK = "21295C";      // midnight
const ACCENT = "E8702A";    // warm orange (sharp accent)
const CARD_BG = "EAF2F6";
const CARD_BG2 = "F5F8FA";
const TEXT_DARK = "1B2430";
const MUTED = "5B7480";
const WHITE = "FFFFFF";

const TITLE_FONT = "Cambria";
const BODY_FONT = "Calibri";

const pres = new pptxgen();
pres.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pres.layout = "WIDESCREEN_16_9";
pres.title = "Průvodce prváka · Bioinformatika VŠCHT × FIT ČVUT";
pres.author = "David";

const PW = 13.333, PH = 7.5;
let pageNum = 0;

function footer(slide, label, isDark = false) {
  pageNum++;
  slide.addText(label || "PRŮVODCE PRVÁKA · BIOINFORMATIKA VŠCHT × FIT ČVUT", {
    x: 0.6, y: 7.16, w: 9, h: 0.28, fontFace: BODY_FONT, fontSize: 9,
    color: isDark ? "8FD4EE" : MUTED, align: "left", isTextBox: true, margin: 0
  });
  slide.addText(String(pageNum), {
    x: 12.3, y: 7.16, w: 0.5, h: 0.28, fontFace: BODY_FONT, fontSize: 9,
    color: isDark ? "8FD4EE" : MUTED, align: "right", isTextBox: true, margin: 0
  });
}

function badge(slide, x, y, d, symbol, fill) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill || PRIMARY }, line: { type: "none" } });
  slide.addText(symbol, {
    x, y, w: d, h: d, fontFace: BODY_FONT, fontSize: d > 0.5 ? 20 : 14, bold: true,
    color: WHITE, align: "center", valign: "middle", isTextBox: true, margin: 0
  });
}

function header(slide, kicker, title, opts = {}) {
  const symbol = opts.symbol || "";
  const color = opts.color || PRIMARY;
  if (symbol) badge(slide, 0.6, 0.42, 0.5, symbol, color);
  slide.addText(kicker.toUpperCase(), {
    x: symbol ? 1.25 : 0.6, y: 0.4, w: 10.5, h: 0.28, fontFace: BODY_FONT, fontSize: 12, bold: true,
    color: color, charSpacing: 1.5, isTextBox: true, margin: 0
  });
  slide.addText(title, {
    x: symbol ? 1.25 : 0.6, y: 0.68, w: 11.4, h: 0.6, fontFace: TITLE_FONT, fontSize: 28, bold: true,
    color: TEXT_DARK, isTextBox: true, margin: 0
  });
}

// row with a small circular check/symbol + bold header + description
function iconRow(slide, x, y, w, symbol, head, desc, color, headSize, descSize) {
  const d = 0.36;
  badge(slide, x, y, d, symbol, color || SECONDARY);
  slide.addText(head, {
    x: x + d + 0.18, y: y - 0.05, w: w - d - 0.18, h: 0.3, fontFace: BODY_FONT, fontSize: headSize || 14.5,
    bold: true, color: TEXT_DARK, isTextBox: true, margin: 0
  });
  if (desc) {
    slide.addText(desc, {
      x: x + d + 0.18, y: y + 0.24, w: w - d - 0.18, h: 0.6, fontFace: BODY_FONT, fontSize: descSize || 11.5,
      color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.08
    });
  }
}

function card(slide, x, y, w, h, fill) {
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.09, fill: { color: fill || CARD_BG }, line: { type: "none" },
    shadow: { type: "outer", color: "1B2430", opacity: 0.12, blur: 6, offset: 2, angle: 90 }
  });
}

/* ---------------- SLIDE 0 : TITLE ---------------- */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addShape("ellipse", { x: 10.2, y: -1.6, w: 5.2, h: 5.2, fill: { color: PRIMARY }, line: { type: "none" }, transparency: 35 });
  s.addShape("ellipse", { x: -1.8, y: 4.8, w: 4.2, h: 4.2, fill: { color: SECONDARY }, line: { type: "none" }, transparency: 45 });

  s.addText("PRŮVODCE PRVÁKA", {
    x: 0.9, y: 2.15, w: 10, h: 0.5, fontFace: BODY_FONT, fontSize: 15, bold: true, color: "8FD4EE",
    charSpacing: 3, isTextBox: true, margin: 0
  });
  s.addText("Začátek 1. semestru", {
    x: 0.85, y: 2.6, w: 11.5, h: 1.4, fontFace: TITLE_FONT, fontSize: 46, bold: true, color: WHITE,
    isTextBox: true, margin: 0
  });
  s.addText("Bioinformatika  ·  VŠCHT Praha  ×  FIT ČVUT", {
    x: 0.9, y: 3.75, w: 10.5, h: 0.5, fontFace: BODY_FONT, fontSize: 18, color: "CADCFC",
    isTextBox: true, margin: 0
  });
  s.addShape("line", { x: 0.92, y: 4.45, w: 2.2, h: 0, line: { color: ACCENT, width: 3 } });
  s.addText("Organizace studia na dvou školách · checklist prvních dvou týdnů · taktika na BI-PA1 a zápočty · pravidla během semestru", {
    x: 0.9, y: 4.7, w: 10.2, h: 0.8, fontFace: BODY_FONT, fontSize: 13, color: "AFC3D6",
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.2
  });
  s.addText("student.vscht.cz  ·  kos.cvut.cz  ·  discord.gg/yWxFJmM6Qg", {
    x: 0.9, y: 6.65, w: 10, h: 0.35, fontFace: BODY_FONT, fontSize: 11, color: "7E93A8", isTextBox: true, margin: 0
  });
}

/* ---------------- SLIDE 1 : DVĚ UNIVERZITY ---------------- */
{
  const s = pres.addSlide();
  header(s, "Organizace studia", "Dvě univerzity, jeden index", { symbol: "⇄", color: PRIMARY });

  const colW = 5.65, y0 = 1.65, h0 = 4.55;
  card(s, 0.6, y0, colW, h0, CARD_BG);
  card(s, 7.08, y0, colW, h0, CARD_BG2);

  s.addText("VŠCHT PRAHA", { x: 0.9, y: y0 + 0.28, w: colW - 0.6, h: 0.35, fontFace: BODY_FONT, fontSize: 15, bold: true, color: PRIMARY, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Formální příslušnost\n", options: { bold: true, color: TEXT_DARK, fontSize: 13 } },
    { text: "Řádní studenti výhradně VŠCHT Praha (Fakulta chemické technologie)\n\n", options: { color: MUTED, fontSize: 12 } },
    { text: "Řídicí předpis\n", options: { bold: true, color: TEXT_DARK, fontSize: 13 } },
    { text: "Studijní a zkušební řád VŠCHT\n\n", options: { color: MUTED, fontSize: 12 } },
    { text: "Jediný závazný systém\n", options: { bold: true, color: TEXT_DARK, fontSize: 13 } },
    { text: "SIS VŠCHT (student.vscht.cz) — kredity, zkoušky, postup do dalších semestrů", options: { color: MUTED, fontSize: 12 } },
  ], { x: 0.9, y: y0 + 0.75, w: colW - 0.6, h: h0 - 1.1, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });

  s.addText("FIT ČVUT", { x: 7.38, y: y0 + 0.28, w: colW - 0.6, h: 0.35, fontFace: BODY_FONT, fontSize: 15, bold: true, color: SECONDARY, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Vztah ke studiu\n", options: { bold: true, color: TEXT_DARK, fontSize: 13 } },
    { text: "Pouze smluvní výuka informatických předmětů\n\n", options: { color: MUTED, fontSize: 12 } },
    { text: "KOS ČVUT\n", options: { bold: true, color: TEXT_DARK, fontSize: 13 } },
    { text: "Kreditová zátěž a zápisy jsou pouze orientační\n\n", options: { color: MUTED, fontSize: 12 } },
    { text: "Rozhoduje\n", options: { bold: true, color: TEXT_DARK, fontSize: 13 } },
    { text: "O postupu do dalších semestrů výhradně počet kreditů a zkoušek v SISu", options: { color: MUTED, fontSize: 12 } },
  ], { x: 7.38, y: y0 + 0.75, w: colW - 0.6, h: h0 - 1.1, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });

  s.addText("Univerzální celoškolský Průvodce prváka VŠCHT (PKC) — doplňkový oficiální PDF návod", {
    x: 0.6, y: 6.42, w: 11.5, h: 0.4, fontFace: BODY_FONT, fontSize: 11, italic: true, color: MUTED, isTextBox: true, margin: 0
  });
  footer(s);
}

/* ---------------- SLIDE 2 : KONTAKTY ---------------- */
{
  const s = pres.addSlide();
  header(s, "Organizace studia", "Na koho se obrátit", { symbol: "✉", color: PRIMARY });

  const contacts = [
    { init: "PK", name: "Petra Kohoutová", role: "Studijní referentka FCHT VŠCHT", desc: "Potvrzení o studiu, žádosti, stipendia, rozložení ročníku", mail: "Petra.Kohoutova@vscht.cz" },
    { init: "MŠ", name: "Dr. Martin Šícho", role: "Garant oboru", desc: "Koncepce programu, řešení zásadních studijních otázek", mail: "Martin.Sicho@vscht.cz" },
    { init: "JZ", name: "Ing. Jiří Znamenáček", role: "Tajemník ústavu", desc: "Rozvrh a organizace výuky na ÚICH", mail: "Jiri.Znamenacek@vscht.cz" },
    { init: "ZK", name: "Zdeňka Kutinová", role: "Studijní referentka FIT ČVUT pro bioinformatiky", desc: "Zápis do KOSu, kapacitní výjimky, kolize v rozvrhu, přístupy na FIT", mail: "zdenka.kutinova@fit.cvut.cz" },
  ];
  const colors = [PRIMARY, SECONDARY, PRIMARY, SECONDARY];
  let y = 1.7;
  contacts.forEach((c, i) => {
    const rh = 1.18;
    card(s, 0.6, y, 11.9, rh - 0.18, i % 2 === 0 ? CARD_BG : CARD_BG2);
    badge(s, 0.85, y + 0.16, 0.62, c.init, colors[i]);
    s.addText(c.name, { x: 1.7, y: y + 0.08, w: 4.6, h: 0.32, fontFace: BODY_FONT, fontSize: 14.5, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
    s.addText(c.role, { x: 1.7, y: y + 0.4, w: 4.6, h: 0.5, fontFace: BODY_FONT, fontSize: 11, color: colors[i], bold: true, isTextBox: true, margin: 0 });
    s.addText(c.desc, { x: 6.5, y: y + 0.1, w: 3.8, h: 0.65, fontFace: BODY_FONT, fontSize: 11, color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.1 });
    s.addText(c.mail, { x: 10.4, y: y + 0.31, w: 2.0, h: 0.5, fontFace: BODY_FONT, fontSize: 9.5, color: TEXT_DARK, isTextBox: true, margin: 0, align: "left", lineSpacingMultiple: 1.05 });
    y += rh;
  });
  s.addText("Hromadný kontakt pro celý ročník: bioinformatika@fit.cvut.cz", {
    x: 0.6, y: y + 0.05, w: 11.9, h: 0.35, fontFace: BODY_FONT, fontSize: 11.5, italic: true, color: MUTED, isTextBox: true, margin: 0
  });
  footer(s);
}

/* ---------------- SLIDE 3 : DISCORD ---------------- */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addShape("ellipse", { x: 9.6, y: 3.6, w: 6, h: 6, fill: { color: PRIMARY }, line: { type: "none" }, transparency: 40 });
  s.addText("CHECKLIST PRVNÍCH DVOU TÝDNŮ · KOMUNITA", {
    x: 0.9, y: 1.0, w: 10, h: 0.35, fontFace: BODY_FONT, fontSize: 13, bold: true, color: "8FD4EE", charSpacing: 1.5, isTextBox: true, margin: 0
  });
  s.addText("Discord BioCord", { x: 0.85, y: 1.4, w: 10, h: 0.9, fontFace: TITLE_FONT, fontSize: 38, bold: true, color: WHITE, isTextBox: true, margin: 0 });

  const items = [
    ["Připojte se", "discord.gg/yWxFJmM6Qg"],
    ["Změňte si nickname", "na civilní tvar „Jméno Příjmení“"],
    ["Hlavní kanál", "oficiální komunikace ústavu i spolužáků"],
  ];
  let y = 2.9;
  items.forEach((it, i) => {
    badge(s, 0.9, y, 0.42, "✓", ACCENT);
    s.addText(it[0], { x: 1.5, y: y - 0.03, w: 4.2, h: 0.35, fontFace: BODY_FONT, fontSize: 15, bold: true, color: WHITE, isTextBox: true, margin: 0 });
    s.addText(it[1], { x: 1.5, y: y + 0.32, w: 8, h: 0.4, fontFace: BODY_FONT, fontSize: 12.5, color: "AFC3D6", isTextBox: true, margin: 0 });
    y += 0.95;
  });
  footer(s, "PRŮVODCE PRVÁKA · BIOINFORMATIKA VŠCHT × FIT ČVUT", true);
}

/* ---------------- SLIDE 4 : KARTY A VSTUP NA FIT ---------------- */
{
  const s = pres.addSlide();
  header(s, "Checklist prvních dvou týdnů", "Karty a vstup na FIT ČVUT", { symbol: "▤", color: SECONDARY });

  card(s, 0.6, 1.7, 5.65, 4.9, CARD_BG);
  s.addText("Karta VŠCHT / ISIC", { x: 0.9, y: 1.95, w: 5.05, h: 0.35, fontFace: BODY_FONT, fontSize: 15, bold: true, color: PRIMARY, isTextBox: true, margin: 0 });
  iconRow(s, 0.9, 2.65, 5.05, "!", "Nevydává se při zápisu", "Nutné vyzvednout osobně v Kartovém centru VŠCHT", ACCENT);
  iconRow(s, 0.9, 3.85, 5.05, "✓", "Fotka na kartě", "Zůstává platná po celou dobu studia", PRIMARY);
  s.addText("Kartové centrum VŠCHT — budova B (naproti respiriu)", {
    x: 0.9, y: 5.5, w: 5.05, h: 0.35, fontFace: BODY_FONT, fontSize: 10.5, italic: true, color: MUTED, isTextBox: true, margin: 0
  });

  card(s, 6.5, 1.7, 6.0, 4.9, CARD_BG2);
  s.addText("Aktivace vstupu na ČVUT", { x: 6.8, y: 1.95, w: 5.4, h: 0.35, fontFace: BODY_FONT, fontSize: 15, bold: true, color: SECONDARY, isTextBox: true, margin: 0 });
  iconRow(s, 6.8, 2.5, 5.4, "!", "Kdy jít", "Výhradně v 1. týdnu výuky na VŠCHT — dříve vás systém ČVUT nerozpozná, později jsou obří fronty", SECONDARY);
  iconRow(s, 6.8, 3.55, 5.4, "✓", "Rezervace", "Čas si rezervujte předem online", SECONDARY);
  iconRow(s, 6.8, 4.35, 5.4, "✓", "Co vyřídíte", "Nahrání vstupu do budov FITu na kartu VŠCHT + vydání iniciálního hesla ČVUT", SECONDARY);

  s.addText("Vydavatelství průkazů — Oddělení průkazů ČVUT (ist.cvut.cz)", {
    x: 6.8, y: 5.5, w: 5.4, h: 0.35, fontFace: BODY_FONT, fontSize: 10.5, italic: true, color: MUTED, isTextBox: true, margin: 0
  });
  footer(s);
}

/* ---------------- SLIDE 5 : ÚČTY, HESLA, WI-FI ---------------- */
{
  const s = pres.addSlide();
  header(s, "Checklist prvních dvou týdnů", "Účty, hesla, Wi-Fi a bezpečnost", { symbol: "⚿", color: PRIMARY });

  const items = [
    ["Heslo ČVUT", "Usermap ČVUT — zadejte iniciální heslo, nastavte trvalé"],
    ["Wi-Fi eduroam", "Bezpečnostní certifikát z webu Výpočetního centra VŠCHT"],
    ["Síťové heslo FIT", "V profilu na Usermap ČVUT — odlišné od hesla do KOSu"],
    ["Registrace v NTK", "Osobně u pultu, ISIC/karta VŠCHT — Wi-Fi, tiskárny, výpůjčky, noční studovna"],
    ["Forward e-mailů", "Z @vscht.cz i @fit.cvut.cz do jedné soukromé schránky"],
    ["BOZP školení", "VŠCHT: podpis při zápisu · FIT: e-learning + fyzický podpis (výzva e-mailem během semestru)"],
  ];
  const cols = 2, colW = 5.85, gap = 0.3;
  items.forEach((it, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 0.6 + col * (colW + gap);
    const y = 1.75 + row * 1.48;
    card(s, x, y, colW, 1.3, (i % 2 === 0) ? CARD_BG : CARD_BG2);
    iconRow(s, x + 0.25, y + 0.24, colW - 0.5, "✓", it[0], it[1], PRIMARY, 14, 11);
  });
  footer(s);
}

/* ---------------- SLIDE 6 : C KEYWORDS ---------------- */
{
  const s = pres.addSlide();
  header(s, "Checklist prvních dvou týdnů", "Programátorský základ pro BI-PA1", { symbol: "{ }", color: SECONDARY });
  s.addText("Umíte vlastními slovy vysvětlit, co dané klíčové slovo jazyka C dělá a k čemu slouží? Konkrétní význam a příklady použití si ujasněte např. pomocí AI.", {
    x: 0.6, y: 1.42, w: 12.1, h: 0.4, fontFace: BODY_FONT, fontSize: 12, italic: true, color: MUTED, isTextBox: true, margin: 0
  });

  const groups = [
    ["Datové typy", "char · int · float · double · void"],
    ["Modifikátory typů", "short · long · signed · unsigned"],
    ["Řízení toku programu", "if · else · switch · case · default · break"],
    ["Smyčky (cykly)", "for · while · do · continue"],
    ["Struktury a uživatelské typy", "struct · union · enum · typedef"],
    ["Symboly", "*  a  &"],
    ["Ostatní", "return · const"],
  ];
  const cols = 2, colW = 5.85, gap = 0.3, rowH = 0.78;
  groups.forEach((g, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 0.6 + col * (colW + gap);
    const y = 2.0 + row * (rowH + 0.14);
    card(s, x, y, colW, rowH, i % 2 === 0 ? CARD_BG : CARD_BG2);
    s.addShape("rect", { x: x, y: y, w: 0.09, h: rowH, fill: { color: PRIMARY }, line: { type: "none" } });
    s.addText(g[0], { x: x + 0.28, y: y + 0.1, w: colW - 0.5, h: 0.3, fontFace: BODY_FONT, fontSize: 13, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
    s.addText(g[1], { x: x + 0.28, y: y + 0.4, w: colW - 0.5, h: 0.32, fontFace: "Courier New", fontSize: 11.5, color: SECONDARY, isTextBox: true, margin: 0 });
  });
  footer(s);
}

/* ---------------- SLIDE 7 : SYSTÉMY VŠCHT ---------------- */
{
  const s = pres.addSlide();
  header(s, "Rozcestník školních systémů", "Systémy VŠCHT", { symbol: "1", color: PRIMARY });

  const sys = [
    ["SIS VŠCHT", "student.vscht.cz", "Rozvrh, zkouškové termíny, oficiální index, zápis předmětů a stipendia"],
    ["Moodle VŠCHT", "e-learning.vscht.cz", "Slajdy z přednášek, cvičné testy z chemie a matematiky"],
    ["Průvodce studiem VŠCHT", "studium.vscht.cz", "Portál pro začínající studenty — první kroky, předpisy, organizace výuky a zázemí"],
    ["Mapy Emil VŠCHT", "emil.vscht.cz/maps", "Interaktivní plánek budov A a B a hledání učeben"],
    ["studuj.bioinformatiku.cz", "studuj.bioinformatiku.cz", "Studijní plány oboru a obsazenost klubovny B1322"],
  ];
  let y = 1.75;
  sys.forEach((r, i) => {
    const h = 0.92;
    card(s, 0.6, y, 11.9, h - 0.16, i % 2 === 0 ? CARD_BG : CARD_BG2);
    badge(s, 0.85, y + 0.16, 0.44, String(i + 1), PRIMARY);
    s.addText(r[0], { x: 1.5, y: y + 0.07, w: 3.6, h: 0.3, fontFace: BODY_FONT, fontSize: 13.5, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
    s.addText(r[1], { x: 1.5, y: y + 0.38, w: 3.6, h: 0.3, fontFace: BODY_FONT, fontSize: 10.5, color: PRIMARY, isTextBox: true, margin: 0 });
    s.addText(r[2], { x: 5.3, y: y + 0.12, w: 7.0, h: 0.55, fontFace: BODY_FONT, fontSize: 11.5, color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.1 });
    y += h;
  });
  footer(s);
}

/* ---------------- SLIDE 8 : SYSTÉMY FIT ČVUT ---------------- */
{
  const s = pres.addSlide();
  header(s, "Rozcestník školních systémů", "Systémy FIT ČVUT", { symbol: "2", color: SECONDARY });

  const sys = [
    ["KOS ČVUT", "kos.cvut.cz", "Zápis předmětů, paralelek a zkoušek na FITu"],
    ["Timetable FIT", "timetable.fit.cvut.cz", "Detailní rozvrhy předmětů FIT a obsazenost učeben"],
    ["Courses FIT", "courses.fit.cvut.cz", "Výukový portál FIT — přednášky, materiály ze cvičení, zadání"],
    ["Trainer KSI", "trainer.ksi.fit.cvut.cz", "Cvičebnice programování od základů v C až po zkouškové úlohy"],
    ["FIT-Wiki", "fit-wiki.cz", "Studentská databáze — zápisky z přednášek a archiv minulých zkouškových písemek"],
    ["Progtest", "progtest.fit.cvut.cz", "Odevzdávací systém programovacích úloh pro BI-PA1"],
    ["FIT Help a Navigace", "help.fit.cvut.cz", "Návody k budovám, značení místností na FITu a licence"],
  ];
  let y = 1.62;
  const rh = 0.735;
  sys.forEach((r, i) => {
    card(s, 0.6, y, 11.9, rh - 0.1, i % 2 === 0 ? CARD_BG : CARD_BG2);
    badge(s, 0.83, y + 0.11, 0.38, String(i + 1), SECONDARY);
    s.addText(r[0], { x: 1.42, y: y + 0.045, w: 3.2, h: 0.28, fontFace: BODY_FONT, fontSize: 12.5, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
    s.addText(r[1], { x: 1.42, y: y + 0.33, w: 3.2, h: 0.26, fontFace: BODY_FONT, fontSize: 10, color: SECONDARY, isTextBox: true, margin: 0 });
    s.addText(r[2], { x: 4.85, y: y + 0.09, w: 7.4, h: 0.5, fontFace: BODY_FONT, fontSize: 10.8, color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.05 });
    y += rh;
  });
  footer(s);
}

/* ---------------- SLIDE 9 : HARMONOGRAM ---------------- */
{
  const s = pres.addSlide();
  header(s, "Časová organizace", "Harmonogram a časové anomálie", { symbol: "◷", color: PRIMARY });
  s.addText("VŠCHT: harmonogram VŠCHT (vscht.cz)   ·   FIT ČVUT: harmonogram ČVUT (fit.cvut.cz)", {
    x: 0.6, y: 1.42, w: 12, h: 0.35, fontFace: BODY_FONT, fontSize: 11.5, italic: true, color: MUTED, isTextBox: true, margin: 0
  });

  card(s, 0.6, 1.95, 11.9, 1.05, CARD_BG);
  iconRow(s, 0.9, 2.15, 11.3, "!", "Posun začátku výuky v zimním semestru", "VŠCHT začíná o týden dříve než FIT ČVUT — 1. týden je výuka jen na VŠCHT, ideální čas zařídit karty na ČVUT bez front", ACCENT, 14.5, 11.5);

  const anomalies = [
    ["Lichý / sudý týden", "Některá cvičení běží jen jednou za 14 dní"],
    ["Kompenzace státních svátků", "Určitý den se učí podle rozvrhu jiného dne (např. pátek podle pondělí)"],
    ["Rektorské dny a děkanská volna", "Vzájemně se nekryjí — volno na VŠCHT neplatí na FITu a naopak"],
    ["Imatrikulace VŠCHT", "Výuka na VŠCHT odpadá, nutný společenský oděv"],
  ];
  let y = 3.25;
  anomalies.forEach((a, i) => {
    card(s, 0.6, y, 11.9, 0.85, i % 2 === 0 ? CARD_BG2 : CARD_BG);
    iconRow(s, 0.9, y + 0.15, 11.3, "→", a[0], a[1], PRIMARY, 13.5, 11);
    y += 0.98;
  });
  footer(s);
}

/* ---------------- SLIDE 10 : PAST KOSU ---------------- */
{
  const s = pres.addSlide();
  header(s, "Časová organizace", 'Rozvrh na FIT a „past KOSu“', { symbol: "!", color: ACCENT });

  card(s, 0.6, 1.7, 11.9, 1.15, CARD_BG);
  iconRow(s, 0.9, 1.9, 11.3, "✓", "Rozvrh v 1. ročníku plně zajištěn", "V 1. i 2. semestru jsou všechna cvičení na FITu pro bioinformatiky pevně zarezervována — v KOSu se nic nezapisuje ani nemění, vlastní výběr rozvrhu až od 2. ročníku", PRIMARY, 14.5, 11.5);

  card(s, 0.6, 3.0, 11.9, 1.75, "FDEDE3");
  badge(s, 0.9, 3.22, 0.42, "!", ACCENT);
  s.addText("Ignorujte chybové e-maily z KOSu", { x: 1.5, y: 3.16, w: 10.7, h: 0.32, fontFace: BODY_FONT, fontSize: 14.5, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
  s.addText("„vaše paralelka není otevřená“  ·  „nemáte zapsán minimální počet kreditů“  ·  „chyba zápisu rozvrhu“", {
    x: 1.5, y: 3.55, w: 10.7, h: 0.35, fontFace: BODY_FONT, fontSize: 11.5, italic: true, color: TEXT_DARK, isTextBox: true, margin: 0
  });
  s.addText("KOS nevidí studium na VŠCHT — kredity se řídí výhradně SISem. Vše platí.", {
    x: 1.5, y: 3.95, w: 10.7, h: 0.5, fontFace: BODY_FONT, fontSize: 12, color: MUTED, isTextBox: true, margin: 0
  });

  card(s, 0.6, 4.95, 11.9, 1.25, CARD_BG2);
  iconRow(s, 0.9, 5.17, 11.3, "✓", "Přednášky na FITu", "Docházka se nekontroluje — lze navštěvovat libovolnou paralelku bez kolize s VŠCHT (v KOSu se nezapisují)", SECONDARY, 14, 11.5);
  s.addText("Kódy předmětů FITu v SISu začínají B500xxx", {
    x: 1.44, y: 5.82, w: 10.7, h: 0.3, fontFace: BODY_FONT, fontSize: 11, color: SECONDARY, bold: true, isTextBox: true, margin: 0
  });
  footer(s);
}

/* ---------------- SLIDE 11 : THE GREAT FILTER ---------------- */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("THE GREAT FILTER", {
    x: 0.6, y: 0.55, w: 10, h: 0.35, fontFace: BODY_FONT, fontSize: 13, bold: true, color: "8FD4EE", charSpacing: 2, isTextBox: true, margin: 0
  });
  s.addText("Tři pilíře 1. semestru", { x: 0.55, y: 0.9, w: 11, h: 0.8, fontFace: TITLE_FONT, fontSize: 34, bold: true, color: WHITE, isTextBox: true, margin: 0 });

  s.addText("23", { x: 0.6, y: 1.9, w: 2.6, h: 1.3, fontFace: TITLE_FONT, fontSize: 72, bold: true, color: ACCENT, isTextBox: true, margin: 0, align: "left" });
  s.addText("kreditů celkem\nve třech klíčových\npředmětech", { x: 0.65, y: 3.15, w: 2.7, h: 1.1, fontFace: BODY_FONT, fontSize: 12.5, color: "AFC3D6", isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });

  const pillars = [
    ["BI-PA1", "Programování — hlavní síto semestru"],
    ["Matematika A", "Základní předmět"],
    ["OACH I", "Anorganická chemie I"],
  ];
  let x = 3.7;
  pillars.forEach((p) => {
    card(s, x, 1.9, 2.85, 3.9, "2A3A75");
    s.addText(p[0], { x: x + 0.25, y: 2.15, w: 2.35, h: 0.6, fontFace: TITLE_FONT, fontSize: 19, bold: true, color: WHITE, isTextBox: true, margin: 0 });
    s.addText(p[1], { x: x + 0.25, y: 2.75, w: 2.35, h: 1.0, fontFace: BODY_FONT, fontSize: 11.5, color: "AFC3D6", isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
    x += 3.05;
  });
  footer(s, "PRŮVODCE PRVÁKA · BIOINFORMATIKA VŠCHT × FIT ČVUT", true);
}

/* ---------------- SLIDE 12 : BI-PA1 SITO ---------------- */
{
  const s = pres.addSlide();
  header(s, "The Great Filter", "BI-PA1 jako hlavní síto", { symbol: "!", color: ACCENT });

  const items = [
    ["Týdenní deadliny v Progtestu", "Úlohy nelze napsat za večer před deadlinem — začněte programovat hned v den zadání"],
    ["Časové bonusy zachraňují semestr", "Odevzdání v předstihu dává bonusové body — na konci semestru kritická rezerva pro zápočet"],
    ["Neučí se v letním semestru", "BI-PA1 se vyučuje výhradně v zimním semestru, v létě se vůbec neotvírá"],
  ];
  let y = 1.75;
  items.forEach((it, i) => {
    card(s, 0.6, y, 11.9, 0.98, i % 2 === 0 ? CARD_BG : CARD_BG2);
    iconRow(s, 0.9, y + 0.18, 11.3, "✓", it[0], it[1], PRIMARY, 14, 11.5);
    y += 1.1;
  });

  card(s, 0.6, y + 0.05, 11.9, 1.55, "FDEDE3");
  s.addText("Pokud PA1 nezvládnete napoprvé", { x: 0.9, y: y + 0.22, w: 11.3, h: 0.3, fontFace: BODY_FONT, fontSize: 13.5, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
  s.addText("Čekání celý rok do 3. semestru → kumulace s další síťovkou BI-AX1 a nejtěžšími chemickými předměty (Biochemie, Fyzikální chemie)", {
    x: 0.9, y: y + 0.55, w: 11.3, h: 0.45, fontFace: BODY_FONT, fontSize: 11.5, color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.1
  });
  s.addText("→  Zvládnout PA1 napoprvé je absolutní priorita", {
    x: 0.9, y: y + 1.05, w: 11.3, h: 0.35, fontFace: BODY_FONT, fontSize: 12.5, bold: true, color: ACCENT, isTextBox: true, margin: 0
  });
  footer(s);
}

/* ---------------- SLIDE 13 : PRVNICH 7 TYDNU ---------------- */
{
  const s = pres.addSlide();
  header(s, "The Great Filter", "Prvních 7 týdnů", { symbol: "7", color: SECONDARY });

  card(s, 0.6, 1.7, 5.75, 3.15, CARD_BG);
  s.addText("Zápočtové testy", { x: 0.9, y: 1.92, w: 5.15, h: 0.32, fontFace: BODY_FONT, fontSize: 15, bold: true, color: PRIMARY, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Kolem 6. týdne — první zápočtové testy z Matematiky A i OACH I\n\n", options: { color: MUTED, fontSize: 12 } },
    { text: "Podstatně jednodušší než druhé zápočty v prosinci\n\n", options: { color: MUTED, fontSize: 12 } },
    { text: "Cíl: nasbírat co nejvíce bodů (v součtu potřeba > 50 %) pro klidný závěr roku", options: { color: MUTED, fontSize: 12 } },
  ], { x: 0.9, y: 2.35, w: 5.15, h: 2.35, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });

  card(s, 6.65, 1.7, 5.85, 3.15, "FDEDE3");
  s.addText("PA1 mezitím eskaluje", { x: 6.95, y: 1.92, w: 5.25, h: 0.32, fontFace: BODY_FONT, fontSize: 15, bold: true, color: ACCENT, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Úlohy v Progtestu jsou týden od týdne obtížnější\n\n", options: { color: TEXT_DARK, fontSize: 12 } },
    { text: "Matiku i chemii lze nárazově dohnat před zkouškou — programování o víkendu ne\n\n", options: { color: TEXT_DARK, fontSize: 12 } },
    { text: "Ztráta tempa v prvních 7 týdnech komplikuje celé další studium informatiky", options: { color: TEXT_DARK, fontSize: 12 } },
  ], { x: 6.95, y: 2.35, w: 5.25, h: 2.35, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });

  s.addText("Informatický řetězec navazuje striktně:", { x: 0.6, y: 5.05, w: 12, h: 0.3, fontFace: BODY_FONT, fontSize: 12.5, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
  const chain = ["BI-PA1", "Java", "BI-AX1 + Python\n(3. semestr)", "BI-AAG"];
  const chW = 2.55, chGap = 0.35, chX0 = 0.6, chY = 5.5;
  chain.forEach((c, i) => {
    const x = chX0 + i * (chW + chGap);
    s.addShape("roundRect", { x, y: chY, w: chW, h: 0.85, rectRadius: 0.08, fill: { color: i === 0 ? ACCENT : PRIMARY }, line: { type: "none" } });
    s.addText(c, { x, y: chY, w: chW, h: 0.85, fontFace: BODY_FONT, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    if (i < chain.length - 1) {
      s.addText("→", { x: x + chW, y: chY, w: chGap, h: 0.85, fontFace: BODY_FONT, fontSize: 16, bold: true, color: TEXT_DARK, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    }
  });
  footer(s);
}

/* ---------------- SLIDE 14 : HARDWARE & LINUX ---------------- */
{
  const s = pres.addSlide();
  header(s, "Technické zázemí", "Hardware a Linux", { symbol: "⌨", color: PRIMARY });

  card(s, 0.6, 1.7, 11.9, 1.15, "FDEDE3");
  s.addText("ZLATÉ PRAVIDLO", { x: 0.9, y: 1.85, w: 11.3, h: 0.28, fontFace: BODY_FONT, fontSize: 11, bold: true, color: ACCENT, charSpacing: 1.5, isTextBox: true, margin: 0 });
  s.addText("Nejdřív programovat, až pak ladit prostředí", { x: 0.9, y: 2.13, w: 11.3, h: 0.4, fontFace: TITLE_FONT, fontSize: 18, bold: true, color: TEXT_DARK, isTextBox: true, margin: 0 });
  s.addText("Hlavní je začít psát kód v C od prvního dne", { x: 0.9, y: 2.55, w: 11.3, h: 0.25, fontFace: BODY_FONT, fontSize: 11.5, italic: true, color: MUTED, isTextBox: true, margin: 0 });

  const items = [
    ["Neztrácejte první týdny", "Konfigurací Linuxu nebo editoru"],
    ["Bez lokálního setupu", "Začněte v OnlineGDB přímo v prohlížeči"],
    ["Zářijový instalační den na FITu", "Studenti FITu zdarma pomohou nastavit Linux, dual-boot i WSL"],
  ];
  let y = 3.15;
  items.forEach((it, i) => {
    card(s, 0.6, y, 11.9, 1.05, i % 2 === 0 ? CARD_BG : CARD_BG2);
    iconRow(s, 0.9, y + 0.22, 11.3, "✓", it[0], it[1], PRIMARY, 14, 11.5);
    y += 1.18;
  });
  footer(s);
}

/* ---------------- SLIDE 15 : PRAVIDLA SEMESTRU & PROGTEST ---------------- */
{
  const s = pres.addSlide();
  header(s, "Během semestru", "Pravidla semestru a Progtest", { symbol: "◷", color: SECONDARY });

  const items = [
    ["Sbírejte časové bonusy hned od října", "První úlohy (podmínky, jednoduché cykly) nesrovnatelně snazší než listopadové a prosincové (ukazatele, dynamická paměť, spojové seznamy) — bonusové body tvoří záchranný polštář"],
    ["Práce na úloze", "Zadání projít hned po zveřejnění, promyslet a ujasnit na cvičení — samotné kódování a ladění je realisticky víkendová záležitost, často zabere celý víkend"],
    ["Podmínky zápočtu", "Čistě o bodech — předepsané bodové minimum z domácích úloh v Progtestu, žádný prezenční zápočtový test na FITu"],
    ["Trénink syntaxe", "Interaktivní cvičebnice Trainer KSI (trainer.ksi.fit.cvut.cz)"],
  ];
  let y = 1.75;
  items.forEach((it, i) => {
    card(s, 0.6, y, 11.9, 1.18, i % 2 === 0 ? CARD_BG : CARD_BG2);
    iconRow(s, 0.9, y + 0.2, 11.3, "✓", it[0], it[1], SECONDARY, 14, 11.5);
    y += 1.3;
  });
  footer(s);
}

/* ---------------- SLIDE 16 : CO DAL ---------------- */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("CO DÁL", { x: 0.6, y: 0.55, w: 10, h: 0.35, fontFace: BODY_FONT, fontSize: 13, bold: true, color: "8FD4EE", charSpacing: 2, isTextBox: true, margin: 0 });
  s.addText("Další zdroje", { x: 0.55, y: 0.9, w: 11, h: 0.7, fontFace: TITLE_FONT, fontSize: 32, bold: true, color: WHITE, isTextBox: true, margin: 0 });

  const res = [
    ["Univerzální průvodce VŠCHT (PKC)", "Oficiální celoškolský PDF návod od Poradenského a kariérního centra"],
    ["BI-PA1: Taktika během semestru", "Jak zvládat týdenní úlohy, časové bonusy v Progtestu a nepodcenit síto"],
    ["Průvodce koncem 1. semestru a zkouškovým", "Kreditová minima, přepis známek z KOSu do SISu, taktika na zkouškové"],
    ["Dejvický kampus a komunita", "Informace o kampusu, menzách, studovnách B1322 a studentském životě"],
    ["Tipy ke studiu", "Literatura, psaní zápisků a tisk v NTK"],
  ];
  const colW = 5.85, gap = 0.3;
  res.forEach((r, i) => {
    let x, y, w;
    if (i < 4) {
      const col = i % 2, row = Math.floor(i / 2);
      x = 0.6 + col * (colW + gap);
      y = 1.85 + row * 1.55;
      w = colW;
    } else {
      // 5th item centered
      x = 0.6 + (12.0 - colW) / 2;
      y = 1.85 + 2 * 1.55;
      w = colW;
    }
    s.addShape("roundRect", { x, y, w, h: 1.35, rectRadius: 0.09, fill: { color: "2A3A75" }, line: { type: "none" } });
    badge(s, x + 0.22, y + 0.22, 0.4, String(i + 1), ACCENT);
    s.addText(r[0], { x: x + 0.8, y: y + 0.16, w: w - 1.0, h: 0.55, fontFace: BODY_FONT, fontSize: 13, bold: true, color: WHITE, isTextBox: true, margin: 0, lineSpacingMultiple: 1.05 });
    s.addText(r[1], { x: x + 0.8, y: y + 0.68, w: w - 1.0, h: 0.6, fontFace: BODY_FONT, fontSize: 10.5, color: "AFC3D6", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1 });
  });
  footer(s, "PRŮVODCE PRVÁKA · BIOINFORMATIKA VŠCHT × FIT ČVUT", true);
}

const outputPath = path.join(rootDir, "pruvodce-prvaka.pptx");
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("Successfully generated presentation at:", outputPath);
}).catch(err => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
