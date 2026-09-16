from django.contrib import admin
from .models import CompanyProfile, Document, DocumentItem

admin.site.register(CompanyProfile)
admin.site.register(Document)
admin.site.register(DocumentItem)