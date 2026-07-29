# Modul 5: Konstruktivní Důkazy & Bio-Algoritmy (DNA & MST)

> **[Relevance: 95%]** · **Tags:** `[EPIC]` `[BIO-ANALOGIE]` `[INSIGHT]`
> **Cíl modulu:** Pochopit princip **konstruktivního důkazu existence** (důkaz předložením konkrétního funkčního algoritmu) a aplikovat ho na dvě stěžejní témata algoritmiky: Hierholzerův algoritmus pro Eulerovské tahy (poskládání genomu DNA přes de Bruijn grafy) a Vlastnost Řezu (Cut Property) spolu s Vlastností Cyklu (Cycle Property) u Minimálních Koster Grafu (Kruskalův a Primův algoritmus).

---

## 1. Konstruktivní vs. Nekonstruktivní Důkazy `[INSIGHT]`

V teoretické matematice se často potkáte s **nekonstruktivními důkazy existence**:
> Nekonstruktivní důkaz prokáže, že požadovaný objekt **musí existovat** (např. sporem vyvrátí jeho neexistenci), ale neposkytne žádný návod, jak tento objekt najít nebo sestrojit.

V **teoretické informatice, teorii grafů a bioinformatice** preferujeme **Konstruktivní Důkazy**:
> **Princip Konstruktivního Důkazu:** Prokazujeme existenci matematického objektu tím, že **předložíme explicitní algoritmus (konstrukční postup)**, který pro každý platný vstupní graf tento objekt v konečném počtu kroků bezchybně sestrojí.

---

## 2. Hierholzerův Algoritmus & Asemble DNA Sekvencí `[Relevance: 95%]` `[BIO-ANALOGIE]`

### 📜 Věta (Eulerovský Tah):
- **Uzavřený Eulerovský tah** v grafu $G = (V, E)$ je posloupnost vrcholů a hran $(v_0, e_1, v_1, \dots, e_m, v_0)$, která projde **každou hranu grafu právě jednou** a navrátí se do počátečního vrcholu.
- **Eulerovská Věta:** Souvislý neorientovaný graf $G$ obsahuje uzavřený Eulerovský tah **právě tehdy, když** má každý jeho vrchol sudý stupeň:
  $$\forall v \in V: \deg(v) \text{ je sudé}$$
- **Pro orientovaný graf:** Orientovaný graf obsahuje uzavřený Eulerův tah právě tehdy, když je slabě souvislý a pro každý vrchol platí rovnost vstupního a výstupního stupně:
  $$\forall v \in V: \text{deg}^-(v) = \text{deg}^+(v)$$

---

### 🧬 Bioinformatická Aplikace: Skládání Genomu DNA přes de Bruijn Grafy

Při čtení genomu v sekvenátoru (Illumina, MGI) rozstříháme dlouhou DNA na miliony krátkých $k$-merů. Jak tyto střípky poskládat zpět do kompletní genomové sekvence?

1. Vytvoříme **de Bruijn graf**, kde vrcholy reprezentují $(k-1)$-mery a orientované hrany reprezentují přečtené $k$-mery.
2. Jelikož každá hrana ($k$-mer) pochází z původního chromozomu, původní genom představuje **souvislou cestu procházející každou hranu grafu právě jednou**.
3. Skládání genomu tedy odpovídá **nalezení Eulerovského tahu v de Bruijnův grafu**!

---

### ✍️ Krok za Krokem: Příklad Sestavení DNA Sekvence ($k = 3$)

Mějme sadu přečtených 3-merů získaných ze sekvenátoru:
$$\text{Reads (3-mery)} = \{\text{ATG}, \text{TGC}, \text{GCA}, \text{CAT}, \text{ATG}, \text{TGC}, \text{GCG}, \text{CGA}\}$$

