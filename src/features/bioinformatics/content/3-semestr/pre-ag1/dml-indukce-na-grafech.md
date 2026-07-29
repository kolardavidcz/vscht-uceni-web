# Modul 2: Indukce na Grafech & Redukční Past

> **[Relevance: 100%]** · **Tags:** `[MEGA EPIC]` `[PAST U ZKOUŠKY]` `[INSIGHT]`
> **Cíl modulu:** Pochopit, jak se v matematice dokazuje tvrzení pro všechny grafy najednou — a vyhnout se pasti, do které padne polovina studentů u zkoušky.

---

## 🁢 Dominová analogie (vážně, takhle to funguje)

Znáš dominový efekt? Postavíš řadu kostek a první padne na druhou, druhá na třetí... Matematická indukce je přesně tohle:

1. **Báze:** Ukážeš, že první kostka padne. *(Tvrzení platí pro nejmenší případ.)*
2. **Krok:** Ukážeš, že POKUD kostka č. $k$ padne, NUTNĚ padne i kostka č. $k+1$. *(Z pravdivosti pro $k$ plyne pravdivost pro $k+1$.)*
3. **Závěr:** Všechny kostky padnou. *(Tvrzení platí pro všechna $n$.)*

Na grafech to funguje stejně — jen místo „kostky č. $k$" říkáme „graf s $k$ vrcholy". A klíčový trik (viz níže) je, že nestavíme grafy od nuly nahoru, ale **rozebíráme je od větších k menším**.

> **Intuice bez vzorce:** Indukce = nejprve dokážeš malý případ, pak ukážeš, že každý větší případ se dá rozebrat na menší. A to stačí pro důkaz pro všechna $n$ najednou.

---

## 1. Peano Axiomy a Princip Matematické Indukce `[INSIGHT]`

V klasické algebře dokazujeme tvrzení $P(n)$ závislá na přirozeném čísle $n \in \mathbb{N}$ (např. součty řad) pomocí **Slabé Matematické Indukce**:
1. **Báze indukce:** Dokážeme, že $P(n_0)$ platí pro nejmenší případ (např. $n_0 = 1$).
2. **Indukční krok:** Pro libovolné $k \ge n_0$ dokážeme implikaci: $P(k) \implies P(k+1)$.
   - Předpoklad $P(k)$ nazýváme **Indukční předpoklad (IP)**.

V teoretické informatice a teorii grafů častěji využíváme **Silnou Matematickou Indukci**:
> **Princip Silné Indukce:** Předpokládáme, že tvrzení platí pro **všechny menší objekty** velikosti $i \in \{n_0, n_0+1, \dots, k\}$, a dokážeme platnost pro objekt velikosti $k+1$:
> $$\left( P(n_0) \land \forall k \ge n_0 : \left( \bigwedge_{i=n_0}^k P(i) \implies P(k+1) \right) \right) \implies \forall n \ge n_0 : P(n)$$

Při aplikaci na grafy nepředstavuje induktivní proměnná $n$ pouhé číslo, ale **velikost grafové struktury**:
- **Počet vrcholů** $n = |V|$ (počet atomů v molekule, proteinů v síti), nebo
- **Počet hran** $m = |E|$ (počet vazeb, enzymatických reakcí).

---

## 2. 🚨 CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční Indukce `[MEGA EPIC]` `[PAST U ZKOUŠKY]`

Toto je vůbec **nejčastější důvod pro udělení 0 bodů** u zkouškových důkazů z AG1 na FIT ČVUT!

---

### ❌ Špatný postup (Tzv. Redukční / Konstrukční past):

> *"Předpokládejme, že tvrzení platí pro graf $G_n$ s $n$ vrcholy. Nyní sestrojíme nový graf $G_{n+1}$ tak, že k $G_n$ přidáme jeden nový vrchol $v$ a připojíme ho hranami k nějakým vrcholům..."*

