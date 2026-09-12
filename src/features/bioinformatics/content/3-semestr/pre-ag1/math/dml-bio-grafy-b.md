# Grafy v C++ & Reprezentace v Paměti

## 0. Minimum z Grafových Pojmů

Nechť $G = (V, E)$ je neorientovaný graf bez smyček a násobných hran:

- **Incidence:** Vrchol $u$ a hrana $e$ jsou incidentní, pokud $u \in e$.
- **Adjacence (sousedství):** Dva vrcholy $u, v$ jsou sousední, pokud $\{u, v\} \in E$.
- **Stupeň vrcholu $\deg(v)$:** Počet hran incidentních s vrcholem $v$.
- **Handshaking Lemma:** $\sum_{v \in V} \deg(v) = 2|E|$ (součet všech stupňů je vždy dvojnásobek počtu hran).
- **Sled (Walk):** Střídavá posloupnost vrcholů a hran $(v_0, e_1, v_1, e_2, \dots, e_k, v_k)$, kde se vrcholy i hrany mohou opakovat.
- **Cesta (Path):** Sled, ve kterém se **neopakuje žádný vrchol** (a tedy ani hrana).
- **Cyklus (Cycle):** Uzavřený sled $(v_0, e_1, v_1, \dots, e_k, v_0)$ délky $k \ge 3$, kde jsou všechny vnitřní vrcholy navzájem různé.

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

<div class="my-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140d09] border border-stone-200/80 dark:border-stone-800">
    <div class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Paměťová složitost</div>
    <div class="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5">$\Theta(n^2)$</div>
    <div class="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">bez ohledu na počet hran $m$</div>
  </div>
  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140d09] border border-stone-200/80 dark:border-stone-800">
    <div class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Test existence hrany $\lbrace u, v \rbrace$</div>
    <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">$O(1)$</div>
    <div class="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">okamžitý přístup do pole</div>
  </div>
  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140d09] border border-stone-200/80 dark:border-stone-800">
    <div class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Průchod sousedů vrcholu $u$</div>
    <div class="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5">$\Theta(n)$</div>
    <div class="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">projití celého řádku matice</div>
  </div>
</div>

---

### 1.2 Seznam Sousedů (Adjacency List)

Pro každý vrchol $u \in V$ uchováváme seznam (dynamické pole `std::vector`) všech vrcholů $v$, které jsou s $u$ spojeny hranou.

<div class="my-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140d09] border border-stone-200/80 dark:border-stone-800">
    <div class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Paměťová složitost</div>
    <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">$\Theta(n + m)$</div>
    <div class="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">optimální pro řídké grafy</div>
  </div>
  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140d09] border border-stone-200/80 dark:border-stone-800">
    <div class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Test existence hrany $\lbrace u, v \rbrace$</div>
    <div class="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5">$O(\deg(u))$</div>
    <div class="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">prohledání sousedů vrcholu $u$</div>
  </div>
  <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140d09] border border-stone-200/80 dark:border-stone-800">
    <div class="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Průchod sousedů vrcholu $u$</div>
    <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">$\Theta(\deg(u))$</div>
    <div class="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">průchod pouze reálných sousedů</div>
  </div>
</div>

---

## 2. Dva Přístupy k Prohledávání: DFS vs. BFS

Při procházení grafu v C++ (např. při hledání cesty mezi startovním vrcholem **S** ($v_0$) a cílem **C** ($v_8$)) volíme mezi dvěma základními strategiemi:

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
<svg viewBox="0 0 370 215" class="w-full max-w-[340px] h-auto" xmlns="http://www.w3.org/2000/svg">
<!-- Hrany grafu -->
<line x1="68" y1="80" x2="135" y2="80" stroke="#cbd5e1" class="stroke-stone-300 dark:stroke-stone-700" stroke-width="2.5" stroke-dasharray="5 5" stroke-linecap="round" />
<line x1="68" y1="80" x2="68" y2="160" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="68" y1="160" x2="135" y2="160" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="135" y1="160" x2="205" y2="160" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="205" y1="160" x2="205" y2="80" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="205" y1="80" x2="135" y2="80" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="205" y1="80" x2="275" y2="80" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="275" y1="80" x2="280" y2="28" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />
<line x1="275" y1="80" x2="275" y2="145" stroke="#1e293b" class="stroke-stone-800 dark:stroke-stone-200" stroke-width="4.5" stroke-linecap="round" />

