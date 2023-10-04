from django.urls import path
from .views import FollowReqestView

urlpatterns = [
    path('follow-request/<int:user_id>',
         FollowReqestView.as_view(), name="follow-request"),
    path('get-requests/',
         FollowReqestView.as_view(), name="get-requests"),
]
