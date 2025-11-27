from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from web.views import api_proyectos, index, api_contacto

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/proyectos/', api_proyectos),
    path('', index), # <--- ESTA RUTA ES LA PORTADA (Vacía = Home)
    path('api/contacto/', api_contacto),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)