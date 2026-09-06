/**
 * Module 7: Grafy v C++ & Reprezentace v Paměti
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml-bio-grafy-b.md
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
  renderDocImage,
  renderSolutionBanner,
  colors,
  fs
} from "../pptx_document_engine.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

export function addModule7Slides(pres) {
  const breadcrumb = "MODUL 7 · 💻 GRAFY V C++ & REPREZENTACE V PAMĚTI";

  // --------------------------------------------------------------------------
  // Slide 7.1a: Titul & 0. Minimum z Grafových Pojmů
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Grafy v C++ & Reprezentace v Paměti", { level: 1, y });

    y = renderDocHeading(pres, slide, "0. Minimum z Grafových Pojmů pro C++", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Nechť $G = (V, E)$ je neorientovaný graf bez smyček a násobných hran:",
      { y }
    );

    renderDocList(slide, [
      "**Incidence:** Vrchol $u$ a hrana $e$ jsou incidentní, pokud $u \\in e$.",
      "**Adjacence (sousedství):** Dva vrcholy $u, v$ jsou sousední, pokud $\\{u, v\\} \\in E$.",
      "**Stupeň vrcholu deg(v):** Počet hran incidentních s vrcholem $v$.",
      "**Handshaking Lemma:** $\\sum_{v \\in V} \\deg(v) = 2|E|$ (součet všech stupňů je dvojnásobek počtu hran)."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 7.1b: Sled, Cesta a Cyklus v Paměti C++
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "0. Minimum z Grafových Pojmů pro C++" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Sled, Cesta a Cyklus v Algoritmech", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Rozlišení posloupností vrcholů a hran je základem pro implementaci grafových algoritmů (BFS, DFS):",
      { y }
    );

    y = renderDocList(slide, [
      "**Sled (Walk):** Střídavá posloupnost vrcholů a hran $(v_0, e_1, v_1, \\dots, v_k)$, kde se vrcholy i hrany mohou opakovat.",
      "**Cesta (Path):** Sled, ve kterém se **neopakuje žádný vrchol** (a tedy ani hrana).",
      "**Cyklus (Cycle):** Uzavřený sled délky $k \\ge 3$, kde jsou všechny vnitřní vrcholy navzájem různé."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Poznámka k reprezentaci v C++:",
      text: "V jednoduchém grafu jednoznačně určuje sled pouze posloupnost vrcholů (v₀, v₁, …, vₖ) ukládaná standardně do std::vector<int>.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.2a: Vizuální srovnání reprezentací grafu v paměti
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "1. Počítačová Reprezentace Grafů v C++ (PA2 ➔ AG1)", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V předmětech **PA2** a **AG1** budete grafové algoritmy zapisovat v C++. Způsob uložení do paměti rozhodne o složitosti i spotřebě RAM:",
      { y }
    );

    const imgPath = path.join(rootDir, "public", "images", "graph-representation-showcase.png");
    renderDocImage(slide, imgPath, {
      x: 1.6,
      y,
      w: 10.133,
      h: 3.7,
      caption: "Vlevo: Neorientovaný vs. Orientovaný graf · Uprostřed: Seznam sousedů · Vpravo: Matice sousedství",
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.2b: Indexování a Paměťové Chování v C++
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "1. Počítačová Reprezentace Grafů v C++" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Indexování Vrcholů a Paměťové Limity", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Indexování vrcholů v C++:",
      text: "V C++ standardně číslujeme vrcholy od 0 do n - 1. Vždy si ujasněte, zda vstupní data ze zadání začínají od 0 nebo od 1 (častá off-by-one chyba při indexaci pole)!",
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Paměťový profil v testovacím systému ProgTest:",
      text: "Nesprávná volba matice sousedství pro graf s n = 100 000 uzly alokuje 10¹⁰ bajtů (~10 GB RAM) a způsobí Memory Limit Exceeded (MLE). Seznam sousedů zabere pouze Θ(n + m) paměti.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.3: Matice Sousedství vs. Seznam Sousedů
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "1.1 Matice Sousedství vs. 1.2 Seznam Sousedů", { level: 2, y, showUnderline: true });

    y = renderDocHeading(pres, slide, "1.1 Matice Sousedství (Adjacency Matrix)", { level: 3, y });
    y = renderDocParagraph(slide,
      "Graf reprezentujeme 2D polem $A$ typu $n \\times n$: $A[i][j] = 1$, pokud hrana existuje, jinak $0$.",
      { y }
    );
    y = renderDocList(slide, [
      "**Paměť:** $\\Theta(n^2)$ — bez ohledu na počet hran $m$ (plýtvá pamětí pro řídké grafy).",
      "**Test hrany {u, v}:** $O(1)$ — okamžitý přístup do pole.",
      "**Průchod sousedů vrcholu u:** $\\Theta(n)$ — nutno projít celý řádek matice."
    ], { y });

    y = renderDocHeading(pres, slide, "1.2 Seznam Sousedů (Adjacency List)", { level: 3, y });
    y = renderDocParagraph(slide,
      "Pro každý vrchol $u \\in V$ uchováváme dynamické pole (`std::vector<int>`) sousedů:",
      { y }
    );
    y = renderDocList(slide, [
      "**Paměť:** $\\Theta(n + m)$ — **optimální pro řídké grafy** v biologii a internetu.",
      "**Test hrany {u, v}:** $O(\\deg(u))$ — prohledání sousedů vrcholu $u$.",
      "**Průchod sousedů vrcholu u:** $\\Theta(\\deg(u))$ — procházíme pouze reálné sousedy!"
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 7.4a: Srovnávací tabulka reprezentací v C++
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Detailní Srovnání Grafových Reprezentací v C++", { level: 2, y, showUnderline: true });

    renderDocTable(slide, {
      headers: ["Operace v C++", "Matice sousedství", "Seznam sousedů", "Doporučení pro AG1"],
      rows: [
        ["Paměťová náročnost", "Θ(n²)", "Θ(n + m)", "Seznam sousedů pro m ≪ n²"],
        ["Test existence hrany {u, v}", "O(1) [okamžitý přístup]", "O(deg(u)) [průchod vektoru]", "Matice pro husté grafy"],
        ["Průchod všemi sousedy vrcholu u", "Θ(n) [celý řádek matice]", "Θ(deg(u)) [pouze sousedé]", "Seznam sousedů pro BFS/DFS"],
        ["Přidání nové hrany", "O(1)", "O(1) [push_back]", "Obě metody bleskové"],
        ["Smazání existující hrany", "O(1)", "O(deg(u)) [hledání prvku]", "Matice snazší"],
        ["Vhodné pro grafy", "Husté grafy (m ≈ n²)", "Řídké grafy (m ≪ n²)", "V AG1 je 95 % úloh řídkých!"]
      ],
      colWidths: [3.2, 2.8, 3.0, 2.733],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.4b: Doporučení pro AG1 & Paměťové Chování
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "📊 Detailní Srovnání Reprezentací" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Zlaté Pravidlo Volby Reprezentace v AG1", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "tip",
      title: "Zlaté pravidlo AG1:",
      text: "Pokud není výslovně řečeno jinak, v AG1 VŽDY implementujeme graf pomocí Seznamu sousedů (std::vector<vector<int>>)! Šetří paměť a dává optimální čas O(n + m) pro BFS a DFS.",
      y,
    });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Výjimky z pravidla:",
      text: "Matici sousedství volíme pouze pro extrémně husté grafy (m ≈ n²) nebo v situacích, kdy algoritmus vyžaduje provádět miliony dotazů na existenci konkrétní hrany v čase O(1).",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.5a: C++ Třída Graph: Konstruktor & addEdge
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "💻 Implementace Grafu v C++: Struktura a Konstruktor", { level: 2, y, showUnderline: true });

    const cppGraphCode1 = `class Graph {
private:
    int n; // Počet vrcholů
    std::vector<std::vector<int>> adj; // Seznam sousedů

public:
    Graph(int vertices) : n(vertices), adj(vertices) {}

    // Přidání neorientované hrany mezi u a v
    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u); // Obousměrná vazba pro neorientovaný graf
    }
};`;

    renderDocCode(pres, slide, cppGraphCode1, { lang: "C++ (Základní grafová struktura)", y });
  }

  // --------------------------------------------------------------------------
  // Slide 7.5b: C++ Třída Graph: getNeighbors & Orientované hrany
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "💻 Implementace Grafu v C++" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Iterace Přes Sousedé a Orientované Grafy", { level: 2, y, showUnderline: true });

    const cppGraphCode2 = `// Získání konstantní reference na seznam sousedů vrcholu u
const std::vector<int>& getNeighbors(int u) const {
    return adj[u];
}

// Příklad iterace v BFS / DFS:
// for (int v : graph.getNeighbors(u)) { ... }`;

    y = renderDocCode(pres, slide, cppGraphCode2, { lang: "C++ (Metoda getNeighbors)", y });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Orientovaný graf:",
      text: "V orientovaném grafu voláme pouze adj[u].push_back(v); (hrana vede pouze jednosměrně z u do v, bez zpětného přidání do adj[v]).",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.6: 2. Dva Přístupy k Prohledávání: DFS vs. BFS
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2. Dva Přístupy k Prohledávání: DFS vs. BFS", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Při procházení grafu v C++ (např. při hledání cesty mezi startovním vrcholem **S** ($v_0$) a cílem **C** ($v_8$)) volíme mezi dvěma základními strategiemi:",
      { y }
    );

    y = renderDocTable(slide, {
      headers: ["Vlastnost", "DFS (Hloubkové prohledávání)", "BFS (Šířkové prohledávání)"],
      rows: [
        ["Datová struktura", "Zásobník (std::stack nebo rekurze)", "FIFO Fronta (std::queue)"],
        ["Strategie postupu", "Jde co nejhlouběji podél větve, až narazí na slepou uličku, pak couvá (backtracking).", "Šíří se po vlnoplochách jako vlna na vodě (nejdříve vzdálenost 1, pak 2...)."],
        ["Nalezená cesta", "Nalezne cestu oklikou (nezaručuje nejkratší počet hran).", "ZARUČENĚ nalezne NEJKRATŠÍ cestu v neohodnoceném grafu!"],
        ["Časová složitost", "O(n + m) při seznamu sousedů", "O(n + m) při seznamu sousedů"],
        ["Využití v praxi", "Detekce cyklů, topologické řazení, silně souvislé komponenty.", "Nejkratší cesty v neohodnocených sítích, minimální počet přestupů."]
      ],
      colWidths: [2.7, 4.5, 4.533],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 7.7: 3. Úloha: Analýza Proteinové Interakční Sítě (PPI) - Zadání
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3. Úloha: Analýza Proteinové Interakční Sítě (PPI)", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Mějme proteinovou síť popsanou neorientovaným grafem $G = (V, E)$ s $|V| = 6$ proteiny $\\{P_1, P_2, P_3, P_4, P_5, P_6\\}$ a množinou interakcí:\n$$E = \\{ \\{P_1, P_2\\}, \\{P_1, P_3\\}, \\{P_2, P_3\\}, \\{P_3, P_4\\}, \\{P_4, P_5\\}, \\{P_4, P_6\\} \\}$$",
      { y }
    );

    // ASCII PPI graf box
    const boxW = 10.0;
    const boxH = 1.8;
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
      "    ( P₁ ) ─── e₂ ─── ( P₃ ) ─── e₄ ─── ( P₄ ) ─── e₅ ─── ( P₅ )\n       │               /                   \\\n      e₁              /                     e₆\n       │             /                       \\\n    ( P₂ ) ─── e₃ ──┘                         ( P₆ )\n\n    [Trojúhelník P₁,P₂,P₃]      [Most e₄]       [Hvězda s listy P₅,P₆]",
      {
        x: 1.866,
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
    y += boxH + 0.15;

    y = renderDocList(slide, [
      "1. Určete stupně všech vrcholů $\\deg(P_i)$.",
      "2. Identifikujte proteiny s nejvyšším stupněm (Huby) a listy ($\\deg = 1$).",
      "3. Vypište matici sousedství $A$ tohoto grafu.",
      "4. Ověřte Handshaking Lemma $\\sum \\deg(v) = 2|E|$."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 7.8: 💡 Vzorové Řešení Úlohy PPI Sítě
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Úloha PPI Síť" });
    let y = 0.85;

    y = renderSolutionBanner(pres, slide, { title: "Vzorové Řešení: Analýza PPI Sítě", y });

    y = renderDocList(slide, [
      "**1. Stupně vrcholů:** $\\deg(P_1) = 2$, $\\deg(P_2) = 2$, $\\deg(P_3) = 3$, $\\deg(P_4) = 3$, $\\deg(P_5) = 1$ (list), $\\deg(P_6) = 1$ (list).",
      "**2. Huby a Listy:** Proteiny **P₃ a P₄ jsou huby** (nejvyšší stupeň $\\deg = 3$), spojené mostem $e_4$. Proteiny **P₅ a P₆ jsou listy** (koncové proteiny $\\deg = 1$).",
      "**3. Matice Sousedství A (6 × 6):**",
      "• Řádky P1 až P6: [0,1,1,0,0,0], [1,0,1,0,0,0], [1,1,0,1,0,0], [0,0,1,0,1,1], [0,0,0,1,0,0], [0,0,0,1,0,0].",
      "**4. Ověření Handshaking Lemmatu:** Počet hran $|E| = 6 \\implies 2|E| = 12$. Součet stupňů: $2 + 2 + 3 + 3 + 1 + 1 = 12$. Platí $12 = 12$ ✅."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Shrnutí pro zkoušku z AG1:",
      text: "Tento jednoduchý výpočet je standardní zahřívací úlohou u písemek na FIT ČVUT. Součet stupňů musí být VŽDY sudé číslo rovnající se 2|E|.",
      y,
    });
  }
}
