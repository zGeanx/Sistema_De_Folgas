from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Count, Q
from django.contrib.auth.models import User

from apps.escala.models import SolicitacaoFolga
from .serializers import SolicitacaoFolgaSerializer, AprovarRecusarSerializer


class SolicitacaoFolgaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar solicitações de folga
    """
    queryset = SolicitacaoFolga.objects.all().order_by('-data_solicitacao')
    serializer_class = SolicitacaoFolgaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = SolicitacaoFolga.objects.all().order_by('-data_solicitacao')
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            # Obtém ou cria usuário de sistema para solicitações anônimas
            user, _ = User.objects.get_or_create(
                username='sistema',
                defaults={'is_staff': False, 'is_active': True}
            )
        serializer.save(usuario=user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def aprovar(self, request, pk=None):
        folga = self.get_object()
        folga.status = 'aprovada'
        if request.user.is_authenticated:
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

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def recusar(self, request, pk=None):
        folga = self.get_object()
        folga.status = 'recusada'
        if request.user.is_authenticated:
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

    @action(detail=False, methods=['get'])
    def minhas_folgas(self, request):
        if request.user.is_authenticated:
            folgas = SolicitacaoFolga.objects.filter(usuario=request.user).order_by('-data_solicitacao')
        else:
            folgas = SolicitacaoFolga.objects.all().order_by('-data_solicitacao')

        serializer = self.get_serializer(folgas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        queryset = SolicitacaoFolga.objects.all()

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

        # Retorna lista direta sem paginação para compatibilidade com o frontend
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
