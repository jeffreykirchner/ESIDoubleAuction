# Generated by Django 3.1.6 on 2021-02-20 22:40

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20210220_1908'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameters',
            name='channel_key',
            field=models.UUIDField(default=uuid.uuid4, editable=False, verbose_name='Channel Key'),
        ),
        migrations.AddField(
            model_name='session',
            name='channel_key',
            field=models.UUIDField(default=uuid.uuid4, editable=False, verbose_name='Channel Key'),
        ),
        migrations.AddField(
            model_name='session',
            name='session_key',
            field=models.UUIDField(default=uuid.uuid4, editable=False, verbose_name='Session Key'),
        ),
    ]
