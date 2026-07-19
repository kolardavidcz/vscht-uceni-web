# Jak to spravit

**Debug · struktura · pasty** — když kód nefunguje, Progtest nadává, nebo nevíš, kde začít.

Nejde o učebnici C. Jde o **postup, jak si program opravit**: nástroje → typické pasty (dřív „SUS“) → odkazy na strukturu a testy.

* [Struktura kódu](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu) — jak psát, abys to vůbec uměl debugovat  
* [Testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/testovaci-skript) — lokální testy bez copy-paste  
* [Zkouška — rady](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska) — časté chyby u zkoušky (celý seznam)  
* [Kalendář](/obor-bioinformatika/1-semestr/bi-pa1/kalendar)

---

## 1. Nejdřív nástroje (ne hádání)

### Přepínače `g++` (doporučený balík)

```bash
g++ ./main -o main -Wall -Wextra -pedantic -g -std=c++20
```

| Flag | K čemu |
|------|--------|
| `-std=c++20` | kompiluje kód ve stejné verzi jako na Progtestu |
| `-Wall -Wextra -pedantic` | nahlásí co nejvíc potenciálních problémů — **vyřeš všechny** (je důležité v kombinaci s `-std=c++20`, aby vám hlásil stejné chyby jako Progtest) |
|`-lm`| pro používání matematických knihovnen |
| `-fsanitize=undefined,address` | runtime kontroly UB (např. neinicializovaná proměnná) + paměť |
| `-g` (pouze pro VS code, Clion to za vás řeší jinak) | ladicí informace (čísla řádků v debuggeru / Valgrindu) |
| `-O2` | optimalizace; **nezlepší asymptotickou složitost** a na Progtestu tě „nezachrání“. Může ale program **shodit**, když děláš nekorektní věci (UB) — užitečné pro odhalení, ne jako „zrychlovač úkolu“ |


Sanitizer (příklad):

```bash
g++ -Wall -Wextra -pedantic -std=c++20 -g -fsanitize=undefined,address -o main main.c
./main
```

### **Zakázaná slovíčka** (ať nepadneš do C++)

Kromě C klíčových slov často: ***new, delete, private, public, protected***.

### Printf debugging — v případě nouze

V úplně prvních hodinách není debugger komfortní volba, ze začátku tedy stačí `printf`.

**Pravidlo:** Vypisuj vždy **co funkce dostala** a **co vrátí** — a uvnitř cyklu **stav v každém kroku**.

```c
TYP nazev_funkce(ARGUMENTY) {
    printf("[DBG] vstup: ARGUMENTY=%d\n", ARGUMENTY);  // co funkce dostala
    // KOMPILOVANÝ_KÓD
    for (...) {
        // KOMPILOVANÝ_KÓD
        printf("[DBG] i=%d, PROMENA=%d\n", i, PROMENA);  // stav v každém kroku
    }
    // KOMPILOVANÝ_KÓD
    printf("[DBG] vystup: HODNOTA=%d\n", HODNOTA);  // co vrátí
    return HODNOTA;
}
```

Díky prefixu `[DBG]` pak najdeš a smažeš všechny výpisy jedním vyhledáváním před odevzdáním.

### printf se „neukáže hned"

Pokud `printf` nic nevypíše ani po spuštění, přidej `fflush(stdout);` hned za něj — CLion s tím má problém.

```c
printf("TEXT\n");
fflush(stdout);
```

## 3. Jak číst chybu kompilátoru

Kompilátor píše chyby odshora. **První chyba je ta pravá** — zbytek jsou často jen domino efekt.

```
main.c:12:5: error: use of undeclared identifier 'pocet'
    pocet = n * 2;
    ^
```

Čti takto: **soubor : řádek : sloupec → co se stalo → kde přesně**.

Nejčastější hlášky a co znamenají:

| Hláška | Příčina |
|--------|---------|
| `undeclared identifier` | překlep, nebo jsi zapomněl deklarovat proměnnou |
| `expected ';'` | chybějící středník — hledej o řádek výš |
| `implicit declaration of function` | zapomněl jsi `#include` nebo funkci deklarovat před použitím |
| `assignment to expression with array type` | zkusil jsi přiřadit pole jako `arr = ...` — to nejde, kopíruj prvky cyklem |
| `control reaches end of non-void function` | funkce slibuje `return` hodnotou, ale někde cesta nekončí `return` |
| `format '%d' expects argument of type 'int*'` | špatný typ v `scanf`/`printf` — nejčastěji zapomenutý `&` |


