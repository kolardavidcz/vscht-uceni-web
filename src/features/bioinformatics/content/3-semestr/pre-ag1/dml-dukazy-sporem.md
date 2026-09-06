# Modul 3: Důkazy Sporem & Extremální Princip

> **[Relevance: 90%]** · **Tags:** `[EPIC]` `[CHALLENGE]` `[INSIGHT]` `[PAST U ZKOUŠKY]`
> **Cíl modulu:** Naučit se elegantní techniku důkazu, kde místo přímého dokazování ukážeš, že opak by vedl k nesmyslu.

---

## 🕵️ Detektivní přístup k matematice

Sherlock Holmes říká: *„Když vyloučíš vše nemožné, co zbude — i kdyby to bylo sebenepravděpodobnější — musí to být pravda."*

Důkaz sporem funguje přesně takhle:

1. Chceš dokázat, že tvrzení **B** platí.
2. Předpokládej, že **B neplatí** (tedy předpokládej opak).
3. Z tohoto předpokladu logicky odvoď **nesmysl** — něco, co je zjevně nepravdivé (spor s tím, co víš).
4. Protože opak B vedl k nesmyslu, **B musí platit**.

**Příklad z reálného světa:** Chceš dokázat, že v místnosti s 13 lidmi musí aspoň dva sdílet narozeninový měsíc. Předpokládej opak — každý má jiný měsíc. Ale měsíců je jen 12. To je spor — 13 lidí se do 12 měsíců nevejde jeden do každého. Předpoklad byl špatný, takže dva lidi sdílí měsíc. ✅

> **Intuice bez vzorce:** Důkaz sporem = „řeknu opak, a pak ukážu, proč to nemůže být pravda."

---

## 1. Logická Podstata Důkazu Sporem `[INSIGHT]`

V Modulu 1 jsme si ukázali, že negací implikace $A \Rightarrow B$ je výrok:
$$\neg (A \Rightarrow B) \quad \equiv \quad (A \land \neg B)$$

Důkaz sporem spočívá v jednoduché, ale nesmírně mocné logické myšlence:
> **Princip Důkazu Sporem:** Chceme-li dokázat, že platí implikace $A \Rightarrow B$, **předpokládáme její negaci** (tj. předpokládáme, že předpoklad $A$ platí a ZÁROVEŇ závěr $B$ neplatí). Pokud z tohoto spojení posloupností platných matematických kroků odvodíme **spor (rozpor / $\bot$)** s definicí, předpokladem $A$ nebo dříve dokázaným faktem, pak náš předpoklad pro spor nemohl platit a původní tvrzení $A \Rightarrow B$ je pravdivé!

```text
Schéma myšlenkového toku u důkazu sporem:

        Předpoklad A  ∧  Negovaný závěr ¬B
                         │
                         ▼ (Logické odvozování krok za krokem)
                         │
                         ▼
        💥 SPOR (Rozpor s faktem, definicí nebo A = 1)
                         │
                         ▼
    ZÁVĚR: Náš předpoklad ¬B byl chybný, tedy platí B!
```

---

## 2. Šablona Zápisu Důkazu Sporem u Zkoušky AG1 `[Relevance: 95%]` `[PAST U ZKOUŠKY]`

Při hodnocení zkouškových testů z AG1 vyžadují vyučující přesně definovanou strukturu:

```text
FORMÁLNÍ ŠABLONA ZÁPISU DŮKAZU SPOREM:

1. PŘEDPOKLAD PRO SPOR:
   - "Předpokládejme pro spor, že platí předpoklad A a ZARÓVEŇ NEPLATÍ závěr B (platí ¬B)."

2. LOGICKÉ ODVOZOVÁNÍ:
   - "Z platnosti ¬B plyne vlastnost X..."
   - "Z vlastnosti X a předpokladu A odvodíme vlastnost Y..."

3. DOSAŽENÍ SPORU (Rozporu ⚡ / 💥 / ⊥):
   - "To je ale SPOR (⚡) s [definicí Z / předpokladem A / dokázanou větou]!"

4. ZÁVĚR:
   - "Proto náš předpoklad pro spor nemohl platit, a tedy původní tvrzení A => B platí. Q.E.D."
```

---

## 3. 🐦 Dirichletův princip v Teorii Grafů (Holubi, Škatulky & Sítě) `[Relevance: 95%]` `[EPIC]`

Tento princip (v angličtině *Pigeonhole Principle*) je jedním z nejmocnějších nástrojů diskrétní matematiky a teorie grafů. Jeho základní znění zní téměř banálně:

