from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializer import RetrieveAllUsersSerializer
from rest_framework import status
from rest_framework.response import Response
from users.models import Images, UserProfile, Images as Profile_picture
from posts.models import Like, Comment
from users.serializer import UserProfilePictureSerializer
from rest_framework.pagination import PageNumberPagination
from posts.views import GetAllPostView
from posts.models import Post
from posts.serializers import PostRetrieveSerilizer
from users.serializer import UserProfileSerializer
from subscription.models import Membership
from subscription.serializer import SubscriptionSerializer


User = get_user_model()


class RetrieveAllUsersView(APIView):
    pagination_class = PageNumberPagination

    def get(self, request):
        try:
            paginator = self.pagination_class()
            users = User.objects.all().order_by('-pk')
            users = paginator.paginate_queryset(users, request)

            serializer = RetrieveAllUsersSerializer(users, many=True)

            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BlockUserView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                user.is_active = not user.is_active
                user.save()
                return Response({"message": "Success"}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "No user id provided"})


class RetrieveAllPostsView(APIView):
    pagination_class = PageNumberPagination

    def get(self, request):
        paginator = self.pagination_class()

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
        paginated_post = paginator.paginate_queryset(post_data, request)

        return paginator.get_paginated_response(paginated_post)

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({"message": "No post found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            post.is_active = not post.is_active
            post.save()

            return Response({"message": "Post blocked successfully"}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({"message": "No post found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubscriptionsView(APIView):
    pagination_class = PageNumberPagination

    def get(self, request):
        paginator = self.pagination_class()
        try:
            membership = Membership.objects.all()
            serializer = SubscriptionSerializer(membership, many=True)
            paginated_post = paginator.paginate_queryset(
                serializer.data, request)

            return paginator.get_paginated_response(paginated_post)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