## Práce s alokovanou pamětí

### Debugging: zobrazování polí

V debuggeru vidíš pointer, ale ne celé pole — standardně ukáže jen první prvek. Takhle ho rozbalíš:

**VS Code (s WSL / gcc)**

V záložce *Variables* nebo *Watch* přidej výraz:

```
NAZEV_POLE, VELIKOST_CO_CHCI_ZOBRARIT
```

**CLion**

V záložce *Variables* nebo *Evaluate Expression* (`Alt+F8`) použij cast:

```
(T(*)[SIZE])NAZEV_POLE
```

kde `T` = datový typ prvků (`int`, `double`, `char`, …) a `SIZE` = počet prvků, které chceš vidět.


**Příklad** — máš `int arr[5] = {1,2,3,4,5}`:

| IDE | Co napsat do Watch |
|-----|--------------------|
| VS Code | `arr,5` |
| CLion | `(int(*)[5])arr` |

> **Tip:** `SIZE` nemusí odpovídat deklarované délce — klidně dej větší číslo, pokud chceš vidět dál. Obsah za koncem pole je nedefinovaný, ale debugger ho ukáže (užitečné pro hledání off-by-one chyb).

### Paměť: sanitizer **nebo** Valgrind — **ne obojí najednou**

Tyto dva nástroje se **vzájemně vylučují**. Valgrind nespouštěj na binárce se sanitizerem.

**A) AddressSanitizer / UBSan** — viz flagy výše.

**B) Valgrind (memcheck)** — primárně úniky a špatná práce s pamětí:

```bash
valgrind --leak-check=full --track-origins=yes ./main
```

* `--leak-check=full` — blíž k neuvolněné paměti (čím byla alokována)
* `--track-origins=yes` — práce s neinicializovanou pamětí

> **Pozor:** Valgrind potřebuje `-g` při kompilaci (ladicí symboly). CLion to přidá automaticky v Debug módu; ve WSL přidej `-g` ručně.

### NULL vs nullptr

Když kompilátor nezná `nullptr` (starší standard než C23):

```c
#ifndef nullptr
#define nullptr NULL
#endif
```

---

## 4. Rychlý postup „kód je rozbitý“

1. **Přečti první error kompilátoru shora** (ne poslední v cascade).  
2. Zapni `-Wall -Wextra -pedantic` a vyčisti warningy.  
3. Malý vstup ručně / [testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/testovaci-skript).  
4. Debugger: kde se hodnoty rozcházejí s papírem.  
5. Paměť: sanitizer **nebo** Valgrind.  
6. Když padá jen na Progtestu — napiš si vlastní testovací vstupy
 * **vlastní** předpočítej si vlastní testovací data, čím záludnější, tím lepší (ne jen sample)
 * **větší vstupy** zkus nakopírovat nějaký test několikrát za/do sebe.  
7. Kód je spaghetti? → [struktura](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu) (funkce + structy).

---

## 5. Typické pasti

* [ ] Ignorované warningy „protože to stejně běží“  
* [ ] `scanf` bez kontroly návratové hodnoty  
* [ ] Zapomenutý `'\0'` / málo místa v poli na něj  
* [ ] Cyklus se `strlen` na každém kroku  
* [ ] Neinicializované proměnné / paměť z `malloc`  
* [ ] zvětšování `realloc` lineáně (`nova_velikost = stara_velikost + 100`) a ne geometricky `nova_velikost = stara_velikost*1.5 + 10` → zbytečné zpomalování v testech s velkými daty  
* [ ] Pointer na lokální proměnnou z funkce
* [ ] Jeden obří `main` bez funkcí → špatně se debuguje (nebo spíš stojí nervy na debuggování)
* [ ] Dynamické pole jako tři argumenty místo **struktury**
---
* [ ] `scanf("%s")` „bezpečně“ — není; buffer overflow past 
* Podrobný seznam chyb u zkoušky: **[Zkouška — rady](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)**

