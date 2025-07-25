from django.contrib import admin
from .models import SolicitacaoFolga

@admin.register(SolicitacaoFolga)
class SolicitacaoFolgaAdmin(admin.ModelAdmin):
    list_display = ('cartomante_nome', 'dia_da_folga', 'turno_da_folga', 'status', 'data_solicitacao')

    list_filter = ('status', 'dia_semana', 'turno')
    search_fields = ('cartomante_nome',)
    list_editable = ('status',)

    ordering = ('-data_solicitacao',)

    @admin.display(description='Dia da Semana')
    def dia_da_folga(self, obj):
        return obj.get_dia_semana_display()

    @admin.display(description='Turno')
    def turno_da_folga(self, obj):
        return obj.get_turno_display()