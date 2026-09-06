/**
 * Module 6: Důkazy Sporem & Extremální Princip
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml-dukazy-sporem.md
 */
import {
  createDocSlide,
  renderDocHeading,
  renderDocParagraph,
  renderDocList,
  renderDocCallout,
  renderSolutionBanner,
  colors,
  fs
} from "../pptx_document_engine.mjs";

export function addModule6Slides(pres) {
  const breadcrumb = "MODUL 6 · 🕵️ DŮKAZY SPOREM & EXTREMÁLNÍ PRINCIP";

  // --------------------------------------------------------------------------
  // Slide 6.1: Titul & Detektivní přístup
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Důkazy Sporem & Extremální Princip", { level: 1, y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Cíl kapitoly:",
      text: "Naučit se elegantní techniku důkazu, kde místo přímého dokazování ukážeš, že opak by vedl k nesmyslu.",
      y,
    });

    y = renderDocHeading(pres, slide, "🕵️ Detektivní přístup k matematice", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Sherlock Holmes říká: *„Když vyloučíš vše nemožné, co zbude — i kdyby to bylo sebenepravděpodobnější — musí to být pravda.“*\nDůkaz sporem funguje přesně takhle:",
      { y }
    );

    y = renderDocList(slide, [
      "1. Chceš dokázat, že tvrzení **B** platí.",
      "2. Předpokládej, že **B neplatí** (tedy předpokládej opak).",
      "3. Z tohoto předpokladu logicky odvoď **nesmysl** — něco, co je zjevně nepravdivé (spor s tím, co víš).",
      "4. Protože opak B vedl k nesmyslu, **B musí platit**."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Příklad z reálného světa:",
      text: "Chceš dokázat, že v místnosti s 13 lidmi musí aspoň dva sdílet narozeninový měsíc. Předpokládej opak — každý má jiný měsíc. Ale měsíců je jen 12. To je spor — 13 lidí se do 12 měsíců nevejde po jednom. Opak neplatí, takže dva lidé sdílí měsíc!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 6.2: 1. Logická Podstata Důkazu Sporem
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "1. Logická Podstata Důkazu Sporem", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Víme, že negací implikace $A \\Rightarrow B$ je výrok: $\\neg (A \\Rightarrow B) \\equiv (A \\land \\neg B)$.",
      { y }
    );

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Princip Důkazu Sporem:",
      text: "Chceme-li dokázat implikaci A ⇒ B, předpokládáme její negaci (tj. předpokládáme platnost A a ZÁROVEŇ ¬B). Pokud z tohoto spojení odvodíme spor (rozpor / ⊥) s definicí, předpokladem A nebo větou, náš předpoklad pro spor nemohl platit a původní tvrzení A ⇒ B je pravdivé!",
      y,
    });

    // ASCII myšlenkový tok sporu
    const boxW = 8.5;
    const boxH = 2.4;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 2.416,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "        Předpoklad A  ∧  Negovaný závěr ¬B\n                         │\n                         ▼ (Logické odvozování krok za krokem)\n                         │\n                         ▼\n        💥 SPOR (Rozpor s faktem, definicí nebo A = 1)\n                         │\n                         ▼\n    ZÁVĚR: Náš předpoklad ¬B byl chybný, tedy platí B! Q.E.D.",
      {
        x: 2.616,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(9.5),
        color: colors.textPrimary,
        align: "center",
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 6.3: 2. Šablona Zápisu Důkazu Sporem u Zkoušky AG1
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2. Šablona Zápisu Důkazu Sporem u Zkoušky AG1", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Při hodnocení zkouškových testů z AG1 vyžadují vyučující přesně definovanou strukturu ve 4 krocích:",
      { y }
    );

    // ASCII šablona
    const boxW = 11.733;
    const boxH = 3.6;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "FORMÁLNÍ ŠABLONA ZÁPISU DŮKAZU SPOREM:\n\n1. PŘEDPOKLAD PRO SPOR:\n   - „Předpokládejme pro spor, že platí předpoklad A a ZÁROVEŇ NEPLATÍ závěr B (platí ¬B).“\n\n2. LOGICKÉ ODVOZOVÁNÍ:\n   - „Z platnosti ¬B plyne vlastnost X...“\n   - „Z vlastnosti X a předpokladu A odvodíme vlastnost Y...“\n\n3. DOSAŽENÍ SPORU (Rozporu ⚡ / 💥 / ⊥):\n   - „To je ale SPOR (⚡) s [definicí Z / předpokladem A / dokázanou větou]!“\n\n4. ZÁVĚR:\n   - „Proto náš předpoklad pro spor nemohl platit, a tedy původní tvrzení A => B platí. Q.E.D.“",
      {
        x: 1.05,
        y: y + 0.15,
        w: boxW - 0.5,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(10),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 6.4: 3. Dirichletův princip v Teorii Grafů
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3. 🐦 Dirichletův princip v Teorii Grafů (Holubi, Škatulky & Sítě)", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Dirichletův princip (Pigeonhole Principle):",
      text: "Pokud máme n předmětů (holubů) a chceme je umístit do k přihrádek (škatułek), přičemž počet předmětů je větší než počet přihrádek (n > k), pak alespoň v jedné přihrádce musí skončit dva nebo více předmětů.",
      y,
    });

    // ASCII holubi
    const boxW = 8.5;
    const boxH = 1.4;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 2.416,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "  Škatulka 1     Škatulka 2     Škatulka 3     Škatulka 4\n ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐\n │   🕊️ 🕊️   │  │    🕊️     │  │    🕊️     │  │    🕊️     │\n └───────────┘  └───────────┘  └───────────┘  └───────────┘\n       ▲\n       └────── 5 holubů do 4 škatulek ➔ Kolize je NEVYHNUTELNÁ!",
      {
        x: 2.616,
        y: y + 0.1,
        w: boxW - 0.4,
        h: boxH - 0.2,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
    y += boxH + 0.15;

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Proč to funguje? (Důkaz sporem za 10 sekund):",
      text: "Předpokládejme opak: v každé z k přihrádek je nanejvýš 1 holub. Pak celkový počet holubů je nejvýše 1 × k = k. My však máme n > k holubů, což je okamžitý SPOR! Alspoň v jedné přihrádce musí být alespoň dva holubi.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 6.5: Příklad 1: Dva vrcholy se stejným stupněm v každém grafu
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🔬 Příklad 1: Dva vrcholy se stejným stupněm v každém grafu", { level: 3, y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Klasická zkoušková věta:",
      text: "V každém jednoduchém neorientovaném grafu G = (V, E) s n ≥ 2 vrcholy vždy existují alespoň dva vrcholy se stejným stupněm.",
      y,
    });

    y = renderDocHeading(pres, slide, "🐢 Pomalý rozbor krok za krokem:", { level: 4, y, showUnderline: false });

    y = renderDocList(slide, [
      "**1. Kdo jsou holubi?** Holubi jsou **vrcholy grafu**. Máme jich celkem $n$ ($v_1, v_2, \\dots, v_n$).",
      "**2. Co jsou škatulky?** Škatulky jsou **možné hodnoty stupňů** $\\deg(v)$. Minimální stupeň je 0 (izolovaný vrchol), maximální je $n - 1$ (spojen se všemi). Teoreticky: $\\{0, 1, 2, \\dots, n - 1\\}$, což je $n$ různých hodnot.",
      "**3. Klíčový grafový trik (Vzájemné vyloučení):** Může v jednom grafu existovat uzel stupně 0 a současně uzel stupně $n-1$? **Předpokládejme pro spor, že ano:** Uzel $u$ stupně $n-1$ musí být spojen se všemi ostatními (i s uzlem $w$). Ale uzel $w$ má stupeň 0 (nemá žádnou hranu). Hrana $\\{u, w\\}$ existuje i neexistuje ➔ **SPOR (⚡)!**"
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Důsledek pro počet škatułek:",
      text: "Hodnoty 0 a n - 1 se vzájemně vylučují! V každém grafu je tedy nanejvýš n - 1 možných hodnot stupňů. Máme n vrcholů a n - 1 škatułek!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 6.6: Aplikace Dirichletova principu pro n vrcholů & Schéma kolize
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Aplikace Dirichletova principu & Kolize stupňů", { level: 3, y });

    y = renderDocParagraph(slide,
      "V libovolném grafu o $n$ vrcholech nastává právě jedna ze dvou situací:",
      { y }
    );

    y = renderDocList(slide, [
      "**Situace A (Graf obsahuje izolovaný uzel stupně 0):** Pak neobsahuje uzel stupně $n-1$. Možné stupně jsou $\\{0, 1, \\dots, n-2\\}$ ➔ přesně **n - 1 škatułek**.",
      "**Situace B (Graf neobsahuje uzel stupně 0):** Pak všechny uzly mají stupeň alespoň 1. Možné stupně jsou $\\{1, 2, \\dots, n-1\\}$ ➔ opět přesně **n - 1 škatułek**."
    ], { y });

    // ASCII kolize box
    const boxW = 10.0;
    const boxH = 1.6;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.666,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "Vrcholy (holubi):      (A)          (B)          (C)          (D)\n                        │            │            │            │\n                        ▼            ▼            ▼            ▼\nMožné stupně (boxy): ┌──────┐     ┌──────┐     ┌──────┐\n                     │ deg 1│     │ deg 2│     │ deg 3│\n                     ├──────┤     ├──────┤     ├──────┤\n                     │ (A)  │     │ (B)  │     │ (D)  │\n                     │      │     │ (C) ◄┼─────┼──────┴── KOLIZE! Vrcholy B a C\n                     └──────┘     └──────┘     └──────┘   mají shodně stupeň 2!",
      {
        x: 1.866,
        y: y + 0.1,
        w: boxW - 0.4,
        h: boxH - 0.2,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
    y += boxH + 0.15;

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Bioinformatická interpretace:",
      text: "V protein-proteinové síti o n proteinech vždy existují alespoň dva proteiny, které mají navlas stejný počet interakčních partnerů!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 6.7: Příklad 2: Cesta délky n v grafu o n vrcholech nutně tvoří cyklus
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧬 Příklad 2: Cesta délky n v grafu o n vrcholech nutně tvoří cyklus", { level: 3, y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Tvrzení pro orientované sítě:",
      text: "Pokud v orientovaném grafu G = (V, E) o n vrcholech existuje orientovaná posloupnost procházející n hranami, pak nutně obsahuje alespoň jeden cyklus (smyčku).",
      y,
    });

    y = renderDocList(slide, [
      "1. Sled délky $n$ hran navštíví celkem **n + 1 vrcholů**: $(u_0 \\xrightarrow{e_1} u_1 \\to \\dots \\xrightarrow{e_n} u_n)$.",
      "2. Naši „holubi“ jsou navštívené pozice na trase: máme jich **n + 1**.",
      "3. Naše „škatulky“ jsou skutečné existující vrcholy grafu: máme jich jen **n** ($V = \\{v_1, \\dots, v_n\\}$).",
      "4. Dle Dirichletova principu ($n+1 > n$) musel být alespoň jeden vrchol **navštíven alespoň dvakrát**: $u_i = u_j$ pro nějaké $i < j$. Úsek trasy mezi nimi tvoří uzavřený cyklus!"
    ], { y });

    // ASCII cyklus sled
    const boxW = 9.5;
    const boxH = 1.3;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.916,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "FFF1F2" },
      line: { color: "FECDD3", width: 1 },
    });
    slide.addText(
      "Navštívené uzly:   u₀ ─────> u₁ ─────> u₂ ─────> u₃ ─────> u₄ (5 návštěv)\n                                       │                   ▲\n                                       │  u₂ a u₄ jsou     │\n                                       │  TÝŽ UZEL!        │\n                                       └───────────────────┘\n                                         Vzniká cyklus: u₂ ➔ u₃ ➔ u₂",
      {
        x: 2.116,
        y: y + 0.1,
        w: boxW - 0.4,
        h: boxH - 0.2,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: "BE123C",
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 6.8: 4. Extremální Princip v Grafech — Krok za Krokem
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "4. 🔬 Extremální Princip v Grafech — Krok za Krokem", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Extremální princip (Extremal Principle):",
      text: "Když chceš najít spor, zvolíme extrémní objekt (nejdelší cestu P_max, nejmenší cyklus, vrchol max/min stupně, nejlehčí hranu) a zkoumáme, co z jeho extremality plyne. Extrémní objekt už z principu nemůže mít vlastnost, která by ho zvětšila (jinak spor!).",
      y,
    });

    y = renderDocHeading(pres, slide, "Pracovaný příklad 1: Pokud δ(G) ≥ 2, pak G obsahuje cyklus", { level: 3, y });

    y = renderDocParagraph(slide,
      "**Tvrzení:** Nechť $G = (V, E)$ je konečný neorientovaný graf s minimálním stupněm $\\delta(G) \\ge 2$. Pak $G$ obsahuje alespoň jeden cyklus.\nUvažujme konkrétní graf se stupni 2:",
      { y }
    );

    // ASCII graf
    const boxW = 5.0;
    const boxH = 1.1;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.166,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      " 1 ──── 2 ──── 3\n |             |\n 5 ──── 4 ────┘",
      {
        x: 4.366,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(11),
        color: colors.textPrimary,
        align: "center",
      }
    );
    y += boxH + 0.15;

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Otázka k řešení:",
      text: "Zde každý uzel má stupeň 2. Cyklus 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ 1 existuje. Jak to dokázat obecně pro libovolný graf o n vrcholech?",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 6.9: ✍️ Formální důkaz extremálním principem: δ(G) ≥ 2
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Extremální Princip" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "✍️ Formální Důkaz Extremálním Principem: δ(G) ≥ 2", { level: 3, y });

    y = renderDocList(slide, [
      "**Krok 1 (Zvolíme nejdelší cestu):** Nechť $P = (v_0, v_1, \\dots, v_k)$ je **nejdelší jednoduchá cesta** v grafu $G$. (V konečném grafu zaručeně existuje).",
      "**Krok 2 (Zkoumáme koncový uzel v₀):** Má $\\deg(v_0) \\ge 2$ (z předpokladu $\\delta(G) \\ge 2$). Má tedy alespoň 2 různé sousedy.",
      "**Krok 3 (Sousedé v₀ musí ležet na cestě P):** Předpokládejme pro spor, že $v_0$ má souseda $u \\notin P$. Pak $(u, v_0, v_1, \\dots, v_k)$ je cesta délky $k+1$ — delší než $P$. To je **💥 SPOR s maximalitou cesty P**! Všichni sousedé $v_0$ tedy leží přímo na cestě $P$.",
      "**Krok 4 (Nalezení cyklu):** Uzel $v_0$ má alespoň 2 sousedy na $P$. Jeden je $v_1$, druhý je $v_j$ ($j \\ge 2$). Hrana $\\{v_0, v_j\\}$ spolu s úsekem cesty $v_0, \\dots, v_j$ tvoří **cyklus**!"
    ], { y });

    // ASCII schéma extremální důkaz
    const boxW = 10.0;
    const boxH = 1.6;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.666,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "             Hrana {v₀, vj} vytváří CYKLUS!\n        ┌───────────────────────────────────────┐\n        ▼                                       │\n      ( v₀ ) ───> ( v₁ ) ───> ( v₂ ) ───> ... ───> ( vj ) ───> ... ───> ( vk )\n        ▲\n        │  Pokus o souseda u ∉ P selže:\n        └─── ✖ (u) by prodloužil cestu na délku k+1 (SPOR s maximalitou P)",
      {
        x: 1.866,
        y: y + 0.1,
        w: boxW - 0.4,
        h: boxH - 0.2,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 6.10: Pracovaný příklad 2 & Konstruktivní vs Nekonstruktivní existence
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🛣️ Nejkratší Cesta a Konstruktivní vs. Nekonstruktivní Existence", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Věta o nejkratší cestě:",
      text: "V grafu G = (V, E, w) s nezápornými vahami (w(e) ≥ 0) neobsahuje žádná nejkratší cesta z s do t žádný cyklus.\nDůkaz sporem: Předpokládejme cyklus C na cestě: s ➔ u ➔ [C] ➔ u ➔ t. Vynecháním cyklu získáme cestu bez cyklu s váhou w(P') = w(P) - w(C) ≤ w(P). Pokud w(C) > 0, je to okamžitý SPOR s minimalitou cesty P!",
      y,
    });

    y = renderDocHeading(pres, slide, "💡 Důležitý vhled pro AG1: Konstruktivní vs. Nekonstruktivní existence", { level: 3, y });

    y = renderDocList(slide, [
      "**Nekonstruktivní existence (Důkaz sporem, Dirichlet, Extremální princip):** Dokážou, že hledaný prvek (vrcholy stejného stupně, cyklus, nejkratší cesta) *musí zaručeně existovat*, ale **nedávají žádný recept ani algoritmus**, jak ho v datech najít.",
      "**Konstruktivní existence (Zlatý standard v informatice):** Existenci dokážeme tím, že předložíme konkrétní **algoritmus (kód v C++)**, který řešení spolehlivě krok za krokem sestrojí (Dijkstra, BFS, Kruskal)."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 6.11: Procvičovací Úloha 1: Δ(G) ≤ 2 je cesta nebo cyklus
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "### Úloha 1: Graf s maximálním stupněm Δ(G) ≤ 2 je cesta nebo cyklus", { level: 3, y });

    y = renderDocParagraph(slide,
      "Dokážeme sporem, že každý souvislý graf $G$, ve kterém má každý vrchol $\\deg(v) \\le 2$, je buď cesta ($P_n$), nebo kružnice ($C_n$).",
      { y }
    );

    y = renderSolutionBanner(pres, slide, { title: "Vzorové Řešení Úlohy 1", y });

    y = renderDocList(slide, [
      "1. Zvolme v $G$ nejdelší jednoduchou cestu $P = (v_0, v_1, \\dots, v_k)$.",
      "2. Předpokládejme pro spor, že $G$ obsahuje uzel $u \\notin P$.",
      "3. Protože $G$ je souvislý, musí existovat hrana spojující $u$ s nějakým vrcholem cesty $P$.",
      "4. Vnitřní vrcholy $v_1, \\dots, v_{k-1}$ již mají stupeň 2 (hrany k sousedům na cestě). Nemohou se spojit s $u$, protože maximální stupeň je $\\le 2$.",
      "5. Hrana z $u$ by proto musela vést do krajního vrcholu $v_0$ nebo $v_k$. To by však prodloužilo cestu $P$ o uzel $u$, což je **SPOR s maximalitou cesty P**!",
      "6. Žádný uzel mimo $P$ tedy neexistuje a graf je buď cestou (pokud $v_0, v_k$ nejsou spojeny), nebo kružnicí."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 6.12: Procvičovací Úloha 2: Každý konečný DAG má zdroj
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "### Úloha 2: Každý konečný DAG má alespoň jeden zdroj (Source)", { level: 3, y });

    y = renderDocParagraph(slide,
      "Dokažte sporem, že v každém konečném orientovaném acyklickém grafu existuje uzel se vstupním stupněm $\\text{deg}^-(v) = 0$.",
      { y }
    );

    y = renderSolutionBanner(pres, slide, { title: "Vzorové Řešení Úlohy 2", y });

    y = renderDocList(slide, [
      "1. Předpokládejme pro spor, že DAG neobsahuje žádný zdroj — tedy každý uzel má $\\text{deg}^-(v) \\ge 1$.",
      "2. Vybereme libovolný uzel $u_0$. Protože má vstupní hranu, má předchůdce $u_1$, ten má předchůdce $u_2$, a tak dále.",
      "3. Vytváříme posloupnost kroků dozadu: $\\dots \\to u_2 \\to u_1 \\to u_0$.",
      "4. Protože graf má pouze $n$ vrcholů (konečná množina), podle Dirichletova principu se po nejvýše $n+1$ krocích musí alespoň jeden vrchol zopakovat: $u_i = u_j$.",
      "5. Tím vzniká orientovaný cyklus, což je **SPOR** s definicí DAGu (acyklický graf)! V každém konečném DAGu tedy vždy musí existovat zdroj."
    ], { y });
  }
}
