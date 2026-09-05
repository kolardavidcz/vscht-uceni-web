# Modul 6: Zkouškový Workshop & Šablony Důkazů z AG1

> **[Relevance: 100%]** · **Tags:** `[MEGA EPIC]` `[PAST U ZKOUŠKY]` `[CHALLENGE]`
> **Cíl modulu:** Vybruslit ze všech nebezpečných úskalí u zkouškových písemek z předmětu **AG1 (Algoritmy a Grafy 1)** na FIT ČVUT. Osvojit si formální univerzální šablony důkazů a projít si rozsáhlý workshop plně vyřešených zkouškových příkladů s kompletním hodnoticím komentářem, bodovacím kritériem a analýzou nejčastějších chyb.

---

## 1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy? `[INSIGHT]`

Při opravování teoretických písemek z AG1 platí neúprosná kritéria:

```
┌─────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────┐
│ ❌ Co vás stane ztrátu bodů (až 0 bodů za příklad)      │ ✅ Co vám zajistí plný počet bodů (100 %)               │
├─────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Redukční past u indukce (začátek z G_n a přidání uzlu). │ Dekonstrukční indukce (začátek z LIBOVOLNÉHO G_{n+1}). │
│ Chybějící ověření Báze indukce pro nejmenší objekt.    │ Explicitně zapsaný a ověřený základní krok P(n_0).      │
│ Nejasně formulovaný předpoklad pro spor (chybí ¬B).     │ Přesně zapsaný předpoklad sporu: "Platí A a zároveň ¬B".│
│ Neoznačený rozpor u sporu (kde přesně vznikl spor).     │ Jasně označený rozpor (⚡ / SPOR) s konkrétním faktem.  │
│ U invariantu chybí jedna z 3 fází (např. Ukončení).    │ Všechny 3 fáze (Inicializace, Udržování, Ukončení).     │
└─────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 2. Kompletní Šablonový Manuál pro Písemné Důkazy `[Relevance: 100%]` `[MEGA EPIC]`

Před odevzdáním zkouškového testu zkontrolujte, že váš zápis odpovídá jedné z těchto šablon:

### 📝 Šablona 1: Dekonstrukční Indukce podle Počtu Vrcholů $n = |V|$

```text
================================================================================
DŮKAZ DEKONSTRUKČNÍ INDUKCÍ PODLE POČTU VRCHOLŮ n = |V|
================================================================================

1. BÁZE INDUKCE (n = n_0):
   - Uvažujme nejmenší přípustný graf G_0 o n_0 vrcholech.
   - Pro graf G_0 ověříme platnost dokazovaného tvrzení P(G_0): [Zapsat ověření].
   - Báze pro n = n_0 platí.

2. INDUKČNÍ PŘEDPOKLAD (IP):
   - Předpokládejme, že tvrzení platí pro VŠECHNY grafy z dané třídy o k vrcholech,
     kde n_0 <= k <= n.

