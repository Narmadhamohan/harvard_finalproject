from django.db import models
from django.contrib.auth.models import AbstractUser
#Added for Level 3
from django.conf import settings

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
   # username = models.CharField(max_length=100, unique=False, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=150, blank=True)
    skills = models.TextField(blank=True)
    education = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    # added later for bulk upload
    location = models.CharField(max_length=150, blank=True)
    full_name = models.CharField(max_length=200, blank=True)
    # added to know online or offline trainer - i future, this will be checkbox field - question
    preferred_mode = models.CharField(
        max_length=200, 
        blank=True, 
        help_text="e.g., Online / Offline / Hybrid"
    )
    def __str__(self):
        return f"{self.full_name or self.user.email}"

"""class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email} - {self.file.name}"""
    
# ------------------------
# JOB POST MODEL
# ------------------------
class JobPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_posts')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)
    posted_on = models.DateTimeField(auto_now_add=True)
    salary_range = models.CharField(max_length=100, blank=True)
    job_type = models.CharField(max_length=100, blank=True, help_text="e.g., Full-time / Part-time / Freelance")
    availability = models.CharField(
        max_length=50,
        choices=[
            ('Full Day', 'Full Day'),
            ('Half Day', 'Half Day'),
            ('Evening Hours', 'Evening Hours'),
        ],
        default='Full Day'
    )
    def __str__(self):
        return self.title
        

#Level 1 - Token, new user reg
#Level 2 - Bulk upload of data for user and jb post, search, filters and pagination
#Level 3 - Tasks - Mail and posted jobs    
#User = settings.AUTH_USER_MODEL
    
class Mail(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_mails')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_mails')
    subject = models.CharField(max_length=255)
    body = models.TextField()
    sent_on = models.DateTimeField(auto_now_add=True)
    sent_via_email = models.BooleanField(default=False)  # whether we actually emailed too

    def __str__(self):
        return f"{self.subject} -> {self.recipient}"
        
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]
    job = models.ForeignKey('JobPost', on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    #resume = models.ForeignKey('Resume', on_delete=models.SET_NULL, null=True, blank=True)
    resume = models.FileField(upload_to='resumes/',null=True,blank=True)
    cover_letter = models.TextField(blank=True)
    applied_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')

    class Meta:
        unique_together = ('job', 'applicant')  # prevent duplicate applications

    def __str__(self):
        return f"{self.applicant} -> {self.job}"
        
