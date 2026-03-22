from django.shortcuts import render, redirect
from .models import Adotante, FotoMoradia
from PIL import Image # biblioteca pillow
from django.contrib import messages
from django.conf import settings
from datetime import date

def index(request):
    if request.method == 'GET':
        return render(request, 'index.html')

def forms(request):
    if request.method == 'GET':
        status = request.GET.get('status')
        return render(request, 'forms.html', {'status': status,})

    elif request.method == 'POST':
        nome_completo = request.POST.get('nome').strip().title()
        email= request.POST.get('email').strip().lower()
        telefone = request.POST.get('telefone').strip()
        endereco = request.POST.get('endereco').strip().title()
        tipo_moradia = request.POST.get('tipo_moradia').strip()
        possui_outros_pets = request.POST.get('possui_outros_pets')
        experiencia_pets = request.POST.get('experiencia_pets')
        motivo_adocao = request.POST.get('motivo_adocao').strip()
        doc_identificacao = request.FILES.get("documento")
        criado_em = request.POST.get("criado_em")
        atualizado_em = request.POST.get("atualizado_em")
        foto_moradia = request.FILES.get("fotos_moradia")
        renda_familiar = request.POST.get('renda_familiar')
        cep = request.POST.get('cep').strip()
        pessoas_na_familia = request.POST.get('pessoas_na_familia')

        # Validar campos vazios
        campos_obrigatorios = {
            'nome': nome_completo,
            'email': email,
            'telefone': telefone,
            'endereco': endereco,
            'cep': cep,
            'tipo_moradia': tipo_moradia,
            'possui_outros_pets': possui_outros_pets,
            'experiencia_pets': experiencia_pets,
            'motivo_adocao': motivo_adocao,
            'doc_identificacao': doc_identificacao,
            'foto_moradia': foto_moradia,
            'renda_familiar': renda_familiar,
            'pessoas_na_familia': pessoas_na_familia,

        }

        campos_vazios = [campo for campo, valor in campos_obrigatorios.items() if not valor]

        if campos_vazios:
            return render(request, 'forms.html', {})
        
        # Validar formato do e-mail
        if '@' not in email or '.' not in email:
            return render(request, 'forms.html', {})
        
        # Bloquear email duplicado
        if Adotante.objects.filter(email=email).exists():
            return render(request, 'forms.html', {
                'erro': 'Este e-mail já foi cadastrado!',
                'campos_vazios': ['email'],
            })
        
        # Validar tamanho do telefone
        telefone_limpo = telefone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
        if len(telefone_limpo) < 11:
            return render(request, 'forms.html', {})
        
        # Bloquear telefone duplicado
        if Adotante.objects.filter(telefone=telefone).exists():
            return render(request, 'forms.html', {
                'erro': 'Este telefone já foi cadastrado!',
                'campos_vazios': ['telefone'],
            })

        dados = Adotante(   
            nome_completo = nome_completo,
            email = email,
            telefone = telefone,
            endereco = endereco,
            tipo_moradia = tipo_moradia,
            possui_outros_pets = possui_outros_pets,
            experiencia_pets = experiencia_pets,
            motivo_adocao = motivo_adocao,
            doc_identificacao = doc_identificacao,
            criado_em = criado_em,
            atualizado_em = atualizado_em,
            renda_familiar = renda_familiar,
            cep = cep,
            pessoas_na_familia = pessoas_na_familia
        )

        dados.save()

        img_moradia = FotoMoradia(
            adotante = dados,
            foto= foto_moradia
           
        )
        img_moradia.save()

        return redirect('/forms/?status=1')
    

    
def lista_cadastros(request):
    cadastro = Adotante.objects.all().prefetch_related('fotos')
    return render(request, 'admin.html', {'cadastro': cadastro,})

def user(request, id):
    cadastro = Adotante.objects.all().prefetch_related('fotos').get(id=id)

    if request.method == 'POST':
        acao = request.POST.get('acao')

        if acao == 'aprovado':
            cadastro.status = 'aprovado'
            cadastro.save()
            messages.success(request, 'Solicitação Aprovada com Sucesso! ✓')
        
        elif acao == 'reprovado':
            cadastro.status = 'reprovado'
            cadastro.save()
            messages.error(request, 'Solicitação Reprovada! ✕')

    return render(request, 'user.html', {'cadastro': cadastro,})

    
    
    








    
    
