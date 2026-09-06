# Modul 0B: Formální Jazyk Grafů & C++ Reprezentace

> **[Relevance: 95%]** · **Tags:** `[INSIGHT]` `[FORMÁLNÍ TEORIE]` `[C++]` `[EPIC]`
> **Cíl modulu:** Přejít od biologické intuice k rigoróznímu matematickému aparátu teorie grafů. Zvládnout množinový základ $G = (V, E)$, binární relace a jejich vlastnosti, pochopit katalog bio-struktur a ovládnout reprezentaci grafů v C++ (matice sousedství vs. seznam sousedů) s přesnými časovými a paměťovými složitostmi pro PA2 a AG1.

---

## 1. Množinový Základ a Jazyk Relací `[Relevance: 90%]` `[EPIC]`

Teorie grafů je celá vystavěna na základech **teorie množin**. Připomeňme si formální konstrukce, ze kterých grafy vznikají:

### 1.1 Množiny a Kartézský Součin

Nechť $V$ je konečná neprázdná množina prvků (kterým budeme říkat **vrcholy** nebo **uzly**).
- Počet prvků množiny $V$ značíme jako $|V|$ nebo $n$.
- **Kartézský součin** $V \times V$ je množina všech uspořádaných dvojic prvků z $V$:
  $$V \times V = \{(u, v) \mid u \in V, v \in V\}$$
  Velikost kartézského součinu je $|V \times V| = n^2$.

- **Množina dvouprvkových podmnožin** $\binom{V}{2}$ je množina všech neuspořádaných dvojic různých prvků z $V$:
  $$\binom{V}{2} = \{\{u, v\} \mid u, v \in V, u \neq v\}$$
  Počet možných neuspořádaných dvojic je dán kombinačním číslem:
  $$\left|\binom{V}{2}\right| = \frac{n(n-1)}{2} = \binom{n}{2}$$

---

### 1.2 Binární Relace na Množinách

**Binární relace $R$** na množině $V$ je libovolná podmnožina kartézského součinu: $R \subseteq V \times V$.
Pokud $(u, v) \in R$, říkáme, že prvek $u$ je v relaci $R$ s prvkem $v$ (zapisujeme $u R v$).

Vlastnosti binárních relací na množině $V$:
1. **Reflexivita:** $\forall x \in V: (x, x) \in R$ *(Každý prvek je v relaci sám se sebou).*
2. **Antireflexivita:** $\forall x \in V: (x, x) \notin R$ *(Žádný prvek není v relaci sám se sebou – graf nemá smyčky).*
3. **Symetrie:** $\forall x, y \in V: ((x, y) \in R \implies (y, x) \in R)$ *(Vazba funguje oboustranně).*
4. **Antisymetrie:** $\forall x, y \in V: ((x, y) \in R \land (y, x) \in R \implies x = y)$ *(Vazba je jednosměrná).*
5. **Tranzitivita:** $\forall x, y, z \in V: ((x, y) \in R \land (y, z) \in R \implies (x, z) \in R)$ *(Pokud A reaguje na B a B na C, pak A přímo ovlivňuje C).*

> [!IMPORTANT]
> **Propojení Relací a Grafů:**
> - **Neorientovaný graf bez smyček** je matematickým vyjádřením **antireflexivní a symetrické binární relace** na množině $V$.
> - **Orientovaný graf bez smyček** je vyjádřením obecné **antireflexivní binární relace** na množině $V$.

---

## 2. Katalog Biologických & Chemických Grafových Struktur `[Relevance: 95%]` `[BIO-ANALOGIE]`

### 2.1 Chemické Grafy Molekul (Molecular Graphs)

V chemoinformatice reprezentujeme chemickou sloučeninu jako neorientovaný graf $G = (V, E)$:
- **Množina vrcholů $V$:** Každý vrchol $v \in V$ představuje atom a nesouvisí s ním pouze jeho ID, ale i **chemický prvek** (např. Uhlík $C$, Vodík $H$, Kyslík $O$).
- **Množina hran $E$:** Každá hrana $e = \lbrace u, v \rbrace \in E$ reprezentuje kovalentní vazbu mezi atomy $u$ a $v$.

