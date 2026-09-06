# 💻 PA2 → AG1: Praktický Kódovací Tahák (Kontejnery & Metody)

> **Praktický tahák pro psaní kódu** zaměřený na nejdůležitější STL kontejnery a struktury z **BI-PA2 / BI-AG1** (témata s relevancí 60%+ nebo odznakem EPIC).
>
> Místo zkouškové teorie obsahuje tento tahák **vizuální schémata metod**, přehled nejpoužívanějších funkcí a **maximálně jednoduché, snadno zapamatovatelné C++ snippety**.

---

## 📦 1. `std::vector<T>` — Dynamické pole `[Relevance: 90% · EPIC]`

Nejčastější kontejner pro ukládání dat a reprezentaci grafů. Data leží v souvislém bloku paměti.

### 📐 Vizuální mapa metod
![Schéma metod std::vector](/images/cheatsheet/vector-methods.png)

### 🛠️ Nejužitečnější metody
| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push_back(x)` | Přidá prvek na konec (amortizovaně $O(1)$) | `v.push_back(42);` |
| `pop_back()` | Odebere poslední prvek (vrací `void`!) | `v.pop_back();` |
| `v[i]` / `at(i)` | Přímý přístup k prvku na indexu $i$ ($O(1)$) | `int x = v[0];` |
| `front()` / `back()` | Reference na první / poslední prvek | `v.back() += 1;` |
| `size()` / `empty()` | Počet prvků / kontrola prázdnosti | `if (!v.empty())` |
| `clear()` | Vymaže všechny prvky (velikost = 0) | `v.clear();` |
| `reserve(n)` | Předalokuje paměť pro $n$ prvků (nemění `size()`) | `v.reserve(1000);` |

### 💡 Jednoduchý kód
```cpp
#include <vector>
#include <iostream>

std::vector<int> v = {10, 20, 30};
v.push_back(40); // {10, 20, 30, 40}
v.pop_back();    // {10, 20, 30}

// Rychlý průchod všemi prvky (moderní C++):
for (int x : v) {
    std::cout << x << ' ';
}
```

> ⚠️ **Past při kódování**: Pokud vektor při `push_back` překročí kapacitu, přestěhuje se na jinou adresu v paměti RAM. **Všechny dříve uložené iterátory a ukazatele na prvky vektoru se tím zneplatní!**

---

## 📦 2. `std::queue<T>` — Fronta (FIFO) `[Relevance: 100% · MEGA EPIC]`

Kontejner typu **First-In, First-Out** (kdo dřív přijde, ten dřív odejde). Zcela zásadní pro algoritmus **BFS**.

### 📐 Vizuální mapa metod
![Schéma metod std::queue](/images/cheatsheet/queue-methods.png)

### 🛠️ Nejužitečnější metody
| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push(x)` | Vloží prvek na konec fronty | `q.push(v);` |
| `pop()` | Odebere prvek ze začátku fronty (**POZOR: vrací `void`!**) | `q.pop();` |
| `front()` | Vrátí referenci na první prvek (ke čtení i zápisu) | `int u = q.front();` |
| `back()` | Vrátí referenci na naposledy přidaný prvek | `int last = q.back();` |
| `empty()` | Test, zda je fronta prázdná | `while (!q.empty())` |
| `size()` | Aktuální počet prvků ve frontě | `size_t n = q.size();` |

### 💡 Jednoduchý kód
```cpp
#include <queue>
#include <iostream>

std::queue<int> q;
q.push(1);
q.push(2);

// Standardní cyklus zpracování fronty:
while (!q.empty()) {
    int u = q.front(); // 1. přečíst
    q.pop();           // 2. odebrat
    std::cout << u << ' ';
}
```

> ⚠️ **Past při kódování**: `q.pop()` **nic nevrací**! Nezkoušejte psát `int x = q.pop();`. Vždy musíte nejprve zavolat `q.front()` a teprve poté `q.pop()`.

---

## 📦 3. `std::stack<T>` — Zásobník (LIFO) `[Relevance: 90% · EPIC]`

Kontejner typu **Last-In, First-Out** (prvek vložený naposledy se zpracuje jako první). Používá se pro **DFS**, závorkové párování a vyhodnocování výrazů.

### 📐 Vizuální mapa metod
![Schéma metod std::stack](/images/cheatsheet/stack-methods.png)

### 🛠️ Nejužitečnější metody
| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push(x)` | Vloží prvek na vrchol zásobníku | `s.push(42);` |
| `pop()` | Odebere prvek z vrcholu (**vrací `void`!**) | `s.pop();` |
| `top()` | Vrátí referenci na prvek na vrcholu | `int x = s.top();` |
| `empty()` | Test, zda je zásobník prázdný | `if (!s.empty())` |
| `size()` | Počet prvků v zásobníku | `s.size()` |

### 💡 Jednoduchý kód
```cpp
#include <stack>
#include <iostream>

