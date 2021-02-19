"""
ASGI config for ESIDoubleAuction project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import main.routing

#default implimentation
# application = get_asgi_application()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ESIDoubleAuction.settings')

#channnels implimentation
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            main.routing.websocket_urlpatterns
        )
    ),
})