#### Chemická valence a stupně vrcholů $\deg(v)$:
V chemii platí přísná pravidla valence atomů:
- Vodík ($H$) tvoří právě 1 vazbu $\implies \deg(H) = 1$ (v grafu je Vodík **listem**!).
- Kyslík ($O$) tvoří 2 vazby $\implies \deg(O) = 2$.
- Dusík ($N$) tvoří 3 vazby $\implies \deg(N) = 3$.
- Uhlík ($C$) tvoří 4 vazby $\implies \deg(C) = 4$.

```
           H
           │
     H ─── C ─── O ─── H      Molekula Ethanolu (C2H5OH)
           │                  Graph: |V| = 9 atomů, |E| = 8 vazeb
     H ─── C ─── H            Stupně: deg(H)=1, deg(O)=2, deg(C)=4
           │
           H
```

> [!NOTE]
> Pro jednoduchost chemoinformatické algoritmy často používají tzv. **Hydrogen-suppressed graphs** (grafy s potlačenými vodíky), kde jsou atomy vodíku odstraněny a jejich počet je uchováván pouze jako atribut u uhlíkových uzlů.

---

### 2.2 Metabolické Reakční Sítě (Metabolomics & DAGs)

Metabolická síť buněčného metabolismu popisuje biochemické přeměny látek katalyzované enzymy:
- **Množina vrcholů $V$:** Chemické metabolity a substráty (glukóza, pyruvát, ATP, NADH, acetyl-CoA).
- **Množina hran $E$:** Orientované hrany $e = (u, v) \in E$, kde hrana vedoucí z $u$ do $v$ znamená, že metabolit $u$ je přeměňován enzymatickou reakcí na produkt $v$.

#### Strukturní typy metabolických drah:
1. **Lineární dráhy (DAG - Orientované Acyklické Grafy):**
   - Příklady: Glykolýza.
   - Neobsahují orientované cykly. Existuje jasný „vstupní substrát" (in-degree = 0) a „výstupní produkt" (out-degree = 0, tzv. slepá ulička / terminal metabolite).
2. **Cyklické dráhy:**
   - Příklady: Citrátový cyklus (Krebsův cyklus), Calvinův cyklus.
   - Obsahují orientovaný cyklus $C = (v_1, v_2, \dots, v_k, v_1)$, kde se klíčový přenašeč (oxaloacetát) regeneruje.

---

### 2.3 Fylogenetické Stromy (Phylogenetic Trees)

Fylogenetika zkoumá evoluční příbuznost druhů nebo genových sekvencí:
- **Zakořeněný fylogenetický strom (Rooted Tree):** Orientovaný strom, kde kořen reprezentuje posledního společného předka (LUCA - Last Universal Common Ancestor), vnitřní uzly reprezentují speciation events (rozštěpení druhů) a **listy ($\deg(v) = 1$)** reprezentují dosud žijící zkoumané druhy (taxony).

---

### 2.4 Ohodnocené Biologické Grafy (Weighted Biological Graphs) `[Relevance: 90%]`

V reálných biologických systémech nestačí pouhá informace, zda hrana existuje či ne ($0/1$). Hrany nesou kvantitativní fyzikální nebo chemickou hodnotu – **váhu hrany $w(e) \in \mathbb{R}$**:

1. **PPI Sítě s Afinitou Vazby ($K_d$ / Confidence Scores):**
   Váha hrany $w(e)$ reprezentuje vazebnou afinitu (disociační konstantu $K_d$) nebo spolehlivost experimentálního důkazu interakce z databáze STRING (score 0 až 1000). Hledání modulů silně vázaných proteinů odpovídá vyhledání **Heavy Subgraphs**.
2. **Metabolické Sítě se Změnou Volné Entalpie ($\Delta G$):**
   Váha orientované hrany $w(e)$ vyjadřuje termodynamickou změnu Gibbsovy volné energie reakce $\Delta G^\circ$. Záporná váha $\Delta G < 0$ značí exergonickou samovolnou reakci, zatímco kladná $\Delta G > 0$ vyžaduje spřažení s hydrolýzou ATP.
