from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from .models import User, Profile
from .serializers import ProfileWriteSerializer, UserSerializer, ProfileSerializer, SignupSerializer, JobPostSerializer
from rest_framework.decorators import action
from django.contrib.auth import authenticate

#bulk view
from rest_framework.views import APIView
from rest_framework import status

#below one added for user bulk load
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import JSONParser,MultiPartParser, FormParser

#below one added for job post bulk
from .serializers import JobPostBulkSerializer
from .models import JobPost

# below one for filter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

#below one for Task3  - Pagination
from .pagination import ProfileListInfiniteScrollPagination, StandardResultsSetPagination
from .pagination import InfiniteScrollPagination
#Level 3
from .pagination import ApplicatntInfiniteScrollPagination


#Level 3
from .models import  JobApplication, JobPost
from .serializers import  JobApplicationSerializer, ApplicantListSerializer
from django.core.mail import send_mail as django_send_mail
from rest_framework.permissions import IsAuthenticated
#For ApplicantViewSet
from django.shortcuts import get_object_or_404

#from django.conf import settings


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

    @action(detail=False, methods=["get"], url_path="me", permission_classes=[IsAuthenticated])
    def me(self, request):
        #serializer = self.get_serializer(request.user)
        from .serializers import UserMiniSerializer
        serializer = UserMiniSerializer(request.user, context={'request': request})
        return Response(serializer.data)
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
    search_fields = ['skills', 'education','full_name','location','experience']
    ordering_fields = ['experience', 'full_name']
    
    #Task 3: Pagination
    #pagination_class = StandardResultsSetPagination
    pagination_class = ProfileListInfiniteScrollPagination  # ✅ Modifying

    
    #Level 3:
    
    #Task 1:
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='send_mail')
    def send_mail(self, request, pk=None):
        profile = self.get_object()
        recipient_user = profile.user
        subject = request.data.get('subject')
        body = request.data.get('body')
        send_email_flag = request.data.get('send_email', True)

        if not subject or not body:
            return Response({'detail': 'subject and body are required.'}, status=status.HTTP_400_BAD_REQUEST)

        mail = Mail.objects.create(
            sender=request.user,
            recipient=recipient_user,
            subject=subject,
            body=body,
            sent_via_email=False
        )

        if send_email_flag:
            try:
                django_send_mail(
                    subject,
                    body,
                    settings.DEFAULT_FROM_EMAIL,
                    [recipient_user.email],
                    fail_silently=False
                )
                mail.sent_via_email = True
                mail.save()
            except Exception:
                # log if you have logger; keep mail object even if mail sending fails
                pass

        serializer = MailSerializer(mail, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    
    @action(detail=False, methods=['get'], url_path='dashboard-profile')
    def my_profile(self, request):
        profile, created =Profile.objects.get_or_create(user=request.user)    
               
        #auto-update status
        if not (profile.full_name and profile.skills and profile.location):
            profile.profile_status = "incomplete"
        else:
            profile.profile_status = "complete"

        profile.save()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
            
    @action(detail=False, methods=['get'], url_path='status', permission_classes=[IsAuthenticated])
    def profile_status(self, request):
        profile = get_object_or_404(Profile, user=request.user)

        required_fields = ['full_name', 'location', 'skills']
        missing = [f for f in required_fields if not getattr(profile, f)]

        return Response({
            "is_complete": len(missing) == 0,
            "missing_fields": missing
        })
        
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated], url_path='update')
    def update_my_profile(self, request):
        profile = get_object_or_404(Profile, user=request.user)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # ❌ Block default create (POST /api/profiles/)
    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Use /api/profiles/submit/"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ⭐ Main Profile API — create/update in one place
    @action(detail=False, methods=['post'], url_path="submit")
    def submit_profile(self, request):

        profile, created = Profile.objects.get_or_create(user=request.user)
        print("Raw request.body:", request.body)      # JSON string
        print("request.data:", request.data)    # Parsed dictionary
        serializer = ProfileWriteSerializer(profile, data=request.data, partial=True)
        print("Data in serializer: ",request.data)
        print("serializer initial_data:", serializer.initial_data)
        print("serializer.is_valid()?:", serializer.is_valid())
        print("serializer.validated_data:", serializer.validated_data)
        if serializer.is_valid():
           # serializer.save(user=request.user)
            serializer.save()
            return Response({
                "message": "Profile saved successfully",
                "created": created,
                "profile": ProfileSerializer(profile).data
            })

        return Response(serializer.errors, status=400)


"""class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # 👈 This is REQUIRED
"""
    
