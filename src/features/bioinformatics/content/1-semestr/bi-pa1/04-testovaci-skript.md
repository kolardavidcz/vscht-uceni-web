# Testovací skript

Lokální testování bez copy-paste do `scanf` pořád dokola.  
Souvisí s [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/02-jak-to-spravit) a [kalendářem](/obor-bioinformatika/1-semestr/bi-pa1/01-kalendar) (od vstupu/výstupu dál).

U zkoušky / padajícího Progtestu: nejdřív sample, pak **větší vstupy** + nástroje z [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/02-jak-to-spravit).

---

## Testování z příkazové řádky (stdin z řetězce)

Pokud testujete program opakovaným copy-pastováním pro `scanf` / `fgets` / `getline`, jde si stdin „nacpat“ i z kódu (Linux/WSL; potřebuje unistd/pipe):

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

/* tvůj kód může být v my_main() — nebo uprav podle svého main */

void my_main(void);

int main(void) {
    char *input_data = "TESTOVACI DATA\nDRUHY RADEK\n";

    int p[2];
    pipe(p);
    write(p[1], input_data, strlen(input_data));
    close(p[1]); /* poslat EOF */
    dup2(p[0], STDIN_FILENO);
    close(p[0]);

    my_main();
    return 0;
}
```

*(Původní vtipný testovací string si klidně nech — tady je jen bezpečnější varianta do veřejného support textu.)*

---

## Testování ze souboru (doporučená cesta)

Na testování **nepotřebujete VS Code** (takže se neděste, že ho někdo ve videu používá).

<iframe src="https://www.youtube.com/embed/dsTzuD1agPE?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

### Co mít ve stejné složce

1. **Sestavený program** (např. `./main` nebo `./a.out`)
2. **Složku s testy** — typicky `CZE/` se soubory `*_in.txt` a odpovídajícími `*_out.txt`
3. **Testovací skript** (níže)

### Příklad `testshell.sh`

```bash
#!/bin/bash
set -euo pipefail

PROG=./main
REFERENCE_FOLDER=CZE/*_in.txt

for IN_FILE in $REFERENCE_FOLDER; do
  REF_FILE="${IN_FILE/_in.txt/_out.txt}"
  "$PROG" < "$IN_FILE" > my_out.txt
  if ! diff -u "$REF_FILE" my_out.txt; then
    echo "Fail: $IN_FILE"
    exit 1
  else
    echo "OK: $IN_FILE"
  fi
done
```

Spuštění (WSL / Linux):

```bash
chmod +x testshell.sh
g++ -Wall -pedantic -std=c++20 -o main main.c   # nebo main.cpp — podle tebe
./testshell.sh
```

### Tip

* CRLF (Windows konce řádků) umí rozbít `diff` — v WSL pomůže `dos2unix` na testy, nebo sjednoť konce řádků v editoru.
* Až půjde o paměť: nejdřív správný výstup, pak [Valgrind / sanitizer](/obor-bioinformatika/1-semestr/bi-pa1/02-jak-to-spravit).
