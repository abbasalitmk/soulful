# Generated by Django 4.2.4 on 2023-08-20 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0009_alter_post_create_at_alter_post_updated_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='create_at',
        ),
        migrations.RemoveField(
            model_name='post',
            name='updated_at',
        ),
        migrations.AddField(
            model_name='post',
            name='created',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='updated',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
