from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from users.models import PasswordReset
import random


def generate_email_verification_token(user):
    refresh = RefreshToken.for_user(user)
    refresh.set_exp(lifetime=timedelta(days=1))

    return {"refresh": str(refresh), "access": str(refresh.access_token)}


def send_verification_mail(user):
    token_data = generate_email_verification_token(user)
    verification_url = settings.SITE_URL
    verification_url += f'verify-email/{token_data["refresh"]}'
    subject = "Verify your email"
    message = f"This is from signal Click the following link to verify your email: {verification_url}"
    from_email = "soulfulapp@gmail.com"
    recipient_list = ["abbasalitmk@gmail.com"]
    send_mail(subject, message, from_email, recipient_list)


def send_otp(otp, email):
    subject = "OTP from soulful.fun"
    message = f"Your one time password is : {otp}"
    from_email = "soulfulapp@gmail.com"
    recipient_list = ["abbasalitmk@gmail.com"]
    send_mail(subject, message, from_email, recipient_list)


def otp_verification(email):
    otp_instance = PasswordReset.objects.filter(email=email).first()

    if otp_instance:
        otp_instance.otp = "".join(random.choices("0123456789", k=6))
        otp_instance.save()
        send_otp(otp_instance.otp, email)
    else:
        otp = "".join(random.choices("0123456789", k=6))
        otp_instance = PasswordReset(email=email, otp=otp)
        otp_instance.save()
        send_otp(otp_instance.otp, email)
