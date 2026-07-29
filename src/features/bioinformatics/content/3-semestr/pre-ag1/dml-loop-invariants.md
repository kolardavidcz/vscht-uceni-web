# Modul 4: Invarianty Cyklů & Korektnost Algoritmu (BFS & Dijkstra)

> **[Relevance: 100%]** · **Tags:** `[MEGA EPIC]` `[INSIGHT]` `[PAST U ZKOUŠKY]`
> **Cíl modulu:** Naučit se dokazovat, že algoritmus dělá správně to, co tvrdíme — pomocí jednoduché myšlenky, která funguje vždy.

---

## ✈️ Pilotní check-list (aka invariant)

Pilot před odletem, za letu a po přistání kontroluje palivo v nádrži. Proč? Protože potřebuje **záruku** — že v každém okamžiku letu platí „mám dost paliva pro pokračování".

Invariant cyklu v algoritmech je úplně to samé:
- **Před startem cyklu** (inicializace): Zkontroluj, že podmínka platí na začátku.
- **Po každém průchodu cyklem** (udržování): Zkontroluj, že podmínka stále platí.
- **Po skončení cyklu** (ukončení): Podmínka + konec cyklu dají dohromady to, co chceš dokázat.

Konkrétně: pro BFS je invariant „vzdálenosti v poli `d[]` jsou správné pro všechny vrcholy, které jsem dosud zpracoval." Každý průchod cyklem tuhle záruku rozšíří o jeden vrchol víc.

> **Intuice bez vzorce:** Invariant = věc, která je vždy pravda uvnitř cyklu, bez ohledu na to, kolikátý průchod právě probíhá.

---

## 1. Co Je to Invariant Cyklu a Proč Ho Vyžadují na AG1? `[INSIGHT]`

V běžném programování napíšete kód v C++, pustíte ho na pěti testovacích grafech a pokud dá správné výsledky, prohlásíte ho za funkční.

V předmětech **BI-PA2** a **AG1** na FIT ČVUT tento přístup nestačí:
> Musíte **matematicky dokázat**, že váš algoritmus vrátí **správný výsledek pro KAŽDÝ z nekonečného množství možných vstupních grafů**.

Algoritmy pracují v iterativních cyklech (`while`, `for`). Abychom dokázali, že cyklus po $N$ iteracích vypočítá přesně to, co požadujeme, používáme **Invariant cyklu**:

> **Definice Invariantu Cyklu:** Invariant cyklu je logické tvrzení o stavu proměnných a datových struktur algoritmu, které zůstává **PRAVDIVÉ před zahájením cyklu, po každé iteraci cyklu i okamžitě po jeho skončení**.

---

## 2. Tříkroková Formální Šablona Důkazu Invariantem `[Relevance: 100%]` `[PAST U ZKOUŠKY]`

Při dokazování korektnosti algoritmu v zápočtových testech a u zkoušky z AG1 musíte sepsat tyto 3 fáze:

```
            ┌─────────────────────────────────────────────────────────────┐
            │ 1. INICIALIZACE: Dokážeme, že invariant platí před prvním    │
            │                  průchodem cyklu (Báze v kroku 0).          │
            └──────────────────────────────┬──────────────────────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │   Cyklus WHILE / FOR probíhá  │
                           └───────────────┬───────────────┘
                                           │
                                           ▼
            ┌─────────────────────────────────────────────────────────────┐
            │ 2. UDRŽOVÁNÍ: Dokážeme, že pokud invariant platí před       │
            │               i-tým průchodem, vykonání těla cyklu zachová  │
            │               jeho platnost i po i-tém průchodu.            │
            └──────────────────────────────┬──────────────────────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │     Cyklus ukončen (Condition)│
                           └───────────────┬───────────────┘
                                           │
                                           ▼
            ┌─────────────────────────────────────────────────────────────┐
            │ 3. UKONČENÍ: Invariant po skočení cyklu společně s podmínkou│
            │              ukončení přímo dokazuje Správnost Algoritmu!   │
            └─────────────────────────────────────────────────────────────┘
```

---

## 3. Vzorový Důkaz 1: Algoritmus BFS (Průchod do Šířky) `[Relevance: 100%]` `[MEGA EPIC]`

BFS (Breadth-First Search) hledá nejkratší cesty v **neohodnoceném grafu** $G = (V, E)$ ze zdrojového vrcholu $s$.

