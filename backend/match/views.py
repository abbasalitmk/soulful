from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import FollowRequestSerializer
from users.models import MyUser as User, Followers
from match.models import FollowRequest


class FollowReqestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            sender = request.user
            reciever = User.objects.get(id=user_id)

            if not FollowRequest.objects.filter(
                    sender=sender, reciever=reciever).exists():

                data = {
                    "sender": sender.pk,
                    "reciever": reciever.pk,
                }

                serializer = FollowRequestSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "you already made a request"}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            follow_requests = FollowRequest.objects.filter(
                reciever=request.user, accepted=False)
            serializer = FollowRequestSerializer(follow_requests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, user_id):
        try:
            sender = User.objects.get(id=user_id)
            reciever = request.user

            # get the related follow request
            follow_request = FollowRequest.objects.get(
                sender=sender, reciever=reciever)
            follow_request.accepted = True
            follow_request.save()

            if sender.pk < reciever.pk:
                sender, reciever = reciever, sender

            if not Followers.objects.filter(user=reciever, followed_user=sender).exists():
                follow = Followers.objects.create(
                    user=reciever, followed_user=sender)
                follow.save()

            else:
                return Response({'message': "already followed"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': "Follow Request Accepted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
