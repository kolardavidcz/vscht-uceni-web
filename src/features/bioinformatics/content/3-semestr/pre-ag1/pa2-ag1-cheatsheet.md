# 💻 PA2 → AG1: Kompaktní Kódovací Tahák (Týdny 1–8)

> **Vyvážený rychlotahák zaměřený na psaní kódu** (vychází z nejrelevantnějších témat z Traineru a STL e-learningu s relevancí 60%+).
> Každé téma obsahuje **1–2 věty principu**, klíčovou past a **pouze nezbytný minimalistický kód s důrazem na maximální čitelnost**. U kontejnerů jsou metody a diagramy umístěny vedle sebe.

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
- **Princip**: Logicky izolují identifikátory a řeší kolize shodných jmen funkcí a tříd. Pro přístup k identifikátoru v konkrétním prostoru slouží operátor `::`.
- **Kód (Řešení kolizí jmen)**:
```cpp
#include <stdio.h>

namespace something {
    int printf(const char * fmt, ...);
}

namespace anything {
    int printf(const char * fmt, ...);
}

int main() {
    something::printf("Hello\n"); // Volá printf z namespace something
    anything::printf("World\n");  // Volá printf z namespace anything
    printf("!\n");                // Volá globální ::printf z <stdio.h>
}
```
- ⚠️ **Past**: Nikdy nepište `using namespace std;` do hlavičkových souborů (`.h`/`.hpp`), znečistíte tím všechny soubory, které hlavičku vloží.

### 5. Dynamická alokace (`new` a `delete`) `[60% · Trainer]`
- **Princip**: Přímé řízení paměti na haldě (v moderním C++ preferujte `std::vector` a RAII).
- ⚠️ **Past**: Pro pole alokované přes `new T[n]` se musí použít `delete[] ptr;` (pouhé `delete ptr;` způsobí memory leak a nedefinované chování).

---

## 📅 Týden 2: Třídy & OOP

### 6. Třídy, Zapouzdření & Statika `[100% · Trainer]`
- **Princip**: Třída zapouzdřuje data (`private`) a rozhraní (`public`). `const` metody chrání objekt před nechtěnou změnou (`this` je `const T*`) a `static` členy patří samotné třídě jako celku, nikoliv konkrétní instanci.
- ⚠️ **Past**: Zapomenutí `const` za hlavičkou metody znemožní její zavolání na instanci předané jako `const &`.

### 7. Konstruktory, Destruktor & Uživatelské konverze `[100% · Trainer]`
- **Princip**: Inicializační seznam nastavuje atributy přímo při vzniku před vstupem do těla `{}` (povinné pro `const` a reference). Konstruktor s jedním argumentem (bez klíčového slova `explicit`) slouží kompilátoru jako automatický konverzní můstek.
- 💡 **Kouzlo konverze pro operátory**: Nemusíte přetěžovat operátory pro každou kombinaci typů (např. `T + int` i `int + T`). Stačí definovat konverzní konstruktor `T(int)` a volný symetrický `operator+(T, T)` — kompilátor cizí typ sám převede na `T` a sečte je!

### 8. Chytré řetězce `std::string` `[100% · Trainer]`
- **Princip**: Dynamicky spravovaný řetězec znaků s automatickou alokací paměti.
- **Užitečné metody**: `s.size()`, `s.empty()`, `s += "text"`, `s.substr(pos, len)`, `s.find("sub")` (vrací `std::string::npos`, pokud nenalezeno).

---

## 📅 Týden 3: Přetěžování operátorů

### 9. Porovnávání & Uspořádání (`operator<` a `operator<=>`) `[100% · Trainer]`
- **Princip**: Zásadní pro `std::set`, `std::map`, `std::priority_queue` a `std::sort`. Vyžaduje striktní slabé uspořádání (při rovnosti musí vrátit `false`). V moderním C++20 stačí `auto operator<=>(const T &) const = default;`.

### 10. Metoda versus volná funkce u operátorů `[80% · Trainer]`
- **Princip**: Operátory měnící levý operand (`+=`, `[]`, `=`) se píší jako metody třídy. Symetrické operátory (`+`, `-`, `<<` pro streamy) se píší jako volné funkce mimo třídu.

