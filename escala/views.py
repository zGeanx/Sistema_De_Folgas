from rest_framework import viewsets, permissions
from .models import SolicitacaoFolga
from .serializers import SolicitacaoFolgaSerializer

class SolicitacaoFolgaViewSet(viewsets.ModelViewSet):
    queryset = SolicitacaoFolga.objects.all().order_by('-data_solicitacao')
    serializer_class = SolicitacaoFolgaSerializer
    
    permission_classes = [permissions.AllowAny]