> **Dirichletův princip (Pigeonhole Principle):**  
> Pokud máme $n$ předmětů (holubů) a chceme je umístit do $k$ přihrádek (škatułek), přičemž počet předmětů je větší než počet přihrádek ($n > k$), pak **alespoň v jedné přihrádce musí skončit dva nebo více předmětů**.

```text
  Škatulka 1     Škatulka 2     Škatulka 3     Škatulka 4
 ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
 │   🕊️ 🕊️   │  │    🕊️     │  │    🕊️     │  │    🕊️     │
 └───────────┘  └───────────┘  └───────────┘  └───────────┘
       ▲
       └────── 5 holubů do 4 škatulek ➔ Kolize je NEVYHNUTELNÁ!
```

### Proč to funguje? (Důkaz sporem za 10 sekund)
Předpokládejme opak: v každé z $k$ přihrádek je **nanejvýš 1 holub**.  
Pak celkový počet holubů je nejvýše $1 \times k = k$.  
My však máme $n > k$ holubů, což je okamžitý **SPOR**! Opak tedy nemůže platit a alespoň v jedné přihrádce musí být alespoň dva holubi.

---

### 🔬 Příklad 1: Dva vrcholy se stejným stupněm v každém grafu

Tohle je absolutní klasika zkouškových testů na FIT i VŠCHT.

> **Věta:** V každém jednoduchém neorientovaném grafu $G = (V, E)$ s $n \ge 2$ vrcholy **vždy existují alespoň dva vrcholy se stejným stupněm**.

#### 🐢 Pomalý rozbor krok za krokem:

1. **Kdo jsou „holubi"?**
   - Holubi jsou **vrcholy grafu**. Máme jich celkem $n$ (označme je $v_1, v_2, \dots, v_n$).

2. **Co jsou „škatulky"?**
   - Škatulky jsou **možné hodnoty stupňů** vrcholů $\deg(v)$.
   - Jaký stupeň může mít vrchol v jednoduchém grafu o $n$ vrcholech?
     - Minimální stupeň je $0$ (vrchol je izolovaný, nemá žádnou hranu).
     - Maximální stupeň je $n - 1$ (vrchol je spojen hranou se všemi ostatními $n - 1$ vrcholy).
   - Teoreticky máme stupně z množiny:
     $$\{0, 1, 2, \dots, n - 1\}$$
   - To je celkem **$n$ různých možných stupňů**. 
   - *Pozor:* Máme $n$ vrcholů a $n$ hodnot. Na první pohled by se zdálo, že Dirichlet selže, protože počet holubů se rovná počtu škatułek!

3. **Klíčový grafový trik (Vzájemné vyloučení):**
   - Může v jednom grafu existovat **izolovaný vrchol** (stupeň $0$) a **současně vrchol spojený se všemi** (stupeň $n - 1$)?
   - **Předpokládejme pro spor, že ano:**
     - Nechť vrchol $u$ má stupeň $n - 1$. To znamená, že $u$ je spojen hranou s **úplně všemi** ostatními vrcholy v grafu!
     - Nechť vrchol $w$ má stupeň $0$. To znamená, že $w$ není spojen s **vůbec nikým**.
     - Ale $u$ musí být spojen i s $w$! Hrana $\{u, w\}$ tedy nutně existuje.
     - Tím pádem má vrchol $w$ stupeň alespoň $1$, což je **SPOR** s tím, že má stupeň $0$!
   - **Důsledek:** Hodnoty $0$ a $n - 1$ se **vzájemně vylučují** a nemohou se v tomtéž grafu potkat!

4. **Aplikace Dirichletova principu:**
   V libovolném grafu o $n$ vrcholech tedy nastává právě jedna ze dvou situací:
   - **Situace A (Graf obsahuje izolovaný vrchol):** Pak v grafu není žádný vrchol stupně $n - 1$. Možné hodnoty stupňů jsou pouze z množiny $\{0, 1, 2, \dots, n - 2\}$. To je přesně **$n - 1$ škatułek**.
   - **Situace B (Graf neobsahuje izolovaný vrchol):** Pak všechny vrcholy mají stupeň alespoň 1. Možné hodnoty stupňů jsou z množiny $\{1, 2, \dots, n - 1\}$. To je opět přesně **$n - 1$ škatułek**.

V obou případech máme **$n$ vrcholů (holubů)** a nanejvýš **$n - 1$ možných stupňů (škatułek)**.  
Protože $n > n - 1$, podle Dirichletova principu musí existovat alespoň jedna hodnota stupně, kterou sdílí **dva nebo více vrcholů**.

