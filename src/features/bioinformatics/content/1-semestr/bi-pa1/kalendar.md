# PA1 Kalendář co musím umět

Studentský **support** kalendář s tipy.  
Osnova přednášek + „co lidi trápí“ + tipy z praxe + Trainer **jen když dává smysl**.

---

### Týden 1 — Algoritmy a programy, základní podpora vývoje

**Co umět / na co si dát bacha**

* Kompilace C: viz [WSL / setup](/obor-bioinformatika/1-semestr/bi-pa1/wsl-a-setup) nebo sekce v *Příručce prváka*. Poslední **krátkodobá naděje je [online kompiler](https://www.onlinegdb.com/)**.
* Naučte se **spustit** program z terminálu, ne jen „zelenou šipkou“ v IDE.
* Zjistěte si, proč má kód tuhle základní strukturu:

```c
#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}
```

* Kompilace s přísnějšími kontrolami (hodí se celý semestr), např.:

```bash
g++ ./main.c -o main -std=c++20 -pedantic -Wall -Wextra
```

**Tipy**

* Když kompilátor řve nesmysly: zkus nejdřív *opravdu* přečíst první error shora.
* Na Windows bez WSL se dřív nebo později u testování / valgrindu spálíš — setup udělej do 4 týdnů.

**Trainer** (když ti nejde ani „hello“ / kompilace)

* Lekce [Kompilace, základní algoritmy](https://trainer.ksi.fit.cvut.cz/lessons/435) — série *Nefungující kompilace*, která vysvětluje krok za krokem co musí kód mít

---

### Týden 2 — Proměnné, vstup a výstup v jazyce C

**Co umět / na co si dát bacha**

* `printf()`, `scanf()` — formátovací řetězce (co a proč dáváme do `printf()` a `scanf()`), `&` (proč to u `scanf()`) a  `scanf` čísel.
* **Debugging** — možnost se v každém kroku programu podívat, jaká hodnota je v proměnných a kudy program vlastně jde.
* **ZEPTEJTE SE CVIČÍCÍHO / staršího studenta** — reálně jsem nenašel video, který by debugging v C dobře vysvětlovalo.

**Tipy**

* `scanf` vrací počet úspěšně načtených položek — kontroluj to (ne jen „načtu a doufám“).
* Mezera ve formátovacím řetězci ve `scanf` **přeskočí bílé znaky** — `scanf(" ")` umí ušetřit šílenosti.
* Formát u `scanf` ideálně **končí konverzí**.
* Když se `printf` v CLionu „neukáže hned“: [Jak to spravit → fflush](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit).
* Lokální testy bez copy-paste do konzole (ale do kódu): [Testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/testovaci-skript).
* Pokorčílé (zjistíte později): `scanf("%s")` **nemůže být bezpečné** (buffer) — na Progtestu se to mstí. Detaily: [zkouškové rady](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska).

**Trainer**

* [Celočíselné proměnné, vstup a výstup](https://trainer.ksi.fit.cvut.cz/lessons/439) — hlavně *Návratový kód funkce scanf*, *Kalkulačka*

---

### Týden 3 — Pohyblivá řádová čárka. Výrazy v jazyce C

**Co umět / na co si dát bacha**

* `float` / `double` **nejsou** „desetinná čísla ze střední“ — mají omezenou přesnost a **divné zaokrouhlování**.
* Porovnávání floatů přes `==` je past.
* Matematika začíná být těžší: hodí se **googlit vzorečky, které neznáte ze střední** (NSD, NSN, …).

**Tipy**

<iframe src="https://www.youtube.com/embed/bbkcEiUjehk?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

* [Interaktivní Float/Double](https://float.exposed/0x5cbf9401) vizualizace
* Edge cases: začněte používat **papír** a procházejte si, jak se který vstup vyhodnotí. Mohou pomoci **FlowCharts**, díky kterým si váš algoritmus nakreslíte:

<iframe src="https://www.youtube.com/embed/Yq1OPs5hCt0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

**Trainer**

* Pořád dává smysl vracet se k [vstupu/výstupu](https://trainer.ksi.fit.cvut.cz/lessons/439) a začít [řídící konstrukce](https://trainer.ksi.fit.cvut.cz/lessons/441) — float sám o sobě v Traineru není „jeden týden“, spíš se míchá do úloh.

---

### Týden 4 — Řídící konstrukce v jazyce C

**Co umět / na co si dát bacha**

* `if` / `else`, `switch`, `while`, `for`, `do while` — a hlavně **kdy který**.
* Prozatím lze všechny algoritmy „fintou“ dostat do **dvou cyklů** (for/while) — později sami poznáte, kdy už to není pravda.
* Pokud se v zadání objeví slovo **„maska“**, bude to na h*vno úloha (aka. pondělí `1000000`, úterý `0100000`, víkend `0000011`, …).
* teďka je **poslední šance zprovonznit si linux porstředí**.

**Tipy**

* Papír + flowchart pořád platí — u vnořených podmínek se bez toho zblázníš.
* Přehlednost kódu je důležitější než počet proměnných nebo podmínek — viz [Struktura kódu](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu).

**Trainer**

* [Řídící konstrukce I](https://trainer.ksi.fit.cvut.cz/lessons/441)
* [Řídící konstrukce II — cykly](https://trainer.ksi.fit.cvut.cz/lessons/461)

---

### Týden 5 — Funkce v jazyce C

**Co umět / na co si dát bacha**

* Deklarace vs. definice; proč musí být **hlavička** vidět před voláním.
* Předávání **hodnotou** vs. později ukazatelem (jablka — viz týden 7).
* Testovatelný kód: malé funkce, jasný vstup/výstup.
**Tipy**

* Funkce, která „dělá všechno + tiskne + čte“ se na Progtestu a v debugování mstí.
* U zkoušky: **jeden obří `main`** bez funkcí u zkouškové úlohy úplně neprojde. Funkce se lépe defungují debug. → [Struktura](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu) · [zkouška](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)
* Lokální automatické testy: [Testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/testovaci-skript).

**Trainer**

* [Zásady testovatelného kódu / testování funkcí](https://trainer.ksi.fit.cvut.cz/lessons/513)
* [Funkce a struktury](https://trainer.ksi.fit.cvut.cz/lessons/514)

---

### Týden 6 — Pole a řetězce v jazyce C

**Co umět / na co si dát bacha**

* Úlohy začínají být **jednodušší na matematiku** a spíš testují jestli umíte **náročnější programovací látk**u.
* Pole = souvislé schránky; při předání do funkce jde v podstatě o **adresu prvního prvku** + délku (viz analogie v týdnu 7).
* Řetězce v C = pole `char` s `'\0'` na konci.
* "Off-by-one" je název chyby kdy zkočníte o 1 prvek poli jinde (řed koncem/za koncem) -> (`i <= n` místo `i < n`, nebo naopak).

**Tipy**

* V debuggeru zobrazit pole: [Jak to spravit → pole](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit).
* Indexování 2D: buď jedno dlouhé pole s mnoho náročnýma podmínkama a indexováním, nebo `pole[řádky][sloupce]` — viz týden 7.
* **Nepouštěj `strlen` v každém kroku cyklu** — procházej do `'\0'`.
* Prázdný řetězec: stačí `s[0] == '\0'`, ne nutně `strlen`.
* Na `'\0'` musíš mít **místo** v poli — jinak nemůžeš (basicly) používat string knihovny.
* Nesnaž se vždy nacpat celý vstup do jednoho stringu — často stačí `scanf` po částech. → [zkouška · vstup a řetězce](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)

**Trainer**

* [Pole + ukazatele](https://trainer.ksi.fit.cvut.cz/lessons/516)
* [Řetězce](https://trainer.ksi.fit.cvut.cz/lessons/521)

---

### Týden 7 — Struktury a ukazatele v jazyce C

**Co umět / na co si dát bacha**

* **Pochopit ukazatele.** Bez toho zbytek semestru bolí.
* Struktury (`struct`) — balíček souvisejících dat.

#### Moje analogie s jablky a šuplíky

Máme 11 jablek. Pokud někomu předáme papírek s hodnotou `11` (**předali jsme hodnotou**):

* Pokud se počet jablek změní (např. se nějaké sní), tak i když si to někdo na tom papírku přepíše (`jablekVeFunkci`), **my tuto změnu nevidíme**.

```c
void mojeFunkce(int jablekVeFunkci); // pro kompiler musím před zavoláním napsat alespoň hlavičku

int main() {
    int pocetJablek = 11;
    mojeFunkce(pocetJablek); // předáváme papírek s kopií hodnoty "jablka"
    return pocetJablek; // vidíme 11. To že si někdo na papírku něco přepsal, bohužel nevidíme.
}

void mojeFunkce(int jablekVeFunkci) {
    jablekVeFunkci = 9;
    // Změnili jsme jen hodnotu na kopii papírku, originál zůstal beze změny.
}
```

#### Pointers

Řešení: místo počtu předáme **adresu** (paměťového místa), kam si počet jablek ukládáme a odkud čteme.

V C/C++ má `*` hvězdička **2 významy**:

* `int *variable` — při deklaraci (po datovém typu): není to pouhý `int`, ale typ obsahující **adresu na schovku**
* `*variable` — před proměnnou: **jdi na místo schovky** a pracuj s hodnotou uvnitř

V C má `&` tenhle význam: každá proměnná je ve schovce a má adresu. Adresu získáš pomocí `&variable`.

```c
void mojeFunkce2(int *jablekVeFunkci);

int main() {
    int pocetJablek = 11;
    int *ukazatelNaJablka = &pocetJablek; // adresa (ampersandem &) jablek
    mojeFunkce2(ukazatelNaJablka); // předáváme adresu schránky
    return pocetJablek; // nyní 9 — původní proměnná byla změněna
}

void mojeFunkce2(int *jablekVeFunkci) {
    *jablekVeFunkci = 9; // na adrese schránky přepíšeme hodnotu na 9
}
```

#### Pole (předávání více hodnot)

Abychom si nemuseli předávat adresy na hromadu schovek, domluvíme se, že si **data uložíme vedle sebe**. Předáme adresu na **první schránku** a **počet** (např. akciové ceny jablek za měsíc = tahle schránka a dalších 29 doprava).

Schránky: `datovýTyp variable[VELIKOST_POLE]`.

```c
int main() {
    int akcioveCenyJablek[30];
    for (int i = 0; i < 30; i++) {
        // ... dosadíme hodnoty ...
    }
    mojeFunkce3(akcioveCenyJablek, 30); // adresa prvního prvku + počet
}

void mojeFunkce3(int *odkazNaPrvniSchranku, int delka) {
    // indexování: odkazNaPrvniSchranku[i]
}
```

#### Více dimenzionální pole

Chceš uložit měsíční (30 dní) akciové ceny **více druhů ovoce**.

**Primitivní způsob (1D pole):** jedno dlouhé pole + dohoda na indexování (každých N indexů jiný typ).  
Výhoda: nemusíš složitou syntaxi ukazatelů. Nevýhoda: indexování je otravné.

**Komplexnější způsob — vícerozměrné pole:**

```c
void mojeFunkce4(
    int odkazNaPrvniSchranku[100][30],
    int vKolikaNasledujicichSuplicichMamHledat_Ovoce,
    int vKolikaNasledujicichSuplicichMamHledat_Ceny
);

int main() {
    int typyOvoce[100][30]; // 100 schránek, v každé 30 cen
    for (int i = 0; i < 100; i++) {
        for (int j = 0; j < 30; j++) {
            // ...
        }
    }
    mojeFunkce4(typyOvoce, 100, 30);
}

void mojeFunkce4(
    int odkazNaPrvniSchranku[100][30],
    int vKolikaNasledujicichSuplicichMamHledat_Ovoce,
    int vKolikaNasledujicichSuplicichMamHledat_Ceny
) {
    // ...
}
```

Později umíš pole, u kterého neznáš velikost dopředu — viz týden 8. (ukázka konceptu: [pastebin](https://pastebin.com/AgpG70bQ))

**Tipy (zkouška / těžké HW)**

* Teorie pointerů a struktur **není navíc** — bez ní praktická část bolí. → [„Když nevím…“](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)
* Dynamické pole dělej jako **strukturu + helper funkce**, ne tři volné argumenty + `int **` peklo.
* **Nevracej pointer na lokální proměnnou** z funkce (zásobník vs. halda).

**Trainer**

* Pořád [Pole + ukazatele](https://trainer.ksi.fit.cvut.cz/lessons/516) — *Ukazatele I–III*
* Funkce se structy: [Funkce a struktury](https://trainer.ksi.fit.cvut.cz/lessons/514)

---

### Týden 8 — Ukazatele a dynamická alokace paměti v jazyce C

**Co umět / na co si dát bacha**

* `malloc` / `calloc` / `realloc` / `free` — kdo alokuje, uvolňuje.
* Memory leak, use-after-free, zápis mimo alokované pole = Progtest / valgrind bolest.
* **Valgrind** — kontroluje paměť, hlásí úniky a chybné čtení/zápisy. (CLion ho má cool integrovaný.)
* **Sanitizer** — `-fsanitize=undefined,address` (+ `-g`): UB i paměť:

```bash
g++ -Wall -Wextra -pedantic -g -fsanitize=undefined,address -o main main.c
```

**Tipy**

* Sanitizer a Valgrind **vzájemně vylučují** — vyber jedno. → [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit)
* Realokuj **geometrickou řadou** (×2 apod.) — jinak často timeout na časových testech.
* Nealokuj „dopředu na jistotu“ každé prázdné políčko; v C se alokuje, **až když potřebuješ** (klidně začni `NULL` + `realloc`).
* Neinicializovaná paměť / proměnné — sanitizer / Valgrind s `--track-origins=yes`.
* `NULL` vs `nullptr`: [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit).
    * `calloc` v paměti vynuluje bajty, což pro ukazatele **funguje jako platný `nullptr`** (tam problém není).
    * **Pozor ale při kompilaci přes `g++`:**
      1. `calloc`/`malloc` vrací `void*` — v C++ **musíš explicitně přetypovat** `(int*)calloc(...)`, jinak kód neprojde kompilací.
      2. Na přednáškách se sice učí, že `0` = `NULL`, ale přímo v C++ kódu piš `nullptr` (psaní `= 0` u pointeru vyvolá varování `-pedantic`, které ti strne body).

**Trainer**

* [Dynamická alokace — Dominové kostky](https://trainer.ksi.fit.cvut.cz/lessons/519)

---

### Týden 9 — Složitost, vyhledávání, kvadratické řazení

**Co umět / na co si dát bacha**

* Co znamená „kolikrát se něco provede“ v závislosti na \(n\) — intuice O(n), O(n²).
* Lineární vs. binární vyhledávání (kdy smíš binárně).
* Kvadratické sorty (bubble / insertion / selection — podle přednášky): umět **napsat a vysvětlit**, ne jen „znát název“.

**Tipy**

* Když Progtest timeoutí: často O(n²) tam, kde stačí líp, nebo zbytečná práce ve smyčce — ne hned „optimizuj mikro“.
* Spoustu úloh **zrychlí seřazení dat**; umět udržovat seřazené pole i bez magie.
* Ve stdlib existují **`qsort` a `bsearch`** — nemusíš vždy vynalézat kolo. → [zkouška · funkce](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)
* `-O2` **nezachrání** špatnou asymptotiku (může ale odhalit UB).
* Playlist intuice: [Epické algoritmy](https://youtube.com/playlist?list=PLnZHgAO8ocBv6XRqZkqQjrsIJijn82UUC) (sorting část).

**Trainer**

* [Složitost — množiny](https://trainer.ksi.fit.cvut.cz/lessons/523)

---

### Týden 10 — Rekurzivní algoritmy, MergeSort, úvod do QuickSortu

**Co umět / na co si dát bacha**

* Rekurze a její části (nemusí být v tomto pořadí):
    * **kontrola podmínky (base case)**
    * **výpočty**
    * **posunutí do nižšího stupně**  
* MergeSort / náznak QuickSortu — idea „rozděl a spoj“, ne memorování 80 řádků bez pochopení.

**Tipy**
* U zkoušky: úlohy na **rekurzi a seznamy** bývají často jistější volba než dyn. alokace + řetězce.

**Trainer**

* [Rekurze — výklad + úlohy](https://trainer.ksi.fit.cvut.cz/lessons/525) - **tohle si musí každý povinně vyzkoušet**

---

### Týden 11 — Spojové a stromové struktury v jazyce C

**Co umět / na co si dát bacha**

* Uzel/Node = data + ukazatel na další uzly/nodes.
* Průchod seznamem / stromem bez ztráty hlavy seznamu.
* **Stromy 101** — kořen, list, potomek; rekurze sem sedí přirozeně (viz týden 11).

**Tipy**

* Kresli si uzly na papír. Fakt.
* Memory: každý `malloc` uzlu má svůj `free` — [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit).
* U seznamů/stromů se hodí **dvojhvězdičkový pointer** na manipulaci (viz zkouškové obraty).

**Trainer**

* [Spojové struktury](https://trainer.ksi.fit.cvut.cz/lessons/526)

---

### Týden 12 — Práce se soubory a modulární programování v jazyce C

**Co umět / na co si dát bacha**

* `FILE *`, `fopen` / `fclose`, čtení/zápis; kontrola, že se soubor otevřel.
* Rozdělení kódu do více souborů / hlaviček — co kam patří (deklarace vs. definice).
* Trainer na tohle nemusí mít hustý „týden 1:1“ — ber přednášku + oficiální materiály.

**Tipy**

* Nezapomeň `fclose`.
* Modulární kód = méně „god file“ o 800 řádcích — souvisí se [strukturou kódu](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu).

**Trainer**

* Spíš opakuj slabá místa z dřívějška; před zkouškou: [Příprava na zkoušku I](https://trainer.ksi.fit.cvut.cz/lessons/546).

---

### Týden 13 — Abstraktní datové typy (boolean, complex, fronta, zásobník)

**Co umět / na co si dát bacha**

* ADT = „co umí“ oddělené od „jak je to uvnitř“.
* Fronta / zásobník — operace a typické použití.
* Celkový přehled semestru před zápočtem / zkouškou.

**Tipy**

* **Celé rady ke zkoušce (viditelně, ne zkrácené):** [Progtest a zkouška](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)  
  — obraty, „když nevím…“, knihovní funkce, 😿 časté chyby, postup u úlohy, taktika výběru.
* Příprava: aspoň 1 HW / týden (i po termínu), Trainer, staré zkoušky ~2 h na úlohu.
* Nesnaž se den před zkouškou učit C od nuly.
* Pročti **obě** zadání, pak vyber; rekurze/seznamy často jistější než práce s dynamickou alokací.

**Trainer**

* [Příprava na zkoušku I](https://trainer.ksi.fit.cvut.cz/lessons/546)
* [Příprava na zkoušku II](https://trainer.ksi.fit.cvut.cz/lessons/549) / [navazující lekce](https://trainer.ksi.fit.cvut.cz/lessons/550)

---

## Jak to spravit (mimo týden)

| Situace | Kam |
|--------|-----|
| Debug, flagy, paměť, pasty | [**Jak to spravit**](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit) |
| Nestíháš se v kódu vyznat / obří main | [Struktura kódu](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu) |
| Manuální testování přes copy-paste | [Testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/testovaci-skript) |
| Windows bez Linux nástrojů | [WSL](/obor-bioinformatika/1-semestr/bi-pa1/wsl-a-setup) |
| Odevzdání / **zkouška (plné rady)** | [Progtest a zkouška](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska) |

Celý Trainer kurz: [courses/81](https://trainer.ksi.fit.cvut.cz/courses/81).
