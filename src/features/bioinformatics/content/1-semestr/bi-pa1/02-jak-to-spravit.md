# Jak to spravit

**Debug · struktura · pasty** — když kód nefunguje, Progtest křičí, nebo nevíš, kde začít.

Nejde o učebnici C. Jde o **postup, jak si program opravit**: nástroje → typické pasty (dřív „SUS“) → odkazy na strukturu a testy.

* [Struktura kódu](/obor-bioinformatika/1-semestr/bi-pa1/03-struktura-kodu) — jak psát, abys to vůbec uměl debugovat  
* [Testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/04-testovaci-skript) — lokální testy bez copy-paste  
* [Zkouška — rady](/obor-bioinformatika/1-semestr/bi-pa1/06-progtest-a-zkouska) — časté chyby u zkoušky (celý seznam)  
* [Kalendář](/obor-bioinformatika/1-semestr/bi-pa1/01-kalendar)

---

## 1. Nejdřív nástroje (ne hádání)

### Přepínače `g++` (doporučený balík)

```bash
g++ ./main -o main -Wall -Wextra -pedantic -g -std=c++20
```

| Flag | K čemu |
|------|--------|
| `-Wall -Wextra -pedantic` | nahlásí co nejvíc potenciálních problémů — **vyřeš všechny** |
| `-g` | ladicí informace (čísla řádků v debuggeru / Valgrindu) |
| `-fsanitize=undefined,address` | runtime kontroly UB (např. neinicializovaná proměnná) + paměť |
| `-O2` | optimalizace; **nezlepší asymptotickou složitost** a na Progtestu tě „nezachrání“. Může ale program **shodit**, když děláš nekorektní věci (UB) — užitečné pro odhalení, ne jako „zrychlovač úkolu“ |

Sanitizer (příklad):

```bash
g++ -Wall -Wextra -pedantic -g -fsanitize=undefined,address -o main main.c
./main
```

### Když Progtest strhne strukturu a `g++` mlčí

Zkus druhý kompilátor:

```bash
clang ./main -o main -pedantic -std=c23
```

Progtest má v kategorii **cvičení** kompilátor nastavený stejně jako kontroly úkolů — zkontroluj si kód tam.

### Zakázaná slovíčka (ať nepadneš do C++)

Kromě C klíčových slov často: *new, delete, private, public, protected*.

### Paměť: sanitizer **nebo** Valgrind — ne obojí najednou

Tyto dva nástroje se **vzájemně vylučují**. Valgrind nespouštěj na binárce se sanitizerem.

**A) AddressSanitizer / UBSan** — viz flagy výše.

**B) Valgrind (memcheck)** — primárně úniky a špatná práce s pamětí:

```bash
valgrind --leak-check=full --track-origins=yes ./main
```

* `--leak-check=full` — blíž k neuvolněné paměti (čím byla alokována)  
* `--track-origins=yes` — práce s neinicializovanou pamětí  

Kompiluj s `-g`.

### NULL vs nullptr

Když kompilátor nezná `nullptr` (starší standard než C23):

```c
#ifndef nullptr
#define nullptr NULL
#endif
```

### Debugging: zobrazování polí

* jednoduše `ARRAY_NAME[SIZE]` (podle IDE/debuggeru)  
* cast: `(T(*)[SIZE])ARRAY_NAME` (`T` = `int`, `double`, `char`, …)

### printf se „neukáže hned“

Typické v CLion — výstup až po konci programu. Vynutí *vylití*:

```c
printf("TEXT\n");
fflush(stdout);
```

---

## 2. Rychlý postup „kód je rozbitý“

1. **Přečti první error kompilátoru shora** (ne poslední v cascade).  
2. Zapni `-Wall -Wextra -pedantic` a vyčisti warningy.  
3. Malý vstup ručně / [testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/04-testovaci-skript).  
4. Debugger: kde se hodnoty rozcházejí s papírem.  
5. Paměť: sanitizer **nebo** Valgrind.  
6. Když padá jen na Progtestu — **větší vstupy** lokálně (ne jen sample).  
7. Kód je spaghetti? → [struktura](/obor-bioinformatika/1-semestr/bi-pa1/03-struktura-kodu) (funkce + structy).

---

## 3. Typické pasty (dřív SUS checklist)

* [ ] Warningy ignorované „protože to stejně běží“  
* [ ] `scanf` bez kontroly návratové hodnoty  
* [ ] `scanf("%s")` „bezpečně“ — není; buffer overflow past  
* [ ] Cyklus se `strlen` na každém kroku  
* [ ] Zapomenutý `'\0'` / málo místa na něj  
* [ ] Neinicializované proměnné / paměť z `malloc`  
* [ ] `realloc` bez geometrické řady → timeout na velkých datech  
* [ ] Pointer na lokální proměnnou z funkce  
* [ ] Jeden obří `main` bez funkcí → nejde debugovat  
* [ ] Dynamické pole jako tři argumenty místo **struktury**  

Podrobně u zkoušky (včetně „když nevím…“ a 😿 chyb):  
→ **[Zkouška — rady](/obor-bioinformatika/1-semestr/bi-pa1/06-progtest-a-zkouska)**