### ⚙️ Pseudokód BFS v C++ stylu:
```cpp
void BFS(const Graph& G, int s) {
    std::vector<int> d(n, INF); // Pracovní vzdálenosti
    std::queue<int> Q;          // FIFO fronta

    d[s] = 0;
    Q.push(s);

    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();

        for (int v : G.getNeighbors(u)) {
            if (d[v] == INF) {
                d[v] = d[u] + 1;
                Q.push(v);
            }
        }
    }
}
```

---

### 💡 Vlnoplošná Intuice Šíření BFS `[INSIGHT]`

BFS prohledává graf ve **soustředných vlnách** (kruzích) jako vlnění vodní hladiny:
- **Vlna 0:** Samotný zdrojový uzel $s$ s $d[s] = 0$.
- **Vlna 1:** Všichni přímí sousedé zdroje $s$ s $d = 1$.
- **Vlna 2:** Všichni dosud nenavštívení sousedé vrcholů z Vlny 1 s $d = 2$.
- **Vlna $k+1$:** Noví sousedé vrcholů z Vlny $k$ s $d = k+1$.

---

### ✍️ Formální Důkaz pomocí Invariantu Fronty BFS `[PAST U ZKOUŠKY]`

Definujme **Invariant cyklu BFS:**
> Během celého průběhu cyklu `while (!Q.empty())` splňuje FIFO fronta $Q = \langle v_1, v_2, \dots, v_r \rangle$ tyto dvě vlastnosti:
> 1. **Mírný Rozdíl Vzdáleností:** Vzdálenosti prvků ve frontě se liší nejvýše o 1:
>    $$d[v_r] \le d[v_1] + 1$$
> 2. **Nemonotónní Uspořádání:** Hodnoty vzdáleností prvků ve frontě tvoří nemonotónně rostoucí posloupnost:
>    $$d[v_1] \le d[v_2] \le \dots \le d[v_r]$$

---

#### 1. Inicializace (Před cyklem):
Před prvním vstupem do cyklu `while` obsahuje fronta $Q$ pouze jediný vrchol $s$ s $d[s] = 0$.
- Posloupnost $\langle s \rangle$ je triviálně nemonotónně rostoucí ($0 \le 0$).
- Rozdíl vzdáleností je $d[s] \le d[s] + 1 \implies 0 \le 0 + 1$. Invariant platí.

#### 2. Udržování (Během kroku cyklu):
Předpokládejme, že invariant platí před odebráním prvku z fronty.
- Vyjmeme $u = v_1$ z čela fronty (`Q.pop()`). Zůstane pod-fronta $\langle v_2, \dots, v_r \rangle$. Vyjmutím prvního prvku se nemonotónní růst ani rozsah vzdáleností nemůže narušit.
- Procházíme nenavštívené sousedy $v$ vrcholu $u$ a vkládáme je do fronty s hodnotou $d[v] = d[u] + 1$.
- Jelikož na čele původní fronty byly prvky s hodnotou $d[u]$ nebo $d[u]+1$, nově vkládané prvky na konec fronty mají hodnotu $d[u]+1$.
- Vložení prvku s hodnotou $d[u]+1$ na konec fronty zachová jak nemonotónní růst, tak maximální rozdíl 1 od čela fronty. Invariant drží i po dokončení iterace!

#### 3. Ukončení (Po cyklu):
Cyklus skončí, když je fronta $Q$ **prázdná**.
Protože algoritmus prozkoumal graf vlna po vlně od nejmenší vzdálenosti $d=0$ po $d_{max}$, z vlastnosti invariantu a z trojúhelníkové nerovnosti plyne, že pro každý dosažitelný vrchol $v$ platí přesně $d[v] = \delta(s, v)$ (kde $\delta(s, v)$ je reálná délka nejkratší cesty). BFS je KOREKTNÍ. $\blacksquare$

---

## 4. Vzorový Důkaz 2: Dijkstrův Algoritmus (Nezáporné Váhy Hran) `[Relevance: 100%]` `[MEGA EPIC]`

Dijkstrův algoritmus hledá nejkratší cesty v ohodnoceném grafu $G = (V, E, w)$ s **nezápornými vahami hran** ($w(e) \ge 0$). Udržuje množinu **definitivně vyřízených vrcholů $S$**.

