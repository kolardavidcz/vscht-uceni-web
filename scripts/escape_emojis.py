"""Rewrite microbiology data so emoji code points are ASCII-safe \\u{...} escapes."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def escape_emoji_string(s: str) -> str:
    """Escape non-ASCII (and combining) characters inside a JS/TS string literal."""
    out: list[str] = []
    for ch in s:
        o = ord(ch)
        if o < 128:
            # keep plain ASCII as-is (N, CH4, quotes already outside)
            out.append(ch)
        elif o <= 0xFFFF:
            out.append(f"\\u{o:04X}")
        else:
            out.append(f"\\u{{{o:X}}}")
    return "".join(out)


def transform_source(text: str) -> str:
    # emoji: "...."
    def repl_emoji_field(m: re.Match[str]) -> str:
        inner = m.group(1)
        return f'emoji: "{escape_emoji_string(inner)}"'

    text = re.sub(r'emoji:\s*"([^"]*)"', repl_emoji_field, text)

    # "correctEmojis": [ "a", "b" ]
    def repl_array(m: re.Match[str]) -> str:
        body = m.group(1)

        def repl_item(im: re.Match[str]) -> str:
            return f'"{escape_emoji_string(im.group(1))}"'

        new_body = re.sub(r'"([^"]*)"', repl_item, body)
        return f'"correctEmojis": [{new_body}]'

    text = re.sub(
        r'"correctEmojis":\s*\[(.*?)\]',
        repl_array,
        text,
        flags=re.S,
    )

    # category labels with leading emoji: label: "🧱 Buněčná..."
    def repl_label(m: re.Match[str]) -> str:
        # only escape non-ascii in labels that start with emoji-ish
        inner = m.group(1)
        if any(ord(c) > 127 for c in inner[:4]):
            # escape only the emoji prefix chars, keep Czech text as UTF-8
            # Actually keep full UTF-8 for Czech labels — only force-escape pure emoji fields.
            return m.group(0)
        return m.group(0)

    text = re.sub(r'label:\s*"([^"]*)"', repl_label, text)

    # category list labels like "🧱 Buněčná stěna a morfologie"
    def repl_cat_label(m: re.Match[str]) -> str:
        prefix = m.group(1)
        rest = m.group(2)
        return f'label: "{escape_emoji_string(prefix)}{rest}"'

    text = re.sub(
        r'label:\s*"([^\w\sA-Za-zÁ-ž][^"]*?)\s+([^"]*)"',
        repl_cat_label,
        text,
    )

    return text


def main() -> None:
    # Start from clean archive copies
    pairs = [
        (
            ROOT / ".old/src/features/microbiology/data/emojis.ts",
            ROOT / "src/features/microbiology/data/emojis.ts",
        ),
        (
            ROOT / ".old/src/features/microbiology/data/zastupci.ts",
            ROOT / "src/features/microbiology/data/zastupci.ts",
        ),
    ]
    for src, dst in pairs:
        text = src.read_text(encoding="utf-8-sig")
        text = text.replace("from '../../../types'", "from '../types'")
        text = transform_source(text)
        dst.write_text(text, encoding="utf-8", newline="\n")
        print(f"Escaped {dst.relative_to(ROOT)}")
        # show a sample line
        for line in text.splitlines():
            if "emoji:" in line and "\\u" in line:
                print(" ", line.strip()[:100])
                break


if __name__ == "__main__":
    main()
