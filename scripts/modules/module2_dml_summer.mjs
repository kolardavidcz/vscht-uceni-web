/**
 * Module 2: Letní průvodce grafovou matematikou pro bioinformatiky
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide
} from "../pptx_engine.mjs";

export function addModule2Slides(pres) {
  const breadcrumb = "2 · Letní průvodce";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 2,
    title: "☀️ Letní průvodce grafovou matematikou pro bioinformatiky",
    goal: "Osvojit si styl matematického a algoritmického myšlení, pochopit rozdíl mezi vizuální intuicí a formální definicí a porozumět principu Divide & Conquer na rychlém umocňování.",
    topics: [
      "Proč se nebát diskrétní matematiky na VŠCHT a FIT",
      "Anatomie důkazu: Cesta k výsledku vs. Úsporný zápis",
      "Jak ve skutečnosti vzniká matematický a algoritmický objev",
      "Profesor u tabule: Proč vizuální intuice selhává bez definice",
      "Role postupu: Proč naivní násobení x^n nestačí",
      "Logický základ: Zákon vyloučeného třetího a rozbor případů",
      "Algoritmus rychlého umocňování v C++ v čase O(log n)",
      "Význam pro bioinformatiku: Mocnění matice sousedství A^k"
    ]
  });

  // 2. Introduction & Mindset
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Hele, Tohle Není Strašidelný Kurz",
    leftCard: {
      title: "Proč Máme Tento Letní Kurz?",
      badge: "VÝCHOZÍ STAV",
      type: "neutral",
      items: [
        { bold: "Obavy studentů:", text: "Spousta bioinformatiků slyší 'diskrétní matematika a důkazy' a dostane nepříjemné vzpomínky na gympl." },
        { bold: "Realita na FIT ČVUT:", text: "Studenti FIT prošli celým semestrem BI-DML a mají natrénované formální uvažování." },
        { bold: "Náš cíl:", text: "Žádná tlustá skripta, žádný stres. Komprimovaná letní příprava toho nejdůležitějšího pro předmět AG1." }
      ]
    },
    rightCard: {
      title: "Co Se Skutečně Naučíte?",
      badge: "PŘÍSLIB KURZU",
      type: "warm",
      items: [
        { bold: "Čtení formalismu:", text: "Jak číst a psát matematická tvrzení o grafech bez strachu ze symbolů ∀, ∃, ⇒." },
        { bold: "Korektnost algoritmů:", text: "Jak spolehlivě dokázat, že algoritmus neselže (3 fáze invariantu)." },
        { bold: "Strukturální myšlení:", text: "Jak rozkládat složité biologické sítě na grafové komponenty." },
        { bold: "Co zde NENÍ:", text: "Žádné integrály, žádné diferenciální rovnice, žádné abstraktní matice bez kontextu." }
      ]
    }
  });

  // 3. Anatomy of a Proof
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Anatomie Důkazu: Cesta k Výsledku vs. Úsporný Zápis",
    leftCard: {
      title: "1. Důkaz Heuristický / Objevný",
      badge: "CESTA K VÝSLEDKU",
      type: "warm",
      items: [
        { bold: "Podstata:", text: "Ukazuje skutečný myšlenkový postup autora – od motivace přes náčrtky až po finální vzorec." },
        { bold: "Čtení pro studenta:", text: "Bývá delší, protože neskrývá slepé uličky a experimentální intuici." },
        { bold: "Význam pro algoritmy:", text: "Tento typ důkazu přímo generuje samotný algoritmus a kód v C++ (např. konstrukce Eulerova tahu či BFS)." }
      ]
    },
    rightCard: {
      title: "2. Důkaz Formální / Úsporný",
      badge: "ČISTÁ VERIFIKACE",
      type: "neutral",
      items: [
        { bold: "Podstata:", text: "Dokazuje tvrzení v co nejmenším počtu řádků a zkracuje vše, co se dá." },
        { bold: "Častý klam:", text: "Působí jako kouzlo spadlé z nebe – autor zahodil všechny papíry s náčrtky a předloží jen finální trik." },
        { bold: "Zkouškový význam:", text: "Slouží k rychlému a neprůstřelnému ověření u zkoušky, ale sám o sobě nenaučí, jak na řešení přijít." }
      ]
    }
  });

  // 4. How Mathematical Discovery Works
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Jak Ve Skutečnosti Vzniká Matematický Objev",
    cardTitle: "Čtyři Fáze Cesty od Prvotního Nápadu k Důkazu",
    badge: "TAJEMSTVÍ PREMIANTŮ",
    type: "warm",
    items: [
      { bold: "1. Pokus & Omyl (Náčrtek na papír):", text: "Vezmete papír a zkoušíte chování na malých grafech (n = 1, 2, 3, 4 vrcholy). Hledáte extrémní případy." },
      { bold: "2. Pozorování & Skryté Vzory:", text: "Všimnete si klíčové vlastnosti: 'Aha! Pro každý strom je počet hran vždy o 1 menší než počet vrcholů!'" },
      { bold: "3. Formulace Hypotézy (Jazyk logiky):", text: "Zformulujete přesné formální tvrzení pomocí kvantifikátorů: ∀T ∈ Stromy: |E| = |V| - 1." },
      { bold: "4. Finální Důkaz (Slavnostní obal):", text: "Teprve nyní sepíšete rigorózní dekonstrukční indukci nebo důkaz sporem, kterým svou intuici obhájíte před zkoušejícím." }
    ]
  });

  // 5. Blackboard Circle Exercise
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Role Znalostí: První Setkání u Tabule",
    leftCard: {
      title: "Zdánlivě Banální Otázka od Tabule",
      badge: "ZADÁNÍ ÚLOHY",
      type: "warm",
      items: [
        { bold: "Situace na cvičení:", text: "Vyučující beze slova nakreslí na tabuli kulatý geometrický útvar se středem S[m, n] a poloměrem r." },
        { bold: "Otázka vyučujícího:", text: "'Je dán geometrický útvar v kartézské rovině. Dokažte, že se jedná o kružnici!'" },
        { bold: "Reakce auly:", text: "95 % studentů zažije naprosté prázdno v hlavě: 'Vždyť to vidím na vlastní oči – je to kulaté, co mám dokazovat?!'" }
      ]
    },
    rightCard: {
      title: "Proč Vizuální Dojem Nestačí?",
      badge: "ANALÝZA CHYBY",
      type: "rose",
      items: [
        { bold: "Lidský zrak klame:", text: "Útvar může být elipsa s poloosami a = 60.0 a b = 59.9, nebo pravidelný 128-úhelník." },
        { bold: "Chybějící kotva:", text: "Bez znalosti přesné DEFINICE nemáte VŮBEC CO dokazovat!" },
        { bold: "Klíčový vhled pro AG1:", text: "Jakmile si vybavíte exaktní definici pojmu, celý důkaz se stane přímočarým rozbalením této definice." }
      ]
    }
  });

  // 6. Definition as Anchor
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Definice jako Základní Záchytný Bod Důkazu",
    cardTitle: "Příklad: Od Definice Kružnice k Rovnici",
    badge: "DEFINICE = KLÍČ",
    type: "emerald",
    items: [
      { bold: "1. Exaktní geometrická definice:", text: "Kružnice k(S, r) je množina všech bodů X v rovině, které mají od pevného středu S stejnou vzdálenost r > 0." },
      { bold: "2. Formální množinový zápis:", text: "k(S, r) = { X ∈ E_2 | |SX| = r }." },
      { bold: "3. Eukleidovská metrika v rovině:", text: "Vzdálenost bodů X[x, y] a S[m, n] je dána vzorcem |SX| = √((x - m)² + (y - n)²)." },
      { bold: "4. Samotný důkaz je hotov:", text: "Dosazením do definice a umocněním ihned dostáváme analytickou rovnici: (x - m)² + (y - n)² = r². Q.E.D." }
    ]
  });

  // 7. Role of Algorithm: Fast Exponentiation
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Role Postupu: Rychlé Umocňování (x^n)",
    leftCard: {
      title: "Naivní Přístup: O(n)",
      badge: "NAIVNÍ POSTUP",
      type: "rose",
      items: [
        { bold: "Princip:", text: "Postupně násobíme x · x · x · ... · x." },
        { bold: "Počet násobení:", text: "Přesně n - 1 operací násobení." },
        { bold: "Pro n = 1 000 000:", text: "Procesor musí provést milion násobení!" },
        { bold: "Důsledek:", text: "V kryptografii (RSA) či při počítání cest v grafech nepoužitelně pomalé." }
      ]
    },
    rightCard: {
      title: "Cíl Algoritmizace: O(log n)",
      badge: "OPTIMÁLNÍ POSTUP",
      type: "emerald",
      items: [
        { bold: "Otázka k zamyšlení:", text: "Lze spočítat x^n řádově rychleji pouze pomocí operace násobení?" },
        { bold: "Myšlenka:", text: "Využít vlastností sudých a lichých čísel a techniky Divide & Conquer." },
        { bold: "Pro n = 1 000 000:", text: "Pouhých ~20 násobení místo 1 000 000 (50 000× rychlejší)!" }
      ]
    }
  });

  // 8. Logical Foundations of Divide & Conquer
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Logický Základ: Dělení Problému na Případy",
    leftCard: {
      title: "1. Zákon Vyloučeného Třetího",
      badge: "FORMÁLNÍ LOGIKA",
      type: "neutral",
      items: [
        { bold: "Tertium non datur:", text: "V klasické logice je každý výrok buď pravdivý, nebo nepravdivý: ⊨ A ∨ ¬A." },
        { bold: "Zákon sporu:", text: "Žádný výrok nemůže být zároveň pravdivý i nepravdivý: ⊨ ¬(A ∧ ¬A)." },
        { bold: "Aplikace na čísla:", text: "∀n ∈ ℕ: sudé(n) ∨ liché(n). Každé číslo bezpodmínečně spadne do jedné větve." }
      ]
    },
    rightCard: {
      title: "2. Důkaz Rozborem Případů",
      badge: "DIVIDE & CONQUER",
      type: "warm",
      items: [
        { bold: "Dedukční pravidlo:", text: "((P ∨ Q) ∧ (P ⇒ R) ∧ (Q ⇒ R)) ⇒ R." },
        { bold: "Garance korektnosti:", text: "Pokud algoritmus správně vyřeší sudá čísla (P) i lichá čísla (Q), je zaručeně správný pro všechna myslitelná n." },
        { bold: "Žádný mezistav:", text: "Žádný vstup nemůže propadnout mimo navržené větve." }
      ]
    }
  });

  // 9. Recurrence Equations & Termination
  createThreeCardSlide(pres, {
    breadcrumb,
    title: "Rekurence a Důkaz Terminace",
    cards: [
      {
        title: "Případ 1: Sudé n",
        badge: "SUDÁ VĚTEV",
        type: "warm",
        items: [
          { bold: "Vzorec:", text: "x^n = (x^(n/2))² = y · y, kde y = x^(n/2)." },
          { bold: "Trik pro úsporu:", text: "Hodnotu y spočítáme rekurzivně pouze jednou!" },
          { bold: "Výsledek:", text: "Ušetříme celou polovinu násobení v jediném kroku." }
        ]
      },
      {
        title: "Případ 2: Liché n",
        badge: "LICHÁ VĚTEV",
        type: "neutral",
        items: [
          { bold: "Vzorec:", text: "x^n = x · x^(n - 1)." },
          { bold: "Redukce na sudé:", text: "Exponent n - 1 je zaručeně sudý, takže v příštím kroku nastane sudá větev." },
          { bold: "Náklady:", text: "Pouze 1 násobení navíc před půlením." }
        ]
      },
      {
        title: "Báze & Terminace",
        badge: "DŮKAZ UKONČENÍ",
        type: "emerald",
        items: [
          { bold: "Báze (n = 0):", text: "x⁰ = 1 (neutrální prvek násobení)." },
          { bold: "Ostrý pokles:", text: "V každém kroku n/2 < n a n - 1 < n." },
          { bold: "Dobré uspořádání ℕ:", text: "Množina ℕ nemá nekonečnou klesající posloupnost. Algoritmus vždy skončí!" }
        ]
      }
    ]
  });

  // 10. Implementation in C++
  createCodeSlide(pres, {
    breadcrumb,
    title: "Rychlé Umocňování v C++: Čas O(log n)",
    leftCard: {
      title: "Tragický Rozdíl na Číslech",
      badge: "PŘÍKLADY",
      type: "warm",
      items: [
        { bold: "Příklad x¹⁶ (sudá větev):", text: "x² = x·x, x⁴ = (x²)², x⁸ = (x⁴)², x¹⁶ = (x⁸)² → pouhá 4 násobení místo 15!" },
        { bold: "Příklad x¹³ (střídání větví):", text: "13 (liché) → 12 (sudé) → 6 (sudé) → 3 (liché) → 2 (sudé) → 1 → pouhých 5 násobení místo 12!" },
        { bold: "Inženýrský trik:", text: "Proměnná half zajistí jednorázový výpočet bez duplicitní rekurze." }
      ]
    },
    codeBlock: {
      title: "Exponentiation by Squaring v C++",
      code: `long long power(long long x, unsigned int n) {
    // Báze indukce
    if (n == 0) return 1;

    // Případ 1: Sudý exponent
    if (n % 2 == 0) {
        long long half = power(x, n / 2);
        return half * half; // Spočteno 1x, násobeno 1x!
    } 
    // Případ 2: Lichý exponent
    else {
        return x * power(x, n - 1);
    }
}`,
      analysisItems: [
        "Hloubka rekurzivního stromu je nejvýše 2 · log₂(n).",
        "Paměťová náročnost Call Stacku je O(log n)."
      ]
    }
  });

  // 11. Complexity Comparison Table
  createSingleCardSlide(pres, {
    breadcrumb,
    title: "Srovnání Složitosti: Naivní Přístup vs. O(log n)",
    cardTitle: "Proč Logaritmický Čas Způsobuje Revoluci",
    badge: "DRAMATICKÉ ZRYCHLENÍ",
    type: "neutral",
    items: [
      { bold: "n = 16:", text: "Naivně 15 násobení vs. Rychle 4 násobení (3.75× zrychlení)." },
      { bold: "n = 1 024 (2¹⁰):", text: "Naivně 1 023 násobení vs. Rychle 10 násobení (100× zrychlení)." },
      { bold: "n = 1 000 000 (10⁶):", text: "Naivně 999 999 násobení vs. Rychle cca 20 násobení (50 000× zrychlení!)." },
      { bold: "n = 1 000 000 000 (10⁹):", text: "Naivní algoritmus zamrzne, logaritmický proběhne za 30 operací (zlomek mikrosekundy)." }
    ]
  });

  // 12. Application to Bioinformatics & AG1
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Propojení s Bioinformatikou: Mocnění Matic Sousedství",
    leftCard: {
      title: "Počítání Cest v Biologických Sítích",
      badge: "BIOINFORMATIKA",
      type: "warm",
      items: [
        { bold: "Matice sousedství A:", text: "Reprezentuje interakční síť proteinů (PPI) nebo metabolickou dráhu." },
        { bold: "Kouzlo matice A^k:", text: "Prvek (A^k)[i, j] udává přesný počet cest délky k mezi biomolekulami i a j!" },
        { bold: "Aplikace rychlého mocnění:", text: "Místo k - 1 násobení matic spočítáme A^k v O(log k) krocích." },
        { bold: "Výsledek:", text: "Můžeme bleskově analyzovat kaskády o délce 1000 kroků bez prohledávání grafu!" }
      ]
    },
    rightCard: {
      title: "Závěrečné Ponaučení pro AG1",
      badge: "AG1 STRATEGIE",
      type: "emerald",
      items: [
        { bold: "1. Vždy hledejte symetrii:", text: "Rozdělení problému na sudé/liché nebo dvě poloviny je základem algoritmů." },
        { bold: "2. Ověřte bázi:", text: "Indukční základ n = 0 chrání algoritmus i důkaz před nekonečným pádem." },
        { bold: "3. Přesná definice vítězí:", text: "Definice není překážka, ale nejsilnější zbraň pro vytvoření důkazu." }
      ]
    }
  });
}
