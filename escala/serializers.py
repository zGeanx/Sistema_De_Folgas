from rest_framework import serializers
from .models import SolicitacaoFolga

class SolicitacaoFolgaSerializer(serializers.ModelSerializer):
    cartomante = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SolicitacaoFolga
        fields = ['id', 'cartomante', 'dia_semana', 'turno', 'status', 'data_solicitacao']
        read_only_fields = ['status', 'cartomante']