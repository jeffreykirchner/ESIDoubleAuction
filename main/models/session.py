'''
session model
'''

from datetime import datetime

import logging
import uuid

from asgiref.sync import sync_to_async
from django.conf import settings

from django.dispatch import receiver
from django.db import models
from django.db.models.signals import post_delete
from django.utils.timezone import now
from django.core.exceptions import ObjectDoesNotExist

import main

from main.models import ParameterSet
from main.models import Parameters

from main.globals import SubjectType

#experiment sessoin
class Session(models.Model):
    '''
    session model
    '''
    parameter_set = models.ForeignKey(ParameterSet, on_delete=models.CASCADE)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions")
    collaborators = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="sessions_b")

    title = models.CharField(max_length = 300, default="*** New Session ***")    #title of session
    start_date = models.DateField(default=now)                                   #date of session start

    channel_key = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name = 'Channel Key')     #unique channel to communicate on
    session_key = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name = 'Session Key')     #unique key for session to auto login subjects by id

    started =  models.BooleanField(default=False)                                #starts session and filll in session
    current_period = models.IntegerField(default=0)                              #current period of the session
    finished = models.BooleanField(default=False)                                #true after all session periods are complete

    shared = models.BooleanField(default=False)                                  #shared models can be imported by other users
    locked = models.BooleanField(default=False)                                  #locked models cannot be deleted

    soft_delete =  models.BooleanField(default=False)                            #hide session if true

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def creator_string(self):
        return self.creator.email
    creator_string.short_description = 'Creator'

    class Meta:
        verbose_name = 'Experiment Session'
        verbose_name_plural = 'Experiment Sessions'
        ordering = ['-start_date']

    #get the current session day
    def get_current_session_period(self) :
        '''
        return session period given current period
        '''

        try:
            return self.session_periods.get(period_number = self.current_period)
        except ObjectDoesNotExist:
            return None

    def get_start_date_string(self):
        '''
        get a formatted string of start date
        '''
        return  self.start_date.strftime("%-m/%-d/%Y")

    def start_experiment(self):
        '''
        setup and start experiment
        '''

        self.started = True
        self.current_period = 1
        self.start_date = datetime.now()

        self.save()

        #initialize buyers
        for i in range(self.parameter_set.number_of_buyers):
            s = main.models.SessionSubject()

            s.session = self
            s.id_number = i + 1
            s.subject_type = SubjectType.BUYER

            s.save()

        #initialize sellers
        for i in range(self.parameter_set.number_of_sellers):
            s = main.models.SessionSubject()

            s.session = self
            s.id_number = i + 1
            s.subject_type = SubjectType.SELLER

            s.save()

        #create new periods
        counter = 1
        for i in self.parameter_set.parameter_set_periods.all():
            session_period = main.models.SessionPeriod()

            session_period.session = self
            session_period.period_number = counter
            session_period.save()

            for j in self.session_subjects.all():
                s = main.models.SessionSubjectPeriod()
                s.session_subject = j
                s.session_period = session_period
                s.parameter_set_period_subject = main.models.ParameterSetPeriodSubject.objects.get(parameter_set_period=i,
                                                                                                   id_number=j.id_number,
                                                                                                   subject_type=j.subject_type)
                s.save()

            counter += 1
                

        #intialize earch period with first trade
        for i in self.session_periods.all():
            t = main.models.SessionPeriodTrade()
            t.session_period = i
            t.trade_number = 1
            t.save()

    def get_data_set(self):
        '''
        return the dataset for this session
        '''

        data_set = {'id':self.id,
                    'title':self.title,
                    'creator':f'{self.creator.first_name} {self.creator.last_name}',
                    'periods':[i.get_data_set() for i in self.session_periods.all()],
                    'parameters':self.parameter_set.json(),
                     }

        return data_set

    def json(self):
        '''
        return json object of model
        '''
        return{
            "id":self.id,
            "title":self.title,
            "locked":self.locked,
            "start_date":self.get_start_date_string(),
            "started":self.started,
            "current_period":self.current_period,
            "finished":self.finished,
            "parameter_set":self.parameter_set.json(),
            "session_periods":[i.json() for i in self.session_periods.all()]
        }


@receiver(post_delete, sender=Session)
def post_delete_parameterset(sender, instance, *args, **kwargs):
    '''
    use signal to delete associated parameter set
    '''
    if instance.parameter_set:
        instance.parameter_set.delete()
