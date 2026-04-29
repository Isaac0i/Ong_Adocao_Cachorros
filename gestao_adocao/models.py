from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Adotante(models.Model):
    TIPO_MORADIA_CHOICES = [
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
        ('chacara', 'Chácara'),
    ]

    OPCOES_CHOICES = [
        ('sim', 'Sim'),
        ('nao', 'Não'),
    ]
 

    STATUS_CHOICES = [
        ('em_analise',  'Aguardando Análise'),
        ('aprovado', 'Aprovado'),
        ('reprovado', 'Reprovado'),
    ]

    RENDA_FAMILIAR_CHOICES = [
        ('ate_2000', 'R$1.000 a R$2.000'),
        ('ate_3000', 'R$2.000 a R$3.000'),
        ('acima_3000', 'Acima de R$3.000'),
    ]
    PESSOAS_CHOICES = [
        ('1', '1 pessoa'),
        ('2', '2 pessoas'),
        ('3', '3 pessoas'),
        ('4', '4 pessoas'),
        ('5', '5 pessoas'),
        ('acima_5', 'Acima de 5 pessoas'),
    ]

    # Dados pessoais
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, unique=True)
    endereco = models.TextField()
    cep = models.CharField(max_length=9)
    renda_familiar = models.CharField(max_length=20, choices=RENDA_FAMILIAR_CHOICES)
    pessoas_na_familia = models.CharField(max_length=10, choices=PESSOAS_CHOICES)

    # Informações sobre moradia e pets
    tipo_moradia = models.CharField(max_length=20, choices=TIPO_MORADIA_CHOICES)
    possui_outros_pets = models.CharField(max_length=3 ,choices=OPCOES_CHOICES)
    experiencia_pets = models.CharField(max_length=3 ,choices=OPCOES_CHOICES)
    motivo_adocao = models.TextField()

    # Controle de datas
    criado_em = models.DateField(auto_now_add=True)
    atualizado_em = models.DateField(auto_now=True)

    # Status do Usuario
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='em_analise')

    def __str__(self):
        return self.nome_completo

class FotoMoradia(models.Model):
    adotante = models.ForeignKey(Adotante, on_delete=models.CASCADE, related_name='fotos')
    foto = models.ImageField(upload_to="fotos_moradia/")

    def __str__(self):
        return f'Foto de {self.adotante.nome_completo}'

class DocumentoIdentificacao(models.Model):
    adotante = models.ForeignKey(Adotante, on_delete=models.CASCADE, related_name='documentos')
    doc_identificacao = models.ImageField(upload_to="documento/")

    def __str__(self):
        return f'Documento de {self.adotante.nome_completo}'
    
class Doacao(models.Model):
    nome = models.CharField(max_length=200)
    email = models.EmailField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_doacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.nome} - R${self.valor} - {self.data_doacao.strftime("%d/%m/%Y")}'

    class Meta:
        verbose_name = 'Doação'
        verbose_name_plural = 'Doações'