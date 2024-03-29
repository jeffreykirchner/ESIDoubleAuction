'''
web socket routing
'''
from django.urls import re_path

from main.consumers import SubjectConsumer
from main.consumers import StaffHomeConsumer
from main.consumers import StaffSessionConsumer
from main.consumers import StaffAdminToolsConsumer

from django.contrib.auth.decorators import login_required
from channels.auth import AuthMiddlewareStack

#web socket routing
websocket_urlpatterns = [
    re_path(r'ws/subject/(?P<room_name>[-\w]+)/$', SubjectConsumer.as_asgi()),
    re_path(r'ws/staff-home/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)', StaffHomeConsumer.as_asgi()),
    re_path(r'ws/staff-session/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)', StaffSessionConsumer.as_asgi()),
    re_path(r'ws/staff-admin-tools/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)', StaffAdminToolsConsumer.as_asgi()),
]