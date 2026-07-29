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
   - "Proto náš předpoklad pro spor nemohl platit, a tedy původní tvrzení A => B platí. Q.E.D. (■)"
```

---

## 3. Bipartitní Grafy & Liché Cykly `[Relevance: 95%]` `[EPIC]`

Jedním z nejdůležitějších strukturních charakteristik v grafové teorii je **bipartitnost**.

> **Definice Bipartitního Grafu:** Graf $G = (V, E)$ je bipartitní, pokud lze jeho množinu vrcholů $V$ rozložit na dvě disjunktní podmnožiny $V_1, V_2$ ($V = V_1 \cup V_2$ a $V_1 \cap V_2 = \emptyset$) tak, že každá hrana $e = \{u, v\} \in E$ má jeden koncový vrchol ve $V_1$ a druhý koncový vrchol ve $V_2$. Žádná hrana nespojuje dva vrcholy uvnitř téže množiny.

### 📜 Věta (Charakterizace Bipartitních Grafů):
Graf $G = (V, E)$ je bipartitní **právě tehdy, když** neobsahuje žádný lichý cyklus.

---

### 3.1 Důkaz Snazšího Směru ($\implies$): Bipartitní $\implies$ Nemá Liché Cykly

Dokážeme sporem implikaci: *"Pokud je $G$ bipartitní, pak neobsahuje žádný lichý cyklus."*

#### ✍️ Formální Důkaz Sporem `[PAST U ZKOUŠKY]`:
1. **Předpoklad pro spor:**
   Předpokládejme pro spor, že graf $G = (V, E)$ **je bipartitní** (s rozložením $V = V_1 \cup V_2$) a **ZÁROVEŇ obsahuje lichý cyklus** $C = (v_1, v_2, \dots, v_k, v_1)$ délky $k$, kde $k$ je liché číslo ($k = 2r + 1$).
2. **Krok 1 (Bipartitní obarvení vrcholů cyklu):**
   Bez újmy na obecnosti zařaďme první vrchol cyklu $v_1$ do množiny $V_1$.
   - Protože hrana $\{v_1, v_2\} \in E$ spojuje $V_1$ s $V_2$, musí vrchol $v_2 \in V_2$.
   - Hrana $\{v_2, v_3\} \in E$ vynucuje $v_3 \in V_1$.
   - Obecně pro každý vrchol $v_i$ cyklu platí:
     $$v_i \in V_1 \iff i \text{ je liché (tj. } i = 1, 3, 5, \dots)$$
     $$v_i \in V_2 \iff i \text{ je sudé (tj. } i = 2, 4, 6, \dots)$$
3. **Krok 2 (Analýza posledního vrcholu cyklu):**
   Délka cyklu $k$ je **liché číslo**. Proto podle našeho pravidla platí:
   $$v_k \in V_1$$
   Nicméně cyklus je uzavřen hranou $\{v_k, v_1\} \in E$.
4. **💥 SPOR ($\bot$):**
   Oba koncové vrcholy hrany $\{v_k, v_1\}$ (tedy jak $v_k$, tak $v_1$) patří do **stejné množiny $V_1$**!
   To je v přímém **SPORU** s definicí bipartitního grafu, která striktně zakazuje hrany mezi vrcholy uvnitř téže množiny $V_1$.
5. **Závěr:**
   Předpoklad pro spor nemohl platit. Bipartitní graf nemůže obsahovat žádný lichý cyklus. $\blacksquare$

---

### 3.2 Důkaz Těžšího Směru ($\impliedby$): Nemá Liché Cykly $\implies$ Bipartitní

Pro úplnost si ukažme i druhý směr implikace: *"Pokud $G$ neobsahuje žádný lichý cyklus, pak je $G$ bipartitní."*

#### ✍️ Konstruktivní Důkaz pomocí BFS Vrstev `[INSIGHT]`:
1. Zvolme libovolný počáteční vrchol $s \in V$.
2. Rozdělme vrcholy grafu do **hladin (vrstev) $L_i$** podle jejich vzdálenosti $\delta(s, v)$ od zdrojového vrcholu $s$:
   $$L_i = \{v \in V \mid \delta(s, v) = i\}$$
3. Definujme rozložení vrcholů $V = V_1 \cup V_2$:
   - $V_1 = \bigcup_{i \text{ je sudé}} L_i$ (všechny hladiny se sudou vzdáleností 0, 2, 4...).
   - $V_2 = \bigcup_{i \text{ je liché}} L_i$ (všechny hladiny s lichou vzdáleností 1, 3, 5...).
4. Může existovat hrana $\{u, v\}$ spojující dva vrcholy uvnitř téže hladiny $L_i$?
   - Pokud by existovala hrana $\{u, v\}$ s $u, v \in L_i$, pak cesty z $s$ do $u$ (délky $i$) a z $s$ do $v$ (délky $i$) společně s hranou $\{u, v\}$ by vytvořily cyklus celkové délky $i + i + 1 = 2i + 1$, což je **lichý cyklus**!
   - Jelikož $G$ neobsahuje žádné liché cykly, hrany uvnitř téže hladiny nemohou existovat!
5. Tedy každá hrana spojuje vrchol ze sudé hladiny ($V_1$) s vrcholem z liché hladiny ($V_2$). Graf $G$ je bipartitní. $\blacksquare$

---

## 4. Extremální Princip & Rozbor Vzorových Případů `[Relevance: 95%]` `[MEGA EPIC]`

**Extremální princip (Extremal Principle)** je nejoblíbenější vyšetřovací technikou v grafových důkazech:
> **Myšlenka Extremálního Principu:** Místo uvažování obecného objektu zvolíme v grafu **extremální prvek** – např. nejkratší cestu, nejdelší cestu $P_{max}$, vrchol s největším stupněm $\Delta(G)$ nebo nejlehčí hranu. Vlastnosti tohoto extremálního prvku pak vedou k okamžitému odhalení sporu!

---

### 4.1 Vzorový Případ 1: Graf s $\delta(G) \ge 2$ Obsahuje Cyklus `[PAST U ZKOUŠKY]`

> **Věta:** Každý konečný neorientovaný graf $G = (V, E)$, ve kterém má každý vrchol stupeň $\deg(v) \ge 2$, obsahuje alespoň jeden cyklus.

#### ✍️ Důkaz přes Nejdelší Cestu $P_{max}$ a Extremální Princip:

1. **Konstrukce extremálního objektu:**
   Protože graf $G$ je konečný, existuje v něm **nejdelší jednoduchá cesta** $P = (v_0, v_1, v_2, \dots, v_k)$ o $k$ hranách.
2. **Předpoklad pro spor:**
   Předpokládejme pro spor, že $G$ **neobsahuje žádný cyklus** (graf $G$ je les).
3. **Analýza sousedů koncového vrcholu $v_k$:**
   Podle předpokladu věty platí $\deg(v_k) \ge 2$. Vrchol $v_k$ je spojen hranami s alespoň 2 různými vrcholy.
   - **Případ A (Soused mimo cestu $P$):** Pokud by existoval uzel $w \notin P$ spojený s $v_k$ hranou $\{v_k, w\}$, mohli bychom cestu $P$ prodloužit o uzel $w$ na cestu $(v_0, \dots, v_k, w)$ délky $k+1$. To je v přímém **SPORU** s maximalitou cesty $P$!
   - **Případ B (Sousedé leží na cestě $P$):** Proto všichni sousedé vrcholu $v_k$ musí ležet na cestě $P$. Jedním sousedem je předchůdce $v_{k-1}$. Jelikož $\deg(v_k) \ge 2$, musí mít $v_k$ druhého souseda $v_i$ na cestě $P$, kde $i \le k - 2$.
4. **💥 SPOR ($\bot$):**
   Úsek cesty od $v_i$ do $v_k$ spojený hranou $\{v_k, v_i\}$ tvoří uzavřený **cyklus** $(v_i, v_{i+1}, \dots, v_k, v_i)$!
   To je v přímém **SPORU** s předpokladem sporu, že $G$ neobsahuje žádný cyklus!
5. **Závěr:**
   Náš předpoklad pro spor byl chybný. Graf $G$ s $\delta(G) \ge 2$ musí obsahovat alespoň jeden cyklus. $\blacksquare$

---

### 4.2 Vzorový Případ 2: Nejkratší Cesta v Grafu s Nezápornými Vahami

> **Věta:** V grafu $G = (V, E, w)$ s nezápornými vahami hran ($w(e) \ge 0$) neobsahuje žádná nejkratší **jednoduchá cesta** mezi $s$ a $t$ žádný cyklus.

#### ✍️ Důkaz Sporem:
1. **Předpoklad pro spor:** Předpokládejme pro spor, že nejkratší cesta $P$ z $s$ do $t$ obsahuje cyklus $C$.
2. **Rozklad cesty:** Cestu $P$ zapíšeme jako $s \xrightarrow{P_1} u \xrightarrow{C} u \xrightarrow{P_2} t$ s vahou $w(P) = w(P_1) + w(C) + w(P_2)$.
3. **Vynechání cyklu:** Uvažujme zkrácenou cestu $P': s \xrightarrow{P_1} u \xrightarrow{P_2} t$ bez cyklu $C$.
4. **Porovnání vah:** Jelikož $w(e) \ge 0$, váha cyklu $w(C) \ge 0$. Tedy $w(P') = w(P) - w(C) \le w(P)$.
   - Pokud $w(C) > 0$, dostaneme $w(P') < w(P)$, což je **SPOR** s tím, že $P$ byla nejkratší cesta.
   - Pokud $w(C) = 0$, nová cesta $P'$ má stejnou váhu, ale striktně **méně hran**, což je **SPOR** s minimálním počtem hran nejkratší cesty.
5. Nejkratší cesta neobsahuje žádný cyklus. $\blacksquare$

---

## 🧪 Procvičovací Úlohy pro Bioinformatiky

### Úloha 3.1: Graf s Nejvýše 2 Listy Je Cesta
Dokážeme sporem, že každý souvislý graf $G = (V, E)$, ve kterém má každý vrchol stupeň $\deg(v) \le 2$, je buď jednoduchá cesta ($P_n$), nebo cyklus ($C_n$).

<details>
<summary>🔍 Zobrazit vzorový důkaz sporem</summary>

### ✍️ Řešení Důkazem Sporem:
1. **Předpoklad pro spor:** Nechť $G$ je souvislý graf s $\Delta(G) \le 2$. Předpokládejme pro spor, že $G$ není cesta ani cyklus.
2. Zvolme v $G$ nejdelší jednoduchou cestu $P = (v_0, v_1, \dots, v_k)$.
3. Jelikož $G$ je souvislý a není cestou, musí v $G$ existovat vrchol $u \notin P$ spojený hranou s něčím na cestě $P$.
4. Jelikož $\deg(v) \le 2$ pro všechny vrcholy, vnitřní vrcholy cesty $v_1, \dots, v_{k-1}$ již mají stupeň 2 (spojují sousedy na cestě) a nemohou mít žádnou další hranu k $u$.
5. Tedy vrchol $u$ by musel být spojen s koncovým vrcholem $v_0$ nebo $v_k$. To však umožňuje cestu $P$ prodloužit o uzel $u$, což je SPOR s maximalitou cesty $P$!
6. Souvislý graf s $\Delta(G) \le 2$ je tedy jedině cesta nebo cyklus. $\blacksquare$
</details>

---

### Úloha 3.2: Nerovinnost Bipartitního Grafu $K_{3,3}$
Dokážeme sporem s využitím Eulerovy formule pro bipartitní rovinné grafy ($e \le 2v - 4$), že kompletní bipartitní graf $K_{3,3}$ (s 6 vrcholy a 9 hranami) **nelze nakreslit v rovině bez křížení hran**.

<details>
<summary>🔍 Zobrazit vzorový důkaz sporem</summary>

### ✍️ Řešení Důkazem Sporem:
1. **Předpoklad pro spor:** Předpokládejme pro spor, že $K_{3,3}$ **je rovinný graf**.
2. **Krok 1 (Bipartitní ohraničení stěn):** V bipartitním grafu neexistují liché cykly (všechny cykly mají délku alespoň 4). Proto každá stěna v rovinném nakreslení musí být ohraničena alespoň 4 hranami.
3. **Krok 2 (Formulace nerovnosti):**
   Vztah mezi počtem hran $e$ a stěn $f$ dává: $2e \ge 4f \implies f \le \frac{e}{2}$.
   Dosazením do Eulerovy formule $v - e + f = 2$ získáme:
   $$v - e + \frac{e}{2} \ge 2 \implies e \le 2v - 4$$
4. **Krok 3 (Dosazení hodnot pro $K_{3,3}$):**
   Graf $K_{3,3}$ má $v = 6$ a $e = 3 \times 3 = 9$. Dosadíme do vzorce:
   $$9 \le 2(6) - 4 \implies 9 \le 12 - 4 \implies 9 \le 8$$
5. **💥 SPOR ($\bot$):** Dostali jsme nerovnost $9 \le 8$, což je aritmetický rozpor!
6. Graf $K_{3,3}$ není rovinný. $\blacksquare$
</details>

---

## 4. 🐦 Dirichletův princip (aneb Holubi a škatulky) `[Relevance: 80%]` `[INSIGHT]`

Tenhle princip je možná nejkrásnější trick v celé kombinatorice — a přitom je tak jednoduchý, že ho pochopí každý:

> **Dirichletův princip (Pigeonhole Principle):** Pokud rozmístíme $n+1$ holubů do $n$ škatulek, aspoň jedna škatulka musí obsahovat alespoň 2 holuby.

To je vše. Zní triviálně, ale aplikace jsou překvapivě silné.

### Proč to funguje? (důkaz sporem za 10 sekund)

Předpokládej opak: každá škatulka má **nejvýše 1** holuba. Pak celkový počet holubů je nejvýše $1 \times n = n$. Ale máme $n+1$ holubů. Spor! ✅

---

### 🧬 Tři biologické aplikace

#### Aplikace 1: Dva vrcholy stejného stupně v každém grafu

> **Tvrzení:** V každém prostém neorientovaném grafu $G = (V, E)$ s $n \ge 2$ vrcholy existují **alespoň dva vrcholy se stejným stupněm**.

**Důkaz:** Stupně vrcholů jsou čísla z množiny $\{0, 1, 2, \ldots, n-1\}$ — celkem $n$ možností (škatulky). Ale pozor: nemůže nastat, aby jeden vrchol měl stupeň $0$ (izolovaný, žádný soused) a zároveň jiný měl stupeň $n-1$ (spojen se všemi) — to by byl spor. Takže efektivně máme jen $n-1$ různých možností pro stupně. Máme $n$ vrcholů (holubů) a $n-1$ škatulek → aspoň dva vrcholy mají stejný stupeň. $\blacksquare$

*Bioinformatická interpretace:* V PPI síti s $n$ proteiny vždy existují alespoň dva proteiny se stejným počtem interakčních partnerů.

#### Aplikace 2: Opakující se zbytek v DNA sekvenci

> **Tvrzení:** V jakékoli posloupnosti $n+1$ celých čísel existují dvě čísla se stejným zbytkem po dělení $n$.

**Důkaz:** Zbytky po dělení $n$ jsou $\{0, 1, \ldots, n-1\}$ — $n$ škatulek. Máme $n+1$ čísel (holubů). Dirichlet garantuje kolizi. $\blacksquare$

*Bioinformatická interpretace:* Při hashování $k$-merů do tabulky délky $n$ se s $n+1$ různými $k$-mery kolize nevyhnutelně stane.

#### Aplikace 3: Monochromatická hrana v 2-obarveném $K_6$

> **Tvrzení:** Pokud obarvíme hrany úplného grafu $K_6$ dvěma barvami (červená/modrá), vždy existuje monochromatický trojúhelník (3 vrcholy vzájemně spojené hranami téže barvy).

**Intuice:** Zvolme libovolný vrchol $v$. Má $5$ hran. Pigeon: 5 hran do 2 barev → aspoň $\lceil 5/2 \rceil = 3$ hrany stejné barvy (řekněme červené) vedou k vrcholům $a, b, c$. Pokud je aspoň jedna hrana $\{a,b\}, \{b,c\}, \{a,c\}$ červená, máme červený trojúhelník. Pokud žádná není červená, všechny tři jsou modré → modrý trojúhelník $\{a,b,c\}$. V každém případě trojúhelník existuje. $\blacksquare$

---

## 5. 🔬 Extremální princip — krok za krokem na konkrétním grafu `[Relevance: 85%]` `[EPIC]`

### Princip

> **Extremální princip:** Když chceš najít spor, zvolíme **extrémní objekt** (nejdelší cestu, nejmenší cyklus, vrchol s maximálním/minimálním stupněm) a zkoumáme, co z jeho extremality plyne.

Klíčová myšlenka: Extrémní objekt **nemůže mít určitou vlastnost** (jinak by existoval ještě extrémnější). To nám dá spor.

---

### Pracovaný příklad: Pokud $\delta(G) \ge 2$, pak $G$ obsahuje cyklus

**Tvrzení:** Nechť $G = (V, E)$ je konečný neorientovaný graf s minimálním stupněm $\delta(G) \ge 2$. Pak $G$ obsahuje alespoň jeden cyklus.

**Konkrétní příklad pro ilustraci:** Uvažuj graf s vrcholy $\{1, 2, 3, 4, 5\}$ a hranami tak, že každý vrchol má stupeň alespoň 2:

```
1 ──── 2 ──── 3
|             |
5 ──── 4 ────┘
```

Zde každý vrchol má stupeň 2. Cyklus $1 \to 2 \to 3 \to 4 \to 5 \to 1$ zjevně existuje. Jak to dokázat obecně?

---

### ✍️ Formální důkaz extremálním principem

**Krok 1 — Zvolíme nejdelší jednoduchou cestu:**
Nechť $P = (v_0, v_1, v_2, \ldots, v_k)$ je **nejdelší jednoduchá cesta** v $G$. (Existuje, protože $G$ je konečný.)

**Krok 2 — Zkoumáme krajní vrchol $v_0$:**
Stupeň $\deg(v_0) \ge 2$ (z předpokladu $\delta(G) \ge 2$). Vrchol $v_0$ tedy má alespoň 2 sousedy.

**Krok 3 — Sousedé $v_0$ musí být na cestě $P$:**
Předpokládej, že $v_0$ má souseda $u \notin \{v_1, v_2, \ldots, v_k\}$ (mimo cestu). Pak $(u, v_0, v_1, \ldots, v_k)$ je jednoduchá cesta délky $k+1$ — delší než $P$. Spor s maximalitou $P$!

Tedy **všichni sousedé $v_0$ leží na $P$**: $v_0$ sousedí pouze s vrcholy $v_1, v_2, \ldots, v_k$.

**Krok 4 — Najdeme cyklus:**
Víme, že $v_0$ má alespoň 2 sousedy a všichni leží na $P$. Jeden soused je $v_1$ (hrana $\{v_0, v_1\}$ je součástí $P$). Druhý soused $v_j$ (pro $j \ge 2$) dá hranu $\{v_0, v_j\}$.

Hrana $\{v_0, v_j\}$ spolu s úsekem cesty $v_0, v_1, \ldots, v_j$ tvoří **cyklus** délky $j \ge 2$:
$$v_0 \to v_1 \to v_2 \to \cdots \to v_j \to v_0$$

**Závěr:** $G$ obsahuje cyklus. $\blacksquare$

---

### Tracování na konkrétním grafu $G$ s 5 vrcholy:

Graf: $V = \{1,2,3,4,5\}$, hrany: $\{1,2\},\{2,3\},\{3,4\},\{4,5\},\{5,1\},\{1,3\}$. Každý vrchol má stupeň $\ge 2$.

```
    1
   /|\
  5 | 3
  | | |
  4─┘ 2
