# 💻 PA2 → AG1: Kompaktní Kódovací Tahák (Týdny 1–8)

> **Vyvážený rychlotahák zaměřený na psaní kódu** (vychází z nejrelevantnějších témat z Traineru a STL e-learningu s relevancí 60%+).
> Každé téma obsahuje **1–2 věty principu**, klíčovou past a **pouze nezbytný minimalistický kód** tam, kde je potřeba syntaxe. U kontejnerů jsou metody a jejich diagramy umístěny vedle sebe.

---

## 📅 Týden 1: Základy C++

### 1. Reference & Reference na konstantu `[100% · Trainer]`
- **Princip**: Reference je neměnný alias pro existující proměnnou v paměti (nealokuje adresu, nemůže být `nullptr`). `const &` umožňuje rychlé čtení velkých objektů bez nákladného kopírování.
- **Kód**:
```cpp
void process(const std::vector<int> &data); // Read-only předání bez kopie
void swap(int &a, int &b) { int tmp = a; a = b; b = tmp; } // Změna originálu
```
- ⚠️ **Past**: Nikdy nevracejte referenci na lokální proměnnou z funkce — po návratu proměnná zanikne (*dangling reference* / segfault).

### 2. Výchozí (implicitní) argumenty `[100% · Trainer]`
- **Princip**: Umožňují volat funkci bez zadání parametrů zprava, kompilátor doplní výchozí hodnoty.
- **Kód**:
```cpp
void addEdge(int u, int v, int weight = 1); // Zapsat POUZE do deklarace v hlavičce (.h/.hpp)
```

### 3. Přetěžování funkcí `[100% · Trainer]`
- **Princip**: Více funkcí se stejným jménem, které se liší typem nebo počtem parametrů (signaturou).
- ⚠️ **Past**: Samotný návratový typ pro přetížení nestačí (`int f()` a `void f()` v jednom rozsahu nelze přeložit).

### 4. Jmenné prostory (`namespace`) `[100% · Trainer]`
- **Princip**: Logicky izolují identifikátory a brání kolizím jmen funkcí a tříd.
- ⚠️ **Past**: Nikdy nepište `using namespace std;` do hlavičkových souborů (`.h`/`.hpp`), znečistíte tím všechny soubory, které hlavičku vloží.

### 5. Řazení v C++ (`std::sort`) `[70% · Trainer]`
- **Princip**: Rychlé $O(n \log n)$ řazení z knihovny `<algorithm>`.
- **Kód**:
```cpp
std::sort(v.begin(), v.end());                     // Vzestupně (vyžaduje operator<)
std::sort(v.begin(), v.end(), std::greater<int>()); // Sestupně
```

### 6. Dynamická alokace (`new` a `delete`) `[60% · Trainer]`
- **Princip**: Přímé řízení paměti na haldě (v moderním C++ preferujte `std::vector` a RAII).
- ⚠️ **Past**: Pro pole alokované přes `new T[n]` se musí použít `delete[] ptr;` (pouhé `delete ptr;` způsobí memory leak a nedefinované chování).

---

## 📅 Týden 2: Třídy & OOP

### 7. Metody & Konstantní metody (`const`) `[100% · Trainer]`
- **Princip**: Metoda s `const` za hlavičkou garantuje, že nemění atributy objektu (`this` je `const T*`).
- **Kód**:
```cpp
int getVertexCount() const { return m_count; } // Povinné, aby šlo volat na const &
```
- ⚠️ **Past**: Zapomenutí `const` znemožní zavolat metodu na instanci předané jako `const &`.

### 8. Konstruktory & Inicializační seznam `[100% · Trainer]`
- **Princip**: Inicializační seznam nastavuje atributy přímo při vzniku před vstupem do těla `{}`.
- **Kód**:
```cpp
class Point {
    const int m_id;
    int m_x, m_y;
public:
    Point(int id, int x, int y) : m_id(id), m_x(x), m_y(y) {} // const členy MUSÍ být v seznamu!
};
```

### 9. Zapouzdření (`class` vs `struct`) `[70% · Trainer]`
- **Princip**: Jediný rozdíl v C++: `struct` má členy i dědičnost implicitně `public`, zatímco `class` implicitně `private`.

### 10. Statické členy (`static`) `[65% · Trainer]`
- **Princip**: Patří samotné třídě, nikoliv konkrétní instanci; sdílí je všechny vytvořené objekty.

