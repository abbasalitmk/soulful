from django.urls import path
from .views import (
    RegisterView,
    UserDetails,
    VerifyEmailView,
    StoreUserDetails,
    RetrieveUserProfile,
    ProfilePictureUploadView,
    RetrieveAllUsersView,
    FollowUserView,
    ResetPasswordView,
    VerifyOTP,
    NewUserValidate,
    UpdateProfileData,
    GoogleLoginView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("details/", UserDetails.as_view()),
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),
    path("edit-profile/", StoreUserDetails.as_view(), name="edit_profile"),
    path("profile/<int:user_id>", RetrieveUserProfile.as_view(), name="profile"),
    path(
        "profile-picture/", ProfilePictureUploadView.as_view(), name="profile_picture"
    ),
    path("all-users/", RetrieveAllUsersView.as_view(), name="all_users"),
    path("follow/<int:user_id>", FollowUserView.as_view(), name="follow_user"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path("verify-otp/", VerifyOTP.as_view(), name="verify_otp"),
    path("verify-details/", NewUserValidate.as_view(), name="verify_details"),
    path("update-profile/", UpdateProfileData.as_view(), name="update-profile"),
    path("google-login/", GoogleLoginView.as_view(), name="google-login"),
]
