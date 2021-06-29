'''
session period model
'''

#import logging

from django.db import models

from . import Session

import main

class SessionPeriod(models.Model):
    '''
    session period model
    '''
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="session_periods")

    period_number = models.IntegerField()                       #period number from 1 to N
    current_trade_number = models.IntegerField(default=1)       #current trade number in the period 

    timestamp = models.DateTimeField(auto_now_add= True)
    updated= models.DateTimeField(auto_now= True)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['session', 'period_number'], name='unique_SD')
        ]
        verbose_name = 'Session Period'
        verbose_name_plural = 'Session Periods'

    def get_bid_list_json(self):
        '''
        return a list of bids for this period in json format
        '''
        return list(main.models.SessionPeriodTradeBid.objects.filter(session_period_trade__in=self.session_period_trades_a.all())
                                                             .values('amount','session_period_trade__trade_number')
                                                             .order_by('-amount'))

    def get_offer_list_json(self):
        '''
        return a list of offers for this period in json format
        '''
        return list(main.models.SessionPeriodTradeOffer.objects.filter(session_period_trade__in=self.session_period_trades_a.all())
                                                             .values('amount','session_period_trade__trade_number')
                                                             .order_by('amount'))

    #return json object of class
    def json(self):
        '''
        json object of model
        '''
        return{
            "id" : self.id,
            "bid_list" : self.get_bid_list_json(),
            "offer_list" : self.get_offer_list_json(),
        }
        