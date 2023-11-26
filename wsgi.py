import os

from django.core.wsgi import get_wsgi_application

# Set the DJANGO_SETTINGS_MODULE environment variable to point to your settings file
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SuperMarketYaY.settings')

# Get the WSGI application from Django
application = get_wsgi_application()