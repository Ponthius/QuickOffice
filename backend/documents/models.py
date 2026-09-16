from django.db import models
from django.contrib.auth.models import User

class CompanyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=200, blank=True)
    phone_1 = models.CharField(max_length=30, blank=True)
    phone_2 = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=200, blank=True)
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)
    signature = models.ImageField(upload_to="signatures/", blank=True, null=True)

DOC_TYPES = [
    ("QUOTATION", "Quotation"),
    ("PROFORMA", "Proforma Invoice"),
    ("INVOICE", "Invoice"),
    ("RECEIPT", "Receipt"),
]

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doc_type = models.CharField(max_length=20, choices=DOC_TYPES)
    doc_number = models.CharField(max_length=30, unique=True)
    client_name = models.CharField(max_length=200)
    job_description = models.CharField(max_length=300, blank=True)
    client_address = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    amount_in_words = models.CharField(max_length=300)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class DocumentItem(models.Model):
    document = models.ForeignKey(Document, related_name="items", on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()
    particulars = models.CharField(max_length=300)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)