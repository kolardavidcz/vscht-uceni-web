# 🧪 VŠCHT Učení

Studijní portál pro studenty **VŠCHT Praha (UCT Prague)** - moderní Web Application spojující interaktivní studijní moduly a nástroje:

1. 🦠 **Systematika bakterií** - interaktivní emoji kvíz (s ukládáním rozpracovaného listu a režimem „Jen chyby“), taxonomický atlas, kartičky s aktivním opakováním a klávesovými zkratkami i srovnávací matice.
2. 📚 **Obor: Bioinformatika** - komunitní Markdown wiki s fulltextovým vyhledáváním (`Ctrl+K`), osnovou stránky, podporou MathJax i SVG grafových schémat, přehledem předmětů a průvodcem studia (PA2→AX1).
3. 🐍 **DNA/RNA & Python Analyzátor** - živý bioinformatický analyzátor sekvencí přímo v prohlížeči (FASTA, GC %, $T_m$, reverzní komplement, 3 čtecí rámce a nejdelší ORF) + čistý Python 3 skript ke stažení.

---

## 📸 Ukázky aplikace (Screenshots)

### 🏠 Hlavní rozcestník (Landing Page)
![VŠCHT Učení Rozcestník](docs/screenshots/home_screen.png)

### 🦠 Systematika bakterií - Pracovní list a Kvíz
![Systematika bakterií Kvíz](docs/screenshots/mikrobiology_test.png)

### 🌳 Atlas bakterií - Taxonomický studijní strom
![Taxonomický studijní strom](docs/screenshots/mikrobiology_tree_ovreview.png)

### 🟨 Systematika bakterií - Kartičky (Samostudium)
![Systematika bakterií Kartičky](docs/screenshots/mikrobiology_flashcards.png)

### 📊 Systematika bakterií - Srovnávací matice
![Systematika bakterií Srovnávací matice](docs/screenshots/mikrobiology_table.png)

### 📚 Obor Bioinformatika - Studijní Wiki
![Bioinformatická Wiki](docs/screenshots/wiki_page.png)

### ⭐ Bioinformatika Wiki - Hodnocení obsahu
![Wiki Hodnocení obsahu](docs/screenshots/wiki_content_rating.png)

---

## ⚡ Rychlý start (Quick Start)

Před spuštěním se ujistěte, že máte nainstalovaný balíčkovací manažer **pnpm**.

```bash
pnpm install
pnpm dev        # Spustí vývojový server na http://localhost:34020
pnpm build      # Provede typovou kontrolu (tsc) a produkční build do dist/
pnpm typecheck  # Samostatná kontrola TypeScript typů
pnpm preview    # Náhled produkčního buildu
```

---

## 🛠️ Technický Stack

| Vrstva | Technologie | Popis |
|---|---|---|
| **UI Framework** | React 19 + TypeScript | Komponentová architektura s typovou bezpečností |
| **Bundler** | Vite 6 | Multi-chunk lazy loading podle tras (code splitting) |
| **Styling** | Tailwind CSS 4 | Custom design systém s `@theme` tokeny (vřelé espresso a zářivě oranžová `#f95d12`) |
| **Routing** | React Router 7 | Klientské směrování SPA |
| **Databáze / Store** | Upstash Redis | Serverless KV úložiště pro sdílení dat a odpovědí kvízu |
| **Markdown & Math** | `react-markdown` + MathJax 3 | Vykreslování matematických vzorců a studijních textů s GFM a rehype-raw |
| **Nasazení** | Vercel | SPA rewrites, Edge API funkce a automatický build pipeline |

---

## 📁 Struktura projektu

```text
src/
├── components/
│   ├── ui/               # Znovupoužitelné UI komponenty (Button, Card, Badge, ProgressBar...)
│   └── layout/           # Základní PageShell a rozvržení stránek
├── pages/
│   └── HomePage.tsx      # Hlavní rozcestník modulů
└── features/
    ├── microbiology/     # Systematika bakterií (kvíz, strom, kartičky, matice, admin)
    ├── bioinformatics/   # Bioinformatická wiki (články v markdownu, PA2→AX1 přehled)
    └── python-analyzer/  # Python skript prohlížeč a simulovaný terminál
```

---

## 🗺️ Přehled tras (Routes)

| Cesta (Path) | Modul / Funkce | Popis |
|---|---|---|
| `/` | Hlavní rozcestník | Přehledový portál s rychlým vstupem do modulů |
| `/mikrobiologie` | Kvíz a Pracovní list | Procvičování taxonomických vlastností pomocí emoji |
| `/mikrobiologie/studijni-strom` | Taxonomický atlas | Interaktivní strom bakteriálních kmenů a rodů |
| `/mikrobiologie/samostudium` | Kartičky (Flashcards) | Samostudium a opakování vlastností mikroorganismů |
| `/mikrobiologie/srovnavaci-matice` | Srovnávací matice | Tabulkové porovnání charakteristik jednotlivých kmenů |
| `/mikrobiologie/admin` | Správa správných odpovědí | Administrace databáze vlastností a katalogu emoji (Upstash Redis) |
| `/obor-bioinformatika/*` | Bioinformatická Wiki | Studijní zápisky, návody, MathJax vzorce a rady k předmětům |
| `/python-analyza` | Python Analyzátor | Interaktivní prohlížeč skriptu pro analýzu DNA/RNA |

---

## 🎨 Design a Vizuální Identita

- **Akcentní barvy**: Teplá zářivě oranžová `#f95d12` (`text-#c2410c`).
- **Tmavé povrchy**: Espresso tmavé tóny `#0f0906` a hřejivé odstíny hnědé.
- **Typografie**: Plus Jakarta Sans (tělo textu), Outfit (nadpisy), JetBrains Mono / monospace (kód a terminál).
- **Styling**: Čisté mikro-animace, skleněný efekt (glassmorphism) a přehledná vizuální hierarchie.

---

## 💾 Datová architektura a Persistence

- **Mikrobiologie**: Taxonomie a katalog emoji jsou součástí buildu aplikace.
- **Sdílené úložiště**: Upstash Redis přes serverless endpointy `GET/POST /api/get-data` a `/api/save-data`.
- **Záložní režim**: Při výpadku sítě nebo lokálním vývoji se využívá `localStorage`.
- **Administrace**: Přístup chráněn heslem (prostřednictvím proměnné prostředí `MICROBIOLOGY_ADMIN_PASSWORD`).

---

## 🚀 Navrhování úprav ve Wiki (Upstash Redis & Admin diff)

Portál obsahuje funkci **„Navrhnout úpravu“** přímo na stránkách Wiki:

1. Student upraví text v editoru s živým náhledem a odešle návrh (`POST /api/suggest-edit`).
2. Návrh se uloží do **Upstash Redis** (`wiki:suggestions`) — bez potřeby GitHub tokenu, větví nebo redeploye.
3. Správce v administraci (`/admin` → záložka **Wiki návrhy**) zkontroluje řádkový diff a jedním klikem úpravu **publikuje živě** (případně zamítne nebo stáhne `.md` do gitu).
4. Schválené úpravy se na Wiki načítají na pozadí (`GET /api/wiki-data` s CDN cache a ETagem) nad výchozími Markdown soubory v balíku.

---

## 📬 Kontakt

[kolarv@vscht.cz](mailto:kolarv@vscht.cz)