### 🌟 Sjednocená kódová ukázka pro Týdny 2 a 3 (OOP, Konverze, Operátory & Uspořádání)
- **Pokrývá vše v jednom celku**: `class` (`private`/`public`), inicializační seznam, konverzní konstruktor (`int -> Weight`), destruktor, `const` metodu, `static` členy, metodu `operator+=`, volnou funkci `operator+` s uživatelskou konverzí, `operator<` i C++20 `operator<=>`.
```cpp
class Weight {
private:
    int m_grams;
    static int s_count; // Statický člen: sdílen všemi instancemi

public:
    // Konverzní konstruktor (int -> Weight) s inicializačním seznamem:
    Weight(int g = 0) : m_grams(g) { ++s_count; }
    ~Weight() { --s_count; } // Destruktor (úklid prostředků / dekrementace)

    int grams() const { return m_grams; } // Konstantní metoda (lze volat na const &)
    static int getCount() { return s_count; } // Statická metoda: Weight::getCount()

    // Operátor měnící levý operand (METODA třídy):
    Weight & operator+=(const Weight &other) { m_grams += other.m_grams; return *this; }

    // Uspořádání (pro std::sort, std::set, std::priority_queue):
    bool operator<(const Weight &other) const { return m_grams < other.m_grams; }
    auto operator<=>(const Weight &) const = default; // C++20: vygeneruje <, <=, >, >=, ==, !=
};

int Weight::s_count = 0; // Inicializace statického členu mimo třídu

// Symetrický operátor jako VOLNÁ FUNKCE: obslouží Weight + Weight, Weight + int i int + Weight!
Weight operator+(Weight a, const Weight &b) { return a += b; }

// Praktické použití a ukázka konverze v akci:
Weight w(100);
Weight r1 = w + 50;  // Kompilátor automaticky zavolá Weight(50) -> sečte
Weight r2 = 25 + w;  // Funguje symetricky i zleva bez dalších přetížených operátorů!
```

---

## 📅 Týden 4: Iterátory & Základní kontejnery

### 11. Základy iterátorů (`begin` a `end`) `[85% · Trainer]`
- **Princip**: Univerzální ukazovátko do kontejneru. `begin()` vrací iterátor na 1. prvek, `end()` vrací pozici **za posledním prvkem**. Posun `++it`, přístup k hodnotě `*it`.
- **Kód**:
```cpp
for (auto it = v.begin(); it != v.end(); ++it) { ... }
for (auto it = v.rbegin(); it != v.rend(); ++it) { ... } // Výpis pozpátku
```

### 12. `std::vector<T>` — Dynamické pole `[100% Trainer · 90% E-learning]`
- **Princip**: Data leží v souvislém bloku paměti. Přímý přístup v $O(1)$, amortizované vkládání na konec v $O(1)$.

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center my-3">
  <div>
    <img src="/images/cheatsheet/vector-methods.png" alt="Schéma metod std::vector" class="w-full rounded-xl border border-stone-200 bg-white p-2 shadow-sm" />
  </div>
  <div class="overflow-x-auto">

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `push_back(x)` | Vloží hotový prvek na konec ($O(1)$) | `v.push_back(10);` |
| `emplace_back(...)` | Vytvoří prvek přímo na konci (bez kopie) | `v.emplace_back(1, 2);` |
| `insert(it, x)` | Vloží prvek před iterátor ($O(n)$) | `v.insert(v.begin() + 2, 99);` |
| `emplace(it, ...)` | Vytvoří prvek před iterátorem | `v.emplace(v.begin(), 1, 2);` |
| `pop_back()` | Odebere z konce (vrací `void`) | `v.pop_back();` |
| `begin()` / `end()` | Iterátory na 1. prvek a pozici za koncem | `auto it = v.begin();` |
| `v[i]` / `at(i)` | Přímý indexový přístup ($O(1)$) | `int x = v[0];` |
| `front()` / `back()` | První / poslední prvek | `int last = v.back();` |
| `size()` / `empty()` | Velikost / kontrola prázdnosti | `if (!v.empty())` |
| `reserve(n)` | Předalokuje paměť (nemění `size`) | `v.reserve(1000);` |
| `erase(it)` | Smaže prvek na iterátoru | `v.erase(v.begin() + i);` |

  </div>
</div>

- 💡 **`emplace_back` vs `push_back`**: `emplace_back` předává argumenty přímo konstruktoru prvku v paměti vektoru, čímž šetří kopírování/přesun dočasných objektů.
- ⚠️ **Past**: Při překročení kapacity se vektor přealokuje v RAM -> **všechny dřívější iterátory a ukazatele na prvky zaniknou (invalidace)!**

### 13. `std::array<T, N>` — Statické pole `[60% · E-learning]`
- **Princip**: Pole pevné velikosti alokované přímo na zásobníku (stack) s nulovou režií na haldě.
- **Kód**:
```cpp
constexpr std::array<int, 4> dx = {0, 0, 1, -1}; // Směrové posuny v mřížce
```

---

## 📅 Týden 5: Pokročilé STL kontejnery

### 14. `std::queue<T>` — Fronta (FIFO) `[100% · E-learning]`
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

