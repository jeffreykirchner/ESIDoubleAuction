'''
staff admin tools view
'''
import logging
import uuid

import channels.layers
from asgiref.sync import async_to_sync

from django.views.generic import View
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from main.models import Parameters

from main.decorators import user_is_super

class StaffAdminTools(View):
    '''
    class based admin tools view
    '''
    template_name = "staff/staff_admin_tools.html"
    websocket_path = "staff-admin-tools"
    
    @method_decorator(user_is_super)
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        #logger = logging.getLogger(__name__) 

        parameters = Parameters.objects.first()

        return render(request, self.template_name, {"channel_key" : uuid.uuid4(),
                                                    "page_key" : "staff-admin-tools",
                                                    "websocket_path" : self.websocket_path})