#### 💥 Proč vyučující udělují 0 bodů?
Pokud začnete od grafu $G_n$ a **přidáte** nový prvek, dokázali jste tvrzení **POUZE pro ty grafy o $n+1$ vrcholech, které lze vytvořit tímto konkrétním přidáním**!
Neověřili jste, zda každý obecný graf s $n+1$ vrcholy lze z nějakého menšího grafu takto vybudovat. Opomněli jste celou třídu grafů! Váš důkaz platí pro speciálně vytvořené grafy, ne pro **všechny platné grafy**.

---

### ✅ Správný postup (Dekonstrukční Indukce / Indukce z Podgrafů):

> *"Vezměme **LIBOVOLNÝ ZADANÝ** graf $G = (V, E)$ o $n+1$ vrcholech (který splňuje předpoklady věty). Najdeme v něm vhodný prvek (např. list nebo vrchol minimálního stupně), odebereme ho a získáme podgraf $G'$. Podgraf $G'$ má $n$ vrcholů. Ověříme, že $G'$ stále splňuje předpoklady věty. Použijeme **Indukční předpoklad (IP)** na podgraf $G'$. Nakonec prvek vrátíme a dokážeme, že platnost tvrzení se přenese i na původní celkový $G$."*

```
Správný myšlenkový tok (Dekonstrukční Indukce na grafech):

┌──────────────────────────────────────────────────────────┐
│ LIBOVOLNÝ Graf G o velikosti (n+1)                       │ ◄─── ZAČÍNÁME ZDE!
└────────────────────────────┬─────────────────────────────┘     (Libovolný zadaný objekt)
                             │
                             │ 1. Odebereme prvek / list / hranu
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Podgraf G' o velikosti (n)                               │ ◄─── APLIKUJEME INDUKČNÍ
└────────────────────────────┬─────────────────────────────┘     PŘEDPOKLAD (IP)!
                             │
                             │ 2. Dle IP tvrzení na G' platí
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Vrátíme odebraný prvek a dokážeme platnost pro původní G │ ◄─── ZÁVĚR pro G(n+1)
└──────────────────────────────────────────────────────────┘
```

---

## 3. Handshaking Lemma (Lema o Podávání Rukou) `[Relevance: 95%]` `[EPIC]`

### 📜 Věta (Handshaking Lemma):
V každém konečném neorientovaném grafu $G = (V, E)$ platí:
$$\sum_{v \in V} \deg(v) = 2|E|$$

*(Součet stupňů všech vrcholů je vždy roven dvojnásobku počtu hran).*

#### 💡 Důsledek pro lichý stupeň:
V každém grafu je **počet vrcholů s lichým stupněm vždy sudé číslo**.

---

### ✍️ Způsob A: Důkaz Dvojím Započtením (Double Counting) `[INSIGHT]`

Vytvořme množinu incidencí $I = \{(v, e) \in V \times E \mid v \in e\}$.
- Pokud sčítáme podle **hran** $e \in E$: Každá neorientovaná hrana $e = \{u, v\}$ má právě 2 koncové vrcholy. Každá hrana přispěje do celkového počtu incidencí hodnotou $2$. Celkový součet je $2|E|$.
- Pokud sčítáme podle **vrcholů** $v \in V$: Vrchol $v$ je koncovým bodem právě $\deg(v)$ hran. Celkový součet přes všechny vrcholy je $\sum_{v \in V} \deg(v)$.

Jelikož obě metody počítají stejný počet prvků množiny $I$, součty se rovnají: $\sum_{v \in V} \deg(v) = 2|E|$. $\blacksquare$

---

### ✍️ Způsob B: Formální Důkaz Dekonstrukční Indukcí podle $m = |E|$ `[PAST U ZKOUŠKY]`

#### 1. Báze indukce ($m = 0$):
Nechť $G = (V, E)$ je graf bez hran ($|E| = 0$). Všechny vrcholy mají $\deg(v) = 0$.
$$\sum_{v \in V} \deg(v) = 0 = 2 \cdot 0$$
Báze pro $m = 0$ platí.

#### 2. Indukční předpoklad (IP):
Předpokládejme, že pro **libovolný** graf s $k$ hranami ($0 \le k \le m$) platí $\sum_{v \in V} \deg(v) = 2k$.

