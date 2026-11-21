from django.urls import path
from .views import create_document, login_view, profile_view, signup_view

urlpatterns = [
    path("create/", create_document, name="create-document"),
    path("create", create_document, name="create-document-no-slash"),
    path("login/", login_view, name="login"),
    path("login", login_view, name="login-no-slash"),
    path("signup/", signup_view, name="signup"),
    path("signup", signup_view, name="signup-no-slash"),
    path("profile/", profile_view, name="profile"),
    path("profile", profile_view, name="profile-no-slash"),
]