std::stack<int> s;
s.push(10);
s.push(20);

// Na vrcholu je nyní 20:
int topVal = s.top();
s.pop(); // Odebere 20

std::cout << "Novy vrchol: " << s.top() << '\n'; // Vypíše 10
```

> ⚠️ **Past při kódování**: Volání `s.top()` nebo `s.pop()` na **prázdném zásobníku** způsobuje okamžitý pád programu (Segmentation Fault). Vždy nejprve ověřte `!s.empty()`.

---

## 📦 4. `std::priority_queue<T>` — Prioritní fronta / Halda `[Relevance: 100% · MEGA EPIC]`

Vnitřně uspořádaná binární halda. Zajišťuje, že na vrcholu je vždy prvek s nejvyšší prioritou (v čase $O(1)$). Vkládání i mazání trvá $O(\log n)$.

### 📐 Schéma fungování
```text
                 [ top() = EXTRÉM ]  <-- O(1) náhled
                     /        \
                   [o]        [o]    <-- Každý uzel splňuje vlastnost haldy
                  /   \      /   \
                [o]   [o]  [o]   [o]
     
     push(x) --> vloží na konec a probublá nahoru: O(log n)
     pop()   --> smaže kořen a přesype haldu:       O(log n)
```

### 🛠️ Nejužitečnější metody
| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push(x)` | Vloží prvek do haldy v čase $O(\log n)$ | `pq.push(15);` |
| `pop()` | Odebere extrém z vrcholu haldy ($O(\log n)$) | `pq.pop();` |
| `top()` | Vrátí nejvyšší prvek bez odebrání ($O(1)$) | `int best = pq.top();` |
| `empty()` | Kontrola prázdnosti haldy | `while (!pq.empty())` |

### 💡 Jak vytvořit MIN-HEAP (pro Dijkstrův algoritmus)
Implicitní halda v C++ je **MAX-heap** (vrací největší číslo). V AG1 pro nejkratší cesty ale potřebujete **MIN-heap** (vracet nejmenší vzdálenost):

```cpp
#include <queue>
#include <vector>
#include <iostream>

// 1. Výchozí MAX-heap (největší nahoře):
std::priority_queue<int> maxHeap;
maxHeap.push(10);
maxHeap.push(30);
std::cout << maxHeap.top() << '\n'; // Vypíše 30

// 2. MIN-heap pro AG1 (nejmenší nahoře - klíč pro Dijkstru):
using PII = std::pair<int, int>; // {vzdalenost, vrchol}
std::priority_queue<PII, std::vector<PII>, std::greater<PII>> minHeap;

minHeap.push({5, 1});
minHeap.push({2, 4});
auto [dist, vertex] = minHeap.top(); // {2, 4} - nejkratší vzdálenost!
minHeap.pop();
```

---

## 📦 5. `std::deque<T>` — Oboustranná fronta `[Relevance: 80%]`

Hybrid mezi polem a seznamem. Umožňuje $O(1)$ přidávání i odebírání na **obou koncích** a přímý přístup `[]`.

### 📐 Vizuální mapa metod
![Schéma metod std::deque](/images/cheatsheet/deque-methods.png)

### 🛠️ Nejužitečnější metody
| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push_front(x)` / `push_back(x)` | Přidání na začátek / konec ($O(1)$) | `dq.push_front(1);` |
| `pop_front()` / `pop_back()` | Odebrání ze začátku / konce ($O(1)$) | `dq.pop_back();` |
| `dq[i]` / `front()` / `back()` | Přímý indexový přístup v čase $O(1)$ | `int x = dq[0];` |

### 💡 Jednoduchý kód
```cpp
#include <deque>
#include <iostream>

std::deque<int> dq;
dq.push_back(10);
dq.push_front(5);  // {5, 10}
dq.push_back(20);  // {5, 10, 20}

dq.pop_front();    // Odebere 5 -> zbývá {10, 20}
std::cout << "Prvni: " << dq.front() << ", Posledni: " << dq.back() << '\n';
```

---

## 📦 6. `std::list<T>` & `std::forward_list<T>` — Spojové seznamy `[Relevance: 80% / 50% · EPIC]`

Uzlové seznamy. Výhodné, pokud potřebujete často vkládat nebo mazat uprostřed sekvence v $O(1)$ (pokud už máte iterátor).

### 📐 Vizuální mapa metod `std::list`
![Schéma metod std::list](/images/cheatsheet/list-methods.png)

### 🛠️ Nejužitečnější metody
- `std::list`: `push_front()`, `push_back()`, `pop_front()`, `pop_back()`, `insert(it, val)`, `erase(it)`
- `std::forward_list`: Pouze jednosměrný (`push_front()`, `insert_after()`, `erase_after()`)

### 💡 Jednoduchý kód
```cpp
#include <list>
#include <iostream>

