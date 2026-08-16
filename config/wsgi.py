import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

# Inicializa o WSGI application
application = get_wsgi_application()

# Executa as migrações automaticamente na inicialização do servidor
try:
    print("⚡ Executando migrações automáticas no banco de dados...")
    call_command('migrate', interactive=False)
    print("✅ Migrações aplicadas com sucesso no Supabase!")
except Exception as e:
    print(f"⚠️ Erro ao aplicar migrações na inicialização: {e}")
