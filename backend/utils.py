from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone


def generate_email_verification_token(user):
    refresh = RefreshToken.for_user(user)
    refresh.set_exp(lifetime=timedelta(days=1))

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }
