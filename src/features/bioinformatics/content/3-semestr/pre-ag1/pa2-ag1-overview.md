# Průvodce: PA2 C++ Most k Algoritmům a Grafům (AG1)

> **[Relevance: 95%]** · **Tags:** `[INSIGHT]` `[BIO-ANALOGIE]` `[EPIC]`
> **Cíl příručky:** Propojit praktické znalosti programování v C++ z předmětu **BI-PA2** s teoretickými požadavky na algoritmickou korektnost, datové struktury, paměťový model a matematické důkazy v předmětu **AG1 (Algoritmy a Grafy 1)** na FIT ČVUT.

---

## 1. Od Psaní Kódu v C++ k Matematickým Důkazům v AG1 `[INSIGHT]`

V předmětu **PA2** (Programování a Algoritmy 2) jste se učili psát funkční C++ kód, spravovat paměť (RAII, indikátory, `std::unique_ptr`), řešit objektové návrhy a procházet automatickými testy Progtestu.

V předmětu **AG1** dochází k posunu perspektivy:
- Kód v C++ již není konečným cílem, ale **pouhou implementací matematického konceptu**.
- Důraz se přesouvá od sintaxe C++ k **dokazování časové složitosti ($\mathcal{O}, \Omega, \Theta$)** a **matematické korektnosti algoritmů** pomocí invariantů cyklů a dekonstrukční indukce.

Tato příručka vám ukáže, jak přesně datové struktury C++ Standard Template Library (STL) odpovídají konceptům našich 7 modulů kurzu pre-AG1.

---

## 2. Mapa Propojení C++ STL Kontejnérů a 7 Modulů AG1 `[Relevance: 100%]` `[EPIC]`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┐
│ Datová Struktura v C++ (PA2)         │ Formální Grafový Koncept (AG1)       │ Modul Pre-AG1                        │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
│ std::vector<std::vector<int>>        │ Seznam Sousedů Grafu (Adjacency List)│ Modul 0 (Bio-grafy & C++ reprezentace)│
│ std::queue<int>                      │ FIFO Fronta Prohledávání do Šířky    │ Modul 4 (BFS & Invariant Vlnoplochy) │
│ std::priority_queue<std::pair<int,int>>│ Min-Prioritní Halda pro Dijkstru/Prima│ Modul 4 & Modul 5 (Greedy & MST)     │
│ std::vector<std::pair<int, std::pair>>│ Edge List pro Kruskalův MST Algoritmus│ Modul 5 (Cut Property & DSU)         │
│ std::stack<int>                      │ Zásobník pro Prohledávání do Hloubky │ Modul 2 & Modul 4 (Iterativní DFS)   │
│ std::vector<bool> visited            │ Množina Vyřízených Vrcholů S         │ Modul 3 & Modul 4 (Důkazy Sporem)    │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 3. Detailní Analýza Datových Struktur v C++ pro AG1

---

### 3.1 Seznam Sousedů: `std::vector<std::vector<int>>` `[Relevance: 95%]`

Pro reprezentaci řídkých biologických grafů ($m = \mathcal{O}(n)$) používáme dynamické pole vektorů:

```cpp
#include <vector>
#include <iostream>

// Graf s n vrcholy číselovanými 0 až n-1
class Graph {
public:
    int n;
    std::vector<std::vector<int>> adj;

    Graph(int vertices) : n(vertices), adj(vertices) {}

    void addEdge(int u, int v, bool directed = false) {
        adj[u].push_back(v);
        if (!directed) {
            adj[v].push_back(u);
        }
    }
};
```

#### 📊 Propojení s AG1:
- **Paměťová složitost:** $\Theta(n + m)$ – optimální využití paměti pro řídké biologické sítě.
- **Procházení sousedů vrcholu $u$:** Trvá $\Theta(\deg(u))$ kroků. Při procházení celého grafu přes BFS/DFS spotřebuje celkem $\sum_{u \in V} \deg(u) = 2m$ kroků. Celková časová složitost je tedy **$\Theta(n + m)$**.

