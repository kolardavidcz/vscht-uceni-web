# ☀️ Letní průvodce grafovou matematikou pro bioinformatiky

> **Pro koho?** Studenti Bioinformatiky na VŠCHT, kteří v září nastupují do 3. semestru a čeká je AG1 na FIT ČVUT.
> **Vibe?** Žádné tlusté skripta, žádný stres. Letní četba u kafe — jako kdyby ti to starší spolužák vysvětloval u oběda.

---

### 📺 Úvodní výukové video
<iframe src="https://www.youtube.com/embed/Rr_I0tdgubY?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

## 👋 Hele, tohle není strašidelný kurz

Spousta bioinformatiků slyší „diskrétní matematika a důkazy" a dostane špatný pocit z gymplu. Nemusíš. Tohle je **přípravný letní materiál** — přečteš ho pohodlně za pár dní a do září budeš mít jasno v tom, co AG1 po tobě vůbec chce.

Co konkrétně se naučíš? Jednoduše řečeno:
- Jak číst a psát matematická tvrzení o grafech (aniž by to bylo strašidelné)
- Jak dokázat, že algoritmus funguje správně (stačí 3 kroky, fakt)
- Jak myslet jako matematik, když řešíš strukturální problémy — a to ti pomůže i v bioinformatice

**Co tady NENÍ:** žádné integrály, žádné matice, žádná pravděpodobnost. Jen logika, grafy a pár hezkých triků na důkazy.

> [!TIP]
> Studenti FIT prošli celým předmětem *BI-DML* (Diskrétní matematika) a mají předměty, které používají a vyžadují důkazové myšlení. Ty máš tento kurz — komprimovanou verzi toho nejdůležitějšího, co potřebuješ pro AG1. Zní to dobře? Začínáme.

---

## 🧠 Jak Vlastně Přemýšlet o Důkazech a Algoritmech?

Vítej na nejdůležitější odbočce celé letní přípravy. Zde si ukážeme, proč se na vysoké škole důkazy vůbec dělají, jaký je rozdíl mezi **znalostmi** a **postupem** a jak lidé ve skutečnosti přicházejí na nové matematické i algoritmické objevy.

---

### 1. Důkazy: Proč vlastně existují a jak vznikají?

> [!NOTE]
> **Důkazy nevznikly kvůli velké lásce k abstraktním matematickým výrazům.**

Matematický formalismus není samoúčelná šikana studentů. Důkaz vznikl z ryze praktické potřeby: **mít 100% jistotu a záruku**, že náš předpoklad nebo algoritmus funguje za všech myslitelných okolností (a neselže na neočekávané biologické sekvenci uprostřed noci v produkci).

V praxi se v literatuře a na přednáškách setkáte se **dvěma zásadními typy důkazů**:
1. **Důkaz, který vám pomůže zjistit, jakým postupem se autor dostal k výsledku:**
   - Je konstruktivní, ilustrativní, intuitivní a transparentní.
   - Ukazuje myšlenkovou cestu: od prvotní motivace přes jednoduché příklady až po obecný princip.
   - V informatice tento typ důkazu často **přímo generuje samotný algoritmus**.
2. **Důkaz, který to pouze dokazuje (a zkracuje všechno, co může):**
   - Bývá extrémně úsporný, formálně neprůstřelný a elegantní na papíře.
   - Má však jednu zásadní nevýhodu: **zametá pod koberec původní lidskou intuici**. Všechny slepé uličky, pokusy a náčrtky autor zahodil a čtenáři předloží hotový trik, který jako by „spadl z nebe“.
   - Nenechte se tímto druhým typem odradit — nikdo takto matematiku ve skutečnosti nevymýšlí!

#### 💡 Jak lidé ve skutečnosti poznávají a objevují nové věci?
Když lidé (včetně matematiků a informatiků) přijdou na něco nového:
- **Rozhodně to není tím, že by seděli doma a z hlavy si psali formální písmenka na papír.** *(Tohle neplatí snad jedině v případě, že jste teoretický fyzik! 😉)*
- Skutečné objevování probíhá přesně naopak:
  1. **Něco si zkoušíte:** vezmete si tužku a papír, testujete triviální případy ($n = 1, 2, 3$).
  2. **Kreslíte a experimentujete:** načrtnete si pár grafů, tabulek nebo struktur.
  3. **Hledáte invarianty a vlastnosti:** všimnete si, že „aha, tady to vždycky vyjde sudé“ nebo „tudy cesta vždycky projde“.
  4. **Teprve na konci sepíšete formální důkaz:** Důkaz je až finální obal, kterým svoji vypozorovanou intuici obhájíte před světem.

---

### 2. Znalosti: „Dokažte, že toto je kružnice!“

