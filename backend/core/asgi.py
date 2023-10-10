from django.core.asgi import get_asgi_application


# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from channels.auth import AuthMiddlewareStack
import chat.routing
from chat.routing import websocket_urlpatterns
from notification.routing import (
    websocket_urlpatterns as notification_websocket_urlpatterns,
)


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(websocket_urlpatterns + notification_websocket_urlpatterns)
            )
        ),
    }
)
