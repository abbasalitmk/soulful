from celery import shared_task
from datetime import datetime
from .models import Membership
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)


@shared_task
def deactivate_expired_membership():
    logger.info("Celery working success")
    try:
        logger.info("Celery enter try")
        expired_membership = Membership.objects.filter(
            expiration_date__lte=datetime.now().date())
        expired_membership.update(is_active=False)
        logger.info("Membership expired")

    except Exception as e:
        logger.error(f"An exception occurred: {str(e)}")
