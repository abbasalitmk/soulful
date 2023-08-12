from django.urls import path
from .views import RegisterView, UserDetails


urlpatterns = [

    path('register/', RegisterView.as_view(), name='register'),

    path('details/', UserDetails.as_view())
]
