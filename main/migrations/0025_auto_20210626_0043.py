# Generated by Django 3.2.2 on 2021-06-26 00:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0024_auto_20210625_2032'),
    ]

    operations = [
        migrations.AddField(
            model_name='sessionperiodtradebid',
            name='session_subject_period',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='session_period_trade_bids_b', to='main.sessionsubjectperiod'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sessionperiodtradeoffer',
            name='session_subject_period',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='session_period_trade_offers_b', to='main.sessionsubjectperiod'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='sessionperiodtradeoffer',
            name='value',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='session_period_trade_offers_value', to='main.parametersetperiodsubjectvaluecost'),
        ),
    ]