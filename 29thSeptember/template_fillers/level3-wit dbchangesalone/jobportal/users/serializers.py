from rest_framework import serializers
from .models import User, Profile, Resume, JobPost

#You can define nested serializers so that one JSON request can create all linked records.


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
       ## ✅ remove 'fields' option with exclude,    fields = '__all__'
        exclude = ['user']  # 🔹 Do not expect 'user' field from JSON input


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
       ## ✅ remove 'fields' option with exclude,    fields = '__all__'
        exclude = ['user']  # 🔹 Same reason — handled in UserSerializer.create()


class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        #remove field with exclude option
       # fields = ['title', 'description', 'location', 'salary_range', 'job_type']
        exclude = ['user']  # 🔹 Same reason — handled in UserSerializer.create()


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

class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = '__all__'

class JobPostBulkSerializer(serializers.Serializer):
    job_posts = JobPostSerializer(many=True)

    def create(self, validated_data):
        job_posts_data = validated_data['job_posts']
        job_posts_instances = [JobPost(**job_data) for job_data in job_posts_data]
        return JobPost.objects.bulk_create(job_posts_instances)