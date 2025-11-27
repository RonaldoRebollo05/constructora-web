from django.contrib import admin
from .models import Proyecto, Contacto

# Esto hace que aparezca en el panel
admin.site.register(Proyecto)
admin.site.register(Contacto)