---

### 3.2 FIFO Fronta pro BFS: `std::queue<int>` `[Relevance: 100%]` `[MEGA EPIC]`

Prohledávání do šířky (BFS) udržuje rozhraní vlny pomocí FIFO fronty:

```cpp
#include <queue>
#include <vector>

std::vector<int> runBFS(const Graph& G, int startNode) {
    std::vector<int> dist(G.n, -1);
    std::queue<int> Q;

    dist[startNode] = 0;
    Q.push(startNode);

    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();

        for (int v : G.adj[u]) {
            if (dist[v] == -1) { // Dosud nenavštívený uzel
                dist[v] = dist[u] + 1;
                Q.push(v);
            }
        }
    }
    return dist;
}
```

#### 📊 Propojení s AG1 (Modul 4 Invarianty):
- Operace `Q.push()` a `Q.pop()` mají amortizovanou složitost **$\mathcal{O}(1)$**.
- **Invariant cyklu:** Vzdálenosti prvků ve frontě $Q$ splňují $d[v_r] \le d[v_1] + 1$ a tvoří nemonotónní posloupnost.

---

### 3.3 Prioritní Halda pro Dijkstrův a Primův Algoritmus: `std::priority_queue` `[Relevance: 100%]`

Dijkstrův a Primův algoritmus vyžadují v každém kroku vybrání vrcholu s **minimální reálnou vzdáleností / vahou**. K tomu slouží Min-Prioritní Halda:

```cpp
#include <queue>
#include <vector>
#include <functional>

using EdgeWeight = std::pair<int, int>; // (vzdálenost d[u], uzel u)

void runDijkstra(int n, int startNode, const std::vector<std::vector<EdgeWeight>>& adj) {
    std::vector<int> dist(n, 1e9);
    // std::greater zajišťuje, že na vrcholu haldy je MINIMÁLNÍ prvek!
    std::priority_queue<EdgeWeight, std::vector<EdgeWeight>, std::greater<EdgeWeight>> minHeap;

    dist[startNode] = 0;
    minHeap.push({0, startNode});

    while (!minHeap.empty()) {
        auto [d, u] = minHeap.top();
        minHeap.pop();

        if (d > dist[u]) continue; // Přeskočení zastaralého záznamu v haldě

        for (auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                minHeap.push({dist[v], v}); // Vložení do haldy za O(log N)
            }
        }
    }
}
```

#### 📊 Propojení s AG1 (Modul 4 & Modul 5):
- Vložení do prioritní haldy trvá $\mathcal{O}(\log n)$.
- Celková časová složitost Dijkstrova algoritmu s min-haldou je **$\mathcal{O}((n + m) \log n)$**.

---

### 3.4 Paměťové Limity: Rekurze u DFS vs. Stack Overflow `[PAST U ZKOUŠKY]`

V předmětu PA2 jste zvyklí psát rekurzivní funkce. V teorii grafů a algoritmech AG1 má rekurzivní prohledávání do hloubky (DFS) skrytou past: **Stack Overflow (přetečení zásobníku volání)**!

#### ⚠️ Proč rekurzivní DFS selže na velkých grafech?
Pokud má graf $G$ formu dlouhé jednoduché cesty $P_n$ o $n = 10^6$ vrcholech, rekurzivní DFS vytvoří $10^6$ zanořených rámců na zásobníku (Call Stack).
- Výchozí velikost zásobníku v Linuxu/WSL bývá **8 MB**.
- Jeden rekurzivní rámec funkce zabere cca 64-128 bajtů.
- Při hloubce rekurze $> 100\,000$ program spadne na chybové hlášení **Segmentation Fault (Stack Overflow)**!