# JOB POST FILTER VIEW
#JobPostViewSet → for listing jobs, applying for a job, (viewing applicants (all mixed) - issues in filtering with posted-on)
#so lets plit up that particular method
"""
V2.0
We’ll split into:

JobPostViewSet — handles listing, searching, filtering, applying

JobApplicationViewSet — handles viewing applicants per job (and filtering/sorting by applicant data)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='applicants')
    def applicants(self, request, pk=None):
        job = self.get_object()
        # only job owner may view applicants
        #if not hasattr(job, 'user') or job.user != request.user:
        print(f"job.user",job.user)
        print(f"request.user",request.user)

        if job.user != request.user:
            return Response({'detail': 'Not allowed. Only job owner may view applicants.'}, status=status.HTTP_403_FORBIDDEN)

        applications = job.applications.select_related('applicant').order_by('-applied_on')
        page = self.paginate_queryset(applications)
        serializer = ApplicantListSerializer(page if page is not None else applications, many=True, context={'request': request})
        if page is not None      :
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

"""
class JobPostViewSet(viewsets.ModelViewSet):
    queryset = JobPost.objects.all().order_by('-posted_on')
    serializer_class = JobPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    #Task 2 - Filter and search
    filterset_fields = ['availability', 'location', 'job_type', 'user__email']
    search_fields = ['title', 'description', 'posted_on','location','job_type']
    ordering_fields = ['posted_on', 'salary_range']
    
    #Task 3 - Pagination
    pagination_class = InfiniteScrollPagination  # 👈 Infinite scroll

    #Level 3
    #Task 1:
    parser_classes = [JSONParser, MultiPartParser, FormParser]  # 👈 Allow file uploads
    
    #Level 4
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='apply')
    def apply(self, request, pk=None):
        job = self.get_object()
        user = request.user
        print("FILES RECEIVED:", request.FILES)
        print("DATA RECEIVED:", request.data)
        # prevent owner from applying to their own job
        if hasattr(job, 'user') and job.user == user:
            return Response({'detail': "Owner cannot apply to their own job."}, status=status.HTTP_400_BAD_REQUEST)

        # prevent duplicate applications
        if JobApplication.objects.filter(job=job, applicant=user).exists():
            return Response({'detail': 'You have already applied to this job.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = JobApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            app = serializer.save(job=job,applicant=user)
            return Response(JobApplicationSerializer(app, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    # to display the lis of jobs , based on who posted items
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='my-posts')
    def my_posted_jobs(self,request):    
        user = request.user
        queryset = JobPost.objects.filter(user=user).order_by('-posted_on')
        page = self.paginate_queryset(queryset)
        serializer = JobPostSerializer(page if page else queryset, many=True)
        return self.get_paginated_response(serializer.data) if page else Response(serializer.data)
   
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='close')
    def close_job(self, request, pk=None):
        job = self.get_object()

        # 1. Only owner can close
        if job.user != request.user:
            return Response(
                {"detail": "Only the job owner can close this job."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 2. Already closed?
        if job.status == "closed":
            return Response(
                {"detail": "Job is already closed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Mark as closed
        job.status = "closed"
        job.save()

        return Response(
            {"message": "Job closed successfully.", "job_id": job.id, "status": job.status},
            status=status.HTTP_200_OK
        )

#Level 3
class JobApplicantViewSet(viewsets.ReadOnlyModelViewSet):
    """View applicants for a specific job — accessible only by the job owner."""
    serializer_class = ApplicantListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['applied_on']
    
    #LEvel 2 - Task 3 - Pagination  - Causes error with pagination for posted_on field mising on japapplicant list
    pagination_class = ApplicatntInfiniteScrollPagination  # 👈 Infinite scroll

    def get_queryset(self):
        request = self.request
        user = request.user
        job_id = self.kwargs.get('pk')  # 👈 URL pattern gives job id here

        # Fetch the job
        job = get_object_or_404(JobPost, pk=job_id)

        # ✅ Ownership check
        if job.user != user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only the job owner can view applicants for this job.")

        # ✅ Return applications linked to this job
        return JobApplication.objects.filter(job=job).select_related('applicant').order_by('-applied_on')



class MyAppliedJobsViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show applications made by the logged-in user
        user = self.request.user
        print(f"user: {user}")
        queryset = JobApplication.objects.filter(applicant=user)
            # Apply additional filter if status is passed as query parameter
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.objects.filter(status=status)
        return queryset



# Create your views here.


#below one added for bulk upload
#User = get_user_model()

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
        
#Level 3
""" class MailViewSet(viewsets.ModelViewSet):
    queryset = Mail.objects.all().order_by('-sent_on')
    serializer_class = MailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        box = self.request.query_params.get('box', 'inbox')  # inbox or sent
        if box == 'sent':
            return Mail.objects.filter(sender=user).order_by('-sent_on')
        # default inbox
        return Mail.objects.filter(recipient=user).order_by('-sent_on')

    def perform_create(self, serializer):
        sender = self.request.user
        recipient = serializer.validated_data.get('recipient')
        recipient_email = serializer.validated_data.get('recipient_email')
        subject = serializer.validated_data['subject']
        body = serializer.validated_data['body']
        mail = serializer.save(sender=sender, recipient=recipient if recipient else None)

        # If recipient_email provided but recipient not mapped, optionally map to a user (optional)
        if not recipient and recipient_email:
            # Try to find a user by email — if found, link as recipient
            from django.contrib.auth import get_user_model
            UserModel = get_user_model()
            try:
                user = UserModel.objects.get(email=recipient_email)
                mail.recipient = user
                mail.save()
            except UserModel.DoesNotExist:
                # keep recipient null or handle as external; we still store mail with recipient null
                pass

        # optional: actually send an email (async recommended in production)
        try:
            django_send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email] if recipient_email else ([mail.recipient.email] if mail.recipient else []),
                fail_silently=False,
            )
            mail.sent_via_email = True
            mail.save()
        except Exception:
            # if send fails, we keep sent_via_email False; don't raise 500
            pass

        return mail """