3. **Genomické Sekvenování a Váhy Překryvů (Overlap Graphs):**
   Váha hrany $w(u, v)$ reprezentuje délku shodného nukleotidového přesahu mezi dvěma dlouhými přečteními (reads z Oxford Nanopore). Hledání nejdelšího genomu odpovídá **Problému nejdelší cesty v ohodnoceném grafu**.

---

### 2.5 Bipartitní Biologické Sítě (Bipartite Biological Networks) `[Relevance: 95%]` `[BIO-ANALOGIE]`

V řadě bioinformatických aplikací jsou vrcholy přirozeně rozděleny do **dvou disjunktních množin $V = V_1 \cup V_2$**, přičemž hrany existují výhradně mezi prvkem z $V_1$ a prvkem z $V_2$:

```
      Množina V1 (Enzymy)                Množina V2 (Substráty)
     ┌──────────────────┐               ┌──────────────────┐
     │  [Hexokináza] ───┼───────────────┼───► [Glukóza]    │
     │                  │               │                  │
     │  [Pyruvátkináza]─┼───────────────┼───► [PEP]        │
     └──────────────────┘               └──────────────────┘
```

1. **Enzymaticko-Substrátové Sítě:** $V_1$ = Enzymy, $V_2$ = Substráty/Metabolity. Hrana vede z enzymu k substrátu, který tento enzym katalyzuje.
2. **Sítě Léčivo-Terč (Drug-Target Networks):** $V_1$ = Schválená léčiva (Small molecules), $V_2$ = Bílkovinné receptory. Bipartitní párování (Bipartite Matching) pomáhá při **Drug Repurposing** (hledání nových indikací pro stávající léky).
3. **Gen-Choroba Sítě (Gene-Disease Networks):** $V_1$ = Mutované geny, $V_2$ = Klinické diagnózy/fenotypy.

---

## 3. Počítačová Reprezentace Grafů v C++ (PA2 $\to$ AG1) `[Relevance: 90%]` `[EPIC]`

V předmětech **PA2** a **AG1** budete grafové algoritmy zapisovat v jazyce C++. Způsob, jakým graf uložíte do paměti, rozhodne o tom, zda váš program proběhne za 0.01 sekundy, nebo vyprší časový limit (Time Limit Exceeded).

<div class="my-6 p-4 rounded-xl bg-stone-100/80 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wide">📊 Vizuální srovnání: Reprezentace neorientovaného a orientovaného grafu v paměti</span>
  </div>
  <img src="/images/graph-representation-showcase.png" alt="Ukázka reprezentace neorientovaného a orientovaného grafu: Seznam sousedů (Adjacency List) vs. Matice sousedství (Adjacency Matrix)" class="rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 max-w-full h-auto mx-auto bg-white p-2" />
  <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">
    Vlevo: <strong>Neorientovaný vs. Orientovaný graf</strong> · Uprostřed: <strong>Seznam sousedů (Adjacency List)</strong> · Vpravo: <strong>Matice sousedství (Adjacency Matrix)</strong>
  </p>
</div>

