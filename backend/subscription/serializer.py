from rest_framework import serializers
from .models import Membership
from users.serializer import UserSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Membership
        fields = '__all__'
