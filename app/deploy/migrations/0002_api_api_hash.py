# Generated by Django 5.1.1 on 2024-11-14 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='api',
            name='api_hash',
            field=models.TextField(blank=True, max_length=128, unique=True),
        ),
    ]