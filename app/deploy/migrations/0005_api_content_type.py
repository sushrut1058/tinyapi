# Generated by Django 5.1.1 on 2024-12-18 16:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0004_table_table_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='api',
            name='content_type',
            field=models.CharField(default='application/json', max_length=255),
            preserve_default=False,
        ),
    ]