<!-- Návěští hran e₁ až e₉ -->
<rect x="42" y="111" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="53" y="123" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>

<rect x="90" y="166" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="101" y="178" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>

<rect x="159" y="166" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="170" y="178" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>

<rect x="210" y="111" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="221" y="123" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₄</text>

<rect x="90" y="59" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="101" y="71" fill="#64748b" class="fill-stone-500 dark:fill-stone-400" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₅</text>

<rect x="159" y="59" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="170" y="71" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₆</text>

<rect x="229" y="59" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="240" y="71" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₇</text>

<rect x="288" y="46" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="299" y="58" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₈</text>

<rect x="283" y="104" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="294" y="116" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₉</text>

<!-- Vrcholy v₁ až v₇ -->
<circle cx="68" cy="160" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="68" y="164" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₁</text>

<circle cx="135" cy="160" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="135" y="164" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₂</text>

<circle cx="205" cy="160" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="205" y="164" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₃</text>

<circle cx="205" cy="80" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="205" y="84" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₄</text>

<circle cx="135" cy="80" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="135" y="84" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₅</text>

<circle cx="275" cy="80" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="275" y="84" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₆</text>

<circle cx="280" cy="28" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="280" y="32" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₇</text>

<!-- Start v₀ (S) -->
<circle cx="68" cy="80" r="15" fill="#db2777" />
<text x="68" y="84.5" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">v₀</text>
<text x="32" y="89" fill="#db2777" font-size="26" font-weight="900" font-family="'Outfit', system-ui, sans-serif">S</text>

<!-- Cíl v₈ (C) -->
<circle cx="275" cy="145" r="15" fill="#db2777" />
<text x="275" y="149.5" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">v₈</text>
<text x="300" y="154" fill="#db2777" font-size="26" font-weight="900" font-family="'Outfit', system-ui, sans-serif">C</text>
</svg>
</div>
</div>
<p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed">
<strong>Prohledávání do hloubky (DFS):</strong> Vnoří se podél větve: <strong>v₀ ─(e₁)→ v₁ ─(e₂)→ v₂ ─(e₃)→ v₃ ─(e₄)→ v₄ ─(e₇)→ v₆ ─(e₈)→ v₇</strong> (slepá ulička), vrátí se a přes <strong>e₉</strong> dorazí k cíli <strong>v₈ (C)</strong> oklikou (6 hran: e₁, e₂, e₃, e₄, e₇, e₉). <em>Nezaručuje nejkratší cestu!</em>
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
<svg viewBox="0 0 370 215" class="w-full max-w-[340px] h-auto" xmlns="http://www.w3.org/2000/svg">
<!-- Hrany grafu -->
<line x1="68" y1="80" x2="135" y2="80" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" />
<line x1="135" y1="80" x2="205" y2="80" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" />
<line x1="205" y1="80" x2="275" y2="80" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" />
<line x1="275" y1="80" x2="275" y2="145" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" />
<line x1="275" y1="80" x2="280" y2="28" stroke="#cbd5e1" class="stroke-stone-400 dark:stroke-stone-600" stroke-width="3" stroke-linecap="round" />
<line x1="68" y1="80" x2="68" y2="160" stroke="#cbd5e1" class="stroke-stone-400 dark:stroke-stone-600" stroke-width="3" stroke-linecap="round" />
<line x1="68" y1="160" x2="135" y2="160" stroke="#cbd5e1" class="stroke-stone-400 dark:stroke-stone-600" stroke-width="3" stroke-linecap="round" />
<line x1="135" y1="160" x2="205" y2="160" stroke="#cbd5e1" class="stroke-stone-400 dark:stroke-stone-600" stroke-width="3" stroke-linecap="round" />
<line x1="205" y1="160" x2="205" y2="80" stroke="#cbd5e1" class="stroke-stone-400 dark:stroke-stone-600" stroke-width="3" stroke-linecap="round" />

<!-- Návěští hran e₁ až e₉ -->
<rect x="42" y="111" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="53" y="123" fill="#64748b" class="fill-stone-500 dark:fill-stone-400" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>

<rect x="90" y="166" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="101" y="178" fill="#64748b" class="fill-stone-500 dark:fill-stone-400" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>

