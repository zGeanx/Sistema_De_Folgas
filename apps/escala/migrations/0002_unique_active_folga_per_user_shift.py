from django.db import migrations, models
from django.db.models import Q


class Migration(migrations.Migration):

    dependencies = [
        ('escala', '0001_initial'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='solicitacaofolga',
            constraint=models.UniqueConstraint(
                condition=Q(('status__in', ['pendente', 'aprovada'])),
                fields=('usuario', 'dia_semana', 'turno'),
                name='unique_active_folga_per_user_shift',
            ),
        ),
    ]
