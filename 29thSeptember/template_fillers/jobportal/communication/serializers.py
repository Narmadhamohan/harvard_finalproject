from rest_framework import serializers
from .models import Mail
from django.contrib.auth import get_user_model

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class MailSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)
    recipient = UserMiniSerializer(read_only=True)

    #  recipient = serializers.PrimaryKeyRelatedField(
    #    queryset=User.objects.all(),
    #    required=False,
    #    allow_null=True
    recipient_email = serializers.EmailField(
        required=False,
        allow_blank=True,
        allow_null=True
    )
    content = serializers.CharField(source='body', read_only=True)
    timestamp = serializers.DateTimeField(source='sent_on', read_only=True)

    class Meta:
        model = Mail
        fields = [
            'id',
            'sender',
            'recipient',
            'recipient_email',
            'subject',
            'body',
            'content',      # aliased for frontend
            'timestamp',    # aliased for frontend
            'mail_type',
        ]