```

**Nejdelší jednoduchá cesta:** $P = (4, 3, 1, 5, ...)$ nebo $P = (2, 3, 4, 5, 1, 3)$... zkusme $P = (2, 1, 5, 4, 3)$ — délka 4.

**Krajní vrchol $v_0 = 2$:** Sousedé vrcholu 2 jsou $\{1, 3\}$. Oba leží na $P$ (vrchol 1 je $v_1$, vrchol 3 je $v_4$).

**Cyklus:** Hrana $\{2, 3\}$ + úsek cesty $2 \to 1 \to 5 \to 4 \to 3$ dává cyklus $2 \to 1 \to 5 \to 4 \to 3 \to 2$ délky 5. ✅

---

## 6. 🌊 BFS a Bipartitnost — opačný směr důkazu `[Relevance: 90%]` `[EPIC]`

V AG1 se dokazuje bipartitnost ve dvou směrech. Jeden je snadný (bipartitní $\Rightarrow$ žádný lichý cyklus, Modul 3.3 výše). Druhý — **žádný lichý cyklus $\Rightarrow$ bipartitní** — je zajímavější.

### Intuice: BFS obarvení vrstvami

Spusť BFS z libovolného vrcholu $s$. BFS přirozeně rozdělí vrcholy do **vrstev** podle vzdálenosti od $s$:
- $L_0 = \{s\}$ — vzdálenost 0
- $L_1 = \{$ sousedé $s$ $\}$ — vzdálenost 1
- $L_2 = \{$ sousedé $L_1$ ještě nenavštívení $\}$ — vzdálenost 2
- ...

```
        s          ← L₀ (barva A)
       / \
      a   b        ← L₁ (barva B)
     / \   \
    c   d   e      ← L₂ (barva A)
