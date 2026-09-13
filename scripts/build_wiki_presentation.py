#!/usr/bin/env python3
"""Build the comprehensive bioinformatics freshman presentation based 1:1 on wiki content.

This script remakes the presentation with primary focus on BI-PA1, full 1:1 fidelity
to the wiki guide (zacatek-semestru-prvak.md), clean structured tables, rich speaker
notes, and preserved original memes and graphics.
"""

from pathlib import Path
from typing import List

import pptx
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt


class StylePalette:
    """Color palette and typography constants for the presentation."""

    COLOR_TITLE: RGBColor = RGBColor(15, 23, 42)       # Slate 900
    COLOR_PRIMARY: RGBColor = RGBColor(30, 41, 59)     # Slate 800
    COLOR_MUTED: RGBColor = RGBColor(71, 85, 105)      # Slate 600
    COLOR_ACCENT: RGBColor = RGBColor(220, 38, 38)     # Red 600 (warnings, alerts)
    COLOR_BLUE: RGBColor = RGBColor(37, 99, 235)       # Blue 600
    COLOR_GREEN: RGBColor = RGBColor(22, 163, 74)      # Green 600
    COLOR_CARD_BG: RGBColor = RGBColor(248, 250, 252)  # Slate 50
    COLOR_WHITE: RGBColor = RGBColor(255, 255, 255)

    FONT_FAMILY: str = "Calibri"
    FONT_TITLE_FAMILY: str = "Calibri Light"


