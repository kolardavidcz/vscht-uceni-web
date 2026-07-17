"""Binary-safe restore of microbiology data from .old archive."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAIRS = [
    (
        ROOT / ".old/src/features/microbiology/data/zastupci.ts",
        ROOT / "src/features/microbiology/data/zastupci.ts",
    ),
    (
        ROOT / ".old/src/features/microbiology/data/emojis.ts",
        ROOT / "src/features/microbiology/data/emojis.ts",
    ),
]


def restore() -> None:
    for src, dst in PAIRS:
        raw = src.read_bytes()
        # strip UTF-8 BOM if present
        if raw.startswith(b"\xef\xbb\xbf"):
            raw = raw[3:]
        text = raw.decode("utf-8")
        text = text.replace("from '../../../types'", "from '../types'")
        text = text.replace('from "../../../types"', 'from "../types"')
        # preserve original newline style of source as much as possible
        out = text.encode("utf-8")
        dst.write_bytes(out)
        print(f"Wrote {dst.relative_to(ROOT)} ({len(out)} bytes)")

        # extract emoji field samples
        emojis = re.findall(r'emoji:\s*"([^"]*)"', text)
        if emojis:
            print(f"  emoji fields: {len(emojis)}")
            for e in emojis[:8]:
                print(f"    {e!r}  {e}  hex={e.encode('utf-8').hex()}")

        # correctEmojis arrays
        arrays = re.findall(r'"correctEmojis":\s*\[(.*?)\]', text, re.S)
        if arrays:
            first = arrays[0].replace("\n", " ")[:80]
            print(f"  first correctEmojis: {first}")


def verify_equal_to_old() -> None:
    for src, dst in PAIRS:
        st = src.read_text(encoding="utf-8-sig").replace(
            "from '../../../types'", "from '../types'"
        )
        dt = dst.read_text(encoding="utf-8")
        # normalize newlines for compare
        if st.replace("\r\n", "\n") != dt.replace("\r\n", "\n"):
            print(f"DIFF still present: {dst.name}")
        else:
            print(f"MATCH archive (import-adjusted): {dst.name}")


if __name__ == "__main__":
    restore()
    verify_equal_to_old()
