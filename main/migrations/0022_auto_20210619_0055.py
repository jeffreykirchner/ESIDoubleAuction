# Generated by Django 3.2.2 on 2021-06-19 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_auto_20210618_1753'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sessionperiodtrade',
            options={'ordering': ['trade_number'], 'verbose_name': 'Session Period Trade', 'verbose_name_plural': 'Session Period Trades'},
        ),
        migrations.AlterModelOptions(
            name='sessionperiodtradebid',
            options={'ordering': ['-amount'], 'verbose_name': 'Session Period Trade Bid', 'verbose_name_plural': 'Session Period Trade Bids'},
        ),
        migrations.AddField(
            model_name='sessionperiod',
            name='current_trade_number',
            field=models.IntegerField(default=1),
        ),
    ]
