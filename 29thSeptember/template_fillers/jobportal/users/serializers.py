from rest_framework import serializers
from .models import User, Profile, JobPost
#Level 3 - 
from .models import  JobApplication
from django.conf import settings
#User = settings.AUTH_USER_MODEL
#You can define nested serializers so that one JSON request can create all linked records.

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class ProfileSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"

       ## ✅ remove 'fields' option with exclude,    fields = '__all__'
        # exclude = ['user']  # 🔹 Do not expect 'user' field from JSON input


"""class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
       ## ✅ remove 'fields' option with exclude,    fields = '__all__'
        exclude = ['user']  # 🔹 Same reason — handled in UserSerializer.create()
        """


class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        #remove field with exclude option
       # fields = ['title', 'description', 'location', 'salary_range', 'job_type']
        #commit second time
        #exclude = ['user']  # 🔹 Same reason — handled in UserSerializer.create()
        fields = [
            'id', 'user', 'company_name', 'title', 'description',
            'location', 'posted_on', 'salary_range', 'job_type',
            'availability', 'status','posted_on', 'gst_number'
        ]
        read_only_fields = ['id','user', 'posted_on']



""" class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username','password']
"""
"""write_only=True means the API accepts the password during creation but does not return it in the response.
 why your Postman response shows the user created successfully but does not expose the password, for security reasons."""

"""extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data.get('username') or validated_data['email'].split('@')[0]
        )
        user.set_password(validated_data['password'])
        user.save()
        return user """
        
class UserSerializer(serializers.ModelSerializer):
    
#required=false, denotes, postmanclient signup, no need to pass this data    
    profile = ProfileSerializer(required=False)
    job_posts = JobPostSerializer(many=True,required=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'profile', 'job_posts']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        job_posts_data = validated_data.pop('job_posts')
        #Django automatically hashes the password before saving it in the database.
#So even if you look in the DB, you’ll see a hashed string, not the plain password.
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, **profile_data)
        for job_data in job_posts_data:
            JobPost.objects.create(user=user, **job_data)
        return user

# Not heavy UserSerializer.create() (with profile/job posts) to be used during signup — because signup should just create a plain user.”
class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create only the user — no profile or job post
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
        
from .models import JobPost


class JobPostBulkSerializer(serializers.Serializer):
    job_posts = JobPostSerializer(many=True)

    def create(self, validated_data):
        job_posts_data = validated_data['job_posts']
        job_posts_instances = [JobPost(**job_data) for job_data in job_posts_data]
        return JobPost.objects.bulk_create(job_posts_instances)
        
        
#Level 3 - serializers
""" class MailSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.email')
    recipient_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Mail
        fields = ['id', 'sender', 'recipient_email', 'subject', 'body', 'sent_on', 'sent_via_email']
        read_only_fields = ['id', 'sent_on', 'sent_via_email']

    def create(self, validated_data):
        sender = self.context['request'].user
        recipient_email = validated_data.pop('recipient_email')
        try:
            recipient = User.objects.get(email=recipient_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"recipient_email": "User with this email does not exist."})

        mail = Mail.objects.create(sender=sender, recipient=recipient, **validated_data)
        return mail
"""

class JobApplicationSerializer(serializers.ModelSerializer):
    #applicant = serializers.PrimaryKeyRelatedField(read_only=True)
    #resume_id = serializers.PrimaryKeyRelatedField(queryset=Resume.objects.all(), source='resume', write_only=True, required=False)
  # Allow direct resume upload
    resume_file = serializers.FileField(write_only=True, required=False)
    #disconnect seperate model fo resume: resume = ResumeSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'applicant', 'resume', 'resume_file', 'cover_letter', 'applied_on', 'status']
        read_only_fields = ['job', 'applicant', 'applied_on', 'status']

    def create(self, validated_data):
        resume_file = validated_data.pop('resume_file', None)
        applicant = self.context['request'].user

        # Save resume if uploaded inline
        resume_instance = None
        if resume_file:
           # resume_instance = Resume.objects.create(user=applicant, file=resume_file)
           application = JobApplication.objects.create(
            **validated_data,
            applicant=applicant,
            resume=resume_file
        )
        else:
            raise serializers.ValidationError({"resume_file": "Resume file is required."})

    
        return application


class ApplicantProfileSerializer(serializers.ModelSerializer):
    # minimal profile fields for owner to view
    class Meta:
        model = Profile
        fields = ['id', 'full_name', 'location', 'skills', 'experience']


class ApplicantListSerializer(serializers.ModelSerializer):
    applicant = serializers.SerializerMethodField()
    resume = serializers.SerializerMethodField()  # updated to return full URL instead of ID

    class Meta:
        model = JobApplication
        fields = ['id', 'applicant', 'resume', 'cover_letter', 'applied_on', 'status']

    def get_applicant(self, obj):
        """Return applicant details from user and related profile."""
        profile = getattr(obj.applicant, 'profile', None)
        if profile:
            return {
                'user_id': obj.applicant.id,
                'email': obj.applicant.email,
                'full_name': profile.full_name,
                'skills': profile.skills,
                'experience': profile.experience,
            }
        return {'user_id': obj.applicant.id, 'email': obj.applicant.email}

    def get_resume(self, obj):
        """Return resume details (id + file URL) if available.
        if obj.resume and obj.resume.file:
            request = self.context.get('request')
            return {
                'id': obj.resume.id,
                'file_url': request.build_absolute_uri(obj.resume.file.url)
            }
        return None """
        """Return resume file URL if available."""
        #obj.resume ➜ is just a FieldFile object (a wrapper for the uploaded file). It has only .url and .name
        if obj.resume:
            request = self.context.get('request')
            return {'file_url': request.build_absolute_uri(obj.resume.url)}
        return None
        
# View applied jobs
class JobPostSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['id', 'title', 'location', 'job_type', 'salary_range']

class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobPostSimpleSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'cover_letter', 'applied_on', 'status', 'resume']
