from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML

from .models import Document, DocumentItem, CompanyProfile
from .utils import next_doc_number, amount_to_words
from .serializers import CompanyProfileSerializer

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from pathlib import Path


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

    logo_url = Path(profile.logo.path).as_uri() if profile.logo else None
    signature_url = Path(profile.signature.path).as_uri() if profile.signature else None

    html = render_to_string("documents/pdf_template.html", {
        "doc": doc,
        "profile": profile,
        "logo_url": logo_url,
        "signature_url": signature_url,
    })
    pdf = HTML(string=html, base_url=request.build_absolute_uri("/")).write_pdf()

    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{doc.doc_number}.pdf"'
    return response



@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def profile_view(request):
    profile, _ = CompanyProfile.objects.get_or_create(user=request.user)
    if request.method == "GET":
        return Response(CompanyProfileSerializer(profile, context={"request": request}).data)
    serializer = CompanyProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(CompanyProfileSerializer(profile, context={"request": request}).data)



@api_view(["POST"])
@permission_classes([])
def signup_view(request):
    username = request.data.get("username")
    email = request.data.get("email", "")
    password = request.data.get("password")

    if not username or not password:
        return Response({"ok": False, "error": "Username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"ok": False, "error": "That username is already taken"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    CompanyProfile.objects.create(user=user)  # blank profile, filled in later at /settings

    login(request, user)
    return Response({"ok": True, "username": user.username})