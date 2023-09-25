from rest_framework import serializers
from .models import Membership


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'
