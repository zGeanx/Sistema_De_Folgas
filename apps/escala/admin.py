from django.contrib import admin
from .models import SolicitacaoFolga


@admin.register(SolicitacaoFolga)
class SolicitacaoFolgaAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'cartomante_nome',
        'usuario',
        'dia_semana',
        'turno',
        'status',
        'data_solicitacao',
        'aprovado_por'
    ]
    list_filter = ['status', 'dia_semana', 'turno', 'data_solicitacao']
    search_fields = ['cartomante_nome', 'usuario__username', 'observacao']
    readonly_fields = ['data_solicitacao', 'data_acao']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('usuario', 'cartomante_nome', 'dia_semana', 'turno')
        }),
        ('Status', {
            'fields': ('status', 'aprovado_por', 'observacao')
        }),
        ('Datas', {
            'fields': ('data_solicitacao', 'data_acao'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if change:
            old_obj = SolicitacaoFolga.objects.get(pk=obj.pk)
            if old_obj.status != obj.status and obj.status in ['aprovada', 'recusada']:
                obj.aprovado_por = request.user
        
        super().save_model(request, obj, form, change)