Podívejte se na následující geometrický útvar v kartézské soustavě souřadnic:

<div class="my-4 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
  <svg viewBox="0 0 320 220" class="w-72 max-w-full h-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="axis-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
      </marker>
    </defs>
    <!-- Axes -->
    <line x1="20" y1="180" x2="290" y2="180" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#axis-arrow)" />
    <text x="295" y="184" fill="#64748b" font-size="12" font-family="sans-serif">x</text>
    <line x1="50" y1="200" x2="50" y2="20" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#axis-arrow)" />
    <text x="46" y="15" fill="#64748b" font-size="12" font-family="sans-serif">y</text>
    
    <!-- Circle -->
    <circle cx="160" cy="100" r="60" fill="rgba(59, 130, 246, 0.08)" stroke="#2563eb" stroke-width="2.5" />
    
    <!-- Center S[m, n] -->
    <circle cx="160" cy="100" r="4.5" fill="#ef4444" />
    <text x="145" y="118" fill="#ef4444" font-size="12" font-weight="bold" font-family="sans-serif">S[m, n]</text>
    
    <!-- Radius line to boundary point X[x, y] -->
    <line x1="160" y1="100" x2="202" y2="58" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3" />
    <circle cx="202" cy="58" r="4.5" fill="#10b981" />
    <text x="210" y="55" fill="#10b981" font-size="12" font-weight="bold" font-family="sans-serif">X[x, y]</text>
    <text x="186" y="86" fill="#f59e0b" font-size="12" font-weight="bold" font-family="sans-serif">r</text>
  </svg>
  <span class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Obrázek: Bod X[x, y] na obvodu útvaru se středem S[m, n] a poloměrem r</span>
</div>

> **Otázka:** *Dokažte, že tento geometrický útvar je kružnice!*
> 
> Jak začít? Mnoho studentů znejistí, protože nevědí, čeho se chytit. Odpověď zní: **musíte se opřít o přesné znalosti a definici!** Bez znalosti definice nelze nic dokázat.

<details class="my-4 p-4 rounded-xl border border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 dark:border-sky-800/40">
<summary class="cursor-pointer font-bold text-sky-900 dark:text-sky-300 select-none">
  🔍 Zobrazit odvození důkazu a definici
</summary>

#### ✍️ Odvození důkazu z definice:

1. **Definice kružnice (základní znalost):**
   > *Kružnice je množina všech bodů roviny $X[x, y]$, které mají od daného pevného bodu, **středu** kružnice $S[m, n]$, danou konstantní vzdálenost, **poloměr** kružnice $r > 0$.*
   $$|XS| = r$$

2. **Převod geometrie do algebry (Pythagorova věta):**
   Vzdálenost dvou bodů v kartézské rovině $X[x, y]$ a $S[m, n]$ odpovídá délce přepony pravoúhlého trojúhelníku s odvěsnami $(x - m)$ a $(y - n)$:
   $$|XS| = \sqrt{(x - m)^2 + (y - n)^2} = r$$

3. **Středová rovnice kružnice:**
   Jelikož obě strany rovnice jsou nezáporná čísla ($r > 0$), můžeme obě strany ekvivalentně umocnit na druhou:
   $$(x - m)^2 + (y - n)^2 = r^2$$

4. **Obecná rovnice kružnice:**
   Roznásobením závorek podle vzorce $(a - b)^2 = a^2 - 2ab + b^2$:
   $$x^2 - 2mx + m^2 + y^2 - 2ny + n^2 = r^2$$
   $$x^2 + y^2 - 2mx - 2ny + (m^2 + n^2 - r^2) = 0$$
   Označíme-li reálnou konstantu $p = m^2 + n^2 - r^2$, dostáváme standardní obecnou rovnici kružnice:
   $$x^2 + y^2 - 2mx - 2ny + p = 0$$

<div class="spoiler-print-hidden print:hidden my-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm">
  <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">📄 Ukázka z portálu Matematicko-fyzikální fakulty UK (skryto v tisku):</p>
  <img src="/images/kruznice-mff.png" alt="Ukázka definice a rovnic kružnice z MFF UK" class="rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 max-w-full h-auto mx-auto" />
  <p class="text-xs text-slate-400 mt-2 text-center">
    Zdroj: <a href="https://www.karlin.mff.cuni.cz/~portal/analyticka_geometrie/kuzelosecky.php?kapitola=kruznice" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 underline">MFF UK – Analytická geometrie kuželoseček: Kružnice</a>
  </p>
</div>

**Klíčová myšlenka:** Důkaz není kouzlení. Je to logické rozbalení **definice** krok za krokem. Když znáte přesnou definici, cesta k důkazu se sama otevře.

</details>

---