### 15. `std::priority_queue<T>` — Prioritní fronta / Halda `[100% · E-learning]`
- **Princip**: Binární halda. Na vrcholu `top()` udržuje nejvyšší prvek v $O(1)$, vkládání a mazání trvá $O(\log n)$.
- **Metody**: `push(x)` (vloží v $O(\log n)$), `pop()` (odebere extrém v $O(\log n)$), `top()` (náhled na extrém v $O(1)$), `empty()`.
- **Kód (Přepnutí na MIN-HEAP pro Dijkstrův algoritmus)**:
```cpp
// Implicitní je MAX-heap. Pro nejkratší cesty (Dijkstra) musíte použít std::greater:
using PII = std::pair<int, int>; // {vzdálenost, vrchol}
std::priority_queue<PII, std::vector<PII>, std::greater<PII>> minHeap;
```

---

### 16. `std::stack<T>` — Zásobník (LIFO) `[90% · E-learning]`
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

### 17. `std::deque<T>` — Oboustranná fronta `[80% · E-learning]`
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

### 18. `std::list<T>` — Obousměrný spojový seznam `[80% · E-learning]`
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

### 19. `std::map<Key, Value>` — Asociativní strom `[70% · E-learning]`
- **Princip**: Samovyvažující se červeno-černý strom seřazených párů klíč-hodnota. Operace `insert`, `find`, `erase` trvají garantovaně $O(\log n)$.

| Metoda | Popis | Příklad |
| :--- | :--- | :--- |
| `find(key)` | Hledá klíč, vrací iterátor nebo `end()` | `if (m.find(k) != m.end())` |
| `count(key)` | Vrací 1 při existenci, jinak 0 | `if (m.count(k))` |
| `m[key]` | **POZOR: pokud klíč neexistuje, vytvoří ho!** | `m["body"] = 100;` |
| `erase(key)` | Smaže klíč v čase $O(\log n)$ | `m.erase(k);` |

- ⚠️ **Past**: Volání `if (m["neexistuje"] == 5)` automaticky vytvoří klíč s hodnotou `0`! Pro pouhé čtení používejte `.find()` nebo `.count()`.

---

### 20. `std::set<T>` — Uspořádaná množina `[60% · E-learning]`
- **Princip**: Červeno-černý strom uchovávající unikátní hodnoty v seřazeném pořadí.
- **Kód**:
```cpp
std::set<int> visited;
visited.insert(42);
if (visited.count(42)) { ... } // Nalezeno v O(log n)
visited.erase(42);
```

---

## 📅 Týden 6: STL Algoritmy a vyhledávání

### 21. Řazení & Binární vyhledávání (`std::sort`, `lower_bound`, `binary_search`) `[70% Trainer · 60% E-learning]`
- **Princip**: Vyhledávací algoritmy z `<algorithm>` vyžadují **předem seřazený kontejner**. Všechny pracují v logaritmickém čase $O(\log n)$.
- **Jak fungují návratové hodnoty**:
  - `std::lower_bound(begin, end, val)` vrací iterátor na **první prvek**, který je $\ge val$.
  - `std::upper_bound(begin, end, val)` vrací iterátor na **první prvek**, který je $> val$.
  - `std::binary_search(begin, end, val)` vrací pouze `bool` (`true` / `false`), zda prvek v poli existuje.
  - **Získání indexu**: Číselný index získáme odečtením iterátoru začátku: `int idx = it - v.begin();`.
  - **Ověření nalezení**: Zda prvek skutečně existuje ověříme testem `if (it != v.end() && *it == val)`.
- **Kód**:
```cpp
std::vector<int> v = {10, 20, 30, 30, 40};
std::sort(v.begin(), v.end()); // Povinná podmínka pro binární vyhledávání!

// 1. Zjištění pouhé existence (vrací bool true/false):
bool exists = std::binary_search(v.begin(), v.end(), 30); // true

// 2. lower_bound: vrací iterátor na první prvek >= 30:
auto it = std::lower_bound(v.begin(), v.end(), 30);
if (it != v.end() && *it == 30) {
    int idx = it - v.begin(); // Převod iterátoru na index (idx = 2)
}

// 3. Počet výskytů seřazeného prvku v O(log n):
auto ub = std::upper_bound(v.begin(), v.end(), 30); // první prvek > 30
int count = ub - it; // 2 prvky s hodnotou 30
```

---

## 📅 Týden 7: Grafy a Stromy

### 22. Reprezentace grafu v kódu `[100% Trainer · 90% E-learning]`
- **Princip**: Seznam sousedů přes vnořený vektor je nejefektivnější volba pro 99 % úloh ($O(V + E)$ paměti).
- **Kód**:
```cpp
std::vector<std::vector<int>> adj(n); // n vrcholů (0 až n-1)

adj[u].push_back(v); // Orientovaná hrana: u -> v
adj[v].push_back(u); // Přidat i toto, pokud je graf neorientovaný: u <-> v
```