### 11. Chytré řetězce `std::string` `[100% · Trainer]`
- **Princip**: Dynamicky spravovaný řetězec znaků s automatickou alokací paměti.
- **Užitečné metody**: `s.size()`, `s.empty()`, `s += "text"`, `s.substr(pos, len)`, `s.find("sub")` (vrací `std::string::npos`, pokud nenalezeno).

---

## 📅 Týden 3: Přetěžování operátorů

### 12. Porovnávání & Uspořádání (`operator<`) `[100% · Trainer]`
- **Princip**: Zásadní operátor pro `std::set`, `std::map`, `std::priority_queue` a `std::sort`. Vyžaduje tzv. striktní slabé uspořádání (pokud jsou si prvky rovny, musí vrátit `false`).
- **Kód**:
```cpp
struct Edge {
    int to, weight;
    // Klíčové pro řazení hran v Kruskalově algoritmu (MST):
    bool operator<(const Edge &other) const {
        return weight < other.weight;
    }
};
```

### 13. Metoda versus volná funkce u operátorů `[80% · Trainer]`
- **Princip**: Operátory měnící levý operand (`+=`, `[]`, `=`) se píší jako metody třídy. Symetrické operátory (`+`, `<<` pro streamy) se píší jako volné funkce mimo třídu.

---

## 📅 Týden 4: Iterátory & Základní kontejnery

### 14. Základy iterátorů `[85% · Trainer]`
- **Princip**: Univerzální ukazovátko do kontejneru. Posun `++it`, přístup k hodnotě `*it`.
- **Kód**:
```cpp
for (auto it = v.begin(); it != v.end(); ++it) { ... }
for (auto it = v.rbegin(); it != v.rend(); ++it) { ... } // Výpis pozpátku
```

### 15. `std::vector<T>` — Dynamické pole `[100% Trainer · 90% E-learning]`
- **Princip**: Data leží v souvislém bloku paměti. Přímý přístup v $O(1)$, amortizované vkládání na konec v $O(1)$.

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-3">
  <div>
    <img src="/images/cheatsheet/vector-methods.png" alt="Schéma metod std::vector" class="w-full rounded-xl border border-stone-200 bg-white p-2 shadow-sm" />
  </div>
  <div class="overflow-x-auto">

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push_back(x)` | Vloží na konec ($O(1)$) | `v.push_back(10);` |
| `pop_back()` | Odebere z konce (vrací `void`) | `v.pop_back();` |
| `v[i]` / `at(i)` | Přímý indexový přístup ($O(1)$) | `int x = v[0];` |
| `front()` / `back()` | První / poslední prvek | `int last = v.back();` |
| `size()` / `empty()` | Velikost / kontrola prázdnosti | `if (!v.empty())` |
| `reserve(n)` | Předalokuje paměť (nemění size) | `v.reserve(1000);` |
| `erase(it)` | Smaže prvek na iterátoru | `v.erase(v.begin() + i);` |

  </div>
</div>

- ⚠️ **Past**: Při překročení kapacity se vektor přestěhuje v RAM -> **všechny dřívější iterátory a ukazatele na prvky zaniknou (invalidace)!**

### 16. `std::array<T, N>` — Statické pole `[60% · E-learning]`
- **Princip**: Pole pevné velikosti alokované přímo na zásobníku (stack) s nulovou režií na haldě.
- **Kód**:
```cpp
constexpr std::array<int, 4> dx = {0, 0, 1, -1}; // Směrové posuny v mřížce
```

---

## 📅 Týden 5: Pokročilé STL kontejnery

### 17. `std::queue<T>` — Fronta (FIFO) `[100% · E-learning]`
- **Princip**: First-In, First-Out (kdo dřív přijde, dřív odejde). Klíčová datová struktura pro **BFS**.

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-3">
  <div>
    <img src="/images/cheatsheet/queue-methods.png" alt="Schéma metod std::queue" class="w-full rounded-xl border border-stone-200 bg-white p-2 shadow-sm" />
  </div>
  <div class="overflow-x-auto">

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push(x)` | Vloží na konec fronty ($O(1)$) | `q.push(start);` |
| `pop()` | Odebere ze začátku (**vrací `void`**) | `q.pop();` |
| `front()` | Vrátí referenci na první prvek | `int u = q.front();` |
| `back()` | Vrátí referenci na poslední prvek | `int last = q.back();` |
| `empty()` | Test prázdnosti fronty | `while (!q.empty())` |
| `size()` | Počet prvků ve frontě | `size_t n = q.size();` |

  </div>
