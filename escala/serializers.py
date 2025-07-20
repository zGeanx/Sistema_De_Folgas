from rest_framework import serializers
from .models import SolicitacaoFolga

class SolicitacaoFolgaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitacaoFolga
        fields = ['id', 'cartomante_nome', 'dia_semana', 'turno', 'status', 'data_solicitacao']
        read_only_fields = ['status'] # Apenas o status é somente leitura na criação