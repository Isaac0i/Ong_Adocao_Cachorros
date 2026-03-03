from django.shortcuts import render, redirect
from .models import Adotante

def forms(request):
    if request.method == 'GET':
        status = request.GET.get('status')
        return render(request, 'forms.html', {'status': status,})
    

    elif request.method == 'POST':
        nome_completo = request.POST.get('nome')
        email= request.POST.get('email')
        telefone = request.POST.get('telefone')
        endereco = request.POST.get('endereco')

        dados = Adotante(   
            nome_completo = nome_completo,
            email = email,
            telefone = telefone,
            endereco = endereco,
        )

        dados.save()
        return redirect('/adocao/formulario/?status=1')
    

    
def lista_cadastros(request):
    cadastros = Adotante.objects.all()
    return render(request, 'lista_cadastros.html', {'cadastros': cadastros,})

    
    
