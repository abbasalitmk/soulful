from django.shortcuts import render
from rest_framework import viewsets
from .models import Messages
from .serializers import MessageSerializer, RetrieveFollowedUserSerializer
from rest_framework.views import APIView
from users.models import MyUser, Followers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class MessageView(APIView):

    def get(self, request):
        try:
            followers = Followers.objects.filter(user=request.user)
            serializer = RetrieveFollowedUserSerializer(followers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)})

# def index(request):
#     return render(request, "chat/index.html")


# def room(request, room_name):
#     user = request.user.name
#     return render(request, "chat/room.html", {"room_name": room_name, "user": user})


# class MessageViewSet(viewsets.ModelViewSet):
#     queryset = Messages.objects.all()
#     serializer_class = MessageSerializer


# class FollowersViewSet(viewsets.ModelViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = RetrieveFollowedUserSerializer
#     queryset = Followers.objects.all()

#     def get_queryset(self):
#         return Followers.objects.filter(user=self.request.user)