#### 3. Indukční krok ($m \to m + 1$):
Vezměme **LIBOVOLNÝ** graf $G = (V, E)$ s $m + 1$ hranami.
1. Zvolme libovolnou hranu $e = \{u, v\} \in E$.
2. Vytvořme podgraf $G' = (V, E \setminus \{e\})$ odebráním hrany $e$. Podgraf $G'$ má přesně $m$ hran.
3. Podle **IP** platí pro podgraf $G'$:
   $$\sum_{w \in V} \deg_{G'}(w) = 2m$$
4. Odebrání hrany $e = \{u, v\}$ snížilo pouze stupně koncových vrcholů $u$ a $v$ o 1:
   $$\deg_G(u) = \deg_{G'}(u) + 1, \quad \deg_G(v) = \deg_{G'}(v) + 1$$
   Stupně všech ostatních vrcholů $w \notin \{u, v\}$ zůstaly beze změny ($\deg_G(w) = \deg_{G'}(w)$).
5. Dosadíme do součtu stupňů původního grafu $G$:
   $$\sum_{w \in V} \deg_G(w) = \left(\sum_{w \in V} \deg_{G'}(w)\right) + 1 + 1 = 2m + 2 = 2(m + 1)$$

Tím je dekonstrukční důkaz dokončen. $\blacksquare$

---

## 4. Teorie Stromů & Ekvivalentní Definice `[Relevance: 100%]` `[MEGA EPIC]`

Stromy jsou vůben nejdůležitější grafovou strukturou v bioinformatice (fylogenetické stromy, rozhodovací stromy, kostry sítí).

> **Základní Definice Stromu:** Strom je souvislý neorientovaný graf bez cyklů.

---

### 4.1 5 Ekvivalentních Definic Stromu

Pro libovolný konečný neorientovaný graf $G = (V, E)$ s $n = |V|$ vrcholy jsou následující tvrzení **zcela ekvivalentní**:

1. $G$ je **strom** (je souvislý a nemá cykly).
2. $G$ je **acyklický** a má přesně $m = n - 1$ hran.
3. $G$ je **souvislý** a má přesně $m = n - 1$ hran.
4. Mezi každou dvojicí různých vrcholů $u, v \in V$ existuje **právě jedna jednoduchá cesta**.
5. $G$ je **minimální souvislý graf** (přidáním libovolné hrany vznikne cyklus, odebráním libovolné hrany se graf stane nesouvislým).

---

### 4.2 Tree Leaf Lemma (Lema o Existenci Listu v Keři)

> 🍃 **Věta (Tree Leaf Lemma):** Každý strom $T = (V, E)$ s $n \ge 2$ vrcholy obsahuje alespoň 2 **listy** (vrcholy stupně 1).

#### ✍️ Rigorózní 3-řádkový Důkaz Lemmatu přes Extremální Cestu `[INSIGHT]`:
1. Zvolme ve stromu $T$ **nejdelší jednoduchou cestu** $P = (v_0, v_1, \dots, v_k)$. Jelikož $n \ge 2$, cesta obsahuje alespoň 1 hranu ($k \ge 1$).
2. Uvažujme koncový vrchol $v_k$. Vrchol $v_k$ nemůže mít žádného souseda mimo cestu $P$ (jinak bychom cestu prodloužili, což je spor s maximalitou $P$).
3. Vrchol $v_k$ nemůže mít ani žádného souseda na cestě $P$ s výjimkou $v_{k-1}$ (jinak by v $T$ vznikl cyklus, což je spor s definicí stromu).
4. Proto jediným sousedem vrcholu $v_k$ je $v_{k-1}$, čímž $\deg(v_k) = 1$. Ze stejné logiky je i $v_0$ listem stupně 1. Strom $T$ obsahuje alespoň 2 listy. $\blacksquare$

---

### 4.3 Vzorový Důkaz: Počet Hran ve Stromu ($m = n - 1$)

### 📜 Věta:
Každý strom $T = (V, E)$ o $n \ge 1$ vrcholech má přesně $m = n - 1$ hran.

---

### ✍️ Rigorózní Důkaz Dekonstrukční Indukcí podle $n = |V|$ `[MEGA EPIC]`:

#### 1. Báze indukce ($n = 1$):
Strom s 1 vrcholem nemá žádné hrany ($m = 0$).
$$m = 0 = 1 - 1 = n - 1$$
Báze pro $n = 1$ platí.

#### 2. Indukční předpoklad (IP):
Předpokládejme, že **každý** strom s $k$ vrcholy (kde $1 \le k \le n$) má přesně $k - 1$ hran.

#### 3. Indukční krok ($n \to n + 1$):
Vezměme **LIBOVOLNÝ** strom $T = (V, E)$ s $n + 1$ vrcholy ($n + 1 \ge 2$).
*(Nezakládáme nový strom přidáváním vrcholu – dekonstruujeme zadaný strom $T$ s $n+1$ vrcholy!)*

1. Protože $T$ má $n + 1 \ge 2$ vrcholů, podle **Tree Leaf Lemmatu** obsahuje alespoň jeden list $v \in V$ s $\deg(v) = 1$.
2. Budiž $e = \{v, u\} \in E$ jediná hrana incidentní s listem $v$.
3. Vytvořme podgraf $T' = (V \setminus \{v\}, E \setminus \{e\})$, který vznikne odebráním listu $v$ a jeho hrany $e$.
4. **Ověření předpokladů pro IP na podgrafu $T'$:**
   - Podgraf $T'$ má přesně $(n+1) - 1 = n$ vrcholů.
   - Podgraf $T'$ je stále souvislý (odebráním listu stupně 1 nevznikne nespojitost).
   - Podgraf $T'$ nemá cykly (odebráním prvků nové cykly nevzniknou).
   - Tedy $T'$ je platný strom o $n$ vrcholech!
5. Aplikujeme **Indukční předpoklad (IP)** na $T'$:
   $$|E(T')| = n - 1$$
6. Původní strom $T$ měl o 1 hranu více než $T'$:
   $$|E(T)| = |E(T')| + 1 = (n - 1) + 1 = n = (n + 1) - 1$$

Dokázali jsme, že libovolný strom s $n+1$ vrcholy má přesně $(n+1) - 1$ hran. $\blacksquare$

---

---

## 5. Indukce na Orientovaných Akalických Grafech (DAGs) `[Relevance: 95%]` `[BIO-ANALOGIE]`

V bioinformatických aplikacích (metabolické dráhy glykolýzy, enzymatické reakční kaskády, gene regulatory networks) se neobcházíme bez **Orientovaných Acyklických Grafů (DAG - Directed Acyclic Graphs)**.

> **Lema o Existenci Zdroje v DAGu:** Každý konečný orientovaný acyklický graf $G = (V, E)$ s $|V| \ge 1$ obsahuje alespoň jeden **zdrojový uzel (source)** $u \in V$, pro který platí:
> $$\text{deg}^-(u) = 0$$
> *(Existuje uzel, do kterého nevstupuje žádná orientovaná hrana).*

---

### ✍️ Rigorózní Důkaz Lemmatu o Zdroji přes Extremální Orientovanou Cestu `[INSIGHT]`:
1. Zvolme v DAGu $G$ **nejdelší orientovanou jednoduchou cestu** $P = (v_0, v_1, \dots, v_k)$.
2. Uvažujme počáteční uzel $v_0$. Pokud by existovala orientovaná hrana $(w, v_0) \in E$, pak:
   - Pokud $w \notin P$, mohli bychom cestu $P$ prodloužit zlevo na $(w, v_0, \dots, v_k)$, což je SPOR s maximalitou $P$.
   - Pokud $w \in P$, hrana $(w, v_0)$ by společně s úsekem cesty vytvořila orientovaný cyklus, což je SPOR s tím, že $G$ je acyklický DAG!
3. Proto do $v_0$ nevstupuje žádná hrana $\implies \text{deg}^-(v_0) = 0$. Uzel $v_0$ je zdrojem. $\blacksquare$

---

### 📜 Věta (Existencie Topologického Uspořádání v DAGu):
Každý konečný orientovaný acyklický graf $G = (V, E)$ s $n = |V|$ vrcholy lze **topologicky uspořádat**, tj. jeho vrcholy lze seřadit do posloupnosti $(v_1, v_2, \dots, v_n)$ tak, že všechny orientované hrany vedou pouze zlevo doprava:
$$\forall (v_i, v_j) \in E \implies i < j$$

#### ✍️ Důkaz Dekonstrukční Indukcí podle $n = |V|$ `[MEGA EPIC]`:

1. **Báze ($n = 1$):** DAG s 1 vrcholem má triviální topologické uspořádání $(v_1)$. Báze platí.
2. **Indukční předpoklad (IP):** Předpokládejme, že každý DAG s $k \le n$ vrcholy lze topologicky uspořádat.
3. **Indukční krok ($n \to n + 1$):** Vezměme **LIBOVOLNÝ** DAG $G = (V, E)$ s $n + 1$ vrcholy.
   - Podle Lemmatu o zdroji obsahuje $G$ alespoň jeden uzel $u \in V$ s $\text{deg}^-(u) = 0$.
   - Odeberme uzel $u$ a všechny z něj vycházející hrany a získáme podgraf $G' = G \setminus \{u\}$.
   - Podgraf $G'$ má $n$ vrcholů a je stále platným DAGem (odebráním uzlu cykly nevzniknou).
   - Aplikujeme **IP** na podgraf $G'$: Vrcholy $G'$ lze topologicky uspořádat do posloupnosti $(v_1', v_2', \dots, v_n')$.
   - Jelikož $\text{deg}^-(u) = 0$ v původním $G$, do $u$ nevedly žádné hrany. Můžeme tedy uzel $u$ bezpečně předřadit na 1. místo celkového uspořádání:
     $$\text{Topologické Uspořádání } G = (u, v_1', v_2', \dots, v_n')$$
   - Všechny hrany vycházející z $u$ směřují doprava do $v_j'$. Podmínka $i < j$ drží. $\blacksquare$

---

## 🧪 Procvičovací Úlohy pro Bioinformatiky

### Úloha 2.1: 2-Obarvení Stromu (Bipartitnost Stromů)
Dokážete dekonstrukční indukcí podle počtu vrcholů $n = |V|$, že každý strom $T = (V, E)$ je **bipartitní** (jeho vrcholy lze obarvit 2 barvami tak, že žádné dva sousední vrcholy nemají stejnou barvu).

<details>
<summary>🔍 Zobrazit vzorový zkouškový důkaz</summary>

### ✍️ Řešení Dekonstrukční Indukcí:
1. **Báze ($n = 1$):** Strom s 1 vrcholem obarvíme 1 barvou. Tvrzení platí.
2. **IP:** Předpokládejme, že každý strom s $k$ vrcholy ($1 \le k \le n$) lze obarvit 2 barvami (Červená a Modrá).
3. **Indukční krok ($n \to n + 1$):** Vezměme **libovolný** strom $T$ s $n+1$ vrcholy.
   - Podle Tree Leaf Lemmatu má $T$ list $v \in V$ s $\deg(v) = 1$ a hranou $\{v, u\}$.
   - Odebereme list $v$ a získáme strom $T'$ o $n$ vrcholech.
   - Podle **IP** lze strom $T'$ obarvit 2 barvami. Nechť $u$ dostal např. Červenou barvu.
   - Navrátíme list $v$ a přiřadíme mu druhou barvu (Modrou).
   - Jediná nová hrana v $T$ je $\{v, u\}$, která spojuje Červený uzel $u$ a Modrý uzel $v$.
   - Strom $T$ o $n+1$ vrcholech je platně 2-obarven. $\blacksquare$
</details>

---

### Úloha 2.2: Počet Hran v Lese (Les s $c$ Komponentami)
Dokážte dekonstrukční indukcí podle počtu hran $m$, že každý neorientovaný acyklický graf (les) $G = (V, E)$ s $n = |V|$ vrcholy a $c$ komponentami souvislosti má přesně:
$$m = n - c \text{ hran}$$

<details>
<summary>🔍 Zobrazit vzorový zkouškový důkaz</summary>

### ✍️ Řešení Dekonstrukční Indukcí podle $m$:
1. **Báze ($m = 0$):** Graf bez hran má $n$ izolovaných vrcholů, tedy $c = n$ komponent. $m = 0 = n - n = n - c$. Báze platí.
2. **IP:** Předpokládejme, že pro les s $k < m$ hranami platí $k = n - c_k$.
3. **Indukční krok ($m$ hran):** Vezměme **libovolný** les $G$ s $m$ hranami a $c$ komponentami.
   - Zvolme libovolnou hranu $e = \{u, v\} \in E$.
   - Odeberme hranu $e$ a získáme les $G' = (V, E \setminus \{e\})$ s $m - 1$ hranami.
   - Protože $G$ neobsahoval cykly, hrana $e$ byla jediným spojením mezi $u$ a $v$. Jejím odebráním se komponenta rozpadla na 2 nové komponenty!
   - Počet komponent v $G'$ je tedy $c' = c + 1$.
   - Aplikujeme **IP** na $G'$: $|E(G')| = n - c' \implies m - 1 = n - (c + 1) = n - c - 1$.
   - Přičtením 1 k oběma stranám dostáváme $m = n - c$. Les má $n - c$ hran. $\blacksquare$
</details>

---

### Úloha 2.3: Existencie Výtokového Uzlu (Sink) v DAGu
Dokážete duální lema k Lemmatu o zdroji, že každý konečný DAG s $|V| \ge 1$ obsahuje alespoň jeden **výtokový uzel (sink)** $w \in V$, pro který platí:
$$\text{deg}^+(w) = 0$$

<details>
<summary>🔍 Zobrazit vzorové řešení přes extremální cestu</summary>

### ✍️ Řešení:
Zvolme v DAGu $G$ nejdelší orientovanou cestu $P = (v_0, v_1, \dots, v_k)$. Uvažujme koncový uzel $v_k$.
Pokud by existovala hrana $(v_k, z) \in E$, pak $z \notin P$ by prodloužilo cestu $P$ doprava (spor s maximalitou $P$) a $z \in P$ by vytvořilo orientovaný cyklus (spor s acykličností DAGu).
Tedy $\text{deg}^+(v_k) = 0$, uzel $v_k$ je výtokem (sink). $\blacksquare$
</details>

---

## 6. Přehled: Co víte o Stromech a Co přijde v AG1 `[Relevance: 80%]` `[INSIGHT]`

Z tohoto modulu byste teď měli bezpečně zvládat:

| Dovednost | Status |
| :--- | :---: |
| Dekonstrukční indukce podle $\|V\|$ a $\|E\|$ | ✅ Ovládáte |
| Důkaz Handshaking lemmatu (dvojí započtení + indukce) | ✅ Ovládáte |
| Lema o existenci listu (přes nejdelší cestu) | ✅ Ovládáte |
| Důkaz $m = n - 1$ pro stromy | ✅ Ovládáte |
| Indukce pro lesy ($m = n - c$) | ✅ Ovládáte |

### Co přijde v AG1 (budete mít k dispozici, nemusíte dokazovat od nuly):
- **5 ekvivalentních definic stromu** — V AG1 je dostanete jako hotové věty, budete je používat (ne dokazovat jejich ekvivalenci navzájem).
- **Existence kostry** — Plyne přímo z algoritmů (Kruskal, Prim), které AG1 prezentuje jako hotové.
- **Bipartitnost stromů** — Zajímavá vlastnost, ale v přípravném kurzu ji necháme stranou. Pozor — bipartitní grafy obecně jsou klíčové téma AG1 (viz modul Důkazy Sporem).

> [!TIP]
> **Letní příprava hotova!** Pokud zvládáte dekonstrukční indukci a výše uvedené důkazy, máte solidní základ pro první přednášku AG1. Stromy budou průběžným motivačním příkladem celého semestru.

---

> ➡️ **Pokračujte na další modul:** [6 · Modul 3: Důkazy Sporem & Extremální Princip](./dml-dukazy-sporem)

