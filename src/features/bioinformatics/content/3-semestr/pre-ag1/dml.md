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

## 3. Myšlení v Důkazech: Jak Funguje Matematický a Algoritmický Mozek? `[Relevance: 95%]` `[EPIC]` `[INSIGHT]`

Častý mýtus mezi studenty 1. ročníku zní: *„Matematici a teoretičtí informatici milují složité řecké značky a píší důkazy jen proto, aby potrápili studenty u zkoušky.“*

Pravda je přesně opačná. V této kapitole si ukážeme, proč důkazy vůbec vznikly, jaký je zásadní rozdíl mezi **znalostmi** a **postupem** a jak se z bioinformatika stane člověk, který se nezalekne žádné teoretické otázky z AG1.

---

### 3.1 Anatomie Důkazu: Cesta k Výsledku vs. Úsporný Zápis `[INSIGHT]`

> [!NOTE]
> **Důkazy nevznikly kvůli velké lásce k abstraktním matematickým výrazům.**  
> Vznikly z ryzí inženýrské a vědecké potřeby: **získat 100% jistotu a záruku**, že náš algoritmus nebo tvrzení funguje za všech myslitelných okolností (a neselže uprostřed noci na neznámých biologických datech v produkci). V bioinformatice nestačí říct: *„Na pěti testovacích sekvencích to běželo, tak to snad bude fungovat vždycky.“*

V odborné literatuře i na přednáškách se setkáte se **dvěma zásadními typy důkazů**:

| Typ Důkazu | Jak Funguje v Praxi | Proč Může Zmást Studenta | Význam pro Bioinformatiku a AG1 |
| :--- | :--- | :--- | :--- |
| **1. Důkaz Heuristický / Objevný** *(Cesta k výsledku)* | Ukazuje **skutečný myšlenkový postup autora** — od prvotní motivace přes jednoduché náčrtky až po obecný vzorec. | Bývá delší na čtení, protože neskrývá slepé uličky a experimentální intuici. | **Zásadní pro algoritmy:** Tento důkaz často *přímo generuje samotný algoritmus a kód v C++* (např. konstrukce Eulerova tahu). |
| **2. Důkaz Formální / Úsporný** *(Čistá verifikace)* | Dokazuje tvrzení v co nejmenším počtu řádků a **zkracuje všechno, co může**. | **Působí jako kouzlo spadlé z nebe.** Autor zahodil všechny papíry s náčrtky a předloží jen finální geniální trik. | Slouží k rychlému a neprůstřelnému ověření, ale sám o sobě vás nenaučí, jak na řešení přijít. |

```text
JAK VE SKUTEČNOSTI VZNIKÁ MATEMATICKÝ A ALGORITMICKÝ OBJEV:

 1. Pokus & Omyl        ➔  Vezmeš papír a zkoušíš malé případy (n = 1, 2, 3, 4)
          │
          ▼
 2. Pozorování & Vzory  ➔  Všimneš si: „Aha! Pro sudá čísla to jde vždy rozdělit na poloviny!“
          │
          ▼
 3. Formulace Hypotézy  ➔  Zformuluješ přesné tvrzení v jazyce logiky (∀, ∃, ⇒)
          │
          ▼
 4. Finální Důkaz       ➔  Teprve teď sepíšeš formální důkaz jako neprůstřelnou obhajobu
```

> [!TIP]
> **💡 Tajemství zkouškových premiantů:**  
> Když lidé (včetně slavných matematiků a informatiků) přijdou na něco nového, **rozhodně to není tím, že by seděli doma a z hlavy psali abstraktní formule na papír** *(s nadsázkou to neplatí snad jedině pro teoretické fyziky! 😉)*.  
> Skutečné poznání začíná tím, že si **něco zkoušíte, kreslíte náčrtky a hledáte invarianty a skryté vlastnosti**. Formální důkaz je až slavnostní obal, kterým svou intuici obhájíte před světem.

---

### 3.2 Role Znalostí: „Dokažte, že toto je kružnice!“ `[CHALLENGE]`

Rozdíl mezi **znalostmi (definicemi)** a **algoritmickým postupem** si předveďme na klasické zkouškové situaci.

