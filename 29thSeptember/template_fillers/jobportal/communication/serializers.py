from rest_framework import serializers
from .models import Mail

class MailSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Mail
        fields = '__all__'
