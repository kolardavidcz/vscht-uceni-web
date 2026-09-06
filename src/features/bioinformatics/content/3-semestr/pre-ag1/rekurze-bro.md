# 💻 C++ Trénink: Rekurze, BFS, DFS & Dijkstra (rekurze_bro.cpp)

> **Praktický tréninkový kód v C++20 ze slidů a úloh pro AG1 (Algoritmy a Grafy 1)**.
> Obsahuje kompletní reprezentaci grafů, 5 cvičení od základní stromové rekurze přes BFS/DFS až po prohledávání stavového prostoru (ProgTest styl) a Dijkstrův algoritmus s prioritní frontou, včetně automatických testů.

<div class="my-6 p-4 sm:p-5 rounded-2xl border border-brand-orange/30 bg-gradient-to-r from-orange-50/80 to-amber-50/60 dark:from-orange-950/30 dark:to-amber-950/20 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div class="space-y-1">
    <div class="flex items-center gap-2">
      <span class="px-2 py-0.5 rounded text-[11px] font-black bg-brand-orange text-white uppercase tracking-wider">C++20 Showcase</span>
      <h3 class="text-base font-black text-stone-900 dark:text-white tracking-tight">rekurze_bro.cpp — Cvičení a Testovací Sada</h3>
    </div>
    <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
      Kompletní samostatný soubor připravený ke kompilaci. Obsahuje struktury grafů, kostry funkcí k doplnění a sadu automatických assert testů.
    </p>
  </div>
  <a
    href="/rekurze_bro.cpp"
    download="rekurze_bro.cpp"
    class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all hover:shadow-lg cursor-pointer shrink-0"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    <span>Stáhnout rekurze_bro.cpp</span>
  </a>
</div>

---

## 🛠️ Jak Skript Spustit

Skript vyžaduje překladač s podporou **C++20** (např. `g++` 10+ nebo `clang++` 12+):

```bash
# Překlad s optimalizacemi a varováními:
g++ -std=c++20 -Wall -pedantic rekurze_bro.cpp -o rekurze_bro

# Spuštění testů:
./rekurze_bro
```

---

## 📋 Přehled Cvičení v Souboru

1. **Cvičení 0 (`get_distance`)**: Rekurzivní vzdálenost (počet hran) v acyklickém stromu s parametrem `previous`.
2. **Cvičení 1 (`run_dfs` / `dfs_recursive`)**: Hloubkový průchod (DFS) grafem a zjištění vzdálenosti od startu.
3. **Cvičení 2 (`run_bfs` / `reconstruct_path`)**: Šířkový průchod (BFS) pomocí `std::queue` a rekonstrukce nejkratší cesty ze stromu předchůdců `parent`.
4. **Cvičení 3 (`solve` / `LostHero` & `SuperstitiousHero`)**: Stavové BFS (State-Action BFS v ProgTest stylu) s generickým řešičem a `operator<=>`.
5. **Cvičení 4 (`run_dijkstra`)**: Nejkratší cesty v ohodnoceném grafu s prioritní frontou `std::priority_queue` (min-heap přes `std::greater`).

---

## 📄 Kompletní Zdrojový Kód (`rekurze_bro.cpp`)

