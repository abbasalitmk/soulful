from celery import shared_task
from datetime import datetime
from .models import Membership
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)


@shared_task
def deactivate_expired_membership():
    try:
        expired_membership = Membership.objects.filter(
            expiration_date__lte=datetime.now().date()
        )
        expired_membership.update(is_active=False)

    except Exception as e:
        logger.error(f"An exception occurred: {str(e)}")