### ⚙️ Pseudokód Dijkstrova Algoritmu v C++:
```cpp
void Dijkstra(const WeightedGraph& G, int s) {
    std::vector<int> d(n, INF);
    std::vector<bool> S(n, false);
    d[s] = 0;

    // Min-prioritní fronta uchovávající dvojice (d[u], u)
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> PQ;
    PQ.push({0, s});

    while (!PQ.empty()) {
        auto [dist, u] = PQ.top();
        PQ.pop();

        if (S[u]) continue;
        S[u] = true; // Přidání u do množiny vyřízených vrcholů S

        for (auto& edge : G.getOutgoingEdges(u)) {
            int v = edge.to;
            int weight = edge.weight;

            if (d[u] + weight < d[v]) {
                d[v] = d[u] + weight; // Relaxace hrany
                PQ.push({d[v], v});
            }
        }
    }
}
```

---

### ✍️ Formální Důkaz pomocí Invariantu Množiny $S$ `[PAST U ZKOUŠKY]`

Definujme **Invariant Dijkstrova Algoritmu:**
> Na začátku každé iterace cyklu `while` platí pro každý vrchol $u \in S$, že jeho pracovní odhad $d[u]$ je roven **přesné délce nejkratší cesty z $s$ v ohodnoceném grafu**:
> $$\forall u \in S : d[u] = \delta(s, u)$$

---

#### 1. Inicializace:
Před prvním průchodem cyklu je množina vyřízených vrcholů prázdná ($S = \emptyset$). Invariant pro prázdnou množinu platí triviálně (vacuous truth).

#### 2. Udržování (Krok cyklu):
Předpokládejme, že invariant platí pro dosavadní množinu $S$.
Algoritmus vybere vrchol $u \notin S$ s **nejmenší pracovní hodnotou $d[u]$** a přidá ho do $S$.

Dokážeme sporem, že pro tento nově přidávaný vrchol $u$ platí $d[u] = \delta(s, u)$:
- **Předpoklad pro spor:** Předpokládejme, že $d[u] > \delta(s, u)$ (existuje ještě kratší cesta $P$ z $s$ do $u$).
- Nechť cesta $P$ opustí množinu vyřízených vrcholů $S$ poprvé hranou z $x \in S$ do $y \notin S$.
- Protože $x \in S$, podle invariantu platí $d[x] = \delta(s, x)$.
- Jelikož váhy všech hran jsou nezáporné ($w(e) \ge 0$), váha cesty z $s$ přes $y$ do $u$ musí splňovat:
  $$\delta(s, u) = \delta(s, x) + w(x, y) + \delta(y, u) = d[y] + \delta(y, u) \ge d[y]$$
- Protože $y \notin S$ a $u$ byl vybrán jako vrchol s **minimálním** $d[u]$ mezi všemi vrcholy mimo $S$, muselo platit $d[u] \le d[y]$.
- Spojením nerovností dostáváme: $d[u] \le d[y] \le \delta(s, u)$, což znamená $d[u] = \delta(s, u)$.
- **💥 SPOR ($\bot$):** Dostali jsme $d[u] = \delta(s, u)$, což je v přímém sporu s předpokladem pro spor $d[u] > \delta(s, u)$!

Tedy i pro nově přidaný vrchol $u$ platí $d[u] = \delta(s, u)$ a invariant zůstává zachován pro $S \cup \{u\}$.

#### 3. Ukončení:
Po skončení cyklu byly zpracovány všechny dosáhlé vrcholy $v \in V$. Pro každý vrchol platí $d[v] = \delta(s, v)$. Dijkstrův algoritmus je KOREKTNÍ. $\blacksquare$

---

### 💥 Proč Záporná Hrana Ničí Dijkstrův Algoritmus? `[INSIGHT]`

Pokud graf obsahuje **zápornou hranu ($w(e) < 0$)**, krok održování v důkazu selže!
Délka cesty přes $y \notin S$ by díky záporné hraně mohla klesnout pod hodnotu $d[u]$ ($\delta(y, u) < 0$).
Dijkstra by předčasně prohlásil $d[u]$ za konečné, ale později by byla objevena ještě kratší cesta s využitím záporné hrany.

