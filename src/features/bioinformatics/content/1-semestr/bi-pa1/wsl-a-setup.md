# Windows s nástroji Linux (WSL)

Chceš psát C na Windowsech? Budeš potřebovat **WSL** — Linux spuštěný uvnitř Windows. Dá ti kompilátor (`gcc`), debugger (`gdb`) a nástroj na hledání paměťových chyb (`valgrind`). Bez toho Progtest moc nepůjde.

## Krok 1 — Nainstaluj WSL

Otevři **PowerShell jako administrátor** a spusť:

```powershell
wsl --install
```

Windows si stáhne Ubuntu a po restartu budeš mít Linux. Při prvním spuštění si zvolíš uživatelské jméno a heslo.

> **Tip:** Video níže ukazuje instalaci krok za krokem. Na začátku a konci se věnuje VS Code - to klidně přeskoč.

> **Pozor:** Na některých počítačích je potřeba nejdřív zapnout **virtualizaci v BIOSu** (VT-x / AMD-V / SVM — záleží na výrobci). Pokud instalace selže, s AI projdi BIOS.

<iframe src="https://www.youtube.com/embed/wOimgBphkE0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

## Krok 2 — Nainstaluj vývojářské nástroje

Po instalaci WSL otevři **Ubuntu** (najdeš ho v nabídce Start) a vlož celý tento blok najednou:

```bash
sudo apt update && sudo apt upgrade -y && \
sudo apt install -y build-essential gdb clang-format valgrind
```

Co se nainstaluje:

* **build-essential** — kompilátory `gcc` / `g++` + `make`
* **gdb** — debugger (krokování programu)
* **clang-format** — automatické formátování kódu
* **valgrind** — hledání úniků paměti (budeš potřebovat ve druhé půlce semestru; viz [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit))

## Krok 3 — Ověř, že vše funguje

Zkopíruj a spusť tento test:

```bash
echo '#include <stdio.h>
int main(void){ printf("ok\n"); return 0; }' > t.c && \
gcc -Wall -o t t.c && ./t && \
echo "✓ Kompilátor funguje" && \
gdb --version | head -1 && \
valgrind --version
```

Pokud vidíš `ok` a `✓ Kompilátor funguje`, je to připravené.

---

### Doplňující nastavení

Tohle potřebuješ jen pokud WSL nefunguje jak má.

**Aktualizace WSL a ověření verze**

```bash
wsl --update && wsl --list --verbose
```

Výstup by měl ukazovat `VERSION 2`. Pokud vidíš `VERSION 1`, spusť:

```powershell
wsl --set-default-version 2
```