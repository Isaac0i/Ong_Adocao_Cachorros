from django.db import models
from django.core.validators import MaxValueValidator


class Adotante(models.Model):
 
    # Dados pessoais
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20)
    endereco = models.TextField()

   