from django.contrib import admin
from .models import Post, Comment, Image

admin.site.register(Image)
admin.site.register(Post)
admin.site.register(Comment)
