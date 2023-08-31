from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import PostSerializer, PostRetrieveSerilizer
from .models import Post, Image
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class GetAllPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        posts = Post.objects.prefetch_related(
            'image').all().order_by('-created')

        serialized_data = PostRetrieveSerilizer(posts, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class CreatePostView (APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class PostLikeView(APIView):

    def post(self, request, id):
        try:
            post = Post.objects.get(pk=id)
            post.likes += 1
            post.save()

            return Response({"message": "Liked successfully"}, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)


class PostDeleteView(APIView):
    def post(self, request, id):
        try:
            post = Post.objects.get(pk=id)
            post.delete()
            return Response({'message': 'Post Deleted Successfully'}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'message': "Post Doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
