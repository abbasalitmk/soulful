from django.urls import path
from .views import GetStoriesView

urlpatterns = [
    path('', GetStoriesView.as_view(), name='get_stories')
]