```text
Vizuální znázornění pro graf se 4 vrcholy (n = 4, situace bez izolovaného uzlu):

Vrcholy (holubi):      (A)          (B)          (C)          (D)
                        │            │            │            │
                        ▼            ▼            ▼            ▼
Možné stupně (boxy): ┌──────┐     ┌──────┐     ┌──────┐
                     │ deg 1│     │ deg 2│     │ deg 3│
                     ├──────┤     ├──────┤     ├──────┤
                     │ (A)  │     │ (B)  │     │ (D)  │
                     │      │     │ (C) ◄┼─────┼──────┴── KOLIZE! Vrcholy B a C
                     └──────┘     └──────┘     └──────┘   mají shodně stupeň 2!
```

*Bioinformatická interpretace:* V protein-proteinové interakční síti (PPI síť) o $n$ proteinech vždy existují alespoň dva proteiny, které mají navlas stejný počet interakčních partnerů.

---

### 🧬 Příklad 2: Cesta délky $n$ v grafu o $n$ vrcholech nutně tvoří cyklus

Uvažujme orientovanou síť enzymatických reakcí nebo signální dráhu.

> **Tvrzení:** Pokud v grafu $G = (V, E)$ o $n$ vrcholech existuje orientovaná posloupnost kroků (sled) procházející $n$ hranami, pak tato posloupnost nutně obsahuje alespoň jeden **cyklus (smyčku)**.

#### 🐢 Pomalý rozbor:
1. Sled délky $n$ hran navštíví celkem **$n + 1$ vrcholů**:
   $$(u_0 \xrightarrow{e_1} u_1 \xrightarrow{e_2} u_2 \to \dots \xrightarrow{e_n} u_n)$$
2. Naši „holubi“ jsou navštívené pozice na trase: máme jich **$n + 1$**.
3. Naše „škatulky“ jsou skutečné existující vrcholy grafu: máme jich jen **$n$** ($V = \{v_1, \dots, v_n\}$).
4. Dle Dirichletova principu ($n+1 > n$) musel být alespoň jeden vrchol grafu **navštíven alespoň dvakrát**:
   $$u_i = u_j \quad \text{pro nějaké } 0 \le i < j \le n$$
5. Úsek trasy mezi těmito indexy tvoří uzavřený cyklus:
   $$(u_i \to u_{i+1} \to \dots \to u_j = u_i)$$

```text
Trasa se 4 hranami v grafu s 4 uzly:

Navštívené uzly:   u₀ ─────> u₁ ─────> u₂ ─────> u₃ ─────> u₄ (5 návštěv)
                                       │                   ▲
                                       │  u₂ a u₄ jsou     │
                                       │  TÝŽ UZEL!        │
                                       └───────────────────┘
                                         Vzniká cyklus: u₂ ➔ u₃ ➔ u₂
```

*Algoritmický význam:* Toto je teoretický základ pro Floydův algoritmus detekce cyklů (želva a zajíc) i pro důkaz korektnosti Bellman-Fordova algoritmu (nejdelší jednoduchá cesta má nanejvýš $n-1$ hran).

---

## 4. 🔬 Extremální Princip v Grafech — Krok za Krokem `[Relevance: 90%]` `[MEGA EPIC]`

### Princip

> **Extremální princip (Extremal Principle):** Když chceš najít spor, zvolíme **extrémní objekt** (např. nejdelší jednoduchou cestu $P_{max}$, nejmenší cyklus, vrchol s maximálním či minimálním stupněm nebo nejlehčí hranu) a zkoumáme, co z jeho extremality plyne.

Klíčová myšlenka: Extrémní objekt **už z principu nemůže mít vlastnost, která by ho ještě více zvětšila či zmenšila** (jinak by existoval ještě extrémnější, což je spor s jeho volbou). To nám dá okamžitý a čistý spor.

---

### Pracovaný příklad 1: Pokud $\delta(G) \ge 2$, pak $G$ obsahuje cyklus

**Tvrzení:** Nechť $G = (V, E)$ je konečný neorientovaný graf s minimálním stupněm $\delta(G) \ge 2$. Pak $G$ obsahuje alespoň jeden cyklus.

**Konkrétní příklad pro ilustraci:** Uvažuj graf s vrcholy $\{1, 2, 3, 4, 5\}$ a hranami tak, že každý vrchol má stupeň alespoň 2:

```text
1 ──── 2 ──── 3
|             |
5 ──── 4 ────┘
```

Zde každý vrchol má stupeň 2. Cyklus $1 \to 2 \to 3 \to 4 \to 5 \to 1$ zjevně existuje. Jak to dokázat obecně pro libovolný takový graf?

---