```cpp
#include <algorithm>
#include <cassert>
#include <compare>
#include <cstdint>
#include <iostream>
#include <map>
#include <optional>
#include <queue>
#include <set>
#include <string>
#include <utility>
#include <vector>

// ============================================================================
// 1. Reprezentace Grafů (Seznam sousedů přes std::vector)
// ============================================================================

/**
 * Neohodnocený graf pro DFS a BFS (neorientovaný)
 */
struct Graph {
  int n;
  std::vector<std::vector<int>> adj;

  explicit Graph(int vertices_count) : n(vertices_count), adj(vertices_count) {}

  void add_edge(int u, int v, bool directed = false) {
    adj[u].push_back(v);
    if (!directed) {
      adj[v].push_back(u);
    }
  }
};

/**
 * Ohodnocený graf pro Dijkstrův algoritmus
 */
struct WeightedEdge {
  int to;
  int weight;
};

struct WeightedGraph {
  int n;
  std::vector<std::vector<WeightedEdge>> adj;

  explicit WeightedGraph(int vertices_count)
      : n(vertices_count), adj(vertices_count) {}

  void add_edge(int u, int v, int weight, bool directed = false) {
    adj[u].push_back({v, weight});
    if (!directed) {
      adj[v].push_back({u, weight});
    }
  }
};

// ============================================================================
// 2. Testovací grafy ze slidů a přednášek
// ============================================================================

/**
 * Graf 1: Acyklický strom (Fylogenetický strom ze slidu 2.1)
 *
 *            (0) LUCA
 *           /   \
 *         (1)   (2)
 *        /  \   /  \
 *      (3) (4) (5) (6)
 */
Graph create_acyclic_tree() {
  Graph g(7);
  g.add_edge(0, 1);
  g.add_edge(0, 2);
  g.add_edge(1, 3);
  g.add_edge(1, 4);
  g.add_edge(2, 5);
  g.add_edge(2, 6);
  return g;
}

/**
 * Graf 2: Neorientovaný cyklický graf (Slide 2.2 – Srovnání DFS vs BFS)
 *
 *  Start (S)
 *     v0 ───────(e5)─────── v5 ───────(e6)─────── v4 ──(e7)── v6 ──(e9)── v8
 * (Cíl C) │                                          │           │ (e1) (e4)
 * (e8) │                                          │           │ v1
 * ───────(e2)─────── v2 ───────(e3)────────┘           v7 (slepá větev)
 *
 * Uzavřený neorientovaný cyklus: v0 - v1 - v2 - v3 - v4 - v5 - v0
 * POZOR: Na tomto neorientovaném cyklu "basic rekurze" (jen s parametrem
 * previous) selže a zacyklí se do nekonečné smyčky (stack overflow), protože
 * cyklus má délku 6 a návrat do v0 přijde z jiné hrany než té, ze které jsme do
 * něj vstoupili!
 */
Graph create_cyclic_graph() {
  Graph g(9);
  // Spodní větev cyklu (neorientované hrany)
  g.add_edge(0, 1);
  g.add_edge(1, 2);
  g.add_edge(2, 3);
  g.add_edge(3, 4);
  // Horní větev cyklu
  g.add_edge(0, 5);
  g.add_edge(5, 4);
  // Odbočky k cíli a slepé větvi
  g.add_edge(4, 6);
  g.add_edge(6, 7);
  g.add_edge(6, 8);
  return g;
}

/**
 * Graf 3: Neorientovaný ohodnocený graf pro Dijkstru
 *
 *          [váha: 10]           [váha: 10]
 *     0 ───────────────── 1 ───────────────── 2   (Horní větev: 2 hrany,
 * celková váha = 20) │                                       │ │ [váha: 1] │
 * [váha: 1] │                                       │ 3 ───────────────── 4
 * ──────────────────┘   (Spodní větev: 3 hrany, celková váha = 3) [váha: 1]
 *
 * Všechny hrany jsou neorientované (obousměrné).
 * BFS by zvolilo horní cestu (méně hran: 2).
 * Dijkstra MUSÍ zvolit spodní cestu (menší celková váha: 3 < 20).
 */
WeightedGraph create_dijkstra_graph() {
  WeightedGraph g(5);
  // Horní cesta (drahá, méně hran, neorientovaná)
  g.add_edge(0, 1, 10);
  g.add_edge(1, 2, 10);
  // Spodní cesta (levná, více hran, neorientovaná)
  g.add_edge(0, 3, 1);
  g.add_edge(3, 4, 1);
  g.add_edge(4, 2, 1);
  return g;
}

// ============================================================================
// CVIČENÍ 0: Rekurzivní vzdálenost ve stromu (Jednoduchá rekurze s previous)
// ============================================================================

/**
 * Rekurzivně spočte vzdálenost (počet hran) mezi vrcholy v acyklickém grafu
 * (stromu):
 *
 * Princip:
 * Na stromu neexistují cykly. Jediný možný návrat je po té samé hraně zpět k
 * rodiči. Proto stačí předávat parametr 'previous' a přeskočit hranu vedoucí
 * zpět do něj. POZOR: Na obecném grafu s cykly by tato funkce způsobila
 * nekonečnou rekurzi!
 *
 * @param g         Graf (strom)
 * @param start     Počáteční vrchol
 * @param end       Cílový vrchol
 * @return          Počet hran k cíli, nebo -1 pokud cíl v této větvi neleží
 */
int get_distance(const Graph *g, int start, int end) { return -1; }

// ============================================================================
// CVIČENÍ 1: Prohledávání do hloubky (DFS) – Vzdálenosti / Hloubka od startu
// ============================================================================

/**
 * Rekurzivní průchod DFS:
 * Vypočte vzdálenost (hloubku v DFS stromu) od startovního uzlu pro všechny
 * dosažitelné uzly.
 *
 * @param g     Graf
 * @param u     Aktuálně navštívený uzel
 * @param d     Aktuální hloubka / vzdálenost od startu
 * @param dist  Vektor vzdáleností (-1 = dosud nenavštívený uzel)
 */
void dfs_recursive(const Graph &g, int u, int d, std::vector<int> &dist) {
  // ------------------------------------------------------------------------
  // TODO: Zde doplňte rekurzivní DFS:
  // 1. Zapište aktuální vzdálenost: dist[u] = d;
  // 2. Projděte všechny sousedy v v g.adj[u]:
  //    - Pokud soused ještě nebyl navštíven (dist[v] == -1):
  //      - Zavolejte rekurzivně dfs_recursive(g, v, d + 1, dist);
  // ------------------------------------------------------------------------
}

std::vector<int> run_dfs(const Graph &g, int start) {
  std::vector<int> dist(g.n, -1);
  // ------------------------------------------------------------------------
  // TODO: Spusťte dfs_recursive ze startu s počáteční hloubkou 0:
  // dfs_recursive(g, start, 0, dist);
  // ------------------------------------------------------------------------
  return dist;
}

// ============================================================================
// CVIČENÍ 2: Prohledávání do šířky (BFS) – Vzdálenosti a Strom předchůdců
// ============================================================================

/**
 * Šířkový průchod grafem (hledání nejkratších vzdáleností):
 * @param g       Graf
 * @param start   Startovní uzel
 * @param parent  [VÝSTUPNÍ PARAMETR] Vektor předchůdců na nejkratší cestě (-1 =
 * žádný předchůdce)
 * @return        Vektor nejkratších vzdáleností od startu (-1 pro nedosažitelné
 * vrcholy)
 */
std::vector<int> run_bfs(const Graph &g, int start, std::vector<int> &parent) {
  std::vector<int> dist(g.n, -1);
  parent.assign(g.n, -1);

  // ------------------------------------------------------------------------
  // TODO: Zde doplňte BFS pomocí std::queue<int>:
  // 1. Vytvořte frontu std::queue<int> Q.
  // 2. Nastavte dist[start] = 0, parent[start] = start a vložte start do Q.
  // 3. Dokud fronta Q není prázdná:
  //    a) Vyzvedněte uzel u z čela fronty (front() a pop()).
  //    b) Projděte každého souseda v v g.adj[u]:
  //       - Pokud soused v ještě nebyl navštíven (dist[v] == -1):
  //         - Nastavte dist[v] = dist[u] + 1;
  //         - Nastavte parent[v] = u;
  //         - Vložte v do fronty Q.
  // ------------------------------------------------------------------------

  return dist;
}

/**
 * Pomocná funkce: Rekonstrukce nejkratší cesty ze stromu předchůdců (parent).
 * @param start   Startovní uzel
 * @param target  Cílový uzel
 * @param parent  Vektor předchůdců naplněný z run_bfs nebo run_dijkstra
 * @return        Posloupnost uzlů [start, ..., target]. Pokud cesta neexistuje,
 * vrátí {}
 */
std::vector<int> reconstruct_path(int start, int target,
                                  const std::vector<int> &parent) {
  if (parent[target] == -1 && target != start) {
    return {};
  }
  std::vector<int> path;
  int curr = target;
  while (curr != -1) {
    path.push_back(curr);
    if (curr == start)
      break;
    curr = parent[curr];
  }
  std::reverse(path.begin(), path.end());
  if (!path.empty() && path.front() != start) {
    return {};
  }
  return path;
}

// ============================================================================
// CVIČENÍ 3: State-Action BFS – Prohledávání stavového prostoru (ProgTest styl)
//
// Inspirováno reálnou úlohou z ProgTestu (sample (4).cpp).
// Zde nestačí reprezentovat stav jen jako souřadnici (r, c). Stav musí nést
// veškerou informaci potřebnou k určení, jaké akce jsou v daný moment povolené!
// ============================================================================

enum class Tile : uint8_t {
  EMPTY = 0,
  WALL,
  EXIT,
};

using Maze = std::vector<std::vector<Tile>>;

struct Position {
  size_t row, col;
  Position() : row(static_cast<size_t>(-1)), col(static_cast<size_t>(-1)) {}
  Position(size_t r, size_t c) : row(r), col(c) {}
  friend auto operator<=>(const Position &, const Position &) = default;
};

enum class Direction { UP, DOWN, LEFT, RIGHT };

inline Position perform_move(Position p, Direction d) {
  auto [r, c] = p;
  using enum Direction;
  switch (d) {
  case UP:
    return {r - 1, c};
  case DOWN:
    return {r + 1, c};
  case LEFT:
    return {r, c - 1};
  case RIGHT:
    return {r, c + 1};
  }
  return p;
}

// ----------------------------------------------------------------------------
// Generický řešič stavového prostoru (Generic State-Action BFS Solver)
// ----------------------------------------------------------------------------

/**
 * Šablona generického BFS pro libovolný stavový problém (SearchProblem)
 *
 * Rozhraní typu SearchProblem:
 * - type State (musí podporovat operator<=> pro uložení v std::set/std::map)
 * - type Action
 * - initial_state() -> State
 * - is_target(State) -> bool
 * - possible_actions(State) -> std::vector<Action>
 * - next_state(State, Action) -> State
 *
 * @return std::optional se sekvencí akcí vedoucí do cíle:
 *         - std::vector<Action>{} (prázdný vektor), pokud start je již cíl
 *         - sekvence akcí, pokud cíl byl nalezen
 *         - std::nullopt, pokud cíl není dosažitelný
 */
template <typename SearchProblem>
std::optional<std::vector<typename SearchProblem::Action>>
solve(const SearchProblem &G) {
  using Vertex [[maybe_unused]] = typename SearchProblem::State;
  using Action [[maybe_unused]] = typename SearchProblem::Action;

  // ------------------------------------------------------------------------
  // TODO: Zde implementujte generické stavové BFS:
  // 1. Zjistěte počáteční stav: Vertex start = G.initial_state();
  // 2. Pokud G.is_target(start), vraťte prázdný vektor akcí
  // std::vector<Action>{}.
  // 3. Vytvořte:
  //    - frontu stavů: std::queue<Vertex> q;
  //    - množinu navštívených stavů: std::set<Vertex> visited;
  //    - mapu předchůdců a provedených akcí: std::map<Vertex, std::pair<Vertex,
  //    Action>> parent;
  // 4. Vložte start do q a označte jej v visited.
  // 5. Dokud q není prázdná:
  //    a) Vertex u = q.front(); q.pop();
  //    b) Pokud G.is_target(u): cíl nalezen! Zrekonstruujte cestu akcí zpětně
  //    přes parent. c) Pro každou akci 'a' v G.possible_actions(u):
  //       - Nový stav: Vertex v = G.next_state(u, a);
  //       - Pokud stav 'v' ještě nebyl navštíven (!visited.contains(v)):
  //         - visited.insert(v);
  //         - parent[v] = {u, a};
  //         - q.push(v);
  // 6. Pokud fronta skončí a cíl nebyl nalezen, vraťte std::nullopt.
  // ------------------------------------------------------------------------

  return std::nullopt;
}

// ----------------------------------------------------------------------------
// Problém 1: LostHero (Jednoduchý hrdina – stav je pouze Position)
// ----------------------------------------------------------------------------
struct LostHero {
  using State = Position;
  using Action = Direction;

  LostHero(Maze maze, Position hero) : _maze(std::move(maze)), _hero(hero) {}

  State initial_state() const { return _hero; }

  State next_state(State v, Action a) const { return perform_move(v, a); }

  std::vector<Action> possible_actions(State v) const {
    std::vector<Action> ret;
    using enum Direction;
    for (Direction d : {DOWN, UP, RIGHT, LEFT}) {
      auto [r, c] = next_state(v, d);
      if (r >= _maze.size() || c >= _maze[r].size() ||
          _maze[r][c] == Tile::WALL)
        continue;
      ret.push_back(d);
    }
    return ret;
  }

  bool is_target(State v) const { return _maze[v.row][v.col] == Tile::EXIT; }

private:
  Maze _maze;
  Position _hero;
};

// ----------------------------------------------------------------------------
// Problém 2: SuperstitiousHero (Pověrčivý hrdina – stav = Position + krok v
// cyklu)
//
// Hrdina se pohybuje po mřížce stejně jako LostHero, ALE jeho každý 5. krok
// MUSÍ BÝT NAHORU (Direction::UP), počítáno od 1 (tah 5, 10, 15, ...).
// ----------------------------------------------------------------------------
struct SuperstitiousHero {
  struct State {
    Position pos;
    // TODO 0..4: kolikátý krok v pětici tahů máme za sebou
    friend auto operator<=>(const State &, const State &) = default;
  };
  using Action = Direction;

  SuperstitiousHero(Maze maze, Position hero)
      : _maze(std::move(maze)), _hero(hero) {}

  State initial_state() const {
    // ------------------------------------------------------------------------
    // TODO: Vraťte počáteční stav (výchozí pozice hrdiny _hero a krok v cyklu
    // 0):
    // ------------------------------------------------------------------------
    return {};
  }

  std::vector<Action> possible_actions(State v) const {
    std::vector<Action> ret;
    using enum Direction;

    // ------------------------------------------------------------------------
    // TODO: Zde doplňte povolené akce:
    // Pokud je právě 5. krok v cyklu (v.step_in_cycle == 4):
    // - Jediná povolená akce je Direction::UP!
    // - Ověřte, zda krok UP nevede do zdi nebo mimo meze _maze. Pokud je volno,
    // přidejte UP do ret. Jinak (pro tahy 0, 1, 2, 3):
    // - Vyzkoušejte všechny 4 směry {DOWN, UP, RIGHT, LEFT} jako u LostHero.
    // ------------------------------------------------------------------------

    return ret;
  }

  State next_state(State v, const Action &a) const {
    // ------------------------------------------------------------------------
    // TODO: Vraťte nový stav:
    // - Nová pozice: perform_move(v.pos, a)
    // - Nový krok v cyklu: posunutý o 1 krok (modulo 5)
    // ------------------------------------------------------------------------
    return {};
  }

  bool is_target(State v) const {
    return _maze[v.pos.row][v.pos.col] == Tile::EXIT;
  }

private:
  Maze _maze;
  Position _hero;
};

// ============================================================================
// CVIČENÍ 4: Dijkstrův algoritmus (Nejkratší cesty v ohodnoceném grafu)
// ============================================================================

/**
 * Dijkstrův algoritmus s prioritní frontou (min-halda přes std::greater):
 * @param g       Ohodnocený graf s nezápornými vahami hran
 * @param start   Startovní uzel
 * @param parent  [VÝSTUPNÍ PARAMETR] Předchůdci na nejkratších cestách (-1 pro
 * nedosažitelné/start)
 * @return        Vektor minimálních vzdáleností od startu (-1 pro nedosažitelné
 * vrcholy)
 */
std::vector<int> run_dijkstra(const WeightedGraph &g, int start,
                              std::vector<int> &parent) {
  const int INF = 1e9;
  std::vector<int> dist(g.n, INF);
  parent.assign(g.n, -1);

  // ------------------------------------------------------------------------
  // TODO: Zde doplňte Dijkstrův algoritmus:
  // 1. Vytvořte prioritní frontu (min-heap) dvojic (vzdálenost, vrchol):
  //    using Pair = std::pair<int, int>; // {aktuální vzdálenost, uzel}
  //    std::priority_queue<Pair, std::vector<Pair>, std::greater<Pair>> pq;
  // 2. Nastavte dist[start] = 0, parent[start] = start a vložte {0, start} do
  // pq.
  // 3. Dokud pq není prázdná:
  //    a) auto [d, u] = pq.top(); pq.pop();
  //    b) Pokud d > dist[u], pokračujte (již máme nalezenou kratší cestu).
  //    c) Pro každou hranu edge v g.adj[u]:
  //       - Spočtěte candidate_dist = dist[u] + edge.weight;
  //       - Pokud candidate_dist < dist[edge.to]:
  //         - dist[edge.to] = candidate_dist;
  //         - parent[edge.to] = u;
  //         - pq.push({candidate_dist, edge.to});
  // 4. Na závěr přepište všechny nedosažitelné vrcholy (kde dist[i] == INF) na
  // hodnotu -1.
  // ------------------------------------------------------------------------

  return dist;
}

// ============================================================================
// 3. Automatické testy
// ============================================================================

void test_get_distance() {
  std::cout << "[Test 0] Rekurzivni vzdalenost (get_distance)...\n";
  Graph tree = create_acyclic_tree();

  // Vzdálenost vrcholu k sobě samému (0 hran)
  assert(get_distance(&tree, 0, 0) == 0);

  // Přímí sousední vrcholy (0 -> 1: 1 hrana)
  assert(get_distance(&tree, 0, 1) == 1);
  assert(get_distance(&tree, 0, 2) == 1);

  // Cesta do hloubky 2 (0 -> 1 -> 3: 2 hrany)
  assert(get_distance(&tree, 0, 3) == 2);
  assert(get_distance(&tree, 0, 4) == 2);
  assert(get_distance(&tree, 0, 5) == 2);
  assert(get_distance(&tree, 0, 6) == 2);

  // Cesta mezi dvěma listy přes společného rodiče (3 -> 1 -> 4: 2 hrany)
  assert(get_distance(&tree, 3, 4) == 2);

  // Cesta přes kořen LUCA z levé větve do pravé (3 -> 1 -> 0 -> 2 -> 6: 4
  // hrany)
  assert(get_distance(&tree, 3, 6) == 4);

  // Test nesouvislého grafu (nenalezeno -> vrátí -1)
  Graph disconnected(3);
  disconnected.add_edge(0, 1);
  assert(get_distance(&disconnected, 0, 2) == -1);

  std::cout << "  ✓ get_distance správně spočítalo vzdálenosti (počet hran) v "
               "acyklickém grafu!\n";
}

void test_dfs() {
  std::cout << "[Test 1] DFS vzdálenosti / hloubky...\n";
  Graph tree = create_acyclic_tree();

  // 1. Test na acyklickém stromu
  std::vector<int> dist_tree = run_dfs(tree, 0);
  assert(dist_tree[0] == 0);
  assert(dist_tree[1] == 1 && dist_tree[2] == 1);
  assert(dist_tree[3] == 2 && dist_tree[4] == 2);
  assert(dist_tree[5] == 2 && dist_tree[6] == 2);
  std::cout << "  ✓ DFS spočetlo správné hloubky ve stromu.\n";

  // 2. Test na cyklickém grafu (DFS projde všechny uzly a nezacyklí se)
  Graph cyclic = create_cyclic_graph();
  std::vector<int> dist_cyclic = run_dfs(cyclic, 0);
  for (int i = 0; i < cyclic.n; ++i) {
    assert(dist_cyclic[i] != -1 &&
           "DFS nenavštívilo všechny vrcholy cyklického grafu!");
  }
  std::cout << "  ✓ DFS se nezacyklilo a navštívilo všech 9 vrcholů.\n";

  // 3. Test nesouvislého grafu
  Graph disc(4);
  disc.add_edge(0, 1);
  std::vector<int> dist_disc = run_dfs(disc, 0);
  assert(dist_disc[0] == 0 && dist_disc[1] == 1);
  assert(dist_disc[2] == -1 && dist_disc[3] == -1);
  std::cout << "  ✓ DFS správně označilo nedosažitelné vrcholy jako -1.\n";
}

void test_bfs() {
  std::cout << "[Test 2] BFS vzdálenosti a rekonstrukce cesty...\n";
  Graph tree = create_acyclic_tree();
  std::vector<int> parent;

  // 1. Test na stromu
  std::vector<int> dist_tree = run_bfs(tree, 0, parent);
  assert(dist_tree[0] == 0);
  assert(dist_tree[1] == 1 && dist_tree[2] == 1);
  assert(dist_tree[3] == 2 && dist_tree[4] == 2 && dist_tree[5] == 2 &&
         dist_tree[6] == 2);

  // Rekonstrukce cesty 0 -> 4
  std::vector<int> path_to_4 = reconstruct_path(0, 4, parent);
  std::vector<int> expected_path_4 = {0, 1, 4};
  assert(path_to_4 == expected_path_4 && "Cesta k vrcholu 4 neodpovídá!");
  std::cout << "  ✓ BFS nalezlo správné vzdálenosti a zrekonstruovalo cestu ve "
               "stromu.\n";

  // 2. Test na cyklickém grafu (Srovnání BFS vs DFS)
  Graph cyclic = create_cyclic_graph();
  std::vector<int> parent_cyclic;
  std::vector<int> dist_cyclic = run_bfs(cyclic, 0, parent_cyclic);

  // Nejkratší cesta v0 -> v4 má délku 2 (přes v5), zatímco DFS by šlo přes
  // v1-v2-v3 (délka 4)
  assert(dist_cyclic[4] == 2 && "BFS musí najít kratší cestu do v4 přes v5!");
  assert(dist_cyclic[8] == 4 && "Nejkratší cesta do cíle v8 má délku 4 hrany!");

  // Rekonstrukce optimální cesty k v8: 0 -> 5 -> 4 -> 6 -> 8
  std::vector<int> path_to_8 = reconstruct_path(0, 8, parent_cyclic);
  std::vector<int> expected_path_8 = {0, 5, 4, 6, 8};
  assert(path_to_8 == expected_path_8 && "BFS cesta do v8 není optimální!");
  std::cout << "  ✓ BFS spolehlivě nalezlo globálně nejkratší cestu přes "
               "cyklus (0 -> 5 -> 4 -> 6 -> 8).\n";

  // 3. Test nedosažitelného vrcholu
  Graph disc(4);
  disc.add_edge(0, 1);
  std::vector<int> p_disc;
  std::vector<int> d_disc = run_bfs(disc, 0, p_disc);
  assert(d_disc[3] == -1);
  assert(reconstruct_path(0, 3, p_disc).empty() &&
         "Cesta k nedosažitelnému vrcholu musí být prázdná!");
  std::cout
      << "  ✓ BFS správně vrátilo prázdnou cestu pro nedosažitelný uzel.\n";
}

void test_state_action_bfs() {
  std::cout << "[Test 3] State-Action BFS – LostHero a SuperstitiousHero "
               "(ProgTest)...\n";

  constexpr auto _ = Tile::EMPTY;
  constexpr auto W = Tile::WALL;
  constexpr auto X = Tile::EXIT;

  // 1. Start je rovnou cíl (0 akcí):
  Maze m0 = {{X}};
  LostHero lh0(m0, {0, 0});
  auto sol0 = solve(lh0);
  assert(sol0.has_value() && sol0->empty());
  std::cout << "  ✓ Test 1 (Start == Cíl): 0 akcí nalezeno.\n";

  // 2. Vertikální chodba 10x1 (Slide / ProgTest srovnání):
  Maze m1 = {{_}, {_}, {_}, {_}, {_}, {_}, {_}, {_}, {_}, {X}};

  // LostHero jde přímo 9x DOWN:
  LostHero lh1(m1, {0, 0});
  auto sol_lh1 = solve(lh1);
  assert(sol_lh1.has_value() && sol_lh1->size() == 9);
  std::cout << "  ✓ Test 2 (LostHero): 9 kroků dolů k cíli.\n";

  // SuperstitiousHero má každý 5. krok povinně UP, proto musí udělat 13 kroků!
  SuperstitiousHero sh1(m1, {0, 0});
  auto sol_sh1 = solve(sh1);
  assert(sol_sh1.has_value() && sol_sh1->size() == 13);
  std::cout << "  ✓ Test 2 (SuperstitiousHero): přesně 13 kroků (každý 5. krok "
               "musel být UP)!\n";

  // 3. Bludiště 5x5 s překážkami (ze zadání ProgTestu):
  Maze m2 = {{W, _, _, _, W},
             {W, _, _, W, X},
             {_, _, _, W, _},
             {_, _, _, _, _},
             {_, W, _, W, _}};
  LostHero lh2(m2, {1, 2});
  auto sol_lh2 = solve(lh2);
  assert(sol_lh2.has_value() && sol_lh2->size() == 6);

  SuperstitiousHero sh2(m2, {1, 2});
  auto sol_sh2 = solve(sh2);
  assert(sol_sh2.has_value() && sol_sh2->size() == 6);
  std::cout
      << "  ✓ Test 3 (5x5 bludiště): oba hrdinové našli cestu o délce 6.\n";

  // 4. Zazděný cíl (Nedosažitelné řešení -> std::nullopt):
  Maze m3 = {{_, _, _, W, _},
             {_, _, _, _, W},
             {W, _, _, _, W},
             {W, _, _, W, _},
             {X, W, _, _, _}};
  LostHero lh3(m3, {3, 2});
  assert(!solve(lh3).has_value());

  SuperstitiousHero sh3(m3, {3, 2});
  assert(!solve(sh3).has_value());
  std::cout
      << "  ✓ Test 4 (Zazděný cíl): solve správně vrátilo std::nullopt.\n";
}

void test_dijkstra() {
  std::cout << "[Test 4] Dijkstrův algoritmus na ohodnoceném grafu...\n";
  WeightedGraph g = create_dijkstra_graph();
  std::vector<int> parent;

  std::vector<int> dist = run_dijkstra(g, 0, parent);

  // Vzdálenosti:
  // 0 -> 0: váha 0
  assert(dist[0] == 0);
  // 0 -> 3: váha 1
  assert(dist[3] == 1);
  // 0 -> 4: váha 1 + 1 = 2
  assert(dist[4] == 2);
  // 0 -> 2: spodní cestou váha 1 + 1 + 1 = 3 (horní cesta by byla 10 + 10 = 20)
  assert(dist[2] == 3 &&
         "Dijkstra musí zvolit levnější spodní cestu o váze 3, nikoli horní o "
         "váze 20!");

  // Rekonstrukce cesty k vrcholu 2:
  std::vector<int> path = reconstruct_path(0, 2, parent);
  std::vector<int> expected_path = {0, 3, 4, 2};
  assert(path == expected_path &&
         "Dijkstrova cesta musí jít přes uzly 0 -> 3 -> 4 -> 2!");
  std::cout << "  ✓ Dijkstra správně preferoval cestu s nižší vahou (3) před "
               "cestou s méně hranami (20).\n";

  // Test nedosažitelného vrcholu
  WeightedGraph disc(3);
  disc.add_edge(0, 1, 5);
  std::vector<int> p_disc;
  std::vector<int> d_disc = run_dijkstra(disc, 0, p_disc);
  assert(d_disc[2] == -1 &&
         "Nedosažitelný vrchol v Dijkstrovi musí mít vzdálenost -1!");
  assert(reconstruct_path(0, 2, p_disc).empty());
  std::cout << "  ✓ Dijkstra správně vrátil -1 pro nedosažitelný vrchol.\n";
}

// ============================================================================
// MAIN
// ============================================================================

int main() {
  std::cout << "=== Spouštím testy grafových algoritmů ===\n\n";

  // Cvičení 0 je hotové:
  test_get_distance();
  std::cout << "\n";

  // ------------------------------------------------------------------------
  // Následující testy si odkomentujte postupně podle toho, které cvičení
  // zrovna implementujete:
  // ------------------------------------------------------------------------

  // test_dfs();              // CVIČENÍ 1
  // test_bfs();              // CVIČENÍ 2
  // test_state_action_bfs(); // CVIČENÍ 3 (LostHero + SuperstitiousHero)
  // test_dijkstra();          // CVIČENÍ 4

  std::cout << "\n🎉 VŠECHNY AKTIVNÍ TESTY ÚSPĚŠNĚ PROŠLY!\n";
  return 0;
}

```
