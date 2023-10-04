from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from utils import send_verification_mail


User = get_user_model()


@receiver(post_save, sender=User)
def send_verification_email(sender, instance, created, **kwargs):
    if created:
        send_verification_mail(instance)
