from django.contrib import admin
from .models import SolicitacaoFolga

@admin.register(SolicitacaoFolga)
class SolicitacaoFolgaAdmin(admin.ModelAdmin):
    list_display = ('cartomante_nome', 'dia_semana', 'turno', 'status', 'data_solicitacao')

    list_filter = ('status', 'dia_semana', 'turno')

    search_fields = ('cartomante_nome',)

    list_editable = ('status',)