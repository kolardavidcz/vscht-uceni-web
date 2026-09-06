/**
 * Module 7: Grafy v C++ & Reprezentace v Paměti
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide,
  createProofSlide
} from "../pptx_engine.mjs";

export function addModule7Slides(pres) {
  const breadcrumb = "7 · Grafy v C++ & Reprezentace v Paměti";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 7,
    title: "Grafy v C++ & Reprezentace v Paměti",
    goal: "Ovládnout základní grafové pojmy (incidence, adjacence, Handshaking Lemma, sled, cesta, cyklus), pochopit paměťové reprezentace grafů v C++ (matice sousedství vs. seznam sousedů) a analyzovat chování DFS a BFS na reálných sítích.",
    topics: [
      "Minimum z grafových pojmů: Incidence, adjacence a Handshaking Lemma",
      "Sled (Walk), Cesta (Path) a Cyklus (Cycle)",
      "Počítačová reprezentace grafů v C++: Proč záleží na paměťové struktuře",
      "Matice sousedství (Adjacency Matrix): Paměť Θ(n²), test hrany O(1)",
      "Seznam sousedů (Adjacency List): Paměť Θ(n + m), průchod Θ(deg(u))",
      "Srovnání struktur: Kdy použít matici a kdy seznam sousedů",
      "C++ Implementace: Reprezentace grafu pomocí std::vector",
      "DFS (Depth-First Search): Mechanismus zásobníku a zanořování",
      "BFS (Breadth-First Search): Fronta, vlnoplochy a nejkratší cesta",
      "Trasování na konkrétním grafu: Proč DFS našlo 6 hran a BFS 4 hrany",
      "Úloha PPI: Analýza proteinové interakční sítě o 6 proteinech",
      "Stupně, Huby a Listy v biologických sítích",
      "Matice sousedství a ověření Handshaking Lemmatu pro PPI",
      "Shrnutí a doporučení pro zkouškové programování v PA2 a AG1"
    ]
  });

  // 2. Minimum Graph Terms
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Minimum z Grafových Pojmů",
    leftCard: {
      title: "Základní Vztahy Mezi Prvky",
      badge: "DEFINICE",
      type: "orange",
      items: [
        { bold: "Incidence:", text: "Vrchol u a hrana e jsou incidentní, pokud vrchol leží na hraně: u ∈ e." },
        { bold: "Adjacence (sousedství):", text: "Dva vrcholy u, v jsou sousední, pokud mezi nimi vede hrana: {u, v} ∈ E." },
        { bold: "Stupeň vrcholu deg(v):", text: "Počet incidentních hran vrcholu v. Izolovaný uzel má stupeň 0, list má stupeň 1." },
        { bold: "Handshaking Lemma:", text: "∑_{v∈V} deg(v) = 2|E|. Součet stupňů všech vrcholů je roven přesně dvojnásobku počtu hran!" }
      ]
    },
    rightCard: {
      title: "Typy Pohybu po Grafu",
      badge: "SLED vs. CESTA vs. CYKLUS",
      type: "emerald",
      items: [
        { bold: "Sled (Walk):", text: "Střídavá posloupnost (v₀, e₁, v₁, ..., e_k, v_k). Vrcholy i hrany se MOHOU opakovat (můžeme se vracet)." },
        { bold: "Cesta (Path):", text: "Sled, ve kterém se NEOPAKUJE ŽÁDNÝ VRCHOL (a tedy ani žádná hrana). Jednoduchý přímý průchod." },
        { bold: "Cyklus (Cycle):", text: "Uzavřený sled délky k ≥ 3, kde se neopakuje žádný vrchol kromě shody prvního a posledního (v₀ = v_k)." }
      ]
    }
  });

  // 3. Why Memory Representation Matters
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Počítačová Reprezentace Grafů v C++",
    leftCard: {
      title: "Dopad Volby Reprezentace",
      badge: "PA2 ➔ AG1 ROZDÍL",
      type: "orange",
      items: [
        { bold: "Klíčové rozhodnutí:", text: "Způsob uložení grafu do paměti rozhoduje o tom, zda program proběhne za 0.01 s, nebo skončí TLE (Time Limit Exceeded)." },
        { bold: "Typické zkouškové zadání:", text: "Graf má n = 100 000 vrcholů a m = 200 000 hran (řídký graf)." },
        { bold: "Chybná volba matice:", text: "n² prvků = 10¹⁰ bajtů ≈ 10 GB RAM ➔ okamžitý Memory Limit Exceeded / pád programu!" },
        { bold: "Správná volba seznamu:", text: "Uchová pouze reálné hrany: 200 000 prvků ≈ pár megabajtů RAM." }
      ]
    },
    rightCard: {
      title: "Dva Hlavní Přístupy",
      badge: "STRUKTURY",
      type: "blue",
      items: [
        { bold: "1. Matice sousedství (Adjacency Matrix):", text: "Dvojrozměrné pole n × n. Vhodné pro husté grafy (m ≈ n²) a okamžitý test hrany." },
        { bold: "2. Seznam sousedů (Adjacency List):", text: "Pole seznamů sousedů (vector<vector<int>>). Vhodné pro řídké grafy a průchody BFS/DFS." }
      ]
    }
  });

  // 4. Adjacency Matrix
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Matice Sousedství (Adjacency Matrix)",
    leftCard: {
      title: "Definice a Paměťové Chování",
      badge: "MATICE n × n",
      type: "orange",
      items: [
        { bold: "Definice:", text: "A[i][j] = 1 pokud {v_i, v_j} ∈ E, jinak A[i][j] = 0." },
        { bold: "Paměťová složitost:", text: "Θ(n²) bez ohledu na počet hran m. I prázdný graf bez hran zabírá celých n² buněk." },
        { bold: "Symetrie u neorientovaných grafů:", text: "A[i][j] = A[j][i]. Matice je symetrická podle hlavní diagonály." },
        { bold: "Smyčky:", text: "Pokud graf nemá smyčky, hlavní diagonála A[i][i] obsahuje samé nuly." }
      ]
    },
    rightCard: {
      title: "Výpočetní Operace v Matici",
      badge: "SLOŽITOSTI",
      type: "emerald",
      items: [
        { bold: "Test existence hrany {u, v}:", text: "O(1) – okamžitý přístup do pole na pozici A[u][v]." },
        { bold: "Průchod všech sousedů uzlu u:", text: "Θ(n) – musíme projít celý řádek délky n a otestovat každou nulu a jedničku." },
        { bold: "Vhodné použití:", text: "Husté sítě (m ≈ n²), Floyd-Warshallův algoritmus, maticové násobení pro počet sledů délky k." }
      ]
    }
  });

  // 5. Adjacency List
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "2. Seznam Sousedů (Adjacency List)",
    leftCard: {
      title: "Struktura Dynamických Seznamů",
      badge: "SEZNAM SOUSEDŮ",
      type: "emerald",
      items: [
        { bold: "Princip:", text: "Pro každý vrchol u ∈ V uchováváme dynamické pole sousedů: std::vector<int> adj[u]." },
        { bold: "Paměťová složitost:", text: "Θ(n + m). Optimální pro řídké grafy, ukládáme pouze existující vrcholy a hrany." },
        { bold: "Neorientovaný graf:", text: "Každá neorientovaná hrana {u, v} je uložena dvakrát: v v adj[u] a u v adj[v]." },
        { bold: "Orientovaný graf:", text: "Hrana (u, v) je uložena pouze jednou: v v seznamu adj[u]." }
      ]
    },
    rightCard: {
      title: "Výpočetní Operace v Seznamu",
      badge: "SLOŽITOSTI",
      type: "blue",
      items: [
        { bold: "Test existence hrany {u, v}:", text: "O(deg(u)) – musíme projít seznam sousedů vrcholu u." },
        { bold: "Průchod všech sousedů uzlu u:", text: "Θ(deg(u)) – procházíme pouze reálné sousedy bez testování neexistujících hran." },
        { bold: "Standard v praxi:", text: "BFS a DFS na seznamu sousedů běží v optimálním čase O(n + m)." }
      ]
    }
  });

  // 6. Comparison Table
  createThreeCardSlide(pres, {
    breadcrumb,
    title: "Srovnání: Matice Sousedství vs. Seznam Sousedů",
    card1: {
      title: "Paměťová Náročnost",
      badge: "RAM",
      type: "orange",
      items: [
        { bold: "Matice sousedství:", text: "Θ(n²) – kvadratická, nezávisí na počtu hran." },
        { bold: "Seznam sousedů:", text: "Θ(n + m) – lineární s velikostí grafu." },
        { bold: "Vítěz pro řídké grafy:", text: "Seznam sousedů (ušetří gigabajty RAM)." }
      ]
    },
    card2: {
      title: "Test Existence Hrany {u, v}",
      badge: "TEST HRANY",
      type: "emerald",
      items: [
        { bold: "Matice sousedství:", text: "O(1) – přímý index v poli." },
        { bold: "Seznam sousedů:", text: "O(deg(u)) – sekvenční vyhledání v poli." },
        { bold: "Vítěz pro dotazy:", text: "Matice sousedství (okamžitá odpověď)." }
      ]
    },
    card3: {
      title: "Průchod Sousedů (BFS / DFS)",
      badge: "PROHLEDÁVÁNÍ",
      type: "blue",
      items: [
        { bold: "Matice sousedství:", text: "Θ(n) na uzel ➔ celkem O(n²)." },
        { bold: "Seznam sousedů:", text: "Θ(deg(u)) na uzel ➔ celkem O(n + m)." },
        { bold: "Vítěz pro průchody:", text: "Seznam sousedů (běží v O(n + m))." }
      ]
    }
  });

  // 7. C++ Implementation
  createCodeSlide(pres, {
    breadcrumb,
    title: "C++ Kód: Reprezentace Grafu Seznamem Sousedů",
    code: `// C++ reprezentace neorientovaného neohodnoceného grafu
#include <iostream>
#include <vector>

class Graph {
public:
    int n; // počet vrcholů
    std::vector<std::vector<int>> adj; // seznam sousedů

    explicit Graph(int vertices) : n(vertices), adj(vertices) {}

    // Přidání neorientované hrany mezi u a v
    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // Výpis sousedů vrcholu u
    void printNeighbors(int u) const {
        std::cout << "Sousede vrcholu " << u << ": ";
        for (int v : adj[u]) {
            std::cout << v << " ";
        }
        std::cout << "\\n";
    }
};`,
    notes: [
      { bold: "adj[u]:", text: "Dynamický vektor obsahující všechny indexy sousedních vrcholů." },
      { bold: "Obousměrnost:", text: "U neorientovaného grafu se hrana vloží do obou seznamů adj[u] i adj[v]." },
      { bold: "Indexace od 0:", text: "Vrcholy číslujeme od 0 do n - 1 dle C++ konvence." }
    ]
  });

  // 8. DFS vs BFS Overview
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Dva Přístupy k Prohledávání: DFS vs. BFS",
    leftCard: {
      title: "DFS (Depth-First Search)",
      badge: "DO HLOUBKY (ZÁSOBNÍK)",
      type: "rose",
      items: [
        { bold: "Základní strategie:", text: "Vnořuje se co nejhlouběji podél jedné větve, dokud nenarazí na slepou uličku nebo cíl." },
        { bold: "Datová struktura:", text: "Zásobník (LIFO) nebo rekurzivní volání funkcí v programovém call stacku." },
        { bold: "Garance nejkratší cesty:", text: "NE! DFS najde libovolnou cestu, často dlouhou a oklikou." },
        { bold: "Využití:", text: "Topologické řazení DAGů, hledání silně souvislých komponent (Tarjan), detekce cyklů." }
      ]
    },
    rightCard: {
      title: "BFS (Breadth-First Search)",
      badge: "DO ŠÍŘKY (FRONTA)",
      type: "emerald",
      items: [
        { bold: "Základní strategie:", text: "Šíří se po koncentrických vlnoplochách (vrstva po vrstvě podle vzdálenosti od startu)." },
        { bold: "Datová struktura:", text: "Fronta (FIFO) – std::queue v C++." },
        { bold: "Garance nejkratší cesty:", text: "ANO! V neohodnoceném grafu BFS zaručeně najde cestu s minimálním počtem hran." },
        { bold: "Využití:", text: "Nejkratší cesty, test bipartitnosti grafu (2-obarvení), minimální počet kroků." }
      ]
    }
  });

  // 9. Tracing Graph Showcase: DFS vs BFS
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Trasování DFS vs. BFS na Ukázkovém Grafu",
    leftCard: {
      title: "Průchod DFS ze Startu S (v₀) do Cíle C (v₈)",
      badge: "6 HRAN (OKLIKA)",
      type: "rose",
      items: [
        { bold: "Postup zanoření:", text: "v₀ ─(e₁)→ v₁ ─(e₂)→ v₂ ─(e₃)→ v₃ ─(e₄)→ v₄ ─(e₇)→ v₆ ─(e₈)→ v₇." },
        { bold: "Slepá ulička v₇:", text: "Uzel v₇ nemá další neprozkoumané sousedy. DFS provede návrat (backtrack) do v₆." },
        { bold: "Dosažení cíle:", text: "Z v₆ po hraně e₉ dorazí do cíle v₈." },
        { bold: "Nalezená cesta:", text: "6 hran: {e₁, e₂, e₃, e₄, e₇, e₉}. Prozkoumala zbytečně spodní smyčku grafu!" }
      ]
    },
    rightCard: {
      title: "Průchod BFS ze Startu S (v₀) do Cíle C (v₈)",
      badge: "4 HRANY (NEJKRATŠÍ)",
      type: "emerald",
      items: [
        { bold: "Vlna 1:", text: "Ze startu v₀ navštíví v₁ (dole) i v₅ (nahoře) ve vzdálenosti 1." },
        { bold: "Vlna 2:", text: "Z v₅ expanduje do v₄ po hraně e₆." },
        { bold: "Vlna 3:", text: "Z v₄ expanduje do v₆ po hraně e₇." },
        { bold: "Vlna 4 (Cíl!):", text: "Z v₆ expanduje do cíle v₈ po hraně e₉. Nalezena nejkratší trasa o pouhých 4 hranách: {e₅, e₆, e₇, e₉}!" }
      ]
    }
  });

  // 10. PPI Network Task Statement
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Úloha: Analýza Proteinové Interakční Sítě (PPI)",
    card: {
      title: "Zadání Protein-Proteinové Sítě",
      badge: "BIOINFORMATICKÁ SÍŤ",
      type: "orange",
      items: [
        { bold: "Množina proteinů (|V| = 6):", text: "V = {P₁, P₂, P₃, P₄, P₅, P₆}." },
        { bold: "Množina interakcí (|E| = 6):", text: "E = {{P₁, P₂}, {P₁, P₃}, {P₂, P₃}, {P₃, P₄}, {P₄, P₅}, {P₄, P₆}}." },
        { bold: "Otázka 1:", text: "Určete stupně všech vrcholů deg(P_i)." },
        { bold: "Otázka 2:", text: "Identifikujte proteiny s nejvyšším stupněm (Huby) a listy (deg(v) = 1)." },
        { bold: "Otázka 3:", text: "Sestrojte matici sousedství A tohoto grafu." },
        { bold: "Otázka 4:", text: "Ověřte platnost Handshaking Lemmatu ∑ deg(v) = 2|E|." }
      ]
    }
  });

  // 11. PPI Solution: Degrees, Hubs and Leaves
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Řešení PPI: Stupně, Huby a Listy",
    leftCard: {
      title: "Stupně Vrcholů deg(P_i)",
      badge: "POČET INTERAKCÍ",
      type: "blue",
      items: [
        { bold: "P₁ (deg = 2):", text: "Sousedí přes hrany e₁, e₂ s proteiny P₂ a P₃." },
        { bold: "P₂ (deg = 2):", text: "Sousedí přes hrany e₁, e₃ s proteiny P₁ a P₃." },
        { bold: "P₃ (deg = 3):", text: "Sousedí přes hrany e₂, e₃, e₄ s proteiny P₁, P₂ a P₄." },
        { bold: "P₄ (deg = 3):", text: "Sousedí přes hrany e₄, e₅, e₆ s proteiny P₃, P₅ a P₆." },
        { bold: "P₅ (deg = 1):", text: "Sousedí pouze přes hranu e₅ s proteinem P₄." },
        { bold: "P₆ (deg = 1):", text: "Sousedí pouze přes hranu e₆ s proteinem P₄." }
      ]
    },
    rightCard: {
      title: "Biologická Interpretace: Huby a Listy",
      badge: "STRUKTURA SÍTĚ",
      type: "emerald",
      items: [
        { bold: "Lokální Huby (P₃ a P₄):", text: "Proteiny s nejvyšším stupněm (deg = 3). Tvoří klíčové komunikační uzly spojené mostem e₄." },
        { bold: "Periferní Listy (P₅ a P₆):", text: "Proteiny se stupněm deg = 1. Koncové molekuly vázané výhradně na hub P₄." },
        { bold: "Trojúhelníkový modul:", text: "Proteiny P₁, P₂, P₃ tvoří těsně vázaný proteinový komplex (kliku K₃)." }
      ]
    }
  });

  // 12. PPI Adjacency Matrix and Handshaking
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Řešení PPI: Matice Sousedství & Handshaking",
    leftCard: {
      title: "Matice Sousedství A (6 × 6)",
      badge: "BINÁRNÍ REPREZENTACE",
      type: "orange",
      items: [
        { bold: "Řádek P₁:", text: "[0, 1, 1, 0, 0, 0] – sousedé P₂, P₃." },
        { bold: "Řádek P₂:", text: "[1, 0, 1, 0, 0, 0] – sousedé P₁, P₃." },
        { bold: "Řádek P₃:", text: "[1, 1, 0, 1, 0, 0] – sousedé P₁, P₂, P₄." },
        { bold: "Řádek P₄:", text: "[0, 0, 1, 0, 1, 1] – sousedé P₃, P₅, P₆." },
        { bold: "Řádek P₅:", text: "[0, 0, 0, 1, 0, 0] – soused P₄." },
        { bold: "Řádek P₆:", text: "[0, 0, 0, 1, 0, 0] – soused P₄." }
      ]
    },
    rightCard: {
      title: "Ověření Handshaking Lemmatu",
      badge: "∑ deg(v) = 2|E|",
      type: "emerald",
      items: [
        { bold: "Počet hran |E|:", text: "Máme celkem 6 hran (e₁ až e₆). Pravá strana: 2|E| = 2 × 6 = 12." },
        { bold: "Součet stupňů:", text: "∑ deg(P_i) = 2 + 2 + 3 + 3 + 1 + 1 = 12." },
        { bold: "Rovnost:", text: "12 = 12 ✅. Věta o podání rukou bezchybně platí." },
        { bold: "Počet jedniček v matici:", text: "Součet všech prvků matice A je přesně 12 (každá neorientovaná hrana dává dvě jedničky)." }
      ]
    }
  });

  // 13. Summary Checklist
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Shrnutí Modulu 7: Grafy v C++ ke Zkoušce",
    card: {
      title: "Zkouškový Přehled Reprezentace Grafů",
      badge: "LETNÍ PŘÍPRAVA NA AG1",
      type: "orange",
      items: [
        { bold: "Incidence vs. Adjacence:", text: "Incidence je vztah vrchol-hrana (u ∈ e). Adjacence je vztah vrchol-vrchol ({u, v} ∈ E)." },
        { bold: "Volba reprezentace v C++:", text: "V 95 % úloh v PA2/AG1 volte seznam sousedů (vector<vector<int>>). Šetří paměť a dává lineární čas O(n + m)." },
        { bold: "Matice sousedství:", text: "Použijte pouze při hustých grafech (m ≈ n²) nebo když potřebujete testovat existenci hrany v čase O(1)." },
        { bold: "BFS pro nejkratší cestu:", text: "BFS s frontou garantuje minimální počet hran na cestě v neohodnoceném grafu. DFS tuto vlastnost nemá!" },
        { bold: "Handshaking Lemma:", text: "Součet stupňů je vždy sudé číslo 2|E|. Z toho plyne, že graf má vždy sudý počet vrcholů s lichým stupněm." }
      ]
    }
  });
}
