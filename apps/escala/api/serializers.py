from rest_framework import serializers
from django.contrib.auth.models import User
from apps.escala.models import SolicitacaoFolga


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = fields


class SolicitacaoFolgaSerializer(serializers.ModelSerializer):
    
    usuario_info = UserSerializer(source='usuario', read_only=True)
    aprovado_por_info = UserSerializer(source='aprovado_por', read_only=True)
    
    dia_semana_display = serializers.CharField(
        source='get_dia_semana_display',
        read_only=True
    )
    turno_display = serializers.CharField(
        source='get_turno_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = SolicitacaoFolga
        fields = [
            'id',
            'usuario',
            'usuario_info',
            'cartomante_nome',
            'dia_semana',
            'dia_semana_display',
            'turno',
            'turno_display',
            'status',
            'status_display',
            'data_solicitacao',
            'data_acao',
            'observacao',
            'aprovado_por',
            'aprovado_por_info'
        ]
        read_only_fields = [
            'id',
            'usuario',
            'status',
            'data_solicitacao',
            'data_acao',
            'aprovado_por',
            'usuario_info',
            'aprovado_por_info',
            'dia_semana_display',
            'turno_display',
            'status_display'
        ]
    
    def validate(self, data):
        request = self.context.get('request')
        if not request:
            return data
        
        usuario = request.user
        dia_semana = data.get('dia_semana')
        turno = data.get('turno')
        
        queryset = SolicitacaoFolga.objects.filter(
            usuario=usuario,
            dia_semana=dia_semana,
            turno=turno,
            status__in=['pendente', 'aprovada']
        )
        
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError(
                f"Você já possui uma solicitação ativa para "
                f"{dict(SolicitacaoFolga.DIAS_SEMANA)[dia_semana]} "
                f"no turno da {dict(SolicitacaoFolga.TURNOS)[turno]}."
            )
        
        folgas_ativas = SolicitacaoFolga.objects.filter(
            usuario=usuario,
            status__in=['pendente', 'aprovada']
        )
        
        if self.instance:
            folgas_ativas = folgas_ativas.exclude(pk=self.instance.pk)
        
        if folgas_ativas.count() >= 3:
            raise serializers.ValidationError(
                'Você já possui 3 solicitações de folga ativas. '
                'Limite máximo atingido.'
            )
        
        return data


class AprovarRecusarSerializer(serializers.Serializer):
    observacao = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text='Motivo da recusa ou observações'
    )
