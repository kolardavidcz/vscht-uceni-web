# 🧠 Bi-Pa 1 (Programování v C)

Tento předmět vás provede základy algoritmizace a programování v jazyce **C**. Pro bioinformatiky je C klíčové, protože pomáhá pochopit, jak počítač pracuje s pamětí, a píší se v něm výkonné knihovny pro zpracování sekvenačních dat.

---

## 💡 Tipy, jak úspěšně projít PA1

* **Kompilace C**: Základem je naučit se kompilovat kód v terminálu s kontrolami. Poslední záchranou pro rychlé testování je [online kompilátor GDB](https://www.onlinegdb.com/).
* **Klíčová slova**: Naučte se základní příkazy a syntaxi (skvělá [referenční karta Brown University](https://www.math.brown.edu/johsilve/ReferenceCards/CRefCard.v2.2.pdf)).
* **Základní kostra programu**: Ujistěte se, že chápete, proč má C kód tuto strukturu:
  ```c
  #include <stdio.h>

  int main() {
      printf("Hello World\n");
      return 0;
  }
  ```
* **Kompilace s přísnými kontrolami**: 
  ```bash
  g++ ./main.c -std=c11 -pedantic -Wall -Wextra -o main
  ```

---

## 🎯 Vstup a výstup (Alespoň základ)
* Funkce `printf()` a `scanf()`.
* **Debugging**: Naučte se krokovat program (debugging). Umožňuje vám podívat se v každém kroku programu, jaké hodnoty jsou v proměnných a kudy kód běží. 
* *Tip:* Požádejte cvičícího nebo staršího studenta, aby vám krokování ukázal přímo ve vašem IDE (CLion/VS Code). Ušetří vám to desítky hodin tápání.

---

## 🔢 Desetinná čísla a přesnost (Float / Double)
Při porovnávání desetinných čísel nikdy nepoužívejte `a == b`, protože počítač reprezentuje desetinná čísla s omezenou přesností. Místo toho se používá malá tolerance (epsilon): `fabs(a - b) < 1e-9` (nebo konstanta `DBL_EPSILON`).

* Jak funguje epsilon a proč se používá:
  <iframe src="https://www.youtube.com/embed/bbkcEiUjehk?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>
* Vyzkoušejte si [interaktivní simulátor floatů a doublů](https://float.exposed/0x5cbf9401).

---

## ⚠️ Testování a hraniční stavy (Edge Cases)
Před spuštěním programu si nakreslete diagram nebo propočítejte na papíře, jak se vyhodnotí různé vstupy (např. nula, záporná čísla, extrémně velké hodnoty). Pomáhají **vývojové diagramy (Flowcharts)**:
<iframe src="https://www.youtube.com/embed/Yq1OPs5hCt0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

## 🍎 Analogie: Ukazatele a pole (Jablka a šuplíky)

### 1. Předávání hodnotou (Kopie)
Máme 11 jablek. Pokud funkci předáme hodnotu `pocetJablek`, předáváme jí pouze **papírek s kopií** této hodnoty:
```c
#include <stdio.h>

void mojeFunkce(int jablekVeFunkci);

int main() {
    int pocetJablek = 11;
    mojeFunkce(pocetJablek); // Předáváme kopii hodnoty (11)
    printf("Pocet jablek v main: %d\n", pocetJablek); // Stále vypíše 11
    return 0;
}

void mojeFunkce(int jablekVeFunkci) {
     jablekVeFunkci = 9; // Měníme pouze kopii, originální proměnná se nezmění!
}
```

### 2. Předávání odkazem (Ukazatele / Pointers)
Pokud chceme, aby funkce mohla originální hodnotu změnit, předáme jí **adresu schovky** (paměťového místa), kde jsou jablka uložena. K tomu slouží ukazatele (`*`) a získání adresy (`&`):
* `int * variable` – Datový typ, který neobsahuje číslo, ale **adresu na schovku**.
* `*variable` – Říká: "jdi na adresu schovky a pracuj s hodnotou uvnitř."
* `&variable` – Získá adresu schovky dané proměnné.

```c
#include <stdio.h>

void mojeFunkce2(int * jablekVeFunkci);

int main() {
    int pocetJablek = 11;
    mojeFunkce2(&pocetJablek); // Předáváme adresu (ampersandem &)
    printf("Pocet jablek po zmene: %d\n", pocetJablek); // Vypíše 9!
    return 0;
}

void mojeFunkce2(int * jablekVeFunkci) {
     *jablekVeFunkci = 9; // Na adrese schránky přepíšeme hodnotu na 9
}
```

### 3. Jednorozměrná pole (Arrays)
Abychom nemuseli posílat adresy na 30 různých schránek, pronajmeme si v paměti řadu schránek vedle sebe. Předáme pak pouze **adresu 1. schránky** a **počet prvků** (délku pole):
```c
#include <stdio.h>

void mojeFunkce3(int * odkazNaPrvniSchranku, int delka);

int main() {
    int cenyJablek[30]; // Rezervujeme si pole o velikosti 30
    for(int i = 0; i < 30; i++) {
        cenyJablek[i] = i + 10;
    }
    mojeFunkce3(cenyJablek, 30); // Jméno pole funguje jako ukazatel na 1. prvek
    return 0;
}

void mojeFunkce3(int * odkazNaPrvniSchranku, int delka) {
     // K prvkům přistupujeme pomocí indexů: odkazNaPrvniSchranku[i]
}
```

### 4. Vícerozměrná pole
Chceme uložit ceny akcií (30 dní) pro 100 různých druhů ovoce:
* **Statické 2D pole**: Rezervuje se pevná tabulka v paměti:
```c
void mojeFunkce4(int ovoce[100][30], int druhy, int dny);

int main() {
    int typyOvoce[100][30]; // 100 řádků (ovoce), 30 sloupců (dny)
    mojeFunkce4(typyOvoce, 100, 30);
    return 0;
}
```

---

## 💾 Dynamická paměť (`malloc` & `free`)
Když dopředu neznáme velikost pole, musíme paměť alokovat dynamicky na haldě (heap) pomocí `malloc()` nebo `calloc()`.
> [!IMPORTANT]
> **Zlaté pravidlo**: Každý `malloc` musí mít svůj odpovídající `free`. Pokud paměť neuvolníte, vzniká **Memory Leak** (únik paměti), což na Progtestu znamená ztrátu bodů.

Pro detekci úniků paměti použijte:
* **Valgrind**: Spuštění programu s `valgrind --leak-check=full ./main`
* **Address Sanitizer** (integrovaný v kompilátoru):
  ```bash
  gcc -fsanitize=address -g main.c -o main
  ```

---

## ⚠️ Časté studentské chyby na Progtestu

### 1. Validace vstupu
Vždy kontrolujte návratovou hodnotu `scanf`. Pokud očekáváte číslo a uživatel zadá písmeno, `scanf` neuspěje a vrátí jinou hodnotu než počet úspěšně načtených proměnných.
```c
int x;
if (scanf("%d", &x) != 1) {
    printf("Nespravny vstup.\n");
    return 1;
}
```

### 2. Zakázaná klíčová slova
Progtest v C zakazuje C++ klíčová slova. Nepoužívejte slova jako *new, delete, private, public, protected*.

### 3. Vynucení výpisu (`fflush`)
Standardní výstup (`printf`) se v některých vývojových prostředích (např. CLion na Windows) nevypisuje ihned, ale až na konci programu. Pro vynucení okamžitého výpisu použijte `fflush(stdout)`:
```c
printf("Zadejte cislo: ");
fflush(stdout);
```

---

## ⚙️ Lokální nastavení a testování (WSL)

Pro vývoj v Linuxu na Windows si nastavte **WSL (Windows Subsystem for Linux)**:
<iframe src="https://www.youtube.com/embed/wOimgBphkE0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

### Instalace potřebných balíčků ve WSL:
```bash
sudo apt update
sudo apt install build-essential gdb clang-format valgrind -y
```

### Automatické testování pomocí skriptu
Místo ručního kopírování vstupů si vytvořte skript `testshell.sh`, který automaticky porovná výstupy vašeho programu s referenčními soubory:

```bash
#!/bin/bash

PROG=./main
REFERENCE_FOLDER=CZE/*_in.txt

for IN_FILE in $REFERENCE_FOLDER; do
    REF_FILE="${IN_FILE/_in.txt/_out.txt}"
    $PROG < $IN_FILE > my_out.txt
    if ! diff $REF_FILE my_out.txt ; then
        echo "Fail: $IN_FILE";
        exit
    else
        echo "OK: $IN_FILE";
    fi
done
```