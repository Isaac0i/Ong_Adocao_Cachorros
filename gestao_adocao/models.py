from django.db import models
from django.core.validators import MaxValueValidator


class Adotante(models.Model):
 
    # Dados pessoais
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    endereco = models.TextField()
    doc_identificacao = models.ImageField(upload_to="documento/")

    def __str__(self):
        return self.nome_completo

class FotoMoradia(models.Model):
    adotante = models.ForeignKey(Adotante, on_delete=models.CASCADE, related_name='fotos')
    foto = models.ImageField(upload_to="fotos_moradia/")

    def __str__(self):
        return f'Foto de {self.adotante.nome_completo}'
