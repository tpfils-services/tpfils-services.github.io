"""Génère le QR code de marque TP & FILS + une affiche imprimable.
Usage : python make_qr.py [URL]   (nécessite : pip install pillow "qrcode[pil]")"""
import sys, os
import qrcode
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
URL = sys.argv[1] if len(sys.argv) > 1 else "https://ftalla18.github.io/tpfils-services/"
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=24, border=2)
qr.add_data(URL); qr.make(fit=True)
img = qr.make_image(fill_color=(10, 23, 72), back_color="white").convert("RGBA")
W = img.width
logo = Image.open(os.path.join(HERE, "..", "assets", "img", "logo-tp-services.png")).convert("RGBA")
bw = int(W * 0.24); logo.thumbnail((int(bw * 0.86), int(bw * 0.86)), Image.LANCZOS)
badge = Image.new("RGBA", (bw, int(logo.height + bw * 0.16)), (255, 255, 255, 255))
mask = Image.new("L", badge.size, 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, badge.width - 1, badge.height - 1), radius=int(bw * 0.12), fill=255)
badge.paste(logo, ((bw - logo.width) // 2, (badge.height - logo.height) // 2), logo)
img.paste(badge, ((W - badge.width) // 2, (W - badge.height) // 2), mask)
img.convert("RGB").save(os.path.join(HERE, "qr-tpfils.png"))

def font(sz):
    for p in ["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/Library/Fonts/Arial Bold.ttf", "DejaVuSans-Bold.ttf"]:
        try: return ImageFont.truetype(p, sz)
        except OSError: pass
    return ImageFont.load_default()
pad = 120
card = Image.new("RGB", (W + 2 * pad, W + 600), (255, 255, 255)); d = ImageDraw.Draw(card)
d.rectangle((0, 0, card.width, 330), fill=(21, 55, 184))
for text, size, y, color in [("Scannez pour visiter notre site", 92, 115, (255, 255, 255)),
                             ("Transport · Logistique · Pneumatiques · Port de Douala", 60, W + 385, (10, 23, 72)),
                             ("Devis rapide sur WhatsApp", 70, W + 475, (31, 190, 90))]:
    f = font(size); d.text(((card.width - d.textlength(text, font=f)) / 2, y), text, font=f, fill=color)
card.paste(img.convert("RGB"), (pad, 360))
card.save(os.path.join(HERE, "qr-tpfils-affiche.png"))
print("QR ->", URL)
