from django.db import models
from django.contrib.auth.models import User

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

    cartomante_nome = models.CharField(max_length=100)
    dia_semana = models.CharField(max_length=10, choices=DIAS_SEMANA)
    turno = models.CharField(max_length=10, choices=TURNOS)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pendente")
    data_solicitacao = models.DateTimeField(auto_now_add=True)
    data_acao = models.DateTimeField(null=True, blank=True)

    def __str__(self):
          return f"Solicitação de {self.cartomante_nome} ({self.id})"
