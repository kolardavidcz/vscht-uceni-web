# 1 · WSL a vývojové prostředí

> 💡 **ZLATÉ PRAVIDLO: NEJDŘÍV PROGRAMOVAT, AŽ PAK LADIT PROSTŘEDÍ!**  
> Nejdůležitější věcí na začátku studia je **začít okamžitě programovat a psát kód**, ne se na celé dny zaseknout na instalaci Linuxu, konfiguraci editorů či ladění chybějících knihoven.  
> I když lokální prostředí a kódování jdou časem ruku v ruce, pokud vám WSL nebo IDE hned nenaskočí, nepanikařte: otevřete si online GCC kompilátor (např. [OnlineGDB](https://www.onlinegdb.com/)) a začněte psát a zkoušet úlohy přímo v prohlížeči. Plnohodnotné lokální prostředí v klidu dořešíte během prvního týdne (třeba na zářijové hromadné instalaci na FITu).

---

## Proč Linux / WSL pro BI-PA1?

Na FITu i v bioinformatice obecně se pracuje především v operačním systému **Linux**. Programy psané v C, které budete řešit v PA1 a odevzdávat do Progtestu, se na Windows a Linuxu chovají odlišně (správa paměti, vstup/výstup, kompilátory).

Nejsnazší cestou na Windows bez nutnosti přeinstalovat systém je **WSL (Windows Subsystem for Linux)** — plnohodnotný Linux běžící uvnitř Windows, který vám dá `gcc`, `gdb` a `valgrind`.

---

## Krok 1 — Nainstaluj WSL

Otevři **PowerShell jako administrátor** a spusť:

```powershell
wsl --install
```

Windows si stáhne Ubuntu a po restartu budeš mít Linux. Při prvním spuštění si zvolíš uživatelské jméno a heslo.

> **Tip:** Video níže ukazuje instalaci krok za krokem. Na začátku a konci se věnuje VS Code — to klidně přeskoč.

> **Pozor:** Na některých počítačích je potřeba nejdřív zapnout **virtualizaci v BIOSu** (VT-x / AMD-V / SVM — záleží na výrobci). Pokud instalace selže, s AI projdi BIOS.

<iframe src="https://www.youtube.com/embed/wOimgBphkE0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

## Krok 2 — Nainstaluj vývojářské nástroje

Po instalaci WSL otevři aplikaci **Ubuntu** (najdeš ji v nabídce Start) a vlož celý tento blok najednou:

```bash
sudo apt update && sudo apt upgrade -y && \
sudo apt install -y build-essential gdb clang-format valgrind
```

Co se nainstaluje:
* **build-essential** — kompilátory `gcc` / `g++` + `make`
* **gdb** — debugger (krokování programu)
* **clang-format** — automatické formátování kódu
* **valgrind** — hledání úniků paměti (budeš potřebovat ve druhé půlce semestru; viz [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit))

---

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

Pokud vidíš `ok` a `✓ Kompilátor funguje`, prostředí je připravené k programování.

---

## 🛠️ Alternativy & Užitečné tipy z FITu

### 1. Zářijová hromadná instalace Linuxu na FITu
Koncem září se na FIT ČVUT pravidelně koná **hromadná instalace Linuxu**, kde vás zkušení starší studenti rádi provedou instalací WSL, čistého Linuxu i řešením problémů s hardwarem. Sledujte oznámení na FIT Discordu!

### 2. Dual-boot (Windows + Linux)
Pokud dáváte přednost nativnímu Linuxu (např. Ubuntu nebo Linux Mint) vedle Windows:
> ⚠️ **Kritické pravidlo pro Dual-boot**:  
> Vždy nejprve nainstalujte **Windows a až poté Linux**! Instalátor Linuxu (GRUB) automaticky rozpozná Windows a vytvoří výběrové menu. Pokud byste instalovali v opačném pořadí, instalátor Windows přepíše zavaděč Linuxu.

### 3. Nastavení CLionu s WSL
Pokud jako vývojové prostředí zvolíte JetBrains CLion (studenti mají licenci zdarma):
1. V menu otevřete **Settings** $\to$ **Build, Execution, Deployment** $\to$ **Toolchains**.
2. Klikněte na symbol **`+`** (vlevo nahoře) a vyberte **WSL**.
3. CLion automaticky detekuje kompilátory `gcc`, `gdb` a `clang-format` z vaší WSL distribuce.

---

### Doplňující nastavení WSL

Tohle potřebuješ jen pokud WSL nefunguje jak má.

**Aktualizace WSL a ověření verze**

```bash
wsl --update && wsl --list --verbose
```

Výstup by měl ukazovat `VERSION 2`. Pokud vidíš `VERSION 1`, spusť:

```powershell
wsl --set-default-version 2
```