<rect x="159" y="166" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="170" y="178" fill="#64748b" class="fill-stone-500 dark:fill-stone-400" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>

<rect x="210" y="111" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="221" y="123" fill="#64748b" class="fill-stone-500 dark:fill-stone-400" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₄</text>

<rect x="90" y="59" width="22" height="16" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b]/50 dark:stroke-emerald-500" />
<text x="101" y="71" fill="#047857" class="dark:fill-emerald-300" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₅</text>

<rect x="159" y="59" width="22" height="16" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b]/50 dark:stroke-emerald-500" />
<text x="170" y="71" fill="#047857" class="dark:fill-emerald-300" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₆</text>

<rect x="229" y="59" width="22" height="16" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b]/50 dark:stroke-emerald-500" />
<text x="240" y="71" fill="#047857" class="dark:fill-emerald-300" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₇</text>

<rect x="288" y="46" width="22" height="16" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="299" y="58" fill="#64748b" class="fill-stone-500 dark:fill-stone-400" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₈</text>

<rect x="283" y="104" width="22" height="16" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b]/50 dark:stroke-emerald-500" />
<text x="294" y="116" fill="#047857" class="dark:fill-emerald-300" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₉</text>

<!-- Vrcholy v₁ až v₇ -->
<circle cx="68" cy="160" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="68" y="164" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₁</text>

<circle cx="135" cy="160" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="135" y="164" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₂</text>

<circle cx="205" cy="160" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="205" y="164" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₃</text>

<circle cx="205" cy="80" r="13.5" fill="#10b981" />
<text x="205" y="84" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₄</text>

<circle cx="135" cy="80" r="13.5" fill="#10b981" />
<text x="135" y="84" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₅</text>

<circle cx="275" cy="80" r="13.5" fill="#10b981" />
<text x="275" y="84" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₆</text>

<circle cx="280" cy="28" r="13.5" fill="#334155" class="fill-stone-700 dark:fill-stone-400" />
<text x="280" y="32" fill="#ffffff" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₇</text>

<!-- Start v₀ (S) -->
<circle cx="68" cy="80" r="15" fill="#10b981" />
<text x="68" y="84.5" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">v₀</text>
<text x="32" y="89" fill="#10b981" font-size="26" font-weight="900" font-family="'Outfit', system-ui, sans-serif">S</text>

<!-- Cíl v₈ (C) -->
<circle cx="275" cy="145" r="15" fill="#10b981" />
<text x="275" y="149.5" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">v₈</text>
<text x="300" y="154" fill="#10b981" font-size="26" font-weight="900" font-family="'Outfit', system-ui, sans-serif">C</text>
</svg>
</div>
</div>
<p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed">
<strong>Prohledávání do šířky (BFS):</strong> Postupuje po vlnoplochách: <strong>v₀ ─(e₅)→ v₅ ─(e₆)→ v₄ ─(e₇)→ v₆ ─(e₉)→ v₈ (C)</strong>. Okamžitě nalezne <strong>nejkratší cestu</strong> po horní větvi (pouhé 4 hrany: e₅, e₆, e₇, e₉).
</p>
</div>
</div>

---

## 3. Úloha: Analýza Proteinové Interakční Sítě (PPI)

Mějme proteinovou síť popsanou neorientovaným grafem $G = (V, E)$ s $|V| = 6$ proteiny $\lbrace P_1, P_2, P_3, P_4, P_5, P_6 \rbrace$ a množinou interakcí:
$$E = \lbrace \lbrace P_1, P_2 \rbrace, \lbrace P_1, P_3 \rbrace, \lbrace P_2, P_3 \rbrace, \lbrace P_3, P_4 \rbrace, \lbrace P_4, P_5 \rbrace, \lbrace P_4, P_6 \rbrace \rbrace$$

<details class="print:hidden my-4 group rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-[#140d09] p-3 shadow-2xs">
  <summary class="cursor-pointer font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2 select-none">
    <span>📊 Zobrazit grafové schéma PPI sítě</span>
    <span class="text-[10px] text-stone-400 font-normal">(klikněte pro rozbalení · skryto v tisku)</span>
  </summary>
  <div class="mt-3 bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col items-center justify-center shadow-2xs">