#### Krok 1: Sestavení Vrcholů a Hran de Bruijn Grafu
- **Vrcholy $V$ ((k-1)-mery = 2-mery):** `AT`, `TG`, `GC`, `CA`, `CG`
- **Orientované hrany $E$ (3-mery):**
  1. $\text{ATG}: \text{AT} \to \text{TG}$
  2. $\text{TGC}: \text{TG} \to \text{GC}$
  3. $\text{GCA}: \text{GC} \to \text{CA}$
  4. $\text{CAT}: \text{CA} \to \text{AT}$
  5. $\text{ATG}: \text{AT} \to \text{TG}$ (druhá kopie hrany)
  6. $\text{TGC}: \text{TG} \to \text{GC}$ (druhá kopie hrany)
  7. $\text{GCG}: \text{GC} \to \text{CG}$
  8. $\text{CGA}: \text{CG} \to \text{AT}$

```
                     de Bruijn Graf Genomu:
                     
               ┌─────────────────────────────────┐
               │                                 │ (2x ATG)
               ▼                                 │
             [AT] ════════════ (2x ATG) ═══════► [TG]
               ▲                                 │
               │                                 │ (2x TGC)
           (CGA)                                 ▼
               │                                [GC]
               │                                │  │
             [CG] ◄────────── (GCG) ────────────┘  │ (GCA)
               ▲                                   │
               │                                   ▼
               └───────────── (CAT) ───────────── [CA]
```

#### Krok 2: Kontrola Stupňů Vrcholů ($\text{deg}^-(v) = \text{deg}^+(v)$)
- $\text{AT}: \text{deg}^- = 2$ (od CGA, CAT), $\text{deg}^+ = 2$ (2x ATG). $\checkmark$
- $\text{TG}: \text{deg}^- = 2$ (2x ATG), $\text{deg}^+ = 2$ (2x TGC). $\checkmark$
- $\text{GC}: \text{deg}^- = 2$ (2x TGC), $\text{deg}^+ = 2$ (GCA, GCG). $\checkmark$
- $\text{CA}: \text{deg}^- = 1$ (GCA), $\text{deg}^+ = 1$ (CAT). $\checkmark$
- $\text{CG}: \text{deg}^- = 1$ (GCG), $\text{deg}^+ = 1$ (CGA). $\checkmark$

Všechny vrcholy mají rovnou vstupní a výstupní stupňovou bilanci. Graf je Eulerovský!

---

#### Krok 3: Běh Hierholzerova Algoritmu

1. **První Cyklus $C_1$:** Vyjdeme z uzlu `AT`.
   - $\text{AT} \xrightarrow{\text{ATG}} \text{TG} \xrightarrow{\text{TGC}} \text{GC} \xrightarrow{\text{GCA}} \text{CA} \xrightarrow{\text{CAT}} \text{AT}$
   - Cyklus $C_1 = (\text{AT}, \text{TG}, \text{GC}, \text{CA}, \text{AT})$.
   - Použité hrany v $C_1$: $\{\text{ATG}_1, \text{TGC}_1, \text{GCA}, \text{CAT}\}$.

2. **Detekce Nepoužitých Hran:** Uzel `GC` v cyklu $C_1$ má ještě nepoužitou hranu $\text{GCG} (\text{GC} \to \text{CG})$.

3. **Druhý Cyklus $C_2$:** Vyjdeme z uzlu `GC`.
   - $\text{GC} \xrightarrow{\text{GCG}} \text{CG} \xrightarrow{\text{CGA}} \text{AT} \xrightarrow{\text{ATG}} \text{TG} \xrightarrow{\text{TGC}} \text{GC}$
   - Cyklus $C_2 = (\text{GC}, \text{CG}, \text{AT}, \text{TG}, \text{GC})$.
   - Použité hrany v $C_2$: $\{\text{GCG}, \text{CGA}, \text{ATG}_2, \text{TGC}_2\}$.

