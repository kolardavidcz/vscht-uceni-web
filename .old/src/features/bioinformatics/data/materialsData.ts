export interface SchoolMaterialNode {
  id: string;
  name: string;
  relevance?: number; // Optional now, since intermediate nodes don't have it
  quality?: boolean;   // Optional now, since intermediate nodes don't have it
  badges?: ('epic' | 'insight' | 'challenge' | 'practice' | 'mega_epic' | 'no_code' | 'showcase' | 'not_checked')[];
  children?: SchoolMaterialNode[];
}

export interface SchoolMaterial extends SchoolMaterialNode {
  category: 'E-learning' | 'Lectures' | 'Seminars' | 'Trainer';
  tags: string[];
}

export const materialsData: SchoolMaterial[] = [
  {
    "id": "lec-week01",
    "category": "Lectures",
    "name": "Téma 1: Od C k C++ (neobjektová rozšíření) [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-02-18_1_3_3476742621.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t01-1",
        "name": "První program v C++",
        "relevance": 40,
        "quality": true
      },
      {
        "id": "lec-t01-2",
        "name": "Jmenné prostory",
        "relevance": 40,
        "quality": true
      },
      {
        "id": "lec-t01-3",
        "name": "Typ bool",
        "relevance": 10,
        "quality": true
      },
      {
        "id": "lec-t01-4",
        "name": "Struktury",
        "relevance": 10,
        "quality": true
      },
      {
        "id": "lec-t01-5",
        "name": "Vstup/výstup v C++",
        "relevance": 30,
        "quality": true
      },
      {
        "id": "lec-t01-6",
        "name": "Reference",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "lec-t01-7",
        "name": "Implicitní parametry funkcí",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "lec-t01-8",
        "name": "Inline funkce",
        "relevance": 30,
        "quality": false
      },
      {
        "id": "lec-t01-9",
        "name": "Přetěžování funkcí",
        "relevance": 50,
        "quality": false
      },
      {
        "id": "lec-t01-10",
        "name": "Dynamické proměnné – operátory new a delete",
        "relevance": 10,
        "quality": true
      },
      {
        "id": "lec-t01-11",
        "name": "Některá vylepšení C++ 14 a 17",
        "relevance": 50,
        "quality": true
      }
    ]
  },
  {
    "id": "sem-week01",
    "category": "Seminars",
    "name": "Proseminář 01: C++ a I/O operace [(paralelka č. 1)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-02-18_1_1_3476712276.html)",
    "tags": [
      "seminars"
    ],
    "children": [
      {
        "id": "sem-p01-1",
        "name": "Formátovaný a neformátovaný výstup",
        "relevance": 0,
        "quality": false,
        "badges": []
      },
      {
        "id": "sem-p01-2",
        "name": "Binární a textové soubory",
        "relevance": 0,
        "quality": false,
        "badges": []
      },
      {
        "id": "sem-p01-3",
        "name": "I/O operace v C, nedostatky",
        "relevance": 0,
        "quality": false,
        "badges": []
      },
      {
        "id": "sem-p01-4",
        "name": "I/O v C++, manipulátory",
        "relevance": 25,
        "quality": true,
        "badges": []
      },
      {
        "id": "sem-p01-5",
        "name": "Vstup v C++, ošetření chyb",
        "relevance": 50,
        "quality": true,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p01-6",
        "name": "Paměťové a souborové proudy",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      }
    ]
  },
  {
    "id": "tr-week01",
    "category": "Trainer",
    "name": "Týden 01: Základní konstrukce C++",
    "tags": [
      "trainer",
      "mega-cool"
    ],
    "children": [
      {
        "id": "tr-w01-l2",
        "name": "Lekce: Úvod do C++",
        "children": [
          {
            "id": "tr-w01-l2-s1",
            "name": "Jednodušší struktury",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s2",
            "name": "Jmenné prostory",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s3",
            "name": "Operátory new a delete",
            "relevance": 60,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s5",
            "name": "Reference",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s7",
            "name": "Reference na konstantu",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s9",
            "name": "Přetěžování funkcí",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s10",
            "name": "Výchozí argumenty",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s11",
            "name": "Řazení v C++",
            "relevance": 70,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w01-l2-s12",
            "name": "Vstup a výstup v C++",
            "relevance": 50,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w01-l3",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w01-l3-s1",
            "name": "Unikátní kvádry",
            "relevance": 70,
            "quality": true,
            "badges": [
              "challenge",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week02",
    "category": "Lectures",
    "name": "Téma 2: Programovací styly a třídy [(paralelka č.3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-02-25_2_3_3476742622.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t02-1",
        "name": "Programovací styly: naivní, procedurální, objektově orientovaný",
        "relevance": 20,
        "quality": false
      },
      {
        "id": "lec-t02-2",
        "name": "Třídy a objekty",
        "relevance": 20,
        "quality": false
      },
      {
        "id": "lec-t02-3",
        "name": "Rozdíl mezi class a struct",
        "relevance": 20,
        "quality": true
      },
      {
        "id": "lec-t02-4",
        "name": "Klíčové slovo this",
        "relevance": 20,
        "quality": true
      },
      {
        "id": "lec-t02-5",
        "name": "Konstantní (const) objekty a metody",
        "relevance": 20,
        "quality": true
      },
      {
        "id": "lec-t02-6",
        "name": "Konstruktory, implicitní konstruktor",
        "relevance": 35,
        "quality": true
      },
      {
        "id": "lec-t02-7",
        "name": "Lokální deklarace",
        "relevance": 20,
        "quality": true
      },
      {
        "id": "lec-t02-8",
        "name": "Statické metody a statické proměnné",
        "relevance": 20,
        "quality": true
      }
    ]
  },
  {
    "id": "sem-week02",
    "category": "Seminars",
    "name": "Proseminář 02: C++ a OOP [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-03-11_2_3_3476712361.html)",
    "tags": [
      "seminars"
    ],
    "children": [
      {
        "id": "sem-p02-1",
        "name": "Naivní řešení",
        "relevance": 10,
        "quality": true,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p02-2",
        "name": "Využití C struktur",
        "relevance": 10,
        "quality": true,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p02-3",
        "name": "Zapouzdření",
        "relevance": 20,
        "quality": true,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p02-4",
        "name": "Skládání",
        "relevance": 20,
        "quality": true,
        "badges": [
          "showcase"
        ]
      }
    ]
  },
  {
    "id": "tr-week02",
    "category": "Trainer",
    "name": "Týden 02: Úvod do OOP",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w02-l1",
        "name": "Lekce: Třídy, úvod do OOP",
        "children": [
          {
            "id": "tr-w02-l1-s1",
            "name": "Metody",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l1-s5",
            "name": "Statické členy",
            "relevance": 65,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l1-s8",
            "name": "Konstruktory",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l1-s12",
            "name": "Zapouzdření",
            "relevance": 70,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l1-s15",
            "name": "Rozhraní",
            "relevance": 55,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l1-s16",
            "name": "Gettery a settery",
            "relevance": 50,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l1-s17",
            "name": "Řetězení volání metod",
            "relevance": 40,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w02-l2",
        "name": "Lekce: Úvod do STL",
        "children": [
          {
            "id": "tr-w02-l2-s1",
            "name": "Dynamické pole std::vector",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l2-s2",
            "name": "Chytré řetězce std::string",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l2-s3",
            "name": "Základy iterátorů",
            "relevance": 85,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w02-l2-s4",
            "name": "Základní porovnávací funkce",
            "relevance": 70,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w02-l3",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w02-l3-s2",
            "name": "Databáze studentů",
            "relevance": 80,
            "quality": true,
            "badges": [
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week03",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 3: Přetížené operátory [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-03-04_3_3_3476742623.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t03-1",
        "name": "Motivace pro přetěžování operátorů – racionální čísla",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t03-2",
        "name": "friend funkce",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t03-3",
        "name": "Zapouzdření",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t03-4",
        "name": "Uživatelské konverze",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t03-5",
        "name": "Přehled přetížitelných operátorů",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t03-6",
        "name": "Kompilační jednotky a make",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "sem-week03",
    "category": "Seminars",
    "name": "Proseminář 03: C++ a přetěžování operátorů [(paralelka č. 1)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-03-18_3_1_3476712278.html), [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-03-25_3_3_3476712362.html)",
    "tags": [
      "seminars"
    ],
    "children": [
      {
        "id": "sem-p03-1",
        "name": "Řetězce",
        "relevance": 10,
        "quality": true,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p03-2",
        "name": "Řetězce s počítanými referencemi",
        "relevance": 5,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p03-3",
        "name": "Zlomky",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      }
    ]
  },
  {
    "id": "tr-week03",
    "category": "Trainer",
    "name": "Týden 03: Základní kontejnery",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w03-l1",
        "name": "Lekce: Iterátory (základní použití)",
        "children": [
          {
            "id": "tr-w03-l1-s1",
            "name": "Výpis vectoru pozpátku",
            "relevance": 90,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w03-l1-s2",
            "name": "Vyhledávání ve vectoru",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w03-l1-s3",
            "name": "Mazání z vectoru",
            "relevance": 90,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w03-l2",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w03-l2-s1",
            "name": "Galerie",
            "relevance": 70,
            "quality": true,
            "badges": [
              "practice",
              "challenge"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week04",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 4: Kopírování objektů [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-03-11_4_3_3476742624.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t04-1",
        "name": "Kopírovací konstruktor a operátor přiřazení",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t04-2",
        "name": "Hluboká a mělká kopie",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t04-3",
        "name": "Rvalue reference, unique_ptr",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t04-4",
        "name": "Přesouvací konstruktor a operátor přiřazení",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t04-5",
        "name": "Mělká kopie a shared_ptr",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t04-6",
        "name": "Copy-on-write",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t04-7",
        "name": "Některé algoritmy pro práci s polem",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "sem-week04",
    "category": "Seminars",
    "name": "Proseminář 04: C++ a generické třídy [(paralelka č. 1)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-04-01_4_1_3476712279.html), [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-04-08_4_3_3476712363.html)",
    "tags": [
      "seminars"
    ],
    "children": [
      {
        "id": "sem-p04-1",
        "name": "Používání šablon, std::vector",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p04-2",
        "name": "Strom jako datová struktura",
        "relevance": 40,
        "quality": true,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p04-3",
        "name": "Binární vyhledávací strom",
        "relevance": 20,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p04-4",
        "name": "Strom jako množina",
        "relevance": 5,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p04-5",
        "name": "Generická třída množina realizovaná pomocí binárního vyhledávacího stromu",
        "relevance": 10,
        "quality": false,
        "badges": [
          "showcase"
        ]
      }
    ]
  },
  {
    "id": "tr-week04",
    "category": "Trainer",
    "name": "Týden 04: Operátory",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w04-l1",
        "name": "Lekce: Přetěžování operátorů",
        "children": [
          {
            "id": "tr-w04-l1-s1",
            "name": "Metoda versus funkce",
            "relevance": 80,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s2",
            "name": "Porovnávání",
            "relevance": 80,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s3",
            "name": "Uspořádání",
            "relevance": 100,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s4",
            "name": "Podpora logických výrazů",
            "relevance": 70,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s5",
            "name": "Aritmetické operace",
            "relevance": 55,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s6",
            "name": "Vstup a výstup",
            "relevance": 50,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s7",
            "name": "Přístup k datům",
            "relevance": 40,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w04-l1-s8",
            "name": "Další operátory",
            "relevance": 40,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w04-l2",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w04-l2-s1",
            "name": "Komplexní čísla",
            "relevance": 80,
            "quality": true,
            "badges": [
              "practice"
            ]
          },
          {
            "id": "tr-w04-l2-s4",
            "name": "Unikátní kvádry VII",
            "relevance": 60,
            "quality": true,
            "badges": [
              "practice"
            ]
          }
        ]
      },
      {
        "id": "tr-w04-l3",
        "name": "Lekce: Samostatná práce",
        "children": [
          {
            "id": "tr-w04-l3-s1",
            "name": "Iterátor Fibonacciho posloupnosti",
            "relevance": 50,
            "quality": true,
            "badges": [
              "practice"
            ]
          },
          {
            "id": "tr-w04-l3-s2",
            "name": "Bitové pole",
            "relevance": 35,
            "quality": false,
            "badges": [
              "challenge",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week05",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 5: Vybrané komponenty knihovny STL [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-03-18_5_3_3476742625.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t05-1",
        "name": "Ukázky použití STL: vector, set, map",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t05-2",
        "name": "Koncepty: generické třídy, iterátory, funktory",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t05-3",
        "name": "Lambda funkce",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t05-4",
        "name": "Základní kontejnery: array, vector, deque, list, set, map",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t05-5",
        "name": "Knihovna algoritmů",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "sem-week05",
    "category": "Seminars",
    "name": "Proseminář 05: Dědičnost a polymorfismus v C++ [(paralelka č. 1)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-04-15_5_1_3476712280.html)",
    "tags": [
      "seminars"
    ],
    "children": [
      {
        "id": "sem-p05-1",
        "name": "Jednoduchý příklad na dědičnost – registr zákonného pojištění automobilů",
        "relevance": 5,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p05-2",
        "name": "Složitější příklad – zobrazení výrazu (část I)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      }
    ]
  },
  {
    "id": "tr-week05",
    "category": "Trainer",
    "name": "Týden 05: Kopie a přesouvání",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w05-l1",
        "name": "Lekce: Kopírování objektů",
        "children": [
          {
            "id": "tr-w05-l1-s1",
            "name": "Chytré členské proměné",
            "relevance": 50,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w05-l1-s2",
            "name": "Pravidlo tří",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l1-s3",
            "name": "Zakázaná kopie",
            "relevance": 10,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w05-l1-s4",
            "name": "Copy and swap",
            "relevance": 30,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l1-s5",
            "name": "Hluboká kopie",
            "relevance": 30,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w05-l1-s6",
            "name": "Počítání referencí",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l1-s7",
            "name": "Copy on write",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l1-s8",
            "name": "Proxy",
            "relevance": 0,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w05-l2",
        "name": "Lekce: Přesouvání objektů",
        "children": [
          {
            "id": "tr-w05-l2-s1",
            "name": "Reference na pravou stranu",
            "relevance": 50,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l2-s2",
            "name": "Přesouvací sémantika",
            "relevance": 20,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l2-s3",
            "name": "Pravidlo pěti",
            "relevance": 5,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w05-l2-s4",
            "name": "Move and swap",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w05-l2-s5",
            "name": "Specifikátor noexcept",
            "relevance": 45,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w05-l2-s6",
            "name": "Sjednocující přiřazení",
            "relevance": 15,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w05-l2-s7",
            "name": "Příklady z STL",
            "relevance": 20,
            "quality": true,
            "badges": [
              "epic"
            ]
          }
        ]
      },
      {
        "id": "tr-w05-l3",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w05-l3-s1",
            "name": "C++ řetězce",
            "relevance": 20,
            "quality": false,
            "badges": [
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week06",
    "category": "Lectures",
    "name": "Téma 6: Základní grafové algoritmy [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-03-25_6_3_3476742626.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t06-1",
        "name": "Algoritmy BFS a DFS",
        "relevance": 60,
        "quality": true
      },
      {
        "id": "lec-t06-2",
        "name": "Výjimky",
        "relevance": 10,
        "quality": true
      }
    ]
  },
  {
    "id": "sem-week06",
    "category": "Seminars",
    "name": "Proseminář 06: Make, Makefile, staticky a dynamicky linkované knihovny [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_cvi_2026-05-06_6_3_3487756156.html)",
    "tags": [
      "seminars"
    ],
    "children": [
      {
        "id": "sem-p06-1",
        "name": "Postup kompilace a linkování",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p06-2",
        "name": "Vytváření a používání knihoven: staticky linkované knihovny, dynamicky linkované knihovny, dynamicky linkované knihovny jako zásuvné moduly",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      },
      {
        "id": "sem-p06-3",
        "name": "Nástroje pro práci s knihovnami",
        "relevance": 0,
        "quality": false,
        "badges": [
          "showcase"
        ]
      }
    ]
  },
  {
    "id": "tr-week06",
    "category": "Trainer",
    "name": "Týden 06: Pokročilejší STL",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w06-l1",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w06-l1-s1",
            "name": "Statistika slov",
            "relevance": 50,
            "quality": true,
            "badges": [
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week07",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 7: Dědění a polymorfismus v C++ [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-04-01_7_3_3476742627.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t07-1",
        "name": "Polymorfismus",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t07-2",
        "name": "Dědičnost",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t07-3",
        "name": "Statická a dynamická vazba",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "tr-week07",
    "category": "Trainer",
    "name": "Týden 07: Procházení grafů",
    "tags": [
      "trainer",
      "mega-cool"
    ],
    "children": [
      {
        "id": "tr-w07-l1",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w07-l1-s1",
            "name": "Orientovaný graf I (BFS)",
            "relevance": 100,
            "quality": true,
            "badges": [
              "mega_epic",
              "practice"
            ]
          },
          {
            "id": "tr-w07-l1-s1",
            "name": "Orientovaný graf II (BFS/DFS)",
            "relevance": 100,
            "quality": true,
            "badges": [
              "mega_epic",
              "practice"
            ]
          },
          {
            "id": "tr-w07-l1-s1",
            "name": "Orientovaný graf III (BFS/DFS/Dijkstra)",
            "relevance": 100,
            "quality": true,
            "badges": [
              "challenge",
              "mega_epic",
              "practice"
            ]
          },
          {
            "id": "tr-w07-l1-s1",
            "name": "Orientovaný graf IV (DFS/TopSort)",
            "relevance": 80,
            "quality": true,
            "badges": [
              "challenge",
              "mega_epic",
              "practice"
            ]
          }
        ]
      },
      {
        "id": "tr-w07-l2",
        "name": "Lekce: Samostatná práce",
        "children": [
          {
            "id": "tr-w07-l2-s1",
            "name": "Bludiště I",
            "relevance": 100,
            "quality": true,
            "badges": [
              "mega_epic",
              "practice"
            ]
          },
          {
            "id": "tr-w07-l2-s1",
            "name": "Bludiště II",
            "relevance": 50,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week08",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 8: Abstraktní třídy v C++ [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-04-08_8_3_3476742628.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t08-1",
        "name": "Abstraktní třídy",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t08-2",
        "name": "Heterogenní (polymorfní) datové struktury",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t08-3",
        "name": "RTTI",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "tr-week08",
    "category": "Trainer",
    "name": "Týden 08: Polymorfismus",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w08-l1",
        "name": "Lekce: Základní myšlenka polymorfismu",
        "children": [
          {
            "id": "tr-w08-l1-s1",
            "name": "Motivace",
            "relevance": 25,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w08-l1-s3",
            "name": "Polymorfismus",
            "relevance": 50,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w08-l1-s4",
            "name": "Motivace - Řešení",
            "relevance": 25,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w08-l2",
        "name": "Lekce: Polymorfismus v C++",
        "children": [
          {
            "id": "tr-w08-l2-s1",
            "name": "Dědičnost",
            "relevance": 40,
            "quality": true,
            "badges": [
              "epic"
            ]
          },
          {
            "id": "tr-w08-l2-s2",
            "name": "Virtuální metody a dynamická vazba",
            "relevance": 10,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w08-l2-s5",
            "name": "Abstraktní třída",
            "relevance": 10,
            "quality": true,
            "badges": []
          },
          {
            "id": "tr-w08-l2-s6",
            "name": "Chytré pointery",
            "relevance": 20,
            "quality": true,
            "badges": [
              "epic",
              "challenge"
            ]
          },
          {
            "id": "tr-w08-l2-s7",
            "name": "A je to k něčemu dobrý?",
            "relevance": 10,
            "quality": true,
            "badges": []
          }
        ]
      },
      {
        "id": "tr-w08-l3",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w08-l3-s1",
            "name": "Aritmetický výraz",
            "relevance": 30,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          }
        ]
      },
      {
        "id": "tr-w08-l4",
        "name": "Lekce: Samostatná práce",
        "children": [
          {
            "id": "tr-w08-l4-s1",
            "name": "Grep",
            "relevance": 30,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week09",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 9: Šablony v C++ [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-04-15_9_3_3476742629.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t09-1",
        "name": "Šablony",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t09-2",
        "name": "Šablony funkcí",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t09-3",
        "name": "Šablony tříd",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t09-4",
        "name": "constexpr",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "tr-week09",
    "category": "Trainer",
    "name": "Týden 09: Polymorfismus II",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w09-l1",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w09-l1-s1",
            "name": "Sklad výbušnin",
            "relevance": 15,
            "quality": true,
            "badges": [
              "challenge",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week10",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 10: Abstraktní datové typy v C++ [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-04-22_10_3_3476742630.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t10-1",
        "name": "ADT implementované jako generické třídy",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t10-2",
        "name": "Zásobník (stack)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t10-3",
        "name": "Fronta (queue)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t10-4",
        "name": "Pole (array)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t10-5",
        "name": "Binární halda (binary heap)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "tr-week10",
    "category": "Trainer",
    "name": "Týden 10: Šablony",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w10-l1",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w10-l1-s1",
            "name": "Spojový seznam I",
            "relevance": 50,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          },
          {
            "id": "tr-w10-l1-s1",
            "name": "Spojový seznam I+ & II & II+",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          },
          {
            "id": "tr-w10-l1-s5",
            "name": "Součet argumentů",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week11",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 11: Abstraktní datové typy v C++ II [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-04-29_11_3_3476742631.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t11-1",
        "name": "Množina (set)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t11-2",
        "name": "Tabulka (map)",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t11-3",
        "name": "Binární vyhledávací strom",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t11-4",
        "name": "Hashovací tabulka",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "tr-week11",
    "category": "Trainer",
    "name": "Týden 11: Šablony II",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w11-l1",
        "name": "Lekce: Cvičení",
        "children": [
          {
            "id": "tr-w11-l1-s1",
            "name": "Šablona pole I",
            "relevance": 60,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          },
          {
            "id": "tr-w11-l1-s1",
            "name": "Šablona pole II & III",
            "relevance": 20,
            "quality": true,
            "badges": [
              "epic",
              "challenge",
              "practice"
            ]
          },
          {
            "id": "tr-w11-l1-s4",
            "name": "Funkce jako parametr",
            "relevance": 10,
            "quality": true,
            "badges": [
              "epic",
              "practice"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week12",
    "category": "Lectures",
    "name": "__ NOT CHECKED__ Téma 12: Vyhledávání v textu [(paralelka č. 3)](https://online.fit.cvut.cz/zaznam/B252/bi-pa2.21_pre_2026-05-06_12_3_3476742632.html)",
    "tags": [
      "lectures"
    ],
    "children": [
      {
        "id": "lec-t12-1",
        "name": "Vyhledávání v textu",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t12-2",
        "name": "Rabin–Karp",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      },
      {
        "id": "lec-t12-3",
        "name": "KMP",
        "relevance": 0,
        "quality": false,
        "badges": [
          "not_checked"
        ]
      }
    ]
  },
  {
    "id": "tr-week12",
    "category": "Trainer",
    "name": "Týden 12: Procvičování",
    "tags": [
      "trainer"
    ],
    "children": [
      {
        "id": "tr-w12-l1",
        "name": "Lekce: Procvičování ke zkoušce",
        "children": [
          {
            "id": "tr-w12-l1-s1",
            "name": "Šablona množiny",
            "relevance": 60,
            "quality": true,
            "badges": [
              "mega_epic",
              "challenge"
            ]
          },
          {
            "id": "tr-w12-l1-s2",
            "name": "Balíčkovací systém",
            "relevance": 20,
            "quality": true,
            "badges": [
              "epic"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "el-ch01",
    "category": "E-learning",
    "name": "Kapitola 01: Třídy a objekty",
    "tags": [
      "elearning"
    ]
  },
  {
    "id": "el-ch02",
    "category": "E-learning",
    "name": "Kapitola 02: Základní pojmy objektově orientovaného programování",
    "tags": [
      "elearning"
    ]
  },
  {
    "id": "el-ch03",
    "category": "E-learning",
    "name": "Kapitola 03: Rozšíření C → C++",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch03-1",
        "name": "1. První program v jazyce C++",
        "relevance": 10,
        "quality": true
      },
      {
        "id": "el-ch03-2",
        "name": "2. Jmenné prostory",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch03-3",
        "name": "3. Typ bool",
        "relevance": 30,
        "quality": true
      },
      {
        "id": "el-ch03-4",
        "name": "4. Standardní vstup a výstup",
        "relevance": 10,
        "quality": true
      },
      {
        "id": "el-ch03-5",
        "name": "5. Výstup, I/O manipulátory",
        "relevance": 15,
        "quality": true,
        "badges": [
          "epic"
        ]
      },
      {
        "id": "el-ch03-6",
        "name": "6. Vstup, I/O manipulátory",
        "relevance": 15,
        "quality": true,
        "badges": [
          "epic"
        ]
      },
      {
        "id": "el-ch03-7",
        "name": "7. Typ reference",
        "relevance": 30,
        "quality": false
      },
      {
        "id": "el-ch03-8",
        "name": "8. Konstanty, klíčové slovo const",
        "relevance": 50,
        "quality": false
      },
      {
        "id": "el-ch03-9",
        "name": "9. Konstantní reference",
        "relevance": 40,
        "quality": false
      },
      {
        "id": "el-ch03-10",
        "name": "10. Konstantní ukazatel a ukazatel na konstantu",
        "relevance": 40,
        "quality": false
      },
      {
        "id": "el-ch03-11",
        "name": "11. Deklarace jako příkaz",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch03-12",
        "name": "12. Struktury",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch03-13",
        "name": "13. Dynamické proměnné",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch03-14",
        "name": "14. Inline funkce",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch03-15",
        "name": "15. Implicitní parametry funkcí",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch03-16",
        "name": "16. Přetěžování funkcí",
        "relevance": 20,
        "quality": true,
        "badges": [
          "epic"
        ]
      }
    ]
  },
  {
    "id": "el-ch04",
    "category": "E-learning",
    "name": "Kapitola 04: Programátorský styl",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch04-1",
        "name": "1. Naivní styl",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch04-2",
        "name": "2. Procedurální styl",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch04-3",
        "name": "3. Objektově",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch04-4",
        "name": "4. Zásobník jako třída",
        "relevance": 0,
        "quality": false
      }
    ]
  },
  {
    "id": "el-ch05",
    "category": "E-learning",
    "name": "Kapitola 05: Třídy a objekty",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch05-1",
        "name": "1. Deklarace třídy",
        "relevance": 50,
        "quality": false
      },
      {
        "id": "el-ch05-2",
        "name": "2. Definice metod, konstruktorů a destruktoru",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch05-3",
        "name": "3. Zviditelnění zastíněných členů v členské funkci",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch05-4",
        "name": "4. Inline členské funkce",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch05-5",
        "name": "5. Class a struct",
        "relevance": 40,
        "quality": true
      },
      {
        "id": "el-ch05-6",
        "name": "6. Objekty",
        "relevance": 40,
        "quality": false
      },
      {
        "id": "el-ch05-7",
        "name": "7. Konstantní metody",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch05-8",
        "name": "8. Volání konstruktoru a destruktoru",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch05-9",
        "name": "9. Pole objektů",
        "relevance": 20,
        "quality": true
      },
      {
        "id": "el-ch05-10",
        "name": "10. Implicitní konstruktor",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch05-11",
        "name": "11. Inicializační část konstruktoru",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch05-12",
        "name": "12. Lokální deklarace ve třídě",
        "relevance": 5,
        "quality": false
      },
      {
        "id": "el-ch05-13",
        "name": "13. Statické členy třídy",
        "relevance": 20,
        "quality": true
      }
    ]
  },
  {
    "id": "el-ch06",
    "category": "E-learning",
    "name": "Kapitola 06: Přetěžování operátorů, třída Zlomek, uživatelská konverze",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch06-1",
        "name": "1. Aritmetika zlomků pomocí obyčejných funkcí",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch06-2",
        "name": "2. Aritmetika pomocí metod",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch06-3",
        "name": "3. Přetížení operátorů obyčejnými funkcemi",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch06-4",
        "name": "4. Přetížení operátorů metodami",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch06-5",
        "name": "5. Přetížení operátorů spřátelenými funkcemi",
        "relevance": 15,
        "quality": false
      },
      {
        "id": "el-ch06-6",
        "name": "6. Uživatelská konverze",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch06-7",
        "name": "7. Přehled přetěžování binárních operátorů",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch06-8",
        "name": "8. Přehled přetěžování unárních operátorů",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch06-9",
        "name": "9. Přetížení operátoru indexace",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch06-10",
        "name": "10. Přetížení operátoru volání funkce",
        "relevance": 5,
        "quality": false
      },
      {
        "id": "el-ch06-11",
        "name": "11. Přetížení unárního operátoru →",
        "relevance": 0,
        "quality": false
      }
    ]
  },
  {
    "id": "el-ch07",
    "category": "E-learning",
    "name": "Kapitola 07: Přiřazení, mělká a hluboká kopie",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch07-1",
        "name": "1. Hluboká kopie",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch07-2",
        "name": "2. Kopírující konstruktor",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch07-3",
        "name": "3. Mělká kopie - počítané reference",
        "relevance": 10,
        "quality": true
      },
      {
        "id": "el-ch07-4",
        "name": "4. Reference na pravou stranu",
        "relevance": 50,
        "quality": true
      },
      {
        "id": "el-ch07-5",
        "name": "5. Přesouvací konstruktor",
        "relevance": 0,
        "quality": false
      },
      {
        "id": "el-ch07-6",
        "name": "6. Přesouvací operátor přiřazení",
        "relevance": 0,
        "quality": false
      }
    ]
  },
  {
    "id": "el-ch08",
    "category": "E-learning",
    "name": "Kapitola 08: Znakové řetězce libovolné délky - třída std::string",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch08-1",
        "name": "Znakové řetězce libovolné délky - třída std::string",
        "relevance": 10,
        "quality": false
      }
    ]
  },
  {
    "id": "el-ch11-pt1",
    "category": "E-learning",
    "name": "Kapitola 11: Abstraktní datové typy, standardní knihovna",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch11-pt1-1",
        "name": "1. Standardní knihovna, kontejnery",
        "relevance": 60,
        "quality": true,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt1-2",
        "name": "2. Iterátory",
        "relevance": 35,
        "quality": true,
        "badges": [
          "epic",
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt1-3",
        "name": "3. Vektor (vector)",
        "relevance": 90,
        "quality": true,
        "badges": [
          "epic",
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt1-4",
        "name": "4. Pole (Array)",
        "relevance": 60,
        "quality": true,
        "badges": [
          "no_code"
        ]
      }
    ]
  },
  {
    "id": "el-ch09",
    "category": "E-learning",
    "name": "Kapitola 09: Ošetření chyb, výjimky",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch09-1",
        "name": "1. Ošetření chyb v jazyce C",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch09-2",
        "name": "2. Výjimky - exceptions",
        "relevance": 15,
        "quality": false,
        "badges": [
          "no_code"
        ]
      }
    ]
  },
  {
    "id": "el-ch10",
    "category": "E-learning",
    "name": "Kapitola 10: Šablony - template",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch10-1",
        "name": "1. Šablony funkcí",
        "relevance": 60,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch10-2",
        "name": "2. Šablony tříd",
        "relevance": 60,
        "quality": true,
        "badges": [
          "no_code"
        ]
      }
    ]
  },
  {
    "id": "el-ch11-pt2",
    "category": "E-learning",
    "name": "Kapitola 11 - část 2: Abstraktní datové typy, standardní knihovna",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch11-pt2-5",
        "name": "5. Oboustranná fronta (std::deque)",
        "relevance": 80,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-6",
        "name": "6. Seznam (list)",
        "relevance": 80,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-7",
        "name": "7. Jednosměrně zřetězený seznam (std::forward_list)",
        "relevance": 50,
        "quality": false,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt2-8",
        "name": "8. Zásobník (std::stack)",
        "relevance": 90,
        "quality": true,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt2-9",
        "name": "9. Fronta (queue)",
        "relevance": 100,
        "quality": true,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt2-10",
        "name": "10. Prioritní fronta (std::priority_queue)",
        "relevance": 100,
        "quality": true,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt2-11",
        "name": "11. Množina (set)",
        "relevance": 60,
        "quality": false,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-12",
        "name": "12. Bitová množina (std::bitset)",
        "relevance": 30,
        "quality": true,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt2-13",
        "name": "13. Multimnožina (std::multiset)",
        "relevance": 30,
        "quality": true
      },
      {
        "id": "el-ch11-pt2-14",
        "name": "14. Tabulka (map)",
        "relevance": 70,
        "quality": true,
        "badges": [
          "no_code",
          "epic"
        ]
      },
      {
        "id": "el-ch11-pt2-15",
        "name": "15. Tabulka s opakováním klíčů (multimap)",
        "relevance": 30,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-16",
        "name": "16. Neuspořádaná množina (std::unordered_set)",
        "relevance": 50,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-17",
        "name": "17. Neuspořádaná multimnožina (std::unordered_multiset)",
        "relevance": 20,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-18",
        "name": "18. Neuspořádaná tabulka (unordered map)",
        "relevance": 50,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch11-pt2-19",
        "name": "19. Neuspořádaná multitabulka (std::unordered_multimap)",
        "relevance": 20,
        "quality": true,
        "badges": [
          "no_code"
        ]
      }
    ]
  },
  {
    "id": "el-ch12",
    "category": "E-learning",
    "name": "Kapitola 12: Stromy",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch12-1",
        "name": "1. Orientované grafy",
        "relevance": 90,
        "quality": true,
        "badges": [
          "no_code"
        ]
      },
      {
        "id": "el-ch12-2",
        "name": "2. Binární vyhledávací strom",
        "relevance": 100,
        "quality": true,
        "badges": [
          "no_code"
        ]
      }
    ]
  },
  {
    "id": "el-ch13",
    "category": "E-learning",
    "name": "Kapitola 13: Dědičnost (inheritance), dynamicky vázané metody, polymorfizmus",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch13-1",
        "name": "1. Dědičnost",
        "relevance": 20,
        "quality": false
      },
      {
        "id": "el-ch13-2",
        "name": "2. Dynamická (pozdní) vazba",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch13-3",
        "name": "3. Abstraktní třídy",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch13-4",
        "name": "4. Polymorfní datové struktury",
        "relevance": 20,
        "quality": false
      },
      {
        "id": "el-ch13-5",
        "name": "5. Identifikace typu za běhu programu - RTTI",
        "relevance": 10,
        "quality": false
      },
      {
        "id": "el-ch13-6",
        "name": "6. Přehled přetypování",
        "relevance": 10,
        "quality": false
      }
    ]
  }
];
