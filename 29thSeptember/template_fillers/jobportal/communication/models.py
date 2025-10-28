from django.db import models
from django.conf import settings

class Mail(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_mails'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, 
        related_name='received_mails', null=True, blank=True
    )
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    body = models.TextField()
    sent_on = models.DateTimeField(auto_now_add=True)
    sent_via_email = models.BooleanField(default=False)

    mail_type = models.CharField(
        max_length=20,
        choices=[('internal', 'Internal'), ('external', 'External')],
        default='internal'
    )

    def __str__(self):
        return f"{self.subject} ({self.mail_type})"
