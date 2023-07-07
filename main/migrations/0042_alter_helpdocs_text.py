# Generated by Django 4.0.7 on 2022-08-17 17:22

from django.db import migrations
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0041_remove_helpdocs_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='helpdocs',
            name='text',
            field=tinymce.models.HTMLField(default='', max_length=10000, verbose_name='Help Doc Text'),
        ),
    ]