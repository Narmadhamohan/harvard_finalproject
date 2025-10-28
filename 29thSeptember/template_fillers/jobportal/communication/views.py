from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action, authentication_classes, permission_classes
from django.core.mail import send_mail as django_send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Mail
from .serializers import MailSerializer
from .authentication import APIKeyAuthentication


class MailViewSet(viewsets.ModelViewSet):
    queryset = Mail.objects.all().order_by('-sent_on')
    serializer_class = MailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        box = self.request.query_params.get('box', 'inbox')  # default inbox

        if box == 'sent':
            return Mail.objects.filter(sender=user).order_by('-sent_on')
        return Mail.objects.filter(recipient=user).order_by('-sent_on')


    def perform_create(self, serializer):
        sender = self.request.user if self.request.user.is_authenticated else None
        recipient = serializer.validated_data.get('recipient')
        recipient_email = serializer.validated_data.get('recipient_email')

        mail = serializer.save(sender=sender)

        # 🔹 Determine mail type
        UserModel = get_user_model()
        if recipient:
            mail.mail_type = 'internal'
        else:
            try:
                user = UserModel.objects.get(email=recipient_email)
                mail.recipient = user
                mail.mail_type = 'internal'
            except UserModel.DoesNotExist:
                mail.mail_type = 'external'
        mail.save()

        # 🔹 Send mail via Django email system
        try:
            django_send_mail(
                subject=mail.subject,
                message=mail.body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            mail.sent_via_email = True
            mail.save()
        except Exception:
            pass


    # 🔹 External API endpoint (no login, just API key)
    @action(detail=False, methods=['post'], url_path='send-via-api',
            authentication_classes=[APIKeyAuthentication],
            permission_classes=[AllowAny])
    def send_via_api(self, request):
        """External systems can send mail using API key"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mail = serializer.save(sender=None, mail_type='external')

        try:
            django_send_mail(
                subject=mail.subject,
                message=mail.body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[mail.recipient_email],
                fail_silently=False,
            )
            mail.sent_via_email = True
            mail.save()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Mail sent successfully via API key",
            "data": MailSerializer(mail).data
        }, status=status.HTTP_201_CREATED)
        
    @action(detail=False, methods=['get'], url_path='sent')
    def view_sent(self, request):
        user = request.user
        mails = Mail.objects.filter(sender=user).order_by('-sent_on')
        serializer = self.get_serializer(mails, many=True)
        return Response(serializer.data)