3. INDUKČNÍ KROK (n -> n + 1):
   - Nechť G = (V, E) je LIBOVOLNÝ ZADANÝ graf o n + 1 vrcholech z dané třídy.
   - V grafu G zvolíme vhodný prvek v (např. list nebo uzel s deg(v) <= c).
   - Vytvoříme podgraf G' = G \ {v} odebráním vrcholu v a jeho incidentních hran.
   - Ověříme, že podgraf G' má n vrcholů a STÁLE SPLŇUJE všechny předpoklady věty.
   - Použijeme INDUKČNÍ PŘEDPOKLAD (IP) na podgraf G': [Dosadit vzorec dle IP pro G'].
   - Vrátíme odebraný prvek v a dokážeme, že platnost tvrzení se přenese na původní G:
     [Zapsat algebraické / logické spojení G' a v pro G].

Tím je důkaz indukcí dokončen. Q.E.D.
================================================================================
```

---

### 📝 Šablona 2: Důkaz Sporem ($A \land \neg B \implies \bot$)

```text
================================================================================
DŮKAZ SPOREM
================================================================================

1. PŘEDPOKLAD PRO SPOR:
   - "Předpokládejme pro spor, že platí předpoklad A a ZARÓVEŇ NEPLATÍ závěr B."
   - (Tj. předpokládáme platnost A a zároveň platnost ¬B).

2. LOGICKÉ ODVOZOVÁNÍ:
   - "Z platnosti ¬B plyne vlastnost X: [Vypsat X]."
   - "Z vlastnosti X a předpokladu A odvodíme vlastnost Y: [Vypsat Y]."

3. DOSAŽENÍ SPORU (⚡ / 💥 / ⊥):
   - "Vlastnost Y je však v přímém SPORU (⚡) s [Definicí Z / Předpokladem A / Dokázaným faktem]!"

4. ZÁVĚR:
   - "Náš předpoklad pro spor (A ∧ ¬B) byl tedy chybný."
   - "Proto původní tvrzení A => B platí." Q.E.D.
================================================================================
```

---

### 📝 Šablona 3: Správnost Algoritmu Pomocí Invariantu Cyklu

```text
================================================================================
DŮKAZ SPRÁVNOSTI ALGORITMU POMOCÍ INVARIANTU CYKLU
================================================================================

1. DEFINICE INVARIANTU:
   - Definujeme invariant I: [Zapsat přesnou vlastnost datových struktur v cyklu].

2. INICIALIZACE (Před prvním průchodem cyklu):
   - Dokážeme, že invariant I platí před 1. iterací (krok 0).
   - [Zapsat stav proměnných před cyklem a ověřit I].

3. UDRŽOVÁNÍ (Během kroku cyklu):
   - Předpokládáme, že invariant I platí před i-tou iterací.
   - Provedeme tělo cyklu v i-té iteraci.
   - Dokážeme, že po provedení kódu invariant I drží i po dokončení iterace.

4. UKONČENÍ (Po skončení cyklu):
   - Cyklus skončí na základě podmínky C.
   - Zkombinujeme invariant I platný po skončení cyklu s podmínkou C.
   - Ukážeme, že algoritmus vrátil přesně požadovaný výsledek. Q.E.D.
================================================================================
```

---

## 3. Workshop Plně Vyřešených Zkouškových Případů z AG1 `[Relevance: 100%]` `[PAST U ZKOUŠKY]`

---

### 🧪 Příklad 6.1: Rozklad Sudého Grafu na Cykly (Dekonstrukční Indukce)

> **Zadání:** Dokážeme dekonstrukční indukcí podle počtu hran $m = |E|$, že každý souvislý neorientovaný graf $G = (V, E)$, ve kterém má každý vrchol sudý stupeň ($\forall v \in V: \deg(v) \ge 2 \text{ je sudé}$), lze rozložit na hranově disjunktní cykly.

<details>
<summary>🔍 Zobrazit vzorové řešení, hodnocení a nejčastější chyby</summary>

#### ✍️ Formální Zkouškové Řešení:
1. **Báze indukce ($m = 3$):** Nejmenší souvislý graf se sudými stupni alespoň 2 je trojúhelník $K_3$ ($n=3, m=3$). Graf sám tvoří 1 cyklus, tvrzení platí.
2. **Indukční předpoklad (IP):** Předpokládejme, že každý graf s $k < m$ hranami plnící podmínky sudých stupňů lze rozložit na hranově disjunktní cykly.
3. **Indukční krok ($m$ hran):**
   - Vezměme **LIBOVOLNÝ** graf $G$ s $m$ hranami se sudými stupni.
   - Protože $\deg(v) \ge 2$ pro všechny vrcholy, $G$ obsahuje alespoň jeden jednoduchý cyklus $C$.
   - Odebereme z $G$ všechny hrany cyklu $C$ a získáme podgraf $G' = (V, E \setminus E(C))$.
   - Odebrání cyklu $C$ snížilo stupeň každého vrcholu cyklu přesně o 2. Tedy všechny vrcholy v $G'$ mají **stále sudý stupeň**.
   - Podgraf $G'$ má $m - |E(C)| < m$ hran.
   - Aplikujeme **IP** na jednotlivé komponenty souvislosti podgrafu $G'$. Podle IP lze $G'$ rozložit na hranově disjunktní cykly.
   - Přidáním cyklu $C$ zpět získáme kompletní rozklad původního grafu $G$ na hranově disjunktní cykly.

#### 📊 Rozbor Hodnocení (Rubrika):
- **100 % bodů:** Libovolný graf $G(m)$, dekonstrukce odebráním cyklu $C$, ověření sudosti stupňů v $G'$, správné použití IP.
- **-30 % bodů:** Zapomenutí ověřit, že podgraf $G'$ si zachoval sudé stupně po odebrání cyklu.
- **0 bodů:** Konstrukční past (začátek z menšího grafu a přidávání hran cyklu).
</details>

---

### 🧪 Příklad 6.2: Extremální Princip & Nejdélší Cesta (Důkaz Sporem)

> **Zadání:** Dokážeme sporem, že v každém konečném grafu $G = (V, E)$ s minimálním stupněm $\delta(G) \ge 2$ existuje jednoduchá cesta délky alespoň $\delta(G)$.

<details>
<summary>🔍 Zobrazit vzorové řešení, hodnocení a nejčastější chyby</summary>

#### ✍️ Formální Zkouškové Řešení:
1. **Konstrukce extremálního objektu:**
   Zvolme v grafu $G$ **nejdelší jednoduchou cestu** $P = (v_0, v_1, v_2, \dots, v_k)$ délky $k$ (počet hran je $k$).
2. **Analýza koncového vrcholu $v_k$:**
   Uvažujme sousedy koncového vrcholu $v_k$.
   - Nemůže mít žádného souseda $w \notin P$ mimo cestu $P$ (jinak bychom prodloužili cestu o $w$ na délku $k+1$, což je spor s maximalitou $P$).
   - Všichni sousedé vrcholu $v_k$ tedy musí ležet na cestě $P$!
3. **Ocenění délky cesty:**
   Jelikož $\deg(v_k) \ge \delta(G)$, vrchol $v_k$ má alespoň $\delta(G)$ sousedů na cestě $P$.
   Protože vrcholy cesty jsou $v_0, v_1, \dots, v_k$, nejvzdálenější soused $v_k$ musí být vzdálen alespoň $\delta(G)$ hran po cestě.
   Odtud délka cesty $k$ splňuje:
   $$k \ge \delta(G)$$
4. Tím je důkaz dokončen.

#### 📊 Rozbor Hodnocení (Rubrika):
- **100 % bodů:** Výběr nejdelší jednoduché cesty $P$, odvození, že všichni sousedé koncového vrcholu $v_k$ leží na $P$, algebraické srovnání s $\delta(G)$.
- **-40 % bodů:** Nezdůvodnění, proč $v_k$ nemůže mít souseda mimo cestu $P$.
</details>

---

### 🧪 Příklad 6.3: Unikátnost Minimální Kostry (Cut Property)

> **Zadání:** Dokážeme sporem, že pokud jsou všechny váhy hran v souvislém grafu $G = (V, E, w)$ navzájem **různé (unikátní)**, pak má graf $G$ **právě jednu (jednoznačnou) minimální kostru (MST)**.

<details>
<summary>🔍 Zobrazit vzorové řešení, hodnocení a nejčastější chyby</summary>

#### ✍️ Formální Zkouškové Řešení:
1. **Předpoklad pro spor:**
   Předpokládejme pro spor, že graf $G$ s unikátními vahami hran má **dvě různé minimální kostry** $T_1$ a $T_2$ ($T_1 \neq T_2$) se stejnou minimální celkovou vahou $w(T_1) = w(T_2)$.
2. **Krok 1 (Výběr nejlehčí rozdílné hrany):**
   Množina hran, ve kterých se kostry liší, je $E(T_1) \triangle E(T_2) \neq \emptyset$.
   Zvolme nejlehčí hranu $e = \{u, v\} \in E(T_1) \triangle E(T_2)$. Bez újmy na obecnosti nechť $e \in T_1$ a $e \notin T_2$.
3. **Krok 2 (Přidání $e$ do $T_2$):**
   Vytvořme cyklus $C$ přidáním hrany $e$ do $T_2$.
   Cyklus $C$ musí obsahovat alespoň jednu jinou hranu $e'$, která nepatří do $T_1$.
   Z volby $e$ jako **nejlehčí** rozdílné hrany plyne, že $w(e) < w(e')$.
4. **Krok 3 (Rekonstrukce kostry $T_2'$):**
   Vytvořme novou kostru $T_2' = (T_2 \cup \{e\}) \setminus \{e'\}$.
   Váha nové kostry je $w(T_2') = w(T_2) + w(e) - w(e') < w(T_2)$.
5. **💥 SPOR ($\bot$):**
   Našli jsme kostru $T_2'$ s váhou přísně menší než minimální kostra $T_2$! To je SPOR s minimalitou $T_2$.
6. Minimální kostra s unikátními vahami je tedy jedinečná.

#### 📊 Rozbor Hodnocení (Rubrika):
- **100 % bodů:** Správný výběr nejlehčí hranové symetrické diference $e \in T_1 \triangle T_2$, vložení do $T_2$, vznik cyklu a konstrukce $T_2'$, spor $w(T_2') < w(T_2)$.
- **-50 % bodů:** Náhodný výběr hrany bez požadavku na nejlehčí hranu diference.
</details>

---

### 🧪 Příklad 6.4: Počet Hran v Lese se $c$ Komponentami (Indukce podle $|E|$)

> **Zadání:** Dokážeme dekonstrukční indukcí podle počtu hran $m = |E|$, že každý neorientovaný acyklický graf (les) $G = (V, E)$ s $n = |V|$ vrcholy a $c$ komponentami souvislosti má přesně $m = n - c$ hran.

<details>
<summary>🔍 Zobrazit vzorové řešení, hodnocení a nejčastější chyby</summary>

#### ✍️ Formální Zkouškové Řešení:
1. **Báze indukce ($m = 0$):** Graf bez hran má $n$ izolovaných vrcholů, tedy $c = n$ komponent. Platí $m = 0 = n - n = n - c$. Báze pro $m = 0$ platí.
2. **Indukční předpoklad (IP):** Předpokládejme, že pro každý les s $k < m$ hranami platí vzorec $k = n - c_k$.
3. **Indukční krok ($m$ hran):**
   - Vezměme **LIBOVOLNÝ** les $G$ s $m$ hranami a $c$ komponentami.
   - Zvolme libovolnou hranu $e = \{u, v\} \in E$.
   - Odeberme hranu $e$ a získáme podgraf $G' = (V, E \setminus \{e\})$ s $m - 1$ hranami.
   - Protože $G$ neobsahuje cykly, hrana $e$ byla jediným spojením mezi $u$ a $v$. Jejím odebráním se komponenta rozpadla na 2 nové komponenty!
   - Počet komponent v $G'$ je tedy $c' = c + 1$.
   - Aplikujeme **IP** na podgraf $G'$:
     $$|E(G')| = n - c' \implies m - 1 = n - (c + 1) = n - c - 1$$
   - Přičtením 1 k oběma stranám rovnosti dostáváme:
     $$m = n - c$$
4. Les o $n$ vrcholech a $c$ komponentách má $n - c$ hran.

#### 📊 Rozbor Hodnocení (Rubrika):
- **100 % bodů:** Dekonstrukční odebrání hrany $e$, zdůvodnění změny počtu komponent $c' = c + 1$ díky acykličnosti, korektní algebra a IP.
- **-30 % bodů:** Opomenutí zdůvodnit, proč odebrání hrany v acyklickém grafu vŽDY zvýší počet komponent o 1.
</details>

---

### 🧪 Příklad 6.5: Bipartitnost a Liché Cykly (Důkaz Sporem)

> **Zadání:** Dokážeme sporem, že pokud graf $G = (V, E)$ obsahuje lichý cyklus $C_k$ (délky $k = 2r+1$), pak graf $G$ **není bipartitní**.

<details>
<summary>🔍 Zobrazit vzorové řešení, hodnocení a nejčastější chyby</summary>

#### ✍️ Formální Zkouškové Řešení:
1. **Předpoklad pro spor:** Předpokládejme pro spor, že graf $G$ obsahuje lichý cyklus $C = (v_1, v_2, \dots, v_k, v_1)$ a ZÁROVEŇ **je bipartitní** s rozložením $V = V_1 \cup V_2$.
2. **Krok 1 (Alternace množin):** Zařaďme $v_1 \in V_1$.
   - Protože hrana $\{v_1, v_2\} \in E$ spojuje $V_1$ s $V_2$, musí $v_2 \in V_2$.
   - Obecně $v_i \in V_1 \iff i \text{ je liché}$, a $v_i \in V_2 \iff i \text{ je sudé}$.
3. **Krok 2 (Poslední vrchol):** Jelikož $k$ je liché číslo, platí $v_k \in V_1$.
4. **💥 SPOR ($\bot$):** Cyklus uzavírá hrana $\{v_k, v_1\}$. Oba její koncové vrcholy $v_k \in V_1$ i $v_1 \in V_1$ leží ve stejné množině $V_1$! To je v přímém SPORU s definicí bipartitního grafu!
5. Bipartitní graf neobsahuje liché cykly.

#### 📊 Rozbor Hodnocení (Rubrika):
- **100 % bodů:** Přesný předpoklad sporu, dokázání alternace prvků cyklu, odvození konfliktu na uzavírací hraně $\{v_k, v_1\}$.
</details>

---

### 🧪 Příklad 6.6: Správnost BFS (Nemonotónnost Fronty a Vzdálenost)

> **Zadání:** Dokážeme invariantem cyklu, že ve FIFO frontě $Q = \langle v_1, v_2, \dots, v_r \rangle$ algoritmu BFS platí $d[v_r] \le d[v_1] + 1$.

<details>
<summary>🔍 Zobrazit vzorové řešení, hodnocení a nejčastější chyby</summary>

#### ✍️ Formální Zkouškové Řešení:
1. **Definice Invariantu:** V každé iteraci cyklu `while` platí ve frontě $Q$: $d[v_r] \le d[v_1] + 1$ a $d[v_1] \le d[v_2] \le \dots \le d[v_r]$.
2. **Inicializace:** Na začátku $Q = \langle s \rangle$. $d[s] = 0 \le 0 + 1$. Invariant platí.
3. **Udržování:** Předpokládejme, že invariant platí před vyjmutím $u = v_1$.
   - Vyjmutím $u$ z čela fronty zůstane posloupnost $\langle v_2, \dots, v_r \rangle$, která podmínku neporuší.
   - Procházíme sousedy $v$ vrcholu $u$ a vkládáme je s $d[v] = d[u] + 1$ na konec fronty.
   - Jelikož na čele původní fronty bylo $d[u]$ nebo $d[u]+1$, nově vkládané prvků na konec s hodnotou $d[u]+1$ zachovají maximální rozdíl 1 od nového čela. Invariant drží.
4. **Ukončení:** Po skončení cyklu jsou všechny vzdálenosti správně určeny.

#### 📊 Rozbor Hodnocení (Rubrika):
- **100 % bodů:** Všechny 3 fáze (Inicializace, Udržování, Ukončení), správný rozbor operací `push` a `pop`.
</details>

---

## 📋 Zkouškový Checklist pro Získání Plného Počtu Bodů

Před odevzdáním písemného testu z AG1 si projděte tento kontrolní seznam:

- [ ] **Negoval/a jsem správně kvantifikátory?** ($\forall \to \exists$ a znegovat vnitřní formuli).
- [ ] **Vyhnul/a jsem se redukční pasti u indukce?** (Začínám z libovolného $G_{n+1}$, odebírám prvek na $G'$, nekonstruuji přidáváním!).
- [ ] **Nezapomněl/a jsem ověřit Bázi indukce?** (Triviální případ $n=1$ nebo $m=0$).
- [ ] **Mám u sporu označený jasný rozpor $\bot$?** (Napsáno přesně, s čím je odvozený fakt v rozporu).
- [ ] **Mám u invariantů sepsané 3 fáze?** (Inicializace, Udržování, Ukončení).

---

> 🎯 **Gratulujeme! Dokončili jste kompletní letní 0-to-Hero přípravu pre-AG1!**
> Nyní máte veškerou matematickou jistotu i praktickou výbavu pro zvládnutí předmětu AG1 na FIT ČVUT! 🚀
