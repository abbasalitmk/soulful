# Generated by Django 4.2.4 on 2023-08-07 15:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_myuser_fullname'),
    ]

    operations = [
        migrations.RenameField(
            model_name='myuser',
            old_name='fullname',
            new_name='name',
        ),
    ]
