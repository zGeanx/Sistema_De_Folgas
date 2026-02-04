from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q

from apps.escala.models import SolicitacaoFolga
from .serializers import SolicitacaoFolgaSerializer, AprovarRecusarSerializer
from .permissions import IsOwnerOrAdmin


class SolicitacaoFolgaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar solicitações de folga
    
    Endpoints:
    - GET /api/solicitacoes/ - Listar solicitações
    - POST /api/solicitacoes/ - Criar nova solicitação
    - GET /api/solicitacoes/{id}/ - Detalhes de uma solicitação
    - PUT/PATCH /api/solicitacoes/{id}/ - Atualizar solicitação
    - DELETE /api/solicitacoes/{id}/ - Deletar solicitação
    - POST /api/solicitacoes/{id}/aprovar/ - Aprovar folga (admin only)
    - POST /api/solicitacoes/{id}/recusar/ - Recusar folga (admin only)
    - GET /api/solicitacoes/minhas_folgas/ - Minhas solicitações
    - GET /api/solicitacoes/estatisticas/ - Dashboard stats
    """
    
    serializer_class = SolicitacaoFolgaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        queryset = SolicitacaoFolga.objects.select_related('usuario', 'aprovado_por')
        
        user = self.request.user
        
        if user.is_staff:
            return queryset.order_by('-data_solicitacao')
        
        return queryset.filter(usuario=user).order_by('-data_solicitacao')
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def aprovar(self, request, pk=None):
        folga = self.get_object()
        
        if folga.status != 'pendente':
            return Response(
                {'error': 'Apenas solicitações pendentes podem ser aprovadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folga.status = 'aprovada'
        folga.aprovado_por = request.user
        folga.data_acao = timezone.now()
        
        serializer = AprovarRecusarSerializer(data=request.data)
        if serializer.is_valid():
            folga.observacao = serializer.validated_data.get('observacao', '')
        
        folga.save()
        
        return Response(
            SolicitacaoFolgaSerializer(folga).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def recusar(self, request, pk=None):
        folga = self.get_object()
        
        if folga.status != 'pendente':
            return Response(
                {'error': 'Apenas solicitações pendentes podem ser recusadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AprovarRecusarSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        folga.status = 'recusada'
        folga.aprovado_por = request.user
        folga.data_acao = timezone.now()
        folga.observacao = serializer.validated_data.get('observacao', '')
        folga.save()
        
        return Response(
            SolicitacaoFolgaSerializer(folga).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def minhas_folgas(self, request):
        folgas = SolicitacaoFolga.objects.filter(
            usuario=request.user
        ).select_related('usuario', 'aprovado_por').order_by('-data_solicitacao')
        
        serializer = self.get_serializer(folgas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        if request.user.is_staff:
            queryset = SolicitacaoFolga.objects.all()
        else:
            queryset = SolicitacaoFolga.objects.filter(usuario=request.user)
        
        stats = queryset.aggregate(
            total=Count('id'),
            pendentes=Count('id', filter=Q(status='pendente')),
            aprovadas=Count('id', filter=Q(status='aprovada')),
            recusadas=Count('id', filter=Q(status='recusada'))
        )
        
        por_turno = queryset.filter(status='aprovada').values('turno').annotate(
            count=Count('id')
        )
        
        stats['por_turno'] = {item['turno']: item['count'] for item in por_turno}
        
        return Response(stats)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        status_param = request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        dia_semana_param = request.query_params.get('dia_semana', None)
        if dia_semana_param:
            queryset = queryset.filter(dia_semana=dia_semana_param)
        
        turno_param = request.query_params.get('turno', None)
        if turno_param:
            queryset = queryset.filter(turno=turno_param)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
