from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('escala', '0002_unique_active_folga_per_user_shift'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitacaofolga',
            name='usuario',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.deletion.CASCADE,
                related_name='solicitacoes_folga',
                to='auth.user',
                verbose_name='Usuário',
            ),
        ),
    ]
