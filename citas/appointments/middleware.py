import os
from django.http import JsonResponse

class GatewayMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        secret = request.headers.get('X-Gateway-Secret')
        if secret != os.getenv('GATEWAY_SECRET'):
            return JsonResponse({'message': 'Access denied. Use the API Gateway.'}, status=403)
        return self.get_response(request)