```
       (s) ─────── 5 ───────► (u)   ◄─── Dijkstra vybere (u) jako vyřízený s d[u] = 5!
        │                      ▲
        2                      │ -10 (Záporná hrana!)
        ▼                      │
       (y) ────────────────────┘
       Cesta s -> y -> u má váhu 2 + (-10) = -8 < 5!
       Dijkstrův invariant selže!
```

---

## 🧪 Procvičovací Úloha pro Bioinformatiky

### Úloha 4.1: Invariant Nalezení Minima v Poli
Dokážeme invariantem cyklu správnost algoritmu pro nalezení nejmenšího prvku v poli `int arr[n]`:

```cpp
int findMin(int arr[], int n) {
    int minVal = arr[0];
    for (int i = 1; i < n; ++i) {
        if (arr[i] < minVal) {
            minVal = arr[i];
        }
    }
    return minVal;
}
```

<details>
<summary>🔍 Zobrazit vzorový důkaz invariantem</summary>

### ✍️ Řešení 3-krokovým postupem (Úloha 4.1):
Viz pseudokód výše — invariant je $\text{minVal} = \min(a[0], \dots, a[i-1])$ před $i$-tou iterací. Inicializace: $\text{minVal} = a[0]$ pro $i=1$. Udržování: každá iterace porovná $a[i]$ a aktualizuje $\text{minVal}$. Ukončení: po $i=n$ platí $\text{minVal} = \min(a[0], \dots, a[n-1])$. $\blacksquare$

</details>

---

### Úloha 4.2: Důkaz Invariantem pro Obrácení Pole (Array Reversal)

Dokážeme 3 kroky invariantu cyklu správnost algoritmu pro **obrácení prvků v poli** `arr[0 ... n-1]`:

```cpp
void reverseArray(int arr[], int n) {
    int left = 0;
    int right = n - 1;
    while (left < right) {
        std::swap(arr[left], arr[right]);
        left++;
        right--;
    }
}
```

<details>
<summary>🔍 Zobrazit vzorový důkaz invariantem (Řešení)</summary>

### ✍️ Řešení 3-krokovým postupem:

1. **Definice Invariantu Cyklu:**
   Na začátku každé iterace cyklu `while (left < right)` platí:
   - Ukazatelé splňují $right = n - 1 - left$.
   - Krajní úseky pole `arr[0 ... left-1]` a `arr[right+1 ... n-1]` již byly úspěšně zrcadlově prohozeny vzhledem k původnímu stavu $A_{orig}$, zatímco vnitřní úsek `arr[left ... right]` zůstává v původním pořadí $A_{orig}[left ... right]$.

2. **Inicializace (Před cyklem):**
   Před prvním vstupem je $left = 0$ a $right = n - 1$.
   - Krajní úseky `arr[0 ... -1]` a `arr[n ... n-1]` jsou prázdné (triviálně prohozeny).
   - Vnitřní úsek `arr[0 ... n-1]` obsahuje celé původní pole. Invariant před cyklem platí.

3. **Udržování (Během kroku cyklu):**
   Předpokládejme, že invariant platí na začátku iterace pro indexy $left$ a $right$.
   - V těle cyklu prohodíme `std::swap(arr[left], arr[right])`. Tím se prvek z $left$ dostane na pozici $right$ a naopak.
   - Následně provedeme `left++` a `right--`.
   - Rozšířené krajní úseky `arr[0 ... left_new - 1]` a `arr[right_new + 1 ... n-1]` jsou nyní plně zrcadlově prohozeny, zatímco zúžený vnitřní úsek drží zbývající neprohozené prvky. Invariant platí i po dokončení iterace.

4. **Ukončení (Po skončení cyklu):**
   Cyklus skončí, jakmile $left \ge right$.
   - Pokud $n$ bylo sudé, cyklus skončí při $left = right + 1$. Vnitřní neprohozený úsek je prázdný, celé pole `arr[0 ... n-1]` je zrcadlově obráceno.
   - Pokud $n$ bylo liché, cyklus skončí při $left = right$. Prostřední prvek pole se nemusí prohazovat sám se sebou, celé pole je obráceno. Algoritmus je KOREKTNÍ. $\blacksquare$
</details>

---

> ➡️ **Pokračujte na modul bio-konstrukcí:** [5 · Konstruktivní Důkazy & Bio-Algoritmy](./dml-konstruktivni-dukazy)

