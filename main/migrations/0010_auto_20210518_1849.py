# Generated by Django 3.2.2 on 2021-05-18 18:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_alter_parametersetsubject_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='ParameterSetPeriod',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period_number', models.IntegerField(verbose_name='Period number')),
                ('parameter_set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parameter_set_period', to='main.parameterset')),
            ],
            options={
                'verbose_name': 'Period Parameter Set',
                'verbose_name_plural': 'Period Parameter Sets',
                'ordering': ['period_number'],
            },
        ),
        migrations.CreateModel(
            name='ParameterSetPeriodSubject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_number', models.IntegerField(verbose_name='ID Number in Period')),
                ('subject_type', models.CharField(choices=[('Buyer', 'Buyer'), ('Seller', 'Seller')], default='Buyer', max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('parameter_set_period', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parameter_set_period_subjects', to='main.parametersetperiod')),
            ],
            options={
                'verbose_name': 'Parameters for Subject',
                'verbose_name_plural': 'Parameters for Subjects',
                'ordering': ['subject_type', 'id_number'],
            },
        ),
        migrations.CreateModel(
            name='ParameterSetPeriodSubjectValuecost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value_cost', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('parameter_set_subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parameter_set_period_subject_valuecosts', to='main.parametersetperiodsubject')),
            ],
            options={
                'verbose_name': 'Value or cost',
                'verbose_name_plural': 'Value or costs',
            },
        ),
        migrations.RemoveField(
            model_name='parametersetsubjectvaluecost',
            name='parameter_set_subject',
        ),
        migrations.DeleteModel(
            name='ParameterSetSubject',
        ),
        migrations.DeleteModel(
            name='ParameterSetSubjectValuecost',
        ),
        migrations.AddConstraint(
            model_name='parametersetperiodsubject',
            constraint=models.UniqueConstraint(fields=('parameter_set_period', 'id_number', 'subject_type'), name='unique_subject_for_period'),
        ),
        migrations.AddConstraint(
            model_name='parametersetperiod',
            constraint=models.UniqueConstraint(fields=('parameter_set', 'period_number'), name='unique_period'),
        ),
    ]