### 3. Postup: Efektivní umocňování $x^n$ a Zákon vyloučeného třetího

Zatímco bod 2 ukázal význam **znalostí (definic)**, v informatice a předmětu AG1 jde především o **postup (algoritmické myšlení)**.

> **Úloha k zamyšlení:**
> Chceme spočítat mocninu $x^n$ (pro libovolné přirozené číslo $n \in \mathbb{N}$) **výhradně za pomoci operace násobení**.
> Naším cílem je provést **co nejmenší možný počet násobení**.
>
> - *Naivní postup:* $x \cdot x \cdot x \cdot \dots \cdot x$ vyžaduje $n - 1$ násobení. Pro $n = 1\,000\,000$ provede počítač milion operací ($O(n)$).
> - *Jak to udělat chytřeji? Jaký postup zvolit?*

<details class="spoiler-print-hidden print:hidden my-4 p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/40">
<summary class="cursor-pointer font-bold text-amber-900 dark:text-amber-300 select-none">
  🔍 Zobrazit optimální postup a rozbor (skryto v tisku)
</summary>

#### ⚡ Řešení: Rychlé umocňování (Exponentiation by Squaring)

Tento elegantní postup se opírá o základní princip formální logiky: **Zákon vyloučeného třetího (*Law of Excluded Middle* / *Tertium non datur*)**.

V klasické logice platí, že každé přirozené číslo $n$ je **buď sudé, nebo liché** — žádná třetí možnost neexistuje!
$$\forall n \in \mathbb{N}: \text{sudé}(n) \lor \text{liché}(n)$$

Díky tomu můžeme algoritmus rozdělit na dvě dokonale vyčerpávající větve:

1. **Případ 1: Exponent $n$ je SUDÝ ($n \pmod 2 = 0$):**
   - Exponent vydělíme dvěma a výsledek umocníme na druhou:
     $$x^n = (x^{n/2})^2 = (x^{n/2}) \cdot (x^{n/2})$$
   - **Trik pro efektivitu:** Hodnotu $y = x^{n/2}$ spočítáme rekurzivně **pouze jednou** a pak ji jednou vynásobíme samu se sebou ($y \cdot y$)! Tím ušetříme polovinu násobení v jediném kroku.

2. **Případ 2: Exponent $n$ je LICHÝ ($n \pmod 2 = 1$):**
   - Exponent snížíme o 1, čímž vznikne sudé číslo $n - 1$:
     $$x^n = x \cdot x^{n - 1}$$
   - Vynásobíme základ $x$ hodnotou $x^{n-1}$, která v dalším kroku spadne do případu 1 (sudé číslo).

3. **Báze:**
   - Pro $n = 0$ platí $x^0 = 1$.

---

#### 🧪 Porovnání na konkrétních příkladech:

- **Příklad A: Výpočet $x^{16}$ (čistě sudá větev)**
  - *Naivně:* $x \cdot x \cdot x \dots$ = **15 násobení**.
  - *Chytrý postup (dělení exponentu):*
    1. $x^2 = x \cdot x$ *(1. násobení)*
    2. $x^4 = (x^2)^2$ *(2. násobení)*
    3. $x^8 = (x^4)^2$ *(3. násobení)*
    4. $x^{16} = (x^8)^2$ *(4. násobení)*
  - **Výsledek:** Pouhá **4 násobení** místo 15! ($4 = \log_2 16$).

- **Příklad B: Výpočet $x^{13}$ (střídání liché a sudé větve)**
  - $13$ je liché $\implies x^{13} = x \cdot x^{12}$ *(1. násobení)*
  - $12$ je sudé $\implies x^{12} = (x^6)^2$ *(2. násobení)*
  - $6$ je sudé $\implies x^6 = (x^3)^2$ *(3. násobení)*
  - $3$ je liché $\implies x^3 = x \cdot x^2$ *(4. násobení)*
  - $2$ je sudé $\implies x^2 = x \cdot x$ *(5. násobení)*
  - **Výsledek:** Pouhých **5 násobení** místo 12!

#### 🚀 Algoritmický význam pro AG1 a Bioinformatiku:
- Časová složitost klesla z lineární $O(n)$ na **logaritmickou $O(\log n)$**.
- Pro $n = 1\,000\,000$ nepotřebujeme milion násobení, ale jen přibližně **20 násobení** ($\approx 2 \log_2(10^6)$)!
- Tento princip (Divide & Conquer) je základem:
  - moderní kryptografie a modulární aritmetiky (RSA algoritmus),
  - rychlého umocňování matice sousedství grafu $A^k$ pro zjištění počtu cest délky $k$ mezi biomolekulami v síti,
  - a celého algoritmického myšlení, které vás v AG1 čeká.

</details>