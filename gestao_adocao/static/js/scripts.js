// Toca dos Peludos — Validação do formulário de adoção

// Impede números no campo de nome
document.querySelector('[name="nome"]').addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/[0-9]/g, '');
});

// Máscara de telefone: (11) 90000-0000
document.querySelector('[name="telefone"]').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
  if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10, 14);
  e.target.value = v;
});

// Máscara de CEP: 00000-000
document.querySelector('[name="cep"]').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
  e.target.value = v;
});

// Limita o upload de fotos a no máximo 3
document.querySelector('[name="novas_fotos"]')?.addEventListener('change', function(e) {
  if (e.target.files.length > 3) {
    alert('Você pode selecionar no máximo 3 fotos!');
    e.target.value = '';
  }
});

// Validação completa no submit
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Limpa erros anteriores antes de validar de novo
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

  let primeiroCampoComErro = null;

  // Função auxiliar pra marcar um campo com erro
  function marcarErro(elemento, mensagem) {
    elemento.classList.add('is-invalid');
    const msg = document.createElement('div');
    msg.classList.add('invalid-feedback');
    msg.textContent = mensagem;
    elemento.insertAdjacentElement('afterend', msg);
    if (!primeiroCampoComErro) primeiroCampoComErro = elemento;
  }

  // Lista de campos obrigatórios
  const camposObrigatorios = [
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

  // Verifica se algum campo está vazio
  for (const campo of camposObrigatorios) {
    const elemento = document.querySelector(`[name="${campo.name}"]`);
    if (!elemento) continue;
    if (!elemento.value.trim()) {
      marcarErro(elemento, `O campo "${campo.label}" é obrigatório.`);
    }
  }

  // Nome precisa ter pelo menos 2 palavras
  const nome = document.querySelector('[name="nome"]');
  const palavrasDoNome = nome.value.trim().split(' ').filter(p => p.length > 0);
  if (palavrasDoNome.length < 2) {
    marcarErro(nome, 'Digite seu nome completo.');
  }

  // E-mail precisa ter @ e .
  const email = document.querySelector('[name="email"]');
  if (!email.value.includes('@') || !email.value.includes('.')) {
    marcarErro(email, 'Digite um e-mail válido com @');
  }

  // Telefone precisa ter 11 dígitos e começar com 9 depois do DDD
  const telefone = document.querySelector('[name="telefone"]');
  const telefoneLimpo = telefone.value.replace(/\D/g, '');

  if (telefoneLimpo.length < 11) {
    marcarErro(telefone, 'Digite um telefone válido com DDD e 9 dígitos.');
  } else if (telefoneLimpo[2] !== '9') {
    marcarErro(telefone, 'O número deve começar com 9 após o DDD.');
  }

  // CEP precisa ter 8 dígitos
  const cep = document.querySelector('[name="cep"]');
  const cepLimpo = cep.value.replace(/\D/g, '');
  if (cepLimpo.length < 8) {
    marcarErro(cep, 'Digite um CEP válido com 8 dígitos.');
  }

  // Checkbox de privacidade precisa estar marcado
  const checkbox = document.querySelector('[name="concordo"]');
  if (!checkbox.checked) {
    marcarErro(checkbox, 'Você precisa aceitar o Aviso de Privacidade.');
  }

  // Se encontrou erro, scrolla até o primeiro campo com problema
  if (primeiroCampoComErro) {
    primeiroCampoComErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    primeiroCampoComErro.focus();
    return;
  }

  // Tudo certo, envia o formulário
  this.submit();
});