from django.shortcuts import render, redirect
from .models import Adotante, FotoMoradia
from PIL import Image # biblioteca pillow
import os
from django.conf import settings
from datetime import date

def forms(request):
    if request.method == 'GET':
        status = request.GET.get('status')
        return render(request, 'forms.html', {'status': status,})
    

    elif request.method == 'POST':
        nome_completo = request.POST.get('nome')
        email= request.POST.get('email')
        telefone = request.POST.get('telefone')
        endereco = request.POST.get('endereco')
        doc_identificacao = request.FILES.get("documento")
        foto_moradia = request.FILES.get("fotos_moradia")

        dados = Adotante(   
            nome_completo = nome_completo,
            email = email,
            telefone = telefone,
            endereco = endereco,
            doc_identificacao = doc_identificacao,
        )

        dados.save()

        img_moradia = FotoMoradia(
            adotante = dados,
            foto= foto_moradia
           
        )
        img_moradia.save()

        return redirect('/adocao/formulario/?status=1')
    

    
def lista_cadastros(request):
    cadastros = Adotante.objects.all()
    return render(request, 'lista_cadastros.html', {'cadastros': cadastros,})

    
    