### 23. Grafové průchody a vyhledávání cest `[100% Trainer · 60% Lectures]`
- **Rychlý přehled pro AG1**:
  - **BFS (Prohledávání do šířky)**:
    - Používá **frontu `std::queue`** (nebo preferovanou **`std::deque`**, která je v praxi rychlejší).
    - Hledá nejkratší cestu v neohodnoceném grafu (počet hran).
  - **DFS (Prohledávání do hloubky)**:
    - Používá **rekurzi** (systémový zásobník) nebo explicitní **`std::stack`**.
    - Využití: detekce cyklů, topologické uspořádání, komponenty souvislosti.
  - **Dijkstrův algoritmus**:
    - Nejkratší cesty v grafu s nezápornými vahami hran.
    - Používá **prioritní frontu `std::priority_queue` (min-heap)**: `std::priority_queue<PII, std::vector<PII>, std::greater<PII>>`.
- ⚠️ **Kritická past v BFS**: Vrchol označte jako `visited` **ihned při vložení do fronty**! Pokud ho označíte až při vyzvednutí `pop`, do fronty se vloží stejný vrchol mnohokrát a program havaruje na limit paměti.

### 24. Binární vyhledávací strom (BST) `[100% · E-learning]`
- **Princip**: Pro každý uzel platí `levý potomek < uzel < pravý potomek`. Vyhledávání průměrně trvá $O(\log n)$, při degeneraci (seřazená data) však padá na $O(n)$.

---

## 📅 Týden 8: Šablony (Generické programování)

### 25. Šablony funkcí & tříd `[60% · E-learning]`
- **Princip**: Šablona je předpis pro kompilátor, který vygeneruje konkrétní kód až při volání s daným datovým typem.
- **Kód**:
```cpp
template <typename T>
T myMax(T a, T b) { return (a > b) ? a : b; } // Šablona funkce

template <typename T>
struct Node { T val; Node *next = nullptr; }; // Šablona třídy/struktury
```
- 💡 **Osvědčený postup pro tvorbu šablon**:
  Nejprve celou funkci či třídu napište a **odlaďte pro konkrétní normální typ** (např. `int` nebo `std::string`). Jakmile kód spolehlivě funguje a projde testy, teprve potom ho zobecněte: nahraďte typ symbolem `T` a přidejte `template <typename T>`. Ušetříte si tím luštění nepřehledných chybových hlášení kompilátoru.

---

## 📅 Po Týdnu 8: Chytré ukazatele (`std::unique_ptr` vs `std::shared_ptr`)

### 26. Automatická správa paměti (Smart Pointers)
- **Proč vznikly**: Zabraňují memory leakům díky RAII — alokovaná paměť se automaticky uvolní destruktorem při opuštění rozsahu platnosti.
- **`std::shared_ptr<T>` — Snadnější na ovládání (Sdílené vlastnictví)**:
  - Dynamický objekt může vlastnit více ukazatelů současně.
  - Využívá **čítač referencí** (při zkopírování ukazatele se čítač zvýší, při zániku sníží; objekt se smaže až se zánikem posledního ukazatele).
  - **Proč se s ním pracuje lépe**: Můžete ho libovolně kopírovat, předávat hodnotou do funkcí i vkládat do STL kontejnerů bez složitého přesouvání.
- **`std::unique_ptr<T>` — Nulová režie (Výhradní vlastnictví)**:
  - Objekt smí vlastnit v daný okamžik právě **jeden** ukazatel.
  - **Co je zablokováno**: Kopírovací konstruktor i operátor přiřazení jsou **zakázány (`= delete`)**! Nelze ho zkopírovat `auto p2 = p1;` (chyba překladu).
  - **Jak s ním pracovat**: Vlastnictví lze pouze **přesunout** pomocí `std::move()`: `auto p2 = std::move(p1);` (tím se `p1` vynuluje na `nullptr`).
- **Kód**:
```cpp
// 1. shared_ptr - lze snadno kopírovat a předávat:
auto s1 = std::make_shared<int>(42);
auto s2 = s1; // OK, oba sdílí stejnou paměť (počet referencí = 2)

// 2. unique_ptr - maximální výkon, ale striktní vlastnictví:
auto u1 = std::make_unique<int>(42);
// auto u2 = u1;         // CHYBA PŘEKLADU: kopírování je zakázáno (= delete)!
auto u2 = std::move(u1); // OK: Vlastnictví přesunuto do u2 (u1 je nyní nullptr).
```
