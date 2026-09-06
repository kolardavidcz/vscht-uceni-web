/**
 * Module 8: Zkouškový Workshop & Šablony Důkazů z AG1
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml-zkouskovy-workshop.md
 */
import {
  createDocSlide,
  renderDocHeading,
  renderDocParagraph,
  renderDocList,
  renderDocCallout,
  renderDocTable,
  renderSolutionBanner,
  colors,
  fs
} from "../pptx_document_engine.mjs";

export function addModule8Slides(pres) {
  const breadcrumb = "MODUL 8 · 🎓 ZKOUŠKOVÝ WORKSHOP & ŠABLONY DŮKAZŮ";

  // --------------------------------------------------------------------------
  // Slide 8.1: Titul & 1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy?
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Zkouškový Workshop & Šablony Důkazů z AG1", { level: 1, y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Cíl kapitoly:",
      text: "Vybruslit ze všech nebezpečných úskalí u zkouškových písemek z předmětu AG1 na FIT ČVUT. Osvojit si formální univerzální šablony důkazů a projít si rozsáhlý workshop plně vyřešených zkouškových příkladů s kompletním hodnoticím komentářem, bodovacím kritériem a analýzou chyb.",
      y,
    });

    y = renderDocHeading(pres, slide, "1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy?", { level: 2, y, showUnderline: true });

    y = renderDocTable(slide, {
      headers: ["Co vás bude stát body (až 0 b za příklad)", "Co vám zajistí plný počet bodů (100 %)"],
      rows: [
        ["Redukční past u indukce: začátek z G_n a přidání uzlu.", "Dekonstrukční indukce: začátek z libovolného G_{n+1} a redukce na G_n."],
        ["Chybějící ověření báze: opomenutí nejmenšího objektu P(n₀).", "Explicitní báze: přesně zapsaný a ověřený základní krok P(n₀)."],
        ["Nejasný předpoklad sporu: chybí explicitní negace závěru ¬B.", "Přesný předpoklad sporu: zapsáno „Platí A a zároveň ¬B“."],
        ["Neoznačený rozpor: neuvedení přesného místa, kde spor nastal.", "Jasný rozpor: jednoznačně označený rozpor (⚡ / SPOR) s konkrétní větou."],
        ["Neúplný invariant: chybí jedna ze 3 fází (např. ukončení).", "Kompletní invariant: všechny 3 fáze (inicializace, udržování, ukončení)."]
      ],
      colWidths: [5.8, 5.933],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 8.2: Šablona 1: Dekonstrukční Indukce podle Počtu Vrcholů n = |V|
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📝 Šablona 1: Dekonstrukční Indukce podle Počtu Vrcholů n = |V|", { level: 2, y, showUnderline: true });

    const boxW = 11.733;
    const boxH = 4.0;
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
      "1. BÁZE INDUKCE (n = n₀):\n   - Uvažujme nejmenší přípustný graf G₀ o n₀ vrcholech.\n   - Pro graf G₀ ověříme platnost dokazovaného tvrzení P(G₀). Báze pro n = n₀ platí.\n\n2. INDUKČNÍ PŘEDPOKLAD (IP):\n   - Předpokládejme, že tvrzení platí pro VŠECHNY grafy z dané třídy o k vrcholech, kde n₀ ≤ k ≤ n.\n\n3. INDUKČNÍ KROK (n ➔ n + 1):\n   - Nechť G = (V, E) je LIBOVOLNÝ ZADANÝ graf o n + 1 vrcholech z dané třídy.\n   - V grafu G zvolíme vhodný prvek v (např. list nebo uzel s deg(v) ≤ c).\n   - Vytvoříme podgraf G' = G \\ {v} odebráním vrcholu v a jeho incidentních hran.\n   - Ověříme, že podgraf G' má n vrcholů a STÁLE SPLŇUJE všechny předpoklady věty.\n   - Použijeme INDUKČNÍ PŘEDPOKLAD (IP) na podgraf G'.\n   - Vrátíme odebraný prvek v a dokážeme, že platnost tvrzení se přenese na původní G.\nTím je důkaz indukcí dokončen. Q.E.D.",
      {
        x: 1.05,
        y: y + 0.15,
        w: boxW - 0.5,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(9.5),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 8.3: Šablona 2: Důkaz Sporem (A ∧ ¬B ⇒ ⊥)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📝 Šablona 2: Důkaz Sporem ($A \\land \\neg B \\implies \\bot$)", { level: 2, y, showUnderline: true });

    const boxW = 11.733;
    const boxH = 4.0;
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
      "1. PŘEDPOKLAD PRO SPOR:\n   - „Předpokládejme pro spor, že platí předpoklad A a ZÁROVEŇ NEPLATÍ závěr B.“\n   - (Tj. předpokládáme platnost A a zároveň platnost ¬B).\n\n2. LOGICKÉ ODVOZOVÁNÍ:\n   - „Z platnosti ¬B plyne vlastnost X: [Vypsat X].“\n   - „Z vlastnosti X a předpokladu A odvodíme vlastnost Y: [Vypsat Y].“\n\n3. DOSAŽENÍ SPORU (⚡ / 💥 / ⊥):\n   - „Vlastnost Y je však v přímém SPORU (⚡) s [Definicí Z / Předpokladem A / Dokázaným faktem]!“\n\n4. ZÁVĚR:\n   - „Náš předpoklad pro spor (A ∧ ¬B) byl tedy chybný.“\n   - „Proto původní tvrzení A => B platí.“ Q.E.D.",
      {
        x: 1.05,
        y: y + 0.15,
        w: boxW - 0.5,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(10),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.18,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 8.4: Šablona 3: Správnost Algoritmu Pomocí Invariantu Cyklu
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📝 Šablona 3: Správnost Algoritmu Pomocí Invariantu Cyklu", { level: 2, y, showUnderline: true });

    const boxW = 11.733;
    const boxH = 4.2;
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
      "1. DEFINICE INVARIANTU:\n   - Definujeme invariant I: [Zapsat přesnou vlastnost datových struktur v cyklu].\n\n2. INICIALIZACE (Před prvním průchodem cyklu):\n   - Dokážeme, že invariant I platí před 1. iterací (krok 0).\n   - [Zapsat stav proměnných před cyklem a ověřit I].\n\n3. UDRŽOVÁNÍ (Během kroku cyklu):\n   - Předpokládáme, že invariant I platí před i-tou iterací.\n   - Provedeme tělo cyklu v i-té iteraci.\n   - Dokážeme, že po provedení kódu invariant I drží i po dokončení iterace.\n\n4. UKONČENÍ (Po skončení cyklu):\n   - Cyklus skončí na základě podmínky C.\n   - Zkombinujeme invariant I platný po skončení cyklu s podmínkou C.\n   - Ukážeme, že algoritmus vrátil přesně požadovaný výsledek. Q.E.D.",
      {
        x: 1.05,
        y: y + 0.15,
        w: boxW - 0.5,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(9.5),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 8.5: Příklad 4.1: Rozklad Sudého Grafu na Cykly (Zadání & Řešení)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧪 Příklad 4.1: Rozklad Sudého Grafu na Cykly (Dekonstrukční Indukce)", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Zadání zkouškového příkladu:",
      text: "Dokážeme dekonstrukční indukcí podle počtu hran m = |E|, že každý souvislý neorientovaný graf G = (V, E), ve kterém má každý vrchol sudý stupeň (∀v ∈ V: deg(v) ≥ 2 je sudé), lze rozložit na hranově disjunktní cykly.",
      y,
    });

    y = renderSolutionBanner(pres, slide, { title: "Formální Zkouškové Řešení", y });

    y = renderDocList(slide, [
      "1. **Báze indukce (m = 3):** Nejmenší souvislý graf se sudými stupni $\\ge 2$ je trojúhelník $K_3$ ($n=3, m=3$). Graf sám tvoří 1 cyklus, tvrzení platí.",
      "2. **Indukční předpoklad (IP):** Předpokládejme, že každý graf s $k < m$ hranami splňující podmínky sudých stupňů lze rozložit na hranově disjunktní cykly.",
      "3. **Indukční krok (m hran):**",
      "   • Vezměme **LIBOVOLNÝ** graf $G$ s $m$ hranami se sudými stupni. Protože $\\deg(v) \\ge 2$, $G$ obsahuje alespoň jeden jednoduchý cyklus $C$.",
      "   • Odebereme z $G$ všechny hrany cyklu $C$ a získáme podgraf $G' = (V, E \\setminus E(C))$.",
      "   • Odebrání cyklu $C$ snížilo stupeň každého vrcholu cyklu přesně o 2. Všechny vrcholy v $G'$ mají **stále sudý stupeň**!",
      "   • Podgraf $G'$ má $m - |E(C)| < m$ hran. Aplikujeme **IP** na jednotlivé komponenty $G'$.",
      "   • Přidáním cyklu $C$ zpět získáme kompletní rozklad původního grafu $G$."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 8.6: Příklad 4.1: Rozbor Hodnocení a Rubrika
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Příklad 4.1" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Rozbor Hodnocení a Rubrika: Příklad 4.1", { level: 3, y });

    y = renderDocTable(slide, {
      headers: ["Bodové hodnocení", "Kritéria vyučujících na FIT ČVUT", "Doporučení"],
      rows: [
        ["100 % bodů", "Začátek z libovolného grafu G(m), dekonstrukce odebráním cyklu C, explicitní ověření sudosti stupňů v podgrafu G', správné použití IP.", "Plný počet bodů bez výhrad."],
        ["-30 % bodů", "Zapomenutí ověřit, že podgraf G' si zachoval sudé stupně i po odebrání hran cyklu C.", "Vždy explicitně zapište: deg_G'(v) = deg_G(v) - 2 je sudé."],
        ["0 bodů (propadnutí)", "Konstrukční past: začátek z menšího grafu a přidávání hran cyklu C zdola nahoru.", "Nikdy nestavte graf zdola nahoru!"]
      ],
      colWidths: [2.8, 5.8, 3.133],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Proč odebrání cyklu nesmí chybět?",
      text: "Odebráním cyklu C klesne stupeň dotčených uzlů přesně o 2. Sudé číslo minus 2 je VŽDY sudé číslo. To je klíčový invariant, který umožňuje použít IP!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 8.7: Příklad 4.2: Extremální Princip & Nejdelší Cesta
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧪 Příklad 4.2: Extremální Princip & Nejdelší Cesta (Důkaz Sporem)", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Zadání zkouškového příkladu:",
      text: "Dokážeme sporem, že v každém konečném grafu G = (V, E) s minimálním stupněm δ(G) ≥ 2 existuje jednoduchá cesta délky alespoň δ(G).",
      y,
    });

    y = renderSolutionBanner(pres, slide, { title: "Formální Zkouškové Řešení", y });

    y = renderDocList(slide, [
      "1. **Konstrukce extremálního objektu:** Zvolme v grafu $G$ **nejdelší jednoduchou cestu** $P = (v_0, v_1, v_2, \\dots, v_k)$ délky $k$ (počet hran je $k$).",
      "2. **Analýza koncového vrcholu vk:** Uvažujme sousedy koncového vrcholu $v_k$:",
      "   • Nemůže mít žádného souseda $w \\notin P$ mimo cestu $P$ (jinak bychom prodloužili cestu o $w$ na délku $k+1$, což je spor s maximalitou $P$).",
      "   • Všichni sousedé vrcholu $v_k$ tedy musí ležet přímo na cestě $P$!",
      "3. **Ocenění délky cesty:** Jelikož $\\deg(v_k) \\ge \\delta(G)$, vrchol $v_k$ má alespoň $\\delta(G)$ různých sousedů na cestě $P$. Protože vrcholy cesty jsou $v_0, v_1, \\dots, v_k$, nejvzdálenější soused $v_k$ musí být vzdálen alespoň $\\delta(G)$ hran po cestě. Odtud délka cesty splňuje: **k ≥ δ(G)**. Q.E.D."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 8.8: Příklad 4.2: Rozbor Hodnocení a Rubrika
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Příklad 4.2" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Rozbor Hodnocení a Rubrika: Příklad 4.2", { level: 3, y });

    y = renderDocTable(slide, {
      headers: ["Bodové hodnocení", "Kritéria vyučujících na FIT ČVUT", "Doporučení"],
      rows: [
        ["100 % bodů", "Výběr nejdelší jednoduché cesty P, odvození, že všichni sousedé koncového vrcholu vk leží na P (důkaz sporem), algebraické srovnání s δ(G).", "Plný počet bodů."],
        ["-40 % bodů", "Nezdůvodnění, proč vk nemůže mít souseda mimo cestu P.", "Vždy explicitně zmiňte spor s maximalitou cesty P!"],
        ["0 bodů", "Výběr libovolné (náhodné) cesty místo nejdelší extremální cesty.", "Bez extremality nelze zaručit, že soused neleží vně!"]
      ],
      colWidths: [2.8, 5.8, 3.133],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Klíčový trik extremálního principu:",
      text: "Krajní vrchol nejdelší cesty už nemá kam pokračovat! Všichni jeho sousedé jsou nuceni ležet na trase. Kolik má sousedů, tolik minimálně musí mít cesta vrcholů.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 8.9: Příklad 4.3: Unikátnost Minimální Kostry (Cut Property)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧪 Příklad 4.3: Unikátnost Minimální Kostry (Cut Property)", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Zadání zkouškového příkladu:",
      text: "Dokážeme sporem, že pokud jsou všechny váhy hran v souvislém grafu G = (V, E, w) navzájem různé (unikátní), pak má graf G právě jednu (jednoznačnou) minimální kostru (MST).",
      y,
    });

    y = renderSolutionBanner(pres, slide, { title: "Formální Zkouškové Řešení", y });

    y = renderDocList(slide, [
      "1. **Předpoklad pro spor:** Předpokládejme, že existují dvě různé minimální kostry $T_1 \\neq T_2$ se stejnou minimální vahou $w(T_1) = w(T_2)$.",
      "2. **Krok 1 (Nejlehčí rozdílná hrana):** Zvolme nejlehčí hranu $e = \\{u, v\\} \\in E(T_1) \\triangle E(T_2)$. Bez újmy na obecnosti nechť $e \\in T_1$ a $e \\notin T_2$.",
      "3. **Krok 2 (Přidání e do T₂):** Vložením $e$ do $T_2$ vznikne cyklus $C$. V cyklu $C$ musí ležet jiná hrana $e' \\notin T_1$. Z volby $e$ jako nejlehčí rozdílné hrany plyne: $w(e) < w(e')$.",
      "4. **Krok 3 (Konstrukce T₂'):** Vytvořme kostru $T_2' = (T_2 \\cup \\{e\\}) \\setminus \\{e'\\}$. Její váha je $w(T_2') = w(T_2) + w(e) - w(e') < w(T_2)$.",
      "5. **💥 SPOR:** Našli jsme kostru s váhou menší než minimální kostra $T_2$! Minimální kostra je jedinečná. Q.E.D."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 8.10: Příklad 4.3: Rozbor Hodnocení a Rubrika
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Příklad 4.3" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Rozbor Hodnocení a Rubrika: Příklad 4.3", { level: 3, y });

    y = renderDocTable(slide, {
      headers: ["Bodové hodnocení", "Kritéria vyučujících na FIT ČVUT", "Doporučení"],
      rows: [
        ["100 % bodů", "Správný výběr NEJLEHČÍ hrany symetrické diference e ∈ T₁ △ T₂, vložení do T₂, vznik cyklu C, existence e' ∉ T₁, ostrá nerovnost w(e) < w(e'), spor.", "Plný počet bodů."],
        ["-50 % bodů", "Náhodný výběr rozdílné hrany bez požadavku na nejlehčí hranu diference (pak nelze zaručit w(e) < w(e')).", "Slovo NEJLEHČÍ je zde klíčem k celému důkazu!"],
        ["0 bodů", "Záměna kostry za cestu nebo nepochopení definice stromu.", "Kostra = souvislý podgraf obsahující všechny vrcholy bez cyklů."]
      ],
      colWidths: [2.8, 5.8, 3.133],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 8.11: Příklad 4.4: Počet Hran v Lese se c Komponentami
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧪 Příklad 4.4: Počet Hran v Lese se c Komponentami (m = n - c)", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Zadání zkouškového příkladu:",
      text: "Dokážeme dekonstrukční indukcí podle počtu hran m = |E|, že každý neorientovaný acyklický graf (les) G = (V, E) s n = |V| vrcholy a c komponentami souvislosti má přesně m = n - c hran.",
      y,
    });

    y = renderSolutionBanner(pres, slide, { title: "Formální Zkouškové Řešení", y });

    y = renderDocList(slide, [
      "1. **Báze indukce (m = 0):** Graf bez hran má $n$ izolovaných vrcholů, tedy $c = n$ komponent. Platí $m = 0 = n - n = n - c$. Báze platí ✅.",
      "2. **Indukční předpoklad (IP):** Předpokládejme, že pro každý les s $k < m$ hranami platí vzorec $k = n - c_k$.",
      "3. **Indukční krok (m hran):**",
      "   • Vezměme **LIBOVOLNÝ** les $G$ s $m$ hranami a $c$ komponentami.",
      "   • Zvolme libovolnou hranu $e = \\{u, v\\} \\in E$ a odeberme ji: získáme podgraf $G' = (V, E \\setminus \\{e\\})$ s $m - 1$ hranami.",
      "   • Protože $G$ neobsahuje cykly, hrana $e$ byla jediným spojením mezi $u$ a $v$. Jejím odebráním se komponenta rozpadla na 2 nové komponenty: $c' = c + 1$!",
      "   • Aplikujeme **IP** na podgraf $G'$: $|E(G')| = n - c' \\implies m - 1 = n - (c + 1) = n - c - 1$.",
      "   • Přičtením 1 k oběma stranám: **m = n - c**. Q.E.D."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 8.12: Příklad 4.4: Rozbor Hodnocení a Rubrika
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Příklad 4.4" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Rozbor Hodnocení a Rubrika: Příklad 4.4", { level: 3, y });

    y = renderDocTable(slide, {
      headers: ["Bodové hodnocení", "Kritéria vyučujících na FIT ČVUT", "Doporučení"],
      rows: [
        ["100 % bodů", "Dekonstrukční odebrání hrany e, explicitní zdůvodnění změny počtu komponent c' = c + 1 díky acykličnosti, korektní algebra s IP.", "Plný počet bodů."],
        ["-30 % bodů", "Opomenutí zdůvodnit, proč odebrání hrany v acyklickém grafu VŽDY zvýší počet komponent o 1 (kdyby tam byl cyklus, počet komponent by se nezměnil!).", "Vždy zdůvodněte roli acykličnosti!"],
        ["0 bodů", "Konstrukční indukce přidáváním hran k prázdnému grafu.", "Opět dekonstrukce shora!"]
      ],
      colWidths: [2.8, 5.8, 3.133],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 8.13: Příklad 4.5: Bipartitnost a Liché Cykly (Důkaz Sporem)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧪 Příklad 4.5: Bipartitnost a Liché Cykly (Důkaz Sporem)", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Zadání zkouškového příkladu:",
      text: "Dokážeme sporem, že pokud graf G = (V, E) obsahuje lichý cyklus Cₖ (délky k = 2r + 1), pak graf G NENÍ bipartitní.",
      y,
    });

    y = renderSolutionBanner(pres, slide, { title: "Formální Zkouškové Řešení & Rubrika", y });

    y = renderDocList(slide, [
      "1. **Předpoklad pro spor:** Předpokládejme, že graf $G$ obsahuje lichý cyklus $C = (v_1, v_2, \\dots, v_k, v_1)$ a ZÁROVEŇ **je bipartitní** s rozkladem $V = V_1 \\cup V_2$.",
      "2. **Alternace množin:** Zařaďme $v_1 \\in V_1$. Protože $\\{v_1, v_2\\} \\in E$, musí $v_2 \\in V_2$. Obecně: $v_i \\in V_1 \\iff i$ je liché, a $v_i \\in V_2 \\iff i$ je sudé.",
      "3. **Poslední vrchol:** Jelikož $k$ je liché číslo ($k = 2r+1$), platí $v_k \\in V_1$.",
      "4. **💥 SPOR:** Cyklus uzavírá hrana $\\{v_k, v_1\\}$. Oba její konce $v_k \\in V_1$ i $v_1 \\in V_1$ leží ve stejné partitě $V_1$! To je v přímém SPORU s definicí bipartitního grafu! Graf tedy není bipartitní. Q.E.D.",
      "• **Hodnocení:** 100 % za přesnou alternaci a spor na hraně $\\{v_k, v_1\\}$."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 8.14: Příklad 4.6: Správnost BFS Pomocí Invariantu Cyklu
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🧪 Příklad 4.6: Správnost BFS Pomocí Invariantu Cyklu", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Zadání zkouškového příkladu:",
      text: "Dokážeme invariantem cyklu, že ve FIFO frontě Q = ⟨v₁, v₂, …, vᵣ⟩ algoritmu BFS platí d[vᵣ] ≤ d[v₁] + 1 (hodnoty ve frontě se liší nanejvýš o 1 a jsou seřazeny neklesavě).",
      y,
    });

    y = renderSolutionBanner(pres, slide, { title: "Formální Zkouškové Řešení & Rubrika", y });

    y = renderDocList(slide, [
      "1. **Definice Invariantu:** V každé iteraci cyklu platí ve frontě $Q$: $d[v_r] \\le d[v_1] + 1$ a $d[v_1] \\le d[v_2] \\le \\dots \\le d[v_r]$.",
      "2. **Inicializace:** Na začátku $Q = \\langle s \\rangle$. $d[s] = 0 \\le 0 + 1$. Invariant platí ✅.",
      "3. **Udržování:** Předpokládejme, že invariant platí před vyjmutím $u = v_1$ (`pop`). Vyjmutím $u$ zůstane seřazená fronta. Procházíme sousedy $v$ vrcholu $u$ a vkládáme je s $d[v] = d[u] + 1$ na konec fronty (`push`). Jelikož na čele bylo $d[u]$ nebo $d[u]+1$, nově vkládané prvky s hodnotou $d[u]+1$ zachovají maximální rozdíl 1 od nového čela. Invariant drží ✅.",
      "4. **Ukončení:** Po vyprázdnění fronty jsou všechny vzdálenosti zaručeně nejkratší. Q.E.D.",
      "• **Hodnocení:** 100 % za kompletní ověření všech 3 fází a operací push/pop."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 8.15: Závěrečná Gratulace & Úspěch v AG1
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 1.0;

    // Orange congratulations container
    const boxW = 11.733;
    const boxH = 4.8;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.15,
      fill: { color: "FFF7ED" },
      line: { color: colors.brandOrange, width: 2 },
    });

    slide.addText("🎉 Gratulujeme! Dokončili jste kompletní letní přípravu pre-AG1!", {
      x: 1.1,
      y: y + 0.3,
      w: boxW - 0.6,
      h: 0.6,
      fontFace: "Calibri",
      fontSize: fs(22),
      bold: true,
      color: colors.brandOrangeDark,
      align: "center",
    });

    slide.addText(
      "Nyní máte veškerou matematickou jistotu, intuici i formální aparát pro úspěšné zvládnutí předmětu AG1 na FIT ČVUT!\n\nCo všechno máte v malíku:\n• Přirozenou bio-intuici přeloženou do precizního jazyka grafů G = (V, E)\n• Bezchybnou negaci výroků s kvantifikátory a rozlišení nutné a postačující podmínky\n• Dekonstrukční indukci na grafech bez nebezpečné redukční pasti (vždy shora dolů!)\n• Důkazy sporem přes Dirichletův a Extremální princip nejdelší cesty\n• Efektivní reprezentaci grafů v C++ pomocí Seznamu sousedů a průchody BFS/DFS\n• Zkouškové šablony důkazů a rozbory typických chyb pro 100 % bodů z písemek",
      {
        x: 1.3,
        y: y + 1.1,
        w: boxW - 1.0,
        h: 2.8,
        fontFace: "Calibri",
        fontSize: fs(12.5),
        color: colors.textSecondary,
        lineSpacingMultiple: 1.25,
      }
    );

    slide.addText("VŠCHT Učení · Obor Bioinformatika · Mnoho štěstí v semestru na FIT ČVUT! 🚀", {
      x: 1.1,
      y: y + 4.1,
      w: boxW - 0.6,
      h: 0.4,
      fontFace: "Calibri",
      fontSize: fs(11),
      bold: true,
      color: colors.brandOrangeDark,
      align: "center",
    });
  }
}
