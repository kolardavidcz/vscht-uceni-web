/**
 * Module 6: Důkazy Sporem & Extremální Princip
 * Source: src/features/bioinformatics/content/3-semestr/pre-ag1/dml-dukazy-sporem.md
 * Exact 1:1 text fidelity with website markdown.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide
} from "../pptx_engine.mjs";

export function addModule6Slides(pres) {
  const breadcrumb = "6 · Důkazy Sporem & Extremální Princip";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 6,
    title: "Důkazy Sporem & Extremální Princip",
    goal: "Cíl kapitoly: Naučit se elegantní techniku důkazu, kde místo přímého dokazování ukážeš, že opak by vedl k nesmyslu.",
    topics: [
      "🕵️ Detektivní přístup k matematice (Sherlock Holmes)",
      "1. Logická Podstata Důkazu Sporem (A ∧ ¬B ⇒ ⊥)",
      "2. Šablona Zápisu Důkazu Sporem u Zkoušky AG1",
      "3. 🐦 Dirichletův princip v Teorii Grafů (Pigeonhole Principle)",
      "Příklad 1: Dva vrcholy se stejným stupněm v každém grafu",
      "Příklad 2: Cesta délky n v grafu o n vrcholech nutně tvoří cyklus",
      "4. 🔬 Extremální Princip v Grafech — Krok za Krokem",
      "Pracovaný příklad 1: Pokud δ(G) ≥ 2, pak G obsahuje cyklus",
      "Pracovaný příklad 2: Nejkratší cesta s nezápornými vahami neobsahuje cyklus",
      "Konstruktivní vs. Nekonstruktivní existence v informatice",
      "Procvičovací úlohy: Stupeň Δ(G) ≤ 2 a Zdroj v DAGu"
    ]
  });

  // 2. Sherlock Holmes & Birthday Example
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "🕵️ Detektivní Přístup k Matematice",
    leftCard: {
      title: "Sherlock Holmes a Důkaz Sporem",
      badge: "PRINCIP",
      type: "neutral",
      items: [
        { bold: "Sherlock Holmes říká:", text: "„Když vyloučíš vše nemožné, co zbude — i kdyby to bylo sebenepravděpodobnější — musí to být pravda.“" },
        { bold: "1. Krok:", text: "Chceš dokázat, že tvrzení B platí." },
        { bold: "2. Krok:", text: "Předpokládej, že B neplatí (tedy předpokládej opak)." },
        { bold: "3. Krok:", text: "Z tohoto předpokladu logicky odvoď nesmysl — něco, co je zjevně nepravdivé (spor s tím, co víš)." },
        { bold: "4. Krok:", text: "Protože opak B vedl k nesmyslu, B musí platit." }
      ]
    },
    rightCard: {
      title: "Příklad z Reálného Světa: 13 Lidí a Měsíce",
      badge: "PŘÍKLAD",
      type: "warm",
      items: [
        { bold: "Zadání:", text: "Chceš dokázat, že v místnosti s 13 lidmi musí aspoň dva sdílet narozeninový měsíc." },
        { bold: "Předpoklad opaku:", text: "Každý má jiný měsíc." },
        { bold: "Dosažení sporu:", text: "Ale měsíců je jen 12. To je spor — 13 lidí se do 12 měsíců nevejde jeden do každého." },
        { bold: "Závěr:", text: "Předpoklad byl špatný, takže dva lidi sdílí měsíc. ✅" },
        { bold: "Intuice bez vzorce:", text: "Důkaz sporem = „řeknu opak, a pak ukážu, proč to nemůže být pravda.“" }
      ]
    }
  });

  // 3. Section 1: Logická Podstata Důkazu Sporem
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Logická Podstata Důkazu Sporem",
    leftCard: {
      title: "Princip Důkazu Sporem",
      badge: "LOGICKÝ PRINCIP",
      type: "neutral",
      items: [
        { bold: "Negace implikace:", text: "¬(A ⇒ B) ≡ (A ∧ ¬B)." },
        { bold: "Princip:", text: "Chceme-li dokázat, že platí implikace A ⇒ B, předpokládáme její negaci (tj. předpokládáme, že předpoklad A platí a ZÁROVEŇ závěr B neplatí)." },
        { bold: "Odvození sporu:", text: "Pokud z tohoto spojení posloupností platných matematických kroků odvodíme spor (rozpor / ⊥) s definicí, předpokladem A nebo dříve dokázaným faktem, pak náš předpoklad pro spor nemohl platit a původní tvrzení A ⇒ B je pravdivé!" }
      ]
    },
    rightCard: {
      title: "Schéma Myšlenkového Toku",
      badge: "SCHÉMA",
      type: "warm",
      items: [
        { bold: "1. Východisko:", text: "Předpoklad A  ∧  Negovaný závěr ¬B." },
        { bold: "2. Dedukce:", text: "Logické odvozování krok za krokem." },
        { bold: "3. 💥 SPOR:", text: "Rozpor s faktem, definicí nebo A = 1." },
        { bold: "4. ZÁVĚR:", text: "Náš předpoklad ¬B byl chybný, tedy platí B!" }
      ]
    }
  });

  // 4. Section 2: Šablona Zápisu Důkazu Sporem
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "2. Šablona Zápisu Důkazu Sporem u Zkoušky AG1",
    cardTitle: "Formální Šablona Zápisu Důkazu Sporem",
    badge: "ZKOUŠKOVÁ ŠABLONA",
    type: "warm",
    items: [
      { bold: "1. PŘEDPOKLAD PRO SPOR:", text: "„Předpokládejme pro spor, že platí předpoklad A a ZÁROVEŇ NEPLATÍ závěr B (platí ¬B).“" },
      { bold: "2. LOGICKÉ ODVOZOVÁNÍ:", text: "„Z platnosti ¬B plyne vlastnost X… Z vlastnosti X a předpokladu A odvodíme vlastnost Y…“" },
      { bold: "3. DOSAŽENÍ SPORU (⚡ / 💥 / ⊥):", text: "„To je ale SPOR (⚡) s [definicí Z / předpokladem A / dokázanou větou]!“" },
      { bold: "4. ZÁVĚR:", text: "„Proto náš předpoklad pro spor nemohl platit, a tedy původní tvrzení A ⇒ B platí. Q.E.D.“" }
    ]
  });

  // 5. Section 3: Dirichletův Princip v Teorii Grafů
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3. 🐦 Dirichletův Princip v Teorii Grafů",
    leftCard: {
      title: "Znění Dirichletova Principu",
      badge: "PIGEONHOLE PRINCIPLE",
      type: "neutral",
      items: [
        { bold: "Definice:", text: "Pokud máme n předmětů (holubů) a chceme je umístit do k přihrádek (škatułek), přičemž počet předmětů je větší než počet přihrádek (n > k), pak alespoň v jedné přihrádce musí skončit dva nebo více předmětů." },
        { bold: "Schéma kolize:", text: "5 holubů do 4 škatulek ➔ Kolize je NEVYHNUTELNÁ!" }
      ]
    },
    rightCard: {
      title: "Proč to Funguje? (Důkaz Sporem)",
      badge: "DŮKAZ ZA 10 SEKUND",
      type: "warm",
      items: [
        { bold: "Předpokládejme opak:", text: "V každé z k přihrádek je nanejvýš 1 holub." },
        { bold: "Počet holubů:", text: "Pak celkový počet holubů je nejvýše 1 × k = k." },
        { bold: "Okamžitý SPOR:", text: "My však máme n > k holubů, což je okamžitý SPOR!" },
        { bold: "Závěr:", text: "Opak tedy nemůže platit a alespoň v jedné přihrádce musí být alespoň dva holubi." }
      ]
    }
  });

  // 6. Příklad 1: Dva vrcholy se stejným stupněm
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 1: Dva Vrcholy se Stejným Stupněm",
    leftCard: {
      title: "Věta a Identifikace Holubů a Škatułek",
      badge: "VĚTA",
      type: "warm",
      items: [
        { bold: "Věta:", text: "V každém jednoduchém neorientovaném grafu G = (V, E) s n ≥ 2 vrcholy vždy existují alespoň dva vrcholy se stejným stupněm." },
        { bold: "1. Kdo jsou „holubi“?:", text: "Holubi jsou vrcholy grafu. Máme jich celkem n (označme je v₁, v₂, …, vn)." },
        { bold: "2. Co jsou „škatulky“?:", text: "Škatulky jsou možné hodnoty stupňů vrcholů deg(v). Minimální stupeň je 0 (izolovaný vrchol), maximální stupeň je n - 1 (spojen se všemi ostatními). Teoreticky stupně z {0, 1, 2, …, n - 1} = celkem n různých možných stupňů." }
      ]
    },
    rightCard: {
      title: "Klíčový Grafový Trik: Vzájemné Vyloučení",
      badge: "VZÁJEMNÉ VYLOUČENÍ",
      type: "rose",
      items: [
        { bold: "Může existovat 0 i n - 1 současně?:", text: "Předpokládejme pro spor, že ano." },
        { bold: "Rozbor:", text: "Nechť vrchol u má stupeň n - 1 (je spojen s úplně všemi). Nechť vrchol w má stupeň 0 (není spojen s vůbec nikým). Ale u musí být spojen i s w! Hrana {u, w} tedy nutně existuje." },
        { bold: "SPOR:", text: "Tím pádem má vrchol w stupeň alespoň 1, což je SPOR s tím, že má stupeň 0! Hodnoty 0 a n - 1 se vzájemně vylučují a nemohou se v tomtéž grafu potkat!" }
      ]
    }
  });

  // 7. Příklad 1: Aplikace Dirichleta a PPI interpretace
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 1: Aplikace Dirichleta a Bio Interpretace",
    leftCard: {
      title: "4. Aplikace Dirichletova Principu",
      badge: "DIRICHLET",
      type: "emerald",
      items: [
        { bold: "Dvě situace v libovolném grafu:", text: "Nastává právě jedna ze dvou situací:" },
        { bold: "Situace A (Obsahuje izolovaný vrchol):", text: "Pak v grafu není žádný vrchol stupně n - 1. Možné hodnoty stupňů jsou pouze z množiny {0, 1, 2, …, n - 2}. To je přesně n - 1 škatułek." },
        { bold: "Situace B (Neobsahuje izolovaný vrchol):", text: "Pak všechny vrcholy mají stupeň alespoň 1. Možné hodnoty stupňů jsou z množiny {1, 2, …, n - 1}. To je opět přesně n - 1 škatułek." },
        { bold: "Závěr:", text: "Máme n vrcholů (holubů) a nanejvýš n - 1 možných stupňů (škatułek). Protože n > n - 1, alespoň dva vrcholy sdílí stejný stupeň!" }
      ]
    },
    rightCard: {
      title: "Bioinformatická Interpretace (PPI Síť)",
      badge: "BIOINFORMATIKA",
      type: "warm",
      items: [
        { bold: "V proteinové síti:", text: "V protein-proteinové interakční síti (PPI síť) o n proteinech vždy existují alespoň dva proteiny, které mají navlas stejný počet interakčních partnerů." },
        { bold: "Vizuální znázornění pro n = 4:", text: "Vrcholy A, B, C, D padají do škatułek deg 1, deg 2, deg 3. Kolize je nevyhnutelná — např. vrcholy B a C mají shodně stupeň 2!" }
      ]
    }
  });

  // 8. Příklad 2: Cesta délky n v grafu o n vrcholech nutně tvoří cyklus
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 2: Trasa Délky n Nutně Tvoří Cyklus",
    leftCard: {
      title: "Tvrzení a Rozbor",
      badge: "ORIENTOVANÝ SLED",
      type: "neutral",
      items: [
        { bold: "Tvrzení:", text: "Pokud v grafu G = (V, E) o n vrcholech existuje orientovaná posloupnost kroků (sled) procházející n hranami, pak tato posloupnost nutně obsahuje alespoň jeden cyklus (smyčku)." },
        { bold: "1. Kdo jsou holubi?:", text: "Sled délky n hran navštíví celkem n + 1 vrcholů (u₀ ➔ u₁ ➔ … ➔ un). Naši holubi jsou navštívené pozice na trase: máme jich n + 1." },
        { bold: "2. Co jsou škatulky?:", text: "Naše škatulky jsou skutečné existující vrcholy grafu: máme jich jen n (V = {v₁, …, vn})." }
      ]
    },
    rightCard: {
      title: "Vznik Cyklu a Algoritmický Význam",
      badge: "VZNIK CYKLU",
      type: "emerald",
      items: [
        { bold: "Dirichletova kolize:", text: "Dle Dirichletova principu (n+1 > n) musel být alespoň jeden vrchol grafu navštíven alespoň dvakrát: u_i = u_j pro nějaké 0 ≤ i < j ≤ n." },
        { bold: "Uzavřený cyklus:", text: "Úsek trasy mezi těmito indexy tvoří uzavřený cyklus: (u_i ➔ u_{i+1} ➔ … ➔ u_j = u_i)." },
        { bold: "Algoritmický význam:", text: "Toto je teoretický základ pro Floydův algoritmus detekce cyklů (želva a zajíc) i pro důkaz korektnosti Bellman-Fordova algoritmu (nejdelší jednoduchá cesta má nanejvýš n - 1 hran)." }
      ]
    }
  });

  // 9. Section 4: Extremální Princip v Grafech
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "4. 🔬 Extremální Princip v Grafech",
    leftCard: {
      title: "Definice Extremálního Principu",
      badge: "EXTREMÁLNÍ PRINCIP",
      type: "warm",
      items: [
        { bold: "Extremální princip:", text: "Když chceš najít spor, zvolíme extrémní objekt (např. nejdelší jednoduchou cestu P_max, nejmenší cyklus, vrchol s maximálním či minimálním stupněm nebo nejlehčí hranu) a zkoumáme, co z jeho extremality plyne." },
        { bold: "Klíčová myšlenka:", text: "Extrémní objekt už z principu nemůže mít vlastnost, která by ho ještě více zvětšila či zmenšila (jinak by existoval ještě extrémnější, což je spor s jeho volbou). To nám dá okamžitý a čistý spor." }
      ]
    },
    rightCard: {
      title: "Pracovaný Příklad 1: Zadání",
      badge: "ZADÁNÍ PŘÍKLADU",
      type: "neutral",
      items: [
        { bold: "Tvrzení:", text: "Nechť G = (V, E) je konečný neorientovaný graf s minimálním stupněm δ(G) ≥ 2. Pak G obsahuje alespoň jeden cyklus." },
        { bold: "Konkrétní příklad pro ilustraci:", text: "Uvažuj graf s vrcholy {1, 2, 3, 4, 5} a hranami tak, že každý vrchol má stupeň alespoň 2. Zde každý vrchol má stupeň 2. Cyklus 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ 1 zjevně existuje. Jak to dokázat obecně pro libovolný takový graf?" }
      ]
    }
  });

  // 10. Pracovaný příklad 1: Kroky 1 až 3
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Důkaz Extremálním Principem: Kroky 1 až 3",
    leftCard: {
      title: "Krok 1 & Krok 2",
      badge: "NEJDELŠÍ CESTA",
      type: "neutral",
      items: [
        { bold: "Krok 1 — Nejdelší jednoduchá cesta:", text: "Nechť P = (v₀, v₁, v₂, …, vk) je nejdelší jednoduchá cesta v grafu G. (Takový extremální objekt v konečném grafu zaručeně existuje)." },
        { bold: "Krok 2 — Zkoumáme krajní vrchol v₀:", text: "Stupeň deg(v₀) ≥ 2 (z předpokladu δ(G) ≥ 2). Vrchol v₀ tedy má alespoň 2 sousedy." }
      ]
    },
    rightCard: {
      title: "Krok 3 — Sousedé v₀ Musí Být na Cestě P",
      badge: "SPOR S MAXIMALITOU",
      type: "rose",
      items: [
        { bold: "Předpokládejme pro spor:", text: "že v₀ má souseda u ∉ {v₁, v₂, …, vk} (mimo cestu P)." },
        { bold: "Delší cesta:", text: "Pak (u, v₀, v₁, …, vk) je jednoduchá cesta délky k+1 — delší než P." },
        { bold: "💥 SPOR:", text: "To je SPOR s maximalitou cesty P! Tedy všichni sousedé v₀ leží přímo na cestě P: v₀ sousedí pouze s vrcholy v₁, v₂, …, vk." }
      ]
    }
  });

  // 11. Pracovaný příklad 1: Krok 4 a Tracování
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Důkaz Extremálním Principem: Cyklus a Tracování",
    leftCard: {
      title: "Krok 4 — Nalezení Cyklu",
      badge: "CYKLUS",
      type: "emerald",
      items: [
        { bold: "Analýza sousedů:", text: "Víme, že v₀ má alespoň 2 sousedy a všichni leží na P. Jeden soused je v₁ (hrana {v₀, v₁} je součástí P). Druhý soused vj (pro j ≥ 2) dává hranu {v₀, vj}." },
        { bold: "Vznik cyklu:", text: "Hrana {v₀, vj} spolu s úsekem cesty v₀, v₁, …, vj tvoří cyklus: v₀ ➔ v₁ ➔ v₂ ➔ … ➔ vj ➔ v₀." },
        { bold: "Závěr:", text: "G obsahuje cyklus." }
      ]
    },
    rightCard: {
      title: "Tracování na Grafu s 5 Vrcholy",
      badge: "TRACENÍ",
      type: "neutral",
      items: [
        { bold: "Graf:", text: "V = {1, 2, 3, 4, 5}, hrany {1,2}, {2,3}, {3,4}, {4,5}, {5,1}, {1,3}. Každý uzel má stupeň ≥ 2." },
        { bold: "1. Nejdelší cesta:", text: "Zvolme např. P = (2, 1, 5, 4, 3) o délce 4." },
        { bold: "2. Krajní vrchol v₀ = 2:", text: "Sousedé vrcholu 2 jsou {1, 3}. Oba leží na P (1 je v₁, 3 je v₄)." },
        { bold: "3. Nalezený cyklus:", text: "Hrana {2, 3} + úsek cesty 2 ➔ 1 ➔ 5 ➔ 4 ➔ 3 dává cyklus 2 ➔ 1 ➔ 5 ➔ 4 ➔ 3 ➔ 2 délky 5." }
      ]
    }
  });

  // 12. Pracovaný příklad 2: Nejkratší cesta s nezápornými vahami
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Pracovaný Příklad 2: Nejkratší Cesta Neobsahuje Cyklus",
    leftCard: {
      title: "Věta a Předpoklad pro Spor",
      badge: "VĚTA",
      type: "neutral",
      items: [
        { bold: "Věta:", text: "V grafu G = (V, E, w) s nezápornými vahami (w(e) ≥ 0) neobsahuje žádná nejkratší cesta z s do t žádný cyklus." },
        { bold: "1. Předpoklad pro spor:", text: "Předpokládejme pro spor, že nejkratší cesta P z s do t obsahuje cyklus C." },
        { bold: "2. Rozklad na úseky:", text: "s ──(P₁)──> u ──(C)──> u ──(P₂)──> t. Celková váha je w(P) = w(P₁) + w(C) + w(P₂)." }
      ]
    },
    rightCard: {
      title: "Odvození Sporu Vynecháním Cyklu",
      badge: "SPOR",
      type: "rose",
      items: [
        { bold: "3. Nová cesta P':", text: "Vynecháním cyklu C získáme novou cestu P': s ──(P₁)──> u ──(P₂)──> t." },
        { bold: "4. Nezápory vah:", text: "Protože váhy jsou nezáporné, platí w(C) ≥ 0." },
        { bold: "Případ w(C) > 0:", text: "Pak w(P') < w(P), což je SPOR s tím, že P byla nejkratší." },
        { bold: "Případ w(C) = 0:", text: "Nová cesta P' má stejnou váhu, ale striktně méně hran — což vylučuje nutnost cyklu na nejkratší jednoduché trase." }
      ]
    }
  });

  // 13. Konstruktivní vs. Nekonstruktivní existence
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Konstruktivní vs. Nekonstruktivní Existence",
    leftCard: {
      title: "Nekonstruktivní Existence",
      badge: "NEKONSTRUKTIVNÍ",
      type: "rose",
      items: [
        { bold: "Společná vlastnost metod:", text: "Důkaz sporem, Dirichletův princip i Extremální princip jsou nekonstruktivní." },
        { bold: "Co dokážou:", text: "Dokážou, že hledaný prvek (dva vrcholy se stejným stupněm, cyklus, nejkratší cesta) musí zaručeně existovat." },
        { bold: "Omezení:", text: "Nedávají žádný recept ani algoritmus, jak ho v datech najít či sestrojit." }
      ]
    },
    rightCard: {
      title: "Konstruktivní Existence (Zlatý Standard)",
      badge: "KONSTRUKTIVNÍ",
      type: "emerald",
      items: [
        { bold: "Zlatý standard v informatice:", text: "Existenci dokážeme tím, že předložíme konkrétní funkční algoritmus (kód v C++)." },
        { bold: "Spolehlivý výsledek:", text: "Algoritmus řešení krok za krokem spolehlivě sestrojí — po doběhnutí kódu držíme výsledek přímo v ruce." }
      ]
    }
  });

  // 14. Procvičovací úlohy: Důkazy Sporem
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Procvičovací Úlohy: Důkazy Sporem v Grafech",
    leftCard: {
      title: "Úloha 1: Stupeň Δ(G) ≤ 2 je Cesta nebo Cyklus",
      badge: "ÚLOHA 1",
      type: "neutral",
      items: [
        { bold: "Tvrzení:", text: "Každý souvislý graf G s deg(v) ≤ 2 je buď cesta (P_n), nebo kružnice (C_n)." },
        { bold: "Důkaz sporem:", text: "Zvolme nejdelší cestu P = (v₀, …, vk). Předpokládejme pro spor uzel u ∉ P. Protože G je souvislý, existuje hrana do P. Vnitřní vrcholy již mají stupeň 2. Hrana z u by musela vést do v₀ nebo vk — to by však prodloužilo P, což je SPOR s maximalitou cesty P! Žádný uzel mimo P neexistuje." }
      ]
    },
    rightCard: {
      title: "Úloha 2: Každý Konečný DAG Má Alespoň Jeden Zdroj",
      badge: "ÚLOHA 2",
      type: "warm",
      items: [
        { bold: "Tvrzení:", text: "V každém konečném DAGu existuje uzel se vstupním stupněm deg⁻(v) = 0." },
        { bold: "Důkaz sporem:", text: "Předpokládejme pro spor, že každý uzel má deg⁻(v) ≥ 1. Vybereme libovolný uzel u₀ a postupujeme dozadu: … ➔ u₂ ➔ u₁ ➔ u₀. Protože graf má pouze n vrcholů, podle Dirichletova principu se po nejvýše n+1 krocích musí alespoň jeden vrchol zopakovat: u_i = u_j. Tím vzniká orientovaný cyklus, což je SPOR s definicí DAGu!" }
      ]
    }
  });
}
