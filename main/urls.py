'''
URL Patterns
'''

from django.views.generic.base import RedirectView
from django.contrib.auth.decorators import login_required

from django.urls import path
from django.urls import re_path
from main import views

urlpatterns = [

    #auth
    re_path(r'^admin/login/$', views.LoginView.as_view()),
    re_path(r'^admin/logout/', views.logout_view),
    path('accounts/login/', views.LoginView.as_view(), name='login'),
    path('accounts/logout/', views.logout_view, name='logout'),

    #main
    path('', login_required(views.StaffHomeView.as_view()), name='home'),
    path('subject', views.SubjectView.as_view(), name='subject'),
    path('staff-session/<int:pk>/', views.StaffSessionView.as_view(), name='staff_session'),

    #txt
    path('robots.txt', views.RobotsTxt, name='robotsTxt'),
    path('ads.txt', views.AdsTxt, name='adsTxt'),
    path('.well-known/security.txt', views.SecurityTxt, name='securityTxt'),
    path('humans.txt', views.HumansTxt, name='humansTxt'),

    #icons
    path('favicon.ico', RedirectView.as_view(url='/static/favicon.ico'), name='favicon'),
    path('apple-touch-icon-precomposed.png', RedirectView.as_view(url='/static/apple-touch-icon-precomposed.png'), name='favicon'),
    path('apple-touch-icon.png', RedirectView.as_view(url='/static/apple-touch-icon-precomposed.png'), name='favicon'),
    path('apple-touch-icon-120x120-precomposed.png', RedirectView.as_view(url='/static/apple-touch-icon-precomposed.png'), name='favicon'),
]
