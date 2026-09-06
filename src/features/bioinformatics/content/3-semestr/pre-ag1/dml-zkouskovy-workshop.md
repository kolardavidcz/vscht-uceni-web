# Zkouškový Workshop & Šablony Důkazů z AG1

> **Cíl kapitoly:** Vybruslit ze všech nebezpečných úskalí u zkouškových písemek z předmětu **AG1 (Algoritmy a Grafy 1)** na FIT ČVUT. Osvojit si formální univerzální šablony důkazů a projít si rozsáhlý workshop plně vyřešených zkouškových příkladů s kompletním hodnoticím komentářem, bodovacím kritériem a analýzou nejčastějších chyb.

---

## 1. Jak Vyučující na FIT ČVUT Opravují Zkouškové Důkazy?

Při opravování teoretických písemek z AG1 platí neúprosná kritéria:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div class="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/40">
    <div class="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 text-sm mb-3">
      <span class="inline-icon-cross"></span> Co vás bude stát body (až 0 b za příklad)
    </div>
    <ul class="space-y-2 text-xs text-stone-700 dark:text-stone-300">
      <li class="flex items-start gap-2">
        <span class="text-rose-500 font-bold shrink-0">•</span>
        <span><strong>Redukční past u indukce:</strong> začátek z $G_n$ a přidání uzlu místo dekonstrukce z $G_{n+1}$.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-rose-500 font-bold shrink-0">•</span>
        <span><strong>Chybějící ověření báze:</strong> opomenutí nejmenšího objektu $P(n_0)$.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-rose-500 font-bold shrink-0">•</span>
        <span><strong>Nejasný předpoklad sporu:</strong> chybí explicitní negace závěru $\neg B$.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-rose-500 font-bold shrink-0">•</span>
        <span><strong>Neoznačený rozpor:</strong> neuvedení přesného místa a faktu, kde spor nastal.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-rose-500 font-bold shrink-0">•</span>
        <span><strong>Neúplný invariant:</strong> chybí jedna ze 3 fází (např. ukončení).</span>
      </li>
    </ul>
  </div>

  <div class="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/40">
    <div class="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-3">
      <span class="inline-icon-check"></span> Co vám zajistí plný počet bodů (100 %)
    </div>
    <ul class="space-y-2 text-xs text-stone-700 dark:text-stone-300">
      <li class="flex items-start gap-2">
        <span class="text-emerald-500 font-bold shrink-0">•</span>
        <span><strong>Dekonstrukční indukce:</strong> začátek z <em>libovolného</em> $G_{n+1}$ a redukce na $G_n$.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-emerald-500 font-bold shrink-0">•</span>
        <span><strong>Explicitní báze:</strong> přesně zapsaný a ověřený základní krok $P(n_0)$.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-emerald-500 font-bold shrink-0">•</span>
        <span><strong>Přesný předpoklad sporu:</strong> zapsáno „Platí $A$ a zároveň $\neg B$“.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-emerald-500 font-bold shrink-0">•</span>
        <span><strong>Jasný rozpor:</strong> jednoznačně označený rozpor ($⚡$ / SPOR) s konkrétní větou.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-emerald-500 font-bold shrink-0">•</span>
        <span><strong>Kompletní invariant:</strong> všechny 3 fáze (inicializace, udržování, ukončení).</span>
      </li>
    </ul>
  </div>
</div>

---

## 2. Kompletní Šablonový Manuál pro Písemné Důkazy

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

## 3. Workshop Plně Vyřešených Zkouškových Případů z AG1

---

### 🧪 Příklad 4.1: Rozklad Sudého Grafu na Cykly (Dekonstrukční Indukce)

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

### 🧪 Příklad 4.2: Extremální Princip & Nejdélší Cesta (Důkaz Sporem)

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

### 🧪 Příklad 4.3: Unikátnost Minimální Kostry (Cut Property)

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

### 🧪 Příklad 4.4: Počet Hran v Lese se $c$ Komponentami (Indukce podle $|E|$)

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

### 🧪 Příklad 4.5: Bipartitnost a Liché Cykly (Důkaz Sporem)

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

### 🧪 Příklad 4.6: Správnost BFS (Nemonotónnost Fronty a Vzdálenost)

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

---

> 🎯 **Gratulujeme! Dokončili jste teoretickou a důkazovou část kurzu pre-AG1!**
> Nyní máte veškerou matematickou jistotu pro zvládnutí předmětu AG1 na FIT ČVUT! 🚀
>
> 💻 **Závěrečná praktická prověrka v C++:**
> Vyzkoušejte si implementaci stromové rekurze, DFS, BFS i Dijkstry na reálných úlohách:
> 👉 **[9 · C++ Trénink: Rekurze, BFS, DFS & Dijkstra (rekurze_bro.cpp) →](/obor-bioinformatika/3-semestr/pre-ag1/rekurze-bro)**


