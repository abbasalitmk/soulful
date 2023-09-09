from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.core.mail import send_mail
from utils import generate_email_verification_token
from django.conf import settings

User = get_user_model()


@receiver(post_save, sender=User)
def send_verification_email(sender, instance, created, **kwargs):
    if created:
        token_data = generate_email_verification_token(instance)
        verification_url = settings.SITE_URL
        verification_url += f'verify-email/{token_data["refresh"]}'
        subject = 'Verify your email'
        message = f'This is from signal Click the following link to verify your email: {verification_url}'
        from_email = 'soulfulapp@gmail.com'
        recipient_list = ['abbasalitmk@gmail.com']
        send_mail(subject, message, from_email, recipient_list)
