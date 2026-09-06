/**
 * Module 3: Bio-Intuice & Co je Graf
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createThreeCardSlide
} from "../pptx_engine.mjs";

export function addModule3Slides(pres) {
  const breadcrumb = "3 · Bio-Intuice & Co je Graf";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 3,
    title: "Bio-Intuice & Co je Graf",
    goal: "Přeložit přirozenou chemickou a biologickou intuici (molekuly, metabolické kaskády, fylogenetické stromy) do formálního matematického jazyka neorientovaných grafů G = (V, E), orientovaných DAGů, stromů a cyklů.",
    topics: [
      "Co je to vlastně graf bez vzorců (mapa metra)",
      "Formální definice grafu G = (V, E)",
      "Molekula glukózy jako neorientovaný graf vazeb",
      "Kovalentní vazby, stupně vrcholů deg(v) a chemická valence",
      "Metabolická dráha glykolýzy jako orientovaný acyklický graf (DAG)",
      "Enzymy jako orientované hrany kaskády",
      "Klíčový rozdíl: Strom (žádné smyčky) vs. Cyklus (zpětná vazba)",
      "Biologické paralely: Fylogenetický strom (LUCA) vs. Krebsův cyklus"
    ]
  });

  // 2. What is a Graph: Subway Map Intuition
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Co je to Vlastně Graf? (Intuice bez Vzorců)",
    leftCard: {
      title: "Grafy v AG1 Nejsou Funkce y = f(x)",
      badge: "INTUICE",
      type: "neutral",
      items: [
        { bold: "Zapomeňte na grafy funkcí:", text: "V AG1 graf neznamená křivku paraboly y = x² ze střední školy." },
        { bold: "Nejjednodušší představa:", text: "Mapa pražského metra (např. Muzeum – Můstek – Florenc)." },
        { bold: "Stanice:", text: "Představují vrcholy (uzly / vertices V) grafu." },
        { bold: "Koleje mezi stanicemi:", text: "Představují hrany (spojnice / edges E) grafu." },
        { bold: "Základní princip:", text: "Graf = množina objektů + relace propojení mezi nimi." }
      ]
    },
    rightCard: {
      title: "Grafy Kolem Nás v Přírodě a Technice",
      badge: "PŘÍKLADY SÍTÍ",
      type: "warm",
      items: [
        { bold: "Proteinové interakce (PPI):", text: "Proteiny = vrcholy, fyzická biochemická vazba = hrana." },
        { bold: "Metabolická dráha:", text: "Metabolity = vrcholy, enzymatické konverze = orientované hrany." },
        { bold: "Sociální sítě:", text: "Uživatelé = vrcholy, vzájemné přátelství / sledování = hrana." },
        { bold: "Počítačová síť / Internet:", text: "Servery a routery = vrcholy, optické kabely = hrany." }
      ]
    }
  });

  // 3. Formal Definition G = (V, E)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Formální Matematická Definice: G = (V, E)",
    leftCard: {
      title: "1. Neorientovaný Graf",
      badge: "NEORIENTOVANÝ GRAF",
      type: "warm",
      items: [
        { bold: "Definice:", text: "Uspořádaná dvojice G = (V, E), kde V je neprázdná konečná množina vrcholů." },
        { bold: "Množina hran E:", text: "Množina dvouprvkových podmnožin V: E ⊆ {{u, v} | u, v ∈ V, u ≠ v}." },
        { bold: "Symetrie vazby:", text: "Hrana {u, v} je identická s {v, u}. Nemá žádný směr ani šipku." },
        { bold: "Příklady:", text: "Kovalentní vazby v molekule, silnice s obousměrným provozem." }
      ]
    },
    rightCard: {
      title: "2. Orientovaný Graf (Digraf)",
      badge: "ORIENTOVANÝ GRAF",
      type: "emerald",
      items: [
        { bold: "Definice:", text: "Uspořádaná dvojice G = (V, E), kde hrany jsou uspořádané dvojice." },
        { bold: "Množina hran E:", text: "E ⊆ V × V = {(u, v) | u, v ∈ V}. Zde záleží na pořadí!" },
        { bold: "Směr šipky:", text: "Hrana e = (u, v) vede z počátečního uzlu u do koncového uzlu v." },
        { bold: "Příklady:", text: "Metabolické reakce přeměny substrátu na produkt, jednosměrné toky energie." }
      ]
    }
  });

  // 4. Glucose as Undirected Graph
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Molekula Glukózy jako Neorientovaný Graf",
    leftCard: {
      title: "Chemický Pohled: C₆H₁₂O₆",
      badge: "CHEMIE",
      type: "neutral",
      items: [
        { bold: "Molekulární struktura:", text: "Cyklická pyranózová forma glukózy tvoří šestičlenný kruh." },
        { bold: "Atomy:", text: "6 atomů uhlíku C₁ až C₆ a kruhový kyslík O." },
        { bold: "Kovalentní vazby:", text: "Jednoduché vazby C–C, C–O a hydroxylové skupiny –OH." },
        { bold: "Symetrie sdílení elektronů:", text: "Elektronový pár je sdílen mezi atomy vzájemně (nemá směr šipky)." }
      ]
    },
    rightCard: {
      title: "Grafový Překlad v AG1: G = (V, E)",
      badge: "AG1 PŘEKLAD",
      type: "warm",
      items: [
        { bold: "Množina vrcholů V:", text: "V = {v₁, v₂, ..., v₁₂}, kde v₁ je kyslík O, v₂–v₇ jsou uhlíky C₁–C₆ a v₈–v₁₂ jsou substituenty OH." },
        { bold: "Množina hran E:", text: "E = {e₁, e₂, ..., e₁₂}, kde každá hrana je neuspořádaná dvojice {u, v}." },
        { bold: "Struktura kruhu:", text: "Uzly v₁ až v₆ tvoří kružnici C₆ o délce 6." },
        { bold: "Substituenty:", text: "Skupiny OH visí z kruhu jako listy stromu se stupněm 1." }
      ]
    }
  });

  // 5. Valence vs Vertex Degree
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Chemická Valence a Stupeň Vrcholu deg(v)",
    leftCard: {
      title: "Definice Stupně Vrcholu v AG1",
      badge: "MATEMATIKA",
      type: "warm",
      items: [
        { bold: "Značení:", text: "deg(v) značí počet incidentních hran napojených na vrchol v." },
        { bold: "Izolovaný uzel:", text: "Vrchol s deg(v) = 0 nemá žádné sousedy." },
        { bold: "List (Pendant vertex):", text: "Vrchol s deg(v) = 1 (v biologii např. koncový substituent či atom vodíku)." },
        { bold: "Handshaking Lemma:", text: "Součet stupňů všech vrcholů ∑ deg(v) je vždy přesně roven 2|E|." }
      ]
    },
    rightCard: {
      title: "Přímá Paralela s Chemickou Valencí",
      badge: "CHEMICKÁ ANALOGIE",
      type: "emerald",
      items: [
        { bold: "Uhlík (C):", text: "Čtyřvazný prvek → v plném molekulárním grafu má uzel C vždy deg(v) = 4." },
        { bold: "Kyslík (O):", text: "Dvojvazný prvek → v etherové vazbě kruhu má deg(v) = 2." },
        { bold: "Vodík (H):", text: "Jednovazný prvek → v grafu vystupuje striktně jako list s deg(v) = 1." },
        { bold: "Konzistence:", text: "Pravidla chemických valencí jsou přesně pravidly stupňů uzlů v grafové teorii!" }
      ]
    }
  });

  // 6. Glycolysis as Directed Acyclic Graph (DAG)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Metabolická Kaskáda Glykolýzy jako DAG",
    leftCard: {
      title: "Biochemická Podstata Kaskády",
      badge: "BIOCHEMIE",
      type: "neutral",
      items: [
        { bold: "Jednosměrnost reakcí:", text: "Při odbourávání cukru dochází ke štěpení ATP a uvolňování Gibbsovy volné energie ΔG < 0." },
        { bold: "Klíčové enzymy:", text: "Hexokináza, Fosfoglukoizomeráza (PGI), Fosfofruktokináza (PFK-1)." },
        { bold: "Nevratnost:", text: "Metabolity proudí přísně jedním směrem od Glukózy k Pyruvátu." },
        { bold: "Acykličnost:", text: "V glykolýze se molekula netočí dokola v uzavřeném kruhu." }
      ]
    },
    rightCard: {
      title: "Orientovaný Acyklický Graf (DAG) v AG1",
      badge: "AG1 DAG",
      type: "emerald",
      items: [
        { bold: "Množina metabolitů V:", text: "v₁ = Glukóza, v₂ = Glukóza-6-P, v₃ = Fruktóza-6-P, v₄ = Fruktóza-1,6-bisP." },
        { bold: "Orientované hrany E:", text: "E = {(v₁, v₂), (v₂, v₃), (v₃, v₄)} reprezentují enzymy." },
        { bold: "Topologické uspořádání:", text: "V každém DAGu lze vrcholy seřadit do lineární fronty tak, že všechny šipky směřují zleva doprava." },
        { bold: "Zdroje a Stoky:", text: "v₁ je zdroj (vstupní stupeň 0), finální pyruvát je stok (výstupní stupeň 0)." }
      ]
    }
  });

  // 7. Tree vs Cycle Comparison
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Klíčový Rozdíl: Strom vs. Cyklus v Grafu",
    leftCard: {
      title: "🌲 Strom (Acyklický Souvislý Graf)",
      badge: "ŽÁDNÉ SMYČKY",
      type: "emerald",
      items: [
        { bold: "Formální definice:", text: "Souvislý graf, který neobsahuje žádný cyklus." },
        { bold: "Unikátní vlastnost:", text: "Mezi libovolnými dvěma vrcholy existuje právě jedna jediná cesta!" },
        { bold: "Vzorec pro počet hran:", text: "Pro strom s n vrcholy platí vždy přesně |E| = n - 1." },
        { bold: "Biologický příklad:", text: "Fylogenetický strom taxonů od společného předka (LUCA) po současné druhy." }
      ]
    },
    rightCard: {
      title: "🔄 Cyklus (Uzavřený Okruh)",
      badge: "ZPĚTNÁ VAZBA",
      type: "rose",
      items: [
        { bold: "Formální definice:", text: "Uzavřená posloupnost hran, kde z výchozího vrcholu vyrazíme a vrátíme se do něj zpět." },
        { bold: "Důsledek:", text: "Umožňuje existenci alternativních cest, redundanci a oscilace." },
        { bold: "Vzorec pro kružnici:", text: "Jednoduchá kružnice C_n o n vrcholech má přesně n hran (|E| = |V|)." },
        { bold: "Biologický příklad:", text: "Krebsův citrátový cyklus (OAA → Citrát → αKG → Sukcinát → Malát → OAA)." }
      ]
    }
  });

  // 8. Graph Isomorphism
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Izomorfismus Grafů: Stejná Struktura pod Jiným Jménem",
    leftCard: {
      title: "Proč Geometrický Nákres Klame?",
      badge: "STRUKTURA GRAFU",
      type: "warm",
      items: [
        { bold: "Nezávislost na souřadnicích:", text: "Graf nezávisí na tom, kde v rovině vrcholy nakreslíte ani jak dlouhé čáry zvolíte." },
        { bold: "Podstata grafu:", text: "Záleží výhradně na tom, které dvojice vrcholů jsou propojeny hranou." },
        { bold: "Příklad:", text: "Kružnici C₄ můžete nakreslit jako čtverec, kosočtverec, kruh nebo přesýpací hodiny – pořád je to tentýž graf!" }
      ]
    },
    rightCard: {
      title: "Formální Definice Izomorfismu",
      badge: "AG1 DEFINICE",
      type: "neutral",
      items: [
        { bold: "Bijekce vrcholů:", text: "Grafy G₁ = (V₁, E₁) a G₂ = (V₂, E₂) jsou izomorfní (G₁ ≅ G₂), pokud existuje bijekce f: V₁ → V₂." },
        { bold: "Zachování hran:", text: "Pro každé u, v ∈ V₁ platí: {u, v} ∈ E₁ ⇔ {f(u), f(v)} ∈ E₂." },
        { bold: "Význam pro bioinformatiku:", text: "Hledání izomorfismu podgrafů odpovídá vyhledávání chemických funkčních motivů v databázích molekul." }
      ]
    }
  });
}
