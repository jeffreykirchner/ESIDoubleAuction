# Generated by Django 3.2.2 on 2021-05-11 18:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20210506_1820'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sessionsubject',
            name='questionnaire1_required',
        ),
        migrations.RemoveField(
            model_name='sessionsubject',
            name='questionnaire2_required',
        ),
    ]