from django.urls import path
from .views import create_document, login_view

urlpatterns = [
    path("create/", create_document, name="create-document"),
    path("login/", login_view, name="login"),
]