from rest_framework.views import APIView
from .serializer import UserSerializer, UserCreateSerializer
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
