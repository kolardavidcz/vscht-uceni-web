/**
 * Module 2: Letní průvodce grafovou matematikou pro bioinformatiky
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml.md
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createDocSlide,
  renderDocHeading,
  renderDocParagraph,
  renderDocList,
  renderDocCallout,
  renderDocCode,
  renderDocTable,
  renderDocVideoPlaceholder,
  renderDocImage,
  renderSolutionBanner,
  colors,
  fs
} from "../pptx_document_engine.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

export function addModule2Slides(pres) {
  const breadcrumb = "MODUL 2 · ☀️ LETNÍ PRŮVODCE GRAFOVOU MATEMATIKOU";

  // --------------------------------------------------------------------------
  // Slide 2.1: Titul & Cíl Modulu 2
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "☀️ Letní průvodce grafovou matematikou pro bioinformatiky", { level: 1, y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Přípravný letní materiál:",
      text: "Tohle je **přípravný letní materiál** — přečteš ho pohodlně za pár dní a do září budeš mít jasno v tom, co AG1 po tobě vůbec chce.\n\nStudenti FIT prošli celým předmětem *BI-DML* (Diskrétní matematika) a mají předměty, které používají a vyžadují důkazové myšlení. Ty máš tento kurz — komprimovanou verzi toho nejdůležitějšího, co potřebuješ pro AG1. Zní to dobře? Začínáme.",
      y: y + 0.15,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.2: 📺 Úvodní výukové video (Dedikovaný 16:9 rámec)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    renderDocVideoPlaceholder(pres, slide, {
      title: "Úvodní výukové video",
      subtitle: "Diskrétní matematika & Grafy pro Bioinformatiky",
      url: "https://youtu.be/Rr_I0tdgubY",
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.3: 3. Myšlení v Důkazech: Jak Funguje Matematický a Algoritmický Mozek?
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3. Myšlení v Důkazech: Jak Funguje Matematický a Algoritmický Mozek?", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Důkazy a diskrétní matematika nevznikla kvůli lásce k matematickým symbolům.",
      { y }
    );

    renderDocParagraph(slide,
      "Pravda je přesně opačná. V této kapitole si ukážeme, proč důkazy vůbec vznikly, jaký je zásadní rozdíl mezi **znalostmi** a **postupem** a jak se z bioinformatika stane člověk, který se nezalekne žádné teoretické otázky z AG1.",
      { y }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 2.4: 3.1 Role Znalostí: První Setkání s Profesorem u Tabule
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3. Myšlení v Důkazech" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3.1 Role Znalostí: První Setkání s Profesorem u Tabule", { level: 3, y });

    y = renderDocParagraph(slide,
      "Představte si své první cvičení z diskrétní matematiky na univerzitě. Vstoupí vyučující, beze slova vezme křídu, nakreslí na tabuli geometrický útvar v rovině, otočí se do ztichlé učebny a položí zdánlivě nevinnou otázku:",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Otázka od tabule:",
      text: "„Dokažte, že se jedná o kružnici!“",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.5: Geometrický útvar v rovině (Obrázek kružnice a výzva)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.1 Role Znalostí" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Geometrický útvar v kartézské rovině", { level: 3, y });

    // Kružnice geometrické schéma ve středu
    const boxW = 8.0;
    const boxH = 3.6;
    const boxX = (13.333 - boxW) / 2;

    slide.addShape(pres.ShapeType.roundRect, {
      x: boxX,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.12,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });

    // Osy X a Y
    slide.addShape(pres.ShapeType.line, {
      x: boxX + 0.6,
      y: y + boxH - 0.6,
      w: boxW - 1.2,
      h: 0,
      line: { color: "78716C", width: 1.5 },
    });
    slide.addText("x", { x: boxX + boxW - 0.5, y: y + boxH - 0.75, w: 0.3, h: 0.3, fontSize: fs(12), bold: true, color: "78716C" });

    slide.addShape(pres.ShapeType.line, {
      x: boxX + 1.2,
      y: y + 0.4,
      w: 0,
      h: boxH - 0.8,
      line: { color: "78716C", width: 1.5 },
    });
    slide.addText("y", { x: boxX + 1.1, y: y + 0.15, w: 0.3, h: 0.3, fontSize: fs(12), bold: true, color: "78716C" });

    // Kružnice
    const cRadius = 2.0;
    const cX = boxX + boxW / 2 - cRadius / 2;
    const cY = y + boxH / 2 - cRadius / 2 - 0.1;

    slide.addShape(pres.ShapeType.ellipse, {
      x: cX,
      y: cY,
      w: cRadius,
      h: cRadius,
      fill: { color: "FFF7ED" },
      line: { color: colors.brandOrange, width: 2.5 },
    });

    // Střed S[m, n]
    slide.addShape(pres.ShapeType.ellipse, {
      x: cX + cRadius / 2 - 0.06,
      y: cY + cRadius / 2 - 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: colors.brandOrangeDark },
      line: { color: colors.brandOrangeDark, width: 1 },
    });
    slide.addText("S[m, n]", {
      x: cX + cRadius / 2 - 0.8,
      y: cY + cRadius / 2 + 0.1,
      w: 1.0,
      h: 0.3,
      fontSize: fs(11),
      bold: true,
      color: colors.brandOrangeDark,
    });

    // Střed S[m, n] a poloměr r k bodu X[x, y]
    const sX = cX + cRadius / 2;
    const sY = cY + cRadius / 2;
    const pX = sX + (cRadius / 2) * 0.707;
    const pY = sY + (cRadius / 2) * 0.707;

    slide.addShape(pres.ShapeType.line, {
      x: sX,
      y: sY,
      w: pX - sX,
      h: pY - sY,
      line: { color: colors.brandOrangeDark, width: 1.5, dashType: "dash" },
    });
    slide.addShape(pres.ShapeType.ellipse, {
      x: pX - 0.06,
      y: pY - 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: colors.brandOrange },
      line: { color: colors.brandOrange, width: 1 },
    });
    slide.addText("X[x, y]", { x: pX + 0.08, y: pY - 0.1, w: 1.0, h: 0.3, fontSize: fs(11), bold: true, color: colors.brandOrange });
    slide.addText("r", { x: (sX + pX) / 2 - 0.25, y: (sY + pY) / 2 + 0.05, w: 0.4, h: 0.3, fontSize: fs(12), bold: true, color: colors.brandOrange });

    y += boxH + 0.15;

    slide.addText("Obrázek: Geometrický útvar se středem S[m, n], poloměrem r a bodem X[x, y] na obvodu", {
      x: 0.8,
      y,
      w: 11.733,
      h: 0.25,
      fontSize: fs(10),
      color: colors.textMuted,
      align: "center",
      italic: true,
    });
    y += 0.32;

    renderDocCallout(pres, slide, {
      type: "note",
      title: "✍️ Místo pro vaše řešení a odvození:",
      text: "Zkuste si nejprve promyslet: co přesně byste profesorce u tabule odpověděli? Na dalším snímku následuje podrobný rozbor!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.6: Rozbor u tabule: Proč se cítíte ztraceni?
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.1 Role Znalostí" });
    let y = 0.85;

    y = renderSolutionBanner(pres, slide, { title: "Rozbor u Tabule: Proč se v této chvíli cítíte ztraceni?", y });

    y = renderDocParagraph(slide,
      "V téhle jediné vteřině zažije naprosté ticho a prázdno v hlavě 95 % studentů v aule:\n*„Co po mně proboha chce?! Vždyť to vidím na vlastní oči — je to kulaté, je to kružnice, co na tom mám dokazovat?! Mám vytáhnout kružítko a pravítko a změřit to?“*",
      { y }
    );

    y = renderDocParagraph(slide,
      "**Proč tento pocit bezmoci vzniká?** Náš lidský mozek je ze střední školy i běžného života zvyklý spoléhat se na **vizuální intuici**. Jenže exaktní matematika a teoretická informatika nejsou o tom, co *vypadá kulatě*. Zrak může snadno klamat (může to být elipsa s poloosami a = 60.0 a b = 59.9, nebo pravidelný 128-úhelník).",
      { y }
    );

    y = renderDocParagraph(slide,
      "Vyučující od vás nechtěl vizuální popis. Chtěl **formální matematickou obhajobu**. A zde přichází ten nejdůležitější aha-moment celého studia:",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Bez znalosti přesné DEFINICE nemáte VŮBEC CO dokazovat!",
      text: "Dokud neznáte definici, mozek tápe v mlze, protože nemá záchytný bod. Jakmile si však vybavíte exaktní definici pojmu, celý důkaz se stane přímočarým rozbalením této definice krok za krokem.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.7: Definice a rovnice kružnice z MFF UK
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.1 Role Znalostí" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📄 Ukázka z portálu Matematicko-fyzikální fakulty UK", { level: 3, y });

    y = renderDocParagraph(slide,
      "Vysokoškolská matematika definuje kružnici jako množinu bodů s konstantní vzdáleností od středu:",
      { y }
    );

    const imgPath = path.join(rootDir, "public", "images", "kruznice-mff.png");
    y = renderDocImage(slide, imgPath, {
      x: 2.916,
      y,
      w: 7.5,
      h: 2.3,
      caption: "Zdroj: MFF UK – Analytická geometrie kuželoseček: Kružnice",
    });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Závěr pro studenta bioinformatiky:",
      text: "Důkaz kružnice nespočívá v kreslení, ale v ověření rovnice (x - m)² + (y - n)² = r². V AG1 to bude navlas stejné: dokázat, že graf je strom, znamená ověřit formální definici stromu!",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.8a: 3.2 Role Postupu: Rychlé Umocňování (x^n) & Formální Logika
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3.2 Role Postupu: Rychlé Umocňování ($x^n$) & Formální Logika", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Zatímco kružnice demonstrovala sílu **statických znalostí (definic)**, v programování a předmětu AG1 rozhoduje **dynamický postup (algoritmus)** opřený o zákony **formální matematické logiky**.",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Algoritmická Výzva:",
      text: "Chceme spočítat hodnotu mocniny x^n (pro libovolné přirozené číslo n ∈ ℕ) výhradně za pomoci operace násobení. Cíl: provést co nejmenší možný počet násobení.",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.8b: Naivní postup vs. Výzva k zamyšlení
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.2 Role Postupu" });
    let y = 0.85;

    y = renderDocList(slide, [
      "**Naivní postup (O(n)):** Budeme postupně násobit x · x · x ... · x. To vyžaduje n - 1 násobení. Pro n = 1 000 000 (např. při šifrování RSA nebo počítání cest v rozsáhlých biologických sítích) provede procesor milion operací. V praxi zbytečně pomalé.",
      "**Výzva k zamyšlení:** Lze to udělat řádově rychleji? Jaký myšlenkový postup zvolit a jakou roli v tom hraje formální logika?"
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "✍️ Místo pro návrh vašeho algoritmu a logický rozbor:",
      text: "Zamyslete se: co se stane, když je exponent sudý? Lze využít vlastnosti mocnin ze základní školy?",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 2.9: ⚡ Řešení: Rychlé umocňování a Formální Logika
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.2 Role Postupu" });
    let y = 0.85;

    y = renderSolutionBanner(pres, slide, { title: "Řešení: Rychlé Umocňování (Exponentiation by Squaring)", y });

    y = renderDocHeading(pres, slide, "1. Zákon vyloučeného třetího (Tertium non datur)", { level: 4, y, showUnderline: false });
    y = renderDocParagraph(slide,
      "V klasické bivalentní logice platí tautologie $\\models A \\lor \\neg A$. Pro přirozená čísla platí: $\\forall n \\in \\mathbb{N}: \\text{sudé}(n) \\lor \\text{liché}(n)$. Žádné číslo nemůže být napůl sudé, ani nemůže existovat číslo, které není ani jedno.",
      { y }
    );

    y = renderDocHeading(pres, slide, "2. Důkaz a algoritmus rozborem případů (Divide & Conquer)", { level: 4, y, showUnderline: false });
    renderDocList(slide, [
      "**Případ 1: Exponent n je SUDÝ (n mod 2 = 0):** $x^n = (x^{n/2})^2 = (x^{n/2}) \\cdot (x^{n/2})$. Trik: hodnotu $y = x^{n/2}$ spočítáme rekurzivně **pouze jednou** a pak ji vynásobíme samu se sebou ($y \\cdot y$)! Ušetříme polovinu násobení v jediném kroku.",
      "**Případ 2: Exponent n je LICHÝ (n mod 2 = 1):** $x^n = x \\cdot x^{n-1}$. Exponent snížíme o 1 a hodnota $x^{n-1}$ v dalším kroku spadne do super-rychlého Případu 1 (sudé číslo).",
      "**Báze algoritmu (pro n = 0):** Neutrální prvek násobení: $x^0 = 1$."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 2.10: Terminace & Tracování na konkrétních číslech
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.2 Role Postupu" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3. Důkaz terminace (Dobré uspořádání ℕ)", { level: 4, y, showUnderline: false });
    y = renderDocParagraph(slide,
      "V sudé větvi: pro n ≥ 2 platí n/2 < n. V liché větvi: pro n ≥ 1 platí n - 1 < n. V každém kroku hodnota exponentu **ostře klesá**. Množina ℕ je **dobře uspořádaná** (neexistuje v ní nekonečná klesající posloupnost). Algoritmus tedy spolehlivě skončí.",
      { y }
    );

    y = renderDocHeading(pres, slide, "🧪 Porovnání na konkrétních číslech:", { level: 4, y, showUnderline: false });
    renderDocList(slide, [
      "**Příklad A: Výpočet x¹⁶ (čistě sudá větev):** Naivně: 15 násobení. Rychle: x² = x·x (1.), x⁴ = (x²)² (2.), x⁸ = (x⁴)² (3.), x¹⁶ = (x⁸)² (4.) ➔ **Pouhá 4 násobení místo 15!** ($4 = \\log_2 16$).",
      "**Příklad B: Výpočet x¹³ (střídání větví):** 13 liché: x·x¹² (1.), 12 sudé: (x⁶)² (2.), 6 sudé: (x³)² (3.), 3 liché: x·x² (4.), 2 sudé: x·x (5.) ➔ **Pouhých 5 násobení místo 12!**"
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 2.11a: Implementace v C++
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.2 Role Postupu" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "💻 Implementace v C++: Rychlé Umocňování", { level: 3, y });

    const cppCode = `// Rychlé umocňování v čase O(log n)
long long power(long long x, unsigned int n) {
    if (n == 0) return 1;
    if (n % 2 == 0) {
        long long half = power(x, n / 2);
        return half * half; // Spočítáno jen 1x, násobeno 1x!
    } else {
        return x * power(x, n - 1);
    }
}`;

    renderDocCode(pres, slide, cppCode, { lang: "C++ (Divide & Conquer)", y });
  }

  // --------------------------------------------------------------------------
  // Slide 2.11b: Srovnání složitostí a Význam pro AG1
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3.2 Role Postupu" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Srovnání Složitostí & Význam pro AG1", { level: 3, y });

    y = renderDocTable(slide, {
      headers: ["Exponent n", "Naivní přístup (n - 1 násobení)", "Rychlé umocňování (≈ log₂ n)", "Zrychlení v praxi"],
      rows: [
        ["n = 16", "15 násobení", "4 násobení", "3.75× rychlejší"],
        ["n = 1 024", "1 023 násobení", "10 násobení", "100× rychlejší"],
        ["n = 1 000 000", "999 999 násobení", "cca 20 násobení", "50 000× rychlejší!"]
      ],
      colWidths: [2.2, 3.2, 3.2, 3.133],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Algoritmický význam pro AG1 a Bioinformatiku:",
      text: "Tento princip je základem moderní kryptografie (RSA) i rychlého umocňování matice sousedství grafu A^k v bioinformatice pro zjištění počtu cest délky k mezi biomolekulami v síti!",
      y: y + 0.05,
    });
  }
}
