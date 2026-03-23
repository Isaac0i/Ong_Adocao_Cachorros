/* Nome Completo (impede a digitação de números) */
document.querySelector('[name="nome"]').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[0-9]/g, '');
});

/* Telefone (formata a digitação para (11) 90000-0000) */
document.querySelector('[name="telefone"]').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
    if (v.length > 10) v = v.slice(0,10) + '-' + v.slice(10, 14);
    e.target.value = v;
});

/*CEP (formata a digitação para 00000-000)*/ 
document.querySelector('[name="cep"]').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5, 8);
    e.target.value = v;
});
/* Limitar upload de fotos a 3 */
document.querySelector('[name="novas_fotos"]')?.addEventListener('change', function(e) {
    if (e.target.files.length > 3) {
        alert('Você pode selecionar no máximo 3 fotos!');
        e.target.value = ''; // limpa a seleção
    }
});

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    //  Limpa erros PRIMEIRO
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

    let campo_vazio = null;

    // Verifica campos vazios
    const campos = [
        { name: 'nome', label: 'Nome Completo' },
        { name: 'email', label: 'E-mail' },
        { name: 'telefone', label: 'Telefone' },
        { name: 'endereco', label: 'Endereço' },
        { name: 'cep', label: 'CEP' },
        { name: 'renda_familiar', label: 'Renda Familiar' },
        { name: 'pessoas_na_familia', label: 'Quantidade de Pessoas na Família' },
        { name: 'tipo_moradia', label: 'Tipo de Moradia' },
        { name: 'possui_outros_pets', label: 'Possui outros pets?' },
        { name: 'experiencia_pets', label: 'Já teve experiência com cães antes?' },
        { name: 'motivo_adocao', label: 'Por que você deseja adotar um pet?' },
        { name: 'documento', label: 'Documento de Identificação' },
        { name: 'fotos_moradia', label: 'Fotos da sua Moradia' },
    ];

    for (const campo of campos) {
        const elemento = document.querySelector(`[name="${campo.name}"]`);
        if (!elemento) continue;
        const valor = elemento.value.trim();
        if (!valor) {
            elemento.classList.add('is-invalid');
            const msg = document.createElement('div');
            msg.classList.add('invalid-feedback');
            msg.textContent = `O campo "${campo.label}" é obrigatório.`;
            elemento.insertAdjacentElement('afterend', msg);
            if (!campo_vazio) campo_vazio = elemento;
        }
    }

    // Validar Nome Completo (no minimo 2 palavras)
    const nome = document.querySelector('[name="nome"]');
    const nome_palavras = nome.value.trim().split(' ').filter(p => p.length > 0);
    if (nome_palavras.length < 2) {
        nome.classList.add('is-invalid');
        const msg = document.createElement('div');
        msg.classList.add('invalid-feedback');
        msg.textContent = 'Digite seu nome completo.';
        nome.insertAdjacentElement('afterend', msg);
        if (!campo_vazio) campo_vazio = nome;
    }

    // Validar E-mail
    const email = document.querySelector('[name="email"]');
    const email_valido = email.value.includes('@') && email.value.includes('.');
    if (!email_valido) {
        email.classList.add('is-invalid');
        const msg = document.createElement('div');
        msg.classList.add('invalid-feedback');
        msg.textContent = 'Digite um e-mail válido com @';
        email.insertAdjacentElement('afterend', msg);
        if (!campo_vazio) campo_vazio = email;
    }

    // Validar Telefone
    const telefone = document.querySelector('[name="telefone"]');
    const telefone_limpo = telefone.value.replace(/\D/g, '');

    if (telefone_limpo.length < 11) {
        telefone.classList.add('is-invalid');
        const msg = document.createElement('div');
        msg.classList.add('invalid-feedback');
        msg.textContent = 'Digite um telefone válido com DDD e 9 dígitos.';
        telefone.insertAdjacentElement('afterend', msg);
        if (!campo_vazio) campo_vazio = telefone;

    // Verifica se o 3º dígito é 9 (celular)
    } else if (telefone_limpo[2] !== '9') {
        telefone.classList.add('is-invalid');
        const msg = document.createElement('div');
        msg.classList.add('invalid-feedback');
        msg.textContent = 'Digite um número de celular válido. O número deve começar com 9 após o DDD.';
        telefone.insertAdjacentElement('afterend', msg);
        if (!campo_vazio) campo_vazio = telefone;
    }


    // Validar CEP
    const cep = document.querySelector('[name="cep"]');
    const cep_limpo = cep.value.replace(/\D/g, '');
    if (cep_limpo.length < 8) {
        cep.classList.add('is-invalid');
        const msg = document.createElement('div');
        msg.classList.add('invalid-feedback');
        msg.textContent = 'Digite um CEP válido com 8 dígitos.';
        cep.insertAdjacentElement('afterend', msg);
        if (!campo_vazio) campo_vazio = cep;
    }

    // Validar Checkbox
    const checkbox = document.querySelector('[name="concordo"]');
    if (!checkbox.checked) {
        checkbox.classList.add('is-invalid');
        const msg = document.createElement('div');
        msg.classList.add('invalid-feedback');
        msg.style.display = 'block';
        msg.textContent = 'Você precisa aceitar o Aviso de Privacidade.';
        checkbox.insertAdjacentElement('afterend', msg);
        if (!campo_vazio) campo_vazio = checkbox;
    }

    // Direciona ao primeiro campo com erro
    if (campo_vazio) {
        campo_vazio.scrollIntoView({ behavior: 'smooth', block: 'center' });
        campo_vazio.focus();
        return;
    }

    this.submit();
});