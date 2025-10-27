from django.contrib import admin

# Register your models here.

# users/admin.py
from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'experience', 'location')
    search_fields = ('full_name', 'skills', 'location')
