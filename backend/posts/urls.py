from django.urls import path
from .views import GetAllPostView, CreatePostView, PostLikeView, PostDeleteView, PostCommentView

urlpatterns = [
    path('', GetAllPostView.as_view(), name="get_all_posts"),
    path('create/', CreatePostView.as_view(), name="create_post"),
    path('like/<int:id>', PostLikeView.as_view(), name='like_post'),
    path('delete/<int:id>', PostDeleteView.as_view(), name='delete_post'),
    path('comment/<int:post_id>', PostCommentView.as_view(), name='comment'),
    path('comment/delete/<int:commentId>',
         PostCommentView.as_view(), name='delete_comment'),
]
