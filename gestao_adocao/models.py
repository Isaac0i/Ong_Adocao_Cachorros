from django.db import models
from django.core.validators import MaxValueValidator


class Adotante(models.Model):
    TIPO_MORADIA_CHOICES = [
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
        ('chacara', 'Chácara'),
    ]

    STATUS_CHOICES = [
        ('em_analise',  'Aguardando Análise'),
        ('aprovado', 'Aprovado'),
        ('reprovado', 'Reprovado'),
    ]
 
    # Dados pessoais
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    endereco = models.TextField()

    # Informações sobre moradia e pets
    tipo_moradia = models.CharField(max_length=20, choices=TIPO_MORADIA_CHOICES)
    possui_outros_pets = models.BooleanField()
    motivo_adocao = models.TextField()

    # Documento de Identificação do Usuário
    doc_identificacao = models.ImageField(upload_to="documento/")

    # Controle de datas
    criado_em = models.DateField(auto_now_add=True)
    atualizado_em = models.DateField(auto_now=True)

    def __str__(self):
        return self.nome_completo

class FotoMoradia(models.Model):
    adotante = models.ForeignKey(Adotante, on_delete=models.CASCADE, related_name='fotos')
    foto = models.ImageField(upload_to="fotos_moradia/")

    def __str__(self):
        return f'Foto de {self.adotante.nome_completo}'
