# Modul 4a: Grafy v C++ & Reprezentace v Paměti

> **Cíl modulu:** Zvládnout reprezentaci grafů v C++ (matice sousedství vs. seznam sousedů) s přesnými časovými a paměťovými složitostmi pro PA2 a AG1, porozumět rozdílu v průchodu grafem (DFS vs. BFS) a zopakovat základní pojmy (sled, cesta, cyklus, stupeň vrcholu).

---

## 1. Počítačová Reprezentace Grafů v C++ (PA2 $\to$ AG1)

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

Uvažujme graf $G = (V, E)$ o $n = |V|$ vrcholech a $m = |E|$ hranách. Vrcholy očíslujeme od $0$ do $n - 1$.

---

### 1.1 Matice Sousedství (Adjacency Matrix)

Graf reprezentujeme dvoudimenzionálním polem (maticí) $A$ typu $n \times n$:

$$A[i][j] = \begin{cases} 1 & \text{pokud } \lbrace v_i, v_j \rbrace \in E \text{ (nebo } (v_i, v_j) \in E \text{)}, \\ 0 & \text{pokud hrana neexistuje.} \end{cases}$$

#### Vlastnosti Matice Sousedství:
- **Paměťová složitost:** $\Theta(n^2)$ bez ohledu na počet hran $m$.
- **Test existence hrany $\lbrace u, v \rbrace$:** $O(1)$ (Okamžitý přístup do pole).
- **Procházení všech sousedů vrcholu $u$:** $\Theta(n)$ (Musíme projít celý řádek matice).

---

### 1.2 Seznam Sousedů (Adjacency List)

Pro každý vrchol $u \in V$ uchováváme seznam (dynamické pole `std::vector`) všech vrcholů $v$, které jsou s $u$ spojeny hranou.

#### Vlastnosti Seznamu Sousedů:
- **Paměťová složitost:** $\Theta(n + m)$ pro neorientovaný i orientovaný graf.
- **Test existence hrany $\lbrace u, v \rbrace$:** $O(\deg(u))$ (Musíme prohledat sousedy vrcholu $u$).
- **Procházení všech sousedů vrcholu $u$:** $\Theta(\deg(u))$ (Projdeme pouze skutečné sousedy!).

---

## 2. Dva Přístupy k Prohledávání: DFS vs. BFS

Při procházení grafu v C++ (např. při hledání cesty mezi startovním vrcholem **S** a cílem **C**) volíme mezi dvěma základními strategiemi:

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

---

## 3. Minimum z Grafových Pojmů

Nechť $G = (V, E)$ je neorientovaný graf bez smyček a násobných hran:

- **Incidence:** Vrchol $u$ a hrana $e$ jsou incidentní, pokud $u \in e$.
- **Adjacence (sousedství):** Dva vrcholy $u, v$ jsou sousední, pokud $\{u, v\} \in E$.
- **Stupeň vrcholu $\deg(v)$:** Počet hran incidentních s vrcholem $v$.
- **Handshaking Lemma:** $\sum_{v \in V} \deg(v) = 2|E|$ (součet všech stupňů je vždy dvojnásobek počtu hran).
- **Sled (Walk):** Střídavá posloupnost vrcholů a hran $(v_0, e_1, v_1, e_2, \dots, e_k, v_k)$, kde se vrcholy i hrany mohou opakovat.
- **Cesta (Path):** Sled, ve kterém se **neopakuje žádný vrchol** (a tedy ani hrana).
- **Cyklus (Cycle):** Uzavřený sled $(v_0, e_1, v_1, \dots, e_k, v_0)$ délky $k \ge 3$, kde jsou všechny vnitřní vrcholy navzájem různé.

---

## 4. Úloha 4a.1: Analýza Proteinové Interakční Sítě (PPI)

Mějme proteinovou síť popsanou neorientovaným grafem $G = (V, E)$ s $|V| = 6$ proteiny $\lbrace P_1, P_2, P_3, P_4, P_5, P_6 \rbrace$ a množinou interakcí:
$$E = \lbrace \lbrace P_1, P_2 \rbrace, \lbrace P_1, P_3 \rbrace, \lbrace P_2, P_3 \rbrace, \lbrace P_3, P_4 \rbrace, \lbrace P_4, P_5 \rbrace, \lbrace P_4, P_6 \rbrace \rbrace$$

1. Určete stupně všech vrcholů $\deg(P_i)$.
2. Identifikujte proteiny s nejvyšším stupněm (Huby) a listy ($\deg(v) = 1$).
3. Vypište matici sousedství $A$ tohoto grafu.
4. Ověřte Handshaking Lemma $\sum \deg(v) = 2|E|$.

<details>
<summary>🔍 Zobrazit detailní řešení Úlohy 4a.1</summary>

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
