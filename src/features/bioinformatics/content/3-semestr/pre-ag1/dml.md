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

## 3. Myšlení v Důkazech: Jak Funguje Matematický a Algoritmický Mozek?

Častý mýtus mezi studenty 1. ročníku zní: *„Matematici a teoretičtí informatici milují složité řecké značky a píší důkazy jen proto, aby potrápili studenty u zkoušky.“*

Pravda je přesně opačná. V této kapitole si ukážeme, proč důkazy vůbec vznikly, jaký je zásadní rozdíl mezi **znalostmi** a **postupem** a jak se z bioinformatika stane člověk, který se nezalekne žádné teoretické otázky z AG1.

---

### 3.1 Role Znalostí: První Setkání s Profesorem u Tabule

Představte si své první cvičení z diskrétní matematiky na univerzitě. Vstoupí vyučující, beze slova vezme křídu, nakreslí na tabuli obrázek níže, otočí se do ztichlé učebny a položí zdánlivě nevinnou otázku:

> **Otázka od tabule:**  
> *„Je dán geometrický útvar v kartézské rovině (viz obrázek). Dokažte, že se jedná o kružnici!“*

<div class="my-6 flex flex-col items-center justify-center p-6 bg-stone-100/70 dark:bg-[#18110c] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
<svg viewBox="0 0 340 240" class="w-80 max-w-full h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="axis-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#78716c" />
</marker>
</defs>
<line x1="25" y1="190" x2="310" y2="190" stroke="#78716c" stroke-width="1.5" marker-end="url(#axis-arrow)" />
<text x="315" y="194" fill="#78716c" font-size="13" font-family="sans-serif" font-weight="600">x</text>
<line x1="60" y1="215" x2="60" y2="25" stroke="#78716c" stroke-width="1.5" marker-end="url(#axis-arrow)" />
<text x="56" y="18" fill="#78716c" font-size="13" font-family="sans-serif" font-weight="600">y</text>
<circle cx="175" cy="110" r="65" fill="rgba(249, 93, 18, 0.08)" stroke="#f95d12" stroke-width="2.5" />
<circle cx="175" cy="110" r="5" fill="#c2410c" />
<text x="154" y="132" fill="#c2410c" font-size="13" font-weight="bold" font-family="sans-serif">S[m, n]</text>
<line x1="175" y1="110" x2="221" y2="64" stroke="#c2410c" stroke-width="2" stroke-dasharray="5,3" />
<circle cx="221" cy="64" r="5" fill="#f95d12" />
<text x="230" y="60" fill="#f95d12" font-size="13" font-weight="bold" font-family="sans-serif">X[x, y]</text>
<text x="202" y="96" fill="#f95d12" font-size="14" font-weight="bold" font-family="sans-serif">r</text>
</svg>
<p class="text-xs text-stone-500 dark:text-stone-400 mt-3 font-medium text-center">Obrázek: Geometrický útvar se středem S[m, n], poloměrem r a bodem X[x, y] na obvodu</p>
</div>

<div class="print-tablet-workspace" data-label="✍️ Místo pro vaše řešení a odvození (pro psaní stylusem na tabletu / v tisku):"></div>

<details class="wiki-spoiler-box">
<summary class="wiki-spoiler-summary">
  <span class="flex items-center gap-2">🔍 <span>Cítíte se ztraceni? Rozklikněte nápovědu a rozbor u tabule</span></span>
  <span class="badge-print-hidden">🔒 skryto v tisku</span>
</summary>

#### 🤯 Proč se v této chvíli cítíte ztraceni?
V téhle jediné vteřině zažije naprosté ticho a prázdno v hlavě 95 % studentů v aule:
> *„Co po mně proboha chce?! Vždyť to vidím na vlastní oči — je to kulaté, je to kružnice, co na tom mám dokazovat?! Mám vytáhnout kružítko a pravítko a změřit to?“*

**Proč tento pocit bezmoci vzniká?**  
Náš lidský mozek je ze střední školy i běžného života zvyklý spoléhat se na **vizuální intuici**. Jenže exaktní matematika a teoretická informatika nejsou o tom, co *vypadá kulatě*. Zrak může snadno klamat (může to být elipsa s poloosami $a = 60.0$ a $b = 59.9$, nebo pravidelný 128-úhelník).

Vyučující od vás nechtěl vizuální popis. Chtěl **formální matematickou obhajobu**.  
A zde přichází ten nejdůležitější aha-moment celého studia:  
**Bez znalosti přesné DEFINICE nemáte VŮBEC CO dokazovat!**  

Dokud neznáte definici, mozek tápe v mlze, protože nemá záchytný bod. Jakmile si však vybavíte exaktní definici pojmu, celý důkaz se stane přímočarým rozbalením této definice krok za krokem.

---

<div class="my-5 p-4 rounded-xl bg-stone-100/80 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wide">📄 Ukázka z portálu Matematicko-fyzikální fakulty UK</span>
    <span class="badge-print-hidden">🔒 skryto v tisku</span>
  </div>
  <img src="/images/kruznice-mff.png" alt="Ukázka definice a rovnic kružnice z MFF UK" class="rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 max-w-full h-auto mx-auto" />
  <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">
    Zdroj: <a href="https://www.karlin.mff.cuni.cz/~portal/analyticka_geometrie/kuzelosecky.php?kapitola=kruznice" target="_blank" rel="noopener noreferrer" class="text-[#c2410c] dark:text-[#f95d12] underline font-medium">MFF UK – Analytická geometrie kuželoseček: Kružnice</a>
  </p>
