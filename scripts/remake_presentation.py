#!/usr/bin/env python3
"""Remake 'strašení prváků - bioinformatika.pptx' with current wiki information.

Preserves all original slides, memes, and image positioning while updating
texts, bullet points, styling, and speaker notes with up-to-date facts from
the bioinformatics program wiki (1-semestr/zacatek-semestru-prvak.md).
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any, List, Optional, Tuple

try:
    import pptx
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.shapes import MSO_SHAPE_TYPE
    from pptx.enum.text import PP_ALIGN
except ImportError:
    print("Error: python-pptx is required. Run: pip install python-pptx", file=sys.stderr)
    sys.exit(1)


class PresentationRemaker:
    """Updates presentation slides with fresh verified wiki information.

    Attributes:
        input_path: Path to original .pptx file.
        output_path: Path to write the remade .pptx file.
        prs: Loaded python-pptx Presentation instance.
    """

    COLOR_DARK: RGBColor = RGBColor(0x11, 0x18, 0x27)       # Near black / dark slate
    COLOR_ORANGE: RGBColor = RGBColor(0xE7, 0x3F, 0x11)     # VŠCHT orange accent
    COLOR_MUTED: RGBColor = RGBColor(0x4B, 0x55, 0x63)      # Slate gray
    COLOR_BLUE: RGBColor = RGBColor(0x1D, 0x4E, 0xD8)       # Primary link blue

    def __init__(self, input_path: Path, output_path: Path) -> None:
        """Initialize the remaker with input and output presentation paths.

        Args:
            input_path: Path to original presentation.
            output_path: Destination path for remade presentation.
        """
        self.input_path: Path = input_path
        self.output_path: Path = output_path
        self.prs: pptx.Presentation = pptx.Presentation(str(input_path))

    def set_shape_text(
        self,
        shape: Any,
        paragraphs: List[Tuple[str, int, bool, Optional[Pt], Optional[RGBColor]]],
    ) -> None:
        """Replace all text in a shape with formatted paragraphs.

        Args:
            shape: Target shape containing a text frame.
            paragraphs: List of tuples (text, level, is_bold, font_size, color).
        """
        if not shape.has_text_frame:
            return

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.1)
        tf.margin_right = Inches(0.1)
        tf.margin_top = Inches(0.1)
        tf.margin_bottom = Inches(0.1)

        # Clear existing text
        tf.text = ""

        for idx, (txt, level, is_bold, f_size, col) in enumerate(paragraphs):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            p.text = txt
            p.level = level
            p.font.name = "Calibri"
            if is_bold:
                p.font.bold = True
            if f_size:
                p.font.size = f_size
            if col:
                p.font.color.rgb = col
            p.space_after = Pt(4)

    def set_speaker_notes(self, slide: Any, notes_text: str) -> None:
        """Update or set speaker notes on a slide.

        Args:
            slide: python-pptx Slide object.
            notes_text: Complete text of speaker notes.
        """
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text.strip()

    def remake_slide_1(self, slide: Any) -> None:
        """Slide 1: Titulní slajd."""
        title_shape = None
        subtitle_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;91;p1":
                title_shape = s
            elif s.name == "Google Shape;92;p1":
                subtitle_shape = s

        if title_shape:
            self.set_shape_text(title_shape, [
                ("Bioinformatika: Průvodce prváka", 0, True, Pt(40), self.COLOR_ORANGE)
            ])
        if subtitle_shape:
            self.set_shape_text(subtitle_shape, [
                ("Co zařídit v prvních dvou týdnech", 0, True, Pt(20), self.COLOR_DARK),
                ("Jak přežít The Great Filter (PA1, Matika, Chemie)", 0, True, Pt(20), self.COLOR_DARK),
                ("Zlatá pravidla, tipy ke zkouškám & survival know-how od starších", 0, True, Pt(20), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Ahoj! Vítáme vás na bioinformatice. Když jsme byli v prváku my, "
            "sedli si s námi starší spolužáci a ten start nám neskutečně usnadnili. "
            "Dneska vám předáme to nejdůležitější: co nepodcenit, co zařídit hned a jak bez nervů projít prvním ročníkem."
        ))

    def remake_slide_2(self, slide: Any) -> None:
        """Slide 2: Co vlastně studuješ?"""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;100;p2":
                t_shape = s
            elif s.name == "Google Shape;101;p2":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("„Hele, co že to vlastně studuješ?“", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Oficiální definice pro rodinu a babičku:", 0, True, Pt(20), self.COLOR_ORANGE),
                ("„Chemie a biologie v počítačích“ (= chemoinformatika & bioinformatika)", 0, False, Pt(18), self.COLOR_DARK),
                ("", 0, False, Pt(10), None),
                ("Skutečná realita studia:", 0, True, Pt(20), self.COLOR_ORANGE),
                ("Unikátní mezioborový program spojující VŠCHT Praha (FCHT) a FIT ČVUT.", 0, False, Pt(18), self.COLOR_DARK),
                ("Prošli jsme přesně tím, co vás teď čeká — ptejte se na cokoliv!", 0, False, Pt(18), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Tento slajd je o dvou věcech: zaprvé, co říct babičce, když se zeptá, co je to ta bioinformatika. "
            "Zadruhé, že jsme si tím vším prošli také, víme, kde to bolí, a rádi vám pomůžeme."
        ))

    def remake_slide_3(self, slide: Any) -> None:
        """Slide 3: Zařizování v prvních 2 týdnech."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;110;p3":
                t_shape = s
            elif s.name == "Google Shape;111;p3":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Zařizování v prvních dvou týdnech", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Karta VŠCHT / ISIC: Vyzvednout v Kartovém centru VŠCHT (fotka vám zůstává po celé studium)", 0, False, Pt(16), self.COLOR_DARK),
                ("Vstup na FIT ČVUT: Vydavatelství průkazů ČVUT (výhradně v 1. týdnu, rezervovat čas online!)", 0, False, Pt(16), self.COLOR_DARK),
                ("Účet ČVUT & KOS: Na Usermap ČVUT zadat iniciální heslo a nastavit trvalé", 0, False, Pt(16), self.COLOR_DARK),
                ("Wi-Fi (eduroam): Certifikát z webu VC VŠCHT; na FITu navíc v Usermapu speciální síťové heslo", 0, False, Pt(16), self.COLOR_DARK),
                ("NTK (Knihovna): Registrace ISICu u pultu v NTK (přístup do noční studovny a tisk z notebooku)", 0, False, Pt(16), self.COLOR_DARK),
                ("Menzy ČVUT: Technická, Studentský dům, Masarykova kolej (dobíjení kartou / portál Agáta)", 0, False, Pt(16), self.COLOR_DARK),
                ("Rozvrh v 1. ročníku: Pevně zarezervován! V KOSu nic nezapisujete ani neměníte", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Lítačka (PID): Potvrzení o studiu stáhnout ze SISu VŠCHT a nahrát do aplikace PID Lítačka", 0, False, Pt(16), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Klíčové tipy: VŠCHT začíná o týden dřív než FIT. Využijte první týden na vyřízení vstupu na FIT "
            "ve Vydavatelství průkazů ČVUT u NTK — v druhém týdnu už tam budou obří fronty studentů ČVUT. "
            "Wi-Fi na FITu vyžaduje speciální síťové heslo z Usermapu, které se liší od hesla do KOSu! "
            "A pozor: v 1. ročníku na FITu rozvrh nezapisujete, máte ho předem rezervovaný."
        ))

    def remake_slide_4(self, slide: Any) -> None:
        """Slide 4: Dvě univerzity & KOS (Two-column layout)."""
        t_shape = None
        col_left = None
        col_right = None
        for s in slide.shapes:
            if s.name == "Google Shape;118;p4":
                t_shape = s
            elif s.name == "Google Shape;119;p4":
                col_left = s
            elif s.name == "Google Shape;120;p4":
                col_right = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Dvě univerzity: VŠCHT Praha vs. FIT ČVUT", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if col_left:
            self.set_shape_text(col_left, [
                ("🏛️ VŠCHT (Domovská univerzita):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Jste studenty výhradně VŠCHT Praha (Fakulta chemické technologie).", 0, False, Pt(14), self.COLOR_DARK),
                ("Jediný oficiální a právně závazný systém je SIS VŠCHT.", 0, True, Pt(14), self.COLOR_DARK),
                ("V SISu najdete zápisy předmětů, index, kredity i zkouškové termíny.", 0, False, Pt(13), self.COLOR_MUTED),
                ("Studijní referentka VŠCHT (FCHT):", 0, True, Pt(14), self.COLOR_DARK),
                ("Petra Kohoutová — potvrzení o studiu, stipendia, žádosti a rozložení ročníku.", 0, False, Pt(13), self.COLOR_MUTED),
            ])
        if col_right:
            self.set_shape_text(col_right, [
                ("💻 FIT ČVUT (Smluvní výuka):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Rozvrh v 1. ročníku máte pevně zarezervován!", 0, True, Pt(14), self.COLOR_DARK),
                ("V KOSu nic nezapisujete ani neměníte — vlastní volba paralelek je až od 2. ročníku.", 0, False, Pt(13), self.COLOR_MUTED),
                ("Ignorujte chybové e-maily z KOSu!", 0, True, Pt(14), RGBColor(0xDC, 0x26, 0x26)),
                ("Hlášení typu „nemáte dost kreditů“ neřešte — KOS nevidí studium na VŠCHT.", 0, False, Pt(13), self.COLOR_MUTED),
                ("Studijní referentka FIT pro bioinformatiky:", 0, True, Pt(14), self.COLOR_DARK),
                ("Zdeňka Kutinová — přístupy na FIT, výjimky a rozvrhové kolize.", 0, False, Pt(13), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "Dvě univerzity vedle sebe: Na VŠCHT jste doma, vaše studium a kredity se řídí výhradně SISem. "
            "Na FIT docházíte na špičkovou informatiku. V 1. ročníku máte cvičení na FITu předem rezervována. "
            "KOS vám bude posílat automatické e-maily, že nemáte zapsaný minimální počet kreditů — ignorujte je, "
            "KOS nevidí vaše předměty na VŠCHT! Pokud budete potřebovat jakoukoliv pomoc, referentky Petra Kohoutová (VŠCHT) "
            "a Zdeňka Kutinová (FIT) vám vyjdou vstříc."
        ))

    def remake_slide_5(self, slide: Any) -> None:
        """Slide 5: The Great Filter."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;128;p5":
                t_shape = s
            elif s.name == "Google Shape;129;p5":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("První semestr: The Great Filter", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Tři klíčové pilíře 1. semestru (celkem 24 kreditů):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("1. BI-PA1: Programování a algoritmizace 1 (8 kreditů, FIT ČVUT)", 0, True, Pt(16), self.COLOR_DARK),
                ("2. Matematika A (8 kreditů, VŠCHT)", 0, True, Pt(16), self.COLOR_DARK),
                ("3. OACH I: Obecná a anorganická chemie 1 (8 kreditů, VŠCHT)", 0, True, Pt(16), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("🚨 BI-PA1 se vyučuje VÝHRADNĚ V ZIMNÍM SEMESTRU!", 0, True, Pt(18), RGBColor(0xDC, 0x26, 0x26)),
                ("V letním semestru se PA1 vůbec neotvírá. Pokud ji neuděláte, čekáte celý rok!", 0, False, Pt(15), self.COLOR_DARK),
                ("Ve 3. semestru byste pak museli dělat PA1 + BI-AX1 + Python + Biochemie + Fyzikála naráz!", 0, True, Pt(15), self.COLOR_ORANGE),
                ("Zlaté pravidlo: Nepodceňte rozjezd — prvních 7 týdnů rozhodne o všem!", 0, True, Pt(16), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Proč 'The Great Filter'? Tři osmi-kreditové předměty tvoří 24 z 30 kreditů semestru. "
            "Kritické je udělat PA1 napoprvé: PA1 běží pouze v zimě! Pokud ji nezvládnete, musíte čekat celý rok a ve 3. semestru "
            "vás smete brutální kombinace: opakovaná PA1 společně s další síťovkou BI-AX1 (Algoritmy a grafy), Pythonem, "
            "Biochemií a Fyzikální chemií."
        ))

    def remake_slide_6(self, slide: Any) -> None:
        """Slide 6: Akademický checklist prvních 7 týdnů."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;136;p6":
                t_shape = s
            elif s.name == "Google Shape;137;p6":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Akademický checklist: Prvních 7 týdnů", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("💻 Programování (BI-PA1):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Zprovoznit lokální Linux / WSL2 nebo začít okamžitě psát v OnlineGDB v prohlížeči", 1, False, Pt(14), self.COLOR_DARK),
                ("Zkompilovat a spustit program v C; naučit se ladit v debuggeru (gdb / CLion / AddressSanitizer)", 1, False, Pt(14), self.COLOR_DARK),
                ("Sbírat časové bonusy v Progtestu: odevzdat včas vytváří kritický bodový polštář na zápočet!", 1, True, Pt(14), self.COLOR_DARK),
                ("📐 Matematika A:", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Elementární funkce, definiční obory, limity, derivace a integrály", 1, False, Pt(14), self.COLOR_DARK),
                ("1. zápočtový test (kolem 6. týdne): Naprosto klíčový! Je mnohem snazší než 2. test v prosinci", 1, True, Pt(14), self.COLOR_DARK),
                ("🧪 Anorganická chemie (OACH I):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Názvosloví, oxidační čísla, vyčíslování reakcí a Lewisovy vzorce", 1, False, Pt(14), self.COLOR_DARK),
                ("Opět: 1. zápočtový test je přímočarý, nasbírejte v něm maximum bodů pro klidný konec roku", 1, True, Pt(14), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Strategie prvních 7 týdnů: První zápočty z Matiky A i Anorgány bývají výrazně jednodušší než druhé prosincové. "
            "V součtu potřebujete >50 % bodů, takže když v 1. testech získáte maximum, v prosinci už nebudete ve stresu. "
            "Mezitím ale v PA1 obtížnost úloh každý týden skokově roste — programování na rozdíl od chemie o víkendu nedoženete!"
        ))

    def remake_slide_7(self, slide: Any) -> None:
        """Slide 7: Školní systémy FIT."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;144;p7":
                t_shape = s
            elif s.name == "Google Shape;146;p7":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Systémy FIT ČVUT", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Courses FIT (courses.fit.cvut.cz)", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Slajdy z přednášek, cvičení, termíny a zadání", 1, False, Pt(15), self.COLOR_MUTED),
                ("Progtest (progtest.fit.cvut.cz)", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Automatický odevzdávací systém pro úlohy v C", 1, False, Pt(15), self.COLOR_MUTED),
                ("Trainer KSI (trainer.ksi.fit.cvut.cz)", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Interaktivní cvičebnice C od základů po zkoušku", 1, False, Pt(15), self.COLOR_MUTED),
                ("FIT-Wiki (fit-wiki.cz)", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Studentský archiv zkouškových písemek a řešení", 1, False, Pt(15), self.COLOR_MUTED),
                ("Timetable FIT (timetable.fit.cvut.cz)", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Rozvrhy paralelek a obsazenost učeben na FITu", 1, False, Pt(15), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "FIT má vlastní ekosystém portálů: Courses je centrála pro materiály, Progtest vyhodnocuje kód. "
            "Trainer KSI je výborná cvičebnice od vyučujících FITu — vyzkoušejte si v něm rekurzi i funkce! "
            "FIT-Wiki je studentská databáze, kde najdete staré zkouškové písemky z minulých let. Zaregistrujte se tam včas."
        ))

    def remake_slide_8(self, slide: Any) -> None:
        """Slide 8: BI-PA1 jako síto."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;153;p8":
                t_shape = s
            elif s.name == "Google Shape;154;p8":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("BI-PA1: Kde se láme semestr", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Proč má PA1 pověst nejtěžšího předmětu 1. ročníku?", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Týdenní deadliny v Progtestu: Úlohy nejsou na jedno odpoledne, vyžadují hodiny ladění.", 1, False, Pt(15), self.COLOR_DARK),
                ("Kód musí být 100% správný, efektivní a bez úniků paměti (Valgrind).", 1, False, Pt(15), self.COLOR_DARK),
                ("Zkouškový test se píše v počítačové učebně FIT na ostro bez internetu a AI!", 1, True, Pt(15), RGBColor(0xDC, 0x26, 0x26)),
                ("", 0, False, Pt(6), None),
                ("Proč se úspěšnost studentů bioinformatiky každý rok zlepšuje?", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Máme Discord BioCord: starší studenti aktivně radí s logikou i laděním chyb.", 1, False, Pt(15), self.COLOR_DARK),
                ("Kvalitní příprava a sdílené know-how na naší studentské wiki.", 1, False, Pt(15), self.COLOR_DARK),
                ("Kdo začne kódovat hned v den zadání a sbírá bonusy, zápočet s přehledem získá!", 1, True, Pt(15), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Na PA1 vyletí nejvíc lidí kvůli odkládání úloh na neděli večer. Úlohy v Progtestu jsou komplexní a zkouška "
            "se píše bez internetu na FITu. Úspěšnost bioinformatiků ale roste — máme skvělou komunitu na BioCordu, "
            "kde vám starší rádi pomohou překonat záseky."
        ))

    def remake_slide_9(self, slide: Any) -> None:
        """Slide 9: Jak na BI-PA1."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;164;p9":
                t_shape = s
            elif s.name == "Google Shape;165;p9":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Jak zvládnout BI-PA1 krok za krokem", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Kódujte hned v den zadání úlohy:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Časové bonusy za včasné odevzdání vám na konci semestru vytvoří kritickou rezervu.", 1, False, Pt(15), self.COLOR_DARK),
                ("Nikdy neopisujte kód (Progtest používá MOSS detektor plagiátů):", 0, True, Pt(17), RGBColor(0xDC, 0x26, 0x26)),
                ("Shoda v odevzdaném kódu znamená disciplinární komisi a okamžitou stopku.", 1, False, Pt(15), self.COLOR_MUTED),
                ("AI (ChatGPT / Claude / Gemini) používejte s rozumem:", 0, True, Pt(17), self.COLOR_DARK),
                ("Skvělé na vysvětlení syntaktických chyb a tvorbu testovacích vstupů.", 1, False, Pt(15), self.COLOR_DARK),
                ("Pokud si necháte úlohu vygenerovat, u zkoušky bez internetu nemáte šanci.", 1, True, Pt(15), self.COLOR_ORANGE),
                ("Ptejte se včas: Na cvičeních, proseminářích a na našem BioCordu!", 0, True, Pt(17), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Zlatá pravidla PA1: Časové bonusy za brzké odevzdání jsou záchranná vesta na konci semestru. "
            "Neopisujte kód — MOSS detekuje i přejmenované proměnné. AI používejte jako doučovatele na vysvětlení chyb, "
            "ale algoritmus musíte vymyslet sami, jinak u zkouškového testu shoříte."
        ))

    def remake_slide_10(self, slide: Any) -> None:
        """Slide 10: Linux a vývojové prostředí."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;172;p10":
                t_shape = s
            elif s.name == "Google Shape;174;p10":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Linux a vývojové prostředí", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Proč musíme mít Linux pro PA1?", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Progtest testuje kód na Linuxu; správa paměti v C se na Windows liší!", 1, False, Pt(15), self.COLOR_DARK),
                ("Přístup k nástrojům: gcc, gdb, clang-format a Valgrind (úniky paměti).", 1, False, Pt(15), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("Doporučené možnosti setupu:", 0, True, Pt(18), self.COLOR_DARK),
                ("WSL 2 (Doporučeno pro Windows 10/11): Plnohodnotný Linux uvnitř Windows bez přeinstalace.", 1, True, Pt(15), self.COLOR_DARK),
                ("JetBrains CLion propojený s WSL (univerzitní licence pro studenty zdarma).", 1, False, Pt(15), self.COLOR_DARK),
                ("Dual-boot: Nativní Ubuntu vedle Windows (pozor: vždy instalovat Windows před Linuxem!).", 1, False, Pt(15), self.COLOR_DARK),
                ("macOS: Terminál má Unixový základ, většina nástrojů funguje přímo.", 1, False, Pt(15), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Proč Linux? V C se kód na Windows a Linuxu chová jinak — program, který na Windows zdánlivě projde, "
            "na Progtestu spadne na paměťové chybě (Segmentation Fault). Nejjednodušší cesta na Windows je WSL 2 s CLionem."
        ))

    def remake_slide_11(self, slide: Any) -> None:
        """Slide 11: Nahrazení 'Davidova poznámka' Zlatým pravidlem."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;179;p11":
                t_shape = s
            elif s.name == "Google Shape;180;p11":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Zlaté pravidlo: Nejdřív programovat, až pak ladit prostředí!", 0, True, Pt(32), self.COLOR_ORANGE)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Největší past začátku semestru:", 0, True, Pt(20), self.COLOR_DARK),
                ("Zaseknout se na celé dny na instalaci Linuxu, barvičkách v editoru a ladění chybějících balíčků — a mezitím propásnout první deadliny v Progtestu!", 0, False, Pt(16), self.COLOR_DARK),
                ("", 0, False, Pt(8), None),
                ("Nemáte ještě rozchozené WSL ani CLion? Nevadí!", 0, True, Pt(20), self.COLOR_ORANGE),
                ("Otevřete OnlineGDB (onlinegdb.com) v prohlížeči a začněte psát kód v C od prvního dne.", 0, True, Pt(16), self.COLOR_DARK),
                ("Při instalaci WSL se ptejte AI (ChatGPT / Claude / Gemini):", 0, True, Pt(20), self.COLOR_DARK),
                ("Zkopírujte chybovou hlášku nebo model notebooku a AI vám poradí s povolením virtualizace v BIOSu.", 0, False, Pt(16), self.COLOR_DARK),
                ("Koncem září navíc studenti FITu pořádají hromadnou instalaci Linuxu s osobní pomocí.", 0, False, Pt(16), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "Tohle je naprosto zásadní postřeh z praxe: Spousta prváku stráví hodiny laděním terminálu a editoru, "
            "cítí se, že 'studují PA1', ale ve skutečnosti ještě nenapsali ani řádek kódu. Pokud vám lokální setup drhne, "
            "programujte v OnlineGDB v prohlížeči. Hlavní je začít psát kód od 1. dne. Lokální WSL dořešíte za pochodu."
        ))

    def remake_slide_13(self, slide: Any) -> None:
        """Slide 13: Odkazy a portály."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;194;p13":
                t_shape = s
            elif s.name == "Google Shape;193;p13":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Klíčové studijní portály pro prváka", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("courses.fit.cvut.cz — Výukové materiály a přednášky FIT", 0, True, Pt(17), self.COLOR_ORANGE),
                ("progtest.fit.cvut.cz — Odevzdávání domácích úloh v C pro BI-PA1", 0, True, Pt(17), self.COLOR_ORANGE),
                ("trainer.ksi.fit.cvut.cz — Interaktivní cvičebnice programování od základů", 0, True, Pt(17), self.COLOR_ORANGE),
                ("fit-wiki.cz — Studentská databáze: archiv minulých zkouškových písemek", 0, True, Pt(17), self.COLOR_ORANGE),
                ("uich.vscht.cz / wiki — Oficiální bioinformatická wiki (zápisky, taháky a návody)", 0, True, Pt(17), self.COLOR_ORANGE),
                ("emil.vscht.cz/maps — Interaktivní plánek budov VŠCHT pro rychlou orientaci", 0, True, Pt(17), self.COLOR_ORANGE),
            ])
        self.set_speaker_notes(slide, (
            "Uložte si tyto portály do záložek. Naše studijní wiki na webu ÚICH obsahuje detailní checklisty, "
            "strukturu kódu pro Progtest a kompletní přípravu na zkoušky."
        ))

    def remake_slide_14(self, slide: Any) -> None:
        """Slide 14: Jak na Matematiku A & OACH I."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;202;p14":
                t_shape = s
            elif s.name == "Google Shape;203;p14":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Matematika A & Anorganika (OACH I)", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Klíč ke klidnému prosinci: 1. zápočtový test (cca 6. týden)", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Na zápočet potřebujete v součtu z obou testů >50 % bodů.", 1, False, Pt(15), self.COLOR_DARK),
                ("První zápočty jsou PODSTATNĚ jednodušší než druhé prosincové testy!", 1, True, Pt(15), RGBColor(0xDC, 0x26, 0x26)),
                ("Nasbírejte v nich maximum bodů — vytvoříte si klíčový polštář a vyhnete se stresu ze souhrnného testu.", 1, False, Pt(15), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("Osvědčený recept na Matematiku A:", 0, True, Pt(18), self.COLOR_DARK),
                ("Počítat příklady ze sbírky (obrovský překryv se zkouškovými otázkami).", 1, False, Pt(15), self.COLOR_DARK),
                ("Přednášky doc. Maxové na e-learningu jsou skvěle vysvětlené.", 1, False, Pt(15), self.COLOR_DARK),
                ("OACH I: Portál anorganiky (ach.vscht.cz) pro Lewisovy vzorce a VSEPR.", 1, False, Pt(15), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Zápočtové testy z Matiky A i Anorgány: Kolem 6. týdne se píší první testy. Bývají o dost lehčí než druhé v prosinci. "
            "Udělejte maximum, abyste v 1. testech získali co nejvíc bodů. Kdo má po 1. testech 80 %, má zápočet v podstatě v kapse."
        ))

    def remake_slide_15(self, slide: Any) -> None:
        """Slide 15: Spolupráce vs. medvědí služba."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;211;p15":
                t_shape = s
            elif s.name == "Google Shape;212;p15":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Spolupráce: Pomoc vs. medvědí služba", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Pomáhejte si vzájemně, ale nenechte nikoho dělat práci za vás!", 0, True, Pt(18), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("❌ Medvědí služba:", 0, True, Pt(18), RGBColor(0xDC, 0x26, 0x26)),
                ("„Pošli mi prosím svoje řešení 3. domácí úlohy, vůbec to nestíhám.“", 1, True, Pt(15), self.COLOR_MUTED),
                ("Dopad: Moss detekuje shodu, hrozí disciplinární komise a u zkoušky nic neumíte.", 1, False, Pt(14), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("✅ Skutečná pomoc:", 0, True, Pt(18), RGBColor(0x16, 0xA3, 0x4A)),
                ("„V 3. úloze nechápu, jak správně inicializovat pole. Můžeš mi vysvětlit logiku?“", 1, True, Pt(15), self.COLOR_MUTED),
                ("Dopad: Pochopení principu, samostatně napsaný kód a jistota u zkoušky.", 1, False, Pt(14), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("Vzdělávání je o identifikaci vlastních mezer a jejich překonání.", 0, True, Pt(16), self.COLOR_ORANGE),
            ])
        self.set_speaker_notes(slide, (
            "Spolupráce je na bioinformatice základ úspěchu, ale musí jít o sdílení konceptů a logiky, nikoliv kódu. "
            "Pokud vám někdo pošle hotový kód, nejenže riskujete postih v Progtestu, ale hlavně se nic nenaučíte pro zkoušku."
        ))

    def remake_slide_16(self, slide: Any) -> None:
        """Slide 16: Co když předmět neudělám & kreditová minima."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;219;p16":
                t_shape = s
            elif s.name == "Google Shape;220;p16":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Podmínky postupu & Co když předmět neudělám", 0, True, Pt(32), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Kreditová minima podle Studijního řádu VŠCHT:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Postup do LS: Alespoň 15 kreditů za zimní semestr (nutno splnit min. 2 zkoušky)", 1, True, Pt(15), self.COLOR_DARK),
                ("Postup do 2. ročníku: Alespoň 30 kreditů za 1. ročník (doporučeno plných 60)", 1, True, Pt(15), self.COLOR_DARK),
                ("Bakalářské minimum: 180 kreditů + 4 tělocviky v prvních 5 semestrech", 1, False, Pt(14), self.COLOR_MUTED),
                ("", 0, False, Pt(6), None),
                ("Pravidla opakování předmětů a zkoušek:", 0, True, Pt(17), self.COLOR_DARK),
                ("Každý předmět lze zapsat maximálně 2× (zapsat + 1× opakovat v dalším roce)", 1, False, Pt(14), self.COLOR_DARK),
                ("Zkoušku lze skládat až 3× (1 řádný termín + 2 opravné pokusy)", 1, False, Pt(14), self.COLOR_DARK),
                ("Pokud cítíte, že semestr nezvládáte: Zajděte včas na děkanát FCHT za Petrou Kohoutovou a požádejte o rozložení ročníku.", 1, True, Pt(14), self.COLOR_ORANGE),
            ])
        self.set_speaker_notes(slide, (
            "Pravidla postupu na VŠCHT: Na postup ze zimy do léta potřebujete 15 kreditů (tj. udělat aspoň 2 předměty). "
            "Do druháku musíte mít 30 kreditů. Každý předmět můžete zapsat maximálně dvakrát. Pokud vidíte, že semestr drhne, "
            "nečekejte a řešte rozložení ročníku se studijní referentkou včas!"
        ))

    def remake_slide_17(self, slide: Any) -> None:
        """Slide 17: Stipendia."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;230;p17":
                t_shape = s
            elif s.name == "Google Shape;231;p17":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Stipendia pro studenty", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Ubytovací stipendium (cca 27–30 Kč na den):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Nárok má každý student s trvalým bydlištěm mimo Prahu", 1, False, Pt(15), self.COLOR_DARK),
                ("Podává se elektronicky v SISu VŠCHT na začátku semestru", 1, False, Pt(15), self.COLOR_DARK),
                ("Vyplácí se zpětně za každý den semestru včetně víkendů", 1, False, Pt(15), self.COLOR_MUTED),
                ("", 0, False, Pt(8), None),
                ("Mimořádné prospěchové stipendium (40 000 Kč):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Maturita v aktuálním roce", 1, False, Pt(15), self.COLOR_DARK),
                ("Splněny všechny studijní povinnosti 1. ročníku do konce LS", 1, False, Pt(15), self.COLOR_DARK),
                ("Studijní průměr za 1. ročník < 1,20 a zisk alespoň 30 kreditů", 1, True, Pt(15), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Nezapomeňte si podat žádost o ubytovací stipendium v SISu — je to jednoduché a pár tisíc za semestr se hodí. "
            "A pro premianty: pokud jste letos maturovali a udržíte v prváku průměr pod 1.20, VŠCHT vyplácí 40 000 Kč!"
        ))

    def remake_slide_18(self, slide: Any) -> None:
        """Slide 18: Kde trávit čas & zázemí kampusu."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;240;p18":
                t_shape = s
            elif s.name == "Google Shape;241;p18":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Zázemí: Kde v kampusu trávit čas", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Klubovna B1322 (Budova B VŠCHT — náš ústav ÚICH):", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Otevřená studovna a klubovna vyhrazená pro bioinformatiky (uich.vscht.cz/mapa)", 1, False, Pt(15), self.COLOR_DARK),
                ("Ideální místo na společné řešení Progtestu, konzultace se staršími a odpočinek", 1, False, Pt(15), self.COLOR_DARK),
                ("NTK (Národní technická knihovna):", 0, True, Pt(17), self.COLOR_DARK),
                ("Tichá patra pro hluboké studium, noční studovna, týmové studovny i tisk z notebooku", 1, False, Pt(15), self.COLOR_DARK),
                ("Menzy a jídlo v kampusu:", 0, True, Pt(17), self.COLOR_DARK),
                ("Menzy ČVUT: Technická (vedle NTK), Studentský dům, Masarykova kolej (platba kartou / Agáta)", 1, False, Pt(15), self.COLOR_DARK),
                ("Zázemí VŠCHT: Respirium v budově B, Bufan, kavárna Carbon", 1, False, Pt(15), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Využívejte klubovnu B1322 na ÚICH — je to naše útočiště, kde starší spolužáci pravidelně sedí a rádi pomohou s Progtestem. "
            "NTK je skvělá na noční učení a v menzách vedle NTK se dobře najíte."
        ))

    def remake_slide_19(self, slide: Any) -> None:
        """Slide 19: Studium a práce."""
        t_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;249;p19":
                t_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Studium a práce: Hledejte rovnováhu", 0, True, Pt(34), self.COLOR_DARK)
            ])
        self.set_speaker_notes(slide, (
            "Rada starších ročníků: 1. ročník bioinformatiky je časově náročný jako plný úvazek. "
            "Pokud to jen trochu jde, neberte si v 1. semestru brigádu na víc než pár hodin o víkendu. "
            "Pravidelně vidíme, že lidé s velkými úvazky nestíhají týdenní deadliny v Progtestu a zbytečně končí."
        ))

    def remake_slide_20(self, slide: Any) -> None:
        """Slide 20: Kontrola e-mailů."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;257;p20":
                t_shape = s
            elif s.name == "Google Shape;258;p20":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Nezmeškejte důležité termíny: Kontrolujte e-maily!", 0, True, Pt(30), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Máte dvě oficiální univerzitní schránky:", 0, True, Pt(18), self.COLOR_ORANGE),
                ("jmeno.prijmeni@vscht.cz — oficiální komunikace fakulty, stipendia, děkanát", 1, False, Pt(15), self.COLOR_DARK),
                ("username@fit.cvut.cz — Courses, Progtest, výzvy k BOZP školení", 1, False, Pt(15), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("💡 Zlatá rada: Nastavte si automatické přesměrování (forward) z obou schránek na soukromý e-mail!", 0, True, Pt(16), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Důležité: Každý máte dvě adresy. Nastavte si přesměrování do jednoho e-mailu, který čtete denně. "
            "Na FIT mail vám přijde například výzva k fyzickému podpisu BOZP školení — kdo nepodepíše, tomu zablokují přístup do učeben!"
        ))

    def remake_slide_21(self, slide: Any) -> None:
        """Slide 21: Komunita & Sociálno."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;264;g3fa8c97192b_0_0":
                # Clear top stripe
                if s.has_text_frame:
                    s.text_frame.text = ""
            elif s.name == "Google Shape;266;g3fa8c97192b_0_0":
                t_shape = s
            elif s.name == "Google Shape;267;g3fa8c97192b_0_0":
                c_shape = s
            elif s.has_text_frame and s.name.startswith("Google Shape;26"):
                # Clear any other draft shapes on slide 21
                s.text_frame.text = ""

        if t_shape:
            self.set_shape_text(t_shape, [
                ("Komunita & Akce ÚICH: Propojte se s námi!", 0, True, Pt(34), self.COLOR_DARK)
            ])

        if c_shape:
            # Expand container dimensions to fit comfortably
            c_shape.left = Inches(1.19)
            c_shape.top = Inches(2.20)
            c_shape.width = Inches(10.94)
            c_shape.height = Inches(4.50)

            self.set_shape_text(c_shape, [
                ("💬 Discord BioCord (discord.gg/yWxFJmM6Qg):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Hlavní oficiální komunikační kanál oboru — nastavte si civilní Jméno a Příjmení.", 1, False, Pt(15), self.COLOR_DARK),
                ("🎒 Bioinformatické vítání prváků (první listopadová sobota):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Celodenní pěší výlet studentů všech ročníků a vyučujících ÚICH do přírody — nejrychlejší cesta k neocenitelným radám ke zkouškám!", 1, False, Pt(15), self.COLOR_DARK),
                ("🔬 SVK — Studentská vědecká konference (konec listopadu):", 0, True, Pt(18), self.COLOR_DARK),
                ("Celoškolní den studentské vědy spojený s rektorským volnem — skvělá inspirace pro budoucí bakalářku.", 1, False, Pt(15), self.COLOR_MUTED),
                ("🎄 Vánoční večírek ÚICH (polovina prosince):", 0, True, Pt(18), self.COLOR_DARK),
                ("Neformální setkání studentů a vyučujících v klubovně B1322 před začátkem zkouškového.", 1, False, Pt(15), self.COLOR_MUTED),
            ])

        self.set_speaker_notes(slide, (
            "Připojte se na BioCord a určitě doražte na listopadové Vítání prváků! "
            "Je to pěší výlet s vyučujícími a staršími studenty do přírody — zeptejte se jich na cokoliv ohledně zkoušek "
            "a jednotlivých předmětů. Pravidelní účastníci komunitních akcí mají statisticky nejvyšší úspěšnost dokončení studia!"
        ))

    def run(self) -> None:
        """Execute the remake across all slides and save."""
        print(f"Remaking {len(self.prs.slides)} slides from {self.input_path.name}...")
        
        self.remake_slide_1(self.prs.slides[0])
        self.remake_slide_2(self.prs.slides[1])
        self.remake_slide_3(self.prs.slides[2])
        self.remake_slide_4(self.prs.slides[3])
        self.remake_slide_5(self.prs.slides[4])
        self.remake_slide_6(self.prs.slides[5])
        self.remake_slide_7(self.prs.slides[6])
        self.remake_slide_8(self.prs.slides[7])
        self.remake_slide_9(self.prs.slides[8])
        self.remake_slide_10(self.prs.slides[9])
        self.remake_slide_11(self.prs.slides[10])
        # Slide 12 is pure meme picture, leave as is
        self.remake_slide_13(self.prs.slides[12])
        self.remake_slide_14(self.prs.slides[13])
        self.remake_slide_15(self.prs.slides[14])
        self.remake_slide_16(self.prs.slides[15])
        self.remake_slide_17(self.prs.slides[16])
        self.remake_slide_18(self.prs.slides[17])
        self.remake_slide_19(self.prs.slides[18])
        self.remake_slide_20(self.prs.slides[19])
        self.remake_slide_21(self.prs.slides[20])

        self.prs.save(str(self.output_path))
        print(f"Successfully saved remade presentation to: {self.output_path}")


def main() -> None:
    input_file = Path("/mnt/c/Users/kolar/Downloads/strašení prváků - bioinformatika.orig.backup.pptx")
    output_file = Path("/mnt/c/Users/kolar/Downloads/strašení prváků - bioinformatika.pptx")

    remaker = PresentationRemaker(input_file, output_file)
    remaker.run()


if __name__ == "__main__":
    main()
