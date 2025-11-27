from django.db import models

class Proyecto(models.Model):
    CATEGORIAS = [
        ('Corporativo', 'Corporativo'),
        ('Residencial', 'Residencial'),
        ('Urbano', 'Urbano'),
        ('Interiorismo', 'Interiorismo'),
    ]

    titulo = models.CharField(max_length=200)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='proyectos/')
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

class Contacto(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True) # Se guarda la hora automática

    def __str__(self):
        return f"Mensaje de {self.nombre}"