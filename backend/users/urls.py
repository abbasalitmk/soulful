from django.urls import path
from .views import (
    RegisterView,
    UserDetails,
    VerifyEmailView,
    StoreUserDetails,
    RetrieveUserProfile,
    ProfilePictureUploadView,
    RetrieveAllUsersView,
    FollowUserView
)


urlpatterns = [

    path('register/', RegisterView.as_view(), name='register'),

    path('details/', UserDetails.as_view()),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('edit-profile', StoreUserDetails.as_view(), name='edit_profile'),
    path('profile/', RetrieveUserProfile.as_view(), name='profile'),
    path('profile-picture/', ProfilePictureUploadView.as_view(),
         name='profile_picture'),
    path('all-users/', RetrieveAllUsersView.as_view(), name='all_users'),
    path('follow/<int:user_id>', FollowUserView.as_view(), name='follow_user'),
]
