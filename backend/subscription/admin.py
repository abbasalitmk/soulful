from django.contrib import admin
from .models import Payment, Membership

admin.site.register(Membership)
admin.site.register(Payment)
