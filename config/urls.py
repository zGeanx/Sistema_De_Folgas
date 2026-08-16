from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'status': 'online',
        'message': 'API do Sistema de Folgas operacional',
        'endpoints': {
            'solicitacoes': '/api/solicitacoes/',
            'auth': '/api/auth/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.api.urls')),
    path('api/', include('apps.escala.api.urls')),
]
