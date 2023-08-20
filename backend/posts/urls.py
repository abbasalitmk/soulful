from django.urls import path
from .views import GetAllPostView, CreatePostView, PostLikeView

urlpatterns = [
    path('', GetAllPostView.as_view(), name="get_all_posts"),
    path('create/', CreatePostView.as_view(), name="create_post"),
    path('like/<int:id>', PostLikeView.as_view(), name='like_post')
]