</div>

</details>

---

### 3.2 Role Postupu: Rychlé Umocňování ($x^n$) & Formální Logika

Zatímco kružnice demonstrovala sílu **statických znalostí (definic)**, v programování a předmětu AG1 rozhoduje **dynamický postup (algoritmus)** opřený o zákony **formální matematické logiky**.

Představme si typickou algoritmickou výzvu:
> **Algoritmická Výzva:**  
> Chceme spočítat hodnotu mocniny $x^n$ (pro libovolné přirozené číslo $n \in \mathbb{N}$) **výhradně za pomoci operace násobení**.  
> Cíl: provést **co nejmenší možný počet násobení**.

- **Naivní postup ($O(n)$):**  
  Budeme postupně násobit $x \cdot x \cdot x \dots \cdot x$. To vyžaduje $n - 1$ násobení.  
  Pro $n = 1\,000\,000$ (např. při šifrování RSA nebo počítání cest v rozsáhlých biologických sítích) provede procesor **milion operací**. To je v praxi zbytečně pomalé.
- **Výzva k zamyšlení:** Lze to udělat řádově rychleji? Jaký myšlenkový postup zvolit a jakou roli v tom hraje formální logika?

<div class="print-tablet-workspace" data-label="✍️ Místo pro návrh vašeho algoritmu a logický rozbor případů (pro tablet / stylus / tisk):"></div>

<details class="wiki-spoiler-box">
<summary class="wiki-spoiler-summary">
  <span class="flex items-center gap-2">⚡ <span>Zobrazit optimální postup a logický rozbor</span></span>
  <span class="badge-print-hidden">🔒 skryto v tisku</span>
</summary>

#### ⚡ Řešení: Rychlé umocňování (Exponentiation by Squaring) a Formální Logika

Tento elegantní postup se opírá o základní axiomy formální výrokové a predikátové logiky:

##### 1. Zákon vyloučeného třetího (*Law of Excluded Middle* / *Tertium non datur*)
V klasické bivalentní (dvouhodnotové) logice platí, že každý výrok $A$ je buď pravdivý, nebo nepravdivý. Neexistuje žádný třetí mezistav.
Formálně je to tautologie:
$$\models A \lor \neg A$$
A současně platí zákon sporu (žádný výrok nemůže být zároveň pravdivý i nepravdivý):
$$\models \neg(A \land \neg A)$$

Aplikujeme-li tuto logiku na vlastnost dělitelnosti celých čísel dvěma:
$$\forall n \in \mathbb{N}: \text{sudé}(n) \lor \text{liché}(n)$$
Každé číslo $n$ musí bezpodmínečně spadnout do jedné ze dvou kategorií — žádné číslo nemůže být „napůl sudé“, ani nemůže existovat číslo, které není ani jedno.

##### 2. Důkaz a algoritmus rozborem případů (*Proof by Cases / Exhaustion*)
Ve formální logice máme dedukční pravidlo:
$$((P \lor Q) \land (P \implies R) \land (Q \implies R)) \implies R$$
V informatice a algoritmech to znamená: pokud navrhneme postup, který správně vyřeší sudá čísla ($P$) i lichá čísla ($Q$), a víme, že každé číslo je buď sudé, nebo liché ($P \lor Q$), **algoritmus je zaručeně korektní pro všechna myslitelná čísla**. Žádný případ nemůže propadnout.

Díky tomu můžeme algoritmus rozdělit na dvě dokonale vyčerpávající větve (technika *Divide & Conquer*):

1. **Případ 1: Exponent $n$ je SUDÝ ($n \pmod 2 = 0$):**
   - Exponent vydělíme dvěma a výsledek umocníme na druhou:
     $$x^n = (x^{n/2})^2 = (x^{n/2}) \cdot (x^{n/2})$$
   - **Trik pro úsporu:** Hodnotu $y = x^{n/2}$ spočítáme rekurzivně **pouze jednou** a pak ji jednou vynásobíme samu se sebou ($y \cdot y$)! Tím ušetříme celou polovinu násobení v jediném kroku.

2. **Případ 2: Exponent $n$ je LICHÝ ($n \pmod 2 = 1$):**
   - Exponent snížíme o 1, čímž vznikne sudé číslo $n - 1$:
     $$x^n = x \cdot x^{n - 1}$$
   - Vynásobíme základ $x$ hodnotou $x^{n-1}$, která v dalším kroku spadne do super-rychlého Případu 1 (sudé číslo).

3. **Báze algoritmu (Indukční základ pro $n = 0$):**
   - Pro $n = 0$ platí neutrální prvek operace násobení:
     $$x^0 = 1$$

##### 3. Důkaz terminace (Dobré uspořádání $\mathbb{N}$ a matematická indukce)
Proč si můžeme být 100% jistí, že se algoritmus nezacyklí v nekonečné smyčce?
- V sudé větvi: pro $n \ge 2$ platí $n/2 < n$.
- V liché větvi: pro $n \ge 1$ platí $n - 1 < n$.
V každém rekurzivním kroku hodnota exponentu **ostře klesá** ($n' < n$). Množina přirozených čísel $\mathbb{N}$ je **dobře uspořádaná** (*well-founded set*) — neexistuje v ní žádná nekonečná klesající posloupnost. Algoritmus tedy v konečném počtu kroků nevyhnutelně narazí na bázi $n = 0$ a korektně skončí.

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

