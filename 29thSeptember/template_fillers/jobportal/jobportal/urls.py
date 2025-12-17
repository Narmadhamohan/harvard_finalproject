"""
URL configuration for jobportal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from users.views import UserViewSet, ProfileViewSet, JobPostViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import BulkUserUploadAPIView
#error because of .views import, instead of users.views
from users.views import JobPostBulkUploadView
#Level 3
#from users.views import MailViewSet
from users.views import JobApplicantViewSet  
from communication.urls import router as communication_router
from users.views import MyAppliedJobsViewSet

from django.conf import settings
from django.conf.urls.static import static

#added for bulkview
#from users.views import BulkUploadViewSet


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet, basename='profiles')
#router.register(r'resumes', ResumeViewSet)  
router.register(r'jobposts', JobPostViewSet, basename='jobpost')
#router.register(r'mails', MailViewSet, basename='mail')
router.register(r'applications', JobApplicantViewSet, basename='job-applications')
# view - Applied jobs
router.register(r'applicants', MyAppliedJobsViewSet, basename='job-applicant')



#added for bulkview
# - this is not viewset, so adding this line - gives error -router.register(r'bulk', BulkUserUploadAPIView, basename='bulk-upload')

schema_view = get_schema_view(
    openapi.Info(title="Job Portal API", default_version='v1'),
    public=True,
    permission_classes=(AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #Level 3
# below line is for applicants listing
    path('api/jobposts/<int:pk>/applicants/', 
         JobApplicantViewSet.as_view({'get': 'list'}), 
         name='jobpost-applicants'),
    path('api/', include(communication_router.urls)), #communication mail app added
    path('api/bulk-upload/', BulkUserUploadAPIView.as_view(), name='bulk-upload'),
    path('jobposts/bulk_upload/', JobPostBulkUploadView.as_view(), name='jobpost-bulk-upload'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)