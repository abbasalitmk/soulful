from django.urls import path
from .views import RetrieveAllUsersView, RetrieveAllPostsView, BlockUserView, SubscriptionsView


urlpatterns = [
    path('all-users/', RetrieveAllUsersView.as_view(), name="all_users"),
    path('block-user/', BlockUserView.as_view(), name="block_user"),
    path('all-posts/', RetrieveAllPostsView.as_view(), name="all_posts"),
    path('delete/<int:post_id>', RetrieveAllPostsView.as_view(), name="delete_post"),
    path('status/<int:post_id>', RetrieveAllPostsView.as_view(), name="post_status"),
    path('subscribers/', SubscriptionsView.as_view(), name="subscribers"),
]
