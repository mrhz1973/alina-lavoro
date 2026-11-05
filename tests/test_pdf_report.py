import hashlib
import importlib.util
import unittest
import uuid
from pathlib import Path

from pypdf import PdfReader
from reportlab.pdfgen import canvas


spec = importlib.util.spec_from_file_location(
    "report", Path(__file__).resolve().parents[1] / "tools" / "genera_registro_presenze.py"
)
report = importlib.util.module_from_spec(spec)
spec.loader.exec_module(report)


def data():
    return {
        "anno": 2026, "mese": 3, "operatore": "Operatore di prova", "cantiere": "Sede di prova",
        "giorni": [{"data": "2026-03-02", "turni": [
            {"inizio": "07:00", "fine": "09:30"}, {"inizio": "14:00", "fine": "15:30"}
        ]}],
    }


class PdfReportTests(unittest.TestCase):
    def test_pdf_contains_only_explicit_shifts_and_preserves_original(self):
        # Use explicit temporary files inside the test workspace. Some Windows
        # sandboxes do not grant child access to newly created temp directories.
        base = Path(__file__).resolve().parent
        key = uuid.uuid4().hex
        template, output = base / (".model-" + key + ".pdf"), base / (".result-" + key + ".pdf")
        try:
            blank = canvas.Canvas(str(template), pagesize=(595, 841))
            blank.drawString(40, 800, "MODELLO DI PROVA")
            blank.save()
            original = hashlib.sha256(template.read_bytes()).hexdigest()
            report.generate(template, output, data(), sample=True)
            self.assertEqual(hashlib.sha256(template.read_bytes()).hexdigest(), original)
            result = PdfReader(output)
            self.assertEqual(len(result.pages), 1)
            text = result.pages[0].extract_text()
            for value in ("MODELLO DI PROVA", "Operatore di prova", "07:00", "09:30", "14:00", "15:30", "04:00", "FAC-SIMILE"):
                self.assertIn(value, text)
            with self.assertRaisesRegex(ValueError, "originale"):
                report.generate(template, template, data())
        finally:
            template.unlink(missing_ok=True)
            output.unlink(missing_ok=True)

    def test_invalid_or_missing_attendance_is_rejected(self):
        empty = data()
        empty["giorni"] = []
        with self.assertRaisesRegex(ValueError, "Nessun giorno"):
            report.validate(empty)
        overlap = data()
        overlap["giorni"][0]["turni"][1]["inizio"] = "09:00"
        with self.assertRaisesRegex(ValueError, "sovrapposti"):
            report.validate(overlap)
        non_half_hour = data()
        non_half_hour["giorni"][0]["turni"][0]["inizio"] = "07:15"
        with self.assertRaisesRegex(ValueError, "mezz'ora"):
            report.validate(non_half_hour)


if __name__ == "__main__":
    unittest.main()
