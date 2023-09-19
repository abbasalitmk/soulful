from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import PostSerializer, PostRetrieveSerilizer, CommentSerializer
from users.serializer import UserProfileSerializer, UserProfilePictureSerializer
from .models import Post, Image, Like, Comment
from users.models import UserProfile, Images as Profile_picture

from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Count


class GetAllPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        posts = Post.objects.prefetch_related(
            'image').all().order_by('-created')

        post_data = []
        for post in posts:
            serializer = PostRetrieveSerilizer(post)
            like_count = Like.objects.filter(
                post=post).count()

            like_status = Like.objects.filter(
                post=post, liked_user=request.user).exists()
            post_owner = UserProfile.objects.get(user=post.user)
            profile_serializer = UserProfileSerializer(post_owner)
            profile_picture = Profile_picture.objects.filter(
                user=post.user).order_by('-pk').first()
            profile_picture_serializer = UserProfilePictureSerializer(
                profile_picture)
            comment_count = Comment.objects.filter(post=post).count()

            post_data.append({
                **serializer.data,
                'like_count': like_count,
                'like_status': like_status,
                'post_owner': profile_serializer.data.get('first_name'),
                'profile_picture': profile_picture_serializer.data.get('image'),
                'comment_count': comment_count
            })
        print(post_data)

        return Response(post_data, status=status.HTTP_200_OK)


class CreatePostView (APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def put(self, request):
        id = request.data.get('id')
        try:
            post = Post.objects.get(pk=id)
            print(post.image)

        except Post.DoesNotExist:
            return Response({"message": "Post doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(
            post, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            post = Post.objects.get(pk=id)
            if not Like.objects.filter(liked_user=request.user, post=post).exists():
                Like.objects.create(liked_user=request.user, post=post)
                return Response({"message": "Liked"}, status=status.HTTP_201_CREATED)
            else:
                liked_post = Like.objects.filter(
                    liked_user=request.user, post=post)
                liked_post.delete()
                return Response({"message": "Disliked"}, status=status.HTTP_202_ACCEPTED)

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


class PostCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = Post.objects.get(id=post_id)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            comments = Comment.objects.filter(post=post)
            serializer = CommentSerializer(comments, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except post.DoesNotExist:
            return Response({error: "Post not found!"})

    def delete(self, request, commentId):
        try:
            comment = Comment.objects.get(id=commentId)
            comment.delete()
            return Response({"message": "Comment deleted"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
