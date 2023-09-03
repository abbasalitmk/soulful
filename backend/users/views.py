from rest_framework.views import APIView
from .serializer import (
    UserSerializer,
    UserCreateSerializer,
    UserProfileSerializer,
    UserPreferenceSerializer,
    UserProfilePictureSerializer,
    FollowUserSerializer,
)
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from utils import generate_email_verification_token
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import UserProfile, UserPreferences, Images, Followers, MyUser
from django.db.models import Q
import json


User = get_user_model()


# register user
class RegisterView(APIView):
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_email_verification_link(user)
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetails (APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = UserSerializer(user)
        return Response(user.data)


def send_email_verification_link(user):
    token_data = generate_email_verification_token(user)
    verification_url = settings.SITE_URL
    verification_url += f'verify-email/{token_data["refresh"]}'
    subject = 'Verify your email'
    message = f'Click the following link to verify your email: {verification_url}'
    from_email = 'soulfulapp@gmail.com'
    recipient_list = ['abbasalitmk@gmail.com']
    send_mail(subject, message, from_email, recipient_list)
    print('send')


# class ResendVerificationLink(APIView):
#     def post(self, request):
#         send_email_verification_link(request.user)
#         return Response({'message': 'success'})


class VerifyEmailView(APIView):

    def get(self, request):

        token = request.query_params.get('token')
        print(f'token is : {token}')

        try:
            token_data = RefreshToken(token).payload
            user_id = token_data['user_id']
            try:
                user = User.objects.get(pk=user_id)
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                    return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "user already verified"}, status=status.HTTP_400_BAD_REQUEST)

            except User.DoesNotExist:
                return Response({"error": "User does't exist"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"error": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)


class StoreUserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.profile_completed == True:
            return Response({'error': 'Profile already Updated'})

        user_details = {
            'user': request.user.pk,
            'first_name': request.data.get('firstName'),
            'last_name': request.data.get('lastName'),
            'dob': request.data.get('dob'),
            'gender': request.data.get('gender'),
            'place': request.data.get('place'),
            'state': request.data.get('state'),
            'country': request.data.get('country')

        }
        user_preference = {
            'user': request.user.pk,
            'gender': request.data.get('prefered_gender'),
            'interests': request.data.get('interests')
        }

        user_details_serializer = UserProfileSerializer(data=user_details)
        user_preference_serializer = UserPreferenceSerializer(
            data=user_preference)
        # user_preference_serializer = UserPreferenceSerializer
        if user_details_serializer.is_valid() and user_preference_serializer.is_valid():
            user_details_serializer.save()
            user_preference_serializer.save()

            user.profile_completed = True
            user.save()
            return Response({'user_details': user_details_serializer.data, 'user_preference': user_preference_serializer.data}, status=status.HTTP_200_OK)

        return Response({'user_details': user_details_errors, 'user_preference': user_preference_errors}, status=status.HTTP_400_BAD_REQUEST)


class RetrieveUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            user_profile = UserProfile.objects.filter(user=user).first()
            user_preferences = UserPreferences.objects.filter(
                user=user).first()
            profile_pictures = Images.objects.filter(
                user=user).order_by('-pk')[:5]

            user_profile_serializer = UserProfileSerializer(user_profile)
            user_preferences_serializer = UserPreferenceSerializer(
                user_preferences)
            profile_picture_serializer = UserProfilePictureSerializer(
                profile_pictures, many=True)

            return Response({'user_profile': user_profile_serializer.data, 'user_preferences': user_preferences_serializer.data, 'profile_pictures': profile_picture_serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': "User Doesn't exist"})
        return Response({user_profile_serializer.errors})


class ProfilePictureUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserProfilePictureSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Image uploaded successfully'})
        return Response({'message': serializer.errors})


class RetrieveAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_preferences = UserPreferences.objects.get(user=request.user)
            user_profile = UserProfile.objects.get(user=request.user)
            place = user_profile.place
            user_interests = json.loads(user_preferences.interests)

            # append each interests matching query to interests_query Q object.

            interests_query = Q()
            for interest in user_interests:
                q_object = Q(
                    user__user_preference__interests__icontains=interest)
                interests_query |= q_object

            matching_query = Q(gender=user_preferences.gender) & (Q(
                place__iexact=place) | interests_query)

            users = UserProfile.objects.filter(
                matching_query).exclude(user=request.user)

            user_data = []

            for user in users:

                profile_picture = Images.objects.filter(
                    user=user.user).order_by('-pk').first()
                user_profile_serializer = UserProfileSerializer(user)
                picture_serlializer = UserProfilePictureSerializer(
                    profile_picture) if profile_picture else None

                # check user folllowed the current profile
                follow_status = Followers.objects.filter(
                    user=request.user, followed_user=user.user).exists()

                user_data.append({
                    'id': user_profile_serializer.data['user'],
                    'name': user_profile_serializer.data['first_name'],
                    'location': user_profile_serializer.data['place'],
                    'image': picture_serlializer.data['image'] if picture_serlializer else None,
                    'follow': follow_status
                })
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            current_user = request.user
            followed_user = MyUser.objects.get(pk=user_id)

            if not Followers.objects.filter(user=current_user, followed_user=followed_user).exists():
                follow = Followers.objects.create(
                    user=current_user, followed_user=followed_user)
                follow.save()
                serializer = FollowUserSerializer(follow)
                return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
            else:
                followed_user = Followers.objects.filter(
                    user=current_user, followed_user=followed_user)
                followed_user.delete()
                return Response({'message': "Unfollowed"}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
