from django.urls import path
from .views import create_document

urlpatterns = [
    path("create/", create_document, name="create-document"),
]