class WikiPresentationBuilder:
    """Builder for transforming the freshman presentation to 1:1 wiki content."""

    def __init__(self, template_path: Path) -> None:
        """Initialize the builder with the template presentation.

        Args:
            template_path: Path to the original backup presentation.
        """
        self.template_path: Path = template_path
        self.prs: pptx.Presentation = pptx.Presentation(str(template_path))

    def _clear_text_boxes(self, slide: pptx.slide.Slide) -> None:
        """Clear text content from existing text frames on a slide."""
        for shape in slide.shapes:
            if shape.has_text_frame:
                tf = shape.text_frame
                tf.word_wrap = True
                for p in tf.paragraphs:
                    p.text = ""

    def _add_or_get_title(
        self, slide: pptx.slide.Slide, title_text: str, left: float = 0.8, top: float = 0.5, width: float = 11.7, height: float = 1.0
    ) -> pptx.text.text.TextFrame:
        """Set or create a prominent slide title."""
        title_shape = None
        for shape in slide.shapes:
            if shape.has_text_frame and shape.top < Inches(2.0) and shape.width > Inches(6.0):
                title_shape = shape
                break

        if title_shape is None:
            title_shape = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))

        tf = title_shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.1)
        tf.margin_right = Inches(0.1)
        tf.margin_top = Inches(0.1)
        tf.margin_bottom = Inches(0.1)

        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = StylePalette.FONT_TITLE_FAMILY
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = StylePalette.COLOR_TITLE
        return tf

    def _format_bullet_run(
        self,
        paragraph: pptx.text.text._Paragraph,
        prefix_bold: str,
        text: str,
        size_pt: float = 14,
        color: RGBColor = StylePalette.COLOR_PRIMARY,
        level: int = 0
    ) -> None:
        """Format a paragraph with an optional bold prefix and body text."""
        paragraph.text = ""
        paragraph.level = level
        paragraph.space_after = Pt(4)
        paragraph.space_before = Pt(2)

        if prefix_bold:
            r_bold = paragraph.add_run()
            r_bold.text = prefix_bold
            r_bold.font.name = StylePalette.FONT_FAMILY
            r_bold.font.size = Pt(size_pt)
            r_bold.font.bold = True
            r_bold.font.color.rgb = StylePalette.COLOR_TITLE

        if text:
            r_text = paragraph.add_run()
            r_text.text = text
            r_text.font.name = StylePalette.FONT_FAMILY
            r_text.font.size = Pt(size_pt)
            r_text.font.bold = False
            r_text.font.color.rgb = color

    def _set_speaker_notes(self, slide: pptx.slide.Slide, notes: str) -> None:
        """Set speaker notes for a slide."""
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes.strip()

    def _create_table(
        self,
        slide: pptx.slide.Slide,
        rows: int,
        cols: int,
        left: float,
        top: float,
        width: float,
        height: float,
        col_widths: List[float],
        headers: List[str],
        data: List[List[str]],
        font_size_pt: float = 12
    ) -> pptx.shapes.graphfrm.GraphicFrame:
        """Create a cleanly styled table."""
        table_shape = slide.shapes.add_table(rows, cols, Inches(left), Inches(top), Inches(width), Inches(height))
        table = table_shape.table

        for i, w in enumerate(col_widths):
            table.columns[i].width = Inches(w)

        # Header row
        for col_idx, h_text in enumerate(headers):
            cell = table.cell(0, col_idx)
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.08)
            cell.margin_top = Inches(0.06)
            cell.margin_bottom = Inches(0.06)
            cell.fill.solid()
            cell.fill.fore_color.rgb = StylePalette.COLOR_TITLE
            p = cell.text_frame.paragraphs[0]
            p.text = h_text
            p.font.name = StylePalette.FONT_FAMILY
            p.font.size = Pt(font_size_pt + 1)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_WHITE
            p.alignment = PP_ALIGN.LEFT

        # Data rows
        for row_idx, row_data in enumerate(data):
            for col_idx, cell_value in enumerate(row_data):
                cell = table.cell(row_idx + 1, col_idx)
                cell.margin_left = Inches(0.08)
                cell.margin_right = Inches(0.08)
                cell.margin_top = Inches(0.06)
                cell.margin_bottom = Inches(0.06)
                cell.fill.solid()
                if row_idx % 2 == 1:
                    cell.fill.fore_color.rgb = StylePalette.COLOR_CARD_BG
                else:
                    cell.fill.fore_color.rgb = StylePalette.COLOR_WHITE

                p = cell.text_frame.paragraphs[0]
                p.text = cell_value
                p.font.name = StylePalette.FONT_FAMILY
                p.font.size = Pt(font_size_pt)
                p.font.color.rgb = StylePalette.COLOR_PRIMARY
                if col_idx == 0:
                    p.font.bold = True

        return table_shape

    def build_slide_1(self) -> None:
        """Slide 1: Title slide."""
        slide = self.prs.slides[0]
        self._clear_text_boxes(slide)

        title_shape = None
        subtitle_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;91;p1":
                title_shape = s
            elif s.name == "Google Shape;92;p1":
                subtitle_shape = s

        if title_shape and title_shape.has_text_frame:
            tf = title_shape.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = "🎒 Průvodce prváka: Bioinformatika"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(34)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

            p2 = tf.add_paragraph()
            p2.text = "Začátek 1. semestru (VŠCHT Praha & FIT ČVUT)"
            p2.font.name = StylePalette.FONT_FAMILY
            p2.font.size = Pt(20)
            p2.font.bold = True
            p2.font.color.rgb = StylePalette.COLOR_ACCENT
            p2.space_before = Pt(8)

        if subtitle_shape and subtitle_shape.has_text_frame:
            tf = subtitle_shape.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            self._format_bullet_run(p, "🏛️ Dvojí studium: ", "VŠCHT (domov & SIS) vs. FIT ČVUT (smluvní výuka informatiky)", size_pt=14)
            p2 = tf.add_paragraph()
            self._format_bullet_run(p2, "⚡ Checklist 2 týdnů: ", "Karty, vstupy na ČVUT, Usermap, eduroam, NTK a BioCord", size_pt=14)
            p3 = tf.add_paragraph()
            self._format_bullet_run(p3, "🌐 Školní systémy: ", "Kde sledovat rozvrh a proč ignorovat chybové e-maily z KOSu", size_pt=14)
            p4 = tf.add_paragraph()
            self._format_bullet_run(p4, "💻 The Great Filter: ", "Hloubkový survival průvodce programováním v BI-PA1", size_pt=14)

        self._set_speaker_notes(
            slide,
            "Ahoj a vítejte na bioinformatice! Tento průvodce vychází 1:1 z naší oficiální studentské wiki "
            "a shrnuje vše, co potřebujete vědět na začátku 1. semestru. Propojujeme chemii a biologii na VŠCHT "
            "s informatikou na FIT ČVUT. Dnes vám ukážeme, jak bezpečně zvládnout administrativu, zorientovat se v systémech "
            "a především jak projít nejtěžším sítem prvního ročníku – předmětem BI-PA1. Projděte si také celoškolského "
            "PDF průvodce od PKC VŠCHT!"
        )

    def build_slide_2(self) -> None:
        """Slide 2: Co vlastně studuješ."""
        slide = self.prs.slides[1]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;100;p2":
                title_shape = s
            elif s.name == "Google Shape;101;p2":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            tf = title_shape.text_frame
            p = tf.paragraphs[0]
            p.text = "„Hele, co že to vlastně studuješ?“"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            p0 = tf.paragraphs[0]
            self._format_bullet_run(p0, "Oficiální definice pro rodinu a babičku:", "", size_pt=15)
            p1 = tf.add_paragraph()
            self._format_bullet_run(p1, "", "„Chemie a biologie v počítačích“ (= chemoinformatika & bioinformatika)", size_pt=14, color=StylePalette.COLOR_MUTED)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(12)
            self._format_bullet_run(p2, "Skutečná realita studia:", "", size_pt=15)
            p3 = tf.add_paragraph()
            self._format_bullet_run(p3, "• ", "Unikátní mezioborový program spojující VŠCHT Praha (FCHT) a FIT ČVUT.", size_pt=14)
            p4 = tf.add_paragraph()
            self._format_bullet_run(p4, "• ", "Jste plnohodnotnými studenty VŠCHT a na FIT docházíte na špičkovou informatiku.", size_pt=14)
            p5 = tf.add_paragraph()
            self._format_bullet_run(p5, "• ", "Prošli jsme přesně tím samým – rádi vám s čímkoliv pomůžeme a poradíme!", size_pt=14)

        self._set_speaker_notes(
            slide,
            "Tento slajd je o dvou věcech: zaprvé, co říct rodině a babičce, když se zeptají, co že je to ta bioinformatika. "
            "Zadruhé, že jsme si tím vším prošli také, víme, kde to bolí, a rádi vám pomůžeme. Jsme v tom společně!"
        )

    def build_slide_3(self) -> None:
        """Slide 3: Checklist prvních dvou týdnů (Karty a vstupy)."""
        slide = self.prs.slides[2]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;110;p3":
                title_shape = s
            elif s.name == "Google Shape;111;p3":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "⚡ Checklist prvních 2 týdnů: Karty, vstupy & účty"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "💬 Discord BioCord (discord.gg/yWxFJmM6Qg): ", "Připojte se hned v prvních dnech a nastavte si civilní Jméno Příjmení (hlavní oficiální komunikační kanál ústavu a spolužáků).", size_pt=13)

            p2 = tf.add_paragraph()
            self._format_bullet_run(p2, "💳 Karta VŠCHT / ISIC: ", "Karta se nevydává při zápisu! Je nutné si ji osobně vyzvednout v Kartovém centru VŠCHT v budově B (fotka vám zůstává po celé studium).", size_pt=13)

            p3 = tf.add_paragraph()
            self._format_bullet_run(p3, "🚪 Aktivace vstupu na ČVUT (Vydavatelství průkazů ČVUT u NTK): ", "", size_pt=13)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • Kdy jít: ", "Výhradně v 1. týdnu výuky na VŠCHT (dříve systém ČVUT studenta nerozpozná, později jsou obří fronty). Rezervujte si termín online!", size_pt=13, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • Co zařídíte: ", "Nahrání vstupu do budov FITu na kartu VŠCHT + vydání iniciálního hesla ČVUT.", size_pt=13, level=1)

            p4 = tf.add_paragraph()
            self._format_bullet_run(p4, "🔑 Trvalé heslo ČVUT: ", "Na portálu Usermap ČVUT (usermap.cvut.cz) zadejte iniciální heslo a nastavte si své trvalé hlavní heslo.", size_pt=13)

            p5 = tf.add_paragraph()
            self._format_bullet_run(p5, "🚆 Lítačka (PID): ", "Potvrzení o studiu si stáhněte elektronicky ze SISu VŠCHT a nahrajte do aplikace PID Lítačka pro slevu na jízdném.", size_pt=13)

        self._set_speaker_notes(
            slide,
            "Klíčové časování: VŠCHT začíná o týden dříve než FIT ČVUT! Využijte tento první týden a zajděte do Vydavatelství "
            "průkazů ČVUT u NTK. V druhém týdnu začíná výuka na ČVUT a budou tam stát stovky studentů v obřích frontách. "
            "Na ČVUT vám na kartu VŠCHT nahrají čip pro vstup a dají iniciální heslo, které si v Usermapu změníte na trvalé."
        )

    def build_slide_4(self) -> None:
        """Slide 4: Dvě univerzity (VŠCHT vs. FIT ČVUT)."""
        slide = self.prs.slides[3]
        self._clear_text_boxes(slide)

        title_shape = None
        left_shape = None
        right_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;118;p4":
                title_shape = s
            elif s.name == "Google Shape;119;p4":
                left_shape = s
            elif s.name == "Google Shape;120;p4":
                right_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "🏛️ Dvě univerzity: Jak funguje dvojí studium (VŠCHT vs. FIT)"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        # Left Column: VSCHT
        if left_shape and left_shape.has_text_frame:
            tf = left_shape.text_frame
            tf.word_wrap = True
            left_shape.left = Inches(0.8)
            left_shape.top = Inches(1.8)
            left_shape.width = Inches(5.7)
            left_shape.height = Inches(5.2)

            p0 = tf.paragraphs[0]
            self._format_bullet_run(p0, "🏛️ VŠCHT (Domovská univerzita):", "", size_pt=15)

            p1 = tf.add_paragraph()
            self._format_bullet_run(p1, "• Formální příslušnost: ", "Jste řádnými studenty výhradně VŠCHT Praha (Fakulta chemické technologie – FCHT). Řídíte se Studijním řádem VŠCHT.", size_pt=13)

            p2 = tf.add_paragraph()
            self._format_bullet_run(p2, "• Jediný oficiální systém: ", "SIS VŠCHT (student.vscht.cz) je jediný právně závazný index pro kredity, zkoušky a postup.", size_pt=13)

            p3 = tf.add_paragraph()
            self._format_bullet_run(p3, "• Studijní referentka FCHT VŠCHT:", "", size_pt=13)
            p3_sub = tf.add_paragraph()
            self._format_bullet_run(p3_sub, "  Petra Kohoutová ", "(Petra.Kohoutova@vscht.cz) — potvrzení o studiu, žádosti, stipendia, rozložení ročníku.", size_pt=12, level=1)

            p4 = tf.add_paragraph()
            self._format_bullet_run(p4, "• Garant: ", "Dr. Martin Šícho | ", size_pt=12)
            r_taj = p4.add_run()
            r_taj.text = "Tajemník: Ing. Jiří Znamenáček"
            r_taj.font.size = Pt(12)
            r_taj.font.bold = True

        # Right Column: FIT CVUT
        if right_shape and right_shape.has_text_frame:
            tf = right_shape.text_frame
            tf.word_wrap = True
            right_shape.left = Inches(6.8)
            right_shape.top = Inches(1.8)
            right_shape.width = Inches(5.7)
            right_shape.height = Inches(5.2)

            p0 = tf.paragraphs[0]
            self._format_bullet_run(p0, "💻 FIT ČVUT (Smluvní výuka):", "", size_pt=15)

            p1 = tf.add_paragraph()
            self._format_bullet_run(p1, "• Smluvní výuka: ", "Na FIT ČVUT docházíte pouze na výuku svých informatických předmětů.", size_pt=13)

            p2 = tf.add_paragraph()
            self._format_bullet_run(p2, "• Rozvrh 1. ročníku: ", "Máte pevně zarezervován! V KOSu nic nezapisujete ani neměníte (výběr paralelek je až od 2. ročníku).", size_pt=13)

            p3 = tf.add_paragraph()
            self._format_bullet_run(p3, "• 🛑 Ignorujte chybové e-maily z KOSu! ", "Hlášení typu „nemáte dost kreditů“ ignorujte — KOS nevidí vaše studium na VŠCHT!", size_pt=13, color=StylePalette.COLOR_ACCENT)

            p4 = tf.add_paragraph()
            self._format_bullet_run(p4, "• Studijní referentka FIT pro bioinformatiky:", "", size_pt=13)
            p4_sub = tf.add_paragraph()
            self._format_bullet_run(p4_sub, "  Zdeňka Kutinová ", "(zdenka.kutinova@fit.cvut.cz) — zápisy do KOSu, kapacitní výjimky, kolize v rozvrhu a přístupy.", size_pt=12, level=1)

        self._set_speaker_notes(
            slide,
            "Dvě univerzity vedle sebe: Na VŠCHT jste doma, vaše studium a kredity se řídí výhradně SISem. "
            "Na FIT docházíte na špičkovou informatiku. V 1. ročníku máte cvičení na FITu předem rezervována. "
            "KOS vám bude posílat automatické e-maily, že nemáte zapsaný minimální počet kreditů — ignorujte je, "
            "KOS nevidí vaše předměty na VŠCHT! Referentky Petra Kohoutová (VŠCHT) a Zdeňka Kutinová (FIT) vám vyjdou vstříc."
        )

    def build_slide_5(self) -> None:
        """Slide 5: Checklist prvních dvou týdnů (Sítě, NTK a bezpečnost)."""
        slide = self.prs.slides[4]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;128;p5":
                title_shape = s
            elif s.name == "Google Shape;129;p5":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "⚡ Checklist prvních 2 týdnů: Sítě, NTK & bezpečnost"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "📶 Wi-Fi připojení (eduroam): ", "", size_pt=14)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • VŠCHT: ", "Stáhněte si bezpečnostní certifikát z webu Výpočetního centra VŠCHT (vc.vscht.cz/navody/sit/wi-fi).", size_pt=13, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • FIT ČVUT: ", "V profilu na Usermap ČVUT si nastavte SPECIÁLNÍ SÍŤOVÉ HESLO (pozor: je odlišné od hesla do KOSu!).", size_pt=13, color=StylePalette.COLOR_ACCENT, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(8)
            self._format_bullet_run(p2, "📚 Registrace v NTK (Národní technická knihovna): ", "Zaregistrujte si ISIC / kartu VŠCHT u zákaznického pultu v NTK (online předregistrace na techlib.cz ušetří čas) — získáte přístup k Wi-Fi, tiskárnám, výpůjčkám i do noční studovny.", size_pt=13)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(8)
            self._format_bullet_run(p3, "📨 Forward e-mailů do soukromé schránky: ", "Nastavte si automatické přesměrování z obou univerzitních schránek (jmeno.prijmeni@vscht.cz i username@fit.cvut.cz) do jedné soukromé schránky, kterou čtete denně.", size_pt=13)

            p4 = tf.add_paragraph()
            p4.space_before = Pt(8)
            self._format_bullet_run(p4, "🦺 BOZP školení: ", "Na VŠCHT se podepisuje při zápisu; na FITu probíhá e-learningem a následným fyzickým podpisem (v průběhu semestru vám přijde e-mailem výzva k podpisu).", size_pt=13)

        self._set_speaker_notes(
            slide,
            "Pozor na časté pasti: Wi-Fi na FITu vyžaduje síťové heslo z Usermapu, nikoliv heslo do KOSu! "
            "Registraci v NTK neodkládejte – noční studovna v NTK vám v prosinci zachrání život. "
            "A nezapomeňte na forward obou e-mailů, ať vám neuteče výzva k podpisu BOZP na FITu."
        )

    def build_slide_6(self) -> None:
        """Slide 6: Rozcestník školních systémů (Table)."""
        slide = self.prs.slides[5]
        self._clear_text_boxes(slide)

        self._add_or_get_title(slide, "🌐 Rozcestník školních systémů: VŠCHT vs. FIT ČVUT", left=0.8, top=0.4, width=11.7, height=0.8)

        headers = ["Agenda", "Systémy VŠCHT (student.vscht.cz)", "Systémy FIT ČVUT (fit.cvut.cz)"]
        data = [
            ["Zápisy & Výsledky", "SIS VŠCHT — oficiální index, kredity, zkoušky", "KOS ČVUT — rozvrh na FITu & Timetable FIT"],
            ["Výukové portály", "Moodle VŠCHT — slajdy, materiály z přednášek", "Courses FIT — výukové materiály a zadání ze cvičení"],
            ["Programování (C)", "—", "Progtest (progtest.fit.cvut.cz) — odevzdávání úloh"],
            ["Cvičebnice & Zkoušky", "studuj.bioinformatiku.cz — plány & klubovna B1322", "Trainer KSI (cvičebnice C) + FIT-Wiki (archiv zkoušek)"],
            ["Navigace po kampusu", "Mapy Emil VŠCHT (emil.vscht.cz/maps)", "FIT Help & Navigace (help.fit.cvut.cz)"]
        ]
        col_widths = [2.2, 4.6, 4.9]
        self._create_table(slide, rows=6, cols=3, left=0.8, top=1.4, width=11.7, height=5.2, col_widths=col_widths, headers=headers, data=data, font_size_pt=12)

        self._set_speaker_notes(
            slide,
            "Tento rozcestník si uložte do záložek. Všechny studijní povinnosti, index a oficiální kredity sledujete v SISu VŠCHT. "
            "Na FITu slouží Courses pro studijní materiály, Trainer KSI na procvičování syntaxe C a Progtest pro odevzdávání kódu. "
            "FIT-Wiki je neocenitelný archiv minulých zkouškových písemek!"
        )

    def build_slide_7(self) -> None:
        """Slide 7: Harmonogram & časové anomálie."""
        slide = self.prs.slides[6]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;144;p7":
                title_shape = s
            elif s.name == "Google Shape;146;p7":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "🕒 Harmonogram & časové anomálie v semestru"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.width = Inches(5.8)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "⏳ Posun začátku výuky v ZS:", "", size_pt=14)
            p1_sub = tf.add_paragraph()
            self._format_bullet_run(p1_sub, "  • ", "VŠCHT začíná o TÝDEN DŘÍVE než FIT ČVUT. V 1. týdnu máte výuku jen na VŠCHT — ideální čas vyřídit karty na ČVUT bez front!", size_pt=12, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(6)
            self._format_bullet_run(p2, "🔄 Lichý vs. sudý týden:", "", size_pt=14)
            p2_sub = tf.add_paragraph()
            self._format_bullet_run(p2_sub, "  • ", "Některá laboratorní a počítačová cvičení běží jen jednou za 14 dní (pozor na lichý/sudý týden v kalendáři).", size_pt=12, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(6)
            self._format_bullet_run(p3, "🗓️ Kompenzace státních svátků:", "", size_pt=14)
            p3_sub = tf.add_paragraph()
            self._format_bullet_run(p3_sub, "  • ", "Určitý den se vyučuje podle rozvrhu jiného dne (např. pátek se učí podle pondělního rozvrhu).", size_pt=12, level=1)

            p4 = tf.add_paragraph()
            p4.space_before = Pt(6)
            self._format_bullet_run(p4, "🚫 Rozdílná rektorská a děkanská volna:", "", size_pt=14)
            p4_sub = tf.add_paragraph()
            self._format_bullet_run(p4_sub, "  • ", "Volno na VŠCHT neplatí na FITu a naopak! Pokud má jedna škola volno, na druhé výuka normálně běží.", size_pt=12, color=StylePalette.COLOR_ACCENT, level=1)

            p5 = tf.add_paragraph()
            p5.space_before = Pt(6)
            self._format_bullet_run(p5, "🎓 Imatrikulace VŠCHT:", "", size_pt=14)
            p5_sub = tf.add_paragraph()
            self._format_bullet_run(p5_sub, "  • ", "Slavnostní zahájení studia — výuka na VŠCHT odpadá, je vyžadován společenský oděv.", size_pt=12, level=1)

        self._set_speaker_notes(
            slide,
            "Dvojí studium znamená dva různé akademické kalendáře. Vždy ověřujte, zda má volno VŠCHT nebo FIT ČVUT. "
            "A využijte první týden semestru, kdy FIT ještě neučí – ušetříte si spoustu času při zařizování karet a účtů."
        )

    def build_slide_8(self) -> None:
        """Slide 8: Rozvrh na FIT a Past KOSu."""
        slide = self.prs.slides[7]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;153;p8":
                title_shape = s
            elif s.name == "Google Shape;154;p8":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "⚠️ Rozvrh na FIT ČVUT a „Past KOSu“"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.top = Inches(1.8)
            body_shape.left = Inches(0.8)
            body_shape.width = Inches(6.5)
            body_shape.height = Inches(5.2)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🔒 Rozvrh v 1. ročníku máte plně zajištěn:", "", size_pt=15)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • ", "V 1. i 2. semestru jsou všechna cvičení na FITu pro bioinformatiky PEVNĚ ZAREZERVOVÁNA.", size_pt=13, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • ", "V KOSu nic nezapisujete ani neměníte — vlastní tvorbu rozvrhu řešíte až od 2. ročníku.", size_pt=13, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(10)
            self._format_bullet_run(p2, "🛑 Ignorujte chybové e-maily z KOSu!:", "", size_pt=15, color=StylePalette.COLOR_ACCENT)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • ", "Automatická hlášení typu „vaše paralelka není otevřená“, „nemáte zapsán minimální počet kreditů“ ignorujte.", size_pt=13, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  • ", "KOS nevidí vaše studium na VŠCHT! Jediným závazným ukazatelem kreditů je SIS VŠCHT.", size_pt=13, color=StylePalette.COLOR_ACCENT, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(10)
            self._format_bullet_run(p3, "🚪 Přednášky na FIT ČVUT:", "", size_pt=15)
            p3_sub = tf.add_paragraph()
            self._format_bullet_run(p3_sub, "  • ", "Docházka na přednáškách se nekontroluje. Můžete navštěvovat libovolnou paralelku, která nekoliduje s VŠCHT. Kódy předmětů FITu v SISu začínají B500xxx.", size_pt=13, level=1)

        self._set_speaker_notes(
            slide,
            "Na tento slajd pamatujte, až vám v říjnu přijde výhružný e-mail z KOSu. Systém ČVUT si myslí, že nemáte zapsáno "
            "dost kreditů, protože nevidí chemii a matiku na VŠCHT. Není to chyba, vše máte zarezervováno. "
            "Přednášky můžete flexibilně střídat podle rozvrhu na VŠCHT."
        )

    def build_slide_9(self) -> None:
        """Slide 9: The Great Filter: Tři pilíře 1. semestru."""
        slide = self.prs.slides[8]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;164;p9":
                title_shape = s
            elif s.name == "Google Shape;165;p9":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "📊 The Great Filter: Tři pilíře 1. semestru"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🎯 Tři 8kreditové předměty (celkem 24 z 30 kreditů semestru):", "", size_pt=15)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  1. BI-PA1: ", "Programování a algoritmizace 1 (8 kreditů, FIT ČVUT) — hlavní síto ročníku", size_pt=13, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  2. Matematika A: ", "Diferenciální a integrální počet (8 kreditů, VŠCHT)", size_pt=13, level=1)
            p1_sub3 = tf.add_paragraph()
            self._format_bullet_run(p1_sub3, "  3. OACH I: ", "Obecná a anorganická chemie 1 (8 kreditů, VŠCHT)", size_pt=13, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(12)
            self._format_bullet_run(p2, "⚡ Strategie prvních 7 týdnů (Zápočty z Matiky a Chemie):", "", size_pt=15)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • Klíč k prosinci: ", "Kolem 6. týdne se píší 1. zápočtové testy z Matematiky A i Chemie I.", size_pt=13, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  • Podstatně jednodušší: ", "První testy jsou mnohem snazší než druhé prosincové. V součtu potřebujete > 50 % bodů!", size_pt=13, level=1)
            p2_sub3 = tf.add_paragraph()
            self._format_bullet_run(p2_sub3, "  • Bodový polštář: ", "Nasbírejte v 1. testech maximum bodů — vytvoříte si klíčový polštář a v prosinci se můžete plně soustředit na gradující úlohy v PA1.", size_pt=13, color=StylePalette.COLOR_BLUE, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(10)
            self._format_bullet_run(p3, "📌 Poznámka ke studiu Matiky a OACH: ", "Konkrétní studijní doporučení, sbírky příkladů a podklady najdete přímo v jejich kapitolách na naší wiki. Zde se plně soustředíme na BI-PA1!", size_pt=12, color=StylePalette.COLOR_MUTED)

        self._set_speaker_notes(
            slide,
            "Tyto 3 předměty tvoří 80 % kreditů semestru. Z chemie a matiky se kolem 6. týdne píší první zápočty – "
            "věnujte jim energii, protože jsou znatelně jednodušší než ty prosincové. Když v nich získáte přes 80 % bodů, "
            "v prosinci už máte splněno a můžete se plně vrhnout na finální progtestové úlohy. "
            "Konkrétní tipy k chemii a matice najdete na jejich kapitolách na wiki."
        )

    def build_slide_10(self) -> None:
        """Slide 10: BI-PA1: Proč je to hlavní síto & zimní past."""
        slide = self.prs.slides[9]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;172;p10":
                title_shape = s
            elif s.name == "Google Shape;174;p10":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "💻 BI-PA1: Proč je to hlavní síto & zimní past"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.width = Inches(5.8)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🚨 VYUČUJE SE VÝHRADNĚ V ZIMNÍM SEMESTRU!:", "", size_pt=14, color=StylePalette.COLOR_ACCENT)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • ", "V letním semestru se BI-PA1 vůbec neotvírá. Pokud ji neuděláte, musíte čekat CELÝ ROK!", size_pt=13, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(8)
            self._format_bullet_run(p2, "💣 Brutální kumulace ve 3. semestru:", "", size_pt=14)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • ", "Při opakování byste museli ve 3. semestru dělat naráz: opakovanou PA1 + BI-AX1 + Python + Biochemie + Fyzikální chemie!", size_pt=12, color=StylePalette.COLOR_ACCENT, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(8)
            self._format_bullet_run(p3, "🔗 Návaznost celého informatického řetězce:", "", size_pt=14)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • ", "BI-PA1 (C) ➔ BI-PJA (Java v LS) ➔ BI-AX1 + Python (ZS) ➔ BI-AAG (Automaty a gramatiky)", size_pt=12, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • ", "Ztratit tempo v PA1 znamená ohrozit celé další studium informatiky.", size_pt=12, level=1)

        self._set_speaker_notes(
            slide,
            "Proč se tolik soustředíme na PA1? Protože chemie a matika se dají v případě nutnosti zopakovat mnohem flexibilněji. "
            "PA1 ale běží POUZE v zimě a podmiňuje celou informatickou větev. Pokud PA1 neuděláte, ve 3. semestru vás čeká "
            "vražedná kombinace se síťovkou BI-AX1 a těžkými chemickými předměty. Udělat PA1 napoprvé je absolutní priorita!"
        )

    def build_slide_11(self) -> None:
        """Slide 11: BI-PA1: Programátorský základ (Klíčová slova v C)."""
        slide = self.prs.slides[10]
        self._clear_text_boxes(slide)

        self._add_or_get_title(slide, "💻 BI-PA1: Programátorský základ (Klíčová slova v C)", left=0.8, top=0.4, width=11.7, height=0.8)

        headers = ["Kategorie", "Klíčová slova v C", "Význam a praktické využití"]
        data = [
            ["Datové typy", "char, int, float, double, void", "Celočíselné a reálné hodnoty, znaky, prázdný návratový typ"],
            ["Modifikátory", "short, long, signed, unsigned", "Rozsah velikosti a znaménko číselných proměnných"],
            ["Řízení toku", "if, else, switch, case, default, break", "Podmíněné větvení programu a rozhodovací logické bloky"],
            ["Smyčky (cykly)", "for, while, do, continue", "Opakování bloků kódu, iterace přes pole a datové struktury"],
            ["Uživatelské typy", "struct, union, enum, typedef", "Sdružování proměnných do struktur a definice vlastních aliasů"],
            ["Ukazatele / Paměť", "* (dereference / pointer), & (adresa)", "Přímá práce s adresami v RAM a dynamicky alokovanou pamětí"],
            ["Ostatní", "return, const", "Návrat hodnoty z funkce, deklarace neměnných konstant"]
        ]
        col_widths = [2.2, 4.0, 5.5]
        self._create_table(slide, rows=8, cols=3, left=0.8, top=1.3, width=11.7, height=5.3, col_widths=col_widths, headers=headers, data=data, font_size_pt=11)

        self._set_speaker_notes(
            slide,
            "Tato tabulka shrnuje základy syntaxe C z naší wiki. Zkuste si otestovat, jestli dokážete vlastními slovy vysvětlit "
            "každé z těchto klíčových slov. Konkrétní syntaxi vám rád vysvětlí jakýkoliv AI asistent. Pokud bezpečně rozumíte těmto "
            "kategoriím, máte pevný základ pro zvládnutí cvičení i Progtestu."
        )

    def build_slide_12(self) -> None:
        """Slide 12: Fullscreen programming meme (Kept from original)."""
        slide = self.prs.slides[11]
        self._set_speaker_notes(
            slide,
            "Trocha programátorského oddechu: Každý začínající programátor si tím projde. "
            "Když program konečně zkompilujete bez chyb, je to skvělý pocit – ale v C teprve začíná ladění logiky a práce s pamětí!"
        )

    def build_slide_13(self) -> None:
        """Slide 13: Hardware & Linux: Zlaté pravidlo začátku."""
        slide = self.prs.slides[12]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;194;p13":
                title_shape = s
            elif s.name == "Google Shape;193;p13":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "💡 Hardware & Linux: Zlaté pravidlo začátku"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🛑 Největší past začátku semestru:", "", size_pt=15, color=StylePalette.COLOR_ACCENT)
            p1_sub = tf.add_paragraph()
            self._format_bullet_run(p1_sub, "  • ", "Zaseknout se na celé dny na instalaci Linuxu, konfiguraci editoru a barvičkách terminálu — a mezitím propásnout první deadliny v Progtestu!", size_pt=13, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(10)
            self._format_bullet_run(p2, "💡 ZLATÉ PRAVIDLO: NEJDŘÍV PROGRAMOVAT, AŽ PAK LADIT PROSTŘEDÍ!", "", size_pt=15, color=StylePalette.COLOR_BLUE)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • Nemáte ještě Linux? ", "Otevřete OnlineGDB (onlinegdb.com) v prohlížeči a začněte psát kód v C od prvního dne!", size_pt=13, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  • Ptejte se AI: ", "Při problémech s WSL zkopírujte chybovou hlášku do ChatGPT / Gemini; poradí s povolením virtualizace v BIOSu.", size_pt=13, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(10)
            self._format_bullet_run(p3, "🛠️ Doporučené vývojové prostředí:", "", size_pt=15)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • WSL 2 (Windows 10/11) + JetBrains CLion: ", "Plnohodnotný Linux uvnitř Windows. Studentská licence CLionu je zdarma na univerzitní e-mail.", size_pt=13, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • Zářijový instalační den na FITu: ", "Koncem září pořádají starší studenti FITu akci s osobní pomocí při instalaci Linuxu a WSL.", size_pt=13, level=1)

        self._set_speaker_notes(
            slide,
            "Tohle je naprosto zásadní postřeh z praxe: Spousta prváku stráví hodiny laděním terminálu a editoru, "
            "cítí se, že 'studují PA1', ale ve skutečnosti ještě nenapsali ani řádek kódu. Pokud vám lokální setup drhne, "
            "programujte v OnlineGDB v prohlížeči. Hlavní je začít psát kód od 1. dne. Lokální WSL dořešíte za pochodu."
        )

    def build_slide_14(self) -> None:
        """Slide 14: Pravidla semestru v PA1: Týdenní tempo & zápočet."""
        slide = self.prs.slides[13]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;202;p14":
                title_shape = s
            elif s.name == "Google Shape;203;p14":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "⚙️ Pravidla semestru v PA1: Týdenní tempo & zápočet"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.width = Inches(7.2)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "📅 Týdenní deadliny v Progtestu:", "", size_pt=15)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • ", "Zadání si projděte hned po vyhlášení v týdnu, ať nad ním můžete přemýšlet a ujasnit si nejasnosti na cvičení.", size_pt=13, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • ", "Realisticky je ale samotné kódování a ladění víkendová záležitost — počítejte s tím, že zabere často celý víkend!", size_pt=13, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(10)
            self._format_bullet_run(p2, "🏆 Sbírejte časové bonusy hned od října:", "", size_pt=15, color=StylePalette.COLOR_BLUE)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • ", "První říjnové úlohy (podmínky, jednoduché cykly) jsou nesrovnatelně snazší než listopadové a prosincové (dynamická paměť, spojové seznamy).", size_pt=13, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  • ", "Bonusové body za včasné odevzdání tvoří kritický záchranný polštář na zápočet!", size_pt=13, color=StylePalette.COLOR_ACCENT, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(10)
            self._format_bullet_run(p3, "🎯 Podmínky zápočtu z BI-PA1:", "", size_pt=15)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • ", "Zápočet je čistě o bodech — musíte získat předepsané bodové minimum z domácích úloh v Progtestu.", size_pt=13, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • ", "Během semestru se na FITu nepíše žádný prezenční zápočtový test! Vše stojí na Progtestu.", size_pt=13, level=1)

        self._set_speaker_notes(
            slide,
            "Žádný prezenční test v semestru není – zápočet z PA1 stojí výhradně na bodech z Progtestu. "
            "Kdo nasbírá časové bonusy v říjnu, má v prosinci klid. Když úlohy odložíte na neděli večer, "
            "přijdete o bonusy i o nervy, protože ladění paměťových chyb se nedá uspěchat."
        )

    def build_slide_15(self) -> None:
        """Slide 15: Progtest zblízka: Strategie odevzdávání."""
        slide = self.prs.slides[14]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;211;p15":
                title_shape = s
            elif s.name == "Google Shape;212;p15":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "🎯 Progtest zblízka: Strategie odevzdávání"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.width = Inches(8.5)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "⚠️ Odevzdávání na jistotu (limit ~20 pokusů na úlohu):", "", size_pt=15, color=StylePalette.COLOR_ACCENT)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • ", "Na každou úlohu máte omezený počet pokusů (~20). NIKDY neodevzdávejte stylem pokus-omyl!", size_pt=13, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • ", "Odevzdejte pouze kód, u kterého jste si lokálním testováním 100% jistí, že plní ukázková data i mezní stavy.", size_pt=13, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(10)
            self._format_bullet_run(p2, "💡 2 nepenalizované nápovědy na úlohu (nástroj spolupráce):", "", size_pt=15)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • ", "Každá velká úloha nabízí 2 nápovědy zdarma. Využijte je a sdílejte mezi sebou vstupní data, na kterých vám kód selhal!", size_pt=13, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  • ", "Zjistíte tak zákeřné vstupy Progtestu, aniž byste porušili zákaz sdílení kódu.", size_pt=13, color=StylePalette.COLOR_BLUE, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(10)
            self._format_bullet_run(p3, "🧩 Řešte nepovinná malá „Cvičení“:", "", size_pt=15)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • ", "Kromě velkých úloh jsou v Progtestu malá cvičení za minimum bodů. V jednoduché podobě představují nové principy (paměť, rekurze, spojové seznamy).", size_pt=13, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • ", "Máte v nich navíc k dispozici cca 20 nápověd! Vřele doporučujeme si je projít.", size_pt=13, level=1)

        self._set_speaker_notes(
            slide,
            "20 pokusů se zdá hodně, ale když začnete bezhlavě klikat submit po každé úpravě, vyplýtváte je za dvě hodiny. "
            "Vždy testujte lokálně na velkých vstupech a využívejte 2 nápovědy ke sdílení selhávajících vstupních dat se spolužáky. "
            "Malá cvičení jsou skvělá příprava na velké úlohy."
        )

    def build_slide_16(self) -> None:
        """Slide 16: Typy testů v Progtestu (Table)."""
        slide = self.prs.slides[15]
        self._clear_text_boxes(slide)

        self._add_or_get_title(slide, "🧪 Typy testů v Progtestu: Jak automat hodnotí kód", left=0.8, top=0.4, width=11.7, height=0.8)

        headers = ["Typ testu", "Co přesně Progtest ověřuje", "Klíčová úskalí & Penalizace"]
        data = [
            ["Základní test", "Spustí program na vzorových datech ze zadání", "Musí projít na 100 %, jinak úloha vůbec nepokračuje"],
            ["Mezní hodnoty", "Okrajové stavy: prázdné pole, 0 prvků, 1 prvek, max. limit", "Dělení nulou, přetečení integeru (použijte long long)"],
            ["Ošetření vstupů", "Neplatné znaky, záporná čísla, neúplné řádky", "Návratová hodnota scanf; přesný formát chybové hlášky!"],
            ["Extenzivní test", "Velká náhodná data a rychlost běhu programu", "Časová složitost: O(N log N) vs O(N²); pomalé algoritmy shoří"],
            ["Kontrola paměti", "Přístupy mimo alokované pole a korektní volání free()", "Valgrind odhalí úniky — penalizace −30 % bodů z úlohy!"]
        ]
        col_widths = [2.2, 5.0, 4.5]
        self._create_table(slide, rows=6, cols=3, left=0.8, top=1.3, width=11.7, height=5.3, col_widths=col_widths, headers=headers, data=data, font_size_pt=11)

        self._set_speaker_notes(
            slide,
            "Progtest je automatizovaný tester, který nevidí vaše úmysly, jen přesný výstup a chování v paměti. "
            "Každá mezera i chybějící nový řádek \\n způsobí selhání. Extenzivní test ověřuje rychlost algoritmu "
            "a kontrola paměti spouští Valgrind – za jediný zapomenutý free() přijdete o třetinu bodů!"
        )

    def build_slide_17(self) -> None:
        """Slide 17: Spolupráce vs. plagiátorství & role AI."""
        slide = self.prs.slides[16]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;230;p17":
                title_shape = s
            elif s.name == "Google Shape;231;p17":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "🛡️ Spolupráce vs. plagiátorství & role AI"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.width = Inches(5.8)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🌐 Hledání na internetu (matematika vs. kód):", "", size_pt=14)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • ", "Dohledat si matematické a geometrické vzorce nebo teoretický princip algoritmu je naprosto v pořádku.", size_pt=12, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • ", "Nikdy ale nehledejte hotový kód úloh: cizí řešení neprojdou antiplagiátorem nebo shoří na paměťových testech.", size_pt=12, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(8)
            self._format_bullet_run(p2, "🚨 ZÁKAZ SDÍLENÍ KÓDU (Antiplagiátor MOSS):", "", size_pt=14, color=StylePalette.COLOR_ACCENT)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  • ", "Za žádnou cenu nikomu neposkytujte svůj kód a nedávejte jej na internet (GitHub, Discord apod.).", size_pt=12, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  • ", "Progtest porovnává syntaktické stromy (AST) a pozná i přejmenované proměnné. Shoda = disciplinární komise!", size_pt=12, color=StylePalette.COLOR_ACCENT, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(8)
            self._format_bullet_run(p3, "🤖 AI (ChatGPT / Claude / Gemini) — skvělý sluha, zlý pán:", "", size_pt=14)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • ", "Skvělé na vysvětlení syntaktických chyb kompilátoru a generování testovacích dat.", size_pt=12, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • ", "Zkouška se píše v učebně FIT bez internetu a AI! Pokud si necháte psát kód botem, u zkoušky nemáte šanci.", size_pt=12, color=StylePalette.COLOR_ACCENT, level=1)

        self._set_speaker_notes(
            slide,
            "Pomáhejte si v logice, ale kód pište sami. MOSS na FITu je jeden z nejlepších na světě – odhalí opsaný kód, "
            "i kdybyste přejmenovali každou proměnnou a přeházeli funkce. A AI používejte jen k vysvětlení chyb, "
            "protože u ostré zkoušky v počítačové učebně internet ani ChatGPT mít nebudete."
        )

    def build_slide_18(self) -> None:
        """Slide 18: Zdroje & příprava ke zkoušce z PA1."""
        slide = self.prs.slides[17]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;240;p18":
                title_shape = s
            elif s.name == "Google Shape;241;p18":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "📚 Zdroje & příprava ke zkoušce z PA1"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True
            body_shape.width = Inches(7.5)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🏋️ Trainer KSI (trainer.ksi.fit.cvut.cz): ", "Oficiální interaktivní cvičebnice FITu: praktické úkoly s teorií od začátků v C až po zkouškové úlohy.", size_pt=13)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(6)
            self._format_bullet_run(p2, "📖 FIT-Wiki (fit-wiki.cz): ", "Studentská databáze: zápisky z přednášek a archiv minulých zkouškových písemek a zadání (bezplatná registrace).", size_pt=13)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(8)
            self._format_bullet_run(p3, "🎯 Zlaté rady ke zkouškovému testu na FITu:", "", size_pt=14, color=StylePalette.COLOR_BLUE)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • Funkce jsou přátelé: ", "Kód čleňte do malých pojmenovaných funkcí! Napsat jednu obří main() vede v 90 % k neúspěchu.", size_pt=12, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • Struktury (struct): ", "Když nepoužijete struktury, kód bude nepřehledný a snadno v něm nasekáte chyby.", size_pt=12, level=1)
            p3_sub3 = tf.add_paragraph()
            self._format_bullet_run(p3_sub3, "  • Knihovní funkce: ", "Mějte v malíku malloc, realloc, free, qsort, bsearch a práci se stringy (strcmp, strdup).", size_pt=12, level=1)
            p3_sub4 = tf.add_paragraph()
            self._format_bullet_run(p3_sub4, "  • 🎓 Psychologický tip: ", "Když zkoušejícímu nenásilně naznačíte, že jste z VŠCHT, bývá na zaváhání v C znatelně shovívavější!", size_pt=12, color=StylePalette.COLOR_GREEN, level=1)

        self._set_speaker_notes(
            slide,
            "Zkouška na FITu trvá cca 2 hodiny v počítačové učebně. Trénujte na starých písemkách z FIT-Wiki a úlohách "
            "na Traineru KSI. Kód čleňte do funkcí a nebojte se zkoušejícímu zmínit, že jste bioinformatik z VŠCHT – berou "
            "ohled na to, že máte navíc těžké chemie a matiku."
        )

    def build_slide_19(self) -> None:
        """Slide 19: Konec semestru: Zkouškové, kredity & přepis známek."""
        slide = self.prs.slides[18]
        self._clear_text_boxes(slide)

        title_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;249;p19":
                title_shape = s
                break

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "🏁 Konec semestru: Zkouškové, kredity & přepis známek"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        tf = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(4.7), Inches(5.2)).text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        self._format_bullet_run(p1, "📅 Zkouškové období:", "", size_pt=14)
        p1_sub = tf.add_paragraph()
        self._format_bullet_run(p1_sub, "  • ", "Trvá 5 až 6 týdnů (leden až polovina února). Rozvrhněte termíny rovnoměrně, nenechávejte vše na konec!", size_pt=12, level=1)

        p2 = tf.add_paragraph()
        p2.space_before = Pt(8)
        self._format_bullet_run(p2, "🚨 Přepis známek (KOS ➔ SIS):", "", size_pt=14, color=StylePalette.COLOR_ACCENT)
        p2_sub1 = tf.add_paragraph()
        self._format_bullet_run(p2_sub1, "  • ", "Známky z FITu se na VŠCHT NEPŘENÁŠEJÍ automaticky!", size_pt=12, color=StylePalette.COLOR_ACCENT, level=1)
        p2_sub2 = tf.add_paragraph()
        self._format_bullet_run(p2_sub2, "  • ", "Po zkoušce na FITu musíte zajít za paní Kutinovou pro potvrzený výpis a předat ho paní Kohoutové na VŠCHT.", size_pt=12, level=1)

        p3 = tf.add_paragraph()
        p3.space_before = Pt(8)
        self._format_bullet_run(p3, "📈 Kreditová minima (VŠCHT):", "", size_pt=14)
        p3_sub1 = tf.add_paragraph()
        self._format_bullet_run(p3_sub1, "  • Postup do LS: ", "Alespoň 15 kreditů za ZS (nutno splnit min. 2 zkoušky).", size_pt=12, level=1)
        p3_sub2 = tf.add_paragraph()
        self._format_bullet_run(p3_sub2, "  • Postup do 2. ročníku: ", "Alespoň 30 kreditů za 1. ročník.", size_pt=12, level=1)

        p4 = tf.add_paragraph()
        p4.space_before = Pt(8)
        self._format_bullet_run(p4, "⚖️ Studium a práce: ", "1. ročník je plný úvazek. Neberte si velké brigády, ať stíháte Progtest!", size_pt=12, color=StylePalette.COLOR_MUTED)

        self._set_speaker_notes(
            slide,
            "Pozor na administrativu: Známka z PA1 se v KOSu objeví, ale do SISu VŠCHT se sama nepřepíše! "
            "Musíte si nechat potvrdit výpis a doručit ho na studijní oddělení VŠCHT. Hlídejte si také minimum "
            "15 kreditů pro postup do léta. A nezapomeňte: 1. ročník je časově náročný, neberte si zbytečné brigády."
        )

    def build_slide_20(self) -> None:
        """Slide 20: Kampus & studentské zázemí."""
        slide = self.prs.slides[19]
        self._clear_text_boxes(slide)

        title_shape = None
        body_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;257;p20":
                title_shape = s
            elif s.name == "Google Shape;258;p20":
                body_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "🏛️ Kampus & zázemí pro bioinformatiky"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if body_shape and body_shape.has_text_frame:
            tf = body_shape.text_frame
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🏠 Klubovna B1322 (Budova B VŠCHT — náš ústav ÚICH):", "", size_pt=14)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • ", "Otevřená studovna a klubovna vyhrazená výhradně pro bioinformatiky (studuj.bioinformatiku.cz).", size_pt=12, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • ", "Ideální místo pro společné řešení Progtestu, konzultace se staršími spolužáky i odpočinek.", size_pt=12, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(8)
            self._format_bullet_run(p2, "📚 NTK (Národní technická knihovna):", "", size_pt=14)
            p2_sub = tf.add_paragraph()
            self._format_bullet_run(p2_sub, "  • ", "Tichá patra pro hluboké soustředění, noční studovna, týmové studovny i tisk z notebooku.", size_pt=12, level=1)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(8)
            self._format_bullet_run(p3, "🍽️ Menzy a občerstvení v kampusu Dejvice:", "", size_pt=14)
            p3_sub1 = tf.add_paragraph()
            self._format_bullet_run(p3_sub1, "  • Menzy ČVUT: ", "Technická (vedle NTK), Studentský dům, Masarykova kolej (platba kartou / Agáta).", size_pt=12, level=1)
            p3_sub2 = tf.add_paragraph()
            self._format_bullet_run(p3_sub2, "  • Zázemí VŠCHT: ", "Respirium v budově B, Bufan, kavárna Carbon.", size_pt=12, level=1)

        self._set_speaker_notes(
            slide,
            "Klubovna B1322 na ÚICH je srdce našeho oboru. Kdykoliv tam můžete přijít, sednout s notebookem a řešit úlohy. "
            "Skoro vždycky tam potkáte starší ročníky, které vám rády pomohou s Progtestem nebo vysvětlí těžký koncept. "
            "Využívejte také NTK a menzy přímo v kampusu."
        )

    def build_slide_21(self) -> None:
        """Slide 21: Komunita, akce ÚICH & 5 zlatých pravidel."""
        slide = self.prs.slides[20]
        self._clear_text_boxes(slide)

        title_shape = None
        content_shape = None
        for s in slide.shapes:
            if s.name == "Google Shape;266;g3fa8c97192b_0_0":
                title_shape = s
            elif s.name == "Google Shape;267;g3fa8c97192b_0_0":
                content_shape = s

        if title_shape and title_shape.has_text_frame:
            p = title_shape.text_frame.paragraphs[0]
            p.text = "💬 Komunita, akce ÚICH & 5 zlatých pravidel"
            p.font.name = StylePalette.FONT_TITLE_FAMILY
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = StylePalette.COLOR_TITLE

        if content_shape and content_shape.has_text_frame:
            tf = content_shape.text_frame
            tf.word_wrap = True
            content_shape.top = Inches(1.8)
            content_shape.left = Inches(0.8)
            content_shape.width = Inches(11.7)
            content_shape.height = Inches(5.2)

            p1 = tf.paragraphs[0]
            self._format_bullet_run(p1, "🎒 Komunitní akce ÚICH v zimním semestru:", "", size_pt=14, color=StylePalette.COLOR_BLUE)
            p1_sub1 = tf.add_paragraph()
            self._format_bullet_run(p1_sub1, "  • Discord BioCord (discord.gg/yWxFJmM6Qg): ", "Oficiální komunikační kanál s civilním jménem.", size_pt=12, level=1)
            p1_sub2 = tf.add_paragraph()
            self._format_bullet_run(p1_sub2, "  • Bioinformatické vítání prváků (1. listopadová sobota): ", "Celodenní pěší výlet do přírody se studenty a vyučujícími — neocenitelné rady ke zkouškám!", size_pt=12, level=1)
            p1_sub3 = tf.add_paragraph()
            self._format_bullet_run(p1_sub3, "  • Studentská vědecká konference – SVK (konec listopadu): ", "Rektorské volno, studentská věda a inspirace pro bakalářku.", size_pt=12, level=1)
            p1_sub4 = tf.add_paragraph()
            self._format_bullet_run(p1_sub4, "  • Vánoční večírek ÚICH (polovina prosince): ", "Neformální setkání v klubovně B1322 před zkouškovým.", size_pt=12, level=1)

            p2 = tf.add_paragraph()
            p2.space_before = Pt(12)
            self._format_bullet_run(p2, "🌟 5 zlatých pravidel úspěšného prváka:", "", size_pt=14, color=StylePalette.COLOR_ACCENT)
            p2_sub1 = tf.add_paragraph()
            self._format_bullet_run(p2_sub1, "  1. ", "Začněte programovat od 1. dne (OnlineGDB, pokud nemáte rozchozený Linux).", size_pt=12, level=1)
            p2_sub2 = tf.add_paragraph()
            self._format_bullet_run(p2_sub2, "  2. ", "Sbírejte časové bonusy v Progtestu v říjnu — vytvoří vám záchranný polštář na prosinec.", size_pt=12, level=1)
            p2_sub3 = tf.add_paragraph()
            self._format_bullet_run(p2_sub3, "  3. ", "Získejte maximum bodů z 1. zápočtů z Matiky A a Chemie v 6. týdnu (jsou podstatně snazší!).", size_pt=12, level=1)
            p2_sub4 = tf.add_paragraph()
            self._format_bullet_run(p2_sub4, "  4. ", "Ignorujte chybové e-maily z KOSu; jediným právně závazným indexem je SIS VŠCHT.", size_pt=12, level=1)
            p2_sub5 = tf.add_paragraph()
            self._format_bullet_run(p2_sub5, "  5. ", "Ptejte se včas a držte při sobě: V klubovně B1322, na cvičeních i na Discordu BioCord!", size_pt=12, level=1)

        self._set_speaker_notes(
            slide,
            "Bioinformatika je komunitní obor a držíme při sobě. Přijďte na listopadový výlet a zapojte se do dění na ústavu. "
            "Zkušenosti jednoznačně potvrzují, že studenti, kteří komunikují a chodí do klubovny, studiem projdou s přehledem. "
            "Přejeme vám hodně štěstí v 1. semestru a těšíme se na vás!"
        )

    def build_all(self, output_paths: List[Path]) -> None:
        """Build all 21 slides and save to the specified output paths."""
        print("Building slide 1: Title...")
        self.build_slide_1()
        print("Building slide 2: Co studuješ...")
        self.build_slide_2()
        print("Building slide 3: Checklist (Karty, vstupy, hesla)...")
        self.build_slide_3()
        print("Building slide 4: Dvě univerzity (VŠCHT vs FIT)...")
        self.build_slide_4()
        print("Building slide 5: Checklist (Sítě, NTK, bezpečnost)...")
        self.build_slide_5()
        print("Building slide 6: Rozcestník systémů (Table)...")
        self.build_slide_6()
        print("Building slide 7: Harmonogram...")
        self.build_slide_7()
        print("Building slide 8: Rozvrh na FIT a Past KOSu...")
        self.build_slide_8()
        print("Building slide 9: The Great Filter...")
        self.build_slide_9()
        print("Building slide 10: BI-PA1 síto...")
        self.build_slide_10()
        print("Building slide 11: Klíčová slova v C (Table)...")
        self.build_slide_11()
        print("Building slide 12: Meme...")
        self.build_slide_12()
        print("Building slide 13: Hardware & Linux...")
        self.build_slide_13()
        print("Building slide 14: Pravidla semestru v PA1...")
        self.build_slide_14()
        print("Building slide 15: Progtest strategie...")
        self.build_slide_15()
        print("Building slide 16: Typy testů v Progtestu (Table)...")
        self.build_slide_16()
        print("Building slide 17: Spolupráce vs plagiátorství...")
        self.build_slide_17()
        print("Building slide 18: Zdroje & zkouška PA1...")
        self.build_slide_18()
        print("Building slide 19: Konec semestru...")
        self.build_slide_19()
        print("Building slide 20: Kampus & zázemí...")
        self.build_slide_20()
        print("Building slide 21: Komunita & 5 pravidel...")
        self.build_slide_21()

        for out in output_paths:
            out.parent.mkdir(parents=True, exist_ok=True)
            self.prs.save(str(out))
            print(f"Saved presentation to: {out}")


def main() -> None:
    """Main entry point for building the wiki presentation."""
    template_path = Path("/mnt/c/Users/kolar/Downloads/strašení prváků - bioinformatika.orig.backup.pptx")
    outputs = [
        Path("/mnt/c/Users/kolar/Downloads/pruvodce_prvaka_bioinformatika.pptx"),
        Path("/mnt/c/Users/kolar/Downloads/strašení prváků - bioinformatika.pptx")
    ]

    builder = WikiPresentationBuilder(template_path)
    builder.build_all(outputs)
    print("Successfully generated presentations based 1:1 on wiki!")


if __name__ == "__main__":
    main()
