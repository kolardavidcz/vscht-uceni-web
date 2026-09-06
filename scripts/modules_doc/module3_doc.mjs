/**
 * Module 3: Bio-Intuice & Co je Graf
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml-bio-grafy.md
 */
import {
  createDocSlide,
  renderDocHeading,
  renderDocParagraph,
  renderDocList,
  renderDocCallout,
  renderDocConnectingLine,
  colors,
  fs
} from "../pptx_document_engine.mjs";

export function addModule3Slides(pres) {
  const breadcrumb = "MODUL 3 · 🧬 BIO-INTUICE & CO JE GRAF";

  // --------------------------------------------------------------------------
  // Slide 3.1: Titul & Cíl Modulu 3
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Bio-Intuice & Co je Graf", { level: 1, y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Cíl kapitoly:",
      text: "Vybudovat neotřesitelný základ pro diskrétní matematiku a teorii grafů. Přeložíme vaši přirozenou bioinformatickou a chemickou intuici (molekulární struktury, metabolické reakční sítě, protein-proteinové interakce, fylogenetické stromy a sekvenování DNA) do srozumitelného jazyka grafů G = (V, E), abyste přesně věděli, co je vrchol, hrana, strom a cyklus ještě před první přednáškou z AG1 na FIT ČVUT.",
      y: y + 0.15,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 3.2: Co je to vlastně graf? (Metafora metra)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🗺️ Co je to vlastně graf? (Opravdu, bez vzorců)", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Ty grafy, o kterých bude celý tento kurz, **nejsou grafy funkcí** ze střední školy ($y = x^2$ apod.). Jsou to úplně jiná zvířata.\nNejsnazší způsob, jak si graf představit: **mapa metra**.",
      { y }
    );

    // ASCII mapa metra box
    const mapBoxW = 6.5;
    const mapBoxH = 1.3;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: mapBoxW,
      h: mapBoxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "  Muzeum ──────── Náměstí Míru\n     │                  │\n  Muzeum Nár.      I.P. Pavlova\n     │                  │\n  Florenc ────── Hlavní nádraží",
      {
        x: 1.0,
        y: y + 0.1,
        w: mapBoxW - 0.4,
        h: mapBoxH - 0.2,
        fontFace: "Courier New",
        fontSize: fs(10),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
    y += mapBoxH + 0.15;

    y = renderDocParagraph(slide,
      "V téhle mapě: **Stanice** = vrcholy (uzly) grafu, **Koleje mezi stanicemi** = hrany grafu. To je vše. Graf = věci + spojení mezi nimi.",
      { y }
    );

    y = renderDocList(slide, [
      "**Sociální síť:** lidé = vrcholy, přátelství = hrany",
      "**Metabolická dráha:** metabolity = vrcholy, enzymatické reakce = hrany",
      "**Internet:** routery = vrcholy, kabely = hrany",
      "**Protein-proteinová interakce:** proteiny = vrcholy, fyzická vazba = hrana"
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Intuice bez vzorce:",
      text: "Graf je způsob, jak zakreslit, co je s čím spojeno. Matematický jazyk nám pak umožní o těchto spojeních přesně uvažovat a dokazovat věci.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 3.3: 1. Předmluva: Proč Bioinformatik Potřebuje Teoretickou Informatiku?
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "1. Předmluva: Proč Bioinformatik Potřebuje Teoretickou Informatiku?", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V biologii a chemii jste zvyklí nahlížet na složité systémy vizuálně a přírodovědně:",
      { y }
    );

    y = renderDocList(slide, [
      "Vidíte **molekulu glukózy** a chápete její prostorovou konformaci a chemické kovalentní vazby mezi atomy Uhlíku, Kyslíku a Vodíku.",
      "Vidíte **metabolickou dráhu glykolýzy** a vnímáte ji jako posloupnost enzymatických přeměn jednoho substrátu v druhý."
    ], { y });

    y = renderDocParagraph(slide,
      "Jakmile však vstoupíte do kurzu **AG1 (Algoritmy a Grafy 1)** na FIT ČVUT, akademický jazyk se radikálně promění:",
      { y }
    );

    y = renderDocList(slide, [
      "Místo *„chemické molekuly“* pracujete s **neorientovaným grafem** $G = (V, E)$.",
      "Místo *„enzymatické reakce“* pracujete s **orientovanou hranou** $e = (u, v) \\in E$ v **orientovaném acyklickém grafu (DAG)**."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Klíčový most pro studenta:",
      text: "Není to jiná látka — je to tentýž reálný svět zapsaný precizním matematickým jazykem, který umožňuje dokázat korektnost algoritmů.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 3.4: 🧬 Molekula Glukózy jako Neorientovaný Graf
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧬 Molekula Glukózy jako Neorientovaný Graf", { level: 3, y });

    y = renderDocParagraph(slide,
      "V chemii vnímáme glukózu jako molekulu $C_6H_{12}O_6$. V teoretické informatice je to **neorientovaný graf** $G = (V, E)$:",
      { y }
    );

    y = renderDocList(slide, [
      "**Vrcholy V (Atomy):** Jednotlivé atomy tvoří uzly sítě $V = \\{v_1, v_2, \\dots, v_{12}\\}$ (atomy O, C₁–C₆ a substituenty OH).",
      "**Hrany E (Kovalentní vazby):** Sdílený elektronový pár tvoří neorientovanou hranu $\\{u, v\\}$. Vazba působí vzájemně — nemá žádný „směr šipky“: $E = \\{e_1, e_2, \\dots, e_{12}\\}$."
    ], { y });

    // Schéma glukózy (vektorové vykreslení)
    const boxW = 8.5;
    const boxH = 2.4;
    const boxX = (13.333 - boxW) / 2;

    slide.addShape(pres.ShapeType.roundRect, {
      x: boxX,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.1,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });

    // Six-ring carbon atoms + Oxygen
    const cLabels = ["O (v₁)", "C₁ (v₂)", "C₂ (v₃)", "C₃ (v₄)", "C₄ (v₅)", "C₅ (v₆)"];
    const pts = [
      { x: boxX + 4.25, y: y + 0.35, color: "E11D48" }, // O
      { x: boxX + 5.5, y: y + 0.8, color: "1E293B" },  // C1
      { x: boxX + 5.5, y: y + 1.6, color: "1E293B" },  // C2
      { x: boxX + 4.25, y: y + 2.05, color: "1E293B" }, // C3
      { x: boxX + 3.0, y: y + 1.6, color: "1E293B" },  // C4
      { x: boxX + 3.0, y: y + 0.8, color: "1E293B" },  // C5
    ];

    // Ring bonds
    for (let i = 0; i < 6; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % 6];
      renderDocConnectingLine(pres, slide, p1.x, p1.y, p2.x, p2.y, {
        color: "475569",
        width: 2.5,
      });
    }

    // Draw atom nodes
    pts.forEach((pt, idx) => {
      slide.addShape(pres.ShapeType.ellipse, {
        x: pt.x - 0.28,
        y: pt.y - 0.28,
        w: 0.56,
        h: 0.56,
        fill: { color: pt.color },
        line: { color: pt.color, width: 1 },
      });
      slide.addText(cLabels[idx], {
        x: pt.x - 0.6,
        y: pt.y - 0.15,
        w: 1.2,
        h: 0.3,
        fontSize: fs(7.5),
        bold: true,
        color: "FFFFFF",
        align: "center",
      });
    });

    y += boxH + 0.12;

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Formální popis:",
      text: "Množina vrcholů V = {v₁, v₂, …, v₁₂}, množina neorientovaných hran E = {e₁, e₂, …, e₁₂}. Žádná hrana nemá preferovaný směr.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 3.5: ⚡ Metabolická Dráha Glykolýzy jako Orientovaný Graf (DAG)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "⚡ Metabolická Dráha Glykolýzy jako Orientovaný Graf (DAG)", { level: 3, y });

    y = renderDocParagraph(slide,
      "Při odbourávání cukru v buňce probíhá kaskáda enzymatických reakcí. Každá reakce je jednosměrná (spotřebovává energii či uvolňuje teplo):",
      { y }
    );

    y = renderDocList(slide, [
      "**Vrcholy V (Metabolity):** Chemické látky v buňce: Glukóza (v₁), Glukóza-6-P (v₂), Fruktóza-6-P (v₃), Fruktóza-1,6-bisP (v₄).",
      "**Hrany E (Enzymatické reakce):** Orientované šipky $(u, v) \\in V \\times V$. Reakce jde ze substrátu $u$ do produktu $v$: $e_1 = (v_1, v_2), e_2 = (v_2, v_3), e_3 = (v_3, v_4)$.",
      "**Acykličnost (DAG):** Glykolýza je přímá energetická dráha — metabolity se v ní netočí dokola, ale směřují k pyruvátu."
    ], { y });

    // DAG schéma (vektorové vykreslení)
    const boxW = 10.5;
    const boxH = 1.4;
    const boxX = (13.333 - boxW) / 2;

    slide.addShape(pres.ShapeType.roundRect, {
      x: boxX,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.1,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });

    const metabolites = [
      { name: "Glukóza (v₁)", sub: "" },
      { name: "Glukóza-6-P (v₂)", sub: "Hexokináza" },
      { name: "Fruktóza-6-P (v₃)", sub: "PGI" },
      { name: "Fruktóza-1,6-bisP (v₄)", sub: "PFK-1" },
    ];

    metabolites.forEach((m, idx) => {
      const nodeX = boxX + 0.5 + idx * 2.5;
      slide.addShape(pres.ShapeType.roundRect, {
        x: nodeX,
        y: y + 0.35,
        w: 1.8,
        h: 0.7,
        rectRadius: 0.08,
        fill: { color: "FFFFFF" },
        line: { color: "059669", width: 1.5 },
      });
      slide.addText(m.name, {
        x: nodeX,
        y: y + 0.45,
        w: 1.8,
        h: 0.4,
        fontSize: fs(8.5),
        bold: true,
        color: "0F172A",
        align: "center",
      });

      if (idx < 3) {
        slide.addText("➔", {
          x: nodeX + 1.85,
          y: y + 0.45,
          w: 0.6,
          h: 0.4,
          fontSize: fs(14),
          bold: true,
          color: "059669",
          align: "center",
        });
        slide.addText(metabolites[idx + 1].sub, {
          x: nodeX + 1.6,
          y: y + 0.15,
          w: 1.1,
          h: 0.25,
          fontSize: fs(7.5),
          bold: true,
          color: "047857",
          align: "center",
        });
      }
    });

    y += boxH + 0.12;

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Orientovaný graf (DAG):",
      text: "V DAGu nelze po orientovaných hranách obejít kolečko zpět! To je klíčové pro topologické řazení a dynamické programování v AG1.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 3.6: 2. Co je to Strom v Grafu?
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2. Co je to Strom v Grafu? [KLÍČOVÝ ROZDÍL]", { level: 2, y, showUnderline: true });

    y = renderDocHeading(pres, slide, "🌲 Strom (Acyklický souvislý graf)", { level: 3, y, showUnderline: false });

    y = renderDocList(slide, [
      "**Definice:** Souvislý graf, který **neobsahuje žádný cyklus**.",
      "**Unikátní vlastnost:** Mezi libovolnými dvěma vrcholy existuje **právě jedna jediná cesta**!",
      "**Biologický příklad:** Fylogenetický strom taxonů $V = \\{v_1, \\dots, v_7\\}$ propojených evolučními větvemi $E = \\{e_1, \\dots, e_6\\}$ od společného předka (LUCA)."
    ], { y });

    // Strom ASCII / Box
    const boxW = 8.5;
    const boxH = 1.8;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F0FDF4" },
      line: { color: "BBF7D0", width: 1 },
    });
    slide.addText(
      "             ( LUCA / v₁ )\n             /           \\\n        ( v₂ )           ( v₃ )\n        /    \\           /    \\\n     ( v₄ )  ( v₅ )   ( v₆ )  ( v₇ )   <-- Listy stromu (současné druhy)",
      {
        x: 1.0,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(10),
        color: "047857",
        lineSpacingMultiple: 1.15,
      }
    );
    y += boxH + 0.15;

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Zlaté pravidlo stromů:",
      text: "Každý strom s n vrcholy má přesně n - 1 hran. Odebráním libovolné hrany se strom rozpadne na dvě části.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 3.7: 🔄 Cyklus (Uzavřený okruh)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🔄 Cyklus (Uzavřený okruh v grafu)", { level: 3, y, showUnderline: true });

    y = renderDocList(slide, [
      "**Definice:** Uzavřená posloupnost hran, kde z libovolného uzlu vyrazíte a **vrátíte se do něj zpět** bez opakování vrcholů.",
      "**Důsledek:** Umožňuje opakování, zpětnou vazbu a oscilace. Vede k existenci více různých cest mezi uzly.",
      "**Biologický příklad:** Krebsův citrátový cyklus $V = \\{v_1, \\dots, v_5\\}$ (OAA, Citrát, αKG, Sukcinát, Malát) s orientovanými reakcemi $E = \\{(v_1, v_2), (v_2, v_3), (v_3, v_4), (v_4, v_5), (v_5, v_1)\\}$."
    ], { y });

    // Cyklus ASCII / Box
    const boxW = 8.5;
    const boxH = 1.8;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "FFF1F2" },
      line: { color: "FECDD3", width: 1 },
    });
    slide.addText(
      "         ( OAA / v₁ ) ────> ( Citrát / v₂ )\n              ▲                     │\n              │                     ▼\n         ( Malát / v₅ )        ( αKG / v₃ )\n              ▲                     │\n              └──── ( Sukcinát / v₄ ) ◄┘",
      {
        x: 1.0,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(10),
        color: "BE123C",
        lineSpacingMultiple: 1.15,
      }
    );
    y += boxH + 0.15;

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Shrnutí rozdílu pro AG1:",
      text: "Strom = 0 cyklů, minimální souvislost, deterministická cesta. Cyklus = alternativní cesty, možnost zacyklení algoritmů (nutnost značit navštívené vrcholy 'visited'!).",
      y,
    });
  }
}
