/**
 * Module 2: Letní průvodce grafovou matematikou pro bioinformatiky
 * Source: src/features/bioinformatics/content/3-semestr/pre-ag1/dml.md
 * Exact 1:1 text fidelity with website markdown.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createTableSlide
} from "../pptx_engine.mjs";

export function addModule2Slides(pres) {
  const breadcrumb = "2 · Letní průvodce";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 2,
    title: "☀️ Letní průvodce grafovou matematikou pro bioinformatiky",
    goal: "Pro koho? Studenti Bioinformatiky na VŠCHT, kteří v září nastupují do 3. semestru a čeká je AG1 na FIT ČVUT. Vibe? Žádné tlusté skripta, žádný stres. Letní četba u kafe — jako kdyby ti to starší spolužák vysvětloval u oběda.",
    topics: [
      "👋 Hele, tohle není strašidelný kurz",
      "3. Myšlení v Důkazech: Jak Funguje Matematický a Algoritmický Mozek?",
      "3.1 Anatomie Důkazu: Cesta k Výsledku vs. Úsporný Zápis",
      "Jak ve skutečnosti vzniká matematický a algoritmický objev",
      "3.2 Role Znalostí: První Setkání s Profesorem u Tabule",
      "Proč se u tabule cítíte ztraceni (zrak klamá vs. definice)",
      "3.3 Role Postupu: Rychlé Umocňování (x^n) & Formální Logika",
      "Zákon vyloučeného třetího & Důkaz rozborem případů",
      "Důkaz terminace & Implementace v C++ v čase O(log n)",
      "Srovnání složitosti & Význam pro bioinformatiku"
    ]
  });

  // 2. Introduction: Hele, tohle není strašidelný kurz
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "👋 Hele, Tohle Není Strašidelný Kurz",
    leftCard: {
      title: "Přípravný Letní Materiál",
      badge: "BEZ STRESU",
      type: "neutral",
      items: [
        { bold: "Pocit z gymplu:", text: "Spousta bioinformatiků slyší „diskrétní matematika a důkazy\" a dostane špatný pocit z gymplu. Nemusíš." },
        { bold: "Co je tento materiál:", text: "Tohle je přípravný letní materiál — přečteš ho pohodlně za pár dní a do září budeš mít jasno v tom, co AG1 po tobě vůbec chce." },
        { bold: "Co tady NENÍ:", text: "Žádné integrály, žádné matice, žádná pravděpodobnost. Jen logika, grafy a pár hezkých triků na důkazy." }
      ]
    },
    rightCard: {
      title: "Co Konkrétně Se Naučíš?",
      badge: "CÍLE KURZU",
      type: "warm",
      items: [
        { bold: "Čtení formalismu:", text: "Jak číst a psát matematická tvrzení o grafech (aniž by to bylo strašidelné)." },
        { bold: "Správnost algoritmů:", text: "Jak dokázat, že algoritmus funguje správně (stačí 3 kroky, fakt)." },
        { bold: "Matematické myšlení:", text: "Jak myslet jako matematik, když řešíš strukturální problémy — a to ti pomůže i v bioinformatice." },
        { bold: "Srovnání s FIT:", text: "Studenti FIT prošli celým předmětem BI-DML. Ty máš tento kurz — komprimovanou verzi toho nejdůležitějšího pro AG1." }
      ]
    }
  });

  // 3. Section 3: Myšlení v Důkazech
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3. Myšlení v Důkazech: Jak Funguje Mozek?",
    leftCard: {
      title: "Mýtus Mezi Studenty 1. Ročníku",
      badge: "MÝTUS VS. PRAVDA",
      type: "neutral",
      items: [
        { bold: "Častý mýtus:", text: "„Matematici a teoretičtí informatici milují složité řecké značky a píší důkazy jen proto, aby potrápili studenty u zkoušky.“" },
        { bold: "Pravda:", text: "Pravda je přesně opačná. V této kapitole si ukážeme, proč důkazy vůbec vznikly, jaký je zásadní rozdíl mezi znalostmi a postupem a jak se z bioinformatika stane člověk, který se nezalekne žádné teoretické otázky z AG1." }
      ]
    },
    rightCard: {
      title: "Proč Důkazy Vůbec Vznikly?",
      badge: "INŽENÝRSKÁ JISTOTA",
      type: "warm",
      items: [
        { bold: "Ne pro abstraktní výrazy:", text: "Důkazy nevznikly kvůli velké lásce k abstraktním matematickým výrazům." },
        { bold: "Inženýrská potřeba:", text: "Vznikly z ryzí inženýrské a vědecké potřeby: získat 100% jistotu a záruku, že náš algoritmus nebo tvrzení funguje za všech myslitelných okolností (a neselže uprostřed noci na neznámých biologických datech v produkci)." },
        { bold: "V bioinformatice nestačí:", text: "„Na pěti testovacích sekvencích to běželo, tak to snad bude fungovat vždycky.“" }
      ]
    }
  });

  // 4. Section 3.1: Table of Proof Types
  createTableSlide(pres, {
    breadcrumb,
    title: "3.1 Anatomie Důkazu: Cesta k Výsledku vs. Úsporný Zápis",
    subtitle: "V odborné literatuře i na přednáškách se setkáte se dvěma zásadními typy důkazů:",
    headers: ["Typ Důkazu", "Jak Funguje v Praxi", "Proč Může Zmást Studenta", "Význam pro Bioinformatiku a AG1"],
    colWidths: [2.8, 3.1, 2.7, 3.1],
    rows: [
      [
        "1. Důkaz Heuristický / Objevný\n(Cesta k výsledku)",
        "Ukazuje skutečný myšlenkový postup autora — od prvotní motivace přes jednoduché náčrtky až po obecný vzorec.",
        "Bývá delší na čtení, protože neskrývá slepé uličky a experimentální intuici.",
        "Zásadní pro algoritmy: Tento důkaz často přímo generuje samotný algoritmus a kód v C++ (např. konstrukce Eulerova tahu)."
      ],
      [
        "2. Důkaz Formální / Úsporný\n(Čistá verifikace)",
        "Dokazuje tvrzení v co nejmenším počtu řádků a zkracuje všechno, co může.",
        "Působí jako kouzlo spadlé z nebe. Autor zahodil všechny papíry s náčrtky a předloží jen finální geniální trik.",
        "Slouží k rychlému a neprůstřelnému ověření, ale sám o sobě vás nenaučí, jak na řešení přijít."
      ]
    ]
  });

  // 5. How Discovery Actually Works
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Jak Ve Skutečnosti Vzniká Objev",
    leftCard: {
      title: "Čtyři Fáze Vzniku Objevu",
      badge: "POSTUP",
      type: "neutral",
      items: [
        { bold: "1. Pokus & Omyl:", text: "Vezmeš papír a zkoušíš malé případy (n = 1, 2, 3, 4)." },
        { bold: "2. Pozorování & Vzory:", text: "Všimneš si: „Aha! Pro sudá čísla to jde vždy rozdělit na poloviny!“" },
        { bold: "3. Formulace Hypotézy:", text: "Zformuluješ přesné tvrzení v jazyce logiky (∀, ∃, ⇒)." },
        { bold: "4. Finální Důkaz:", text: "Teprve teď sepíšeš formální důkaz jako neprůstřelnou obhajobu." }
      ]
    },
    rightCard: {
      title: "Tajemství Zkouškových Premiantů",
      badge: "TIP",
      type: "warm",
      items: [
        { bold: "Žádné psaní z hlavy:", text: "Když lidé (včetně slavných matematiků a informatiků) přijdou na něco nového, rozhodně to není tím, že by seděli doma a z hlavy psali abstraktní formule na papír." },
        { bold: "Kde začíná poznání:", text: "Skutečné poznání začíná tím, že si něco zkoušíte, kreslíte náčrtky a hledáte invarianty a skryté vlastnosti." },
        { bold: "Slavnostní obal:", text: "Formální důkaz je až slavnostní obal, kterým svou intuici obhájíte před světem." }
      ]
    }
  });

  // 6. Section 3.2: Role Znalostí - Profesor u tabule
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3.2 Role Znalostí: První Setkání s Profesorem u Tabule",
    leftCard: {
      title: "Otázka od Tabule",
      badge: "PRVNÍ CVIČENÍ",
      type: "neutral",
      items: [
        { bold: "Situace v učebně:", text: "Představte si své první cvičení z diskrétní matematiky na univerzitě. Vstoupí vyučující, beze slova vezme křídu, nakreslí na tabuli geometrický útvar se středem S[m, n], poloměrem r a bodem X[x, y] na obvodu, otočí se do ztichlé učebny a položí zdánlivě nevinnou otázku:" },
        { bold: "Otázka od tabule:", text: "„Je dán geometrický útvar v kartézské rovině (viz obrázek). Dokažte, že se jedná o kružnici!“" },
        { bold: "Ticho v hlavě 95 % studentů:", text: "„Co po mně proboha chce?! Vždyť to vidím na vlastní oči — je to kulaté, je to kružnice, co na tom mám dokazovat?! Mám vytáhnout kružítko a pravítko a změřit to?“" }
      ]
    },
    rightCard: {
      title: "Proč Se v Této Chvíli Cítíte Ztraceni?",
      badge: "SÍLA DEFINICE",
      type: "warm",
      items: [
        { bold: "Vizuální intuice klamá:", text: "Náš lidský mozek je ze střední školy i běžného života zvyklý spoléhat se na vizuální intuici. Jenže exaktní matematika a teoretická informatika nejsou o tom, co vypadá kulatě. Zrak může snadno klamat (může to být elipsa s poloosami a = 60.0 a b = 59.9, nebo pravidelný 128-úhelník)." },
        { bold: "Požadavek vyučujícího:", text: "Vyučující od vás nechtěl vizuální popis. Chtěl formální matematickou obhajobu." },
        { bold: "Klíčový aha-moment:", text: "Bez znalosti přesné DEFINICE nemáte VŮBEC CO dokazovat! Jakmile si vybavíte exaktní definici pojmu, celý důkaz se stane přímočarým rozbalením této definice krok za krokem." }
      ]
    }
  });

  // 7. Section 3.3: Role Postupu - Rychlé Umocňování (Výzva)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3.3 Role Postupu: Rychlé Umocňování (x^n)",
    leftCard: {
      title: "Statické Znalosti vs. Dynamický Postup",
      badge: "ALGORITMICKÁ VÝZVA",
      type: "neutral",
      items: [
        { bold: "Přechod k dynamice:", text: "Zatímco kružnice demonstrovala sílu statických znalostí (definic), v programování a předmětu AG1 rozhoduje dynamický postup (algoritmus) opřený o zákony formální matematické logiky." },
        { bold: "Zadání výzvy:", text: "Chceme spočítat hodnotu mocniny x^n (pro libovolné přirozené číslo n ∈ ℕ) výhradně za pomoci operace násobení." },
        { bold: "Cíl:", text: "Provést co nejmenší možný počet násobení." }
      ]
    },
    rightCard: {
      title: "Naivní Postup O(n) vs. Výzva k Zamyšlení",
      badge: "SLOŽITOST O(N)",
      type: "warm",
      items: [
        { bold: "Naivní postup O(n):", text: "Budeme postupně násobit x · x · x … · x. To vyžaduje n - 1 násobení." },
        { bold: "Pro n = 1 000 000:", text: "Např. při šifrování RSA nebo počítání cest v rozsáhlých biologických sítích provede procesor milion operací. To je v praxi zbytečně pomalé." },
        { bold: "Výzva k zamyšlení:", text: "Lze to udělat řádově rychleji? Jaký myšlenkový postup zvolit a jakou roli v tom hraje formální logika?" }
      ]
    }
  });

  // 8. Solution: Exponentiation by Squaring & Logic
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Rychlé Umocňování a Formální Logika",
    leftCard: {
      title: "1. Zákon Vyloučeného Třetího",
      badge: "TERTIUM NON DATUR",
      type: "neutral",
      items: [
        { bold: "Klasická bivalentní logika:", text: "Každý výrok A je buď pravdivý, nebo nepravdivý. Neexistuje žádný třetí mezistav: ⊨ A ∨ ¬A." },
        { bold: "Zákon sporu:", text: "Žádný výrok nemůže být zároveň pravdivý i nepravdivý: ⊨ ¬(A ∧ ¬A)." },
        { bold: "Aplikace na dělitelnost 2:", text: "∀n ∈ ℕ: sudé(n) ∨ liché(n). Každé číslo n musí bezpodmínečně spadnout do jedné ze dvou kategorií — žádné číslo nemůže být „napůl sudé“, ani nemůže existovat číslo, které není ani jedno." }
      ]
    },
    rightCard: {
      title: "2. Důkaz Rozborem Případů",
      badge: "PROOF BY CASES",
      type: "emerald",
      items: [
        { bold: "Dedukční pravidlo:", text: "((P ∨ Q) ∧ (P ⇒ R) ∧ (Q ⇒ R)) ⇒ R. Pokud postup vyřeší sudá (P) i lichá (Q), je zaručeně korektní pro všechna myslitelná čísla!" },
        { bold: "Případ 1 (Sudý n):", text: "x^n = (x^(n/2))^2 = (x^(n/2)) · (x^(n/2)). Hodnotu y = x^(n/2) spočítáme rekurzivně pouze jednou a vynásobíme samu se sebou (y · y)! Ušetříme celou polovinu násobení." },
        { bold: "Případ 2 (Lichý n):", text: "x^n = x · x^(n-1). Exponent snížíme o 1 a hodnota x^(n-1) v dalším kroku spadne do sudého případu." },
        { bold: "Báze algoritmu (n = 0):", text: "Pro n = 0 platí neutrální prvek operace násobení: x^0 = 1." }
      ]
    }
  });

  // 9. Termination Proof & Concrete Examples
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Důkaz Terminace a Konkrétní Příklady",
    leftCard: {
      title: "3. Důkaz Terminace",
      badge: "DOBRÉ USPOŘÁDÁNÍ",
      type: "neutral",
      items: [
        { bold: "Proč se nezacyklí?:", text: "V sudé větvi: pro n ≥ 2 platí n/2 < n. V liché větvi: pro n ≥ 1 platí n - 1 < n." },
        { bold: "Ostrý pokles:", text: "V každém rekurzivním kroku hodnota exponentu ostře klesá (n' < n)." },
        { bold: "Dobré uspořádání ℕ:", text: "Množina přirozených čísel ℕ je dobře uspořádaná (well-founded set) — neexistuje v ní žádná nekonečná klesající posloupnost. Algoritmus v konečném počtu kroků nevyhnutelně narazí na bázi n = 0 a korektně skončí." }
      ]
    },
    rightCard: {
      title: "Porovnání na Konkrétních Číslech",
      badge: "PŘÍKLADY",
      type: "warm",
      items: [
        { bold: "Příklad A (x^16, čistě sudá větev):", text: "Naivně 15 násobení. Rychlý postup: x² = x·x, x⁴ = (x²)², x⁸ = (x⁴)², x¹⁶ = (x⁸)². Výsledek: pouhá 4 násobení místo 15! (4 = log₂ 16)." },
        { bold: "Příklad B (x^13, střídání větví):", text: "13 liché ⇒ x·x¹²; 12 sudé ⇒ (x⁶)²; 6 sudé ⇒ (x³)²; 3 liché ⇒ x·x²; 2 sudé ⇒ x·x. Výsledek: pouhých 5 násobení místo 12!" }
      ]
    }
  });

  // 10. Code in C++ and Complexity Comparison
  createCodeSlide(pres, {
    breadcrumb,
    title: "Implementace v C++ a Srovnání Složitosti",
    codeTitle: "Rychlé umocňování v čase O(log n)",
    code: `// Rychlé umocňování v čase O(log n)
long long power(long long x, unsigned int n) {
    if (n == 0) return 1;
    
    if (n % 2 == 0) {
        long long half = power(x, n / 2);
        return half * half; // Spočítáno jen 1x, násobeno 1x!
    } else {
        return x * power(x, n - 1);
    }
}`,
    leftCard: {
      title: "Srovnání Složitosti a Zrychlení",
      badge: "TABULKA SLOŽITOSTI",
      type: "warm",
      items: [
        { bold: "n = 16:", text: "Naivně 15 násobení · Rychle 4 násobení (3.75× rychlejší)." },
        { bold: "n = 1 024:", text: "Naivně 1 023 násobení · Rychle 10 násobení (100× rychlejší)." },
        { bold: "n = 1 000 000:", text: "Naivně 999 999 násobení · Rychle cca 20 násobení (50 000× rychlejší!)." },
        { bold: "Složitost:", text: "Časová složitost klesla z lineární O(n) na logaritmickou O(log n)." },
        { bold: "Význam pro bioinformatiku:", text: "Základ kryptografie (RSA) a rychlého umocňování matice sousedství A^k (počet cest délky k mezi biomolekulami v síti bez prohledávání!)." }
      ]
    },
    analysisItems: []
  });
}
