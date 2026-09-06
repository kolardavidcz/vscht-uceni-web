/**
 * Module 7: Grafy v C++ & Reprezentace v Paměti
 * Source: src/features/bioinformatics/content/3-semestr/pre-ag1/dml-bio-grafy-b.md
 * Exact 1:1 text fidelity with website markdown.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createTableSlide
} from "../pptx_engine.mjs";

export function addModule7Slides(pres) {
  const breadcrumb = "7 · Grafy v C++ & Reprezentace v Paměti";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 7,
    title: "Grafy v C++ & Reprezentace v Paměti",
    goal: "Pochopit počítačovou reprezentaci grafů v jazyce C++ (PA2 ➔ AG1), porovnat matici sousedství a seznam sousedů z hlediska časové a paměťové složitosti, porozumět prohledávání DFS vs. BFS a provést praktickou analýzu proteinové interakční sítě (PPI).",
    topics: [
      "0. Minimum z Grafových Pojmů: Incidence, Adjacence, Stupeň",
      "Handshaking Lemma, Sled (Walk), Cesta (Path) a Cyklus",
      "1. Počítačová Reprezentace Grafů v C++ (PA2 ➔ AG1)",
      "1.1 Matice Sousedství (Adjacency Matrix) & Složitosti",
      "1.2 Seznam Sousedů (Adjacency List) & Složitosti",
      "Srovnání paměti a rychlosti: Θ(n²) vs. Θ(n + m)",
      "2. Dva Přístupy k Prohledávání: DFS vs. BFS",
      "DFS: Hloubkové prohledávání a proč nezaručuje nejkratší cestu",
      "BFS: Šířkové prohledávání a nalezení nejkratší cesty",
      "3. Úloha: Analýza Proteinové Interakční Sítě (PPI)",
      "Stupně vrcholů, Huby, Listy, Matice sousedství a Handshaking"
    ]
  });

  // 2. Section 0: Minimum z grafových pojmů
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "0. Minimum z Grafových Pojmů",
    leftCard: {
      title: "Základní Vztahy a Handshaking Lemma",
      badge: "DEFINICE POJMŮ",
      type: "neutral",
      items: [
        { bold: "Incidence:", text: "Vrchol u a hrana e jsou incidentní, pokud u ∈ e." },
        { bold: "Adjacence (sousedství):", text: "Dva vrcholy u, v jsou sousední, pokud {u, v} ∈ E." },
        { bold: "Stupeň vrcholu deg(v):", text: "Počet hran incidentních s vrcholem v." },
        { bold: "Handshaking Lemma:", text: "∑_{v ∈ V} deg(v) = 2|E| (součet všech stupňů je vždy dvojnásobek počtu hran)." }
      ]
    },
    rightCard: {
      title: "Sled, Cesta a Cyklus",
      badge: "POHYB V GRAFU",
      type: "warm",
      items: [
        { bold: "Sled (Walk):", text: "Střídavá posloupnost vrcholů a hran (v₀, e₁, v₁, e₂, …, ek, vk), kde se vrcholy i hrany mohou opakovat." },
        { bold: "Cesta (Path):", text: "Sled, ve kterém se neopakuje žádný vrchol (a tedy ani hrana)." },
        { bold: "Cyklus (Cycle):", text: "Uzavřený sled (v₀, e₁, v₁, …, ek, v₀) délky k ≥ 3, kde jsou všechny vnitřní vrcholy navzájem různé." }
      ]
    }
  });

  // 3. Section 1: Počítačová Reprezentace Grafů v C++ (PA2 ➔ AG1)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Počítačová Reprezentace Grafů v C++ (PA2 ➔ AG1)",
    leftCard: {
      title: "Paměť a Výkon Algoritmů",
      badge: "PA2 ➔ AG1",
      type: "neutral",
      items: [
        { bold: "Způsob uložení rozhoduje:", text: "V předmětech PA2 a AG1 budete grafové algoritmy zapisovat v jazyce C++. Způsob, jakým graf uložíte do paměti, rozhodne o tom, zda váš program proběhne za 0.01 sekundy, nebo vyprší časový limit (Time Limit Exceeded)." },
        { bold: "Základní značení:", text: "Uvažujme graf G = (V, E) o n = |V| vrcholech a m = |E| hranách. Vrcholy očíslujeme od 0 do n - 1." }
      ]
    },
    rightCard: {
      title: "Matice Sousedství vs. Seznam Sousedů",
      badge: "DVA PŘÍSTUPY",
      type: "warm",
      items: [
        { bold: "1. Matice sousedství (Adjacency Matrix):", text: "Dvoudimenzionální pole typu n × n. Vhodné pro husté grafy (m ≈ n²)." },
        { bold: "2. Seznam sousedů (Adjacency List):", text: "Pole dynamických vektorů std::vector. Optimální pro řídké grafy (m ≪ n²)." },
        { bold: "Význam volby:", text: "Špatná volba reprezentace může vést k překročení paměti (Memory Limit) nebo času (Time Limit)." }
      ]
    }
  });

  // 4. Section 1.1: Matice Sousedství
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1.1 Matice Sousedství (Adjacency Matrix)",
    leftCard: {
      title: "Definice Matice A typu n × n",
      badge: "DEFINICE",
      type: "neutral",
      items: [
        { bold: "Definice:", text: "Graf reprezentujeme dvoudimenzionálním polem (maticí) A typu n × n:" },
        { bold: "A[i][j]:", text: "1 pokud {v_i, v_j} ∈ E (nebo (v_i, v_j) ∈ E), 0 pokud hrana neexistuje." },
        { bold: "Symetrie:", text: "U neorientovaného grafu je matice symetrická: A[i][j] = A[j][i]." }
      ]
    },
    rightCard: {
      title: "Složitosti Matice Sousedství",
      badge: "SLOŽITOST",
      type: "warm",
      items: [
        { bold: "Paměťová složitost:", text: "Θ(n²) — bez ohledu na počet hran m." },
        { bold: "Test existence hrany {u, v}:", text: "O(1) — okamžitý přístup do pole." },
        { bold: "Průchod sousedů vrcholu u:", text: "Θ(n) — projití celého řádku matice." }
      ]
    }
  });

  // 5. Section 1.2: Seznam Sousedů
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1.2 Seznam Sousedů (Adjacency List)",
    leftCard: {
      title: "Definice Seznamu Sousedů v C++",
      badge: "DEFINICE",
      type: "neutral",
      items: [
        { bold: "Princip:", text: "Pro každý vrchol u ∈ V uchováváme seznam (dynamické pole std::vector) všech vrcholů v, které jsou s u spojeny hranou." },
        { bold: "Využití paměti:", text: "Ukládáme pouze skutečně existující hrany, ne prázdná místa." }
      ]
    },
    rightCard: {
      title: "Složitosti Seznamu Sousedů",
      badge: "SLOŽITOST",
      type: "emerald",
      items: [
        { bold: "Paměťová složitost:", text: "Θ(n + m) — optimální pro řídké grafy." },
        { bold: "Test existence hrany {u, v}:", text: "O(deg(u)) — prohledání sousedů vrcholu u." },
        { bold: "Průchod sousedů vrcholu u:", text: "Θ(deg(u)) — průchod pouze reálných sousedů." }
      ]
    }
  });

  // 6. Srovnání reprezentací: Tabulka
  createTableSlide(pres, {
    breadcrumb,
    title: "Srovnání Reprezentací Grafu v C++",
    subtitle: "Podrobné porovnání matice sousedství a seznamu sousedů:",
    headers: ["Vlastnost / Operace", "Matice Sousedství (Adjacency Matrix)", "Seznam Sousedů (Adjacency List)"],
    colWidths: [3.4, 4.2, 4.1],
    rows: [
      ["Paměťová složitost", "Θ(n²) — bez ohledu na počet hran m", "Θ(n + m) — optimální pro řídké grafy"],
      ["Test existence hrany {u, v}", "O(1) — okamžitý přístup do pole", "O(deg(u)) — prohledání sousedů vrcholu u"],
      ["Průchod sousedů vrcholu u", "Θ(n) — projití celého řádku matice", "Θ(deg(u)) — průchod pouze reálných sousedů"],
      ["Vhodnost pro typ grafu", "Husté grafy (m ≈ n²)", "Řídké grafy (m ≪ n², např. stromy a bio sítě)"]
    ]
  });

  // 7. Section 2: Prohledávání DFS vs. BFS
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "2. Dva Přístupy k Prohledávání: DFS vs. BFS",
    leftCard: {
      title: "DFS (Hloubkové Prohledávání)",
      badge: "HLOUBKA",
      type: "rose",
      items: [
        { bold: "Princip průchodu:", text: "Vnoří se podél větve: v₀ ─(e₁)➔ v₁ ─(e₂)➔ v₂ ─(e₃)➔ v₃ ─(e₄)➔ v₄ ─(e₇)➔ v₆ ─(e₈)➔ v₇ (slepá ulička)." },
        { bold: "Návrat a cíl:", text: "Vrátí se a přes e₉ dorazí k cíli v₈ (C) oklikou (6 hran: e₁, e₂, e₃, e₄, e₇, e₉)." },
        { bold: "Klíčová vlastnost:", text: "Nezaručuje nejkratší cestu!" }
      ]
    },
    rightCard: {
      title: "BFS (Šířkové Prohledávání)",
      badge: "ŠÍŘKA",
      type: "emerald",
      items: [
        { bold: "Princip průchodu:", text: "Postupuje po vlnoplochách: v₀ ─(e₅)➔ v₅ ─(e₆)➔ v₄ ─(e₇)➔ v₆ ─(e₉)➔ v₈ (C)." },
        { bold: "Nalezení cíle:", text: "Okamžitě nalezne nejkratší cestu po horní větvi (pouhé 4 hrany: e₅, e₆, e₇, e₉)." },
        { bold: "Klíčová vlastnost:", text: "V neohodnoceném grafu zaručuje nalezení cesty s minimálním počtem hran." }
      ]
    }
  });

  // 8. Section 3: Úloha PPI - Zadání a Stupně
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3. Úloha: Analýza Proteinové Interakční Sítě (PPI)",
    leftCard: {
      title: "Zadání Úlohy PPI Sítě",
      badge: "ZADÁNÍ ÚLOHY",
      type: "neutral",
      items: [
        { bold: "Množina proteinů V:", text: "|V| = 6 proteinů {P₁, P₂, P₃, P₄, P₅, P₆}." },
        { bold: "Množina interakcí E:", text: "E = { {P₁, P₂}, {P₁, P₃}, {P₂, P₃}, {P₃, P₄}, {P₄, P₅}, {P₄, P₆} }." },
        { bold: "Úkoly k vyřešení:", text: "1. Určete stupně všech vrcholů deg(P_i). 2. Identifikujte proteiny s nejvyšším stupněm (Huby) a listy (deg(v) = 1). 3. Vypište matici sousedství A tohoto grafu. 4. Ověřte Handshaking Lemma ∑ deg(v) = 2|E|." }
      ]
    },
    rightCard: {
      title: "1. Stupně Vrcholů & 2. Huby a Listy",
      badge: "ŘEŠENÍ 1 & 2",
      type: "warm",
      items: [
        { bold: "P₁ a P₂:", text: "deg(P₁) = 2 (sousedi P₂, P₃), deg(P₂) = 2 (sousedi P₁, P₃)." },
        { bold: "P₃ a P₄ (Huby):", text: "deg(P₃) = 3 (sousedi P₁, P₂, P₄), deg(P₄) = 3 (sousedi P₃, P₅, P₆). Proteiny P₃ a P₄ mají nejvyšší stupeň (deg = 3), představují lokální huby sítě spojené mostem e₄." },
        { bold: "P₅ a P₆ (Listy):", text: "deg(P₅) = 1 (soused P₄), deg(P₆) = 1 (soused P₄). Proteiny P₅ a P₆ jsou listy (deg = 1)." }
      ]
    }
  });

  // 9. Úloha PPI: Matice Sousedství a Handshaking Lemma
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Úloha PPI: Matice Sousedství a Handshaking",
    leftCard: {
      title: "3. Matice Sousedství A (Velikost 6 × 6)",
      badge: "MATICE A",
      type: "neutral",
      items: [
        { bold: "Řádek P₁:", text: "[0, 1, 1, 0, 0, 0]" },
        { bold: "Řádek P₂:", text: "[1, 0, 1, 0, 0, 0]" },
        { bold: "Řádek P₃:", text: "[1, 1, 0, 1, 0, 0]" },
        { bold: "Řádek P₄:", text: "[0, 0, 1, 0, 1, 1]" },
        { bold: "Řádek P₅:", text: "[0, 0, 0, 1, 0, 0]" },
        { bold: "Řádek P₆:", text: "[0, 0, 0, 1, 0, 0]" }
      ]
    },
    rightCard: {
      title: "4. Ověření Handshaking Lemmatu",
      badge: "HANDSHAKING LEMMA",
      type: "emerald",
      items: [
        { bold: "Počet hran |E|:", text: "|E| = 6 (e₁ až e₆). Tedy 2|E| = 2 × 6 = 12." },
        { bold: "Součet stupňů:", text: "∑_{i=1}^6 deg(P_i) = 2 + 2 + 3 + 3 + 1 + 1 = 12." },
        { bold: "Ověření rovnosti:", text: "Platí 12 = 12. Handshaking lemma je bezchybně ověřeno!" }
      ]
    }
  });
}
