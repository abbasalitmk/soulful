from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Images

User = get_user_model()


class RetrieveAllUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'is_admin', 'is_active']