std::list<int> l = {10, 20, 30};
l.push_front(5); // {5, 10, 20, 30}

// Vložení prvku před prvek 20:
auto it = l.begin();
++it; // Ukazuje na 10
++it; // Ukazuje na 20
l.insert(it, 15); // {5, 10, 15, 20, 30}
```

> ⚠️ **Past při kódování**: Do `std::list` **nelze přistupovat indexem** `l[i]`! Prvky nelze náhodně indexovat, musíte k nim dojít postupným posunem iterátoru (`++it`).

---

## 📦 7. `std::map<Key, Value>` — Asociativní stromový slovník `[Relevance: 70% · EPIC]`

Ukládá páry `(klíč, hodnota)` do seřazeného samovyvažujícího se stromu (Red-Black Tree). Hledání, vkládání i mazání trvá garantovaně **$O(\log n)$**.

### 🛠️ Nejužitečnější metody
| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `m[key]` | Vrátí hodnotu pro klíč. **POZOR: pokud neexistuje, automaticky ji vytvoří!** | `counts["apple"]++;` |
| `find(key)` | Vyhledá klíč. Vrací iterátor na prvek, nebo `m.end()`, pokud neexistuje. | `if (m.find(k) != m.end())` |
| `count(key)` | Vrací 1, pokud klíč existuje, jinak 0 | `if (m.count(key))` |
| `erase(key)` | Smaže klíč ze slovníku ($O(\log n)$) | `m.erase(key);` |

### 💡 Jednoduchý kód
```cpp
#include <map>
#include <string>
#include <iostream>

std::map<std::string, int> scores;
scores["Alice"] = 95;
scores["Bob"] = 80;

// Bezpečné čtení bez nechtěného vložení nového prvku:
auto it = scores.find("Charlie");
if (it != scores.end()) {
    std::cout << "Skore: " << it->second << '\n';
} else {
    std::cout << "Charlie v mape neni!\n";
}

// Procházení mapy (klíče jsou automaticky seřazeny abecedně!):
for (const auto &[name, score] : scores) {
    std::cout << name << ": " << score << '\n';
}
```

> ⚠️ **Past při kódování**: Zápis `if (scores["Charlie"] == 100)` **automaticky vloží** klíč `"Charlie"` do mapy s výchozí hodnotou `0`! Pro testování existence VŽDY používejte `scores.count("Charlie")` nebo `scores.find("Charlie")`.

---

## 📦 8. `std::set<T>` — Uspořádaná množina unikátních prvků `[Relevance: 60%]`

Ukládá unikátní hodnoty v seřazeném pořadí. Všechny operace pracují v čase **$O(\log n)$**.

### 💡 Jednoduchý kód
```cpp
#include <set>
#include <iostream>

std::set<int> visited;
visited.insert(10);
visited.insert(20);
visited.insert(10); // Duplicita je tiše ignorována, množina obsahuje {10, 20}

if (visited.count(20)) {
    std::cout << "Vrchol 20 uz byl navstiven!\n";
}

// Vymazání prvku:
visited.erase(10);
```

---

## 📦 9. `std::array<T, N>` — Statické pole na zásobníku `[Relevance: 60%]`

Obal pro pole pevné velikosti alokované přímo na zásobníku (*stack*). Nulová režie na haldě.

### 💡 Jednoduchý kód
```cpp
#include <array>
#include <iostream>

// Typické použití v AG1: směrové posuny pro prohledávání v mřížce 2D:
constexpr std::array<int, 4> dx = {0, 0, 1, -1};
constexpr std::array<int, 4> dy = {1, -1, 0, 0};

int x = 5, y = 5;
for (size_t i = 0; i < dx.size(); ++i) {
    int nextX = x + dx[i];
    int nextY = y + dy[i];
    std::cout << "Soused: [" << nextX << ", " << nextY << "]\n";
}
```

---

## 📦 10. `std::bitset<N>` — Blesková bitová množina `[Relevance: 30% · EPIC]`

Kompaktní pole bitů velikosti $N$. Zrychluje množinové operace až $64\times$ díky bitovým instrukcím procesoru.

### 💡 Jednoduchý kód
```cpp
#include <bitset>
#include <iostream>