<svg viewBox="0 0 460 170" class="w-full max-w-[420px] h-auto" xmlns="http://www.w3.org/2000/svg">
  <!-- Hrany -->
  <line x1="70" y1="45" x2="70" y2="125" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" />
  <line x1="70" y1="45" x2="160" y2="85" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" />
  <line x1="70" y1="125" x2="160" y2="85" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" />
  <line x1="160" y1="85" x2="260" y2="85" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
  <line x1="260" y1="85" x2="350" y2="45" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
  <line x1="260" y1="85" x2="350" y2="125" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />

  <!-- Návěští hran (e₁ .. e₆) -->
  <rect x="42" y="78" width="18" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
  <text x="51" y="89" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>

  <rect x="105" y="54" width="18" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
  <text x="114" y="65" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>

  <rect x="105" y="112" width="18" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
  <text x="114" y="123" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>

  <rect x="201" y="68" width="18" height="14" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.2" class="dark:fill-[#291e0a] dark:stroke-amber-600" />
  <text x="210" y="79" fill="#b45309" class="dark:fill-amber-300" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₄</text>

  <rect x="295" y="54" width="18" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
  <text x="304" y="65" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₅</text>

  <rect x="295" y="112" width="18" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
  <text x="304" y="123" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₆</text>

  <!-- Vrcholy (P₁ .. P₆) -->
  <circle cx="70" cy="45" r="14" fill="#0284c7" />
  <text x="70" y="50" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">P₁</text>

  <circle cx="70" cy="125" r="14" fill="#0284c7" />
  <text x="70" y="130" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">P₂</text>

  <circle cx="160" cy="85" r="16" fill="#f97316" />
  <text x="160" y="90" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">P₃</text>

  <circle cx="260" cy="85" r="16" fill="#f97316" />
  <text x="260" y="90" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">P₄</text>

  <circle cx="350" cy="45" r="14" fill="#10b981" />
  <text x="350" y="50" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">P₅</text>

  <circle cx="350" cy="125" r="14" fill="#10b981" />
  <text x="350" y="130" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">P₆</text>
</svg>
<span class="text-[11px] text-stone-500 dark:text-stone-400 mt-2 text-center">
  Vrcholy: <strong>V = {P₁, P₂, P₃, P₄, P₅, P₆}</strong> · Hrany: <strong>E = {e₁, e₂, e₃, e₄, e₅, e₆}</strong> · Huby (oranžově): <strong>P₃, P₄</strong> · Listy (zeleně): <strong>P₅, P₆</strong>
</span>
  </div>
</details>

1. Určete stupně všech vrcholů $\deg(P_i)$.
2. Identifikujte proteiny s nejvyšším stupněm (Huby) a listy ($\deg(v) = 1$).
3. Vypište matici sousedství $A$ tohoto grafu.
4. Ověřte Handshaking Lemma $\sum \deg(v) = 2|E|$.

<details>
<summary>🔍 Zobrazit detailní řešení Úlohy PPI</summary>

### ✍️ Řešení:

1. **Stupně vrcholů:**
   - $P_1$: Sousedí přes hrany $e_1, e_2$ s $P_2, P_3 \implies \deg(P_1) = 2$.
   - $P_2$: Sousedí přes hrany $e_1, e_3$ s $P_1, P_3 \implies \deg(P_2) = 2$.
   - $P_3$: Sousedí přes hrany $e_2, e_3, e_4$ s $P_1, P_2, P_4 \implies \deg(P_3) = 3$.
   - $P_4$: Sousedí přes hrany $e_4, e_5, e_6$ s $P_3, P_5, P_6 \implies \deg(P_4) = 3$.
   - $P_5$: Sousedí pouze přes hranu $e_5$ s $P_4 \implies \deg(P_5) = 1$ (List).
   - $P_6$: Sousedí pouze přes hranu $e_6$ s $P_4 \implies \deg(P_6) = 1$ (List).

2. **Huby a Listy:**
   - Proteiny $P_3$ a $P_4$ mají nejvyšší stupeň ($\deg = 3$), představují **lokální huby** sítě spojené mostem $e_4$.
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
   - Počet hran $|E| = 6$ ($e_1$ až $e_6$). Tedy $2|E| = 2 \times 6 = 12$.
   - Součet stupňů: $\sum_{i=1}^6 \deg(P_i) = 2 + 2 + 3 + 3 + 1 + 1 = 12$.
   - Platí $12 = 12$. Handshaking lemma je bezchybně ověřeno!
</details>
