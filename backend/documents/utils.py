from datetime import date
from .models import Document

PREFIX = {"QUOTATION": "QUO", "PROFORMA": "PRO", "INVOICE": "INV", "RECEIPT": "REC"}

def next_doc_number(doc_type):
    year = date.today().year
    prefix = f"{PREFIX[doc_type]}-{year}-"
    last = Document.objects.filter(doc_number__startswith=prefix).order_by("-doc_number").first()
    n = int(last.doc_number.split("-")[-1]) + 1 if last else 1
    return f"{prefix}{n:03d}"