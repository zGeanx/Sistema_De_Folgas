import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Cria um superusuário de forma não-interativa.'

    def handle(self, *args, **options):
        username = os.environ.get('SUPERUSER_USERNAME')
        email = os.environ.get('SUPERUSER_EMAIL')
        password = os.environ.get('SUPERUSER_PASSWORD')

        if not all([username, email, password]):
            self.stdout.write(self.style.ERROR('As variáveis de ambiente SUPERUSER_USERNAME, SUPERUSER_EMAIL e SUPERUSER_PASSWORD precisam ser definidas.'))
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(f'Superusuário com o nome de usuário "{username}" já existe.'))
        else:
            self.stdout.write(f'Criando superusuário "{username}"...')
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Superusuário "{username}" criado com sucesso!'))