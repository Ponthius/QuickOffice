from django.urls import path
from .views import create_document, login_view, profile_view, signup_view

urlpatterns = [
    path("create/", create_document, name="create-document"),
    path("login/", login_view, name="login"),
    path("signup/", signup_view, name="signup"),
    path("profile/", profile_view, name="profile"),
]