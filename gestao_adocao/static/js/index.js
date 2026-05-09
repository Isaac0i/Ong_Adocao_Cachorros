// Toca dos Peludos — JS principal da landing page

document.addEventListener('DOMContentLoaded', () => {

  // --- Elementos globais ---
  const nav        = document.getElementById('nav');
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const doeForm    = document.getElementById('doeForm');
  const contatoForm = document.getElementById('contatoForm');
  const valorBtns  = document.querySelectorAll('.valor-btn');
  const outroValor = document.getElementById('outroValor');


  // --- Navbar: efeito de scroll e menu mobile ---

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Fecha o menu mobile ao clicar em qualquer link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    });
  });


  // --- Animação de entrada ao scrollar (reveal) ---

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // --- Contadores animados da hero ---

  function animateCounter(el) {
    const target     = parseInt(el.dataset.count, 10);
    const duration   = 1800;
    const step       = 16;
    const totalSteps = duration / step;
    let current = 0;

    const timer = setInterval(() => {
      current += target / totalSteps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat__num[data-count]').forEach(el => {
    counterObserver.observe(el);
  });


  // --- Botões de valor da doação ---

  valorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      valorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (outroValor) outroValor.value = '';
    });
  });

  // Se digitar um valor custom, desmarca os botões
  if (outroValor) {
    outroValor.addEventListener('input', () => {
      if (outroValor.value) {
        valorBtns.forEach(b => b.classList.remove('active'));
      }
    });
  }

  // Botões de tipo de doação (única / mensal)
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });


  // --- Toast de notificação ---

  function showToast(message) {
    const toast    = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }


  // --- Formulário de contato ---

  if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contatoForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('✅ Mensagem enviada! Entraremos em contato em breve 🐾');
        contatoForm.reset();
        submitBtn.textContent = 'Enviar Mensagem 🐾';
        submitBtn.disabled = false;
      }, 1200);
    });
  }


  // --- Newsletter ---

  const newsletterBtn   = document.querySelector('.newsletter-form button');
  const newsletterInput = document.querySelector('.newsletter-form input');

  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
      const email = newsletterInput.value.trim();
      if (!email || !email.includes('@')) {
        showToast('⚠️ Insira um e-mail válido.');
        return;
      }
      showToast('✅ Inscrição realizada! Fique ligado nas novidades 🐾');
      newsletterInput.value = '';
    });
  }


  // --- Scroll suave para links âncora ---

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  // --- Cards de pets: entrada escalonada ---

  document.querySelectorAll('.pet-adopt-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });


  // --- Destaque do link ativo na nav conforme scroll ---

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-link',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

  // Injeta o estilo do link ativo
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav__links a.active-link { color: var(--green); }
    .nav__links a.active-link::after { width: 100%; }
  `;
  document.head.appendChild(activeStyle);


  // --- Modal PIX com QR Code dinâmico ---

  const pixOverlay = document.getElementById('pixOverlay');
  const pixClose   = document.getElementById('pixClose');
  const pixCopy    = document.getElementById('pixCopy');
  let pixCodeAtual = '';

  // Pega o CSRF token do cookie (necessário pro fetch funcionar)
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Gera o payload PIX no padrão BRCode/EMV do Banco Central
  function gerarPixPayload(chave, nome, cidade, valor) {
    function tlv(id, val) {
      return id + String(val.length).padStart(2, '0') + val;
    }

    const gui = tlv('00', 'br.gov.bcb.pix');
    const key = tlv('01', chave);
    const mai = tlv('26', gui + key);

    let payload = '';
    payload += tlv('00', '01');       // formato do payload
    payload += mai;                    // dados da conta
    payload += tlv('52', '0000');     // categoria
    payload += tlv('53', '986');      // moeda (BRL)
    if (valor) payload += tlv('54', valor.toFixed(2)); // valor
    payload += tlv('58', 'BR');       // país
    payload += tlv('59', nome.substring(0, 25));  // nome beneficiário
    payload += tlv('60', cidade.substring(0, 15)); // cidade
    payload += tlv('62', tlv('05', '***'));        // dados adicionais
    payload += '6304';                // prefixo do CRC

    // Calcula CRC16-CCITT
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      }
      crc &= 0xFFFF;
    }

    return payload + crc.toString(16).toUpperCase().padStart(4, '0');
  }

  // Só monta o modal se ele existir na página
  if (pixOverlay) {

    // Submit do formulário de doação: valida, registra e abre o modal
    if (doeForm) {
      doeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome  = document.getElementById('doeNome').value.trim();
        const email = document.getElementById('doeEmail').value.trim();

        if (!nome || !email) {
          showToast('⚠️ Preencha seu nome e e-mail.');
          return;
        }

        const activeValor = doeForm.querySelector('.valor-btn.active');
        const valorInput  = outroValor ? outroValor.value : null;
        const valorFinal  = parseFloat(valorInput || (activeValor ? activeValor.dataset.valor : null));

        if (!valorFinal || valorFinal <= 0) {
          showToast('⚠️ Escolha ou insira um valor para a doação.');
          return;
        }

        // Envia os dados pro backend salvar no banco
        fetch('/registrar-doacao/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify({ nome, email, valor: valorFinal }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok') {
            showToast('✅ Doação registrada! Obrigado ' + nome + ' ❤️');
          }
        })
        .catch(() => {
          showToast('⚠️ Erro ao registrar. Tente novamente.');
        });

        // Monta o QR Code com o valor embutido e abre o modal
        pixCodeAtual = gerarPixPayload('+5511948097076', 'JULIO CESAR SILVA SANTOS', 'SAO PAULO', valorFinal);
        document.getElementById('pixValor').textContent = 'R$ ' + valorFinal.toFixed(2).replace('.', ',');

        const qrContainer = document.getElementById('pixQR');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
          text: pixCodeAtual,
          width: 200,
          height: 200,
          colorDark: '#2d6a4f',
          correctLevel: QRCode.CorrectLevel.M,
        });

        pixOverlay.style.display = 'flex';
      });
    }

    // Fechar modal pelo X ou clicando fora
    pixClose.addEventListener('click', () => pixOverlay.style.display = 'none');
    pixOverlay.addEventListener('click', (e) => {
      if (e.target === pixOverlay) pixOverlay.style.display = 'none';
    });

    // Copia o código Pix Copia e Cola
    pixCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(pixCodeAtual);
      pixCopy.textContent = 'Copiado ✓ 🐾';
      setTimeout(() => pixCopy.textContent = 'Copiar Chave 📋', 2000);
    });
  }

});