### ✍️ Formální důkaz extremálním principem

1. **Krok 1 — Zvolíme nejdelší jednoduchou cestu:**  
   Nechť $P = (v_0, v_1, v_2, \ldots, v_k)$ je **nejdelší jednoduchá cesta** v grafu $G$. (Takový extremální objekt v konečném grafu zaručeně existuje.)

2. **Krok 2 — Zkoumáme krajní vrchol $v_0$:**  
   Stupeň $\deg(v_0) \ge 2$ (z předpokladu $\delta(G) \ge 2$). Vrchol $v_0$ tedy má alespoň 2 sousedy.

3. **Krok 3 — Sousedé $v_0$ musí být na cestě $P$:**  
   Předpokládejme pro spor, že $v_0$ má souseda $u \notin \{v_1, v_2, \ldots, v_k\}$ (mimo cestu $P$).  
   Pak $(u, v_0, v_1, \ldots, v_k)$ je jednoduchá cesta délky $k+1$ — delší než $P$.  
   To je **💥 SPOR s maximalitou cesty $P$**!  
   Tedy **všichni sousedé $v_0$ leží přímo na cestě $P$**: $v_0$ sousedí pouze s vrcholy $v_1, v_2, \ldots, v_k$.

4. **Krok 4 — Najdeme cyklus:**  
   Víme, že $v_0$ má alespoň 2 sousedy a všichni leží na $P$.  
   Jeden soused je $v_1$ (hrana $\{v_0, v_1\}$ je součástí $P$). Druhý soused $v_j$ (pro $j \ge 2$) dává hranu $\{v_0, v_j\}$.  
   Hrana $\{v_0, v_j\}$ spolu s úsekem cesty $v_0, v_1, \ldots, v_j$ tvoří **cyklus**:
   $$v_0 \to v_1 \to v_2 \to \cdots \to v_j \to v_0$$

**Závěr:** $G$ obsahuje cyklus.

```text
Vizuální schéma extremálního důkazu:

             Hrana {v₀, vj} vytváří CYKLUS!
        ┌───────────────────────────────────────┐
        ▼                                       │
      ( v₀ ) ───> ( v₁ ) ───> ( v₂ ) ───> ... ───> ( vj ) ───> ... ───> ( vk )
        ▲
        │  Pokus o souseda u ∉ P selže:
        └─── ✖ (u) by prodloužil cestu na délku k+1 (SPOR s maximalitou P)
```

---

### Tracování na konkrétním grafu $G$ s 5 vrcholy:

Graf: $V = \{1,2,3,4,5\}$, hrany: $\{1,2\},\{2,3\},\{3,4\},\{4,5\},\{5,1\},\{1,3\}$. Každý vrchol má stupeň $\ge 2$.

```text
    1
   /|\
  5 | 3
  | | |
  4─┘ 2
```

1. **Nejdelší jednoduchá cesta:** Zvolme např. $P = (2, 1, 5, 4, 3)$ o délce 4.
2. **Krajní vrchol $v_0 = 2$:** Sousedé vrcholu 2 jsou $\{1, 3\}$. Oba leží na $P$ (vrchol 1 je $v_1$, vrchol 3 je $v_4$).
3. **Nalezený cyklus:** Hrana $\{2, 3\}$ + úsek cesty $2 \to 1 \to 5 \to 4 \to 3$ dává cyklus $2 \to 1 \to 5 \to 4 \to 3 \to 2$ délky 5.

---

### 🛣️ Pracovaný příklad 2: Nejkratší cesta s nezápornými vahami neobsahuje cyklus

> **Věta:** V grafu $G = (V, E, w)$ s nezápornými vahami ($w(e) \ge 0$) neobsahuje žádná nejkratší cesta z $s$ do $t$ žádný cyklus.

**Důkaz sporem:**
1. Předpokládejme pro spor, že nejkratší cesta $P$ z $s$ do $t$ obsahuje cyklus $C$.
2. Rozložme cestu na úseky: $s \xrightarrow{P_1} u \xrightarrow{C} u \xrightarrow{P_2} t$.  
   Celková váha je $w(P) = w(P_1) + w(C) + w(P_2)$.
