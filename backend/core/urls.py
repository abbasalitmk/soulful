from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/admin/", admin.site.urls),
    path("api/user/", include("users.urls")),
    path("api/posts/", include("posts.urls")),
    path("api/stories/", include("stories.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/db/", include("dashboard.urls")),
    path("api/subscription/", include("subscription.urls")),
    path("api/match/", include("match.urls")),
]

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
