/**
 * Module 8: Zkouškový Workshop & Šablony Důkazů z AG1
 * 1:1 Verbatim Content from src/features/bioinformatics/content/3-semestr/pre-ag1/dml-zkouskovy-workshop.md
 * Split cleanly across slides to guarantee zero overflow at 2x font scale.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide
} from "../pptx_engine.mjs";

export function addModule8Slides(pres) {
  const breadcrumb = "8 · Zkouškový Workshop & Šablony Důkazů";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 8,
    title: "Zkouškový Workshop & Šablony Důkazů z AG1",
    goal: "Vybruslit ze všech nebezpečných úskalí u zkouškových písemek z předmětu AG1 (Algoritmy a Grafy 1) na FIT ČVUT. Osvojit si formální univerzální šablony důkazů a projít si rozsáhlý workshop plně vyřešených zkouškových příkladů s kompletním hodnoticím komentářem, bodovacím kritériem a analýzou nejčastějších chyb.",
    topics: [
      "1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy?",
      "Co vás bude stát body (až 0 b) vs. Co vám zajistí 100 %",
      "2. Kompletní Šablonový Manuál pro Písemné Důkazy",
      "Šablony: Indukce, Spor & Invariant cyklu",
      "Příklad 4.1: Rozklad Sudého Grafu na Cykly",
      "Příklad 4.2: Extremální Princip & Nejdelší Cesta",
      "Příklady 4.3 & 4.4: Minimální Kostra & Počet Hran v Lese",
      "Příklady 4.5 & 4.6: Bipartitnost & Invariant Fronty BFS"
    ]
  });

  // 2. 1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy?
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy?",
    leftCard: {
      title: "Co vás bude stát body (až 0 b za příklad)",
      badge: "NEÚPROSNÁ KRITÉRIA",
      type: "rose",
      items: [
        { bold: "Redukční past u indukce:", text: "začátek z G_n a přidání uzlu místo dekonstrukce z G_{n+1}." },
        { bold: "Chybějící ověření báze:", text: "opomenutí nejmenšího objektu P(n_0)." },
        { bold: "Nejasný předpoklad sporu:", text: "chybí explicitní negace závěru ¬B." },
        { bold: "Neoznačený rozpor:", text: "neuvedení přesného místa a faktu, kde spor nastal." },
        { bold: "Neúplný invariant:", text: "chybí jedna ze 3 fází (např. ukončení)." }
      ]
    },
    rightCard: {
      title: "Co vám zajistí plný počet bodů (100 %)",
      badge: "PLNÝ POČET BODŮ",
      type: "emerald",
      items: [
        { bold: "Dekonstrukční indukce:", text: "začátek z libovolného G_{n+1} a redukce na G_n." },
        { bold: "Explicitní báze:", text: "přesně zapsaný a ověřený základní krok P(n_0)." },
        { bold: "Přesný předpoklad sporu:", text: "zapsáno „Platí A a zároveň ¬B“." },
        { bold: "Jasný rozpor:", text: "jednoznačně označený rozpor (⚡ / SPOR) s konkrétní větou." },
        { bold: "Kompletní invariant:", text: "všechny 3 fáze (inicializace, udržování, ukončení)." }
      ]
    }
  });

  // 3A. Šablona 1: Dekonstrukční Indukce (Báze & Předpoklad)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Šablona 1: Dekonstrukční Indukce (Báze & IP)",
    leftCard: {
      title: "1. Báze Indukce (n = n_0)",
      badge: "BÁZE INDUKCE",
      type: "warm",
      items: [
        { bold: "Nejmenší objekt:", text: "Uvažujme nejmenší přípustný graf G_0 o n_0 vrcholech." },
        { bold: "Ověření platnosti:", text: "Pro graf G_0 ověříme platnost dokazovaného tvrzení P(G_0): [Zapsat ověření]." },
        { bold: "Závěr báze:", text: "Báze pro n = n_0 platí." }
      ]
    },
    rightCard: {
      title: "2. Indukční Předpoklad (IP)",
      badge: "INDUKČNÍ PŘEDPOKLAD",
      type: "emerald",
      items: [
        { bold: "Znění předpokladu:", text: "Předpokládejme, že tvrzení platí pro VŠECHNY grafy z dané třídy o k vrcholech, kde n_0 ≤ k ≤ n." }
      ]
    }
  });

  // 3B. Šablona 1: Dekonstrukční Indukce (Indukční Krok)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Šablona 1: Dekonstrukční Indukce (Krok n → n + 1)",
    leftCard: {
      title: "Dekonstrukce Podgrafu G'",
      badge: "DEKONSTRUKCE",
      type: "warm",
      items: [
        { bold: "Libovolný zadaný graf:", text: "Nechť G = (V, E) je LIBOVOLNÝ ZADANÝ graf o n + 1 vrcholech z dané třídy." },
        { bold: "Volba prvku v:", text: "V grafu G zvolíme vhodný prvek v (např. list nebo uzel s deg(v) ≤ c)." },
        { bold: "Vytvoření G':", text: "Vytvoříme podgraf G' = G ∖ {v} odebráním vrcholu v a jeho incidentních hran." }
      ]
    },
    rightCard: {
      title: "Aplikace IP & Rekonstrukce",
      badge: "IP & ZÁVĚR",
      type: "emerald",
      items: [
        { bold: "Ověření předpokladů:", text: "Ověříme, že podgraf G' má n vrcholů a STÁLE SPLŇUJE všechny předpoklady věty." },
        { bold: "Použití IP na G':", text: "Použijeme INDUKČNÍ PŘEDPOKLAD (IP) na podgraf G': [Dosadit vzorec dle IP pro G']." },
        { bold: "Návrat prvku v:", text: "Vrátíme odebraný prvek v a dokážeme, že platnost tvrzení se přenese na původní G: [Zapsat algebraické / logické spojení G' a v pro G]." },
        { bold: "Závěr:", text: "Tím je důkaz indukcí dokončen. Q.E.D." }
      ]
    }
  });

  // 4. Šablona 2: Důkaz Sporem (A ∧ ¬B ⇒ ⊥)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Šablona 2: Důkaz Sporem (A ∧ ¬B ⇒ ⊥)",
    leftCard: {
      title: "1. Předpoklad pro Spor & 2. Odvozování",
      badge: "NEGACE ZÁVĚRU",
      type: "rose",
      items: [
        { bold: "1. PŘEDPOKLAD PRO SPOR:", text: "„Předpokládejme pro spor, že platí předpoklad A a ZÁROVEŇ NEPLATÍ závěr B.“" },
        { bold: "Formální vyjádření:", text: "(Tj. předpokládáme platnost A a zároveň platnost ¬B)." },
        { bold: "2. LOGICKÉ ODVOZOVÁNÍ:", text: "„Z platnosti ¬B plyne vlastnost X: [Vypsat X]. Z vlastnosti X a předpokladu A odvodíme vlastnost Y: [Vypsat Y].“" }
      ]
    },
    rightCard: {
      title: "3. Dosažení Sporu & 4. Závěr",
      badge: "⚡ / 💥 / ⊥",
      type: "neutral",
      items: [
        { bold: "3. DOSAŽENÍ SPORU (⚡ / 💥 / ⊥):", text: "„Vlastnost Y je však v přímém SPORU (⚡) s [Definicí Z / Předpokladem A / Dokázaným faktem]!“" },
        { bold: "4. ZÁVĚR:", text: "„Náš předpoklad pro spor (A ∧ ¬B) byl tedy chybný.“" },
        { bold: "Výsledná platnost:", text: "„Proto původní tvrzení A ⇒ B platí.“ Q.E.D." }
      ]
    }
  });

  // 5. Šablona 3: Správnost Algoritmu Pomocí Invariantu Cyklu
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Šablona 3: Správnost Algoritmu Pomocí Invariantu",
    leftCard: {
      title: "1. Definice Invariantu & 2. Inicializace",
      badge: "DEFINICE & BÁZE",
      type: "blue",
      items: [
        { bold: "1. DEFINICE INVARIANTU:", text: "Definujeme invariant I: [Zapsat přesnou vlastnost datových struktur v cyklu]." },
        { bold: "2. INICIALIZACE:", text: "(Před prvním průchodem cyklu): Dokážeme, že invariant I platí před 1. iterací (krok 0)." },
        { bold: "Ověření proměnných:", text: "[Zapsat stav proměnných před cyklem a ověřit I]." }
      ]
    },
    rightCard: {
      title: "3. Udržování & 4. Ukončení",
      badge: "KROK & VÝSLEDEK",
      type: "emerald",
      items: [
        { bold: "3. UDRŽOVÁNÍ (Během kroku cyklu):", text: "Předpokládáme, že invariant I platí před i-tou iterací. Provedeme tělo cyklu v i-té iteraci. Dokážeme, že po provedení kódu invariant I drží i po dokončení iterace." },
        { bold: "4. UKONČENÍ (Po skončení cyklu):", text: "Cyklus skončí na základě podmínky C." },
        { bold: "Závěr korektnosti:", text: "Zkombinujeme invariant I platný po skončení cyklu s podmínkou C. Ukážeme, že algoritmus vrátil přesně požadovaný výsledek. Q.E.D." }
      ]
    }
  });

  // 6A. Příklad 4.1: Rozklad Sudého Grafu na Cykly (Zadání & Báze)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.1: Rozklad Sudého Grafu (Zadání & Báze)",
    leftCard: {
      title: "Zadání Úlohy",
      badge: "ZADÁNÍ",
      type: "warm",
      items: [
        { bold: "Dokazované tvrzení:", text: "Dokážeme dekonstrukční indukcí podle počtu hran m = |E|, že každý souvislý neorientovaný graf G = (V, E), ve kterém má každý vrchol sudý stupeň (∀v ∈ V: deg(v) ≥ 2 je sudé), lze rozložit na hranově disjunktní cykly." }
      ]
    },
    rightCard: {
      title: "1. Báze Indukce & 2. Indukční Předpoklad",
      badge: "BÁZE & IP",
      type: "emerald",
      items: [
        { bold: "1. Báze indukce (m = 3):", text: "Nejmenší souvislý graf se sudými stupni alespoň 2 je trojúhelník K_3 (n=3, m=3). Graf sám tvoří 1 cyklus, tvrzení platí." },
        { bold: "2. Indukční předpoklad (IP):", text: "Předpokládejme, že každý graf s k < m hranami plnící podmínky sudých stupňů lze rozložit na hranově disjunktní cykly." }
      ]
    }
  });

  // 6B. Příklad 4.1: Rozklad Sudého Grafu na Cykly (Indukční Krok)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.1: Rozklad Sudého Grafu (Indukční Krok)",
    leftCard: {
      title: "Dekonstrukce Odebráním Cyklu C",
      badge: "DEKONSTRUKCE",
      type: "warm",
      items: [
        { bold: "Libovolný graf:", text: "Vezměme LIBOVOLNÝ graf G s m hranami se sudými stupni. Protože deg(v) ≥ 2 pro všechny vrcholy, G obsahuje alespoň jeden jednoduchý cyklus C." },
        { bold: "Odebrání cyklu C:", text: "Odebereme z G všechny hrany cyklu C a získáme podgraf G' = (V, E ∖ E(C))." },
        { bold: "Zachování sudosti:", text: "Odebrání cyklu C snížilo stupeň každého vrcholu cyklu přesně o 2. Tedy všechny vrcholy v G' mají stále sudý stupeň." }
      ]
    },
    rightCard: {
      title: "Aplikace IP & Rekonstrukce",
      badge: "IP & ZÁVĚR",
      type: "emerald",
      items: [
        { bold: "Počet hran podgrafu:", text: "Podgraf G' má m - |E(C)| < m hran." },
        { bold: "Aplikace IP:", text: "Aplikujeme IP na jednotlivé komponenty souvislosti podgrafu G'. Podle IP lze G' rozložit na hranově disjunktní cykly." },
        { bold: "Závěrečná rekonstrukce:", text: "Přidáním cyklu C zpět získáme kompletní rozklad původního grafu G na hranově disjunktní cykly." }
      ]
    }
  });

  // 6C. Příklad 4.1: Rozbor Hodnocení (Rubrika)
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.1: Rozbor Hodnocení (Rubrika)",
    card: {
      title: "Rozbor Hodnocení (Rubrika)",
      badge: "HODNOCENÍ FIT",
      type: "neutral",
      items: [
        { bold: "100 % bodů:", text: "Libovolný graf G(m), dekonstrukce odebráním cyklu C, ověření sudosti stupňů v G', správné použití IP." },
        { bold: "-30 % bodů:", text: "Zapomenutí ověřit, že podgraf G' si zachoval sudé stupně po odebrání cyklu." },
        { bold: "0 bodů:", text: "Konstrukční past (začátek z menšího grafu a přidávání hran cyklu)." }
      ]
    }
  });

  // 7A. Příklad 4.2: Extremální Princip & Nejdelší Cesta (Řešení)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.2: Extremální Princip & Nejdelší Cesta",
    leftCard: {
      title: "Zadání, Konstrukce & Analýza v_k",
      badge: "EXTREMÁLNÍ OBJEKT",
      type: "warm",
      items: [
        { bold: "Zadání:", text: "Dokážeme sporem, že v každém konečném grafu G = (V, E) s minimálním stupněm δ(G) ≥ 2 existuje jednoduchá cesta délky alespoň δ(G)." },
        { bold: "1. Konstrukce extremálního objektu:", text: "Zvolme v grafu G nejdelší jednoduchou cestu P = (v_0, v_1, v_2, …, v_k) délky k (počet hran je k)." },
        { bold: "2. Analýza koncového vrcholu v_k:", text: "Uvažujme sousedy koncového vrcholu v_k. Nemůže mít žádného souseda w ∉ P mimo cestu P (jinak bychom prodloužili cestu o w na délku k+1, což je spor s maximalitou P). Všichni sousedé vrcholu v_k tedy musí ležet na cestě P!" }
      ]
    },
    rightCard: {
      title: "3. Ocenění délky cesty & Závěr",
      badge: "DŮKAZ DOKONČEN",
      type: "emerald",
      items: [
        { bold: "3. Ocenění délky cesty:", text: "Jelikož deg(v_k) ≥ δ(G), vrchol v_k má alespoň δ(G) sousedů na cestě P." },
        { bold: "Rozložení vrcholů cesty:", text: "Protože vrcholy cesty jsou v_0, v_1, …, v_k, nejvzdálenější soused v_k musí být vzdálen alespoň δ(G) hran po cestě." },
        { bold: "Nerovnost pro délku k:", text: "Odtud délka cesty k splňuje: k ≥ δ(G)." },
        { bold: "4. Závěr:", text: "Tím je důkaz dokončen." }
      ]
    }
  });

  // 7B. Příklad 4.2: Rozbor Hodnocení (Rubrika)
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.2: Rozbor Hodnocení (Rubrika)",
    card: {
      title: "Rozbor Hodnocení (Rubrika)",
      badge: "HODNOCENÍ FIT",
      type: "neutral",
      items: [
        { bold: "100 % bodů:", text: "Výběr nejdelší jednoduché cesty P, odvození, že všichni sousedé koncového vrcholu v_k leží na P, algebraické srovnání s δ(G)." },
        { bold: "-40 % bodů:", text: "Nezdůvodnění, proč v_k nemůže mít souseda mimo cestu P." }
      ]
    }
  });

  // 8A. Příklad 4.3: Unikátnost Minimální Kostry (Předpoklad & Krok 1)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.3: Unikátnost MST (Předpoklad & Krok 1)",
    leftCard: {
      title: "Zadání & Předpoklad pro Spor",
      badge: "PŘEDPOKLAD PRO SPOR",
      type: "rose",
      items: [
        { bold: "Zadání:", text: "Dokážeme sporem, že pokud jsou všechny váhy hran v souvislém grafu G = (V, E, w) navzájem různé (unikátní), pak má graf G právě jednu (jednoznačnou) minimální kostru (MST)." },
        { bold: "1. Předpoklad pro spor:", text: "Předpokládejme pro spor, že graf G s unikátními vahami hran má dvě různé minimální kostry T_1 a T_2 (T_1 ≠ T_2) se stejnou minimální celkovou vahou w(T_1) = w(T_2)." }
      ]
    },
    rightCard: {
      title: "2. Krok 1 (Výběr Rozdílné Hrany)",
      badge: "NEJLEHČÍ HRANA",
      type: "warm",
      items: [
        { bold: "Symetrická diference:", text: "Množina hran, ve kterých se kostry liší, je E(T_1) △ E(T_2) ≠ ∅." },
        { bold: "Výběr nejlehčí hrany e:", text: "Zvolme nejlehčí hranu e = {u, v} ∈ E(T_1) △ E(T_2). Bez újmy na obecnosti nechť e ∈ T_1 a e ∉ T_2." }
      ]
    }
  });

  // 8B. Příklad 4.3: Unikátnost Minimální Kostry (Kroky 2–3 & Spor)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.3: Unikátnost MST (Cyklus & Spor)",
    leftCard: {
      title: "Krok 2 (Přidání e do T_2)",
      badge: "CYKLUS C",
      type: "warm",
      items: [
        { bold: "3. Krok 2 (Přidání e do T_2):", text: "Vytvořme cyklus C přidáním hrany e do T_2." },
        { bold: "Hrana e' mimo T_1:", text: "Cyklus C musí obsahovat alespoň jednu jinou hranu e', která nepatří do T_1." },
        { bold: "Srovnání vah:", text: "Z volby e jako nejlehčí rozdílné hrany plyne, že w(e) < w(e')." }
      ]
    },
    rightCard: {
      title: "Krok 3, Spor (⊥) & Závěr",
      badge: "💥 SPOR S MINIMALITOU",
      type: "emerald",
      items: [
        { bold: "4. Krok 3 (Rekonstrukce T_2'):", text: "Vytvořme novou kostru T_2' = (T_2 ∪ {e}) ∖ {e'}. Váha nové kostry je w(T_2') = w(T_2) + w(e) - w(e') < w(T_2)." },
        { bold: "5. 💥 SPOR (⊥):", text: "Našli jsme kostru T_2' s váhou přísně menší než minimální kostra T_2! To je SPOR s minimalitou T_2." },
        { bold: "6. Závěr:", text: "Minimální kostra s unikátními vahami je tedy jedinečná." }
      ]
    }
  });

  // 8C. Příklad 4.3: Rozbor Hodnocení (Rubrika)
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.3: Rozbor Hodnocení (Rubrika)",
    card: {
      title: "Rozbor Hodnocení (Rubrika)",
      badge: "HODNOCENÍ FIT",
      type: "neutral",
      items: [
        { bold: "100 % bodů:", text: "Správný výběr nejlehčí hranové symetrické diference e ∈ T_1 △ T_2, vložení do T_2, vznik cyklu a konstrukce T_2', spor w(T_2') < w(T_2)." },
        { bold: "-50 % bodů:", text: "Náhodný výběr hrany bez požadavku na nejlehčí hranu diference." }
      ]
    }
  });

  // 9A. Příklad 4.4: Počet Hran v Lese se c Komponentami (Zadání, Báze & IP)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.4: Počet Hran v Lese (Zadání & Báze)",
    leftCard: {
      title: "Zadání Úlohy",
      badge: "ZADÁNÍ",
      type: "warm",
      items: [
        { bold: "Dokazované tvrzení:", text: "Dokážeme dekonstrukční indukcí podle počtu hran m = |E|, že každý neorientovaný acyklický graf (les) G = (V, E) s n = |V| vrcholy a c komponentami souvislosti má přesně m = n - c hran." }
      ]
    },
    rightCard: {
      title: "1. Báze Indukce & 2. Indukční Předpoklad",
      badge: "BÁZE & IP",
      type: "emerald",
      items: [
        { bold: "1. Báze indukce (m = 0):", text: "Graf bez hran má n izolovaných vrcholů, tedy c = n komponent. Platí m = 0 = n - n = n - c. Báze pro m = 0 platí." },
        { bold: "2. Indukční předpoklad (IP):", text: "Předpokládejme, že pro každý les s k < m hranami platí vzorec k = n - c_k." }
      ]
    }
  });

  // 9B. Příklad 4.4: Počet Hran v Lese (Indukční Krok & Závěr)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.4: Počet Hran v Lese (Krok & Závěr)",
    leftCard: {
      title: "Dekonstrukce Odebráním Hrany e",
      badge: "DEKONSTRUKCE",
      type: "warm",
      items: [
        { bold: "Volba hrany e:", text: "Vezměme LIBOVOLNÝ les G s m hranami a c komponentami. Zvolme libovolnou hranu e = {u, v} ∈ E." },
        { bold: "Odebrání hrany:", text: "Odeberme hranu e a získáme podgraf G' = (V, E ∖ {e}) s m - 1 hranami." },
        { bold: "Rozpad komponenty:", text: "Protože G neobsahuje cykly, hrana e byla jediným spojením mezi u a v. Jejím odebráním se komponenta rozpadla na 2 nové komponenty! Počet komponent v G' je tedy c' = c + 1." }
      ]
    },
    rightCard: {
      title: "Aplikace IP & Závěr",
      badge: "IP & ZÁVĚR",
      type: "emerald",
      items: [
        { bold: "Aplikace IP na G':", text: "Aplikujeme IP na podgraf G': |E(G')| = n - c' ⇒ m - 1 = n - (c + 1) = n - c - 1." },
        { bold: "Algebraická úprava:", text: "Přičtením 1 k oběma stranám rovnosti dostáváme: m = n - c." },
        { bold: "4. Závěr:", text: "Les o n vrcholech a c komponentách má n - c hran." }
      ]
    }
  });

  // 9C. Příklad 4.4: Rozbor Hodnocení (Rubrika)
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.4: Rozbor Hodnocení (Rubrika)",
    card: {
      title: "Rozbor Hodnocení (Rubrika)",
      badge: "HODNOCENÍ FIT",
      type: "neutral",
      items: [
        { bold: "100 % bodů:", text: "Dekonstrukční odebrání hrany e, zdůvodnění změny počtu komponent c' = c + 1 díky acykličnosti, korektní algebra a IP." },
        { bold: "-30 % bodů:", text: "Opomenutí zdůvodnit, proč odebrání hrany v acyklickém grafu VŽDY zvýší počet komponent o 1." }
      ]
    }
  });

  // 10A. Příklad 4.5: Bipartitnost a Liché Cykly (Řešení)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.5: Bipartitnost a Liché Cykly",
    leftCard: {
      title: "Zadání, Předpoklad pro Spor & Krok 1",
      badge: "PŘEDPOKLAD PRO SPOR",
      type: "rose",
      items: [
        { bold: "Zadání:", text: "Dokážeme sporem, že pokud graf G = (V, E) obsahuje lichý cyklus C_k (délky k = 2r+1), pak graf G není bipartitní." },
        { bold: "1. Předpoklad pro spor:", text: "Předpokládejme pro spor, že graf G obsahuje lichý cyklus C = (v_1, v_2, …, v_k, v_1) a ZÁROVEŇ je bipartitní s rozložením V = V_1 ∪ V_2." },
        { bold: "2. Krok 1 (Alternace množin):", text: "Zařaďme v_1 ∈ V_1. Protože hrana {v_1, v_2} ∈ E spojuje V_1 s V_2, musí v_2 ∈ V_2. Obecně v_i ∈ V_1 ⇔ i je liché, a v_i ∈ V_2 ⇔ i je sudé." }
      ]
    },
    rightCard: {
      title: "Krok 2, Spor (⊥) & Závěr",
      badge: "💥 SPOR S BIPARTITNOSTÍ",
      type: "emerald",
      items: [
        { bold: "3. Krok 2 (Poslední vrchol):", text: "Jelikož k je liché číslo, platí v_k ∈ V_1." },
        { bold: "4. 💥 SPOR (⊥):", text: "Cyklus uzavírá hrana {v_k, v_1}. Oba její koncové vrcholy v_k ∈ V_1 i v_1 ∈ V_1 leží ve stejné množině V_1! To je v přímém SPORU s definicí bipartitního grafu!" },
        { bold: "5. Závěr:", text: "Bipartitní graf neobsahuje liché cykly." }
      ]
    }
  });

  // 10B. Příklad 4.5: Rozbor Hodnocení (Rubrika)
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.5: Rozbor Hodnocení (Rubrika)",
    card: {
      title: "Rozbor Hodnocení (Rubrika)",
      badge: "HODNOCENÍ FIT",
      type: "neutral",
      items: [
        { bold: "100 % bodů:", text: "Přesný předpoklad sporu, dokázání alternace prvků cyklu, odvození konfliktu na uzavírací hraně {v_k, v_1}." }
      ]
    }
  });

  // 11A. Příklad 4.6: Správnost BFS (Zadání, Invariant & Báze)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.6: Správnost BFS (Zadání & Báze)",
    leftCard: {
      title: "Zadání Úlohy",
      badge: "ZADÁNÍ",
      type: "warm",
      items: [
        { bold: "Dokazované tvrzení:", text: "Dokážeme invariantem cyklu, že ve FIFO frontě Q = ⟨v_1, v_2, …, v_r⟩ algoritmu BFS platí d[v_r] ≤ d[v_1] + 1." }
      ]
    },
    rightCard: {
      title: "1. Definice Invariantu & 2. Inicializace",
      badge: "DEFINICE & BÁZE",
      type: "blue",
      items: [
        { bold: "1. Definice Invariantu:", text: "V každé iteraci cyklu while platí ve frontě Q: d[v_r] ≤ d[v_1] + 1 a d[v_1] ≤ d[v_2] ≤ … ≤ d[v_r]." },
        { bold: "2. Inicializace:", text: "Na začátku Q = ⟨s⟩. d[s] = 0 ≤ 0 + 1. Invariant platí." }
      ]
    }
  });

  // 11B. Příklad 4.6: Správnost BFS (Udržování & Ukončení)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.6: Správnost BFS (Krok & Závěr)",
    leftCard: {
      title: "3. Udržování (Během Kroku Cyklu)",
      badge: "UDRŽOVÁNÍ",
      type: "blue",
      items: [
        { bold: "Předpoklad & Vyjmutí u:", text: "Předpokládejme, že invariant platí před vyjmutím u = v_1. Vyjmutím u z čela fronty zůstane posloupnost ⟨v_2, …, v_r⟩, která podmínku neporuší." },
        { bold: "Průchod sousedů:", text: "Procházíme sousedy v vrcholu u a vkládáme je s d[v] = d[u] + 1 na konec fronty." },
        { bold: "Zachování rozdílu 1:", text: "Jelikož na čele původní fronty bylo d[u] nebo d[u]+1, nově vkládané prvky na konec s hodnotou d[u]+1 zachovají maximální rozdíl 1 od nového čela. Invariant drží." }
      ]
    },
    rightCard: {
      title: "4. Ukončení & Závěr Korektnosti",
      badge: "KOREKTNOST",
      type: "emerald",
      items: [
        { bold: "4. Ukončení:", text: "Po skončení cyklu jsou všechny vzdálenosti správně určeny." }
      ]
    }
  });

  // 11C. Příklad 4.6: Rozbor Hodnocení (Rubrika)
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.6: Rozbor Hodnocení (Rubrika)",
    card: {
      title: "Rozbor Hodnocení (Rubrika)",
      badge: "HODNOCENÍ FIT",
      type: "neutral",
      items: [
        { bold: "100 % bodů:", text: "Všechny 3 fáze (Inicializace, Udržování, Ukončení), správný rozbor operací push a pop." }
      ]
    }
  });

  // 12. Závěr Kurzu: Gratulace
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "🎯 Závěr Letní Přípravy: Gratulujeme!",
    card: {
      title: "🎯 Gratulujeme! Dokončili jste kompletní letní 0-to-Hero přípravu pre-AG1!",
      badge: "HOTOVO! 🚀",
      type: "emerald",
      items: [
        { bold: "Úspěšné dokončení:", text: "Nyní máte veškerou matematickou jistotu i praktickou výbavu pro zvládnutí předmětu AG1 na FIT ČVUT! 🚀" }
      ]
    }
  });
}
