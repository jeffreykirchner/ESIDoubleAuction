'''
admin screen models
'''

from django.contrib import admin

from main.forms import ParametersForm
from main.forms import HelpDocForm
from main.forms import SessionFormAdmin

from main.models import Parameters
from main.models import Session
from main.models import HelpDocs

from django.db.models.functions import Lower

class ParametersAdmin(admin.ModelAdmin):
    '''
    parameters model admin
    '''
    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    form = ParametersForm

    actions = []

admin.site.register(Parameters, ParametersAdmin)

class SessionAdmin(admin.ModelAdmin):
    '''
    Session model admin
    '''
    def has_add_permission(self, request, obj=None):
        return False
    
    form = SessionFormAdmin

    actions = []
    list_display = ['title', 'creator_string', 'start_date']
    ordering = ['-start_date']

admin.site.register(Session, SessionAdmin)

class HelpDocAdmin(admin.ModelAdmin):
            
      form = HelpDocForm

      ordering = [Lower('title')]

      actions = []
      list_display = ['title','path']

admin.site.register(HelpDocs, HelpDocAdmin)