3. Vynecháním cyklu $C$ získáme novou cestu $P': s \xrightarrow{P_1} u \xrightarrow{P_2} t$.
4. Protože váhy jsou nezáporné, platí $w(C) \ge 0$.  
   - Je-li $w(C) > 0$, pak $w(P') < w(P)$, což je **SPOR** s tím, že $P$ byla nejkratší.
   - Je-li $w(C) = 0$, nová cesta $P'$ má stejnou váhu, ale striktně méně hran — což vylučuje nutnost cyklu na nejkratší jednoduché trase.

---

<div class="my-6 p-4 rounded-xl border border-brand-orange/30 bg-brand-orange/5 text-stone-800 dark:text-stone-200">
  <div class="flex items-center gap-2 font-bold text-brand-orange-text dark:text-brand-orange text-sm mb-1.5">
    <span>💡</span> <span>Důležitý vhled pro AG1: Konstruktivní vs. Nekonstruktivní existence</span>
  </div>
  <p class="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mb-2">
    Všimněte si společné vlastnosti: <strong>Důkaz sporem, Dirichletův princip i Extremální princip jsou nekonstruktivní</strong>.
  </p>
  <ul class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 space-y-1 list-disc pl-4">
    <li><strong>Nekonstruktivní existence:</strong> Dokážou, že hledaný prvek (dva vrcholy se stejným stupněm, cyklus, nejkratší cesta) <em>musí zaručeně existovat</em>, ale <strong>nedávají žádný recept ani algoritmus</strong>, jak ho v datech najít či sestrojit.</li>
    <li><strong>Konstruktivní existence (zlatý standard v informatice):</strong> Existenci dokážeme tím, že předložíme konkrétní funkční <strong>algoritmus (kód v C++)</strong>, který řešení krok za krokem spolehlivě sestrojí — po doběhnutí kódu držíme výsledek přímo v ruce.</li>
  </ul>
</div>

---

## 🧪 Procvičovací Úlohy

### Úloha 1: Graf s maximálním stupněm $\Delta(G) \le 2$ je cesta nebo cyklus
Dokážeme sporem, že každý souvislý graf $G$, ve kterém má každý vrchol $\deg(v) \le 2$, je buď cesta ($P_n$), nebo kružnice ($C_n$).

<details>
<summary>🔍 Zobrazit vzorové řešení</summary>
<div class="p-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-2">
<ol class="list-decimal pl-5 space-y-1">
<li>Zvolme v $G$ nejdelší jednoduchou cestu $P = (v_0, v_1, \dots, v_k)$.</li>
<li>Předpokládejme pro spor, že $G$ obsahuje uzel $u \notin P$.</li>
<li>Protože $G$ je souvislý, musí existovat hrana spojující uzel $u$ s nějakým vrcholem cesty $P$.</li>
<li>Vnitřní vrcholy $v_1, \dots, v_{k-1}$ již mají stupeň 2 (hrany k předchůdci a následníkovi na cestě). Nemohou se tedy spojit s $u$, protože maximální stupeň v grafu je $\le 2$.</li>
<li>Hrana z $u$ by proto musela vést do krajního vrcholu $v_0$ nebo $v_k$. To by však umožnilo prodloužit cestu $P$ o uzel $u$, což je <strong>SPOR s maximalitou cesty $P$</strong>!</li>
<li>Žádný uzel mimo $P$ tedy neexistuje a graf je buď cestou (pokud $v_0$ a $v_k$ nejsou spojeny), nebo kružnicí (pokud jsou spojeny).</li>
</ol>
</div>
</details>

---

### Úloha 2: Každý konečný DAG má alespoň jeden zdroj (Source)
Dokažte sporem, že v každém konečném orientovaném acyklickém grafu existuje uzel se vstupním stupněm $\deg^-(v) = 0$.

<details>
<summary>🔍 Zobrazit vzorové řešení</summary>
<div class="p-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-2">
<ol class="list-decimal pl-5 space-y-1">
<li>Předpokládejme pro spor, že DAG neobsahuje žádný zdroj — tedy každý uzel má $\deg^-(v) \ge 1$.</li>
<li>Vybereme libovolný uzel $u_0$. Protože má vstupní hranu, má předchůdce $u_1$, ten má předchůdce $u_2$, a tak dále.</li>
<li>Vytváříme nekonečnou posloupnost kroků dozadu: $\dots \to u_2 \to u_1 \to u_0$.</li>
<li>Protože graf má pouze $n$ vrcholů (konečná množina), podle Dirichletova principu se po nejvýše $n+1$ krocích musí alespoň jeden vrchol zopakovat: $u_i = u_j$.</li>
<li>Tím vzniká orientovaný cyklus, což je <strong>SPOR</strong> s definicí DAGu (acyklický graf)! V DAGu tedy vždy musí existovat zdroj.</li>
</ol>
</div>
</details>

---

> ➡️ **Pokračujte na závěrečný zkouškový workshop:** [4 · Zkouškový Workshop & Šablony Důkazů z AG1](./dml-zkouskovy-workshop)