```

Intuice: Hrany BFS stromu vždy vedou mezi sousedními vrstvami $L_i \leftrightarrow L_{i+1}$, tedy mezi různými barvami. ✅

Problém nastane pouze u **zpětných hran** — hran mimo BFS strom, které spojují dva vrcholy **stejné vrstvy** $L_i \leftrightarrow L_i$. Ty by vytvořily lichý cyklus.

---

### ✍️ Formální důkaz sporem

**Tvrzení:** Pokud $G$ neobsahuje žádný lichý cyklus, pak je $G$ bipartitní.

**Předpokladem pro spor:** Předpokládej, že BFS obarvení selže — existuje hrana $\{u, v\}$ taková, že $u$ a $v$ mají **stejnou barvu** (obě v sudé nebo obě v liché vrstvě).

Nechť $\delta(s, u) = p$ a $\delta(s, v) = q$. Oba mají stejnou paritu ($p \equiv q \pmod{2}$).

Délka cyklu přes $s$: $p + q + 1$ (cesta $s \to \cdots \to u$, hrana $\{u,v\}$, cesta $v \to \cdots \to s$).

Protože $p$ a $q$ mají stejnou paritu, $p + q$ je sudé, tedy $p + q + 1$ je **liché**. Máme lichý cyklus!

To je spor s předpokladem, že $G$ žádný lichý cyklus neobsahuje.

Tedy BFS obarvení **nikdy neselhalo** → $G$ je bipartitní. $\blacksquare$

---

### Úloha 3.3: Dirichlet v grafu — dva vrcholy stejného stupně `[CHALLENGE]`

> **Zadání:** Dokažte Dirichletovým principem, že v každém prostém neorientovaném grafu $G$ s $n \ge 2$ vrcholy existují alespoň dva vrcholy se stejným stupněm.

<details>
<summary>🔍 Zobrazit vzorové řešení</summary>

### ✍️ Řešení:

Stupně vrcholů leží v množině $\{0, 1, 2, \ldots, n-1\}$ — celkem $n$ hodnot.

Klíčové pozorování: V prostém grafu **nemohou nastat zároveň** hodnota $0$ (izolovaný vrchol) a hodnota $n-1$ (vrchol spojený se všemi ostatními), protože vrchol stupně $n-1$ by byl spojen i s izolovaným vrcholem, a ten by pak neměl stupeň $0$.

Tedy reálný rozsah stupňů je buď $\{0,1,\ldots,n-2\}$ nebo $\{1,2,\ldots,n-1\}$ — vždy jen $n-1$ různých hodnot.

Aplikujeme Dirichletův princip: $n$ vrcholů (holubů) a $n-1$ možných hodnot stupně (škatulek) → alespoň dva vrcholy mají stejný stupeň. $\blacksquare$

</details>

---

### Úloha 3.4: DAG má vždy source `[CHALLENGE]`

> **Zadání:** Dokažte sporem, že každý konečný orientovaný acyklický graf (DAG) s alespoň jedním vrcholem obsahuje alespoň jeden **source** — vrchol s vstupním stupněm $\text{deg}^-(v) = 0$ (žádná hrana do něj nevede).

<details>
<summary>🔍 Zobrazit vzorové řešení</summary>

### ✍️ Řešení:

**Předpoklad pro spor:** Předpokládej, že DAG $G$ **neobsahuje žádný source** — tedy každý vrchol má alespoň jednu příchozí hranu ($\text{deg}^-(v) \ge 1$ pro všechna $v$).

**Konstrukce nekonečné cesty:** Začneme v libovolném vrcholu $v_0$. Protože $\text{deg}^-(v_0) \ge 1$, existuje hrana $(v_{-1}, v_0)$, tedy předchůdce $v_{-1}$. Ten také má předchůdce $v_{-2}$. A tak dál...

Formálně: konstruujeme cestu $\cdots \to v_{-2} \to v_{-1} \to v_0$ nekonečně dozadu.

Ale $G$ je **konečný** — má jen $n$ vrcholů. Nekonečná posloupnost vrcholů z konečné množiny musí mít opakování: existuje $i \ne j$ s $v_i = v_j$. To znamená, že existuje orientovaný cyklus.

**Spor:** $G$ je DAG (acyklický), ale nalezli jsme cyklus. Tedy předpoklad byl špatný — DAG musí mít alespoň jeden source. $\blacksquare$

*Bioinformatická aplikace:* V metabolické dráze modelované jako DAG vždy existuje alespoň jeden „vstupní metabolit" (source), který není produktem žádné jiné reakce v síti.

</details>

---

> ➡️ **Pokračujte na modul algoritmické korektnosti:** [4 · Invarianty Cyklů (BFS & Dijkstra)](./dml-loop-invariants)

