from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Membership(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    expiration_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email


class Payment(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)
    order_id = models.CharField(max_length=100)
    payment_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.user.email