</div>

- ⚠️ **Past**: `q.pop()` **nic nevrací**! Hodnotu musíte nejprve přečíst přes `q.front()` a teprve poté zavolat `q.pop()`.

---

### 18. `std::priority_queue<T>` — Prioritní fronta / Halda `[100% · E-learning]`
- **Princip**: Binární halda. Na vrcholu `top()` udržuje nejvyšší prvek v $O(1)$, vkládání a mazání trvá $O(\log n)$.
- **Metody**: `push(x)` (vloží v $O(\log n)$), `pop()` (odebere extrém v $O(\log n)$), `top()` (náhled na extrém v $O(1)$), `empty()`.
- **Kód (Přepnutí na MIN-HEAP pro Dijkstrův algoritmus)**:
```cpp
// Implicitní je MAX-heap. Pro nejkratší cesty (Dijkstra) musíte použít std::greater:
using PII = std::pair<int, int>; // {vzdálenost, vrchol}
std::priority_queue<PII, std::vector<PII>, std::greater<PII>> minHeap;
```

---

### 19. `std::stack<T>` — Zásobník (LIFO) `[90% · E-learning]`
- **Princip**: Last-In, First-Out (poslední vložený jde první ven). Využití pro **iterativní DFS** a párování závorek.

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-3">
  <div>
    <img src="/images/cheatsheet/stack-methods.png" alt="Schéma metod std::stack" class="w-full rounded-xl border border-stone-200 bg-white p-2 shadow-sm" />
  </div>
  <div class="overflow-x-auto">

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push(x)` | Vloží prvek na vrchol ($O(1)$) | `s.push(node);` |
| `pop()` | Odebere prvek z vrcholu (**vrací `void`**) | `s.pop();` |
| `top()` | Vrátí referenci na vrcholový prvek | `int u = s.top();` |
| `empty()` | Test, zda je zásobník prázdný | `if (!s.empty())` |
| `size()` | Počet prvků v zásobníku | `s.size();` |

  </div>
</div>

- ⚠️ **Past**: Volání `s.top()` nebo `s.pop()` na prázdném zásobníku způsobí pád programu.

---

### 20. `std::deque<T>` — Oboustranná fronta `[80% · E-learning]`
- **Princip**: Umožňuje $O(1)$ vkládání i mazání na **obou koncích** a přímý přístup přes `[]`. Vkládání na konce nikdy neinvaliduje ukazatele na stávající prvky.

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-3">
  <div>
    <img src="/images/cheatsheet/deque-methods.png" alt="Schéma metod std::deque" class="w-full rounded-xl border border-stone-200 bg-white p-2 shadow-sm" />
  </div>
  <div class="overflow-x-auto">

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push_front(x)` / `push_back(x)` | Vloží na začátek / konec ($O(1)$) | `dq.push_front(1);` |
| `pop_front()` / `pop_back()` | Odebere ze začátku / konce ($O(1)$) | `dq.pop_front();` |
| `dq[i]` / `at(i)` | Přímý přístup k indexu ($O(1)$) | `int val = dq[0];` |
| `front()` / `back()` | Reference na první / poslední prvek | `dq.front();` |
| `size()` / `empty()` | Velikost a kontrola prázdnosti | `dq.empty();` |

  </div>
</div>

---

