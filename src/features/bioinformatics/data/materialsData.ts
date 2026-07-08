export interface SchoolMaterialNode {
  id: string;
  name: string;
  relevance: number;
  difficulty: number;
  quality: number;
  aiReasoning: string;
  children?: SchoolMaterialNode[];
}

export interface SchoolMaterial extends SchoolMaterialNode {
  category: 'E-learning' | 'Lectures' | 'Seminars' | 'Trainer';
  trainerWeight?: number;
  tags: string[];
}

export const materialsData: SchoolMaterial[] = [
  {
    "id": "tr-week01",
    "category": "Trainer",
    "name": "Týden 01: Základní konstrukce C++",
    "relevance": 100,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w01-l2",
        "name": "Lekce: Úvod do C++",
        "relevance": 70,
        "quality": 5,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w01-l2-s1",
            "name": "Jednodušší struktury",
            "relevance": 100,
            "quality": 3,
            "difficulty": 1,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s2",
            "name": "Jmenné prostory",
            "relevance": 100,
            "quality": 5,
            "difficulty": 4,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s3",
            "name": "Operátory new a delete",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s5",
            "name": "Reference",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s7",
            "name": "Reference na konstantu",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s9",
            "name": "Přetěžování funkcí",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s10",
            "name": "Výchozí argumenty",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s11",
            "name": "Řazení v C++",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w01-l2-s12",
            "name": "Vstup a výstup v C++",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w01-l3",
        "name": "Lekce: Cvičení",
        "relevance": 90,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w01-l3-s1",
            "name": "Unikátní kvádry",
            "relevance": 90,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week02",
    "category": "Trainer",
    "name": "Týden 02: Úvod do OOP",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w02-l1",
        "name": "Lekce: Třídy, úvod do OOP",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w02-l1-s1",
            "name": "Metody",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l1-s5",
            "name": "Statické členy",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l1-s8",
            "name": "Konstruktory",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l1-s12",
            "name": "Zapouzdření",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l1-s15",
            "name": "Rozhraní",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l1-s16",
            "name": "Gettery a settery",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l1-s17",
            "name": "Řetězení volání metod",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w02-l2",
        "name": "Lekce: Úvod do STL",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w02-l2-s1",
            "name": "Dynamické pole std::vector",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l2-s2",
            "name": "Chytré řetězce std::string",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l2-s3",
            "name": "Základy iterátorů",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l2-s4",
            "name": "Základní porovnávací funkce",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w02-l3",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w02-l3-s1",
            "name": "Kvíz - třídy",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w02-l3-s2",
            "name": "Databáze studentů",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week03",
    "category": "Trainer",
    "name": "Týden 03: Základní kontejnery",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w03-l1",
        "name": "Lekce: Iterátory (základní použití)",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w03-l1-s1",
            "name": "Výpis vectoru pozpátku",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w03-l1-s2",
            "name": "Vyhledávání ve vectoru",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w03-l1-s3",
            "name": "Mazání z vectoru",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w03-l2",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w03-l2-s1",
            "name": "Galerie",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week04",
    "category": "Trainer",
    "name": "Týden 04: Operátory",
    "relevance": 71,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w04-l1",
        "name": "Lekce: Přetěžování operátorů",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w04-l1-s1",
            "name": "Metoda versus funkce",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s2",
            "name": "Porovnávání",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s3",
            "name": "Uspořádání",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s4",
            "name": "Podpora logických výrazů",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s5",
            "name": "Aritmetické operace",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s6",
            "name": "Vstup a výstup",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s7",
            "name": "Přístup k datům",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l1-s8",
            "name": "Další operátory",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w04-l2",
        "name": "Lekce: Cvičení",
        "relevance": 75,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w04-l2-s1",
            "name": "Komplexní čísla",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l2-s4",
            "name": "Unikátní kvádry VII",
            "relevance": 90,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w04-l3",
        "name": "Lekce: Samostatná práce",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w04-l3-s1",
            "name": "Iterátor Fibonacciho posloupnosti",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w04-l3-s2",
            "name": "Bitové pole",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week05",
    "category": "Trainer",
    "name": "Týden 05: Kopie a přesouvání",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w05-l1",
        "name": "Lekce: Kopírování objektů",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w05-l1-s1",
            "name": "Chytré členské proměné",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s2",
            "name": "Pravidlo tří",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s3",
            "name": "Zakázaná kopie",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s4",
            "name": "Copy and swap",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s5",
            "name": "Hluboká kopie",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s6",
            "name": "Počítání referencí",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s7",
            "name": "Copy on write",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l1-s8",
            "name": "Proxy",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w05-l2",
        "name": "Lekce: Přesouvání objektů",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w05-l2-s1",
            "name": "Reference na pravou stranu",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l2-s2",
            "name": "Přesouvací sémantika",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l2-s3",
            "name": "Pravidlo pěti",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l2-s4",
            "name": "Move and swap",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l2-s5",
            "name": "Specifikátor noexcept",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l2-s6",
            "name": "Sjednocující přiřazení",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w05-l2-s7",
            "name": "Příklady z STL",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w05-l3",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w05-l3-s1",
            "name": "C++ řetězce",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week06",
    "category": "Trainer",
    "name": "Týden 06: Pokročilejší STL",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w06-l1",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w06-l1-s1",
            "name": "Statistika slov",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week07",
    "category": "Trainer",
    "name": "Týden 07: Procházení grafů",
    "relevance": 100,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w07-l1",
        "name": "Lekce: Cvičení",
        "relevance": 100,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w07-l1-s1",
            "name": "Orientovaný graf",
            "relevance": 100,
            "quality": 5,
            "difficulty": 4,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w07-l2",
        "name": "Lekce: Samostatná práce",
        "relevance": 100,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w07-l2-s1",
            "name": "Bludiště",
            "relevance": 100,
            "quality": 5,
            "difficulty": 4,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week08",
    "category": "Trainer",
    "name": "Týden 08: Polymorfismus",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w08-l1",
        "name": "Lekce: Základní myšlenka polymorfismu",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w08-l1-s1",
            "name": "Motivace",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w08-l1-s3",
            "name": "Polymorfismus",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w08-l1-s4",
            "name": "Motivace - Řešení",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w08-l2",
        "name": "Lekce: Polymorfismus v C++",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w08-l2-s1",
            "name": "Dědičnost",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w08-l2-s2",
            "name": "Virtuální metody a dynamická vazba",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w08-l2-s5",
            "name": "Abstraktní třída",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w08-l2-s6",
            "name": "Chytré pointery",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w08-l2-s7",
            "name": "A je to k něčemu dobrý?",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w08-l3",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w08-l3-s1",
            "name": "Aritmetický výraz",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      },
      {
        "id": "tr-w08-l4",
        "name": "Lekce: Samostatná práce",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w08-l4-s1",
            "name": "Grep",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week09",
    "category": "Trainer",
    "name": "Týden 09: Polymorfismus II",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w09-l1",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w09-l1-s1",
            "name": "Sklad výbušnin",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week10",
    "category": "Trainer",
    "name": "Týden 10: Šablony",
    "relevance": 82,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w10-l1",
        "name": "Lekce: Cvičení",
        "relevance": 82,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w10-l1-s1",
            "name": "Spojový seznam",
            "relevance": 85,
            "quality": 5,
            "difficulty": 4,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w10-l1-s5",
            "name": "Součet argumentů",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week11",
    "category": "Trainer",
    "name": "Týden 11: Šablony II",
    "relevance": 70,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w11-l1",
        "name": "Lekce: Cvičení",
        "relevance": 70,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w11-l1-s1",
            "name": "Šablona pole",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w11-l1-s4",
            "name": "Funkce jako parametr",
            "relevance": 70,
            "quality": 5,
            "difficulty": 3,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "tr-week12",
    "category": "Trainer",
    "name": "Týden 12: Procvičování",
    "relevance": 100,
    "difficulty": 3,
    "quality": 5,
    "trainerWeight": 4,
    "tags": [
      "trainer"
    ],
    "aiReasoning": "", //Týdenní úlohy v Traineru.",
    "children": [
      {
        "id": "tr-w12-l1",
        "name": "Lekce: Procvičování ke zkoušce",
        "relevance": 100,
        "quality": 5,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": [
          {
            "id": "tr-w12-l1-s1",
            "name": "Šablona množiny",
            "relevance": 100,
            "quality": 5,
            "difficulty": 5,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          },
          {
            "id": "tr-w12-l1-s2",
            "name": "Balíčkovací systém",
            "relevance": 100,
            "quality": 5,
            "difficulty": 5,
            "aiReasoning": "", //Cvičení z Traineru",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "lec-week01",
    "category": "Lectures",
    "name": "Téma 1: Od C k C++ (neobjektová rozšíření)",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Základní syntax, reference",
    "children": [
      {
        "id": "lec-t01-1",
        "name": "První program v C++",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-2",
        "name": "Jmenné prostory",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-3",
        "name": "Typ bool",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-4",
        "name": "Struktury",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-5",
        "name": "Vstup/výstup v C++",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-6",
        "name": "Reference",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-7",
        "name": "Implicitní parametry funkcí",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-8",
        "name": "Inline funkce",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-9",
        "name": "Přetěžování funkcí",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-10",
        "name": "Dynamické proměnné – operátory new a delete",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t01-11",
        "name": "Některá vylepšení C++ 14 a 17",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week02",
    "category": "Lectures",
    "name": "Téma 2: Programovací styly a třídy",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Teoretický úvod do OOP",
    "children": [
      {
        "id": "lec-t02-1",
        "name": "Programovací styly: naivní, procedurální, objektově orientovaný",
        "relevance": 10,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-2",
        "name": "Třídy a objekty",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-3",
        "name": "Rozdíl mezi class a struct",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-4",
        "name": "Klíčové slovo this",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-5",
        "name": "Konstantní (const) objekty a metody",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-6",
        "name": "Konstruktory, implicitní konstruktor",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-7",
        "name": "Lokální deklarace",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t02-8",
        "name": "Statické metody a statické proměnné",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week03",
    "category": "Lectures",
    "name": "Téma 3: Přetížené operátory",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Overloading porovnávání",
    "children": [
      {
        "id": "lec-t03-1",
        "name": "Motivace pro přetěžování operátorů – racionální čísla",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t03-2",
        "name": "friend funkce",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t03-3",
        "name": "Zapouzdření",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t03-4",
        "name": "Uživatelské konverze",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t03-5",
        "name": "Přehled přetížitelných operátorů",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t03-6",
        "name": "Kompilační jednotky a make",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week04",
    "category": "Lectures",
    "name": "Téma 4: Kopírování objektů",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Mělká vs Hluboká kopie",
    "children": [
      {
        "id": "lec-t04-1",
        "name": "Kopírovací konstruktor a operátor přiřazení",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t04-2",
        "name": "Hluboká a mělká kopie",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t04-3",
        "name": "Rvalue reference, unique_ptr",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t04-4",
        "name": "Přesouvací konstruktor a operátor přiřazení",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t04-5",
        "name": "Mělká kopie a shared_ptr",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t04-6",
        "name": "Copy-on-write",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t04-7",
        "name": "Některé algoritmy pro práci s polem",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week05",
    "category": "Lectures",
    "name": "Téma 5: Vybrané komponenty knihovny STL",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Základní kontejnery pro AG1",
    "children": [
      {
        "id": "lec-t05-1",
        "name": "Ukázky použití STL: vector, set, map",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t05-2",
        "name": "Koncepty: generické třídy, iterátory, funktory",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t05-3",
        "name": "Lambda funkce",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t05-4",
        "name": "Základní kontejnery: array, vector, deque, list, set, map",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t05-5",
        "name": "Knihovna algoritmů",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week06",
    "category": "Lectures",
    "name": "Téma 6: Základní grafové algoritmy",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //BFS a DFS teorii",
    "children": [
      {
        "id": "lec-t06-1",
        "name": "Algoritmy BFS a DFS",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t06-2",
        "name": "Výjimky",
        "relevance": 10,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week07",
    "category": "Lectures",
    "name": "Téma 7: Dědění a polymorfismus v C++",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Virtualita",
    "children": [
      {
        "id": "lec-t07-1",
        "name": "Polymorfismus",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t07-2",
        "name": "Dědičnost",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t07-3",
        "name": "Statická a dynamická vazba",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week08",
    "category": "Lectures",
    "name": "Téma 8: Abstraktní třídy v C++",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Čistě virtuální metody",
    "children": [
      {
        "id": "lec-t08-1",
        "name": "Abstraktní třídy",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t08-2",
        "name": "Heterogenní (polymorfní) datové struktury",
        "relevance": 100,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t08-3",
        "name": "RTTI",
        "relevance": 10,
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week09",
    "category": "Lectures",
    "name": "Téma 9: Šablony v C++",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //AVL strom šablony",
    "children": [
      {
        "id": "lec-t09-1",
        "name": "Šablony",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t09-2",
        "name": "Šablony funkcí",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t09-3",
        "name": "Šablony tříd",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t09-4",
        "name": "constexpr",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week10",
    "category": "Lectures",
    "name": "Téma 10: Abstraktní datové typy v C++",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Halda a fronta",
    "children": [
      {
        "id": "lec-t10-1",
        "name": "ADT implementované jako generické třídy",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t10-2",
        "name": "Zásobník (stack)",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t10-3",
        "name": "Fronta (queue)",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t10-4",
        "name": "Pole (array)",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t10-5",
        "name": "Binární halda (binary heap)",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week11",
    "category": "Lectures",
    "name": "Téma 11: Abstraktní datové typy v C++ II",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //Množiny a stromy",
    "children": [
      {
        "id": "lec-t11-1",
        "name": "Množina (set)",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t11-2",
        "name": "Tabulka (map)",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t11-3",
        "name": "Binární vyhledávací strom",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t11-4",
        "name": "Hashovací tabulka",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "lec-week12",
    "category": "Lectures",
    "name": "Téma 12: Vyhledávání v textu",
    "tags": [
      "lectures"
    ],
    "aiReasoning": "", //String search",
    "children": [
      {
        "id": "lec-t12-1",
        "name": "Vyhledávání v textu",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t12-2",
        "name": "Rabin–Karp",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      },
      {
        "id": "lec-t12-3",
        "name": "KMP",
        "aiReasoning": "", //Téma z přednášky",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week01",
    "category": "Seminars",
    "name": "Proseminář 01: Vstup a výstup, GIT úvod",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Git a základní I/O",
    "children": [
      {
        "id": "sem-p01-1",
        "name": "Git základy",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p01-2",
        "name": "Standardní streams",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week02",
    "category": "Seminars",
    "name": "Proseminář 02: Objekty, třídy, zapouzdření",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //OOP cvičení",
    "children": [
      {
        "id": "sem-p02-1",
        "name": "Class structure",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p02-2",
        "name": "Zapouzdření",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week03",
    "category": "Seminars",
    "name": "Proseminář 03: Iterátory, kontejnery vector/list",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Práce s iterátory",
    "children": [
      {
        "id": "sem-p03-1",
        "name": "Vector vs List",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p03-2",
        "name": "Iterator loops",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week04",
    "category": "Seminars",
    "name": "Proseminář 04: Přetěžování operátorů",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Overloading prakticky",
    "children": [
      {
        "id": "sem-p04-1",
        "name": "Porovnávací operátory",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p04-2",
        "name": "Zlomek třída",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week05",
    "category": "Seminars",
    "name": "Proseminář 05: Správa paměti, kopírující konstruktor",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Správa paměti v OOP",
    "children": [
      {
        "id": "sem-p05-1",
        "name": "Hluboká kopie",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p05-2",
        "name": "Paměťový layout",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week06",
    "category": "Seminars",
    "name": "Proseminář 06: Move sémantika, přesouvání",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Základ pro AVL stromy",
    "children": [
      {
        "id": "sem-p06-1",
        "name": "Move constructor",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p06-2",
        "name": "std::move",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week07",
    "category": "Seminars",
    "name": "Proseminář 07: Grafy a BFS/DFS průchod",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //První grafové cvičení",
    "children": [
      {
        "id": "sem-p07-1",
        "name": "BFS průchod",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p07-2",
        "name": "DFS průchod",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p07-3",
        "name": "Adjacency list",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week08",
    "category": "Seminars",
    "name": "Proseminář 08: Dědění, virtuální metody",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Dědičnost prakticky",
    "children": [
      {
        "id": "sem-p08-1",
        "name": "Dědičnost",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p08-2",
        "name": "Virtual methods",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week09",
    "category": "Seminars",
    "name": "Proseminář 09: Polymorfní kontejnery",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Pointery v kontejnerech",
    "children": [
      {
        "id": "sem-p09-1",
        "name": "vector of unique_ptr",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p09-2",
        "name": "vtable lookup",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week10",
    "category": "Seminars",
    "name": "Proseminář 10: Šablony funkcí a tříd",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Šablony prakticky",
    "children": [
      {
        "id": "sem-p10-1",
        "name": "Generic class",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p10-2",
        "name": "Template constraints",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week11",
    "category": "Seminars",
    "name": "Proseminář 11: Výjimky (Exceptions)",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Výjimky",
    "children": [
      {
        "id": "sem-p11-1",
        "name": "Try/Catch",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p11-2",
        "name": "Throwing",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "sem-week12",
    "category": "Seminars",
    "name": "Proseminář 12: Závěrečné opakování",
    "tags": [
      "seminars"
    ],
    "aiReasoning": "", //Opakování před zkouškou",
    "children": [
      {
        "id": "sem-p12-1",
        "name": "Zkouškové typy úloh",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      },
      {
        "id": "sem-p12-2",
        "name": "Common C++ bugs",
        "aiReasoning": "", //Téma prosemináře",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch01",
    "category": "E-learning",
    "name": "Kapitola 01: Třídy a objekty",
    "relevance": 40,
    "difficulty": 2,
    "quality": 2,
    "aiReasoning": "", //Prázdná úvodní kapitola",
    "tags": [
      "elearning"
    ],
    "children": []
  },
  {
    "id": "el-ch02",
    "category": "E-learning",
    "name": "Kapitola 02: Základní pojmy objektově orientovaného programování",
    "relevance": 40,
    "difficulty": 2,
    "quality": 2,
    "aiReasoning": "", //Obecná teorie o OOP",
    "tags": [
      "elearning"
    ],
    "children": []
  },
  {
    "id": "el-ch03",
    "category": "E-learning",
    "name": "Kapitola 03: Rozšíření C → C++",
    "relevance": 70,
    "difficulty": 2,
    "quality": 3,
    "aiReasoning": "", //Základy C++ syntaxe",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch03-1",
        "name": "1. První program v jazyce C++",
        "relevance": 20,
        "quality": 2,
        "difficulty": 1,
        "aiReasoning": "", //Triviální výpis",
        "children": []
      },
      {
        "id": "el-ch03-2",
        "name": "2. Jmenné prostory",
        "relevance": 50,
        "quality": 3,
        "difficulty": 1,
        "aiReasoning": "", //Užitečné pro namespacy",
        "children": []
      },
      {
        "id": "el-ch03-3",
        "name": "3. Typ bool",
        "relevance": 30,
        "quality": 3,
        "difficulty": 1,
        "aiReasoning": "", //Triviální",
        "children": []
      },
      {
        "id": "el-ch03-4",
        "name": "4. Standardní vstup a výstup",
        "relevance": 60,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //Streamy",
        "children": []
      },
      {
        "id": "el-ch03-5",
        "name": "5. Výstup, I/O manipulátory",
        "relevance": 40,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch03-6",
        "name": "6. Vstup, I/O manipulátory",
        "relevance": 40,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch03-7",
        "name": "7. Typ reference",
        "relevance": 90,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //Důležité pro předávání uzelů",
        "children": []
      },
      {
        "id": "el-ch03-8",
        "name": "8. Konstanty, klíčové slovo const",
        "relevance": 80,
        "quality": 4,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch03-9",
        "name": "9. Konstantní reference",
        "relevance": 90,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //Optimalizace předávání",
        "children": []
      },
      {
        "id": "el-ch03-10",
        "name": "10. Konstantní ukazatel a ukazatel na konstantu",
        "relevance": 90,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //Častý zdroj chyb",
        "children": []
      },
      {
        "id": "el-ch03-11",
        "name": "11. Deklarace jako příkaz",
        "relevance": 30,
        "quality": 2,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch03-12",
        "name": "12. Struktury",
        "relevance": 100,
        "quality": 4,
        "difficulty": 1,
        "aiReasoning": "", //Základ pro uzly stromů",
        "children": []
      },
      {
        "id": "el-ch03-13",
        "name": "13. Dynamické proměnné",
        "relevance": 100,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //new a delete v C++",
        "children": []
      },
      {
        "id": "el-ch03-14",
        "name": "14. Inline funkce",
        "relevance": 20,
        "quality": 2,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch03-15",
        "name": "15. Implicitní parametry funkcí",
        "relevance": 30,
        "quality": 2,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch03-16",
        "name": "16. Přetěžování funkcí",
        "relevance": 40,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch04",
    "category": "E-learning",
    "name": "Kapitola 04: Programátorský styl",
    "relevance": 20,
    "difficulty": 2,
    "quality": 2,
    "aiReasoning": "", //Designové pasáže",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch04-1",
        "name": "1. Naivní styl",
        "relevance": 10,
        "quality": 1,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch04-2",
        "name": "2. Procedurální styl",
        "relevance": 10,
        "quality": 2,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch04-3",
        "name": "3. Objektově",
        "relevance": 20,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch04-4",
        "name": "4. Zásobník jako třída",
        "relevance": 60,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //Ukázka stacku",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch05",
    "category": "E-learning",
    "name": "Kapitola 05: Třídy a objekty",
    "relevance": 70,
    "difficulty": 2,
    "quality": 3,
    "aiReasoning": "", //Základy objektů v C++",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch05-1",
        "name": "1. Deklarace třídy",
        "relevance": 70,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-2",
        "name": "2. Definice metod, konstruktorů a destruktoru",
        "relevance": 80,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //Destruktory uvolňují stromy",
        "children": []
      },
      {
        "id": "el-ch05-3",
        "name": "3. Zviditelnění zastíněných členů v členské funkci",
        "relevance": 30,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-4",
        "name": "4. Inline členské funkce",
        "relevance": 20,
        "quality": 2,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-5",
        "name": "5. Class a struct",
        "relevance": 90,
        "quality": 4,
        "difficulty": 1,
        "aiReasoning": "", //Rozdíl v defaultním přístupu",
        "children": []
      },
      {
        "id": "el-ch05-6",
        "name": "6. Objekty",
        "relevance": 60,
        "quality": 3,
        "difficulty": 1,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-7",
        "name": "7. Konstantní metody",
        "relevance": 80,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //Read-only přístup k uzelům",
        "children": []
      },
      {
        "id": "el-ch05-8",
        "name": "8. Volání konstruktoru a destruktoru",
        "relevance": 70,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-9",
        "name": "9. Pole objektů",
        "relevance": 80,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-10",
        "name": "10. Implicitní konstruktor",
        "relevance": 70,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-11",
        "name": "11. Inicializační část konstruktoru",
        "relevance": 90,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //Členy-reference se musí inicializovat zde",
        "children": []
      },
      {
        "id": "el-ch05-12",
        "name": "12. Lokální deklarace ve třídě",
        "relevance": 20,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch05-13",
        "name": "13. Statické členy třídy",
        "relevance": 40,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch06",
    "category": "E-learning",
    "name": "Kapitola 06: Přetěžování operátorů, třída Zlomek, uživatelská konverze",
    "relevance": 80,
    "difficulty": 3,
    "quality": 3,
    "aiReasoning": "", //Nutné pro sortování",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch06-1",
        "name": "1. Aritmetika zlomků pomocí obyčejných funkcí",
        "relevance": 30,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-2",
        "name": "2. Aritmetika pomocí metod",
        "relevance": 30,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-3",
        "name": "3. Přetížení operátorů obyčejnými funkcemi",
        "relevance": 80,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-4",
        "name": "4. Přetížení operátorů metodami",
        "relevance": 90,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //Doporučený způsob",
        "children": []
      },
      {
        "id": "el-ch06-5",
        "name": "5. Přetížení operátorů spřátelenými funkcemi",
        "relevance": 80,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-6",
        "name": "6. Uživatelská konverze",
        "relevance": 40,
        "quality": 2,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-7",
        "name": "7. Přehled přetěžování binárních operátorů",
        "relevance": 80,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-8",
        "name": "8. Přehled přetěžování unárních operátorů",
        "relevance": 60,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-9",
        "name": "9. Přetížení operátoru indexace",
        "relevance": 90,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //Hojně využívané",
        "children": []
      },
      {
        "id": "el-ch06-10",
        "name": "10. Přetížení operátoru volání funkce",
        "relevance": 80,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch06-11",
        "name": "11. Přetížení unárního operátoru →",
        "relevance": 95,
        "quality": 4,
        "difficulty": 4,
        "aiReasoning": "", //Základ pro smart pointery",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch07",
    "category": "E-learning",
    "name": "Kapitola 07: Přiřazení, mělká a hluboká kopie",
    "relevance": 90,
    "difficulty": 4,
    "quality": 3,
    "aiReasoning": "", //Správa paměti",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch07-1",
        "name": "1. Hluboká kopie",
        "relevance": 100,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //Důležité pro stromy",
        "children": []
      },
      {
        "id": "el-ch07-2",
        "name": "2. Kopírující konstruktor",
        "relevance": 90,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //Hluboká kopie u objektů",
        "children": []
      },
      {
        "id": "el-ch07-3",
        "name": "3. Mělká kopie - počítané reference",
        "relevance": 70,
        "quality": 3,
        "difficulty": 4,
        "aiReasoning": "", //Základ sdílené paměti",
        "children": []
      },
      {
        "id": "el-ch07-4",
        "name": "4. Reference na pravou stranu",
        "relevance": 80,
        "quality": 3,
        "difficulty": 4,
        "aiReasoning": "", //Move sémantika",
        "children": []
      },
      {
        "id": "el-ch07-5",
        "name": "5. Přesouvací konstruktor",
        "relevance": 100,
        "quality": 4,
        "difficulty": 4,
        "aiReasoning": "", //Nutné pro optimalizace",
        "children": []
      },
      {
        "id": "el-ch07-6",
        "name": "6. Přesouvací operátor přiřazení",
        "relevance": 100,
        "quality": 4,
        "difficulty": 4,
        "aiReasoning": "", //Nutné pro optimalizace",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch08",
    "category": "E-learning",
    "name": "Kapitola 08: Znakové řetězce libovolné délky - třída std::string",
    "relevance": 50,
    "difficulty": 2,
    "quality": 2,
    "aiReasoning": "", //Využití vestavěného řetězce",
    "tags": [
      "elearning"
    ],
    "children": []
  },
  {
    "id": "el-ch09",
    "category": "E-learning",
    "name": "Kapitola 09: Ošetření chyb, výjimky",
    "relevance": 10,
    "difficulty": 3,
    "quality": 2,
    "aiReasoning": "", //Výjimky v AG1 netestovány",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch09-1",
        "name": "1. Ošetření chyb v jazyce C",
        "relevance": 10,
        "quality": 2,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch09-2",
        "name": "2. Výjimky - exceptions",
        "relevance": 0,
        "quality": 1,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch10",
    "category": "E-learning",
    "name": "Kapitola 10: Šablony - template",
    "relevance": 90,
    "difficulty": 4,
    "quality": 2,
    "aiReasoning": "", //AVL stromy v AG1",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch10-1",
        "name": "1. Šablony funkcí",
        "relevance": 80,
        "quality": 2,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch10-2",
        "name": "2. Šablony tříd",
        "relevance": 100,
        "quality": 2,
        "difficulty": 4,
        "aiReasoning": "", //Důležité, text nicméně slabý",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch11",
    "category": "E-learning",
    "name": "Kapitola 11: Abstraktní datové typy, standardní knihovna",
    "relevance": 100,
    "difficulty": 3,
    "quality": 3,
    "aiReasoning": "", //Základní STL kontejnery",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch11-1",
        "name": "1. Standardní knihovna, kontejnery",
        "relevance": 80,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-2",
        "name": "2. Iterátory",
        "relevance": 90,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-3",
        "name": "3. Vektor (vector)",
        "relevance": 100,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //Reprezentace adjacency listu",
        "children": []
      },
      {
        "id": "el-ch11-4",
        "name": "4. Pole (Array)",
        "relevance": 70,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-5",
        "name": "5. Oboustranná fronta (std::deque)",
        "relevance": 80,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-6",
        "name": "6. Seznam (list)",
        "relevance": 80,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-7",
        "name": "7. Jednosměrně zřetězený seznam (std::forward_list)",
        "relevance": 70,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-8",
        "name": "8. Zásobník (std::stack)",
        "relevance": 90,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //DFS",
        "children": []
      },
      {
        "id": "el-ch11-9",
        "name": "9. Fronta (queue)",
        "relevance": 100,
        "quality": 4,
        "difficulty": 2,
        "aiReasoning": "", //BFS",
        "children": []
      },
      {
        "id": "el-ch11-10",
        "name": "10. Prioritní fronta (std::priority_queue)",
        "relevance": 100,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //Dijkstra",
        "children": []
      },
      {
        "id": "el-ch11-11",
        "name": "11. Množina (set)",
        "relevance": 90,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //O(log N) operace",
        "children": []
      },
      {
        "id": "el-ch11-12",
        "name": "12. Bitová množina (std::bitset)",
        "relevance": 60,
        "quality": 3,
        "difficulty": 2,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-13",
        "name": "13. Multimnožina (std::multiset)",
        "relevance": 80,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-14",
        "name": "14. Tabulka (map)",
        "relevance": 100,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-15",
        "name": "15. Tabulka s opakováním klíčů (multimap)",
        "relevance": 70,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-16",
        "name": "16. Neuspořádaná množina (std::unordered_set)",
        "relevance": 100,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //O(1) průměr",
        "children": []
      },
      {
        "id": "el-ch11-17",
        "name": "17. Neuspořádaná multimnožina (std::unordered_multiset)",
        "relevance": 70,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-18",
        "name": "18. Neuspořádaná tabulka (unordered map)",
        "relevance": 100,
        "quality": 4,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch11-19",
        "name": "19. Neuspořádaná multitabulka (std::unordered_multimap)",
        "relevance": 70,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch12",
    "category": "E-learning",
    "name": "Kapitola 12: Stromy",
    "relevance": 100,
    "difficulty": 4,
    "quality": 3,
    "aiReasoning": "", //Grafy a stromy v AG1",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch12-1",
        "name": "1. Orientované grafy",
        "relevance": 100,
        "quality": 3,
        "difficulty": 3,
        "aiReasoning": "", //Grafy",
        "children": []
      },
      {
        "id": "el-ch12-2",
        "name": "2. Binární vyhledávací strom",
        "relevance": 100,
        "quality": 3,
        "difficulty": 4,
        "aiReasoning": "", //Základ pro AVL",
        "children": []
      }
    ]
  },
  {
    "id": "el-ch13",
    "category": "E-learning",
    "name": "Kapitola 13: Dědičnost (inheritance), dynamicky vázané metody, polymorfizmus",
    "relevance": 20,
    "difficulty": 4,
    "quality": 2,
    "aiReasoning": "", //Teoretická část OOP",
    "tags": [
      "elearning"
    ],
    "children": [
      {
        "id": "el-ch13-1",
        "name": "1. Dědičnost",
        "relevance": 20,
        "quality": 2,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch13-2",
        "name": "2. Dynamická (pozdní) vazba",
        "relevance": 10,
        "quality": 2,
        "difficulty": 4,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch13-3",
        "name": "3. Abstraktní třídy",
        "relevance": 10,
        "quality": 2,
        "difficulty": 3,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch13-4",
        "name": "4. Polymorfní datové struktury",
        "relevance": 20,
        "quality": 2,
        "difficulty": 4,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch13-5",
        "name": "5. Identifikace typu za běhu programu - RTTI",
        "relevance": 10,
        "quality": 1,
        "difficulty": 4,
        "aiReasoning": "", //",
        "children": []
      },
      {
        "id": "el-ch13-6",
        "name": "6. Přehled přetypování",
        "relevance": 20,
        "quality": 2,
        "difficulty": 4,
        "aiReasoning": "", //",
        "children": []
      }
    ]
  }
];