#### ✅ Řešení v C++ pro AG1: Iterativní DFS se `std::stack<int>`
```cpp
#include <stack>
#include <vector>

void iterativeDFS(const Graph& G, int startNode) {
    std::vector<bool> visited(G.n, false);
    std::stack<int> S;

    S.push(startNode);

    while (!S.empty()) {
        int u = S.top();
        S.pop();

        if (!visited[u]) {
            visited[u] = true;
            
            for (int v : G.adj[u]) {
                if (!visited[v]) {
                    S.push(v);
                }
            }
        }
    }
}
```
*Výhoda:* Paměť zásobníku `std::stack` se alokuje na **Haldě (Heap)**, kde máte k dispozici gigabajty RAM!

---

### 3.5 Paměťová Optimalizace: `std::vector<bool>` a Alokace `[INSIGHT]`

V C++ má `std::vector<bool>` speciální bitovou kompresní specializaci:
- Uchovává každý `bool` jako **1 bit** v paměti místo 1 bajtu!
- Pro graf s $n = 10^7$ vrcholy spotřebuje `std::vector<bool>` pouze **1.25 MB RAM**, zatímco `std::vector<char>` by spotřeboval **10 MB RAM**.

#### Amortizovaná složitost vkládání:
Při zakládání seznamu sousedů předem alokujte paměť pomocí `reserve()`:
```cpp
adj[u].reserve(expected_degree);
```
Tím předejdete opakované realokaci dynamického pole v `std::vector` při každém `push_back()`.

---

## 4. Přehled Asymptotických Složitostí Operací C++ STL Containerů

Pro úspěšné určování složitostí algoritmů v AG1 musíte mít zafixované složitosti C++ STL operací:

| Kontejner | Operace | Průměrná složitost | Nejhorší složitost | Využití v AG1 |
| :--- | :--- | :--- | :--- | :--- |
| `std::vector` | `push_back(x)` | $\mathcal{O}(1)$ amortizovaně | $\mathcal{O}(n)$ realokace | Seznam sousedů, ukládání cest |
| `std::vector` | `operator[]` | $\Theta(1)$ | $\Theta(1)$ | Přístup k matici / poli vzdáleností |
| `std::queue` | `push(x)` / `pop()` | $\Theta(1)$ | $\Theta(1)$ | Prohledávání do šířky (BFS) |
| `std::stack` | `push(x)` / `pop()` | $\Theta(1)$ | $\Theta(1)$ | Iterativní DFS, Topologické řazení |
| `std::priority_queue` | `push(x)` / `pop()` | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ | Dijkstra, Prim MST, Huffman kódování |
| `std::priority_queue` | `top()` | $\Theta(1)$ | $\Theta(1)$ | Výběr nejblíže ležícího vrcholu |
| `std::unordered_map` | `find(x)` | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ kolize | Hashování $k$-merů v de Bruijn grafu |

---

## 5. Rychlé Vstupy a Výstupy v C++ pro Zkouškové Úlohy (Fast I/O) `[INSIGHT]`

V automatických testech na FIT ČVUT (Progtest) může zpracování obrovských grafů s 1 miliónem hran selhat na Time Limit Exceeded pouze kvůli pomalému `std::cin` a `std::cout`!

Vždy na začátek funkce `main()` vložte:
```cpp
#include <iostream>

int main() {
    // Vypnutí synchronizace s C stdio a odpojení std::cin od std::cout
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    // Místo std::endl používejte znak '\n'!
    // std::endl provádí zbytečný flush bufferu po každém řádku.
    return 0;
}
```

---

## 💡 Závěrečné Doporučení pro Propojení PA2 a AG1

1. **Neučte se algoritmy nazpaměť jako C++ kód:** Místo toho si nakreslete vlnoplochu BFS nebo řez u MST a pochopte, **proč** invariant drží.
2. **Přemýšlejte o datových strukturách skrze jejich rozhraní:** Vzdálenosti v BFS udržujte přes `std::queue`, v Dijkstrovi přes `std::priority_queue`.
3. **Při psaní důkazu z AG1 používejte formalismus z našich 7 modulů:** Místo popisu C++ ukazatelů pište formální množinové definice $G = (V, E)$.