4. **Napojení $C_2$ do $C_1$ v bodě `GC`:**
   - Náhradou uzlu `GC` v $C_1$ za celý cyklus $C_2$ získáme kompletní Eulerův tah:
   $$\text{Tah} = \text{AT} \xrightarrow{\text{ATG}} \text{TG} \xrightarrow{\text{TGC}} \mathbf{\text{GC} \xrightarrow{\text{GCG}} \text{CG} \xrightarrow{\text{CGA}} \text{AT} \xrightarrow{\text{ATG}} \text{TG} \xrightarrow{\text{TGC}} \text{GC}} \xrightarrow{\text{GCA}} \text{CA} \xrightarrow{\text{CAT}} \text{AT}$$

5. **Rekonstruovaná DNA Sekvence Genomu:**
   - Složením překrývajících se $k$-merů získáváme rekonstruovanou sekvenci genomu:
   $$\text{Genom} = \mathbf{\text{ATGCGATGCAT}}$$

---

## 3. Minimální Kostra Grafu (MST) & Dvě Stěžejní Vlastnosti `[Relevance: 95%]` `[MEGA EPIC]`

Mějme souvislý ohodnocený graf $G = (V, E, w)$ s kladnými vahami hran $w(e) > 0$.
**Kostra grafu (Spanning Tree)** je podgraf $T = (V, E')$, který je stromem a obsahuje všechny vrcholy $V$.
**Minimální kostra (MST - Minimum Spanning Tree)** je kostra s minimálním součtem vah hran: $w(T) = \sum_{e \in E'} w(e)$.

Algoritmy pro hledání MST (Kruskalův a Primův/Jarníkův) spoléhají na dvě duální věty: **Vlastnost Řezu (Cut Property)** a **Vlastnost Cyklu (Cycle Property)**.

---

### 3.1 Cut Property (Vlastnost Řezu)

Nechť $S \subset V$ je libovolná neprázdná vlastní podmnožina vrcholů ($S \neq \emptyset, S \neq V$). Množinu hran spojujících $S$ a $V \setminus S$ nazýváme **řezem $(S, V \setminus S)$**.

> **Vlastnost Řezu (Cut Property):** Pokud je hrana $e = \{u, v\}$ **nejlehčí hranou (hrana s unikátně nejmenší vahou) protínající řez** $(S, V \setminus S)$, pak tato hrana **musí patřit do každé minimální kostry (MST)** grafu $G$.

```
           Množina S                 Množina V \ S
     ┌──────────────────┐       ┌──────────────────┐
     │   (u1)    (u2)   │       │   (v1)    (v2)   │
     │      \    /      │       │      \    /      │
     │       ( u ) ─────┼───────┼───── ( v )      │
     └──────────────────┘   e   └──────────────────┘
                         (Nejlehčí hrana řezu!)
```

#### ✍️ Důkaz Sporem přes Přebudování Kostry (Edge Exchange Argument) `[PAST U ZKOUŠKY]`:

1. **Předpoklad pro spor:**
   Nechť $e = \{u, v\}$ je nejlehčí hrana řezu $(S, V \setminus S)$. Předpokládejme pro spor, že existuje minimální kostra $T$, která hranu $e$ **neobsahuje** ($e \notin T$).
2. **Krok 1 (Vznik cyklu):**
   Protože $T$ je kostra (souvislý graf obsahující všechny vrcholy), musí v $T$ existovat jediná cesta $P$ spojující vrchol $u \in S$ a $v \in V \setminus S$.
   Pokud k $T$ přidáme hranu $e$, vznikne v grafu $T \cup \{e\}$ právě **jeden cyklus** $C$.
3. **Krok 2 (Nalezení jiné hrany řezu):**
   Cesta $P$ vychází z $S$ a končí v $V \setminus S$. Proto musí cesta $P$ obsahovat alespoň jednu další hranu $e' = \{u', v'\}$, která také protíná řez $(S, V \setminus S)$.
4. **Krok 3 (Konstrukce nového stromu $T'$):**
   Odeberme z $T \cup \{e\}$ hranu $e'$ a získejme novou kostru:
   $$T' = (T \cup \{e\}) \setminus \{e'\}$$
   Graf $T'$ je opět platnou kostrou grafu $G$.
5. **Krok 4 (Porovnání vah koster):**
   Váha nové kostry $T'$ je dána vztahem:
   $$w(T') = w(T) + w(e) - w(e')$$
   Protože hrana $e$ byla zvolena jako **nejlehčí hrana řezu**, platí $w(e) < w(e')$, ze čehož plyne:
   $$w(T') < w(T)$$
6. **💥 SPOR ($\bot$):**
   Našli jsme kostru $T'$ s **přísně menší celkovou vahou** než měla kostra $T$. To je v přímém **SPORU** s předpokladem, že $T$ byla minimální kostra (MST)!
7. **Závěr:**
   Každá minimální kostra (MST) musí obsahovat nejlehčí hranu každého řezu. $\blacksquare$

---

### 3.2 Cycle Property (Vlastnost Cyklu)

Duálním protějškem k vlastnosti řezu je vlastnost cyklu, která nám říká, které hrany **určitě do MST nepatří**:

> **Vlastnost Cyklu (Cycle Property):** Nechť $C$ je libovolný cyklus v ohodnoceném grafu $G = (V, E, w)$. Pokud je hrana $e \in C$ **striktně nejťažší hranou v tomto cyklu** (má unikátně největší váhu v $C$), pak hrana $e$ **NEMŮŽE patřit do žádné minimální kostry (MST)** grafu $G$.

```
                 (u) ─────── 2 ─────── (v)
                  │                     │
                  │                     │
                  8 (Nejťažší hrana!)   3
                  │                     │
                  │                     │
                 (x) ─────── 4 ─────── (y)
                 
         Cyklus C = (u, v, y, x, u). Hrana {u, x} má váhu 8 > 2, 3, 4.
         Hrana {u, x} NEMŮŽE patřit do žádné minimální kostry (MST)!
```

#### ✍️ Důkaz Sporem přes Přebudování Kostry `[PAST U ZKOUŠKY]`:

1. **Předpoklad pro spor:**
   Nechť $e = \{u, x\}$ je nejťažší hrana v cyklu $C$. Předpokládejme pro spor, že hrana $e$ **patří do minimální kostry $T$** ($e \in T$).
2. **Krok 1 (Rozpad kostry na 2 komponenty):**
   Odebráním hrany $e$ z kostry $T$ se strom rozpadne na právě dvě souvislé komponenty s množinami vrcholů $S$ a $V \setminus S$. Hrana $e = \{u, x\}$ tvořila most v $T$ spojující $S$ a $V \setminus S$.
3. **Krok 2 (Alternativní spojení přes cyklus $C$):**
   Jelikož hrana $e$ byla součástí cyklu $C$, v cyklu $C$ musí existovat alespoň jedna další hrana $e' = \{v, y\} \neq e$, která také spojuje komponentu $S$ a $V \setminus S$.
4. **Krok 3 (Konstrukce levnější kostry $T''$):**
   Nahraďme hranu $e$ hranou $e'$ a vytvořme novou kostru:
   $$T'' = (T \setminus \{e\}) \cup \{e'\}$$
   Graf $T''$ je opět platnou souvislou kostrou grafu $G$.
5. **Krok 4 (Porovnání vah koster):**
   Jelikož hrana $e$ byla **nejťažší hranou v cyklu $C$**, platí $w(e') < w(e)$.
   Váha nové kostry je:
   $$w(T'') = w(T) - w(e) + w(e') < w(T)$$
6. **💥 SPOR ($\bot$):**
   Našli jsme kostru $T''$ s **přísně menší celkovou vahou** než měla kostra $T$. To je SPOR s minimalitou $T$!
7. **Závěr:**
   Nejťažší hrana libovolného cyklu nemůže patřit do žádné minimální kostry (MST). $\blacksquare$

---

### 3.3 Jak Cut Property a Cycle Property Dokazují Korektnost Algoritmů

- **Kruskalův Algoritmus:**
  Sortuje hrany vzostupně podle váhy. Postupně přidává hranu do koster, pokud nevznikne cyklus.
  - *Zdůvodnění:* Přidávaná hrana je vždy nejlehčí hranou protínající řez mezi vznikajícími komponentami $\implies$ **Cut Property** garantuje správnost!
- **Primův (Jarníkův) Algoritmus:**
  Roste z jednoho uzlu a v každém kroku přidá nejlehčí hranu vycházející ze současné množiny vrcholů $S$.
  - *Zdůvodnění:* Přidávaná hrana je nejlehčí hranou řezu $(S, V \setminus S) \implies$ **Cut Property** garantuje správnost!

---

## 🧪 Procvičovací Úlohy pro Bioinformatiky

---

### Úloha 5.2: Semi-Eulerovský Tah v Orientovaném Grafu pro Lineární DNA Reads

Při sekvenování ne-cyklické (lineární) molekuly DNA neobdržíme uzavřený Eulerovský cyklus, ale **neuzavřený (Semi-Eulerovský) tah**, který začíná na počátku chromozomu a končí v jeho závěru.

Dokážeme větu:
> **Věta:** Slabě souvislý orientovaný graf $G = (V, E)$ obsahuje otevřený (neuzavřený) Eulerovský tah z vrcholu $s$ do vrcholu $t$ ($s \neq t$) **právě tehdy, když**:
> 1. Pro počáteční uzel $s$ platí: $\text{deg}^+(s) - \text{deg}^-(s) = 1$.
> 2. Pro koncový uzel $t$ platí: $\text{deg}^-(t) - \text{deg}^+(t) = 1$.
> 3. Pro všechny ostatní vrcholy $v \in V \setminus \{s, t\}$ platí stupňová bilance: $\text{deg}^+(v) = \text{deg}^-(v)$.

<details>
<summary>🔍 Zobrazit vzorové řešení (Konstruktivní převod na Hierholzerův algoritmus)</summary>

### ✍️ Řešení Konstruktivním Převodem:

1. **Konstrukce pomocné hrany:**
   Přidejme do orientovaného grafu $G = (V, E)$ jednu novou virtuální hranu $e_{virt} = (t, s)$ vedoucí z koncového uzlu $t$ zpět do počátečního uzlu $s$. Vznikne nový graf $G^* = (V, E \cup \{e_{virt}\})$.

2. **Kontrola stupňů v $G^*$:**
   - Pro uzel $s$: Přidáním vstupní hrany $e_{virt}$ vzrostl $\text{deg}^-(s)$ o 1, čímž nastala rovnost $\text{deg}^+(s) = \text{deg}^-(s)$.
   - Pro uzel $t$: Přidáním výstupní hrany $e_{virt}$ vzrostl $\text{deg}^+(t)$ o 1, čímž nastala rovnost $\text{deg}^+(t) = \text{deg}^-(t)$.
   - Všechny ostatní uzly si zachovaly $\text{deg}^+(v) = \text{deg}^-(v)$.

3. **Aplikace Hierholzerova Algoritmu na $G^*$:**
   V grafu $G^*$ platí pro všechny vrcholy $\text{deg}^+(v) = \text{deg}^-(v)$. Podle Eulerovy věty existuje v $G^*$ uzavřený Eulerův tah $C^*$.

4. **Odstranění virtuální hrany $e_{virt}$:**
   Odebráním hrany $e_{virt} = (t, s)$ z cyklu $C^*$ se uzavřená smyčka rozpojí v bodě $t \to s$.
   Získáme platný **otevřený (Semi-Eulerovský) tah**, který začíná v uzlu $s$, projde každou hranu původního grafu $G$ právě jednou a skončí v uzlu $t$. $\blacksquare$
</details>

---

> ➡️ **Pokračujte na závěrečný zkouškový workshop:** [6 · Zkouškový Workshop & Šablony Důkazů z AG1](./dml-zkouskovy-workshop)

