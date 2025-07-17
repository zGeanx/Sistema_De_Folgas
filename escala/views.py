from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SolicitacaoFolga
from .serializers import SolicitacaoFolgaSerializer

class SolicitacaoFolgaViewSet(viewsets.ModelViewSet):
    serializer_class = SolicitacaoFolgaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        user = self.request.user
        if user.is_staff:
            return SolicitacaoFolga.objects.all()
        return SolicitacaoFolga.objects.filter(cartomante=user)

    def perform_create(self, serializer):
        serializer.save(cartomante=self.request.user)

    @action(detail=True, methods=['put'], permission_classes=[permissions.IsAdminUser])
    def aprovar(self, request, pk=None):
        solicitacao = self.get_object()
        solicitacao.status = 'aprovada'
        solicitacao.save()
        return Response({'status': 'Solicitação aprovada'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'], permission_classes=[permissions.IsAdminUser])
    def recusar(self, request, pk=None):
        solicitacao = self.get_object()
        solicitacao.status = 'recusada'
        solicitacao.save()
        return Response({'status': 'Solicitação recusada'}, status=status.HTTP_200_OK)