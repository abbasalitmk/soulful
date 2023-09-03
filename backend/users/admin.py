from django.contrib import admin
from . models import MyUser as User, UserPreferences, UserProfile, Images, Followers

admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(UserPreferences)
admin.site.register(Images)
admin.site.register(Followers)
