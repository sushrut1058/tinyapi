# Generated by Django 5.1.1 on 2024-12-26 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0005_api_content_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='api',
            name='content_type',
        ),
        migrations.AddField(
            model_name='api',
            name='api_data',
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
    ]