---

## 3. 🚿 BFS: Kód vedle Matematiky (Side by Side) `[Relevance: 100%]` `[MEGA EPIC]`

Tohle je nejlepší způsob, jak propojit PA2 a AG1. Ukazujeme BFS ve dvou sloupcích — C++ kód vlevo, matematický invariant vpravo.

### BFS: Hledání nejkratších vzdáleností (neohodnocený graf)

```cpp
// C++ (PA2 styl)                        // AG1 matematický pohled
#include <vector>
#include <queue>

vector<int> bfs(int s,                   // s = startovní vrchol
    const vector<vector<int>>& adj) {    // adj = seznam sousedů G

    int n = adj.size();
    vector<int> d(n, -1);               // d[v] = vzdálenost; -1 = nenavštíveno
    queue<int> q;

    d[s] = 0;                           // INICIALIZACE: d[s] = δ(s,s) = 0 ✓
    q.push(s);

    while (!q.empty()) {                // UDRŽOVÁNÍ: invariant platí pro každý krok
        int u = q.front(); q.pop();

        for (int v : adj[u]) {          // Pro každého souseda v vrcholu u:
            if (d[v] == -1) {           // Pokud v ještě nebyl navštíven:
                d[v] = d[u] + 1;        // d[v] = d[u] + 1 = δ(s, v) ✓
                q.push(v);
            }
        }
    }
    return d;                           // UKONČENÍ: d[v] = δ(s,v) pro všechna v ✓
}
```

### Invariant cyklu BFS (formálně, pro AG1 důkaz):

Před každou iterací `while (!q.empty())` platí:
1. Pro každý **zpracovaný** vrchol $u$ (již vyskočený z fronty): $d[u] = \delta(s, u)$.
2. Fronta $Q$ obsahuje **hranici** — vrcholy vzdálenosti $k$ nebo $k+1$ pro aktuální „vlnu" $k$.
3. Žádný vrchol není vložen do fronty dvakrát (jakmile $d[v] \ne -1$, $v$ přeskočíme).

**Proč to funguje intuitivně?** BFS se šíří jako vlna na vodní hladině — nejprve dosáhne nejbližší břeh (vzdálenost 1), pak dál (vzdálenost 2)... Fronta záruku dává: vždy zpracujeme kratší vzdálenosti dříve než delší.

---

## 4. ⛰️ Dijkstra: Priority Queue a Proč to Funguje `[Relevance: 100%]` `[MEGA EPIC]`

Dijkstra je BFS pro **ohodnocené grafy** (hrany mají váhy). Místo fronty (`queue`) používáme **prioritní frontu** (`priority_queue`) — struktura, která vždy vydá prvek s nejmenší prioritou (vzdáleností).

### Proč nestačí obyčejná fronta?

V BFS: všechny hrany mají váhu 1, takže vrchol vzdálenější o 1 krok = vzdálenější o 1. Fronta FIFO funguje perfektně.

V Dijkstrovi: hrana $\{u,v\}$ může mít váhu $w(u,v) = 100$, hrana $\{u,x\}$ váhu $w(u,x) = 1$. Vrchol $x$ je „blíž" i když byl vložen do fronty později. Fronta FIFO to nezachytí — potřebujeme frontu, která vydá vrchol s nejmenší dosavadní vzdáleností.

### C++ implementace s `std::priority_queue`:

```cpp
#include <vector>
#include <queue>
#include <climits>
using namespace std;

// Graf jako seznam sousedů s vahami: adj[u] = {(v, weight), ...}
using Edge = pair<int,int>;  // (soused, váha)

vector<int> dijkstra(int s, const vector<vector<Edge>>& adj) {
    int n = adj.size();
    vector<int> d(n, INT_MAX);           // d[v] = aktuální odhad δ(s,v)

    // Min-halda: (vzdálenost, vrchol) — nejmenší vzdálenost nahoře
    priority_queue<Edge, vector<Edge>, greater<Edge>> pq;

    d[s] = 0;
    pq.push({0, s});                     // Vložíme (d[s]=0, s) do haldy

    while (!pq.empty()) {
        auto [dist_u, u] = pq.top(); pq.pop();

        if (dist_u > d[u]) continue;     // Zastaralý záznam — přeskočíme

        for (auto [v, w] : adj[u]) {
            if (d[u] + w < d[v]) {       // Relaxace hrany (u,v):
                d[v] = d[u] + w;         // Našli jsme lepší cestu do v!
                pq.push({d[v], v});
            }
        }
    }
    return d;
}
```

### Klíčový invariant pro AG1 důkaz:

Při každém výskoku vrcholu $u$ z prioritní fronty platí: $d[u] = \delta(s, u)$ (finální vzdálenost).

**Proč?** Kdyby existovala kratší cesta $P'$ do $u$ dosud nenalezená, pak $P'$ prochází přes nějaký vrchol $x$ dosud ve frontě. Ale $d[x] \ge d[u]$ (jinak by byl $x$ vyskočen dříve). Cesta přes $x$ by měla délku $\ge d[x] \ge d[u]$, tedy není kratší. Spor!

> [!WARNING]
> **Dijkstra + záporné hrany = katas trofa!** Pokud existuje záporná hrana $\{u,v\}$ s $w < 0$, invariant se rozbije — vrchol může být vyskočen z fronty s neoptimální vzdáleností. Pro záporné hrany použij Bellman-Ford (AG1 probírá jako bonusové téma).

---

## 5. 🌲 DFS a Riziko Stack Overflow `[Relevance: 75%]` `[INSIGHT]`

### Rekurzivní DFS (PA2 styl)

```cpp
vector<bool> visited;

void dfs(int u, const vector<vector<int>>& adj) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) dfs(v, adj);   // ← Rekurzivní volání!
    }
}
```

Tohle je čisté a elegantní. Ale **pozor na velké grafy**!

### Problém: Stack Overflow při hlubokém DFS

Každé rekurzivní volání `dfs(v, ...)` přidá rámec na **zásobník volání (call stack)**. Typický zásobník v C++ je limitován na ~1–8 MB (záleží na systému).

Pokud graf vypadá jako dlouhá cesta (řetěz): $1 \to 2 \to 3 \to \cdots \to 10^5$, rekurzivní DFS zavolá sám sebe $10^5$-krát → **Stack Overflow!**

### Řešení: Iterativní DFS se zásobníkem (`std::stack`)

```cpp
#include <stack>

void dfs_iterative(int start, const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    stack<int> stk;

    stk.push(start);

    while (!stk.empty()) {
        int u = stk.top(); stk.pop();
        if (visited[u]) continue;
        visited[u] = true;

        for (int v : adj[u]) {
            if (!visited[v]) stk.push(v);
        }
    }
}
```

Zásobník je nyní na **haldě** (heap) — může být mnohem větší. Pro grafy s $n = 10^5$ je iterativní DFS bezpečný.

**Matematická ekvivalence:** Oba přístupy prohledají stejné vrcholy ve stejném pořadí (zásobník emuluje rekurzi). Formálně jsou ekvivalentní.

---

## 6. 🔗 DSU (Disjoint Set Union) — Kruskal bez slz `[Relevance: 80%]` `[EPIC]`

Kruskalův algoritmus buduje MST hladově — přidává hrany od nejlehčí, ale **přeskočí hranu, která by vytvořila cyklus**.

Jak zjistit, jestli hrana $\{u,v\}$ vytvoří cyklus? Jestli $u$ a $v$ jsou **ve stejné komponentě**.

Naivně: BFS/DFS pro každou hranu → $O(m \cdot n)$.  
S DSU: $O(\alpha(n))$ amortizovaně (prakticky konstanta).

### DSU implementace

