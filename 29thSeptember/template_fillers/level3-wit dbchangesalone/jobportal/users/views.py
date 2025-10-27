from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from .models import User, Profile, Resume
from .serializers import UserSerializer, ProfileSerializer, ResumeSerializer, SignupSerializer, JobPostSerializer
from rest_framework.decorators import action
from django.contrib.auth import authenticate

#bulk view
from rest_framework.views import APIView
from rest_framework import status

#below one added for user bulk load
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser

#below one added for job post bulk
from .serializers import JobPostBulkSerializer
from .models import JobPost

# below one for filter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

#below one for Task3  - Pagination
from .pagination import StandardResultsSetPagination
from .pagination import InfiniteScrollPagination




class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            return Response({'message': 'Login successful', 'user_id': user.id})
        return Response({'error': 'Invalid credentials'}, status=400)

#POST /api/users/signup/
    
    @action(detail=False, methods=['post'], url_path='signup',  permission_classes=[permissions.AllowAny])
    def signup(self, request):
        #serializer = UserSerializer(data=request.data)
        #serializer = self.get_serializer(data=request.data)
        serializer = SignupSerializer(data=request.data)  # use separate serializer
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {'message': 'User registered successfully', 'user_id': user.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    # Task 2: Add filtering and sorting
    #filter_backends = [filters.SearchFilter, filters.OrderingFilter]
      # Add filtering, search, and ordering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Exact field filtering
    filterset_fields = ['location']  # now you can filter by ?location=Bangalore
    search_fields = ['skills', 'education']
    ordering_fields = ['experience', 'full_name']
    
    #Task 3: Pagination
    pagination_class = StandardResultsSetPagination

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
# JOB POST FILTER VIEW
class JobPostViewSet(viewsets.ModelViewSet):
    queryset = JobPost.objects.all().order_by('-posted_on')
    serializer_class = JobPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    #Task 2 - Filter and search
    filterset_fields = ['availability', 'location', 'job_type', 'user__email']
    search_fields = ['title', 'description', 'posted_by']
    ordering_fields = ['posted_on', 'salary_range']
    
    #Task 3 - Pagination
    pagination_class = InfiniteScrollPagination  # 👈 Infinite scroll



# Create your views here.


#below one added for bulk upload
User = get_user_model()

class BulkUserUploadAPIView(APIView):
    def post(self, request):
        users_data = request.data.get('users', [])
        created_users = []
        errors = []

        for data in users_data:
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                created_users.append(serializer.data)
            else:
                errors.append(serializer.errors)

        return Response(
            {"created": created_users, "errors": errors},
            status=status.HTTP_201_CREATED if not errors else status.HTTP_207_MULTI_STATUS
        )


class JobPostBulkUploadView(APIView):
    def post(self, request):
        serializer = JobPostBulkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Job posts uploaded successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)