Představte si následující zadání:
> **Zkoušková otázka:** *„Je dán geometrický útvar v kartézské rovině (viz obrázek níže). Dokažte, že se jedná o kružnici!“*

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
  <span class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Obrázek: Bod X[x, y] na obvodu geometrického útvaru se středem S[m, n] a poloměrem r</span>
</div>

Mnoho studentů v této chvíli znejistí: *„Jak mám dokázat, že kružnice je kružnice? Vždyť to vidím očima!“*  
Jenže v exaktní vědě zrak nestačí. Abyste mohli cokoliv dokázat, **musíte mít přesné ZNALOSTI — konkrétně přesnou DEFINICI.** Bez znalosti definice není co dokazovat.

<details class="my-4 p-4 rounded-xl border border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 dark:border-sky-800/40">
<summary class="cursor-pointer font-bold text-sky-900 dark:text-sky-300">
  🔍 Zobrazit formální odvození a důkaz z definice
</summary>

#### ✍️ Důkaz krok za krokem z definice:

1. **Definice kružnice (Klíčová znalost):**
   > *Kružnice je množina všech bodů roviny $X[x, y]$, které mají od daného pevného bodu — **středu** kružnice $S[m, n]$ — konstantní vzdálenost, **poloměr** $r > 0$.*
   $$|XS| = r$$

2. **Převod geometrie na algebru (Pythagorova věta):**
   Vzdálenost dvou bodů $X[x, y]$ a $S[m, n]$ v eukleidovské rovině odpovídá délce přepony pravoúhlého trojúhelníku s odvěsnami $(x - m)$ a $(y - n)$:
   $$|XS| = \sqrt{(x - m)^2 + (y - n)^2} = r$$

3. **Středová rovnice kružnice:**
   Protože obě strany rovnice jsou nezáporné ($r > 0$), provedeme ekvivalentní umocnění na druhou:
   $$(x - m)^2 + (y - n)^2 = r^2$$

4. **Obecná rovnice kružnice:**
   Roznásobením závorek podle vzorce $(a - b)^2 = a^2 - 2ab + b^2$:
   $$x^2 - 2mx + m^2 + y^2 - 2ny + n^2 = r^2$$
   $$x^2 + y^2 - 2mx - 2ny + (m^2 + n^2 - r^2) = 0$$
   Označíme-li konstantu $p = m^2 + n^2 - r^2$, dostáváme standardní obecný tvar:
   $$x^2 + y^2 - 2mx - 2ny + p = 0$$

<div class="spoiler-print-hidden print:hidden my-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm">
  <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">📄 Ukázka z portálu Matematicko-fyzikální fakulty UK (skryto v tisku):</p>
  <img src="/images/kruznice-mff.png" alt="Ukázka definice a rovnic kružnice z MFF UK" class="rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 max-w-full h-auto mx-auto" />
  <p class="text-xs text-slate-400 mt-2 text-center">
    Zdroj: <a href="https://www.karlin.mff.cuni.cz/~portal/analyticka_geometrie/kuzelosecky.php?kapitola=kruznice" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 underline">MFF UK – Analytická geometrie kuželoseček: Kružnice</a>
  </p>
</div>

**💡 Klíčové poučení:** Důkaz není kouzlení. Je to logické rozbalení **definice** krok za krokem. Když znáte definici, důkaz se stává přímočarou formalitou.

</details>

---

### 3.3 Role Postupu: Rychlé Umocňování ($x^n$) & Zákon Vyloučeného Třetího `[EPIC]` `[BIO-ANALOGIE]`

Zatímco v geometrii rozhodují **statické znalosti (definice)**, v programování a předmětu AG1 rozhoduje **dynamický postup (algoritmus)**.

Představme si typickou algoritmickou výzvu:
> **Algoritmická Výzva:**  
> Chceme spočítat hodnotu mocniny $x^n$ (pro libovolné přirozené číslo $n \in \mathbb{N}$) **výhradně za pomoci operace násobení**.  
> Cíl: provést **co nejmenší možný počet násobení**.