### 21. `std::list<T>` — Obousměrný spojový seznam `[80% · E-learning]`
- **Princip**: Uzly v paměti propojené obousměrnými ukazateli. Umožňuje $O(1)$ vkládání kdekoliv, pokud již máme iterátor.

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-3">
  <div>
    <img src="/images/cheatsheet/list-methods.png" alt="Schéma metod std::list" class="w-full rounded-xl border border-stone-200 bg-white p-2 shadow-sm" />
  </div>
  <div class="overflow-x-auto">

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push_front(x)` / `push_back(x)` | Vložení na začátek / konec ($O(1)$) | `l.push_back(5);` |
| `pop_front()` / `pop_back()` | Odebrání ze začátku / konce ($O(1)$) | `l.pop_back();` |
| `insert(it, x)` | Vloží prvek před iterátor ($O(1)$) | `l.insert(it, 15);` |
| `erase(it)` | Smaže uzel na daném iterátoru | `l.erase(it);` |
| `front()` / `back()` | První a poslední prvek | `l.front();` |

  </div>
</div>

- ⚠️ **Past**: V `std::list` **nelze použít index** `l[i]`! K prvkům se lze dostat výhradně sekvenčním posunem iterátoru `++it`.

---

### 22. `std::map<Key, Value>` — Asociativní strom `[70% · E-learning]`
- **Princip**: Samovyvažující se červeno-černý strom seřazených párů klíč-hodnota. Operace `insert`, `find`, `erase` trvají garantovaně $O(\log n)$.

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `find(key)` | Hledá klíč, vrací iterátor nebo `end()` | `if (m.find(k) != m.end())` |
| `count(key)` | Vrací 1 při existenci, jinak 0 | `if (m.count(k))` |
| `m[key]` | **POZOR: pokud klíč neexistuje, vytvoří ho!** | `m["body"] = 100;` |
| `erase(key)` | Smaže klíč v čase $O(\log n)$ | `m.erase(k);` |

- ⚠️ **Past**: Volání `if (m["neexistuje"] == 5)` automaticky vytvoří klíč s hodnotou `0`! Pro pouhé čtení používejte `.find()` nebo `.count()`.

---

### 23. `std::set<T>` — Uspořádaná množina `[60% · E-learning]`
- **Princip**: Červeno-černý strom uchovávající unikátní hodnoty v seřazeném pořadí.
- **Kód**:
```cpp
std::set<int> visited;
visited.insert(42);
if (visited.count(42)) { ... } // Nalezeno v O(log n)
visited.erase(42);
```

---

## 📅 Týden 7: Grafy a Stromy

### 24. Reprezentace grafu v kódu `[100% Trainer · 90% E-learning]`
- **Princip**: Seznam sousedů přes vnořený vektor je nejefektivnější volba pro 99 % úloh ($O(V + E)$ paměti).
- **Kód**:
```cpp
std::vector<std::vector<int>> adj(n); // n vrcholů (0 až n-1)

adj[u].push_back(v); // Orientovaná hrana: u -> v
adj[v].push_back(u); // Přidat i toto, pokud je graf neorientovaný: u <-> v
```

### 25. Grafové průchody BFS a DFS `[100% Trainer · 60% Lectures]`
- **Princip**:
  - **BFS (Fronta `std::queue`)**: Nalezne nejkratší cestu v neohodnoceném grafu ($O(V + E)$).
  - **DFS (Rekurze)**: Prochází do hloubky (detekce cyklů, komponenty souvislosti).
- **Kód (BFS šablona)**:
```cpp
std::vector<bool> visited(n, false);
std::queue<int> q;
visited[start] = true; q.push(start); // Označit VŽDY při vložení do fronty!

while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) {
        if (!visited[v]) {
            visited[v] = true;
            q.push(v);
        }
    }
}
```
- ⚠️ **Past**: V BFS musíte vrchol označit jako `visited` **ihned při vložení `q.push(v)`**. Pokud označíte až při `q.pop()`, dojde k zahlcení fronty duplicitami a pád programu na limit paměti.

### 26. Binární vyhledávací strom (BST) `[100% · E-learning]`
- **Princip**: Pro každý uzel platí `levý < uzel < pravý`. Vyhledávání průměrně trvá $O(\log n)$, při degeneraci (seřazená data) však padá na $O(n)$.

---

## 📅 Týden 8: Šablony (Generické programování)

### 27. Šablony funkcí & tříd `[60% · E-learning]`
- **Princip**: Šablona je předpis pro kompilátor, který vytvoří konkrétní funkci/třídu až při jejím volání pro daný typ.
- **Kód**:
```cpp
template <typename T>
T myMax(T a, T b) { return (a > b) ? a : b; } // Šablona funkce

template <typename T>
struct Node { T val; Node *next = nullptr; }; // Šablona třídy/struktury
```
- ⚠️ **Past**: Celé tělo šablony musí být definováno **přímo v hlavičkovém souboru (`.hpp`/`.h`)**, nikoliv v `.cpp`, jinak linker ohlásí *undefined reference*.
