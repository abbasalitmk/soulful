from django.urls import path
from .views import RegisterView, UserDetails, VerifyEmailView


urlpatterns = [

    path('register/', RegisterView.as_view(), name='register'),

    path('details/', UserDetails.as_view()),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
]
