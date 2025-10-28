from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

class APIKeyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        api_key = request.headers.get('X-API-KEY')
        valid_key = getattr(settings, 'EXTERNAL_MAIL_API_KEY', None)

        if not api_key or api_key != valid_key:
            raise AuthenticationFailed('Invalid or missing API key.')

        # External systems don’t have a user → return None for user
        return (None, None)
