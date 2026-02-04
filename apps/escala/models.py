from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone


class SolicitacaoFolga(models.Model):
    DIAS_SEMANA = (
        ("segunda", "Segunda-feira"),
        ("terca", "Terça-feira"),
        ("quarta", "Quarta-feira"),
        ("quinta", "Quinta-feira"),
        ("sexta", "Sexta-feira"),
        ("sabado", "Sábado"),
        ("domingo", "Domingo"),
    )
    TURNOS = (
        ("manha", "Manhã"),
        ("tarde", "Tarde"),
        ("noite", "Noite"),
    )
    STATUS_CHOICES = (
        ("pendente", "Pendente"),
        ("aprovada", "Aprovada"),
        ("recusada", "Recusada"),
    )

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='solicitacoes_folga',
        verbose_name='Usuário'
    )
    
    cartomante_nome = models.CharField(
        max_length=100,
        verbose_name='Nome do Cartomante'
    )
    dia_semana = models.CharField(
        max_length=10,
        choices=DIAS_SEMANA,
        verbose_name='Dia da Semana'
    )
    turno = models.CharField(
        max_length=10,
        choices=TURNOS,
        verbose_name='Turno'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pendente",
        verbose_name='Status'
    )
    
    data_solicitacao = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data da Solicitação'
    )
    data_acao = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Data da Ação'
    )
    
    observacao = models.TextField(
        blank=True,
        default="",
        verbose_name='Observação',
        help_text='Motivo da recusa ou observações gerais'
    )
    aprovado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='folgas_aprovadas',
        verbose_name='Aprovado Por'
    )

    class Meta:
        db_table = 'solicitacoes_folga'
        ordering = ['-data_solicitacao']
        verbose_name = 'Solicitação de Folga'
        verbose_name_plural = 'Solicitações de Folga'
        
        indexes = [
            models.Index(fields=['status', 'dia_semana']),
            models.Index(fields=['usuario', 'data_solicitacao']),
            models.Index(fields=['status']),
        ]

    def clean(self):
        super().clean()
        
        if self.usuario:
            folgas_ativas = SolicitacaoFolga.objects.filter(
                usuario=self.usuario,
                status__in=['pendente', 'aprovada']
            )
            
            if self.pk:
                folgas_ativas = folgas_ativas.exclude(pk=self.pk)
            
            if folgas_ativas.count() >= 3:
                raise ValidationError(
                    'Você já possui 3 solicitações de folga ativas. '
                    'Limite máximo atingido.'
                )
            
            duplicata = SolicitacaoFolga.objects.filter(
                usuario=self.usuario,
                dia_semana=self.dia_semana,
                turno=self.turno,
                status__in=['pendente', 'aprovada']
            )
            
            if self.pk:
                duplicata = duplicata.exclude(pk=self.pk)
            
            if duplicata.exists():
                raise ValidationError(
                    f'Você já possui uma solicitação ativa para '
                    f'{self.get_dia_semana_display()} no turno da '
                    f'{self.get_turno_display()}.'
                )

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_instance = SolicitacaoFolga.objects.get(pk=self.pk)
                if old_instance.status != self.status and self.status in ['aprovada', 'recusada']:
                    self.data_acao = timezone.now()
            except SolicitacaoFolga.DoesNotExist:
                pass
        
        # Validação apenas se validate=True for passado
        if kwargs.pop('validate', False):
            self.full_clean()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.cartomante_nome} - "
            f"{self.get_dia_semana_display()} "
            f"({self.get_turno_display()}) - "
            f"{self.get_status_display()}"
        )
