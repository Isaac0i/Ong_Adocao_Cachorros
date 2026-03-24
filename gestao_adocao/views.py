from django.shortcuts import render, redirect
from .models import Adotante, FotoMoradia, DocumentoIdentificacao
from django.contrib import messages
import os

def index(request):
    if request.method == 'GET':
        return render(request, 'index.html')

def forms(request):
    if request.method == 'GET':
        status = request.GET.get('status')
        return render(request, 'forms.html', {'status': status})

    elif request.method == 'POST':
        nome_completo = request.POST.get('nome').strip().title()
        email = request.POST.get('email').strip().lower()
        telefone = request.POST.get('telefone').strip()
        endereco = request.POST.get('endereco').strip().title()
        tipo_moradia = request.POST.get('tipo_moradia').strip()
        possui_outros_pets = request.POST.get('possui_outros_pets')
        experiencia_pets = request.POST.get('experiencia_pets')
        motivo_adocao = request.POST.get('motivo_adocao').strip()
        documentos = request.FILES.getlist('documento')
        foto_moradia = request.FILES.getlist('fotos_moradia')
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
            'documentos': documentos,
            'foto_moradia': foto_moradia,
            'renda_familiar': renda_familiar,
            'pessoas_na_familia': pessoas_na_familia,
        }

        campos_vazios = [campo for campo, valor in campos_obrigatorios.items() if not valor]
        if campos_vazios:
            return render(request, 'forms.html', {})

        # Validar e-mail
        if '@' not in email or '.' not in email:
            return render(request, 'forms.html', {})

        # Bloquear email duplicado
        if Adotante.objects.filter(email=email).exists():
            return render(request, 'forms.html', {
                'erro': 'Este e-mail já foi cadastrado!',
                'campos_vazios': ['email'],
            })

        # Validar telefone
        telefone_limpo = telefone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
        if len(telefone_limpo) < 11:
            return render(request, 'forms.html', {})

        # Bloquear telefone duplicado
        if Adotante.objects.filter(telefone=telefone).exists():
            return render(request, 'forms.html', {
                'erro': 'Este telefone já foi cadastrado!',
                'campos_vazios': ['telefone'],
            })

        # Limite de 3 fotos
        if len(foto_moradia) > 3:
            return render(request, 'forms.html', {
                'erro': 'Você pode enviar no máximo 3 fotos da moradia!'
            })

        # Limite de 3 documentos
        if len(documentos) > 3:
            return render(request, 'forms.html', {
                'erro': 'Você pode enviar no máximo 3 documentos!'
            })

        # Salvar adotante
        dados = Adotante(
            nome_completo=nome_completo,
            email=email,
            telefone=telefone,
            endereco=endereco,
            tipo_moradia=tipo_moradia,
            possui_outros_pets=possui_outros_pets,
            experiencia_pets=experiencia_pets,
            motivo_adocao=motivo_adocao,
            renda_familiar=renda_familiar,
            cep=cep,
            pessoas_na_familia=pessoas_na_familia
        )
        dados.save()

        # Salvar fotos
        for foto in foto_moradia:
            FotoMoradia.objects.create(adotante=dados, foto=foto)

        # Salvar documentos
        for doc in documentos:
            DocumentoIdentificacao.objects.create(adotante=dados, doc_identificacao=doc)

        return redirect('/forms/?status=1')


def lista_cadastros(request):
    cadastros = Adotante.objects.all().prefetch_related('fotos')
    
    # Filtro de status
    status = request.GET.get('status')
    if status:
        cadastros = cadastros.filter(status=status)

    # Ordenação
    ordem = request.GET.get('ordem', 'id_asc')  # padrão: ID menor para maior
    if ordem == 'id_asc':
        cadastros = cadastros.order_by('id')
    elif ordem == 'id_desc':
        cadastros = cadastros.order_by('-id')
    elif ordem == 'nome_asc':
        cadastros = cadastros.order_by('nome_completo')
    elif ordem == 'nome_desc':
        cadastros = cadastros.order_by('-nome_completo')

    # Pesquisa
    pesquisa = request.GET.get('pesquisa', '')
    if pesquisa:
        cadastros = cadastros.filter(nome_completo__icontains=pesquisa)

    return render(request, 'admin.html', {
        'cadastro': cadastros,
        'ordem': ordem,
        'status': status,
        'pesquisa': pesquisa,
    })


def user(request, id):
    cadastro = Adotante.objects.prefetch_related('fotos', 'documentos').get(id=id)

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

        elif acao == 'editar':
            # Dados pessoais
            cadastro.nome_completo = request.POST.get('nome').strip().title()
            cadastro.email = request.POST.get('email').strip().lower()
            cadastro.telefone = request.POST.get('telefone').strip()
            cadastro.endereco = request.POST.get('endereco').strip().title()
            cadastro.cep = request.POST.get('cep').strip()
            cadastro.renda_familiar = request.POST.get('renda_familiar')
            cadastro.pessoas_na_familia = request.POST.get('pessoas_na_familia')
            cadastro.tipo_moradia = request.POST.get('tipo_moradia')
            cadastro.possui_outros_pets = request.POST.get('possui_outros_pets')
            cadastro.experiencia_pets = request.POST.get('experiencia_pets')
            cadastro.motivo_adocao = request.POST.get('motivo_adocao').strip()

            # Adicionar novos documentos
            novos_docs = request.FILES.getlist('novos_documentos')
            docs_atuais = cadastro.documentos.count()
            if docs_atuais + len(novos_docs) > 3:
                messages.error(request, f'Limite de 3 documentos atingido! Você já tem {docs_atuais} documento(s).')
                return redirect('user', id=id)  # sai antes do success
            else:
                for doc in novos_docs:
                    DocumentoIdentificacao.objects.create(adotante=cadastro, doc_identificacao=doc)

            # Deletar documentos selecionados
            docs_deletar = request.POST.getlist('deletar_doc')
            for doc_id in docs_deletar:
                doc = DocumentoIdentificacao.objects.get(id=doc_id)
                if os.path.isfile(doc.doc_identificacao.path):
                    os.remove(doc.doc_identificacao.path)
                doc.delete()

            # Adicionar novas fotos
            novas_fotos = request.FILES.getlist('novas_fotos')
            fotos_atuais = cadastro.fotos.count()
            if fotos_atuais + len(novas_fotos) > 3:
                messages.error(request, f'Limite de 3 fotos atingido! Você já tem {fotos_atuais} foto(s).')
                return redirect('user', id=id)  # sai antes do success
            else:
                for foto in novas_fotos:
                    FotoMoradia.objects.create(adotante=cadastro, foto=foto)

            # Deletar fotos selecionadas
            fotos_deletar = request.POST.getlist('deletar_foto')
            for foto_id in fotos_deletar:
                foto = FotoMoradia.objects.get(id=foto_id)
                if os.path.isfile(foto.foto.path):
                    os.remove(foto.foto.path)
                foto.delete()

            cadastro.save()
            messages.success(request, 'Cadastro atualizado com sucesso! ✓')
            return redirect('user', id=id)

        elif acao == 'deletar':
            for foto in cadastro.fotos.all():
                if os.path.isfile(foto.foto.path):
                    os.remove(foto.foto.path)
            for doc in cadastro.documentos.all():
                if os.path.isfile(doc.doc_identificacao.path):
                    os.remove(doc.doc_identificacao.path)
            cadastro.delete()
            return redirect('admin')

    return render(request, 'user.html', {'cadastro': cadastro})