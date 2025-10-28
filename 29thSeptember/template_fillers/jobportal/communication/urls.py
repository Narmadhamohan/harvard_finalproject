from communication.views import MailViewSet
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'mails', MailViewSet, basename='mail')

urlpatterns = [
    
    path('api/', include(router.urls)),
]