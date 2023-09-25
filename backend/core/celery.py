# from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab


# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Create a Celery instance and configure it using settings from Django
app = Celery('core')

# Load task modules from all registered Django app configs.
app.config_from_object('django.conf:settings', namespace='CELERY')


app.conf.beat_schedule = {
    'deactivate-expired-memberships': {
        'task': 'subscription.tasks.deactivate_expired_membership',
        'schedule': crontab(minute='*'),  # Run daily at midnight
    },
}


# Auto-discover tasks in all installed apps (by looking for a tasks.py file)
app.autodiscover_tasks()
