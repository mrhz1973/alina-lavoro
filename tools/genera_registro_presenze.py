"""Compila una copia del registro presenze PDF a partire da dati espliciti.

Uso: genera_registro_presenze.py MODELLO.pdf DATI.json USCITA.pdf [--esempio]
Il file JSON contiene anno, mese, operatore e un elenco "giorni". Ogni giorno
ha una "data" ISO e uno o più "turni" con "inizio" e "fine" HH:MM.
Non vengono inventati turni per le date assenti.
"""

import calendar
import io
import json
import re
import sys
from datetime import date
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas


MONTHS = (
    "GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO",
    "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE",
)
TIME_PATTERN = re.compile(r"^(?:[01][0-9]|2[0-3]):(?:00|30)$")
COLUMN_CENTERS = (127.0, 179.8, 232.6, 285.4, 338.2, 391.0)
SITE_CENTERS = (153.4, 259.0, 364.6)


def parse_time(value):
    if not isinstance(value, str) or not TIME_PATTERN.fullmatch(value):
        raise ValueError(f"Orario non valido o non a mezz'ora: {value!r}")
    hour, minute = map(int, value.split(":"))
    return hour * 60 + minute


def validate(data):
    year, month = int(data["anno"]), int(data["mese"])
    calendar.monthrange(year, month)
    operator = data["operatore"].strip()
    if not operator or len(operator) > 35:
        raise ValueError("Il nome operatore deve contenere da 1 a 35 caratteri")
    site = data.get("cantiere", "Sede").strip()
    if not site or len(site) > 20:
        raise ValueError("Il nome del cantiere deve contenere da 1 a 20 caratteri")
    days = {}
    entries = data["giorni"]
    if not isinstance(entries, list) or not entries:
        raise ValueError("Nessun giorno lavorato confermato nel registro")
    for item in entries:
        day = date.fromisoformat(item["data"])
        if (day.year, day.month) != (year, month) or day.day in days:
            raise ValueError(f"Data fuori mese o duplicata: {day}")
        shifts = item["turni"]
        if not isinstance(shifts, list) or not 1 <= len(shifts) <= 3:
            raise ValueError(f"La data {day} deve avere da uno a tre turni")
        intervals = []
        for shift in shifts:
            start, end = parse_time(shift["inizio"]), parse_time(shift["fine"])
            if start >= end:
                raise ValueError(f"Turno senza durata positiva: {day}")
            intervals.append((start, end, shift["inizio"], shift["fine"]))
        intervals.sort()
        if any(a[1] > b[0] for a, b in zip(intervals, intervals[1:])):
            raise ValueError(f"Turni sovrapposti: {day}")
        days[day.day] = intervals
    return year, month, operator, site, days


def generate(template, output, data, sample=False):
    if Path(template).resolve() == Path(output).resolve():
        raise ValueError("Il file originale non può essere sovrascritto")
    year, month, operator, site, days = validate(data)
    reader = PdfReader(str(template))
    if len(reader.pages) != 1:
        raise ValueError("Il modello deve avere una sola pagina")
    writer = PdfWriter()
    writer.add_page(reader.pages[0])
    page = writer.pages[0]
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    if abs(width - 595) > 1 or abs(height - 841) > 1 or page.get("/Rotate", 0):
        raise ValueError("Il modello non corrisponde alla pagina prevista")
    stream = io.BytesIO()
    c = canvas.Canvas(stream, pagesize=(width, height))
    c.setFont("Helvetica", 10)
    c.drawString(289, height - 74, operator)
    c.drawString(201, height - 112, f"{MONTHS[month - 1]} {year}")
    c.setFont("Helvetica", 8)
    for center in SITE_CENTERS[:max((len(v) for v in days.values()), default=0)]:
        c.drawCentredString(center, height - 156, site)
    for day, intervals in days.items():
        baseline = height - (199.2 + (day - 1) * 19.445)
        total = 0
        for index, (start, end, start_label, end_label) in enumerate(intervals):
            total += end - start
            c.drawCentredString(COLUMN_CENTERS[index * 2], baseline, start_label)
            c.drawCentredString(COLUMN_CENTERS[index * 2 + 1], baseline, end_label)
        c.drawCentredString(456, baseline, f"{total // 60:02d}:{total % 60:02d}")
    if sample:
        c.setFillColorRGB(0.75, 0, 0)
        c.setFont("Helvetica-Bold", 9)
        c.drawRightString(485, height - 28, "FAC-SIMILE - DATI DI PROVA")
    c.save()
    stream.seek(0)
    page.merge_page(PdfReader(stream).pages[0])
    with Path(output).open("wb") as handle:
        writer.write(handle)


def main():
    if len(sys.argv) not in (4, 5) or (len(sys.argv) == 5 and sys.argv[4] != "--esempio"):
        raise SystemExit(__doc__)
    template, data_path, output = map(Path, sys.argv[1:4])
    if output.resolve() in (template.resolve(), data_path.resolve()):
        raise ValueError("Il modello e i dati originali non possono essere sovrascritti")
    data = json.loads(data_path.read_text(encoding="utf-8"))
    generate(template, output, data, len(sys.argv) == 5)
    print(f"Creato: {output}")


if __name__ == "__main__":
    main()