- **Naivní postup ($O(n)$):**  
  Budeme postupně násobit $x \cdot x \cdot x \dots \cdot x$. To vyžaduje $n - 1$ násobení.  
  Pro $n = 1\,000\,000$ (např. při šifrování RSA nebo počítání cest v rozsáhlých biologických sítích) provede procesor **milion operací**. To je v praxi zbytečně pomalé.
- **Otázka:** Lze to udělat řádově rychleji? Jaký myšlenkový postup zvolit?

<details class="spoiler-print-hidden print:hidden my-4 p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/40">
<summary class="cursor-pointer font-bold text-amber-900 dark:text-amber-300">
  🔍 Zobrazit optimální postup a rozbor (skryto v tisku)
</summary>

#### ⚡ Řešení: Rychlé umocňování (Exponentiation by Squaring)

Tento elegantní postup se opírá o základní kámen formální logiky: **Zákon vyloučeného třetího (*Law of Excluded Middle* / *Tertium non datur*)**.

V klasické dvouhodnotové logice platí, že každé celé číslo $n$ je **buď sudé, nebo liché** — žádná třetí možnost neexistuje:
$$\forall n \in \mathbb{N}: \text{sudé}(n) \lor \text{liché}(n)$$

Díky tomu můžeme algoritmus rozdělit na dvě dokonale vyčerpávající větve (technika *Divide & Conquer*):

1. **Případ 1: Exponent $n$ je SUDÝ ($n \pmod 2 = 0$):**
   - Exponent vydělíme dvěma a výsledek umocníme na druhou:
     $$x^n = (x^{n/2})^2 = (x^{n/2}) \cdot (x^{n/2})$$
   - **Trik pro úsporu:** Hodnotu $y = x^{n/2}$ spočítáme rekurzivně **pouze jednou** a pak ji jednou vynásobíme samu se sebou ($y \cdot y$)! Tím ušetříme polovinu násobení v jediném kroku.

2. **Případ 2: Exponent $n$ je LICHÝ ($n \pmod 2 = 1$):**
   - Exponent snížíme o 1, čímž vznikne sudé číslo $n - 1$:
     $$x^n = x \cdot x^{n - 1}$$
   - Vynásobíme základ $x$ hodnotou $x^{n-1}$, která v dalším kroku spadne do případu 1 (sudé číslo).

3. **Báze algoritmu:**
   - Pro $n = 0$ platí $x^0 = 1$.

---

#### 🧪 Porovnání na konkrétních číslech:

- **Příklad A: Výpočet $x^{16}$ (čistě sudá větev)**
  - *Naivně:* $x \cdot x \cdot x \dots$ = **15 násobení**.
  - *Rychlý postup (dělení exponentu):*
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

#### 💻 Jak to vypadá v C++ (pro AG1 a PA2):
```cpp
// Rychlé umocňování v čase O(log n)
long long power(long long x, unsigned int n) {
    if (n == 0) return 1;
    
    if (n % 2 == 0) {
        long long half = power(x, n / 2);
        return half * half; // Spočítáno jen 1x, násobeno 1x!
    } else {
        return x * power(x, n - 1);
    }
}
```

#### 📊 Srovnání Složitosti:

| Exponent $n$ | Naivní přístup ($n - 1$ násobení) | Rychlé umocňování ($\approx \log_2 n$) | Zrychlení v praxi |
| :--- | :--- | :--- | :--- |
| **$n = 16$** | 15 násobení | **4 násobení** | $3.75\times$ rychlejší |
| **$n = 1\,024$** | 1 023 násobení | **10 násobení** | **$100\times$ rychlejší** |
| **$n = 1\,000\,000$** | 999 999 násobení | **cca 20 násobení** | **$50\,000\times$ rychlejší!** |

#### 🚀 Algoritmický význam pro AG1 a Bioinformatiku:
- Časová složitost klesla z lineární $O(n)$ na **logaritmickou $O(\log n)$**.
- Tento princip (Divide & Conquer) je základem:
  - moderní kryptografie a modulární aritmetiky (šifrování RSA),
  - **rychlého umocňování matice sousedství grafu $A^k$** v bioinformatice (pro okamžité zjištění počtu cest délky $k$ mezi biomolekulami v síti bez pomalého prohledávání!),
  - a celkového algoritmického myšlení, které po vás bude vyžadovat AG1.

</details>