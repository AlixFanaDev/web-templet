#!/usr/bin/env python3
"""Download + optimise CC-licensed placeholder photography into public/assets/.

One-off asset pipeline for the Musti Targui landing page. Run from repo root:
    python3 scripts/fetch-placeholders.py

Wikimedia only serves fixed thumbnail buckets (…, 500, 960, 1280, 1920, …),
so each slot requests the smallest bucket that still covers its target size and
falls back to larger buckets on failure. Downloads are paced to respect the
Commons rate limit.
"""
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets")
UA = "MustiTarguiSiteBuilder/1.0 (landing page placeholder assets)"

# name, commons path fragment, request bucket, crop target (WxH)
ITEMS = [
    ("hero-dunes",   "0/04/Erg_Chebbi_sunset.jpg",
     1920, "1920x1080"),
    ("welcome-1",    "0/0c/Jemaa_el-Fnaa_Marrakech_at_sunset.jpg",
     500, "500x500"),
    ("welcome-2",    "c/c7/2018_01_%28Blue%29_-_Chaouen.jpg",
     500, "500x500"),
    ("welcome-3",    "a/a1/Majorelle_Garden_marrakech.jpg",
     500, "500x500"),
    ("tour-3day",    "d/d7/Camel_Tour_on_Erg_Chebbi_riding_across_the_dunes.jpg",
     1280, "1280x860"),
    ("tour-2day",    "f/f0/Azrou_macaque_monkeys_in_the_cedar_forest_%2854243668983%29.jpg",
     1280, "1280x860"),
    ("tour-8day",    "1/19/Camels_at_A%C3%AFt_Benhaddou%2C_Saharan_caravan_route%2C_Morocco_%28%D8%A2%D9%8A%D8%AA_%D8%A8%D9%86_%D8%AD%D8%AF%D9%91%D9%88%2C_%E2%B4%B0%E2%B5%A2%E2%B5%9C_%E2%B5%83%E2%B4%B0%E2%B4%B7%E2%B4%B7%E2%B5%93%29.jpg",
     1280, "1280x860"),
    ("tour-atlas",   "4/44/Ourika_Valley_-_in_the_Atlas_Mountains%2C_Morocco_-_panoramio.jpg",
     1280, "1280x860"),
    ("dest-marrakech", "f/f9/Marrakech_souk_fruit_vendor.jpg",
     960, "960x720"),
    ("dest-fes",     "b/bd/Chouara_Tannery%2C_Fes_%288947682350%29.jpg",
     960, "960x720"),
    ("dest-chefchaouen", "2/29/Chefchaouen_%28Blue_City%29.jpg",
     960, "960x720"),
    ("dest-casablanca", "0/06/The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg",
     960, "960x720"),
    ("dest-ouarzazate", "2/2f/Kasbah_Ait_Ben_Haddou_%2837718032425%29.jpg",
     960, "960x720"),
    ("dest-merzouga", "6/6e/Merzouga_desert_camp.jpg",
     960, "960x720"),
    ("gallery-1",    "5/54/Above_Moroccan_Dunes.jpg",
     960, "760x1010"),
    ("gallery-2",    "d/dd/Camel_caravan_going_through_sand_in_the_Sahara_Desert.jpg",
     960, "760x1010"),
    ("gallery-3",    "6/66/Traditional_carpets_hanging_on_a_wire_in_an_alley_of_Fes..jpg",
     960, "760x950"),
    ("gallery-4",    "b/bc/Chefchaouen_Street_-_14103634495.jpg",
     960, "760x950"),
    ("gallery-5",    "2/26/Djebel_Ayachi%2C_Eastern_High_Atlas%2C_Morocco.jpg",
     960, "760x1010"),
    ("gallery-6",    "f/fe/Berber_camp_at_Merzouga_-_Flickr_-_gailhampshire_%281%29.jpg",
     960, "760x950"),
    ("gallery-7",    "6/67/Medina_souk%2C_Marrakech%2C_Morocco_-_panoramio_%281%29.jpg",
     960, "760x950"),
]

BUCKETS = [500, 960, 1280, 1920]


def fetch(url: str, dest: str, attempts: int = 4) -> None:
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as resp, open(dest, "wb") as fh:
                fh.write(resp.read())
            return
        except urllib.error.HTTPError as exc:
            if exc.code == 429 and attempt < attempts - 1:
                wait = 15 * (attempt + 1)
                print(f"    429 — backing off {wait}s")
                time.sleep(wait)
                continue
            raise
        except Exception:
            if attempt < attempts - 1:
                time.sleep(5)
                continue
            raise


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    tmp = os.path.join(OUT, ".tmp")
    os.makedirs(tmp, exist_ok=True)

    failures = []
    for name, path, bucket, target in ITEMS:
        final = os.path.join(OUT, name + ".jpg")
        if os.path.exists(final):
            print(f"skip {name}")
            continue

        base = path.rsplit("/", 1)[-1]
        ordered = [bucket] + [b for b in BUCKETS if b > bucket]
        raw = os.path.join(tmp, name + ".src.jpg")
        got = None
        for width in ordered:
            url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{path}/{width}px-{base}"
            try:
                fetch(url, raw)
                got = width
                break
            except Exception as exc:  # noqa: BLE001
                print(f"    bucket {width} failed: {exc}")
                time.sleep(4)
        if got is None:
            failures.append(name)
            print(f"FAIL {name}")
            continue

        w, h = target.split("x")
        subprocess.run(
            ["magick", raw, "-strip",
             "-resize", f"{w}x{h}^",
             "-gravity", "center",
             "-extent", f"{w}x{h}",
             "-interlace", "Plane",
             "-quality", "74",
             final],
            check=True,
        )
        print(f"ok   {name}: {w}x{h} from {got}px ({os.path.getsize(final) // 1024} KB)")
        time.sleep(3)

    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    try:
        os.rmdir(tmp)
    except OSError:
        pass

    if failures:
        print("\nFailed:", ", ".join(failures))
        return 1
    print("\nAll placeholder assets in place.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
