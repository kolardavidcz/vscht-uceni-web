/**
 * Module 8: Zkouškový Workshop & Šablony Důkazů z AG1
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide,
  createProofSlide
} from "../pptx_engine.mjs";

export function addModule8Slides(pres) {
  const breadcrumb = "8 · Zkouškový Workshop & Šablony Důkazů";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 8,
    title: "Zkouškový Workshop & Šablony Důkazů z AG1",
    goal: "Vybruslit ze všech nebezpečných úskalí u zkouškových písemek z předmětu AG1 na FIT ČVUT. Osvojit si 3 formální univerzální šablony důkazů a projít rozsáhlý workshop plně vyřešených zkouškových úloh s kompletním hodnoticím komentářem a bodovací rubrikou.",
    topics: [
      "Jak vyučující na FIT ČVUT opravují zkouškové písemky",
      "Co vás bude stát body (0 bodů) vs. Co zajistí plných 100 %",
      "Šablona 1: Dekonstrukční indukce podle počtu vrcholů či hran",
      "Šablona 2: Důkaz sporem (A ∧ ¬B ⇒ ⊥)",
      "Šablona 3: Správnost algoritmu pomocí invariantu cyklu",
      "Příklad 4.1: Rozklad sudého grafu na cykly (Dekonstrukční indukce)",
      "Příklad 4.2: Extremální princip & Nejdelší cesta (Důkaz sporem)",
      "Příklad 4.3: Unikátnost minimální kostry při různých vahách",
      "Příklad 4.4: Počet hran v lese se c komponentami (m = n - c)",
      "Příklad 4.5: Bipartitnost a liché cykly (Důkaz sporem)",
      "Příklad 4.6: Správnost BFS a nemonotónnost fronty",
      "Závěrečné gratulace k dokončení kompletního kurzu pre-AG1"
    ]
  });

  // 2. How FIT Graders Grade Proofs
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Jak Vyučující na FIT ČVUT Opravují Důkazy?",
    leftCard: {
      title: "Co Vás Bude Stát Body (Až 0 b)",
      badge: "ČASTÉ CHYBY",
      type: "rose",
      items: [
        { bold: "Redukční past u indukce:", text: "Začátek z G_n a přidání uzlu místo dekonstrukce z G_{n+1} (fatální chyba, 0 bodů!)." },
        { bold: "Chybějící ověření báze:", text: "Opomenutí nejmenšího bázového případu P(n₀)." },
        { bold: "Nejasný předpoklad sporu:", text: "Chybí explicitní zapsání negace závěru ¬B." },
        { bold: "Neoznačený rozpor:", text: "Neuvedení přesného místa a faktu, kde rozpor 💥 nastal." },
        { bold: "Neúplný invariant cyklu:", text: "Chybí jedna ze 3 fází (např. ukončení)." }
      ]
    },
    rightCard: {
      title: "Co Vám Zajistí Plný Počet Bodů (100 %)",
      badge: "PLNÝ ZISK BODŮ",
      type: "emerald",
      items: [
        { bold: "Dekonstrukční indukce:", text: "Start z libovolného zadaného G_{n+1} a redukce na podgraf G_n." },
        { bold: "Explicitní báze:", text: "Přesně zapsaný a ověřený základní krok P(n₀)." },
        { bold: "Přesný předpoklad sporu:", text: "Formulace 'Předpokládejme, že platí A a zároveň ¬B'." },
        { bold: "Jasný rozpor:", text: "Jednoznačně označený rozpor (💥 / SPOR) s konkrétní větou." },
        { bold: "Kompletní invariant:", text: "Všechny 3 fáze: Inicializace, Udržování, Ukončení." }
      ]
    }
  });

  // 3. Template 1: Deconstructive Induction
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Šablona 1: Dekonstrukční Indukce (n = |V| nebo m = |E|)",
    card: {
      title: "Univerzální Formulář pro Zkouškovou Písemku",
      badge: "ŠABLONA INDUKCE",
      type: "orange",
      items: [
        { bold: "1. BÁZE INDUKCE (n = n₀):", text: "Uvažujme nejmenší přípustný graf G₀ o n₀ vrcholech. Pro G₀ ověříme platnost dokazovaného tvrzení P(G₀). Báze platí." },
        { bold: "2. INDUKČNÍ PŘEDPOKLAD (IP):", text: "Předpokládejme, že tvrzení platí pro VŠECHNY grafy dané třídy o k vrcholech, kde n₀ ≤ k ≤ n." },
        { bold: "3. INDUKČNÍ KROK (n ➔ n + 1):", text: "Nechť G = (V, E) je LIBOVOLNÝ ZADANÝ graf o n + 1 vrcholech. Zvolíme vhodný prvek v (list, uzel minimálního stupně) a odebereme ho: G' = G \\ {v}." },
        { bold: "4. APLIKACE IP:", text: "Ověříme, že podgraf G' má n vrcholů a STÁLE SPLŇUJE všechny předpoklady věty. Použijeme IP na podgraf G'." },
        { bold: "5. ZÁVĚREČNÝ NÁVRAT:", text: "Vrátíme odebraný prvek v a dokážeme, že platnost tvrzení se přenese na původní graf G. Q.E.D." }
      ]
    }
  });

  // 4. Template 2: Proof by Contradiction
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Šablona 2: Důkaz Sporem (A ∧ ¬B ⇒ ⊥)",
    card: {
      title: "Univerzální Formulář pro Důkaz Sporem",
      badge: "ŠABLONA SPOREM",
      type: "rose",
      items: [
        { bold: "1. PŘEDPOKLAD PRO SPOR:", text: "'Předpokládejme pro spor, že platí předpoklad A a ZÁROVEŇ NEPLATÍ závěr B (tedy platí ¬B).'" },
        { bold: "2. LOGICKÉ ODVOZOVÁNÍ:", text: "'Z platnosti ¬B plyne vlastnost X. Z vlastnosti X a předpokladu A odvodíme vlastnost Y...'" },
        { bold: "3. DOSAŽENÍ SPORU (💥 / ⊥):", text: "'Vlastnost Y je však v přímém SPORU s [Definicí Z / Předpokladem A / Dokázanou větou]!'" },
        { bold: "4. ZÁVĚR DŮKAZU:", text: "'Náš předpoklad pro spor (A ∧ ¬B) byl tedy chybný. Proto původní tvrzení A ⇒ B platí. Q.E.D.'" }
      ]
    }
  });

  // 5. Template 3: Loop Invariant
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Šablona 3: Správnost Algoritmu Pomocí Invariantu Cyklu",
    card: {
      title: "Formulář pro Analýzu Algoritmů (BFS, Dijkstra, DFS)",
      badge: "INVARIANT CYKLU",
      type: "blue",
      items: [
        { bold: "1. DEFINICE INVARIANTU:", text: "Definujeme invariant I: přesná logická vlastnost datových struktur a proměnných v každé iteraci." },
        { bold: "2. INICIALIZACE (Krok 0):", text: "Dokážeme, že invariant I platí před spuštěním první iterace cyklu (např. prázdné množiny, startovní uzel ve vzdálenosti 0)." },
        { bold: "3. UDRŽOVÁNÍ (i-tý krok):", text: "Předpokládáme, že I platí před i-tou iterací. Provedeme tělo cyklu a dokážeme, že po provedení operací invariant I stále drží." },
        { bold: "4. UKONČENÍ (Závěr):", text: "Cyklus se zastaví při splnění ukončovací podmínky C. Spojení invariantu I a podmínky C dokazuje správnost výsledku. Q.E.D." }
      ]
    }
  });

  // 6. Problem 4.1: Even Graph Decomposition into Cycles
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.1: Rozklad Sudého Grafu na Cykly",
    leftCard: {
      title: "Zadání Úlohy",
      badge: "INDUKCE PODLE |E|",
      type: "orange",
      items: [
        { bold: "Zadání věty:", text: "Dokážeme indukcí podle počtu hran m = |E|, že každý souvislý graf G se sudými stupni (∀v: deg(v) ≥ 2 je sudé) lze rozložit na hranově disjunktní cykly." },
        { bold: "Báze (m = 3):", text: "Nejmenší takový graf je trojúhelník K₃ (n = 3, m = 3). Sám tvoří 1 cyklus, tvrzení platí." },
        { bold: "Indukční předpoklad (IP):", text: "Každý graf s k < m hranami plnící sudost stupňů lze rozložit na hranově disjunktní cykly." }
      ]
    },
    rightCard: {
      title: "Dekonstrukční Krok & Závěr",
      badge: "DŮKAZ KROKU",
      type: "emerald",
      items: [
        { bold: "1. Libovolný graf G(m):", text: "Protože deg(v) ≥ 2, graf obsahuje alespoň jeden jednoduchý cyklus C." },
        { bold: "2. Odebrání cyklu:", text: "Odebereme hrany cyklu C: G' = (V, E \\ E(C)). Každému vrcholu cyklu klesl stupeň přesně o 2 ➔ stupně v G' zůstávají sudé!" },
        { bold: "3. Aplikace IP:", text: "Podgraf G' má m - |E(C)| < m hran. Dle IP lze jeho komponenty rozložit na disjunktní cykly." },
        { bold: "4. Závěr:", text: "Přidáním cyklu C zpět máme kompletní rozklad grafu G." }
      ]
    }
  });

  // 7. Problem 4.1 Rubric
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Rozbor Hodnocení: Příklad 4.1",
    leftCard: {
      title: "Bodovací Kritérium Opravujících",
      badge: "BODOVÁ RUBRIKA",
      type: "emerald",
      items: [
        { bold: "100 % bodů:", text: "Libovolný graf G(m), dekonstrukce odebráním cyklu C, explicitní ověření sudosti stupňů v G', korektní aplikace IP." },
        { bold: "-30 % bodů:", text: "Zapomenutí zdůvodnit, že odebrání cyklu C zachovává sudost všech stupňů (pokles o 2)." },
        { bold: "0 bodů (Redukční past):", text: "Začátek z menšího grafu a přidávání hran nového cyklu zdola nahoru!" }
      ]
    },
    rightCard: {
      title: "Zkoušková Rada pro Příklad 4.1",
      badge: "DOPORUČENÍ",
      type: "blue",
      items: [
        { bold: "Pozor na komponenty:", text: "Odebráním cyklu C se graf může rozpadnout na více komponent souvislosti. Indukční předpoklad aplikujeme na každou komponentu zvlášť." },
        { bold: "Izolované vrcholy:", text: "Vrcholy se stupněm 0 po odebrání cyklu ignorujeme (neobsahují žádné hrany)." }
      ]
    }
  });

  // 8. Problem 4.2: Extremal Principle & Longest Path
  createProofSlide(pres, {
    breadcrumb,
    title: "Příklad 4.2: Extremální Princip – Cesta Délky ≥ δ(G)",
    statement: "V každém konečném grafu G s minimálním stupněm δ(G) ≥ 2 existuje jednoduchá cesta délky alespoň δ(G).",
    steps: [
      { bold: "1. Volba extremálního objektu:", text: "Zvolme v grafu G nejdelší jednoduchou cestu P = (v₀, v₁, ..., v_k) délky k hran. V konečném grafu taková cesta existuje." },
      { bold: "2. Rozbor sousedů konce v_k:", text: "Koncový vrchol v_k nemůže mít souseda w ∉ P mimo cestu (jinak bychom prodloužili cestu o w na délku k+1, spor s maximalitou P). Všichni sousedé v_k leží na P." },
      { bold: "3. Ocenění počtu sousedů:", text: "Z předpokladu má v_k alespoň δ(G) sousedů. Protože všichni leží na cestě P mezi vrcholy v₀, ..., v_{k-1}, musí jich být na cestě alespoň δ(G)." },
      { bold: "4. Závěr o délce cesty:", text: "Nejvzdálenější soused vrcholu v_k na cestě musí být vzdálen alespoň δ(G) kroků. Odtud délka cesty splňuje k ≥ δ(G). Q.E.D." }
    ]
  });

  // 9. Problem 4.3: MST Uniqueness
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.3: Unikátnost Minimální Kostry (MST)",
    leftCard: {
      title: "Zadání & Předpoklad pro Spor",
      badge: "RŮZNÉ VÁHY HRAN",
      type: "orange",
      items: [
        { bold: "Tvrzení:", text: "Pokud jsou všechny váhy hran v souvislém grafu G různé, pak má graf právě jednu minimální kostru." },
        { bold: "Předpoklad pro spor:", text: "Předpokládejme, že existují dvě různé minimální kostry T₁ ≠ T₂ se stejnou minimální vahou w(T₁) = w(T₂)." },
        { bold: "Výběr nejlehčí rozdílné hrany:", text: "Uvažujme symetrickou diferenci E(T₁) △ E(T₂). Zvolme v ní hranu e s nejmenší vahou. Nechť e ∈ T₁ a e ∉ T₂." }
      ]
    },
    rightCard: {
      title: "Vznik Cyklu a Dosažení Sporu",
      badge: "💥 SPOR S MINIMALITOU",
      type: "rose",
      items: [
        { bold: "Přidání hrany e do T₂:", text: "Přidáním e do kostry T₂ vznikne právě jeden cyklus C." },
        { bold: "Existence hrany e' ∉ T₁:", text: "Cyklus C musí obsahovat jinou hranu e' ∉ T₁. Z volby e jako nejlehčí rozdílné hrany plyne: w(e) < w(e')." },
        { bold: "Nová kostra T₂':", text: "T₂' = (T₂ ∪ {e}) \\ {e'}. Váha: w(T₂') = w(T₂) + w(e) - w(e') < w(T₂)." },
        { bold: "Spor (💥):", text: "Našli jsme kostru lehčí než minimální kostra T₂! MST je tedy unikátní." }
      ]
    }
  });

  // 10. Problem 4.4: Forest Edges Formula (m = n - c)
  createProofSlide(pres, {
    breadcrumb,
    title: "Příklad 4.4: Počet Hran v Lese se c Komponentami",
    statement: "Každý les G = (V, E) s n vrcholy a c komponentami souvislosti má přesně m = n - c hran.",
    steps: [
      { bold: "1. Báze indukce (m = 0):", text: "Les bez hran má n izolovaných vrcholů, tedy c = n komponent. Rovnost m = n - c dává: 0 = n - n. Báze bezchybně platí." },
      { bold: "2. Indukční předpoklad (IP):", text: "Předpokládejme, že pro každý les s k < m hranami platí rovnost k = n - c_k." },
      { bold: "3. Odebrání hrany (Dekonstrukce):", text: "Vezměme libovolný les s m hranami. Zvolme hranu e = {u, v} a odeberme ji: G' = (V, E \\ {e})." },
      { bold: "4. Zvýšení počtu komponent:", text: "Protože v lese nejsou cykly, hrana e byla jediným spojením mezi u a v. Jejím odebráním se komponenta rozpadne na dvě: c' = c + 1." },
      { bold: "5. Aplikace IP a závěr:", text: "Podgraf G' má m - 1 hran. Dle IP: m - 1 = n - c' = n - (c + 1) = n - c - 1. Přičtením 1 dostáváme m = n - c. Q.E.D." }
    ]
  });

  // 11. Problem 4.5: Bipartite Graphs and Odd Cycles
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.5: Bipartitnost a Liché Cykly",
    leftCard: {
      title: "Předpoklad pro Spor",
      badge: "DŮKAZ SPOREM",
      type: "orange",
      items: [
        { bold: "Tvrzení věty:", text: "Pokud graf G obsahuje lichý cyklus C_k (délky k = 2r + 1), pak graf G nemůže být bipartitní." },
        { bold: "Předpoklad pro spor:", text: "Předpokládejme, že G obsahuje lichý cyklus C = (v₁, v₂, ..., v_k, v₁) a ZÁROVEŇ je bipartitní s rozkladem V = V₁ ∪ V₂." },
        { bold: "Definice bipartitnosti:", text: "Každá hrana spojuje vrchol z V₁ s vrcholem z V₂. Žádná hrana nevede uvnitř V₁ ani uvnitř V₂." }
      ]
    },
    rightCard: {
      title: "Alternace a Kolize na Uzavírací Hraně",
      badge: "💥 SPOR S BIPARTITNOSTÍ",
      type: "rose",
      items: [
        { bold: "Alternace množin podél cyklu:", text: "Nechť v₁ ∈ V₁. Pak nutně v₂ ∈ V₂, v₃ ∈ V₁, obecně v_i ∈ V₁ pro lichá i a v_i ∈ V₂ pro sudá i." },
        { bold: "Zařazení koncového uzlu:", text: "Protože délka cyklu k je liché číslo, koncový vrchol v_k nutně leží v množině V₁!" },
        { bold: "Uzavírací hrana {v_k, v₁}:", text: "Tato hrana spojuje dva vrcholy ze stejné množiny (v_k ∈ V₁ i v₁ ∈ V₁)." },
        { bold: "Spor (💥):", text: "Hrana uvnitř partity je přímý spor s bipartitností. Graf s lichým cyklem není bipartitní." }
      ]
    }
  });

  // 12. Problem 4.6: BFS Correctness via Loop Invariant
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 4.6: Správnost BFS a Invariant Fronty",
    leftCard: {
      title: "Definice Invariantu Fronty",
      badge: "FIFO FRONTA Q",
      type: "blue",
      items: [
        { bold: "Invariant I:", text: "Ve frontě Q = ⟨v₁, v₂, ..., v_r⟩ v každém okamžiku platí: d[v_r] ≤ d[v₁] + 1 a hodnoty jsou nelesknoucí: d[v₁] ≤ d[v₂] ≤ ... ≤ d[v_r]." },
        { bold: "Význam invariantu:", text: "Vzdálenosti prvků ve frontě se liší nanejvýš o 1. Fronta zpracovává uzly striktně po vrstvách vzdálenosti!" },
        { bold: "Inicializace:", text: "Na začátku Q = ⟨s⟩. Platí d[s] ≤ d[s] + 1 (0 ≤ 1). Invariant bezchybně drží." }
      ]
    },
    rightCard: {
      title: "Udržování při Operacích Push a Pop",
      badge: "KROK CYKLU",
      type: "emerald",
      items: [
        { bold: "Operace Pop (vyjmutí u = v₁):", text: "Odebráním čela zůstane monotónní posloupnost ⟨v₂, ..., v_r⟩, rozdíl krajů se nezvětší." },
        { bold: "Operace Push souseda v:", text: "Soused v je vložen s hodnotou d[v] = d[u] + 1. Protože v novém čele je hodnota d[u] nebo d[u] + 1, nový konec se od nového čela liší nanejvýš o 1!" },
        { bold: "Ukončení cyklu:", text: "Po vyprázdnění fronty jsou všechny dosažitelné uzly ohodnoceny minimální vzdáleností." }
      ]
    }
  });

  // 13. Congratulations and Final Overview
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Gratulujeme! Dokončili Jste Přípravu Pre-AG1",
    card: {
      title: "0-to-Hero Příprava na Zkoušku z AG1",
      badge: "HOTOVO! 🚀",
      type: "emerald",
      items: [
        { bold: "8 Kompletních Modulů:", text: "Prošli jste celou cestu od STL kontejnerů a rychlého I/O v PA2 až po formální důkazy dekonstrukcí, sporem a invarianty." },
        { bold: "Bezpečí před redukční pastí:", text: "Víte, proč se grafy rozebírají shora dolů (G_{n+1} ➔ G_n) a jak odůvodnit zachování vlastností podgrafu." },
        { bold: "Matematická suverenita:", text: "Dirichletův princip, extremální výběr nejdelší cesty a formální logika jsou nyní vašimi přirozenými nástroji." },
        { bold: "Výbava pro semestr:", text: "Máte dokonalý náskok před ostatními studenty. Hodně štěstí u zápočtových úloh v Progtestu i u zkoušky z AG1 na FIT ČVUT!" }
      ]
    }
  });
}
