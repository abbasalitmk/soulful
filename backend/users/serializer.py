from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserProfile, UserPreferences
import json
from .models import Images, Followers


User = get_user_model()


# customise token claims


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["email"] = user.email
        token["is_staff"] = user.is_staff
        token["is_admin"] = user.is_admin
        token["name"] = user.name
        token["is_verified"] = user.is_verified
        token["profile_completed"] = user.profile_completed
        # ...

        return token


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["email", "password", "confirm_password", "name"]

    # check comfirm password

    def validate(self, data):
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        if password != confirm_password:
            raise serializers.ValidationError("Password doesn't match")
        return data

    # name validation check
    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Name should have atleast 3 words")
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "email"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class UserPreferenceSerializer(serializers.ModelSerializer):
    interests = serializers.JSONField()

    class Meta:
        model = UserPreferences
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["interests"] = json.loads(representation["interests"])
        return representation


class UserProfilePictureSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Images
        fields = "__all__"


class FollowUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = "__all__"