<div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
<div class="p-5 rounded-2xl bg-stone-100/90 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-3">
<h3 class="text-base font-bold text-stone-900 dark:text-stone-100 m-0! flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-[#db2777] inline-block"></span>
DFS
</h3>
<span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#db2777]/10 text-[#db2777] dark:text-[#f472b6]">Hloubkové prohledávání</span>
</div>
<div class="bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex items-center justify-center shadow-2xs">
<svg viewBox="0 0 360 200" class="w-full max-w-[320px] h-auto" xmlns="http://www.w3.org/2000/svg">
<line x1="68" y1="75" x2="135" y2="75" stroke="#cbd5e1" class="stroke-stone-300 dark:stroke-stone-700" stroke-width="2.5" stroke-dasharray="5 5" stroke-linecap="round" />
<line x1="68" y1="75" x2="68" y2="155" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="68" y1="155" x2="135" y2="155" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="135" y1="155" x2="205" y2="155" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="205" y1="155" x2="205" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="205" y1="75" x2="135" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="205" y1="75" x2="275" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="275" y1="75" x2="280" y2="25" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="275" y1="75" x2="275" y2="130" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<circle cx="68" cy="155" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="135" cy="155" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="205" cy="155" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="205" cy="75" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="135" cy="75" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="275" cy="75" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="280" cy="25" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="68" cy="75" r="11" fill="#db2777" />
<text x="24" y="87" fill="#db2777" font-size="34" font-weight="900" font-family="'Outfit', system-ui, sans-serif">S</text>
<circle cx="275" cy="130" r="11" fill="#db2777" />
<text x="302" y="142" fill="#db2777" font-size="34" font-weight="900" font-family="'Outfit', system-ui, sans-serif">C</text>
</svg>
</div>
</div>
<p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed">
<strong>Prohledávání do hloubky (DFS):</strong> Algoritmus se slepě vnoří podél první větve. Obejde celý spodní cyklus, uzel nahoře navštíví jako slepou uličku a k cíli <strong>C</strong> dorazí dlouhou oklikou (6 hran). <em>Nezaručuje nejkratší cestu!</em>
</p>
</div>
<div class="p-5 rounded-2xl bg-stone-100/90 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-3">
<h3 class="text-base font-bold text-stone-900 dark:text-stone-100 m-0! flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
BFS
</h3>
<span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">Šířkové prohledávání</span>
</div>
<div class="bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex items-center justify-center shadow-2xs">
<svg viewBox="0 0 360 200" class="w-full max-w-[320px] h-auto" xmlns="http://www.w3.org/2000/svg">
<line x1="68" y1="75" x2="135" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="135" y1="75" x2="205" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="205" y1="75" x2="275" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="275" y1="75" x2="275" y2="130" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="275" y1="75" x2="280" y2="25" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="68" y1="75" x2="68" y2="155" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="68" y1="155" x2="135" y2="155" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="135" y1="155" x2="205" y2="155" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<line x1="205" y1="155" x2="205" y2="75" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="5" stroke-linecap="round" />
<circle cx="68" cy="155" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="135" cy="155" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="205" cy="155" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="205" cy="75" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="135" cy="75" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="275" cy="75" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="280" cy="25" r="7" fill="#334155" class="fill-stone-700 dark:fill-stone-300" />
<circle cx="68" cy="75" r="11" fill="#db2777" />
<text x="24" y="87" fill="#db2777" font-size="34" font-weight="900" font-family="'Outfit', system-ui, sans-serif">S</text>
<circle cx="275" cy="130" r="11" fill="#db2777" />
<text x="302" y="142" fill="#db2777" font-size="34" font-weight="900" font-family="'Outfit', system-ui, sans-serif">C</text>
</svg>
</div>
</div>
<p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed">
<strong>Prohledávání do šířky (BFS):</strong> Postupuje po vlnoplochách (vrstvách vzdálenosti od <strong>S</strong>). K cíli <strong>C</strong> okamžitě nalezne <strong>nejkratší cestu</strong> po horní větvi (pouhé 4 hrany).
</p>
</div>
</div>

Uvažujme graf $G = (V, E)$ o $n = |V|$ vrcholech a $m = |E|$ hranách. Vrcholy očíslujeme od $0$ do $n - 1$.

---

### 3.1 Matice Sousedství (Adjacency Matrix)

Graf reprezentujeme dvoudimenzionálním polem (maticí) $A$ typu $n \times n$:

$$A[i][j] = \begin{cases} 1 & \text{pokud } \lbrace v_i, v_j \rbrace \in E \text{ (nebo } (v_i, v_j) \in E \text{)}, \\ 0 & \text{pokud hrana neexistuje.} \end{cases}$$

