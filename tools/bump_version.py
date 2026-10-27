"""Stamp a fresh version tag on every CSS/JS/JSON reference so visitors get updates immediately
(browsers otherwise keep the old files for up to 10 minutes on GitHub Pages).
Run before publishing:  python3 tools/bump_version.py"""
import re, time
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
VER = time.strftime("%Y%m%d%H%M")
tag = lambda m: f'{m.group(1)}?v={VER}'
files = {
    "index.html": [r'(css/styles\.css)(?:\?v=\w+)?', r'(js/main\.js)(?:\?v=\w+)?'],
    "js/main.js": [r'(\./(?:knowledge|assistant|contact)\.js)(?:\?v=\w+)?', r'(js/credits\.json)(?:\?v=\w+)?'],
    "js/assistant.js": [r'(\./(?:knowledge|contact)\.js)(?:\?v=\w+)?'],
}
for f, pats in files.items():
    p = ROOT / f; s = p.read_text()
    for pat in pats: s = re.sub(pat, tag, s)
    p.write_text(s)
print("version", VER)
