import dj_database_url
from .base import *

DEBUG = False

ALLOWED_HOSTS = [host for host in os.environ.get('ALLOWED_HOSTS', '').split(',') if host]

database_url = os.environ.get('DATABASE_URL')
use_sqlite = os.environ.get('USE_SQLITE', 'false').lower() == 'true'

if database_url and not use_sqlite:
    DATABASES = {
        'default': dj_database_url.config(
            default=database_url,
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

CORS_ALLOWED_ORIGINS = [
    origin for origin in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',') if origin
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
