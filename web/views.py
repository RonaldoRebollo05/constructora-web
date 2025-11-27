from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt # Permite recibir datos externos
import json
from .models import Proyecto, Contacto

def index(request):
    return render(request, 'web/index.html')

def api_proyectos(request):
    proyectos = Proyecto.objects.all()
    data = []
    for p in proyectos:
        data.append({
            'titulo': p.titulo,
            'categoria': p.categoria,
            'descripcion': p.descripcion,
            'imagen': p.imagen.url if p.imagen else '' 
        })
    return JsonResponse(data, safe=False)

@csrf_exempt 
def api_contacto(request):
    if request.method == 'POST':
        # 1. Convertimos los datos que vienen de JS (JSON) a Python
        data = json.loads(request.body)
        
        # 2. Creamos y guardamos el mensaje en la BD
        Contacto.objects.create(
            nombre=data['nombre'],
            email=data['email'],
            mensaje=data['mensaje']
        )
        
        # 3. Respondemos que todo salió bien
        return JsonResponse({'status': 'ok', 'mensaje': 'Recibido correctamente'})
        
    return JsonResponse({'status': 'error'}, status=400)