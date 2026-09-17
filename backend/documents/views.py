from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML
from .models import Document, DocumentItem
from .utils import next_doc_number, amount_to_words


@api_view(["POST"])
@permission_classes([])
def login_view(request):
    user = authenticate(
        request,
        username=request.data.get("username"),
        password=request.data.get("password"),
    )
    if user is not None:
        login(request, user)
        return Response({"ok": True, "username": user.username})
    return Response({"ok": False, "error": "Invalid credentials"}, status=401)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_document(request):
    data = request.data
    profile = request.user.companyprofile
    doc_type = data["doc_type"]
    total = sum(float(i["amount"]) for i in data["items"])

    doc = Document.objects.create(
        user=request.user,
        doc_type=doc_type,
        doc_number=next_doc_number(doc_type),
        client_name=data["client_name"],
        job_description=data.get("job_description", ""),
        client_address=data.get("client_address", ""),
        date=data["date"],
        amount_in_words=amount_to_words(total),
        total=total,
    )
    for item in data["items"]:
        DocumentItem.objects.create(document=doc, **item)

    html = render_to_string("documents/pdf_template.html", {"doc": doc, "profile": profile})
    pdf = HTML(string=html, base_url=request.build_absolute_uri("/")).write_pdf()

    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{doc.doc_number}.pdf"'
    return response