#### Zápis v C++:
```cpp
#include <vector>

class GraphMatrix {
private:
    int n;
    std::vector<std::vector<bool>> adjMatrix;

public:
    GraphMatrix(int vertices) : n(vertices), adjMatrix(vertices, std::vector<bool>(vertices, false)) {}

    void addEdge(int u, int v) {
        adjMatrix[u][v] = true;
        adjMatrix[v][u] = true; // Pro neorientovaný graf
    }

    bool hasEdge(int u, int v) const {
        return adjMatrix[u][v];
    }
};
```

#### Vlastnosti Matice Sousedství:
- **Paměťová složitost:** $\Theta(n^2)$ bez ohledu na počet hran $m$.
- **Test existence hrany $\lbrace u, v \rbrace$:** $O(1)$ (Okamžitý přístup do pole).
- **Procházení všech sousedů vrcholu $u$:** $\Theta(n)$ (Musíme projít celý řádek matice).

---

### 3.2 Seznam Sousedů (Adjacency List)

Pro každý vrchol $u \in V$ uchováváme seznam (dynamické pole `std::vector`) všech vrcholů $v$, které jsou s $u$ spojeny hranou.

#### Vlastnosti Seznamu Sousedů:
- **Paměťová složitost:** $\Theta(n + m)$ pro neorientovaný i orientovaný graf.
- **Test existence hrany $\lbrace u, v \rbrace$:** $O(\deg(u))$ (Musíme prohledat sousedy vrcholu $u$).
- **Procházení všech sousedů vrcholu $u$:** $\Theta(\deg(u))$ (Projdeme pouze skutečné sousedy!).

---

## 4. Formální Grafová Terminologie & Definice `[Relevance: 95%]` `[EPIC]`

Shrňme si přesné matematické definice všech pojmů, které budeme v dalších modulech rigorózně dokazovat:

### 4.1 Stupně Vrcholů a Incidence
- Vrchol $u$ a hrana $e$ jsou **incidentní**, pokud $u \in e$.
- Dva vrcholy $u, v$ jsou **sousední (adjacentní)**, pokud $\{u, v\} \in E$.
- **Stupeň vrcholu $\deg_G(v)$** v neorientovaném grafu $G$ je počet hran incidentních s $v$:
  $$\deg_G(v) = |\{e \in E \mid v \in e\}|$$
---

Nechť $G = (V, E)$ je neorientovaný graf.
1. **Sled (Walk):** Střídavá posloupnost vrcholů a hran $(v_0, e_1, v_1, e_2, v_2, \dots, e_k, v_k)$, kde $e_i = \{v_{i-1}, v_i\}$. *(Vrcholy i hrany se mohou opakovat).*
2. **Cesta (Path):** Sled, ve kterém se **neopakuje žádný vrchol** (a tedy ani hrana). Délka cesty je počet jejích hran $k$.  
3. **Cyklus (Cycle):** Uzavřený sled $(v_0, e_1, v_1, \dots, e_k, v_0)$ délky $k \ge 3$, kde $v_0, v_1, \dots, v_{k-1}$ jsou navzájem různé vrcholy.

---

## 🧪 Rozsáhlé Procvičovací Úlohy pro Bioinformatiky

### Úloha 0.1: Analýza Proteinové Interakční Sítě (PPI)
Mějme proteinovou síť popsanou neorientovaným grafem $G = (V, E)$ s $|V| = 6$ proteiny $\lbrace P_1, P_2, P_3, P_4, P_5, P_6 \rbrace$ a množinou interakcí:
$$E = \lbrace \lbrace P_1, P_2 \rbrace, \lbrace P_1, P_3 \rbrace, \lbrace P_2, P_3 \rbrace, \lbrace P_3, P_4 \rbrace, \lbrace P_4, P_5 \rbrace, \lbrace P_4, P_6 \rbrace \rbrace$$

1. Určete stupně všech vrcholů $\deg(P_i)$.
2. Identifikujte proteiny s nejvyšším stupněm (Huby) a listy.
3. Vypište matici sousedství $A$ tohoto grafu.
4. Ověřte Handshaking Lemma $\sum \deg(v) = 2|E|$.

