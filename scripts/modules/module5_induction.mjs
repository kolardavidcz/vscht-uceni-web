/**
 * Module 5: Indukce na Grafech & Redukční Past
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide,
  createProofSlide
} from "../pptx_engine.mjs";

export function addModule5Slides(pres) {
  const breadcrumb = "5 · Indukce na Grafech & Redukční Past";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 5,
    title: "Indukce na Grafech & Redukční Past",
    goal: "Pochopit princip matematické indukce na diskrétních strukturách, zvládnout slabou i silnou indukci na platbě mincemi, vyvarovat se fatální redukční pasti v důkazech a osvojit si dekonstrukční přístup odebíráním uzlů a listů u stromů.",
    topics: [
      "Dominová analogie a princip matematické indukce",
      "Příklad ze zkoušek: Platba mincemi 3 Kč a 5 Kč (Slabá vs. Silná indukce)",
      "Peano axiomy, formální definice a induktivní proměnná na grafech",
      "🚨 CRITICAL EXAM TRAP: Konstrukční past vs. Dekonstrukční indukce",
      "Schéma dekonstrukce: Začínáme od libovolného cílového grafu G(n+1)",
      "Pravidlo velikosti báze podle kroku dekonstrukce (3 báze vs. 6 bází)",
      "Růst počtu hran při dekonstrukci sítě: Vrcholy stupně 3 v biochemii",
      "Zlaté pravidlo teorie grafů: E(n) = E(n-1) + deg(v)",
      "Stromy: Důkaz vzorce m = n - 1 dekonstrukcí odebíráním listů",
      "Vhled do AG1: 5 ekvivalentních definic stromu a Tree Leaf Lemma",
      "Propojení s bioinformatikou: Orientované acyklické grafy (DAGy), zdroj a výtok",
      "Zkouškový checklist pro důkazy indukcí"
    ]
  });

  // 2. Domino Analogy
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Dominová Analogie Matematické Indukce",
    leftCard: {
      title: "Klasický Dominový Efekt",
      badge: "INTUICE",
      type: "orange",
      items: [
        { bold: "Řada kostek:", text: "Představme si nekonečnou řadu stojících dominových kostek očíslovaných 1, 2, 3, ..." },
        { bold: "1. Báze indukce:", text: "Ukážeme, že první kostka padne (tvrzení platí pro nejmenší případ n₀)." },
        { bold: "2. Indukční krok:", text: "Dokážeme pravidlo: POKUD padne k-tá kostka, NUTNĚ srazí i kostku (k+1)." },
        { bold: "3. Závěr:", text: "Z 1. a 2. kroku plyne, že postupně padnou úplně všechny kostky v řadě!" }
      ]
    },
    rightCard: {
      title: "Přenesení na Grafové Struktury",
      badge: "APLIKACE V AG1",
      type: "emerald",
      items: [
        { bold: "Co je 'kostka č. k'?", text: "V teorii grafů to není pouhé číslo, ale třída všech grafů s k vrcholy nebo k hranami." },
        { bold: "Zásadní odlišnost:", text: "Grafy nestavíme od nuly nahoru přidáváním prvků, ale rozebíráme je od větších k menším!" },
        { bold: "Základní princip:", text: "Nejprve dokážeme malý bázový případ, pak ukážeme, že každý větší graf lze bezpečně rozebrat na menší podgraf." }
      ]
    }
  });

  // 3. Coins Problem Statement
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Příklad: Platba Mincemi 3 Kč a 5 Kč",
    card: {
      title: "Klasická Zkoušková Úloha na Porovnání Indukcí",
      badge: "ZADÁNÍ ÚLOHY",
      type: "orange",
      items: [
        { bold: "Formulace problému:", text: "Dokážeme, že pomocí mincí s hodnotami 3 Kč a 5 Kč lze přesně vyplatit libovolnou celočíselnou částku ve výši alespoň 8 Kč (aniž by nám muselo být vraceno)." },
        { bold: "Formální výrok V(n):", text: "Pro všechna n ≥ 8 dokazujeme: 'Částku n Kč lze přesně vyplatit pouze s použitím tříkorun a pětikorun.'" },
        { bold: "Proč právě od 8 Kč?", text: "Částky 1, 2, 4 a 7 Kč vyplatit nelze. Pro 8 Kč je to 3 + 5, pro 9 Kč 3 + 3 + 3, pro 10 Kč 5 + 5." },
        { bold: "Dva možné přístupy:", text: "Metoda 1: Důkaz slabou indukcí (pravidlo výměny mincí v peněžence). Metoda 2: Důkaz silnou indukcí (krok o 3 Kč zpět)." }
      ]
    }
  });

  // 4. Coins - Weak Induction (Exchange rule)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Mince Metodou 1: Důkaz Slabou Indukcí",
    leftCard: {
      title: "Báze & 3 Případy Výměny",
      badge: "SLABÁ INDUKCE: n ⇒ n+1",
      type: "orange",
      items: [
        { bold: "Báze (n = 8):", text: "8 = 3 + 5 Kč. Tvrzení V(8) platí. Stačí jediný bázový případ!" },
        { bold: "Indukční předpoklad (IP):", text: "Předpokládejme, že částku n Kč (n ≥ 8) máme vyplacenu v 3 Kč a 5 Kč mincích." },
        { bold: "Cíl indukčního kroku:", text: "Chceme sestrojit výplatu pro (n + 1) Kč výměnou mincí v peněžence." },
        { bold: "Případ A (Jen 5 Kč mince):", text: "Odebereme jednu 5 Kč a nahradíme dvěma 3 Kč (5 ➔ 3+3). Změna: -5 + 6 = +1 Kč." }
      ]
    },
    rightCard: {
      title: "Případy B a C & Závěr",
      badge: "VŠECHNY STAVY POKRYTY",
      type: "emerald",
      items: [
        { bold: "Případ B (Máme 5 Kč i 3 Kč):", text: "Pětikorunu vyměníme za dvě tříkoruny (5 ➔ 3+3). Spolu s původní 3 Kč vznikne 3 + 3 + 3. Čistá změna: +1 Kč." },
        { bold: "Případ C (Máme jen 3 Kč mince):", text: "Protože n ≥ 8 a máme jen trojky, musíme mít alespoň tři 3 Kč (3 × 3 = 9 Kč). Vyměníme 3 + 3 + 3 ➔ 5 + 5. Změna: -9 + 10 = +1 Kč." },
        { bold: "Závěr slabé indukce:", text: "Ve všech možných složeních peněženky umíme vytvořit n + 1 Kč. Tvrzení platí pro všechna n ≥ 8." }
      ]
    }
  });

  // 5. Coins - Strong Induction
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Mince Metodou 2: Důkaz Silnou Indukcí",
    leftCard: {
      title: "3 Bázové Případy",
      badge: "BÁZE PRO KROK O 3",
      type: "blue",
      items: [
        { bold: "Proč 3 báze?", text: "Pokud se v kroku budeme odvolávat na částku o 3 Kč menší, musíme ručně pokrýt 3 po sobě jdoucí čísla:" },
        { bold: "Pro n = 8:", text: "8 = 3 + 5 Kč. Platí V(8)." },
        { bold: "Pro n = 9:", text: "9 = 3 + 3 + 3 Kč. Platí V(9)." },
        { bold: "Pro n = 10:", text: "10 = 5 + 5 Kč. Platí V(10)." },
        { bold: "Silný základ:", text: "Tím máme pevný fundament pro libovolné n+1 ≥ 11." }
      ]
    },
    rightCard: {
      title: "Krok o 3 Kč Zpět bez Výměn",
      badge: "SILNÝ KROK: (n+1) - 3",
      type: "emerald",
      items: [
        { bold: "Silný předpoklad:", text: "Předpokládejme, že všechny částky od 8 do n Kč již umíme vyplatit." },
        { bold: "Konstrukce pro n+1 ≥ 11:", text: "Vezmeme částku o 3 Kč menší: (n + 1) - 3 = n - 2 Kč." },
        { bold: "Platnost předpokladu:", text: "Protože n + 1 ≥ 11, platí n - 2 ≥ 8. Částku n - 2 Kč tedy dle IP umíme vyplatit!" },
        { bold: "Přidání jedné tříkoruny:", text: "(n - 2) + 3 = n + 1 Kč. Bez složitých výměn máme vyplaceno n + 1 Kč!" }
      ]
    }
  });

  // 6. Peano Axioms and Formal Induction
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Peano Axiomy & Slabá vs. Silná Indukce",
    leftCard: {
      title: "Slabá Matematická Indukce",
      badge: "KROK n ⇒ n+1",
      type: "orange",
      items: [
        { bold: "Báze indukce:", text: "Dokážeme, že tvrzení P(n₀) platí pro nejmenší prvek n₀ ∈ ℕ." },
        { bold: "Indukční krok:", text: "Pro libovolné k ≥ n₀ dokážeme implikaci P(k) ⇒ P(k+1)." },
        { bold: "Předpoklad P(k):", text: "Nazývá se indukční předpoklad (IP). Předpokládáme platnost pro právě jedno předchozí k." },
        { bold: "Typické užití:", text: "Aritmetické řady, odebírání jednotlivých listů u stromů (n klesá o 1)." }
      ]
    },
    rightCard: {
      title: "Silná Matematická Indukce",
      badge: "KROK Z CELÉ HISTORIE",
      type: "blue",
      items: [
        { bold: "Formální myšlenka:", text: "Předpokládáme platnost P(i) pro VŠECHNA i v rozsahu n₀ ≤ i ≤ k." },
        { bold: "Formule (neučit se nazpaměť):", text: "(P(n₀) ∧ ∀k ≥ n₀: (⋀_{i=n₀}^k P(i) ⇒ P(k+1))) ⇒ ∀n ≥ n₀: P(n)." },
        { bold: "Induktivní proměnná na grafech:", text: "Velikost struktury: počet vrcholů n = |V| nebo počet hran m = |E|." },
        { bold: "Výhoda pro grafy:", text: "Při rozpadu grafu na komponenty mají komponenty obecné menší velikosti (ne nutně n - 1)." }
      ]
    }
  });

  // 7. Critical Exam Trap: Reduction vs Deconstruction
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "🚨 CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční Indukce",
    leftCard: {
      title: "❌ Konstrukční Past (Redukční postup)",
      badge: "0 BODŮ U ZKOUŠKY",
      type: "rose",
      items: [
        { bold: "Chybná formulace studenta:", text: "'Předpokládejme, že tvrzení platí pro graf G_n s n vrcholy. Nyní sestrojíme nový graf G_{n+1} tak, že přidáme vrchol v a spojíme ho...'" },
        { bold: "Fatální logická chyba:", text: "Tímto postupem dokážete tvrzení POUZE pro ty grafy o n+1 vrcholech, které lze vytvořit tímto konkrétním přidáním!" },
        { bold: "Ztráta obecnosti:", text: "Neověřili jste, zda každý obecný graf s n+1 vrcholy lze takto vybudovat. Opomněli jste celou třídu grafů." }
      ]
    },
    rightCard: {
      title: "✅ Dekonstrukční Indukce (Správný postup)",
      badge: "PLNÝ POČET BODŮ",
      type: "emerald",
      items: [
        { bold: "Správná formulace:", text: "'Vezměme LIBOVOLNÝ ZADANÝ graf G o n+1 vrcholech splňující předpoklady věty. Najdeme vhodný prvek, odebereme ho a získáme podgraf G' o n vrcholech.'" },
        { bold: "Aplikace IP:", text: "Ověříme, že G' splňuje předpoklady věty, a aplikujeme indukční předpoklad na G'." },
        { bold: "Návrat prvku:", text: "Prvek vrátíme a dokážeme, že platnost tvrzení se přenese na původní graf G." }
      ]
    }
  });

  // 8. Deconstruction Flow Diagram
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Schéma Dekonstrukční Indukce na Grafech",
    card: {
      title: "Myšlenkový Tok Důkazu Shora Dolů",
      badge: "UNIVERZÁLNÍ ŠABLONA",
      type: "orange",
      items: [
        { bold: "Krok 1 (Start shora):", text: "LIBOVOLNÝ Graf G o velikosti (n + 1). Začínáme od obecného zadaného objektu, který nesmíme nijak omezovat!" },
        { bold: "Krok 2 (Odebrání prvku):", text: "V grafu G identifikujeme vhodný prvek (list stupně 1, uzel minimálního stupně, hrana) a odebereme ho." },
        { bold: "Krok 3 (Podgraf G' o velikosti n):", text: "Získáme menší podgraf G'. Ověříme, že stále splňuje všechny předpoklady věty." },
        { bold: "Krok 4 (Aplikace IP):", text: "Podle indukčního předpokladu tvrzení pro podgraf G' platí." },
        { bold: "Krok 5 (Závěrečný návrat):", text: "Vrátíme odebraný prvek a dokážeme, že vlastnost platí i pro původní celkový graf G(n + 1)." }
      ]
    }
  });

  // 9. Deconstruction Base Size Rule
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Pravidlo pro Velikost Báze při Dekonstrukci",
    leftCard: {
      title: "Závislost Počtu Bází na Kroku",
      badge: "ZLATÉ PRAVIDLO",
      type: "orange",
      items: [
        { bold: "Fundamentální pravidlo:", text: "O kolik kroků zpět dekonstruujeme, tolik bází musíme ověřit ručně!" },
        { bold: "Krok o 1 zpět (n ⇒ n-1):", text: "Slabá indukce: stačí ověřit 1 počáteční bázi n₀." },
        { bold: "Krok o 3 zpět (n ⇒ n-3):", text: "Silná indukce mincí 3 Kč a 5 Kč: vyžaduje 3 báze {8, 9, 10}." },
        { bold: "Krok o 6 zpět (n ⇒ n-6):", text: "Odebrání 3+3 Kč: n - 6 ≥ 8 ⇒ n ≥ 14, vyžaduje 6 bází (čísla 8 až 13)." }
      ]
    },
    rightCard: {
      title: "Proč Silná Indukce Shora Šetří Práci",
      badge: "BEZ VÝMĚN",
      type: "emerald",
      items: [
        { bold: "Slabá indukce shora (n+1 ➔ n):", text: "Vyžaduje zmenšení o 1 Kč, což u mincí nutí k výměnám 3+3 ➔ 5 nebo 5+5 ➔ 3+3+3." },
        { bold: "Silná indukce shora:", text: "Nevyžaduje žádné výměny mincí. Stačí odebrat celý blok mincí: (n + 1) = ((n + 1) - k) + k." },
        { bold: "Zkoušková rada:", text: "Pokud lze krok provést odebíráním fixního bloku, silná indukce s více bázemi je bezpečnější a čistší." }
      ]
    }
  });

  // 10. Edge Growth in Networks: Degree 3 Nodes
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Růst Počtu Hran: Uzly Stupně 3 v Bioinformatice",
    leftCard: {
      title: "Biologická a Chemická Motivace",
      badge: "REÁLNÉ SÍTĚ",
      type: "orange",
      items: [
        { bold: "sp² uhlíkové atomy:", text: "V aromatických kruzích a grafenu se uhlík váže právě se 3 sousedy (deg(v) = 3)." },
        { bold: "RNA a proteiny:", text: "Terciární větvení v molekulách RNA nebo proteinových doménách vytváří křižovatky stupně 3." },
        { bold: "Kubické (3-regulární) sítě:", text: "Sítě, kde má každý uzel stupeň přesně 3, jsou základním modelem v teoretické informatice." },
        { bold: "Otázka dekonstrukce:", text: "Pokud v síti odebereme uzel stupně 3, jak přesně se změní celkový počet hran?" }
      ]
    },
    rightCard: {
      title: "Rekurentní Vztah pro Počet Hran",
      badge: "FORMÁLNÍ VĚTA",
      type: "emerald",
      items: [
        { bold: "Věta:", text: "Nechť G = (V, E) je graf o n vrcholech obsahující vrchol v se stupněm deg(v) = 3. Podgraf G' = G \\ {v} má n - 1 vrcholů." },
        { bold: "Vztah pro počet hran:", text: "Mezi počtem hran původního grafu E(n) a podgrafu E(n-1) platí přesně: E(n) = E(n-1) + 3." },
        { bold: "Obecně pro stupeň d:", text: "E(n) = E(n-1) + d. Počet hran klesne přesně o tolik, kolik hran do odebraného uzlu vstupovalo." }
      ]
    }
  });

  // 11. Deconstructive Proof: Degree 3 Nodes
  createProofSlide(pres, {
    breadcrumb,
    title: "Důkaz Vztahu E(n) = E(n-1) + 3 Dekonstrukcí",
    statement: "Nechť G je graf o n vrcholech obsahující vrchol v se stupněm deg(v) = 3. Pak platí E(n) = E(n-1) + 3.",
    steps: [
      { bold: "1. Volba libovolného grafu:", text: "Mějme libovolný zadaný graf G = (V, E) o n vrcholech s uzlem v, pro který deg(v) = 3. Označme počet hran E(n) = |E|." },
      { bold: "2. Odebrání uzlu (přechod k podgrafu):", text: "Z grafu G odebereme uzel v a všechny hrany do něj vstupující ({v, u₁}, {v, u₂}, {v, u₃}). Získáme podgraf G' = G \\ {v}." },
      { bold: "3. Bilance vrcholů a hran:", text: "Podgraf G' má |V(G')| = n - 1 vrcholů a počet hran klesl přesně o 3: |E(G')| = E(n) - 3. Označíme E(n-1) = |E(G')|." },
      { bold: "4. Přímá algebraická úprava:", text: "Z rovnosti E(n-1) = E(n) - 3 přičtením 3 k oběma stranám bezprostředně plyne: E(n) = E(n-1) + 3." },
      { bold: "5. Návrat prvku a indukční závěr:", text: "Při návratu uzlu v se připojí přesně 3 hrany k existujícím vrcholům u₁, u₂, u₃ v G'. Tím je vztah rigorózně dokázán." }
    ]
  });

  // 12. Universal Deconstruction Rule Table
  createThreeCardSlide(pres, {
    breadcrumb,
    title: "Zlaté Pravidlo Dekonstrukce Teorie Grafů",
    card1: {
      title: "Strom (Stupeň 1)",
      badge: "E(n) = E(n-1) + 1",
      type: "emerald",
      items: [
        { bold: "Odebíráme:", text: "Koncový list se stupněm deg(v) = 1." },
        { bold: "Změna hran:", text: "Při odebrání listu ubude přesně 1 hrana." },
        { bold: "Výsledný vzorec:", text: "m = n - 1 (vždy o 1 hranu méně než vrcholů)." }
      ]
    },
    card2: {
      title: "Kružnice (Stupeň 2)",
      badge: "E(n) = E(n-1) + 2",
      type: "blue",
      items: [
        { bold: "Odebíráme:", text: "Běžný vrchol na kružnici se stupněm deg(v) = 2." },
        { bold: "Změna hran:", text: "Při odebrání ubudou přesně 2 hrany." },
        { bold: "Výsledný vzorec:", text: "m = n (počet hran se rovná počtu vrcholů)." }
      ]
    },
    card3: {
      title: "Trojvazná Síť (Stupeň 3)",
      badge: "E(n) = E(n-1) + 3",
      type: "orange",
      items: [
        { bold: "Odebíráme:", text: "Uzel kubické sítě / aromatického jádra (deg(v) = 3)." },
        { bold: "Změna hran:", text: "Při odebrání uzlu ubudou přesně 3 hrany." },
        { bold: "Univerzální formule:", text: "E(n) = E(n-1) + deg(v). Platí pro libovolný uzel!" }
      ]
    }
  });

  // 13. Trees in Pre-AG1: Why m = n - 1
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Stromy v Letní Přípravě: Proč má Strom m = n - 1 Hran",
    leftCard: {
      title: "Definice Stromu & Existence Listu",
      badge: "ZÁKLADNÍ VLASTNOSTI",
      type: "emerald",
      items: [
        { bold: "Definice stromu:", text: "Strom je souvislý graf, který neobsahuje žádné cykly (kružnice)." },
        { bold: "Co je list?", text: "List je vrchol se stupněm deg(v) = 1 (vede z něj právě jedna jediná hrana)." },
        { bold: "Existence listů:", text: "Každý strom s alespoň 2 vrcholy má minimálně dva listy (konce nejdelší cesty)." },
        { bold: "Význam v bioinformatice:", text: "Fylogenetické evoluční stromy, hierarchické shlukování, minimální kostry." }
      ]
    },
    rightCard: {
      title: "Důkaz Dekonstrukcí přes Listy",
      badge: "DŮKAZ INDUKCÍ",
      type: "orange",
      items: [
        { bold: "1. Start shora:", text: "Vezměme libovolný strom T s n vrcholy (n ≥ 2)." },
        { bold: "2. Odebrání listu:", text: "Najdeme list v (deg(v) = 1) a odebereme ho i s jeho jedinou hranou." },
        { bold: "3. Vlastnosti podgrafu:", text: "Získáme T' o n - 1 vrcholech. T' zůstává souvislý a acyklický, tedy je to opět strom!" },
        { bold: "4. Závěr:", text: "V každém kroku ubude 1 vrchol a 1 hrana. V bázi (1 vrchol) máme 0 hran. Proto má strom vždy m = n - 1 hran." }
      ]
    }
  });

  // 14. 5 Equivalent Tree Definitions (AG1 Insight)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "5 Ekvivalentních Definic Stromu v AG1",
    leftCard: {
      title: "5 Tváří Stromu (Zkoušková Ekvivalence)",
      badge: "AG1 VĚTA",
      type: "blue",
      items: [
        { bold: "1. Základní definice:", text: "G je strom (je souvislý a nemá cykly)." },
        { bold: "2. Acyklický s n-1 hranami:", text: "G je acyklický a má přesně m = n - 1 hran." },
        { bold: "3. Souvislý s n-1 hranami:", text: "G je souvislý a má přesně m = n - 1 hran." },
        { bold: "4. Jednoznačnost cest:", text: "Mezi každou dvojicí různých vrcholů u, v existuje právě jedna jednoduchá cesta." },
        { bold: "5. Minimální souvislý graf:", text: "Odebráním libovolné hrany se graf rozpadne na dvě komponenty." }
      ]
    },
    rightCard: {
      title: "Důkaz Tree Leaf Lemmatu (Nejdelší cesta)",
      badge: "EXTREMÁLNÍ PRINCIP",
      type: "emerald",
      items: [
        { bold: "Tvrzení:", text: "Každý netriviální strom T (n ≥ 2) obsahuje alespoň 2 listy." },
        { bold: "Volba nejdelší cesty:", text: "Zvolme ve stromu nejdelší možnou jednoduchou cestu P = (v₀, v₁, ..., v_k)." },
        { bold: "Proč je v_k list?", text: "Koncový uzel v_k nemůže mít souseda mimo cestu (spor s maximalitou P) ani na cestě před v_{k-1} (vznikl by cyklus, spor se stromem)." },
        { bold: "Závěr:", text: "Jediným sousedem v_k je v_{k-1}, tedy deg(v_k) = 1. Stejně tak v₀ je list. Strom má alespoň 2 listy." }
      ]
    }
  });

  // 15. Directed Acyclic Graphs (DAGs) in Bioinformatics
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Orientované Sítě bez Cyklů (DAGy) v Biologii",
    leftCard: {
      title: "Procesy s Jednosměrným Tokem",
      badge: "BIOINFORMATIKA",
      type: "orange",
      items: [
        { bold: "Metabolické dráhy:", text: "Glykolýza začíná glukózou a přes sérii nevratných enzymatických reakcí končí pyruvátem." },
        { bold: "Signální kaskády:", text: "Aktivace receptoru ➔ fosforylace kinázy ➔ exprese cílového genu." },
        { bold: "Definice DAGu:", text: "Directed Acyclic Graph – orientovaný graf bez orientovaných cyklů (žádný metabolit není předchůdcem sama sebe)." },
        { bold: "Nevratnost reakcí:", text: "Acykličnost zaručuje, že biochemický signál postupuje v čase bez nekonečných smyček." }
      ]
    },
    rightCard: {
      title: "Zdroj, Výtok a Topologické Uspořádání",
      badge: "STRUKTURA DAGU",
      type: "emerald",
      items: [
        { bold: "Zdroj (Source):", text: "Počáteční metabolit, do kterého žádná reakce nevstupuje: deg⁻(u) = 0 (např. vstupní glukóza)." },
        { bold: "Výtok (Sink):", text: "Finální produkt, ze kterého žádná reakce nepokračuje: deg⁺(w) = 0 (např. pyruvát / laktát)." },
        { bold: "Topologické uspořádání:", text: "Seřazení všech uzlů zleva doprava tak, že všechny orientované hrany směřují výhradně doprava." },
        { bold: "Důkaz indukcí:", text: "Najdeme zdroj, odebereme ho, zbytek seřadíme dle IP a zdroj předřadíme na začátek." }
      ]
    }
  });

  // 16. Bonus Tasks: 2-coloring and Forests
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Bonusové Zkouškové Úlohy: 2-Obarvení & Lesy",
    leftCard: {
      title: "Úloha 1: 2-Obarvení Stromu (Bipartitnost)",
      badge: "ZKOUŠKOVÁ KLASIKA",
      type: "emerald",
      items: [
        { bold: "Tvrzení:", text: "Každý strom lze obarvit 2 barvami tak, že žádní dva sousedé nemají stejnou barvu." },
        { bold: "Dekonstrukční krok:", text: "Vezmeme strom T o n+1 vrcholech, najdeme list v s jediným sousedem u a list v odebereme." },
        { bold: "Aplikace IP:", text: "Podgraf T' o n vrcholech je strom, dle IP ho lze korektně obarvit 2 barvami (červená / modrá)." },
        { bold: "Návrat listu:", text: "List v vrátíme a přiřadíme mu opačnou barvu, než má uzel u. Obarvení je platné!" }
      ]
    },
    rightCard: {
      title: "Úloha 2: Počet Hran v Lese (m = n - c)",
      badge: "INDUKCE PODLE HRAN",
      type: "blue",
      items: [
        { bold: "Tvrzení:", text: "Les s n vrcholy a c komponentami (stromy) má přesně m = n - c hran." },
        { bold: "Báze (m = 0 hran):", text: "Graf má n izolovaných vrcholů, c = n komponent. Vzorec m = n - c dává 0 = n - n. Platí!" },
        { bold: "Dekonstrukční krok:", text: "Odebereme libovolnou hranu e. Protože les neobsahuje cykly, odebráním hrany se jedna komponenta rozpadne na dvě (c' = c + 1)." },
        { bold: "Aplikace IP:", text: "Menší les má m - 1 hran a c + 1 komponent. Dle IP: m - 1 = n - (c + 1) = n - c - 1 ⇒ m = n - c." }
      ]
    }
  });

  // 17. Module 5 Summary Checklist
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Shrnutí Modulu 5: Co Ovládat ke Zkoušce",
    card: {
      title: "Zkouškový Checklist pro Důkazy Indukcí",
      badge: "LETNÍ PŘÍPRAVA NA AG1",
      type: "orange",
      items: [
        { bold: "Dekonstrukce shora:", text: "Nikdy nezačínejte 'Předpokládejme graf G_n a přidejme vrchol'. Vždy začněte: 'Vezměme libovolný graf G o n+1 vrcholech a odeberme prvek'." },
        { bold: "Počet bází vs. krok:", text: "Odebírání o 1 ➔ 1 báze. Odebírání o 3 (mince) ➔ 3 báze {8, 9, 10}. Odebírání o k ➔ k bází." },
        { bold: "Zlaté pravidlo hran:", text: "E(n) = E(n-1) + deg(v). Strom ubírá 1 hranu (list), kružnice 2, trojvazný uzel 3." },
        { bold: "Vzorec pro strom:", text: "m = n - 1 plyne přímo z dekonstrukce odebíráním listů až k jedinému izolovanému vrcholu." },
        { bold: "DAGy v bioinformatice:", text: "Acyklické orientované sítě vždy obsahují alespoň jeden zdroj (deg⁻ = 0) a výtok (deg⁺ = 0)." }
      ]
    }
  });
}
