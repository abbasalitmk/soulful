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
from .models import (
    UserProfile,
    UserPreferences,
    Images,
    Followers,
    MyUser,
    PasswordReset,
    GoogleLogin,
)
from django.db.models import Q
import json
import random
from match.models import FollowRequest
from utils import otp_verification


# from utils import send_otp


User = get_user_model()


# register user
class RegisterView(APIView):
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# validating user details before save
class NewUserValidate(APIView):
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data["email"]

            otp_verification(email)
            return Response(
                {"message": "OTP sent to your email"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = UserSerializer(user)
        return Response(user.data)


# class ResendVerificationLink(APIView):
#     def post(self, request):
#         send_email_verification_link(request.user)
#         return Response({'message': 'success'})


class VerifyEmailView(APIView):
    def get(self, request):
        token = request.query_params.get("token")

        try:
            token_data = RefreshToken(token).payload
            user_id = token_data["user_id"]
            try:
                user = User.objects.get(pk=user_id)
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                    return Response(
                        {"message": "Email verified successfully"},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"error": "user already verified"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except User.DoesNotExist:
                return Response(
                    {"error": "User doesn't exist"}, status=status.HTTP_404_NOT_FOUND
                )
        except:
            return Response(
                {"error": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST
            )


class StoreUserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.profile_completed == True:
            return Response({"error": "Profile already Updated"})

        user_details_data = {
            "user": request.user.pk,
            "first_name": request.data.get("firstName"),
            "last_name": request.data.get("lastName"),
            "dob": request.data.get("dob"),
            "gender": request.data.get("gender"),
            "place": request.data.get("place"),
            "state": request.data.get("state"),
            "country": request.data.get("country"),
            "skinColor": request.data.get("skinColor"),
            "hairColor": request.data.get("hairColor"),
            "bio": request.data.get("bio"),
            "status": request.data.get("status"),
        }

        user_details_serializer = UserProfileSerializer(data=user_details_data)

        if user_details_serializer.is_valid():
            user_details_serializer.save()

            user.profile_completed = True
            user.save()
            return Response(
                {"user_details": user_details_serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"user_details": user_details_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # for checking user profile completed

    def get(self, request):
        try:
            user_id = request.user
            user = User.objects.get(id=user_id.pk)
            profile_completed = user.profile_completed

            return Response(
                {"profile_completed": profile_completed}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RetrieveUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user_profile = UserProfile.objects.filter(user=user).first()
            # user_preferences = UserPreferences.objects.filter(
            #     user=user).first()
            profile_pictures = Images.objects.filter(user=user).order_by("-pk")[:5]

            user_profile_serializer = UserProfileSerializer(user_profile)
            # user_preferences_serializer = UserPreferenceSerializer(
            #     user_preferences)
            profile_picture_serializer = UserProfilePictureSerializer(
                profile_pictures, many=True
            )

            return Response(
                {
                    "user_profile": user_profile_serializer.data,
                    "profile_pictures": profile_picture_serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response({"message": "User Doesn't exist"})
        return Response({user_profile_serializer.errors})


class ProfilePictureUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserProfilePictureSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Image uploaded successfully"})
        return Response({"message": serializer.errors})


# Retrieve all user to display in match section


class RetrieveAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            query = request.query_params.get("query", None)

            if query:
                user_matching_query = Q(first_name__icontains=query)
            else:
                user_matching_query = Q(gender__in=["male", "female"])

            user_profile = UserProfile.objects.get(user=request.user)
            place = user_profile.place
            age = user_profile.dob
            skin = user_profile.skinColor
            hair = user_profile.hairColor

            # append each interests matching query to interests_query Q object.

            # interests_query = Q()
            # for interest in user_interests:
            #     q_object = Q(
            #         user__user_preference__interests__icontains=interest)
            #     interests_query |= q_object

            default_matching_query = ~Q(gender=user_profile.gender) & (
                Q(place__iexact=place)
                | Q(skinColor__iexact=skin)
                | Q(hairColor__iexact=hair)
            )

            # user_matching_query = None

            matching_query = (
                default_matching_query
                if user_matching_query is None
                else user_matching_query
            )

            users = UserProfile.objects.filter(matching_query).exclude(
                user=request.user
            )

            user_data = []

            for user in users:
                profile_picture = (
                    Images.objects.filter(user=user.user).order_by("-pk").first()
                )
                user_profile_serializer = UserProfileSerializer(user)
                picture_serlializer = (
                    UserProfilePictureSerializer(profile_picture)
                    if profile_picture
                    else None
                )

                # check user folllowed the current profile
                follow_status = FollowRequest.objects.filter(
                    sender=request.user, reciever=user.user, accepted=False
                ).exists()

                # check sender and reciver already followed.
                sender = request.user
                reciever = user.user

                if sender.pk < reciever.pk:
                    sender, reciever = reciever, sender

                request_accepted = Followers.objects.filter(
                    user=reciever, followed_user=sender
                ).exists()

                user_data.append(
                    {
                        "id": user_profile_serializer.data["user"],
                        "name": user_profile_serializer.data["first_name"],
                        "location": user_profile_serializer.data["place"],
                        "image": picture_serlializer.data["image"]
                        if picture_serlializer
                        else None,
                        "request_pending": follow_status,
                        "request_accepted": request_accepted,
                    }
                )
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            current_user = request.user
            followed_user = MyUser.objects.get(pk=user_id)

            if not Followers.objects.filter(
                user=current_user, followed_user=followed_user
            ).exists():
                follow = Followers.objects.create(
                    user=current_user, followed_user=followed_user
                )
                follow.save()
                serializer = FollowUserSerializer(follow)
                return Response(
                    {"data": serializer.data}, status=status.HTTP_201_CREATED
                )
            else:
                followed_user = Followers.objects.filter(
                    user=current_user, followed_user=followed_user
                )
                followed_user.delete()
                return Response(
                    {"message": "Unfollowed"}, status=status.HTTP_202_ACCEPTED
                )

        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResetPasswordView(APIView):
    def send_otp_mail(request, email, otp):
        subject = "OTP"
        message = f"Your one time password is : {otp}"
        from_email = "soulfulapp@gmail.com"
        recipient_list = ["abbasalitmk@gmail.com"]
        send_mail(subject, message, from_email, recipient_list)

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"message": "Email Required"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)

            otp_instance = PasswordReset.objects.filter(email=email).first()

            if otp_instance:
                otp_instance.otp = "".join(random.choices("0123456789", k=6))
                otp_instance.save()
                print(otp_instance.otp)
            else:
                otp = "".join(random.choices("0123456789", k=6))
                otp_instance = PasswordReset(email=email, otp=otp)
                otp_instance.save()
                print(otp)

        except User.DoesNotExist:
            return Response(
                {"message": "Enter a valid email address"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({"message": "success"})

    def put(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if password != confirm_password:
            return Response(
                {"message": "Password doesn't match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            return Response({"message": "Password Changed"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"message": "User not found"})

        return Response(
            {"message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get("email")
        enterd_otp = request.data.get("otp")
        try:
            otp = PasswordReset.objects.get(email=email, otp=enterd_otp)

            if str(otp.otp) == str(enterd_otp):
                return Response({"message": "OTP Verified"}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": "OTP not valid"}, status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)


class UpdateProfileData(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user

            user_details_data = {
                "first_name": request.data.get("firstName"),
                "last_name": request.data.get("lastName"),
                "dob": request.data.get("dob"),
                "gender": request.data.get("gender"),
                "place": request.data.get("place"),
                "state": request.data.get("state"),
                "country": request.data.get("country"),
                "skinColor": request.data.get("skinColor"),
                "hairColor": request.data.get("hairColor"),
                "bio": request.data.get("bio"),
                "status": request.data.get("status"),
            }

            user_profile = UserProfile.objects.get(user=user)
            for name, value in user_details_data.items():
                setattr(user_profile, name, value)
            user_profile.save()

            return Response(
                {"message": "Profile updated"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GoogleLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        name = request.data.get("name")
        password = request.data.get("password")
        confirm_password = request.data.get("password")

        try:
            user_exists = User.objects.filter(email=email).exists()

            if user_exists:
                return Response(
                    {"message": "User already exist"}, status=status.HTTP_200_OK
                )

            else:
                data = {
                    "email": email,
                    "name": name,
                    "password": password,
                    "confirm_password": confirm_password,
                }

                serializer = UserCreateSerializer(data=data)
                if serializer.is_valid():
                    user = serializer.save()
                    return Response(
                        {"message": "User created successfully"},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

        except Exception as e:
            print(str(e))
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
