# from .views import MessageViewSet, FollowersViewSet, MessageView
from .views import MessageView
from rest_framework.routers import DefaultRouter
from django.urls import path

from . import views

urlpatterns = [
    path('followers/', MessageView.as_view(), name="followers")
]


# router = DefaultRouter()
# router.register(r'messages', MessageViewSet)
# router.register(r'followers', FollowersViewSet)

# urlpatterns = router.urls
