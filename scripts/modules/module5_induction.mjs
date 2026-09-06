/**
 * Module 5: Indukce na Grafech & Redukční Past
 * Source: src/features/bioinformatics/content/3-semestr/pre-ag1/dml-indukce-na-grafech.md
 * Exact 1:1 text fidelity with website markdown.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createTableSlide
} from "../pptx_engine.mjs";

export function addModule5Slides(pres) {
  const breadcrumb = "5 · Indukce na Grafech & Redukční Past";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 5,
    title: "Indukce na Grafech & Redukční Past",
    goal: "Cíl kapitoly: Pochopit, jak se v matematice dokazuje tvrzení pro všechny grafy najednou — a vyhnout se pasti, do které padne polovina studentů u zkoušky.",
    topics: [
      "🎯 Dominová analogie (vážně, takhle to funguje)",
      "☕ Příklad: Platba mincemi (3 Kč a 5 Kč) — V(n) pro n ≥ 8",
      "Metoda 1: Důkaz Slabou Indukcí (Pravidlo výměny mincí)",
      "Metoda 2: Důkaz Silnou Indukcí (Krok o 3 Kč zpět: n+1 z n-2)",
      "1. Peano Axiomy a Princip Matematické Indukce",
      "2. 🚨 CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční Indukce",
      "Proč vyučující udělují 0 bodů & Správný dekonstrukční postup",
      "3. Růst Počtu Hran při Dekonstrukci Sítě: Vrcholy Stupně 3",
      "Zlaté pravidlo teorie grafů: E(n) = E(n-1) + deg(v)",
      "4. Stromy v Letní Přípravě: Proč má strom m = n - 1 hran",
      "5. 💡 Propojení s Bioinformatikou: Orientované Sítě bez Cyklů (DAGy)",
      "Zdroj (Source), Výtok (Sink) a Topologické uspořádání",
      "6. Přehled: Co je základ letní přípravy a co přijde v AG1"
    ]
  });

  // 2. Dominová analogie
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "🎯 Dominová Analogie (Vážně, Takhle to Funguje)",
    leftCard: {
      title: "Princip Dominového Efektu",
      badge: "DOMINO",
      type: "neutral",
      items: [
        { bold: "Znáš dominový efekt?:", text: "Postavíš řadu kostek a první padne na druhou, druhá na třetí… Matematická indukce je přesně tohle:" },
        { bold: "1. Báze:", text: "Ukážeš, že první kostka padne. (Tvrzení platí pro nejmenší případ)." },
        { bold: "2. Krok:", text: "Ukážeš, že POKUD kostka č. k padne, NUTNĚ padne i kostka č. k+1. (Z pravdivosti pro k plyne pravdivost pro k+1)." },
        { bold: "3. Závěr:", text: "Všechny kostky padnou. (Tvrzení platí pro všechna n)." }
      ]
    },
    rightCard: {
      title: "Fungování na Grafech",
      badge: "NA GRAFECH",
      type: "warm",
      items: [
        { bold: "Na grafech to funguje stejně:", text: "jen místo „kostky č. k“ říkáme „graf s k vrcholy“." },
        { bold: "Klíčový trik:", text: "Nestavíme grafy od nuly nahoru, ale rozebíráme je od větších k menším." },
        { bold: "Intuice bez vzorce:", text: "Indukce = nejprve dokážeš malý případ, pak ukážeš, že každý větší případ se dá rozebrat na menší. A to stačí pro důkaz pro všechna n najednou." }
      ]
    }
  });

  // 3. Příklad Mince - Zadání
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "☕ Příklad: Platba Mincemi (3 Kč a 5 Kč)",
    cardTitle: "Tvrzení V(n) pro Všechna n ≥ 8",
    badge: "KLASIKA ZE ZKOUŠEK",
    type: "warm",
    items: [
      { bold: "Zadání úlohy:", text: "Dokážeme, že pomocí mincí s hodnotami 3 Kč a 5 Kč lze přesně vyplatit libovolnou celočíselnou částku ve výši alespoň 8 Kč (aniž by nám muselo být vraceno)." },
      { bold: "Formulace V(n):", text: "Pro všechna n ≥ 8 dokazujeme tvrzení V(n): „Částku n Kč lze přesně vyplatit pouze s použitím tříkorun a pětikorun.“" },
      { bold: "Dva způsoby důkazu:", text: "Ukážeme si 2 způsoby důkazu: Metoda 1 (Důkaz Slabou Indukcí — pravidlo výměny mincí) a Metoda 2 (Důkaz Silnou Indukcí — krok o 3 Kč zpět)." }
    ]
  });

  // 4. Mince: Metoda 1 - Slabá Indukce
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Mince Metodou 1: Důkaz Slabou Indukcí",
    leftCard: {
      title: "Báze a Případy A, B",
      badge: "SLABÁ INDUKCE",
      type: "neutral",
      items: [
        { bold: "1. Báze indukce:", text: "Pro n = 8 máme 8 = 3 + 5 Kč. Platí V(8) ✅." },
        { bold: "2. Indukční krok (n ⇒ n + 1):", text: "Předpokládejme, že částku n Kč (kde n ≥ 8) máme vyplacenu v mincích 3 Kč a 5 Kč (IP). Chceme z ní vytvořit částku n + 1 Kč. Nahlédneme do peněženky:" },
        { bold: "Případ A (V peněžence jen 5 Kč):", text: "Jednu 5 Kč odebereme a nahradíme dvěma 3 Kč: 5 Kč ➔ 3 Kč + 3 Kč (čistá změna: -5 + 6 = +1 Kč)." },
        { bold: "Případ B (V peněžence je 5 Kč i 3 Kč):", text: "Pětikorunu vyměníme za dvě tříkoruny: (5 Kč) + 3 Kč ➔ (3 Kč + 3 Kč) + 3 Kč = 3 + 3 + 3 (čistá změna: +1 Kč)." }
      ]
    },
    rightCard: {
      title: "Případ C a Závěr",
      badge: "VÝMĚNA MINCÍ",
      type: "warm",
      items: [
        { bold: "Případ C (V peněžence není žádná 5 Kč):", text: "Protože částka je n ≥ 8 a skládá se výhradně z tříkorun, musíme mít alespoň tři tříkoruny (3 × 3 = 9 Kč; dvě dávají jen 6 Kč < 8)." },
        { bold: "Výměna mincí:", text: "Vezmeme tyto tři tříkoruny a nahradíme je dvěma pětikorunami: 3 Kč + 3 Kč + 3 Kč ➔ 5 Kč + 5 Kč (čistá změna: -9 + 10 = +1 Kč). Částka vzrostla přesně na n + 1 Kč!" },
        { bold: "Závěr:", text: "Ve všech případech jsme z libovolné platné výplaty n Kč sestrojili výplatu n + 1 Kč. Podle principu slabé indukce tvrzení platí pro všechna celá čísla n ≥ 8." }
      ]
    }
  });

  // 5. Mince: Metoda 2 - Silná Indukce
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Mince Metodou 2: Důkaz Silnou Indukcí",
    leftCard: {
      title: "1. Báze Indukce (3 Částky)",
      badge: "3 BÁZOVÉ PŘÍPADY",
      type: "neutral",
      items: [
        { bold: "Pro n = 8:", text: "8 = 3 + 5 Kč. Platí V(8) ✅." },
        { bold: "Pro n = 9:", text: "9 = 3 + 3 + 3 Kč. Platí V(9) ✅." },
        { bold: "Pro n = 10:", text: "10 = 5 + 5 Kč. Platí V(10) ✅." },
        { bold: "Proč 3 báze?:", text: "Zde si vystačíme bez jakékoliv výměny mincí v peněžence — stačí nám 3 základní bázové případy a v indukčním kroku se vždy odvoláme na stav o 3 Kč menší." }
      ]
    },
    rightCard: {
      title: "2. Indukční Krok (od n + 1 ≥ 11)",
      badge: "KROK O 3 KČ ZPĚT",
      type: "emerald",
      items: [
        { bold: "Silný IP:", text: "Předpokládejme, že všechny částky od 8 do n Kč již umíme vyplatit (Silný IP). Chceme vyplatit částku n + 1 Kč (kde n + 1 ≥ 11)." },
        { bold: "Odečtení 3 Kč:", text: "Vezmeme částku o 3 Kč menší, tedy (n + 1) - 3 = n - 2 Kč. Protože n + 1 ≥ 11, platí n - 2 ≥ 8. Dle silného IP tedy částku n - 2 Kč už umíme vyplatit." },
        { bold: "Přidání tříkoruny:", text: "K této sestavě mincí nyní stačí přidat jednu tříkorunu (+3 Kč): (n - 2) + 3 = n + 1 Kč. Tím jsme přesně vyplatili n + 1 Kč, což jsme potřebovali dokázat!" }
      ]
    }
  });

  // 6. Section 1: Peano Axiomy a Princip Indukce
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Peano Axiomy a Princip Matematické Indukce",
    leftCard: {
      title: "Slabá Matematická Indukce",
      badge: "SLABÁ INDUKCE",
      type: "neutral",
      items: [
        { bold: "1. Báze indukce:", text: "Dokážeme, že P(n₀) platí pro nejmenší případ (např. n₀ = 1)." },
        { bold: "2. Indukční krok:", text: "Pro libovolné k ≥ n₀ dokážeme implikaci: P(k) ⇒ P(k+1)." },
        { bold: "Indukční předpoklad (IP):", text: "Předpoklad P(k) nazýváme Indukční předpoklad." }
      ]
    },
    rightCard: {
      title: "Silná Matematická Indukce na Grafech",
      badge: "SILNÁ INDUKCE",
      type: "warm",
      items: [
        { bold: "Formule silné indukce:", text: "( P(n₀) ∧ ∀k ≥ n₀ : ( ⋀_{i=n₀}^k P(i) ⇒ P(k+1) ) ) ⇒ ∀n ≥ n₀ : P(n)." },
        { bold: "Čtení formalismu:", text: "⋀_{i=n₀}^k je jen velká konjunkce AND pro všechny mezistavy od n₀ do k, stejně jako ∑ je velký součet." },
        { bold: "Aplikace na grafy:", text: "Při aplikaci na grafy nepředstavuje induktivní proměnná n pouhé číslo, ale velikost grafové struktury: počet vrcholů n = |V| (počet atomů v molekule, proteinů v síti), nebo počet hran m = |E| (počet vazeb, enzymatických reakcí)." }
      ]
    }
  });

  // 7. Section 2: Critical Exam Trap
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "2. 🚨 CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční",
    leftCard: {
      title: "❌ Špatný Postup (Redukční Past)",
      badge: "0 BODŮ U ZKOUŠKY",
      type: "rose",
      items: [
        { bold: "Typická chyba studentů:", text: "„Předpokládejme, že tvrzení platí pro graf G_n s n vrcholy. Nyní sestrojíme nový graf G_{n+1} tak, že k G_n přidáme jeden nový vrchol v a připojíme ho hranami k nějakým vrcholům…“" },
        { bold: "Proč vyučující udělují 0 bodů?:", text: "Pokud začnete od grafu G_n a přidáte nový prvek, dokázali jste tvrzení POUZE pro ty grafy o n+1 vrcholech, které lze vytvořit tímto konkrétním přidáním! Neověřili jste, zda každý obecný graf s n+1 vrcholy lze z nějakého menšího grafu takto vybudovat. Opomněli jste celou třídu grafů! Váš důkaz platí pro speciálně vytvořené grafy, ne pro všechny platné grafy." }
      ]
    },
    rightCard: {
      title: "✅ Správný Postup (Dekonstrukční Indukce)",
      badge: "100 % SPRÁVNĚ",
      type: "emerald",
      items: [
        { bold: "Správný postup:", text: "„Vezměme LIBOVOLNÝ ZADANÝ graf G = (V, E) o n+1 vrcholech (který splňuje předpoklady věty). Najdeme v něm vhodný prvek (např. list nebo vrchol minimálního stupně), odebereme ho a získáme podgraf G'. Podgraf G' má n vrcholů. Ověříme, že G' stále splňuje předpoklady věty. Použijeme Indukční předpoklad (IP) na podgraf G'. Nakonec prvek vrátíme a dokážeme, že platnost tvrzení se přenese i na původní celkový G.“" }
      ]
    }
  });

  // 8. Schéma myšlenkového toku dekonstrukční indukce
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Správný Myšlenkový Tok Dekonstrukční Indukce",
    cardTitle: "Tři Fáze Dekonstrukce Shora Dolů",
    badge: "SCHÉMA POSTUPU",
    type: "warm",
    items: [
      { bold: "1. Začínáme shora (Libovolný zadaný objekt):", text: "LIBOVOLNÝ Graf G o velikosti (n+1) ➔ Začínáme zde! Odebereme prvek / list / hranu." },
      { bold: "2. Přechod k podgrafu a aplikace IP:", text: "Podgraf G' o velikosti (n) ➔ Aplikujeme Indukční předpoklad (IP)! Dle IP tvrzení na G' platí." },
      { bold: "3. Návrat prvku a závěr pro celek:", text: "Vrátíme odebraný prvek a dokážeme platnost pro původní G o velikosti (n+1). Závěr pro G(n+1) je hotov." }
    ]
  });

  // 9. Hlubší vhled: Dekonstrukční přístup u grafů i čísel
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Dekonstrukční Přístup u Grafů i Čísel",
    leftCard: {
      title: "V Grafech (Slabá Indukce Shora)",
      badge: "GRAFOVÁ DEKONSTRUKCE",
      type: "emerald",
      items: [
        { bold: "1. Libovolný graf:", text: "Vezmeme libovolný graf G o n+1 vrcholech." },
        { bold: "2. Odebrání prvku:", text: "Odebereme 1 prvek (např. list deg(v) = 1 u stromu)." },
        { bold: "3. Podgraf G':", text: "Získáme podgraf G' o přesně n vrcholech." },
        { bold: "4. Aplikace IP:", text: "Na podgraf G' aplikujeme slabý indukční předpoklad P(n)." },
        { bold: "5. Návrat:", text: "Prvek vrátíme a dokážeme, že vlastnost platí pro původní G." }
      ]
    },
    rightCard: {
      title: "V Mincích (Dekonstrukce z n+1 Shora na n)",
      badge: "ČÍSELNÁ DEKONSTRUKCE",
      type: "neutral",
      items: [
        { bold: "Cílová částka:", text: "Máme cílovou částku n+1 Kč (n+1 ≥ 9). Chceme z ní odebráním/výměnou získat částku n Kč (změna -1 Kč), abychom použili slabý IP P(n):" },
        { bold: "Případ 1 (Alespoň dvě 3 Kč mince):", text: "Vyměníme 3 + 3 ➔ 5 Kč (čistá změna -6 + 5 = -1 Kč, získáme částku n Kč)." },
        { bold: "Případ 2 (Nemáme dvě 3 Kč mince):", text: "Částka se skládá převážně z pětikorun (musí mít alespoň dvě 5 Kč). Vyměníme 5 + 5 ➔ 3 + 3 + 3 Kč (čistá změna -10 + 9 = -1 Kč, opět získáme n Kč)." }
      ]
    }
  });

  // 10. Silná indukce shora & Pravidlo bází
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Silná Indukce Shora a Velikost Báze",
    leftCard: {
      title: "Silná Indukce: Odebírání bez Výměn",
      badge: "BEZ VÝMĚN",
      type: "neutral",
      items: [
        { bold: "Podstata:", text: "Zatímco slabá indukce musí skákat o 1 (n+1 ➔ n), což u mincí vyžadovalo výměny, silná indukce výměny vůbec nepotřebuje — stačí odebrat celou minci či blok: (n + 1) = ((n + 1) - k) + k." },
        { bold: "3 fundamentální bloky rozkladu:", text: "Každá platba n ≥ 8 Kč obsahuje alespoň jeden z těchto bloků k odebrání:" },
        { bold: "• 3 + 5 = 8 Kč:", text: "(pokud máme 3 i 5)" },
        { bold: "• 3 + 3 + 3 = 9 Kč:", text: "(pokud máme jen trojky)" },
        { bold: "• 5 + 5 = 10 Kč:", text: "(pokud máme jen pětky)" }
      ]
    },
    rightCard: {
      title: "Pravidlo pro Velikost Báze",
      badge: "PRAVIDLO BÁZE",
      type: "warm",
      items: [
        { bold: "Pravidlo pro velikost báze:", text: "O kolik kroků zpět dekonstruujeme, tolik bází musíme ověřit ručně:" },
        { bold: "Odebrání 3 Kč (n ➔ n - 3):", text: "n - 3 ≥ 8 ⇒ n ≥ 11, vyžaduje 3 báze: {8, 9, 10}." },
        { bold: "Odebrání 3+3 = 6 Kč (n ➔ n - 6):", text: "n - 6 ≥ 8 ⇒ n ≥ 14, vyžaduje 6 bází: čísla 8 až 13." }
      ]
    }
  });

  // 11. Section 3: Růst počtu hran - Vrcholy stupně 3
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3. Růst Počtu Hran při Dekonstrukci Sítě",
    leftCard: {
      title: "Motivace z Bioinformatiky a Chemie",
      badge: "BIOINFORMATIKA",
      type: "neutral",
      items: [
        { bold: "Fixní valence:", text: "V biologických a chemických sítích často pracujeme s uzly, které mají fixní valenci (počet vazeb):" },
        { bold: "Aromatické kruhy:", text: "sp² uhlíkové atomy v aromatických kruzích a grafenu se vážou právě se 3 sousedy (deg(v) = 3)." },
        { bold: "RNA a proteiny:", text: "Terciární větvení v molekulách RNA nebo proteinových doménách vytváří křižovatky stupně 3." },
        { bold: "Kubické sítě:", text: "V informatice se sítím, kde má každý uzel stupeň 3, říká kubické (3-regulární) sítě." }
      ]
    },
    rightCard: {
      title: "Tvrzení: Rekurentní Vztah pro Počet Hran",
      badge: "REKURENTNÍ VZTAH",
      type: "warm",
      items: [
        { bold: "Tvrzení:", text: "Nechť G = (V, E) je graf o n vrcholech, který obsahuje vrchol v se stupněm deg(v) = 3. Pokud vrchol v odebereme, získáme podgraf G' = G ∖ {v} o n - 1 vrcholech." },
        { bold: "Přesný vztah:", text: "E(n) = E(n-1) + 3" },
        { bold: "Obecně pro stupeň d:", text: "V bioinformatických textech se často píše edge(n) = edge(n-1) + 3, obecně pro vrchol libovolného stupně d: E(n) = E(n-1) + d." }
      ]
    }
  });

  // 12. Dekonstrukční Důkaz Indukcí pro Stupeň 3
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Dekonstrukční Důkaz Indukcí (Vrchol Stupně 3)",
    leftCard: {
      title: "1. Start & 2. Odebrání Uzlu",
      badge: "DEKONSTRUKCE",
      type: "neutral",
      items: [
        { bold: "1. Volba libovolného grafu:", text: "Mějme libovolný zadaný graf G = (V, E) o n vrcholech, který obsahuje uzel v se stupněm deg(v) = 3. Počet hran tohoto grafu označme E(n) = |E|." },
        { bold: "2. Odebrání uzlu:", text: "Z grafu G odebereme vrchol v a všechny hrany, které do něj vstupují (jsou to právě hrany {v, u₁}, {v, u₂}, {v, u₃})." },
        { bold: "Získaný podgraf G':", text: "Počet vrcholů klesl o 1: |V(G')| = n - 1. Počet hran klesl přesně o 3: |E(G')| = E(n) - 3. Označme počet hran v G' jako E(n-1) = |E(G')|." }
      ]
    },
    rightCard: {
      title: "3. Vyjádření & 4. Návrat Prvku",
      badge: "INDUKČNÍ ZÁVĚR",
      type: "emerald",
      items: [
        { bold: "3. Přímé vyjádření vztahu:", text: "Jednoduchou úpravou rovnosti E(n-1) = E(n) - 3 dostáváme: E(n) = E(n-1) + 3." },
        { bold: "4. Návrat prvku a indukční závěr:", text: "Vrátíme-li uzel v zpět do grafu G', každá z jeho 3 hran se připojí k vrcholům u₁, u₂, u₃, které v G' již existují. K existujícím E(n-1) hranám tedy přibudou přesně 3 hrany." },
        { bold: "Závěr:", text: "Tím je dokázáno, že přidáním/odebráním uzlu stupně 3 se počet hran mění přesně o 3." }
      ]
    }
  });

  // 13. Zlaté pravidlo teorie grafů: Tabulka
  createTableSlide(pres, {
    breadcrumb,
    title: "Zlaté Pravidlo Teorie Grafů: E(n) = E(n-1) + deg(v)",
    subtitle: "Porovnání se stromy: Univerzální pravidlo dekonstrukce:",
    headers: ["Typ grafu / uzlu", "Co odebíráme při dekonstrukci", "Rekurence pro počet hran", "Výsledný vzorec"],
    colWidths: [2.8, 3.2, 3.0, 2.7],
    rows: [
      ["Strom", "List (stupeň deg(v) = 1)", "E(n) = E(n-1) + 1", "m = n - 1"],
      ["Cesta / Kružnice", "Běžný uzel (stupeň deg(v) = 2)", "E(n) = E(n-1) + 2", "m = n (pro kružnici)"],
      ["Síť s uzly stupně 3", "Uzel se 3 vazbami (deg(v) = 3)", "E(n) = E(n-1) + 3", "Roste o +3 na každý uzel"]
    ],
    notes: "Zlaté pravidlo teorie grafů: E(n) = E(n-1) + deg(v). Kolik hran má odebíraný vrchol, o tolik se liší počet hran mezi grafem o n vrcholech a podgrafem o n - 1 vrcholech."
  });

  // 14. Section 4: Stromy v Letní Přípravě (Proč m = n - 1)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "4. Stromy v Letní Přípravě: Proč má strom m = n - 1",
    leftCard: {
      title: "Definice a Listy Stromu",
      badge: "DEFINICE",
      type: "emerald",
      items: [
        { bold: "Význam v bioinformatice:", text: "Stromy jsou nejčastější grafovou strukturou v bioinformatice (fylogenetické evoluční stromy, hierarchie taxonomií, kostry molekulárních sítí)." },
        { bold: "Základní definice:", text: "Strom je souvislý graf, který neobsahuje žádné cykly." },
        { bold: "List stromu:", text: "List je vrchol se stupněm deg(v) = 1 (vede z něj právě jedna jediná hrana)." },
        { bold: "Existence listů:", text: "Každý strom s alespoň 2 vrcholy má minimálně dva listy (představte si klacík nebo větev – vždy má alespoň dva konce!)." }
      ]
    },
    rightCard: {
      title: "Proč Má Strom Přesně m = n - 1 Hran?",
      badge: "DEKONSTRUKCE",
      type: "warm",
      items: [
        { bold: "1. Začátek (Dekonstrukce shora):", text: "Vezměme libovolný strom T s n vrcholy (n ≥ 2)." },
        { bold: "2. Odebrání listu:", text: "Najdeme koncový list v (který má deg(v) = 1) a odebereme ho i s jeho jedinou hranou." },
        { bold: "3. Co se stane s grafem:", text: "Počet vrcholů klesne o 1: n ➔ n - 1. Počet hran klesne přesně o 1: m ➔ m - 1 (podle pravidla E(n) = E(n-1) + 1). Zbytek je stále souvislý strom bez cyklů!" },
        { bold: "4. Závěr:", text: "V každém kroku ubude přesně 1 vrchol a 1 hrana, až na konci zbude 1 jediný vrchol a 0 hran. Proto má strom vždy o 1 hranu méně než vrcholů: m = n - 1." }
      ]
    }
  });

  // 15. 5 ekvivalentních definic stromu & Leaf Lemma
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Pro Zájemce do AG1: 5 Definic Stromu a Leaf Lemma",
    leftCard: {
      title: "5 Ekvivalentních Definic Stromu",
      badge: "EKVIVALENCE",
      type: "neutral",
      items: [
        { bold: "1. Strom:", text: "G je strom (je souvislý a nemá cykly)." },
        { bold: "2. Acyklický:", text: "G je acyklický a má přesně m = n - 1 hran." },
        { bold: "3. Souvislý:", text: "G je souvislý a má přesně m = n - 1 hran." },
        { bold: "4. Jednoznačná cesta:", text: "Mezi každou dvojicí různých vrcholů u, v ∈ V existuje právě jedna jednoduchá cesta." },
        { bold: "5. Minimální souvislý:", text: "G je minimální souvislý graf (odebráním libovolné hrany se graf rozpadne)." }
      ]
    },
    rightCard: {
      title: "Důkaz Existence Listu (Tree Leaf Lemma)",
      badge: "LEAF LEMMA",
      type: "warm",
      items: [
        { bold: "Nejdelší cesta:", text: "Zvolme ve stromu nejdelší možnou cestu P = (v₀, v₁, …, vk)." },
        { bold: "Koncový vrchol vk:", text: "Nemůže mít souseda mimo cestu (jinak by cesta nebyla nejdelší) ani jiného souseda na cestě (jinak by vznikl cyklus)." },
        { bold: "Stupeň vk:", text: "Jediným sousedem vk je předchozí vrchol vk-1, což znamená deg(vk) = 1 — uzel vk je list! Ze stejného důvodu je listem i v₀. Strom má tedy alespoň 2 listy." }
      ]
    }
  });

  // 16. Section 5: Orientované Sítě bez Cyklů (DAGy)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "5. 💡 Propojení s Bioinformatikou: Sítě bez Cyklů (DAGy)",
    leftCard: {
      title: "Jednosměrné Procesy v Buňce",
      badge: "DAG",
      type: "emerald",
      items: [
        { bold: "Procesy tekoucí jedním směrem:", text: "V bioinformatice často nestudujeme jen obousměrné vztahy, ale procesy, které tečou jedním směrem:" },
        { bold: "Metabolické dráhy:", text: "Glykolýza začíná glukózou a přes sérii nevratných enzymatických reakcí končí pyruvátem." },
        { bold: "Signální a regulační kaskády:", text: "Aktivace receptoru ➔ fosforylace kinázy ➔ exprese genu." },
        { bold: "Definice DAGu:", text: "Pokud v takovém procesu nedochází k nekonečným smyčkám (zpětným cyklům), nazýváme ho v informatice DAG (Directed Acyclic Graph — orientovaný acyklický graf)." }
      ]
    },
    rightCard: {
      title: "Klíčová Bio-Intuice: Zdroj a Výtok",
      badge: "ZDROJ A VÝTOK",
      type: "neutral",
      items: [
        { bold: "1. Zdroj (Source):", text: "Počáteční metabolit, do kterého žádná reakce nevstupuje (deg⁻(u) = 0, např. vstupní glukóza)." },
        { bold: "2. Výtok (Sink):", text: "Finální metabolit, ze kterého už žádná reakce nepokračuje (deg⁺(w) = 0, např. finální odpadní produkt / pyruvát)." },
        { bold: "Topologické uspořádání:", text: "Díky tomu lze celou metabolickou dráhu seřadit v čase zleva doprava — tomu se v informatice říká Topologické uspořádání." }
      ]
    }
  });

  // 17. Důkazy pro DAGy: Existence Zdroje & Topologické Řazení
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Důkazy pro DAGy: Zdroj a Topologické Řazení",
    leftCard: {
      title: "1. Důkaz Existence Zdroje",
      badge: "EXISTENCE ZDROJE",
      type: "neutral",
      items: [
        { bold: "Nejdelší orientovaná cesta:", text: "Zvolme v DAGu G nejdelší orientovanou cestu P = (v₀, v₁, …, vk)." },
        { bold: "Rozbor uzlu v₀:", text: "Počáteční uzel v₀ nemůže mít předchůdce mimo cestu (spor s maximalitou délky) ani na cestě (vznikl by orientovaný cyklus, spor s DAGem)." },
        { bold: "Závěr:", text: "Proto do v₀ nevstupuje žádná hrana (deg⁻(v₀) = 0) a uzel v₀ je zdrojem." }
      ]
    },
    rightCard: {
      title: "2. Důkaz Topologického Uspořádání",
      badge: "TOPOLOGICKÉ ŘAZENÍ",
      type: "warm",
      items: [
        { bold: "Dekonstrukce shora:", text: "Vezmeme libovolný DAG G o n+1 vrcholech. Najdeme zdroj u (deg⁻(u) = 0), odebereme ho a získáme menší DAG G' o n vrcholech." },
        { bold: "Aplikace IP:", text: "Dle indukčního předpokladu (IP) lze G' seřadit do posloupnosti (v₁', …, vn')." },
        { bold: "Návrat prvku:", text: "Zdroj u předřadíme na 1. místo: (u, v₁', …, vn'). Protože do u nic nevstupovalo, všechny jeho hrany vedou doprava. Tím je topologické řazení hotové." }
      ]
    }
  });

  // 18. Bonusové procvičovací úlohy: Bipartitnost a Lesy
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Bonusové Úlohy: Bipartitnost Stromů a Lesy",
    leftCard: {
      title: "Úloha 1: 2-Obarvení Stromu (Bipartitnost)",
      badge: "BIPARTITNOST",
      type: "emerald",
      items: [
        { bold: "Tvrzení:", text: "Každý strom lze obarvit 2 barvami tak, že žádní sousedé nemají stejnou barvu." },
        { bold: "Důkaz dekonstrukcí:", text: "Odebereme list v, zbylý strom T' o n vrcholech obarvíme dle IP 2 barvami." },
        { bold: "Návrat listu:", text: "List v vrátíme a obarvíme opačnou barvou, než má jeho jediný soused." }
      ]
    },
    rightCard: {
      title: "Úloha 2: Počet Hran v Lese (m = n - c)",
      badge: "LESY",
      type: "neutral",
      items: [
        { bold: "Tvrzení:", text: "Les s n vrcholy a c stromy (komponentami) má přesně m = n - c hran." },
        { bold: "Důkaz dekonstrukcí podle hran:", text: "Odebráním hrany e se jedna komponenta rozpadne na dvě (c' = c + 1)." },
        { bold: "Aplikace IP:", text: "Dle IP má menší les m - 1 = n - (c + 1) = n - c - 1 ⇒ m = n - c." }
      ]
    }
  });

  // 19. Section 6: Přehled dovedností pro letní přípravu
  createTableSlide(pres, {
    breadcrumb,
    title: "6. Přehled: Co je Základ Přípravy a Co Přijde v AG1",
    subtitle: "Z tohoto modulu vám pro letní přípravu bohatě stačí:",
    headers: ["Dovednost pro letní přípravu", "Status"],
    colWidths: [9.0, 2.7],
    rows: [
      ["Rozdíl mezi dekonstrukcí (shora) a konstrukcí (zdola)", "✅ Zvládáte"],
      ["Velikost báze podle kroku odebírání (krok o 3 ➔ 3 báze; krok o 6 ➔ 6 bází)", "✅ Zvládáte"],
      ["Pravidlo růstu hran při dekonstrukci: E(n) = E(n-1) + deg(v)", "✅ Zvládáte"],
      ["Proč má strom m = n - 1 hran (odebírání listů stupně 1)", "✅ Zvládáte"]
    ]
  });
}
