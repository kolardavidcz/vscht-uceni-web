/**
 * Module 6: Důkazy Sporem & Extremální Princip
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide,
  createProofSlide
} from "../pptx_engine.mjs";

export function addModule6Slides(pres) {
  const breadcrumb = "6 · Důkazy Sporem & Extremální Princip";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 6,
    title: "Důkazy Sporem & Extremální Princip",
    goal: "Naučit se elegantní techniku důkazu sporem (Sherlock Holmes metoda), Dirichletův přihrádkový princip na grafech i sítích a extremální princip výběrem nejdelší cesty, kterým bezchybně dokážete existenci cyklů a zdrojů v AG1.",
    topics: [
      "Detektivní přístup: Vyloučení nemožného a logika sporu",
      "Logická podstata důkazu sporem: ¬(A ⇒ B) ≡ (A ∧ ¬B)",
      "Zkoušková šablona FIT ČVUT pro formální zápis důkazu sporem",
      "Dirichletův princip (Pigeonhole Principle) a 10sekundový důkaz",
      "Klasická věta: Dva vrcholy se stejným stupněm v každém grafu",
      "Klíčový trik: Vzájemné vyloučení stupně 0 a n - 1",
      "Dirichlet na trasách: Sled délky n v grafu o n uzlech tvoří cyklus",
      "Extremální princip: Výběr nejdelší cesty a nemožnost prodloužení",
      "Důkaz věty: Pokud minimální stupeň δ(G) ≥ 2, pak graf obsahuje cyklus",
      "Nejkratší cesta s nezápornými vahami nikdy neobsahuje cyklus",
      "Důležitý vhled: Konstruktivní vs. Nekonstruktivní existence v informatice",
      "Zkouškové úlohy: Graf s Δ(G) ≤ 2 a existence zdroje v každém DAGu"
    ]
  });

  // 2. Detective Approach to Mathematics
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Detektivní Přístup k Matematice",
    leftCard: {
      title: "Sherlock Holmes Metoda",
      badge: "INTUICE SPOREM",
      type: "orange",
      items: [
        { bold: "Citát klasika:", text: "'Když vyloučíš vše nemožné, co zbude – i kdyby to bylo sebenepravděpodobnější – musí to být pravda.'" },
        { bold: "1. Cíl:", text: "Chceme dokázat, že tvrzení B platí." },
        { bold: "2. Předpoklad:", text: "Předpokládáme opak, tedy že B neplatí (platí ¬B)." },
        { bold: "3. Odvození nesmyslu:", text: "Z tohoto předpokladu logicky odvodíme spor (rozpor se známým faktem či zadáním)." },
        { bold: "4. Závěr:", text: "Protože opak vedl k nemožnosti, tvrzení B nutně musí platit!" }
      ]
    },
    rightCard: {
      title: "Příklad ze Života: Narozeninový Měsíc",
      badge: "REÁLNÝ PŘÍKLAD",
      type: "emerald",
      items: [
        { bold: "Tvrzení:", text: "V místnosti se 13 lidmi musí alespoň dva sdílet stejný měsíc narození." },
        { bold: "Předpoklad pro spor:", text: "Předpokládejme opak: každý člověk v místnosti má jiný měsíc narození." },
        { bold: "Nesmysl (Spor):", text: "V kalendářním roce je pouze 12 měsíců. Třináct lidí nelze rozdělit do 12 měsíců po jednom!" },
        { bold: "Závěr:", text: "Předpoklad byl chybný, alespoň dva lidé se narodili ve stejném měsíci." }
      ]
    }
  });

  // 3. Logic of Proof by Contradiction
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Logická Podstata Důkazu Sporem",
    leftCard: {
      title: "Formální Logický Základ",
      badge: "¬(A ⇒ B) ≡ (A ∧ ¬B)",
      type: "orange",
      items: [
        { bold: "Dokazovaná implikace:", text: "Chceme dokázat tvrzení ve tvaru A ⇒ B (předpoklad A implikuje závěr B)." },
        { bold: "Negace implikace:", text: "Implikace je nepravdivá právě tehdy, když předpoklad platí a závěr neplatí: A ∧ ¬B." },
        { bold: "Co je spor (⊥):", text: "Stav, kdy v důkazu vyjde současně výrok C i jeho negace ¬C (např. x > 0 a současně x ≤ 0)." },
        { bold: "Logický princip:", text: "Z nepravdivého předpokladu lze odvodit jakýkoliv spor. Odvozením sporu vyvracíme výchozí hypotézu." }
      ]
    },
    rightCard: {
      title: "Myšlenkový Tok Důkazu Sporem",
      badge: "SCHÉMA POSTUPU",
      type: "emerald",
      items: [
        { bold: "1. Krok:", text: "Vezmeme platný předpoklad A a připojíme negovaný závěr ¬B." },
        { bold: "2. Krok:", text: "Korektními logickými dedukcemi odvozujeme mezivýsledky X, Y, Z." },
        { bold: "3. Krok (💥 SPOR):", text: "Narazíme na přímý rozpor s definicí, předpokladem A nebo dokázanou větou." },
        { bold: "4. Krok (Závěr):", text: "Předpoklad ¬B je vyloučen. Původní implikace A ⇒ B platí." }
      ]
    }
  });

  // 4. Formal Exam Template AG1
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Šablona Zápisu Důkazu Sporem u Zkoušky AG1",
    card: {
      title: "Formální Struktura Hodnocená Plným Počtem Bodů",
      badge: "ZÁVAZNÁ ŠABLONA",
      type: "orange",
      items: [
        { bold: "1. PŘEDPOKLAD PRO SPOR:", text: "'Předpokládejme pro spor, že platí předpoklad A a ZÁROVEŇ NEPLATÍ závěr B (tedy platí ¬B).'" },
        { bold: "2. LOGICKÉ ODVOZOVÁNÍ:", text: "'Z neplatnosti B plyne vlastnost X. Z vlastnosti X a předpokladu A odvodíme vlastnost Y...'" },
        { bold: "3. DOSAŽENÍ SPORU (💥 / ⊥):", text: "'To je však SPOR (rozpor) s [předpokladem A / definicí grafu / dříve dokázanou větou]!'" },
        { bold: "4. ZÁVĚR DŮKAZU:", text: "'Proto náš předpoklad pro spor (¬B) nemohl platit, a tedy původní tvrzení A ⇒ B platí. Q.E.D.'" }
      ]
    }
  });

  // 5. Pigeonhole Principle (Dirichlet)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Dirichletův Princip (Pigeonhole Principle)",
    leftCard: {
      title: "Formulace Principu",
      badge: "HOLUBI A ŠKATULKY",
      type: "blue",
      items: [
        { bold: "Znění věty:", text: "Máme-li n předmětů (holubů) a k přihrádek (škatułek), kde n > k, pak alespoň v jedné přihrádce musí skončit dva nebo více předmětů." },
        { bold: "Vizuální představa:", text: "5 holubů letí do 4 holubníků. I kdyby se 4 rozmístili po jednom, 5. holub musí ke někomu přisednout!" },
        { bold: "Zobecněný princip:", text: "Při rozdělení n předmětů do k přihrádek je v alespoň jedné přihrádce alespoň ⌈n / k⌉ předmětů." }
      ]
    },
    rightCard: {
      title: "10sekundový Důkaz Sporem",
      badge: "PROČ TO PLATÍ",
      type: "emerald",
      items: [
        { bold: "Předpoklad pro spor:", text: "Předpokládejme opak: v každé z k přihrádek je nanejvýš 1 holub." },
        { bold: "Odvození kapacity:", text: "Pak celkový počet holubů ve všech přihrádkách je nejvýše 1 × k = k." },
        { bold: "Dosažení sporu:", text: "My však máme n > k holubů, což je okamžitý SPOR s celkovým počtem!" },
        { bold: "Závěr:", text: "Opak neplatí. Alespoň jedna přihrádka obsahuje 2 a více holubů." }
      ]
    }
  });

  // 6. Example 1: Two vertices with same degree (Setup)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 1: Dva Vrcholy se Stejným Stupněm",
    leftCard: {
      title: "Klasická Zkoušková Věta",
      badge: "VĚTA O GRAFECH",
      type: "orange",
      items: [
        { bold: "Znění věty:", text: "V každém jednoduchém neorientovaném grafu G = (V, E) s n ≥ 2 vrcholy existují alespoň dva vrcholy se stejným stupněm." },
        { bold: "Otázka ke zkoušce:", text: "Lze sestrojit graf o 5 vrcholech, kde by každý vrchol měl unikátní počet sousedů? (Odpověď: Nikdy!)" },
        { bold: "Kdo jsou holubi?", text: "Holubi jsou samotné vrcholy grafu. Máme jich celkem n: {v₁, v₂, ..., v_n}." }
      ]
    },
    rightCard: {
      title: "Co Jsou Škatulky (Možné Stupně)?",
      badge: "KAPACITA HODNOT",
      type: "blue",
      items: [
        { bold: "Minimální stupeň:", text: "0 (vrchol je izolovaný, nemá žádnou incidentní hranu)." },
        { bold: "Maximální stupeň:", text: "n - 1 (vrchol je spojen se všemi zbývajícími n - 1 vrcholy)." },
        { bold: "Množina možných stupňů:", text: "{0, 1, 2, ..., n - 1}. To je celkem n možných hodnot!" },
        { bold: "Zdanlivý problém:", text: "Máme n holubů a n škatułek. Dirichlet zdánlivě nelze použít – potřebujeme n > k!" }
      ]
    }
  });

  // 7. Example 1: Mutual Exclusion Trick
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad 1: Grafový Trik Vzájemného Vyloučení",
    card: {
      title: "Mohou v Grafu Současně Existovat Stupně 0 a n - 1?",
      badge: "KLÍČOVÝ DŮKAZ SPOREM",
      type: "rose",
      items: [
        { bold: "Předpokládejme pro spor, že ANO:", text: "V grafu G existuje uzel u se stupněm deg(u) = n - 1 a zároveň uzel w se stupněm deg(w) = 0." },
        { bold: "Význam deg(u) = n - 1:", text: "Vrchol u je spojen hranou s ÚPLNĚ VŠEMI ostatními vrcholy v grafu." },
        { bold: "Význam deg(w) = 0:", text: "Vrchol w není spojen hranou s VŮBEC NIKÝM v celém grafu." },
        { bold: "Okamžitý SPOR (💥):", text: "Protože u sousedí se všemi, musí sousedit i s w, tedy hrana {u, w} existuje. Tím má w stupeň alespoň 1, což je spor s deg(w) = 0!" },
        { bold: "Důsledek:", text: "Stupeň 0 a stupeň n - 1 se VZÁJEMNĚ VYLUČUJÍ. Žádný graf nemůže obsahovat obě tyto hodnoty současně!" }
      ]
    }
  });

  // 8. Example 1: Pigeonhole Application & PPI
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 1: Dokončení Důkazu & Bio Analogie",
    leftCard: {
      title: "Finální Aplikace Dirichleta",
      badge: "n HOLUBŮ DO n-1 ŠKATULEK",
      type: "emerald",
      items: [
        { bold: "Situace A (Graf má uzel deg 0):", text: "Pak nemá uzel stupně n - 1. Dostupné stupně jsou pouze {0, 1, ..., n - 2} ➔ přesně n - 1 škatułek!" },
        { bold: "Situace B (Graf nemá uzel deg 0):", text: "Všechny stupně jsou alespoň 1. Dostupné stupně jsou {1, 2, ..., n - 1} ➔ opět přesně n - 1 škatułek!" },
        { bold: "Závěr Dirichletova principu:", text: "V obou situacích máme n vrcholů a nejvýše n - 1 hodnot stupňů. Protože n > n - 1, alespoň dva vrcholy sdílí stejný stupeň." }
      ]
    },
    rightCard: {
      title: "Interpretace v Bioinformatice",
      badge: "PPI PROTEINOVÉ SÍTĚ",
      type: "orange",
      items: [
        { bold: "Proteinové interakce:", text: "V protein-proteinové interakční síti (PPI síť) o n proteinech vždy existují dva proteiny se stejným počtem partnerů." },
        { bold: "Biologický význam:", text: "I v chaotické buněčné síti existuje striktní matematický řád vynucený strukturou grafu." }
      ]
    }
  });

  // 9. Example 2: Walk of length n creates cycle
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 2: Trasa Délky n Nutně Obsahuje Cyklus",
    leftCard: {
      title: "Dirichlet na Posloupnosti Kroků",
      badge: "SLED DÉLKY n HRAN",
      type: "blue",
      items: [
        { bold: "Formulace věty:", text: "Pokud v grafu G o n vrcholech existuje sled procházející n hranami, pak nutně obsahuje alespoň jeden cyklus (smyčku)." },
        { bold: "Rozbor návštěv:", text: "Sled délky n hran navštíví přesně n + 1 vrcholů: (u₀ ➔ u₁ ➔ u₂ ➔ ... ➔ u_n)." },
        { bold: "Kdo jsou holubi?", text: "n + 1 navštívených pozic na trase." },
        { bold: "Co jsou škatulky?", text: "Skutečné existující vrcholy grafu (je jich pouze n)." }
      ]
    },
    rightCard: {
      title: "Vznik Cyklu & Algoritmický Význam",
      badge: "KOLIZE UZŮ",
      type: "emerald",
      items: [
        { bold: "Dirichletova kolize:", text: "Protože n + 1 > n, alespoň jeden vrchol byl navštíven dvakrát: u_i = u_j pro i < j." },
        { bold: "Uzavřený cyklus:", text: "Úsek mezi návštěvami (u_i ➔ u_{i+1} ➔ ... ➔ u_j) tvoří uzavřený cyklus v grafu!" },
        { bold: "Detekce cyklů (PA2 / AG1):", text: "Teoretický základ pro Floydův algoritmus želvy a zajíce i korektnost Bellman-Fordova algoritmu." }
      ]
    }
  });

  // 10. Extremal Principle
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Extremální Princip v Grafech",
    leftCard: {
      title: "Filozofie Extremálního Výběru",
      badge: "PRINCIP EXTRÉMU",
      type: "orange",
      items: [
        { bold: "Základní myšlenka:", text: "Místo náhodného zkoumání celého grafu vybereme globálně extrémní objekt struktury." },
        { bold: "Typické volby v AG1:", text: "Nejdelší jednoduchá cesta P_max, nejmenší cyklus C_min, vrchol minimálního stupně δ(G), nejlehčí hrana." },
        { bold: "Kouzlo pro spory:", text: "Extrémní objekt už z definice nemůže mít vlastnost, která by ho ještě více zvětšila (či zmenšila)!" }
      ]
    },
    rightCard: {
      title: "Mechanismus Důkazu",
      badge: "LOGICKÁ PÁKA",
      type: "emerald",
      items: [
        { bold: "Předpoklad existence:", text: "V každém konečném grafu extrémní objekt zaručeně existuje (konečná množina délek má maximum)." },
        { bold: "Zkoumání hranic:", text: "Podíváme se na konce nejdelší cesty. Všechny hrany z konce musí vést dovnitř cesty, jinak by cesta nebyla nejdelší!" },
        { bold: "Výsledek:", text: "Hranice extrémního objektu okamžitě uzavírají cykly nebo generují spor." }
      ]
    }
  });

  // 11. Worked Example 1: delta(G) >= 2 implies cycle
  createProofSlide(pres, {
    breadcrumb,
    title: "Věta: Pokud δ(G) ≥ 2, pak Graf Obsahuje Cyklus",
    statement: "Nechť G = (V, E) je konečný neorientovaný graf s minimálním stupněm δ(G) ≥ 2. Pak G obsahuje alespoň jeden cyklus.",
    steps: [
      { bold: "1. Volba nejdelší cesty:", text: "Zvolme v grafu G nejdelší jednoduchou cestu P = (v₀, v₁, v₂, ..., v_k). Taková cesta v konečném grafu zaručeně existuje." },
      { bold: "2. Sousedé krajního vrcholu v₀:", text: "Z předpokladu δ(G) ≥ 2 má koncový vrchol v₀ stupeň deg(v₀) ≥ 2, má tedy alespoň dva různé sousedy." },
      { bold: "3. Sousedé nemohou ležet mimo cestu:", text: "Kdyby měl v₀ souseda u ∉ P, pak (u, v₀, v₁, ..., v_k) by byla delší jednoduchá cesta délky k+1. To je SPOR s maximalitou cesty P! Všichni sousedé v₀ leží na cestě P." },
      { bold: "4. Uzavření cyklu:", text: "Jeden soused v₀ je v₁ (součást cesty). Druhý soused v_j (pro j ≥ 2) leží dále na cestě. Hrana {v₀, v_j} spolu s úsekem cesty v₀ ➔ v₁ ➔ ... ➔ v_j tvoří cyklus!" },
      { bold: "5. Závěr:", text: "Každý konečný graf s minimálním stupněm alespoň 2 nutně obsahuje cyklus." }
    ]
  });

  // 12. Tracing on 5-node graph
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Vizualizace Důkazu na Grafu s 5 Vrcholy",
    leftCard: {
      title: "Konkrétní Graf s deg(v) ≥ 2",
      badge: "PŘÍKLAD V PRAXI",
      type: "blue",
      items: [
        { bold: "Vrcholy a hrany:", text: "V = {1, 2, 3, 4, 5}. Hrany: {1,2}, {2,3}, {3,4}, {4,5}, {5,1}, {1,3}. Každý vrchol má stupeň ≥ 2." },
        { bold: "Volba nejdelší cesty:", text: "Zvolme cestu P = (2, 1, 5, 4, 3) o délce 4 hran procházející všemi vrcholy." },
        { bold: "Krajní uzel v₀ = 2:", text: "Sousedé vrcholu 2 jsou {1, 3}. Oba leží na cestě P (vrchol 1 je v₁, vrchol 3 je v₄)." }
      ]
    },
    rightCard: {
      title: "Nalezený Cyklus v Grafu",
      badge: "UZAVŘENÍ SMYČKY",
      type: "emerald",
      items: [
        { bold: "Hrana zpět na cestu:", text: "Hrana {2, 3} vede z konce v₀ přímo do vnitřního uzlu v₄ na cestě." },
        { bold: "Vzniklý cyklus:", text: "2 ➔ 1 ➔ 5 ➔ 4 ➔ 3 ➔ 2 tvoří plný pětiúhelníkový cyklus délky 5." },
        { bold: "Alternativní trojúhelník:", text: "Hrana {1, 3} tvoří s uzlem 2 další cyklus 1 ➔ 2 ➔ 3 ➔ 1 délky 3." }
      ]
    }
  });

  // 13. Worked Example 2: Shortest path has no cycle
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklad 2: Nejkratší Cesta Neobsahuje Cyklus",
    leftCard: {
      title: "Věta o Nejkratší Trase",
      badge: "NEZÁPORNÉ VÁHY w(e) ≥ 0",
      type: "orange",
      items: [
        { bold: "Znění věty:", text: "V grafu G = (V, E, w) s nezápornými vahami neobsahuje žádná nejkratší cesta z s do t žádný cyklus." },
        { bold: "Předpoklad pro spor:", text: "Předpokládejme, že nejkratší cesta P z s do t obsahuje cyklus C procházející vrcholem u." },
        { bold: "Rozklad cesty:", text: "s ➔ P₁ ➔ u ➔ C ➔ u ➔ P₂ ➔ t. Celková váha je w(P) = w(P₁) + w(C) + w(P₂)." }
      ]
    },
    rightCard: {
      title: "Odvození Sporu Vynecháním Cyklu",
      badge: "ZKRÁCENÍ TRASY",
      type: "emerald",
      items: [
        { bold: "Vynechání cyklu C:", text: "Sestrojíme novou cestu P': s ➔ P₁ ➔ u ➔ P₂ ➔ t (vynecháme oběhnutí cyklu C)." },
        { bold: "Váha nové cesty:", text: "Protože w(e) ≥ 0, platí w(C) ≥ 0. Je-li w(C) > 0, pak w(P') < w(P), což je SPOR s minimalitou P!" },
        { bold: "Nulový cyklus (w(C) = 0):", text: "Cesta P' má stejnou váhu, ale méně hran. Nejkratší jednoduchá cesta cyklus nikdy nepotřebuje." }
      ]
    }
  });

  // 14. Constructive vs Non-constructive Existence
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Konstruktivní vs. Nekonstruktivní Existence",
    leftCard: {
      title: "Nekonstruktivní Existence (Matematika)",
      badge: "VÍME, ŽE EXISTUJE",
      type: "rose",
      items: [
        { bold: "Podstata:", text: "Důkaz sporem, Dirichletův princip i extremální princip dokazují, že hledaný prvek MUSÍ zaručeně existovat." },
        { bold: "Omezení:", text: "Nedávají žádný návod, postup ani algoritmus, jak ho v konkrétních datech najít nebo sestrojit." },
        { bold: "Příklad:", text: "Víme, že dva proteiny mají stejný stupeň, ale nevíme které, dokud celou síť neprohledáme." }
      ]
    },
    rightCard: {
      title: "Konstruktivní Existence (Informatika)",
      badge: "MÁME KÓD V C++",
      type: "emerald",
      items: [
        { bold: "Zlatý standard IT:", text: "Existenci dokážeme tím, že předložíme funkční deterministický algoritmus v C++, který prvek přímo zkonstruuje." },
        { bold: "Výsledek v ruce:", text: "Po doběhnutí kódu držíme nalezený objekt, cestu či rozklad přímo v paměti." },
        { bold: "Synergie:", text: "Nekonstruktivní důkaz zaručí, že algoritmus nemůže skončit nezdarem (řešení existuje!)." }
      ]
    }
  });

  // 15. Bonus Task 1: Delta(G) <= 2 is Path or Cycle
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Zkoušková Úloha: Graf s Δ(G) ≤ 2 je Cesta či Cyklus",
    leftCard: {
      title: "Formulace & Extremální Krok",
      badge: "DŮKAZ EXTRÉMEM",
      type: "blue",
      items: [
        { bold: "Tvrzení:", text: "Každý souvislý graf G s maximálním stupněm Δ(G) ≤ 2 je buď cesta, nebo kružnice." },
        { bold: "Nejdelší cesta:", text: "Zvolme v G nejdelší jednoduchou cestu P = (v₀, v₁, ..., v_k)." },
        { bold: "Předpoklad pro spor:", text: "Předpokládejme, že v grafu existuje uzel u ležící mimo cestu P (u ∉ P)." }
      ]
    },
    rightCard: {
      title: "Dosažení Sporu s Maximalitou P",
      badge: "💥 ROZPOR",
      type: "emerald",
      items: [
        { bold: "Souvislost grafu:", text: "Protože G je souvislý, musí z u vést hrana k nějakému vrcholu na cestě P." },
        { bold: "Vnitřní uzly jsou plné:", text: "Uzly v₁ až v_{k-1} již mají stupeň 2 (hrany k sousedům na P). Nemohou se spojit s u (Δ(G) ≤ 2)." },
        { bold: "Krajní uzel:", text: "Hrana by musela vést do v₀ nebo v_k. To by však umožnilo prodloužit cestu P o uzel u, což je SPOR s maximalitou P!" }
      ]
    }
  });

  // 16. Bonus Task 2: DAG always has a Source
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Zkoušková Úloha: Každý Konečný DAG má Zdroj",
    leftCard: {
      title: "Formulace & Zpětný Řetězec",
      badge: "DŮKAZ SPOREM",
      type: "orange",
      items: [
        { bold: "Tvrzení:", text: "V každém konečném orientovaném acyklickém grafu (DAG) existuje uzel se vstupním stupněm deg⁻(v) = 0 (zdroj)." },
        { bold: "Předpoklad pro spor:", text: "Předpokládejme, že v DAGu žádný zdroj neexistuje, tedy každý uzel má alespoň jednoho předchůdce (deg⁻(v) ≥ 1)." },
        { bold: "Konstrukce zpětné trasy:", text: "Vybereme u₀. Má předchůdce u₁, ten má předchůdce u₂, atd. Vzniká posloupnost ... ➔ u₂ ➔ u₁ ➔ u₀." }
      ]
    },
    rightCard: {
      title: "Dirichletův Cyklus & Rozpor",
      badge: "💥 ROZPOR S DAGEM",
      type: "emerald",
      items: [
        { bold: "Dirichlet na konečné množině:", text: "Graf má pouze n vrcholů. Po n + 1 krocích dozadu se podle Dirichleta musí alespoň jeden vrchol zopakovat: u_i = u_j." },
        { bold: "Vzniklý orientovaný cyklus:", text: "Mezi u_i a u_j vzniká orientovaný cyklus v grafu." },
        { bold: "Dosažení sporu:", text: "To je přímý SPOR s definicí DAGu, který nesmí obsahovat žádný orientovaný cyklus. Zdroj tedy nutně existuje!" }
      ]
    }
  });

  // 17. Summary of Module 6
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Shrnutí Modulu 6: Důkazy Sporem a Extrémy",
    card: {
      title: "Klíčové Zkouškové Zásady pro AG1",
      badge: "ZKOUŠKOVÉ DESATERO",
      type: "orange",
      items: [
        { bold: "Formální šablona sporem:", text: "Vždy jasně napište: 'Předpokládejme pro spor ¬B', logicky odvoďte rozpor 💥 a uzavřete 'Proto platí B'." },
        { bold: "Dirichletův princip:", text: "n předmětů do k přihrádek (n > k) vynutí alespoň v jedné přihrádce kolizi (≥ 2 předměty)." },
        { bold: "Trik se stupni 0 a n - 1:", text: "Izolovaný vrchol a vrchol spojený se všemi se v grafu vzájemně vylučují ➔ n vrcholů do n-1 hodnot stupňů." },
        { bold: "Extremální princip:", text: "Při důkazu existence cyklu zvolte nejdelší jednoduchou cestu P. Její koncový vrchol musí mít sousedy uvnitř P, což okamžitě uzavře cyklus." },
        { bold: "Acyklické procesy (DAG):", text: "Zpětné trasování v konečném grafu bez zdrojů nutně narazí na Dirichletův cyklus, což vyvrátí acykličnost." }
      ]
    }
  });
}
