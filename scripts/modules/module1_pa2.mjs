/**
 * Module 1: PA2 C++ Most k Algoritmům a Grafům (AG1)
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide,
  cleanText
} from "../pptx_engine.mjs";

export function addModule1Slides(pres) {
  const breadcrumb = "1 · PA2 C++ Most k AG1";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 1,
    title: "PA2 C++ Most k Algoritmům a Grafům (AG1)",
    goal: "Propojit praktické programování v C++ (RAII, STL kontejnery, paměťový model) z předmětu PA2 s formálními požadavky na algoritmickou korektnost, asymptotickou složitost a matematické důkazy v AG1.",
    topics: [
      "Posun perspektivy z kódu na matematické důkazy",
      "STL kontejnery mapované na grafové koncepty",
      "BFS: Kód vs. matematický invariant cyklu",
      "Dijkstra: Min-halda a invariant správnosti",
      "DFS a prevence Stack Overflow (Call stack vs halda)",
      "DSU (Disjoint Set Union) pro Kruskalův MST",
      "Asymptotické složitosti STL operací a Fast I/O",
      "7 nejčastějších chyb při přechodu z PA2 do AG1"
    ]
  });

  // 2. Shift in Perspective
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Od Psaní Kódu v C++ k Matematickým Důkazům",
    leftCard: {
      title: "Předmět BI-PA2 (Kód a Praxe)",
      badge: "PA2 PERSPEKTIVA",
      type: "neutral",
      items: [
        { bold: "Hlavní cíl:", text: "Napsat fungující robustní C++ program splňující zadání." },
        { bold: "Správa paměti:", text: "RAII, destruktory, chytré ukazatele (std::unique_ptr, std::shared_ptr)." },
        { bold: "Validace:", text: "Automatické testy v Progtestu, memory leaks (Valgrind)." },
        { bold: "Styl myšlení:", text: "Imperativní kroky, smyčky, syntaxe a práce s ukazateli v paměti." }
      ]
    },
    rightCard: {
      title: "Předmět BI-AG1 (Teorie a Důkazy)",
      badge: "AG1 PERSPEKTIVA",
      type: "warm",
      items: [
        { bold: "Hlavní cíl:", text: "Kód je pouze implementací abstraktního matematického konceptu." },
        { bold: "Asymptotická analýza:", text: "Rigorózní důkaz časové a paměťové složitosti (O, Ω, Θ)." },
        { bold: "Důkazy korektnosti:", text: "Matematická indukce, invarianty cyklů a důkazy sporem." },
        { bold: "Styl myšlení:", text: "Množinový formalismus G = (V, E), řezy v grafu a globální vlastnosti." }
      ]
    }
  });

  // 3. STL to AG1 Concept Mapping Table
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Mapa Propojení C++ STL Kontejnerů a AG1",
    cardTitle: "Jak Datové Struktury PA2 Odpovídají Grafové Teorii",
    badge: "STL MAPOVÁNÍ",
    type: "warm",
    items: [
      { bold: "std::vector<std::vector<int>>:", text: "Seznam sousedů grafu (Adjacency List) – paměťově optimální pro řídké biologické sítě Θ(n + m)." },
      { bold: "std::queue<int>:", text: "FIFO fronta prohledávání do šířky (BFS) – udržuje vlnoplochu a garantuje nalezení nejkratší neohodnocené cesty." },
      { bold: "std::priority_queue<Edge, vector<Edge>, greater<Edge>>:", text: "Min-prioritní halda pro Dijkstrův a Primův algoritmus – výběr nejbližšího uzlu v O(log n)." },
      { bold: "std::vector<tuple<int,int,int>> + DSU:", text: "Edge List pro Kruskalův MST algoritmus – test existence cyklu a řezová vlastnost v téměř O(1)." },
      { bold: "std::stack<int>:", text: "Zásobník pro iterativní prohledávání do hloubky (DFS) – ochrana před vyčerpáním systémového zásobníku (Stack Overflow)." },
      { bold: "std::vector<bool> visited:", text: "Množina vyřízených vrcholů S – bitová specializace šetřící 87.5 % paměti (1 bit / uzel)." }
    ]
  });

  // 4. Adjacency List Implementation
  createCodeSlide(pres, {
    breadcrumb,
    title: "Reprezentace: Seznam Sousedů v C++",
    leftCard: {
      title: "Vlastnosti a Analýza pro AG1",
      badge: "TEORIE",
      type: "warm",
      items: [
        { bold: "Použití v praxi:", text: "Řídké grafy, kde počet hran m = O(n), což platí pro většinu biologických a chemických sítí." },
        { bold: "Paměťová složitost:", text: "Θ(n + m) – alokujeme přesně tolik paměti, kolik je vrcholů a existujících hran." },
        { bold: "Procházení sousedů u:", text: "Trvá Θ(deg(u)) kroků. Pro celý graf celkem ∑ deg(u) = 2m operací." },
        { bold: "Výhoda:", text: "Algoritmy BFS i DFS na seznamu sousedů proběhnou v lineárním čase O(n + m)." }
      ]
    },
    codeBlock: {
      title: "Graf reprezentovaný jako std::vector<std::vector<int>>",
      code: `#include <vector>
#include <iostream>

class Graph {
public:
    int n; // Počet vrcholů 0 až n-1
    std::vector<std::vector<int>> adj;

    Graph(int vertices) : n(vertices), adj(vertices) {}

    void addEdge(int u, int v, bool directed = false) {
        adj[u].push_back(v);
        if (!directed) {
            adj[v].push_back(u);
        }
    }
};`,
      analysisItems: [
        "Vkládání hrany trvá O(1) amortizovaně.",
        "Pro neorientovaný graf se každá hrana uloží dvakrát (adj[u] i adj[v])."
      ]
    }
  });

  // 5. BFS Side by Side
  createCodeSlide(pres, {
    breadcrumb,
    title: "BFS: Kód vedle Matematiky (Side by Side)",
    leftCard: {
      title: "Matematický Pohled (AG1)",
      badge: "AG1 MATEMATIKA",
      type: "warm",
      items: [
        { bold: "Startovní vrchol s:", text: "Počáteční bod vlnoplochy, vzdálenost δ(s, s) = 0." },
        { bold: "Pole vzdáleností d[v]:", text: "-1 značí dosud nenavštívený uzel (nekonečno v teorii)." },
        { bold: "Fronta Q (FIFO):", text: "Udržuje hranici vlny. Vrcholy jsou řazeny monotónně dle vzdálenosti." },
        { bold: "Vlnový princip:", text: "Nejprve navštívíme všechny vrcholy ve vzdálenosti k, teprve pak k + 1." }
      ]
    },
    codeBlock: {
      title: "Prohledávání do šířky v C++",
      code: `std::vector<int> bfs(int s, const Graph& G) {
    std::vector<int> dist(G.n, -1);
    std::queue<int> q;

    dist[s] = 0; // INICIALIZACE: d[s] = 0
    q.push(s);

    while (!q.empty()) {
        int u = q.front(); q.pop();

        for (int v : G.adj[u]) {
            if (dist[v] == -1) { // Nenavštíveno
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist; // UKONČENÍ: d[v] = delta(s, v)
}`,
      analysisItems: [
        "Operace fronty push() a pop() jsou O(1).",
        "Každý uzel vstoupí do fronty nejvýše jednou → složitost O(n + m)."
      ]
    }
  });

  // 6. BFS Loop Invariant
  createThreeCardSlide(pres, {
    breadcrumb,
    title: "BFS: Matematický Invariant Cyklu",
    cards: [
      {
        title: "1. Inicializace (Před cyklem)",
        badge: "FÁZE 1",
        type: "warm",
        items: [
          { bold: "Počáteční stav:", text: "Fronta Q obsahuje pouze uzel s, d[s] = 0." },
          { bold: "Ostatní uzly:", text: "Všechny ostatní uzly mají dist[v] = -1." },
          { bold: "Platnost:", text: "Vzdálenost δ(s, s) = 0 je triviálně správná. Invariant před prvním krokem drží." }
        ]
      },
      {
        title: "2. Udržování (Během cyklu)",
        badge: "FÁZE 2",
        type: "neutral",
        items: [
          { bold: "Monotónnost fronty:", text: "Pokud jsou ve frontě vrcholy, jejich d-hodnoty se liší nejvýše o 1." },
          { bold: "Tvar fronty:", text: "Prvky tvoří neklesající posloupnost: d[u] ∈ {k, k + 1}." },
          { bold: "Relaxace hrany:", text: "Když objevíme v přes u, platí d[v] = d[u] + 1 = k + 1." }
        ]
      },
      {
        title: "3. Ukončení (Po vyprázdnění)",
        badge: "FÁZE 3",
        type: "emerald",
        items: [
          { bold: "Kritérum:", text: "Cyklus skončí, jakmile je fronta Q prázdná." },
          { bold: "Finální garance:", text: "Pro každý dosažitelný uzel platí d[v] = δ(s, v)." },
          { bold: "Nedosažitelné uzly:", text: "Zůstávají d[v] = -1 (odpovídá vzdálenosti ∞)." }
        ]
      }
    ]
  });

  // 7. Dijkstra & Priority Queue
  createCodeSlide(pres, {
    breadcrumb,
    title: "Dijkstra: Min-Halda a Nejkratší Cesty",
    leftCard: {
      title: "Proč Nestačí Obyčejná Fronta?",
      badge: "VÁHY HRAN",
      type: "warm",
      items: [
        { bold: "Rozdíl oproti BFS:", text: "Hrany mají kladné nezáporné váhy w(u, v) ≥ 0." },
        { bold: "FIFO selhává:", text: "Cesta přes 2 hrany může mít váhu 2, zatímco přímá hrana váhu 100!" },
        { bold: "Min-Halda:", text: "Musíme expandovat uzel s nejmenší dosavadní vzdáleností d[u]." },
        { bold: "Složitost:", text: "O((n + m) log n) při použití std::priority_queue." }
      ]
    },
    codeBlock: {
      title: "Dijkstrův algoritmus s std::priority_queue",
      code: `using Edge = std::pair<int, int>; // (váha w, uzel v)

std::vector<int> dijkstra(int s, int n, 
    const std::vector<std::vector<Edge>>& adj) {
    std::vector<int> dist(n, 1e9);
    // Min-halda: menší vzdálenost má přednost
    std::priority_queue<Edge, std::vector<Edge>, 
                        std::greater<Edge>> pq;

    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue; // Zastaralý prvek

        for (auto [w, v] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      analysisItems: [
        "std::greater zajišťuje vyjmutí minimálního prvku.",
        "Kontrola d > dist[u] přeskočí neaktuální kopie v haldě."
      ]
    }
  });

  // 8. Dijkstra Invariant & Negative Edge Warning
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Dijkstra: Invariant a Past Záporných Hran",
    leftCard: {
      title: "Klíčový Invariant pro AG1 Důkaz",
      badge: "DŮKAZ SPOREM",
      type: "emerald",
      items: [
        { bold: "Invariant:", text: "Při každém vyskočení vrcholu u z prioritní fronty platí, že d[u] = δ(s, u) (finální minimální vzdálenost)." },
        { bold: "Důkaz sporem:", text: "Kdyby existovala kratší cesta P' do u, musela by opustit množinu hotových uzlů přes nějakou hranu (x, y)." },
        { bold: "Rozpor:", text: "Protože váhy jsou nezáporné, délka P' by byla ≥ d[x] ≥ d[u], což odporuje tomu, že je kratší. SPOR!" }
      ]
    },
    rightCard: {
      title: "⚠️ Proč Dijkstra Selže na Záporných Hranách?",
      badge: "KRITICKÁ PAST",
      type: "rose",
      items: [
        { bold: "Problém záporné váhy:", text: "Záporná hrana w(x, y) < 0 může dodatečně zkrátit cestu přes uzel, který již byl dříve uzavřen!" },
        { bold: "Narušení greedy principu:", text: "Předpoklad 'délka roste s počtem hran' přestává platit." },
        { bold: "Zkouškový požadavek:", text: "Pro grafy se zápornými hranami se v AG1 používá Bellman-Ford O(n · m), nikoliv Dijkstra!" }
      ]
    }
  });

  // 9. DFS Call Stack vs Stack Overflow
  createCodeSlide(pres, {
    breadcrumb,
    title: "DFS: Rekurze a Riziko Stack Overflow",
    leftCard: {
      title: "Past Rekurzivního Volání",
      badge: "PAMĚŤOVÝ LIMIT",
      type: "rose",
      items: [
        { bold: "Problém:", text: "Pro graf ve tvaru dlouhé cesty P_n s n = 10^5 uzly vytvoří rekurze 100 000 rámců na systémovém zásobníku." },
        { bold: "Limit Call Stacku:", text: "V Linuxu/WSL je zásobník omezen obvykle na 8 MB. Každý rámec zabere 64–128 B." },
        { bold: "Výsledek v testu:", text: "Segmentation fault (Stack Overflow) i při správné logice!" },
        { bold: "Řešení:", text: "Použít iterativní DFS se std::stack alokovaným na haldě (Heap)." }
      ]
    },
    codeBlock: {
      title: "Bezpečné Iterativní DFS se std::stack",
      code: `#include <stack>
#include <vector>

void iterativeDFS(int start, const Graph& G) {
    std::vector<bool> visited(G.n, false);
    std::stack<int> stk;

    stk.push(start);

    while (!stk.empty()) {
        int u = stk.top(); stk.pop();
        if (visited[u]) continue;
        visited[u] = true;

        for (int v : G.adj[u]) {
            if (!visited[v]) {
                stk.push(v);
            }
        }
    }
}`,
      analysisItems: [
        "std::stack alokuje vnitřní paměť na haldě (Heap) s kapacitou v řádu GB.",
        "Matematicky prohledá tytéž vrcholy jako rekurzivní varianta."
      ]
    }
  });

  // 10. DSU (Disjoint Set Union)
  createCodeSlide(pres, {
    breadcrumb,
    title: "DSU (Disjoint Set Union) pro Kruskalův MST",
    leftCard: {
      title: "Princip a Složitost DSU",
      badge: "DATOVÁ STRUKTURA",
      type: "warm",
      items: [
        { bold: "Účel v AG1:", text: "Rychlá detekce, zda nová hrana (u, v) vytvoří cyklus při budování minimální kostry (MST)." },
        { bold: "Path Compression:", text: "Při volání find(x) přesměrujeme ukazatel přímo na kořen komponenty." },
        { bold: "Union by Rank:", text: "Menší strom připojujeme pod kořen většího stromu pro zploštění hloubky." },
        { bold: "Složitost operací:", text: "O(α(n)) amortizovaně na operaci (inverzní Ackermannova funkce, prakticky ≤ 4)." }
      ]
    },
    codeBlock: {
      title: "Implementace DSU s Path Compression",
      code: `struct DSU {
    std::vector<int> parent, rank;

    DSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // Path compression
        return parent[x];
    }

    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false; // Cyklus!

        if (rank[a] < rank[b]) std::swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b]) rank[a]++;
        return true; // Úspěšně spojeno
    }
};`,
      analysisItems: [
        "unite() vrátí false přesně tehdy, když hrana tvoří cyklus.",
        "Kruskalův MST s DSU běží v čase O(m log m)."
      ]
    }
  });

  // 11. STL Complexity Overview
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Asymptotické Složitosti C++ STL Kontejnerů",
    cardTitle: "Přehled Operací pro Analýzu Algoritmů v AG1",
    badge: "SLOŽITOST V C++",
    type: "neutral",
    items: [
      { bold: "std::vector::push_back(x):", text: "O(1) amortizovaně, O(n) při realokaci paměti (pro seznamy sousedů vkládáme v O(1))." },
      { bold: "std::vector::operator[]:", text: "Θ(1) přímý přístup do paměti přes bázový ukazatel (pro pole vzdáleností a matice)." },
      { bold: "std::queue::push(x) / pop():", text: "Θ(1) obousměrná fronta pro BFS bez jakéhokoliv posunu prvků." },
      { bold: "std::stack::push(x) / pop():", text: "Θ(1) zásobníkové operace LIFO pro iterativní DFS." },
      { bold: "std::priority_queue::push(x) / pop():", text: "O(log n) probublávání v binární haldě (Dijkstra, Prim, Huffmanovo kódování)." },
      { bold: "std::priority_queue::top():", text: "Θ(1) okamžitý přístup k minimálnímu / maximálnímu prvku na vrcholu." },
      { bold: "std::unordered_map::find(x):", text: "O(1) průměrně, O(n) v nejhorším případě při kolizích v hashovací tabulce." }
    ]
  });

  // 12. Fast I/O
  createCodeSlide(pres, {
    breadcrumb,
    title: "Fast I/O v C++ pro Úlohy s Miliony Hran",
    leftCard: {
      title: "Proč Progtest Hlásí Time Limit?",
      badge: "I/O OPTIMALIZACE",
      type: "warm",
      items: [
        { bold: "Příčina TLE:", text: "std::cin a std::cout jsou ve výchozím stavu synchronizované s C funkcemi scanf/printf." },
        { bold: "std::endl:", text: "Vypisuje znak nového řádku a zároveň volá fflush(), což zpozdí běh programu až 10×!" },
        { bold: "Zkouškové pravidlo:", text: "Vždy na začátek funkce main() vložte synchronizační direktivy a používejte '\n'." }
      ]
    },
    codeBlock: {
      title: "Rychlý I/O Template pro AG1 a PA2",
      code: `#include <iostream>

int main() {
    // 1. Vypnutí synchronizace s C stdio
    std::ios_base::sync_with_stdio(false);

    // 2. Odpojení std::cin od std::cout
    std::cin.tie(nullptr);

    // 3. Používejte '\\n' místo std::endl!
    // std::cout << result << '\\n';

    return 0;
}`,
      analysisItems: [
        "Zrychlí načítání 1 000 000 hran z cca 1.8 s na 0.15 s.",
        "Zamezí neoprávněnému pádu na Time Limit Exceeded v testovacím prostředí."
      ]
    }
  });

  // 13. Top 7 PA2 -> AG1 Mistakes
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "7 Nejčastějších Chyb při Přechodu z PA2 do AG1",
    leftCard: {
      title: "Co Fungovalo v PA2 (Ale v AG1 Selže)",
      badge: "❌ PA2 MYŠLENÍ",
      type: "rose",
      items: [
        { bold: "Off-by-one v indexech:", text: "Spoléhání na 0..n-1 bez formální specifikace množiny V." },
        { bold: "Nesouvislé grafy:", text: "Spuštění BFS pouze z uzlu 0 (opomene izolované komponenty)." },
        { bold: "int přetečení:", text: "Při relaxaci d[u] + w dojde k overflow, pokud d[u] = INT_MAX." },
        { bold: "Záporné hrany:", text: "Použití Dijkstry na graf s w < 0 (kód zdánlivě projde, důkaz je špatně)." }
      ]
    },
    rightCard: {
      title: "Co Požaduje Rigorózní AG1",
      badge: "✅ AG1 POŽADAVEK",
      type: "emerald",
      items: [
        { bold: "Přesná definice grafu:", text: "Vždy definujte V = {0, ..., n - 1} a množinu hran E ⊆ V × V." },
        { bold: "Průchod všemi komponentami:", text: "Smyčka přes všechny dosud nenavštívené uzly v grafu." },
        { bold: "Ochrana před overflow:", text: "Před přičtením ověřit: if (dist[u] != INF) dist[v] = dist[u] + w." },
        { bold: "Správná volba algoritmu:", text: "Na záporné hrany Bellman-Ford O(n·m) nebo detekce záporného cyklu." }
      ]
    }
  });

  // 14. Exam Self-Test Checklist
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Zkouškový Checklist: Jsem Připraven na AG1?",
    cardTitle: "8 Bodů pro Zvládnutí Algoritmů a Grafů",
    badge: "KONTROLNÍ SEZNAM",
    type: "emerald",
    items: [
      { bold: "1. BFS z hlavy:", text: "Umím napsat BFS bez nápovědy a vysvětlit vztah d[v] = d[u] + 1." },
      { bold: "2. Min-Halda:", text: "Vím, proč std::priority_queue se std::greater<> dává min-haldu a co je top()." },
      { bold: "3. Dijkstra relaxace:", text: "Chápu podmínku d > dist[u] pro přeskočení neaktuálních kopií." },
      { bold: "4. Reprezentace v paměti:", text: "Rozumím rozdílu mezi maticí O(n²) a seznamem sousedů O(n + m)." },
      { bold: "5. Iterativní DFS:", text: "Vím, kdy hrozí Stack Overflow a jak ho eliminovat pomocí std::stack na haldě." },
      { bold: "6. DSU a Kruskal:", text: "Chápu, jak find() a unite() zajišťují test acykličnosti v téměř O(1)." },
      { bold: "7. Invariant cyklu:", text: "Zvládnu zapsat invariant ve 3 fázích: Inicializace, Udržování, Ukončení." },
      { bold: "8. Záporné hrany:", text: "Vím, proč Dijkstra nefunguje na záporných hranách a jaký spor nastane v důkazu." }
    ]
  });
}
