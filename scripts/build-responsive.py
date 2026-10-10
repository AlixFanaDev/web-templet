#!/usr/bin/env python3
"""Generate AVIF + WebP variants for every JPEG in public/assets/.

Companion to `fetch-placeholders.py` — run once after assets are in place:

    python3 scripts/build-responsive.py

Emits `<name>.avif` and `<name>.webp` next to each `<name>.jpg` so components
can use a <picture> element with AVIF → WebP → JPEG sources.
"""
import os
import subprocess
import sys

ASSETS = os.path.join(os.path.dirname(__file__), "..", "public", "assets")


def has_tool(cmd: str) -> bool:
    return subprocess.run(["which", cmd], capture_output=True).returncode == 0


def main() -> int:
    jpegs = sorted(f for f in os.listdir(ASSETS) if f.endswith(".jpg"))
    if not jpegs:
        print("No JPEGs found — run fetch-placeholders.py first.")
        return 1

    have_magick = has_tool("magick")
    have_ffmpeg = has_tool("ffmpeg")
    failures = 0

    for name in jpegs:
        src = os.path.join(ASSETS, name)
        stem = src[:-4]

        # WebP (ImageMagick, quality 76 — visually lossless at this size)
        webp = stem + ".webp"
        if not os.path.exists(webp) and have_magick:
            subprocess.run(["magick", src, "-strip", "-quality", "76", webp], check=True)
            print(f"webp  {name} -> {os.path.getsize(webp) // 1024} KB")

        # AVIF (ffmpeg AV1 still picture, crf 36 / preset 6 ≈ good quality/size)
        avif = stem + ".avif"
        if not os.path.exists(avif) and have_ffmpeg:
            result = subprocess.run(
                [
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", src,
                    "-c:v", "libsvtav1", "-crf", "36", "-preset", "6",
                    "-still-picture", "1",
                    "-strict", "-2",
                    avif,
                ],
                capture_output=True,
                text=True,
            )
            if result.returncode == 0 and os.path.exists(avif):
                print(f"avif  {name} -> {os.path.getsize(avif) // 1024} KB")
            else:
                failures += 1
                print(f"avif  {name}: FAILED ({result.stderr.strip()[:120]})")
                if os.path.exists(avif):
                    os.remove(avif)

    print("\nDone." + (" Some AVIF files failed." if failures else ""))
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