<details>
<summary>🔍 Zobrazit detailní řešení Úlohy 0.1</summary>

### ✍️ Řešení:

1. **Stupně vrcholů:**
   - $P_1$: Sousedí s $P_2, P_3 \implies \deg(P_1) = 2$.
   - $P_2$: Sousedí s $P_1, P_3 \implies \deg(P_2) = 2$.
   - $P_3$: Sousedí s $P_1, P_2, P_4 \implies \deg(P_3) = 3$.
   - $P_4$: Sousedí s $P_3, P_5, P_6 \implies \deg(P_4) = 3$.
   - $P_5$: Sousedí pouze s $P_4 \implies \deg(P_5) = 1$ (List).
   - $P_6$: Sousedí pouze s $P_4 \implies \deg(P_6) = 1$ (List).

2. **Huby a Listy:**
   - Proteiny $P_3$ a $P_4$ mají nejvyšší stupeň ($\deg = 3$), představují **lokální huby** sítě.
   - Proteiny $P_5$ a $P_6$ jsou **listy** ($\deg = 1$).

3. **Matice Sousedství $A$ (velikost $6 \times 6$):**
   $$A = \begin{pmatrix}
   0 & 1 & 1 & 0 & 0 & 0 \\
   1 & 0 & 1 & 0 & 0 & 0 \\
   1 & 1 & 0 & 1 & 0 & 0 \\
   0 & 0 & 1 & 0 & 1 & 1 \\
   0 & 0 & 0 & 1 & 0 & 0 \\
   0 & 0 & 0 & 1 & 0 & 0
   \end{pmatrix}$$

4. **Ověření Handshaking Lemmatu:**
   - Počet hran $|E| = 6$. Tedy $2|E| = 2 \times 6 = 12$.
   - Součet stupňů: $\sum_{i=1}^6 \deg(P_i) = 2 + 2 + 3 + 3 + 1 + 1 = 12$.
   - Platí $12 = 12$. Handshaking lemma je bezchybně ověřeno!
</details>

---

### Úloha 0.2: Konverze Reprezentací v C++
Napište funkci v C++ `std::vector<std::vector<int>> matrixToList(const std::vector<std::vector<bool>>& matrix)`, která převede graf uložený v matici sousedství na seznam sousedů. Určete časovou a prostorovou složitost této konverze.

<details>
<summary>🔍 Zobrazit kód v C++ a rozbor složitosti</summary>

### ✍️ Implementace v C++:

```cpp
#include <vector>

std::vector<std::vector<int>> matrixToList(const std::vector<std::vector<bool>>& matrix) {
    int n = matrix.size();
    std::vector<std::vector<int>> adjList(n);

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (matrix[i][j]) {
                adjList[i].push_back(j);
            }
        }
    }

    return adjList;
}
```

### 📊 Rozbor Složitosti:
- **Časová složitost:** Musíme projít všechny buňky matice $n \times n$. Procházení trvá $\Theta(n^2)$. Vkládání do `std::vector` pomocí `push_back` má amortizovanou složitost $\mathcal{O}(1)$. Celková časová složitost je tedy **$\Theta(n^2)$**.
- **Prostorová složitost (Paměť):** Výstupní seznam sousedů alokuje paměť pro $n$ vektorů a celkem $2m$ prvků (pro neorientovaný graf). Paměťová složitost výstupu je tedy **$\Theta(n + m)$**.
</details>

---

<div class="my-8 p-4 rounded-xl bg-stone-100 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
  <a href="./dml-bio-grafy" class="text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-[#f95d12] dark:hover:text-[#f95d12] flex items-center gap-1.5 transition-colors">
    ⬅️ Předchozí část: Modul 0A (Bio-Intuice & Co je Graf)
  </a>
  <a href="./dml-logicky-zaklad" class="text-sm font-semibold text-[#f95d12] hover:text-[#c2410c] flex items-center gap-1.5 transition-colors">
    Pokračujte na Modul 1: Logický základ ➡️
  </a>
</div>
