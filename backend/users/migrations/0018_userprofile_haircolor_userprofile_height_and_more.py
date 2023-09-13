# Generated by Django 4.2.4 on 2023-09-12 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_alter_followers_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='hairColor',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='height',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='skinColor',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='weight',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
