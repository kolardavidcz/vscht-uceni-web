# Windows s nástroji Linux (WSL)

Setup pro PA1 na Windows — ať máš kompilátor, debugger a později Valgrind.  
Zpět: [kalendář · týden 1](/obor-bioinformatika/1-semestr/bi-pa1/01-kalendar).

---

## WSL

* Nastavení BIOSu (před spuštěním systému) se může lišit podle výrobce — budete muset povolit tzv. **virtualizaci** (VT-x / AMD-V / SVM — podle CPU).
* Video se na začátku a konci věnuje VS Code. Můžete se soustředit jen na **WSL**. Pokud používáte CLion: *Settings → Build, Execution, Deployment → Toolchains* → `+` → WSL.

<iframe src="https://www.youtube.com/embed/wOimgBphkE0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

### Doplňující nastavení

**Kontrola aktuality**

```bash
wsl --update
```

**WSL verze 2**

```bash
wsl --list --verbose
```

Pokud máte `VERSION 1`:

```bash
wsl --set-version <NAZEV_DISTRA> 2
```

nebo obecně:

```bash
wsl --set-default-version 2
```

### Balíčky uvnitř Linuxu (Ubuntu-like)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install build-essential gdb clang-format valgrind -y
```

* **build-essential** — základní pack: kompilátory (`gcc`, `g++`), `make`, …
* **GDB** — debugger
* **clang-format** — formátování / kontrola zápisu
* **Valgrind** — kontrola dynamické paměti (viz druhá polovina semestru; [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/02-jak-to-spravit))

### Rychlý smoke test

```bash
echo '#include <stdio.h>
int main(void){ printf("ok\\n"); return 0; }' > t.c
gcc -Wall -o t t.c && ./t
```

Když tohle neprojde, neřeš ještě Progtest — nejdřív setup.
