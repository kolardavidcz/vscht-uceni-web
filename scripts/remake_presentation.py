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
    COLOR_RED: RGBColor = RGBColor(0xDC, 0x26, 0x26)        # Danger red
    COLOR_GREEN: RGBColor = RGBColor(0x16, 0xA3, 0x4A)      # Success green

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
                ("🎒 Průvodce prváka: Bioinformatika", 0, True, Pt(38), self.COLOR_ORANGE)
            ])
        if subtitle_shape:
            self.set_shape_text(subtitle_shape, [
                ("Jak funguje dvojí studium (VŠCHT vs. FIT ČVUT)", 0, True, Pt(20), self.COLOR_DARK),
                ("Checklist prvních dvou týdnů & Školní systémy", 0, True, Pt(20), self.COLOR_DARK),
                ("The Great Filter (BI-PA1) & Jak přežít první semestr", 0, True, Pt(20), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Ahoj! Vítáme vás na bioinformatice. Když jsme byli v prváku my, sedli si s námi starší spolužáci "
            "a ten start nám neskutečně usnadnili. Dnes vám předáme to nejdůležitější: co zařídit hned v prvních dnech, "
            "jak funguje propojení VŠCHT a FITu a jak bez nervů projít prvním semestrem. "
            "Kromě tohoto našeho bioinformatického průvodce si projděte také oficiálního celoškolského Průvodce prváka VŠCHT "
            "od Poradenského a kariérního centra VŠCHT (PKC v PDF)."
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
                ("„Chemie a biologie v počítačích“ (= chemoinformatika & bioinformatika)", 0, False, Pt(17), self.COLOR_DARK),
                ("", 0, False, Pt(8), None),
                ("Skutečná realita studia:", 0, True, Pt(20), self.COLOR_ORANGE),
                ("Unikátní mezioborový program spojující VŠCHT Praha (FCHT) a FIT ČVUT.", 0, False, Pt(17), self.COLOR_DARK),
                ("Docházíte na dvě špičkové univerzity: moderní chemie & biologie na VŠCHT a špičková informatika na FIT ČVUT.", 0, False, Pt(16), self.COLOR_MUTED),
                ("Prošli jsme přesně tím, co vás teď čeká — ptejte se na cokoliv!", 0, True, Pt(17), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Tento slajd je o dvou věcech: zaprvé, co říct babičce a rodině, když se zeptají, co že to vlastně studujete. "
            "Zadruhé, že jsme si tím vším prošli také, víme, kde to bolí, a celá naše komunita je tu od toho, aby vám pomohla."
        ))

    def remake_slide_3(self, slide: Any) -> None:
        """Slide 3: Checklist prvních dvou týdnů (1:1 z wiki)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;110;p3":
                t_shape = s
            elif s.name == "Google Shape;111;p3":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("⚡ Checklist prvních dvou týdnů", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("💳 Karty a aktivace vstupu na FIT ČVUT:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Karta VŠCHT / ISIC: Vyzvednout v Kartovém centru VŠCHT (fotka vám zůstává po celou dobu studia)", 1, False, Pt(14), self.COLOR_DARK),
                ("Aktivace vstupu na ČVUT (Vydavatelství průkazů u NTK): Výhradně v 1. týdnu výuky VŠCHT! Rezervujte si čas online — nahrání vstupu do budov FITu na kartu VŠCHT + vydání iniciálního hesla ČVUT.", 1, True, Pt(14), self.COLOR_DARK),
                ("🔑 Účty, hesla, Wi-Fi a bezpečnost:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Heslo ČVUT: Na Usermap ČVUT zadat iniciální heslo a nastavit si trvalé heslo.", 1, False, Pt(14), self.COLOR_DARK),
                ("Wi-Fi eduroam: Certifikát z webu VC VŠCHT; na FITu navíc v Usermapu nastavit speciální síťové heslo (odlišné od KOSu!).", 1, False, Pt(14), self.COLOR_DARK),
                ("Registrace v NTK: Osobní registrace karty u zákaznického pultu v NTK (přístup do noční studovny, tisk z notebooku, Wi-Fi).", 1, False, Pt(14), self.COLOR_DARK),
                ("Lítačka (PID): Potvrzení o studiu stáhnout ze SISu VŠCHT a nahrát do aplikace PID Lítačka.", 1, False, Pt(14), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "Klíčové časování 1. týdne: VŠCHT začíná o týden dřív než FIT. Využijte první týden na vyřízení vstupu na FIT "
            "ve Vydavatelství průkazů ČVUT u NTK — v druhém týdnu už tam budou obří fronty studentů ČVUT. "
            "Nezapomeňte na speciální síťové heslo v Usermapu ČVUT, bez něj se na FITu nepřipojíte k eduroamu! "
            "A v NTK si nechte ISIC pípnout u pultu, ať můžete tisknout z notebooku a učit se v noční studovně."
        ))

    def remake_slide_4(self, slide: Any) -> None:
        """Slide 4: Dvě univerzity & KOS (1:1 z wiki sekce Dvě univerzity)."""
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
                ("🏛️ Dvě univerzity: Jak funguje dvojí studium (VŠCHT vs. FIT)", 0, True, Pt(32), self.COLOR_DARK)
            ])
        if col_left:
            col_left.left = Inches(0.80)
            col_left.top = Inches(2.20)
            col_left.width = Inches(5.70)
            col_left.height = Inches(4.90)
            self.set_shape_text(col_left, [
                ("🏛️ VŠCHT Praha (Domovská univerzita):", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Formální příslušnost: Jste studenty výhradně VŠCHT Praha (Fakulta chemické technologie – FCHT).", 0, False, Pt(13), self.COLOR_DARK),
                ("Studijní řád: Vaše studium se řídí Studijním a zkušebním řádem VŠCHT.", 0, False, Pt(13), self.COLOR_DARK),
                ("Kredity & výsledky: Jediným právně závazným systémem je SIS VŠCHT (student.vscht.cz). KOS je orientační!", 0, True, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("Kontakty na administrativu VŠCHT:", 0, True, Pt(14), self.COLOR_DARK),
                ("• Studijní referentka FCHT: Petra Kohoutová (Petra.Kohoutova@vscht.cz)", 0, False, Pt(12), self.COLOR_MUTED),
                ("• Garant oboru: Dr. Martin Šícho (Martin.Sicho@vscht.cz)", 0, False, Pt(12), self.COLOR_MUTED),
                ("• Tajemník ÚICH: Ing. Jiří Znamenáček (Jiri.Znamenacek@vscht.cz)", 0, False, Pt(12), self.COLOR_MUTED),
            ])
        if col_right:
            col_right.left = Inches(6.80)
            col_right.top = Inches(2.20)
            col_right.width = Inches(5.80)
            col_right.height = Inches(4.90)
            self.set_shape_text(col_right, [
                ("💻 FIT ČVUT (Smluvní výuka informatiky):", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Smluvní výuka: Na FIT docházíte pouze na výuku informatických předmětů.", 0, False, Pt(13), self.COLOR_DARK),
                ("Rozvrh v 1. ročníku máte pevně zarezervován! V KOSu nic nezapisujete ani neměníte (výběr rozvrhu je až od 2. ročníku).", 0, True, Pt(13), self.COLOR_DARK),
                ("🛑 Ignorujte chybové e-maily z KOSu! Hlášení typu „nemáte dost kreditů“ nebo „paralelka není otevřená“ neřešte — KOS nevidí studium na VŠCHT!", 0, True, Pt(13), self.COLOR_RED),
                ("Přednášky FIT: Docházka se nekontroluje, můžete jít na libovolnou paralelku (kódy v SISu B500xxx).", 0, False, Pt(12), self.COLOR_MUTED),
                ("", 0, False, Pt(4), None),
                ("Kontakt FIT pro bioinformatiky:", 0, True, Pt(14), self.COLOR_DARK),
                ("• Studijní referentka FIT: Zdeňka Kutinová (zdenka.kutinova@fit.cvut.cz / bioinformatika@fit.cvut.cz)", 0, False, Pt(12), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "Jak funguje dvojí studium: Jste studenty VŠCHT, vaše kredity, index a zápisy se řídí výhradně SISem VŠCHT. "
            "Na FIT docházíte na špičkovou informatiku. V 1. ročníku máte cvičení na FITu předem zarezervována. "
            "KOS vám bude posílat automatické výhružné e-maily, že nemáte zapsaný minimální počet kreditů — ignorujte je! "
            "KOS nevidí vaše předměty na VŠCHT. Pokud budete potřebovat řešit administrativu, referentka Petra Kohoutová na FCHT "
            "a Zdeňka Kutinová na FITu jsou tu pro vás."
        ))

    def remake_slide_5(self, slide: Any) -> None:
        """Slide 5: The Great Filter & řetězec předmětů."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;128;p5":
                t_shape = s
            elif s.name == "Google Shape;129;p5":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("📊 The Great Filter: Tři pilíře 1. semestru", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Tři klíčové 8kreditové předměty (celkem 24 z 30 kreditů semestru):", 0, True, Pt(18), self.COLOR_ORANGE),
                ("1. BI-PA1: Programování a algoritmizace 1 (8 kreditů, FIT ČVUT)", 1, True, Pt(15), self.COLOR_DARK),
                ("2. Matematika A: (8 kreditů, VŠCHT)", 1, True, Pt(15), self.COLOR_DARK),
                ("3. OACH I: Obecná a anorganická chemie 1 (8 kreditů, VŠCHT)", 1, True, Pt(15), self.COLOR_DARK),
                ("", 0, False, Pt(6), None),
                ("🚨 BI-PA1 SE VYUČUJE VÝHRADNĚ V ZIMNÍM SEMESTRU!", 0, True, Pt(18), self.COLOR_RED),
                ("V letním semestru se PA1 vůbec neotvírá! Pokud ji neuděláte, musíte čekat celý rok.", 1, False, Pt(15), self.COLOR_DARK),
                ("⛓️ Celý informatický řetězec striktně navazuje:", 0, True, Pt(17), self.COLOR_DARK),
                ("BI-PA1 ➔ Java ➔ BI-AX1 + Python (oba naráz ve 3. semestru) ➔ BI-AAG", 1, True, Pt(15), self.COLOR_BLUE),
                ("Neudělat PA1 = ve 3. semestru brutální kumulace: opakovaná PA1 + BI-AX1 + Python + Biochemie + Fyzikála!", 1, True, Pt(14), self.COLOR_ORANGE),
                ("Zlaté pravidlo: Nepodceňte rozjezd — prvních 7 týdnů rozhodne o všem!", 0, True, Pt(16), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Proč 'The Great Filter'? Tři 8kreditové předměty tvoří 24 z 30 kreditů semestru. "
            "Kritické je udělat PA1 napoprvé: PA1 běží pouze v zimě! Pokud ji nezvládnete, musíte čekat celý rok. "
            "A ve 3. semestru vás smete brutální kombinace: opakovaná PA1 společně s další síťovkou BI-AX1 (Algoritmy a grafy), "
            "Pythonem, Biochemií a Fyzikální chemií naráz!"
        ))

    def remake_slide_6(self, slide: Any) -> None:
        """Slide 6: Prvních 7 týdnů - strategie zápočtů vs eskalace PA1."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;136;p6":
                t_shape = s
            elif s.name == "Google Shape;137;p6":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("⚡ Prvních 7 týdnů: Strategie zápočtů vs. eskalace PA1", 0, True, Pt(32), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("📐 Matematika A & Anorganika (OACH I) — Vytvořte si polštář:", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Kolem 6. týdne se píší první zápočtové testy z Matematiky A i Anorganické chemie I.", 1, False, Pt(14), self.COLOR_DARK),
                ("Jsou PODSTATNĚ jednodušší než druhé prosincové testy!", 1, True, Pt(15), self.COLOR_RED),
                ("Nasbírejte v nich maximum bodů (v součtu potřebujete > 50 %), ať máte klidný konec roku.", 1, False, Pt(14), self.COLOR_DARK),
                ("*(Podrobné studijní tipy, sbírky a přednášky k Matice a Chemii najdete v samostatných kapitolách na wiki).* ", 1, False, Pt(13), self.COLOR_MUTED),
                ("", 0, False, Pt(6), None),
                ("⚠️ BI-PA1 mezitím prudce nabírá na náročnosti:", 0, True, Pt(18), self.COLOR_ORANGE),
                ("Zatímco se učíte na zápočty z chemie a matiky, úlohy v Progtestu jsou týden od týdne obtížnější.", 1, False, Pt(14), self.COLOR_DARK),
                ("Zatímco matiku nebo chemii lze nárazově dohnat před testem, programování o víkendu nedoženete!", 1, True, Pt(14), self.COLOR_DARK),
                ("Ztratit tempo v PA1 během prvních 7 týdnů znamená zkomplikovat si celé další studium informatiky.", 1, True, Pt(14), self.COLOR_RED),
            ])
        self.set_speaker_notes(slide, (
            "Strategie prvních 7 týdnů: První zápočty z Matiky A i Anorgány bývají výrazně jednodušší než druhé prosincové. "
            "V součtu potřebujete >50 % bodů, takže když v 1. testech získáte maximum, v prosinci už nebudete ve stresu. "
            "Mezitím ale v PA1 obtížnost úloh každý týden skokově roste — programování na rozdíl od chemie o víkendu nedoženete!"
        ))

    def remake_slide_7(self, slide: Any) -> None:
        """Slide 7: Harmonogram & časové anomálie (1:1 z wiki)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;144;p7":
                t_shape = s
            elif s.name == "Google Shape;146;p7":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("🕒 Harmonogram & anomálie semestru", 0, True, Pt(30), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.left = Inches(0.28)
            c_shape.top = Inches(2.20)
            c_shape.width = Inches(5.80)
            c_shape.height = Inches(4.90)
            self.set_shape_text(c_shape, [
                ("Posun začátku výuky v ZS:", 0, True, Pt(16), self.COLOR_ORANGE),
                ("VŠCHT začíná o týden dříve než FIT ČVUT.", 1, False, Pt(13), self.COLOR_DARK),
                ("V 1. týdnu máte výuku jen na VŠCHT — ideální čas zařídit karty na ČVUT bez front!", 1, True, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("Rozvrhové anomálie během semestru:", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Lichý vs. sudý týden: Některá cvičení běží jen 1× za 14 dní.", 1, False, Pt(13), self.COLOR_DARK),
                ("Kompenzace státních svátků: Daný den se učí podle rozvrhu jiného dne (např. pátek podle pondělí).", 1, False, Pt(13), self.COLOR_DARK),
                ("Rektorské dny a děkanská volna: Volno na VŠCHT neplatí na FITu a naopak!", 1, True, Pt(13), self.COLOR_RED),
                ("Slavnostní imatrikulace VŠCHT: Výuka na VŠCHT odpadá, nutný společenský oděv.", 1, False, Pt(13), self.COLOR_MUTED),
                ("", 0, False, Pt(4), None),
                ("Přednášky na FITu: Docházka se nekontroluje, můžete navštěvovat libovolnou paralelku.", 0, True, Pt(13), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Rozvrh a kalendář: VŠCHT začíná dřív než FIT. Hlídejte si lichý a sudý týden, kompenzace státních svátků "
            "a hlavně to, že rektorské volno na VŠCHT neznamená volno na FITu — pokud máte cvičení na FITu, musíte tam jít! "
            "Přednášky na FITu mají volnou docházku, takže můžete jít na paralelku, která se vám lépe hodí."
        ))

    def remake_slide_8(self, slide: Any) -> None:
        """Slide 8: BI-PA1 jako síto & Progtest."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;153;p8":
                t_shape = s
            elif s.name == "Google Shape;154;p8":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("💻 BI-PA1: Kde se láme semestr", 0, True, Pt(36), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.top = Inches(4.20)
            c_shape.height = Inches(2.90)
            self.set_shape_text(c_shape, [
                ("Proč má PA1 pověst nejtěžšího síta 1. ročníku?", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Týdenní deadliny v Progtestu: Úlohy nelze napsat za večer před deadlinem, vyžadují hodiny ladění.", 1, False, Pt(13), self.COLOR_DARK),
                ("Kód musí být 100% neprůstřelný: Správný pro všechny mezní stavy, efektivní a bez úniků paměti (Valgrind).", 1, False, Pt(13), self.COLOR_DARK),
                ("Zkouškový test v laboratoři: Píše se v počítačové učebně FIT na ostro za 2 hodiny bez internetu a AI!", 1, True, Pt(13), self.COLOR_RED),
                ("", 0, False, Pt(4), None),
                ("Proč se průchodnost bioinformatiků každý rok zlepšuje?", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Discord BioCord: Starší studenti aktivně radí s logikou, architekturou i laděním záseků.", 1, False, Pt(13), self.COLOR_DARK),
                ("Kvalitní příprava a sdílené know-how v kapitolách BI-PA1 na naší wiki.", 1, False, Pt(13), self.COLOR_DARK),
                ("Kdo začne kódovat hned v den zadání a sbírá bonusy, zápočet s přehledem získá!", 1, True, Pt(13), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Na PA1 vyletí nejvíc lidí kvůli odkládání úloh na neděli večer. Úlohy v Progtestu jsou komplexní a zkouška "
            "se píše bez internetu v počítačové učebně FIT. Úspěšnost bioinformatiků ale každým rokem roste — máme skvělou "
            "komunitu na BioCordu a na wiki odladěné šablony."
        ))

    def remake_slide_9(self, slide: Any) -> None:
        """Slide 9: Jak zvládnout BI-PA1 krok za krokem."""
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
                ("🚀 Kódujte hned v den zadání úlohy:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Časové bonusy za včasné odevzdání vám na konci semestru vytvoří kritickou rezervu bodů pro zápočet!", 1, True, Pt(14), self.COLOR_DARK),
                ("🛑 Nikdy neopisujte kód (Progtest používá MOSS detektor plagiátů):", 0, True, Pt(17), self.COLOR_RED),
                ("Algoritmus porovnává abstraktní syntaktické stromy. Přejmenování proměnných nepomůže. Shoda = disciplinární komise!", 1, False, Pt(14), self.COLOR_MUTED),
                ("🤖 AI (ChatGPT / Claude / Gemini) používejte jako doučovatele:", 0, True, Pt(17), self.COLOR_DARK),
                ("Skvělé na vysvětlení syntaktických chyb, fungování pointerů a generování testovacích vstupů.", 1, False, Pt(14), self.COLOR_DARK),
                ("Pokud si necháte úlohu vygenerovat, u zkoušky v laboratoři bez internetu nemáte šanci.", 1, True, Pt(14), self.COLOR_ORANGE),
                ("🙋 Ptejte se včas: Na cvičeních, proseminářích a na našem Discordu BioCord!", 0, True, Pt(17), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Zlatá pravidla PA1: Časové bonusy za brzké odevzdání jsou záchranná vesta na konci semestru. "
            "Neopisujte kód — MOSS detekuje i přejmenované proměnné a změněné cykly. AI používejte jako doučovatele na vysvětlení chyb, "
            "ale algoritmus musíte vymyslet a napsat sami, jinak u zkouškového testu shoříte."
        ))

    def remake_slide_10(self, slide: Any) -> None:
        """Slide 10: Klíčová slova v jazyce C (1:1 tabulka z wiki)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;172;p10":
                t_shape = s
            elif s.name == "Google Shape;174;p10":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("💻 C pro BI-PA1: Klíčová slova", 0, True, Pt(30), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.left = Inches(0.28)
            c_shape.top = Inches(2.20)
            c_shape.width = Inches(5.90)
            c_shape.height = Inches(4.90)
            self.set_shape_text(c_shape, [
                ("Dokážete vysvětlit, co které klíčové slovo v C dělá?", 0, True, Pt(14), self.COLOR_ORANGE),
                ("• Datové typy: char, int, float, double, void", 0, False, Pt(13), self.COLOR_DARK),
                ("• Modifikátory typů: short, long, signed, unsigned", 0, False, Pt(13), self.COLOR_DARK),
                ("• Řízení toku: if, else, switch, case, default, break", 0, False, Pt(13), self.COLOR_DARK),
                ("• Cykly (smyčky): for, while, do, continue", 0, False, Pt(13), self.COLOR_DARK),
                ("• Uživatelské typy: struct, union, enum, typedef", 0, False, Pt(13), self.COLOR_DARK),
                ("• Ukazatele & adresy: * (dereference / pointer), & (adresa)", 0, True, Pt(13), self.COLOR_BLUE),
                ("• Ostatní: return, const", 0, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("💡 Zkuste si každé slovo ověřit u AI:", 0, True, Pt(13), self.COLOR_DARK),
                ("Zadejte: „Vysvětli mi na jednoduchém příkladu v C klíčové slovo XY...“", 0, False, Pt(12), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "Základ syntaxe jazyka C: C má jen zhruba 32 klíčových slov, takže syntaxe je přímočará. "
            "Skutečná výzva PA1 spočívá v práci s pamětí — ukazatele, dynamická alokace přes malloc/free, správa polí "
            "a prevence úniků paměti. Pokud vám nějaké klíčové slovo není jasné, nechte si ho vysvětlit od AI na jednoduchém kódu."
        ))

    def remake_slide_11(self, slide: Any) -> None:
        """Slide 11: Zlaté pravidlo: Nejdřív programovat, až pak ladit prostředí."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;179;p11":
                t_shape = s
            elif s.name == "Google Shape;180;p11":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("💡 Zlaté pravidlo: Nejdřív programovat, až pak ladit prostředí!", 0, True, Pt(30), self.COLOR_ORANGE)
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
        """Slide 13: Rozcestník školních systémů (1:1 tabulka z wiki)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;194;p13":
                t_shape = s
            elif s.name == "Google Shape;193;p13":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("🌐 Rozcestník školních systémů: VŠCHT vs. FIT ČVUT", 0, True, Pt(32), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.top = Inches(1.80)
            c_shape.height = Inches(5.20)
            self.set_shape_text(c_shape, [
                ("🏛️ Systémy VŠCHT:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("• SIS VŠCHT (student.vscht.cz) — oficiální index, zkoušky, zápis předmětů a stipendia", 0, False, Pt(14), self.COLOR_DARK),
                ("• Moodle VŠCHT (e-learning.vscht.cz) — slajdy z přednášek, testy z chemie a matematiky", 0, False, Pt(14), self.COLOR_DARK),
                ("• Průvodce studiem & Mapy Emil (studium.vscht.cz, emil.vscht.cz/maps) — plánek budov A a B", 0, False, Pt(14), self.COLOR_MUTED),
                ("• studuj.bioinformatiku.cz — studijní plány oboru a obsazenost klubovny B1322", 0, False, Pt(14), self.COLOR_MUTED),
                ("", 0, False, Pt(4), None),
                ("💻 Systémy FIT ČVUT:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("• KOS ČVUT (kos.cvut.cz) — zápis předmětů a termínů zkoušek na FITu", 0, False, Pt(14), self.COLOR_DARK),
                ("• Courses FIT (courses.fit.cvut.cz) — materiály z přednášek, cvičení, zadání", 0, False, Pt(14), self.COLOR_DARK),
                ("• Progtest (progtest.fit.cvut.cz) — odevzdávací systém úloh pro BI-PA1", 0, True, Pt(14), self.COLOR_BLUE),
                ("• Trainer KSI (trainer.ksi.fit.cvut.cz) — interaktivní cvičebnice C od základů po zkoušku", 0, False, Pt(14), self.COLOR_DARK),
                ("• FIT-Wiki (fit-wiki.cz) — studentská databáze: zápisky a archiv minulých písemek", 0, True, Pt(14), self.COLOR_DARK),
                ("• Timetable FIT (timetable.fit.cvut.cz) — rozvrhy paralelek a obsazenost učeben", 0, False, Pt(14), self.COLOR_MUTED),
            ])
        self.set_speaker_notes(slide, (
            "Uložte si tyto portály do záložek. Na VŠCHT je centrála SIS a Moodle. "
            "Na FITu je pro vás nejdůležitější Courses, Progtest, Trainer KSI jako trenažér a FIT-Wiki s archivem zkouškových písemek."
        ))

    def remake_slide_14(self, slide: Any) -> None:
        """Slide 14: Zkouškové období & Taktika na BI-PA1 (namísto matiky)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;202;p14":
                t_shape = s
            elif s.name == "Google Shape;203;p14":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("🏁 Zkouškové období: Taktika na BI-PA1 & FIT", 0, True, Pt(32), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.left = Inches(0.80)
            c_shape.top = Inches(2.10)
            c_shape.width = Inches(7.50)
            c_shape.height = Inches(4.90)
            self.set_shape_text(c_shape, [
                ("📅 Zkouškové trvá 5 až 6 týdnů (leden až polovina února):", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Termíny VŠCHT se zapisují v SISu, zkouška z BI-PA1 v KOSu ČVUT.", 1, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("🎯 Zkouška z BI-PA1 v 1. a 2. týdnu:", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Na zkoušku z PA1 jděte hned v 1. týdnu zkouškového (případně opravný pokus ve 2. týdnu).", 1, True, Pt(13), self.COLOR_DARK),
                ("Termíny v prvních dvou týdnech bývají nejjednodušší, zadání úloh v Progtestu nejpřímočařejší a máte kód čerstvě v prstech!", 1, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("👨‍🏫 Výběr zkoušejícího na FITu:", 0, True, Pt(16), self.COLOR_DARK),
                ("U ústní části volte raději přednášející (profesoři, docenti) než mladé cvičící a doktorandy — ti bývají zbytečně přísní a puntičkářští.", 1, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("💡 FIT tip (identita bioinformatika):", 0, True, Pt(16), self.COLOR_BLUE),
                ("Vždy u zkoušky i na cvičeních zmiňte, že jste bioinformatici z VŠCHT — vyučující na FITu na to berou ohled a přistupují s větším pochopením a shovívavostí!", 1, True, Pt(13), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Zkouškové období: Zkoušku z PA1 neodkládejte na únor! Jděte na ni v 1. týdnu — termíny bývají přímočařejší "
            "a máte kód v prstech ze zápočtu. Pokud neuspějete, máte ještě spoustu času na opravu. "
            "A zásadní rada: na FITu vždy řekněte, že jste bioinformatici z VŠCHT! Zkoušející vědí, že máte paralelně chemii, "
            "a jsou k vám mnohem shovívavější než k čistým informatikům."
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
                ("", 0, False, Pt(4), None),
                ("❌ Medvědí služba:", 0, True, Pt(17), self.COLOR_RED),
                ("„Pošli mi prosím svoje řešení 3. domácí úlohy, vůbec to nestíhám.“", 1, True, Pt(14), self.COLOR_MUTED),
                ("Dopad: MOSS detekuje shodu, hrozí disciplinární komise a u zkoušky v laboratoři nic nenapíšete.", 1, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("✅ Skutečná pomoc:", 0, True, Pt(17), self.COLOR_GREEN),
                ("„V 3. úloze nechápu, jak správně alokovat 2D dynamické pole ukazatelů. Můžeš mi vysvětlit logiku?“", 1, True, Pt(14), self.COLOR_MUTED),
                ("Dopad: Pochopení principu, samostatně napsaný kód a jistota u zkoušky.", 1, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("Vzdělávání je o identifikaci vlastních mezer a jejich překonání — jejich zakrytím si způsobíte potíže.", 0, True, Pt(15), self.COLOR_ORANGE),
            ])
        self.set_speaker_notes(slide, (
            "Spolupráce je na bioinformatice základ úspěchu, ale musí jít o sdílení konceptů a logiky, nikoliv hotového kódu. "
            "Pokud vám někdo pošle kód, nejenže riskujete postih v Progtestu, ale hlavně se nic nenaučíte pro zkoušku v laboratoři."
        ))

    def remake_slide_16(self, slide: Any) -> None:
        """Slide 16: Přepis známek z FITu do SISu (KOS ➔ SIS)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;219;p16":
                t_shape = s
            elif s.name == "Google Shape;220;p16":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("🚨 Přepis známek z FITu do SISu (KOS ➔ SIS)", 0, True, Pt(30), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.width = Inches(7.30)
            c_shape.height = Inches(4.50)
            self.set_shape_text(c_shape, [
                ("⚠️ Z ČVUT se známky na VŠCHT NEPŘENÁŠEJÍ automaticky!", 0, True, Pt(16), self.COLOR_RED),
                ("Vyučující na FITu zapíší hodnocení pouze do KOSu. Pokud následující krok neprovedete, známka se v SISu neobjeví a předmět nebude na VŠCHT uznán!", 1, False, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("📄 Postup v KOSu (kos.cvut.cz):", 0, True, Pt(16), self.COLOR_ORANGE),
                ("1. V levém menu klikněte na: Studium ➔ Dokumenty studia (neklikat na „Studijní výsledky“!).", 1, False, Pt(13), self.COLOR_DARK),
                ("2. V sekci SEZNAM ABSOLVOVANÝCH PŘEDMĚTŮ klikněte na modré tlačítko: Vygenerovat seznam předmětů (Česky).", 1, False, Pt(13), self.COLOR_DARK),
                ("3. Stáhněte vygenerovaný soubor Výpis absolvovaných předmětů - (CS) v PDF.", 1, True, Pt(13), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("📨 Odeslání na děkanát FCHT VŠCHT:", 0, True, Pt(16), self.COLOR_DARK),
                ("Stažené PDF zašlete e-mailem referentce Petře Kohoutové (Petra.Kohoutova@vscht.cz), případně odevzdejte osobně.", 1, True, Pt(13), self.COLOR_ORANGE),
            ])
        self.set_speaker_notes(slide, (
            "Pozor na tuto past: Když složíte zkoušku z PA1, učitel ji zapíše do KOSu. Jenže systémy VŠCHT a ČVUT "
            "nejsou propojené! Musíte v KOSu v Dokumentech studia vygenerovat PDF výpis a poslat ho referentce Petře Kohoutové, "
            "jinak vám VŠCHT kredity neuzná."
        ))

    def remake_slide_17(self, slide: Any) -> None:
        """Slide 17: Podmínky postupu, kredity & Krizový plán."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;230;p17":
                t_shape = s
            elif s.name == "Google Shape;231;p17":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("📊 Podmínky postupu, kredity & Krizový plán", 0, True, Pt(30), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.width = Inches(5.80)
            c_shape.height = Inches(4.70)
            self.set_shape_text(c_shape, [
                ("📈 Kreditová minima (výhradně v SISu VŠCHT):", 0, True, Pt(15), self.COLOR_ORANGE),
                ("• Postup do LS: min. 15 kreditů za ZS (aspoň 2 zkoušky)", 0, False, Pt(12), self.COLOR_DARK),
                ("• Postup do 2. ročníku: min. 45 kreditů z P a PV předmětů", 0, False, Pt(12), self.COLOR_DARK),
                ("• Bakalářské minimum: 180 kreditů + 4 zápočty z TV v prvních 5 semestrech!", 0, True, Pt(12), self.COLOR_DARK),
                ("", 0, False, Pt(3), None),
                ("🔁 Pravidla opakování:", 0, True, Pt(15), self.COLOR_DARK),
                ("Každý předmět i zkoušku lze zapsat max. 3× (1 řádný + 2 opravné termíny). Předmět lze opakovat pouze 1× v dalším roce.", 0, False, Pt(12), self.COLOR_MUTED),
                ("", 0, False, Pt(3), None),
                ("⚠️ Krizový plán (Rozložení vs. Šetření 3+1):", 0, True, Pt(15), self.COLOR_RED),
                ("• Rozložení ročníku: Zajděte včas na děkanát za Petrou Kohoutovou a požádejte o mimořádný studijní plán.", 0, False, Pt(12), self.COLOR_DARK),
                ("• Šetření bezplatné doby studia (3+1): Pokud nepostoupíte, ukončete studium včas — počítá se každý kalendářní den!", 0, True, Pt(12), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Pravidla postupu a záchranná brzda: Do léta potřebujete 15 kreditů, do druháku 45. Nezapomeňte na tělocviky! "
            "Pokud vidíte, že semestr nezvládáte, nečekejte na vyhazov a požádejte o rozložení ročníku. "
            "A pokud víte, že končíte, ukončete studium formálně hned — bezplatná doba studia je standardní doba + 1 rok (3+1) "
            "a počítá se každý kalendářní den zápisu!"
        ))

    def remake_slide_18(self, slide: Any) -> None:
        """Slide 18: Zázemí v kampusu & Stipendia."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;240;p18":
                t_shape = s
            elif s.name == "Google Shape;241;p18":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("🏛️ Zázemí v kampusu & Stipendia", 0, True, Pt(34), self.COLOR_DARK)
            ])
        if c_shape:
            c_shape.left = Inches(0.45)
            c_shape.top = Inches(2.20)
            c_shape.width = Inches(11.96)
            c_shape.height = Inches(4.90)
            self.set_shape_text(c_shape, [
                ("🏠 Klubovna B1322 (Budova B VŠCHT — náš ústav ÚICH):", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Otevřená studovna a klubovna vyhrazená pro bioinformatiky (studuj.bioinformatiku.cz / uich.vscht.cz/mapa).", 1, False, Pt(13), self.COLOR_DARK),
                ("Ideální místo na společné řešení Progtestu, konzultace se staršími spolužáky a odpočinek.", 1, True, Pt(13), self.COLOR_DARK),
                ("📚 NTK & Menzy:", 0, True, Pt(16), self.COLOR_DARK),
                ("NTK: Tichá patra pro hluboké studium, noční studovna, týmové konzultační místnosti i tisk z notebooku.", 1, False, Pt(13), self.COLOR_DARK),
                ("Menzy ČVUT: Technická (vedle NTK), Studentský dům, Masarykova kolej (platba kartou / Agáta). VŠCHT: Respirium v budově B, Bufan, Carbon.", 1, False, Pt(13), self.COLOR_DARK),
                ("💰 Stipendia pro studenty:", 0, True, Pt(16), self.COLOR_ORANGE),
                ("Ubytovací stipendium (cca 27–30 Kč/den): Nárok má každý student s trvalým bydlištěm mimo Prahu, podává se elektronicky v SISu.", 1, False, Pt(13), self.COLOR_DARK),
                ("Mimořádné prospěchové stipendium (40 000 Kč): Maturita v aktuálním roce, studijní průměr za 1. ročník < 1,20 a splnění všech povinností!", 1, True, Pt(13), self.COLOR_DARK),
            ])
        self.set_speaker_notes(slide, (
            "Využívejte klubovnu B1322 na ÚICH — je to naše domovská základna, kde starší studenti pravidelně sedí "
            "a rádi vám pomohou s Progtestem i chemií. Nezapomeňte si podat žádost o ubytovací stipendium v SISu "
            "a pro premianty: průměr pod 1.20 v prváku znamená stipendium 40 000 Kč!"
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
            "Rada starších ročníků: 1. ročník bioinformatiky je časově náročný jako plný pracovní úvazek (40+ hodin týdně). "
            "Pokud to jen trochu jde, neberte si v 1. semestru brigádu na víc než pár hodin o víkendu. "
            "Pravidelně vidíme, že lidé s velkými úvazky nestíhají týdenní deadliny v Progtestu a zbytečně končí."
        ))

    def remake_slide_20(self, slide: Any) -> None:
        """Slide 20: Kontrola e-mailů & BOZP školení."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;257;p20":
                t_shape = s
            elif s.name == "Google Shape;258;p20":
                c_shape = s

        if t_shape:
            self.set_shape_text(t_shape, [
                ("📨 Kontrola e-mailů & BOZP školení", 0, True, Pt(32), self.COLOR_DARK)
            ])
        if c_shape:
            self.set_shape_text(c_shape, [
                ("Máte dvě oficiální univerzitní schránky (čtěte obě denně!):", 0, True, Pt(17), self.COLOR_ORANGE),
                ("• jmeno.prijmeni@vscht.cz — oficiální komunikace fakulty, rozhodnutí děkana, stipendia", 0, False, Pt(14), self.COLOR_DARK),
                ("• username@fit.cvut.cz — výukový portál Courses, Progtest, materiály FITu", 0, False, Pt(14), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("💡 Zlatá rada: Nastavte si automatické přesměrování (forward) z obou schránek do jedné soukromé v mobilu!", 0, True, Pt(15), self.COLOR_DARK),
                ("", 0, False, Pt(4), None),
                ("🦺 Školení BOZP:", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Na VŠCHT se podepisuje při zápisu; na FIT ČVUT probíhá e-learningem a následným fyzickým podpisem prezenční listiny.", 0, False, Pt(14), self.COLOR_DARK),
                ("Během semestru vám přijde e-mailem výzva k podpisu — kdo nepodepíše, tomu zablokují přístup do učeben FITu!", 0, True, Pt(14), self.COLOR_RED),
            ])
        self.set_speaker_notes(slide, (
            "Důležité: Každý máte dvě adresy. Nastavte si přesměrování do jedné schránky, kterou denně čtete. "
            "Na FIT mail vám přijde například výzva k fyzickému podpisu BOZP školení — kdo nepodepíše, tomu zablokují přístup do učeben!"
        ))

    def remake_slide_21(self, slide: Any) -> None:
        """Slide 21: Komunita & Akce ÚICH (1:1 z wiki)."""
        t_shape = None
        c_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;264;g3fa8c97192b_0_0":
                if s.has_text_frame:
                    s.text_frame.text = ""
            elif s.name == "Google Shape;266;g3fa8c97192b_0_0":
                t_shape = s
            elif s.name == "Google Shape;267;g3fa8c97192b_0_0":
                c_shape = s
            elif s.has_text_frame and s.name.startswith("Google Shape;26"):
                s.text_frame.text = ""

        if t_shape:
            self.set_shape_text(t_shape, [
                ("💬 Komunita & Akce ÚICH: Propojte se s námi!", 0, True, Pt(32), self.COLOR_DARK)
            ])

        if c_shape:
            c_shape.left = Inches(1.19)
            c_shape.top = Inches(2.10)
            c_shape.width = Inches(10.94)
            c_shape.height = Inches(4.90)

            self.set_shape_text(c_shape, [
                ("💬 Discord BioCord (discord.gg/yWxFJmM6Qg):", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Hlavní oficiální komunikační kanál ústavu a spolužáků — nastavte si civilní Jméno a Příjmení!", 1, False, Pt(14), self.COLOR_DARK),
                ("🎒 Bioinformatické vítání prváků (první listopadová sobota):", 0, True, Pt(17), self.COLOR_ORANGE),
                ("Celodenní pěší výlet studentů všech ročníků a vyučujících ÚICH do přírody — nejrychlejší cesta k neocenitelným radám ke zkouškám a kontaktům!", 1, False, Pt(14), self.COLOR_DARK),
                ("🔬 SVK — Studentská vědecká konference (konec listopadu):", 0, True, Pt(17), self.COLOR_DARK),
                ("Celoškolní den studentské vědy spojený s rektorským volnem — skvělá inspirace pro budoucí bakalářku.", 1, False, Pt(14), self.COLOR_MUTED),
                ("🎄 Vánoční večírek ÚICH (polovina prosince):", 0, True, Pt(17), self.COLOR_DARK),
                ("Neformální setkání studentů a vyučujících v klubovně B1322 před začátkem zkouškového.", 1, False, Pt(14), self.COLOR_MUTED),
                ("📝 Studentské ankety (konec semestru):", 0, True, Pt(17), self.COLOR_DARK),
                ("Anketa v SISu (VŠCHT), Anketa v KOSu (ČVUT) i Oborová anketa ÚICH — v malém oboru má každý hlas reálnou váhu!", 1, False, Pt(13), self.COLOR_MUTED),
            ])

        self.set_speaker_notes(slide, (
            "Připojte se na BioCord a určitě doražte na listopadové Vítání prváků! "
            "Je to celodenní pěší výlet s vyučujícími a staršími studenty do přírody — zeptejte se jich na cokoliv ohledně zkoušek, "
            "vyučujících i jednotlivých předmětů. Pravidelní účastníci komunitních akcí mají statisticky nejvyšší úspěšnost dokončení studia!"
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
