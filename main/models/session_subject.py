'''
session subject model
'''
import uuid

from django.db import models

from main.models import Session
from main.globals import SubjectType

import main

#subject in session
class SessionSubject(models.Model):
    '''
    session subject model
    '''
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="session_subjects")

    id_number = models.IntegerField(verbose_name='ID Number in Period')                                             #local id number in the period
    subject_type = models.CharField(max_length=100, choices=SubjectType.choices, default=SubjectType.BUYER)         #subject type of subject

    login_key = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name = 'Login Key')                        #log in key used to ID subject for URL login
    name = models.CharField(max_length=300, default='Subject Name', verbose_name='Subject Name')                        #subject name
    contact_email = models.CharField(max_length=300, default='panther@chapman.edu', verbose_name='Subject Email')       #contact email address
    
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        
        verbose_name = 'Session Subject'
        verbose_name_plural = 'Session Subjects'
        ordering = ['subject_type', 'id_number']
    
    def get_session_subject_period(self, session_period):
        '''
        return the session subject period number matching session_period
        '''
        return self.session_subject_periods_a.get(session_period=session_period)

    def get_total_profit(self):
        '''
        return the total profit in the experiment
        '''

        earnings = 0

        my_trades = self.get_my_trades()  

        for trade in my_trades:
            if self.subject_type == SubjectType.BUYER:  
                earnings += trade.buyer_value.value_cost
                earnings -= trade.trade_price
            else:
                earnings -= trade.seller_cost.value_cost
                earnings += trade.trade_price

        return f'${earnings:.2f}'.replace('$-','-$')
    
    def get_my_trades(self):
        '''
        return a list of all subject's trades
        '''

        if self.subject_type == SubjectType.BUYER:
            my_trades = main.models.SessionPeriodTrade.objects.filter(buyer__session_subject=self) \
                                                              .filter(trade_complete=True)
        else:
            my_trades = main.models.SessionPeriodTrade.objects.filter(seller__session_subject=self) \
                                                              .filter(trade_complete=True)

        return my_trades

    #return json object of class
    def json(self):
        '''
        json object of model
        '''

        return {
            "id" : self.id,
            "name" : self.name,
            "contact_email" : self.contact_email,
            "student_id" : self.student_id,
            "consent_required" : self.consent_required,
            "questionnaire1_required" : self.questionnaire1_required,
            "questionnaire2_required" : self.questionnaire2_required,
        }