std::bitset<64> mask;
mask.set(5);       // Nastaví 5. bit na 1
mask.reset(5);     // Nastaví 5. bit na 0
mask.flip(0);      // Neguje 0. bit

if (mask.test(0)) { // Test, zda je bit 0 zapnutý
    std::cout << "Bit 0 je 1\n";
}
std::cout << "Pocet 1 bitu: " << mask.count() << '\n';
```

---

## 🔄 11. Iterátory v STL `[Relevance: 35% · EPIC]`

Iterátor se chová jako zobecněný ukazatel na prvek v libovolném kontejneru.

### 💡 Jednoduchý kód
```cpp
#include <vector>
#include <iostream>

std::vector<int> v = {1, 2, 3, 4, 5};

// 1. Moderní C++ auto iterace (doporučeno):
for (auto it = v.begin(); it != v.end(); ++it) {
    std::cout << *it << ' '; // Přístup k hodnotě přes hvězdičku *
}

// 2. Obrácený průchod (od konce k začátku):
for (auto it = v.rbegin(); it != v.rend(); ++it) {
    std::cout << *it << ' '; // Vypíše 5 4 3 2 1
}
```

---

## 🌳 12. Binární vyhledávací strom (BST) `[Relevance: 100%]`

Základní pravidlo BST: **všechny prvky vlevo jsou menší, všechny vpravo jsou větší**.

### 📐 Struktura uzlu a vyhledávání v kódu
```cpp
struct Node {
    int val;
    Node *left = nullptr;
    Node *right = nullptr;

    Node(int v) : val(v) {}
};

// Vyhledání hodnoty v BST:
bool search(Node *root, int target) {
    if (!root) return false;
    if (root->val == target) return true;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}
```

---

## 🌐 13. Reprezentace Grafu v Kódu pro AG1 `[Relevance: 90%]`

Nejjednodušší a nejefektivnější způsob zápisu grafu v úlohách — **seznam sousedů pomocí vnořeného vektoru**.

### 💡 Šablona pro orientovaný i neorientovaný graf
```cpp
#include <vector>
#include <iostream>

int n = 5; // Počet vrcholů (0 až 4)
std::vector<std::vector<int>> adj(n);

// 1. Orientovaná hrana (pouze u -> v):
void addDirectedEdge(int u, int v) {
    adj[u].push_back(v);
}

// 2. Neorientovaná hrana (u <-> v):
void addUndirectedEdge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u); // Zpětná hrana!
}
```

---

## 🚶 14. Grafové Průchody (BFS & DFS) pro Testy `[Relevance: 60%]`

Krátké, spolehlivé šablony, které zvládnete napsat během 2 minut.

### 💡 BFS (Prohledávání do šířky s frontou)
```cpp
#include <vector>
#include <queue>

void bfs(int start, const std::vector<std::vector<int>> &adj) {
    std::vector<bool> visited(adj.size(), false);
    std::queue<int> q;

    visited[start] = true;
    q.push(start); // Značíme navštívené VŽDY při vložení!

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}
```

### 💡 DFS (Prohledávání do hloubky rekurzí)
```cpp
#include <vector>

void dfs(int u, const std::vector<std::vector<int>> &adj, std::vector<bool> &visited) {
    visited[u] = true;

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}
```

---

## 🧩 15. Šablony (Generické funkce & třídy) `[Relevance: 60%]`

Jak napsat obecný kód pro libovolný typ.

### 💡 Jednoduchý kód
```cpp
// 1. Šablona funkce:
template <typename T>
T myMax(T a, T b) {
    return (a > b) ? a : b;
}

// 2. Šablona jednoduché třídy:
template <typename T>
struct Pair {
    T first;
    T second;
};

int main() {
    int m = myMax(10, 20);            // T je odvozeno jako int
    Pair<double> p = {3.14, 2.71};    // T je double
}
```

> ⚠️ **Pravidlo pro šablony**: Celá definice šablony (včetně těla funkcí) **musí být v hlavičkovém souboru** (`.h`/`.hpp`), neoddělujte ji do `.cpp`.

---

## ⚡ 16. Základní C++ I/O & Manipulátory `[Relevance: 15–20% · EPIC]`

```cpp
#include <iostream>
#include <iomanip>

// Zrychlení standardního I/O v C++ (klíč pro online testy):
std::ios_base::sync_with_stdio(false);
std::cin.tie(nullptr);

// Výpis čísla s pevnou přesností:
double pi = 3.14159265;
std::cout << std::fixed << std::setprecision(2) << pi << '\n'; // Vypíše 3.14
```
