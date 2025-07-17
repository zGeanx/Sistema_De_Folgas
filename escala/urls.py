from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SolicitacaoFolgaViewSet

router = DefaultRouter()
router.register(r'solicitacoes', SolicitacaoFolgaViewSet, basename='solicitacaofolga')

urlpatterns = [
    path('', include(router.urls)),
]