```cpp
struct DSU {
    vector<int> parent, rank_;

    DSU(int n) : parent(n), rank_(n, 0) {
        iota(parent.begin(), parent.end(), 0);  // parent[i] = i
    }

    int find(int x) {                           // Najde kořen komponenty x
        if (parent[x] != x)
            parent[x] = find(parent[x]);        // Path compression
        return parent[x];
    }

    bool unite(int a, int b) {                  // Spoj komponenty a a b
        a = find(a); b = find(b);
        if (a == b) return false;               // Stejná komponenta → cyklus!
        if (rank_[a] < rank_[b]) swap(a, b);
        parent[b] = a;                          // Union by rank
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;                            // Úspěšně spojeno
    }
};
```

### Kruskal s DSU:

```cpp
int kruskal_mst(int n, vector<tuple<int,int,int>>& edges) {
    // edges = {(váha, u, v), ...}
    sort(edges.begin(), edges.end());           // Setřídíme hrany dle váhy
    DSU dsu(n);
    int total_weight = 0;

    for (auto [w, u, v] : edges) {
        if (dsu.unite(u, v)) {                  // Pokud hrana nepůsobí cyklus:
            total_weight += w;                  // Přidáme ji do MST
        }
    }
    return total_weight;
}
```

**Matematické pozadí:** DSU udržuje množiny vrcholů — každá množina = jedna komponenta grafu. `find(x)` vrátí reprezentanta množiny. `unite(a,b)` sloučí dvě množiny. Hrana $\{u,v\}$ tvoří cyklus iff `find(u) == find(v)`.

---

## 7. 🚨 Nejčastější PA2 → AG1 Chyby `[Relevance: 95%]` `[PAST U ZKOUŠKY]`

| Chyba | PA2 myšlení | AG1 požadavek |
|:---|:---|:---|
| **Off-by-one v indexování** | `adj[0..n-1]` nebo `adj[1..n]`? | Musíš specifikovat: „$V = \{0, 1, \ldots, n-1\}$" |
| **Zapomnění na nesouvislé grafy** | BFS spustíš jen z vrcholu 0 | Pro nesouvislý $G$ musíš spustit BFS ze všech nenavštívených vrcholů |
| **`int` overflow při součtu vah** | `d[u] + w` může přetéct pokud `d[u] = INT_MAX` | Testuj `d[u] != INT_MAX` před relaxací |
| **Záporné hrany v Dijkstrovi** | Kód „funguje" na testovacích datech | Formálně: invariant Dijkstry selže, důkaz je nesprávný |
| **Rekurzivní DFS na velkých grafech** | Progt test ho přijme | Stack overflow na $n = 10^5$ v AG1 zápočtovce |
| **Modifikace grafu při procházení** | `adj[u].push_back(v)` uvnitř BFS | Nedefinované chování, může zacyklit BFS |

---

## 8. ☀️ Letní Kontrolní Seznam před AG1 `[Relevance: 100%]`

Proveď si tento self-test před zářím. Pokud odpovíš ANO na všechny, máš solidní start:

- [ ] Umím napsat BFS od nuly (bez šablony) a vysvětlit, proč `d[v] = d[u] + 1`.
- [ ] Vím, proč `std::priority_queue` s `greater<>` dává min-haldu.
- [ ] Rozumím, proč `if (dist_u > d[u]) continue;` v Dijkstrovi.
- [ ] Znám rozdíl mezi `std::vector<vector<int>>` (seznam sousedů) a maticí sousednosti.
- [ ] Vím, kdy použít DFS iterativně (velké grafy) vs. rekurzivně.
- [ ] Chápu, co je DSU a jak `find()` + `unite()` slouží Kruskalovi.
- [ ] Zvládnu zapsat invariant cyklu pro BFS ve 3 krocích (Inicializace / Udržování / Ukončení).
- [ ] Vím, že Dijkstra nefunguje se zápornými hranami — a proč.

---

> ➡️ **Návrat na Hlavní Rozcestník Kurzu:** [Zpět na Přehled 7 Modulů Pre-AG1](./dml)