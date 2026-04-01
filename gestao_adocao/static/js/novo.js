/* =============================================
   TOCA DOS PELUDOS — script.js
   ONG de Doação e Adoção Animal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     1. NAV — scroll effect & mobile burger
  ────────────────────────────────────── */
  const nav        = document.getElementById('nav');
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  /* ──────────────────────────────────────
     2. REVEAL ON SCROLL (IntersectionObserver)
  ────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  /* ──────────────────────────────────────
     3. ANIMATED COUNTERS
  ────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const step     = 16;
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

  /* ──────────────────────────────────────
     4. DONATION FORM — valor buttons
  ────────────────────────────────────── */
  const valorBtns  = document.querySelectorAll('.valor-btn');
  const outroValor = document.getElementById('outroValor');

  valorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      valorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (outroValor) outroValor.value = '';
    });
  });

  if (outroValor) {
    outroValor.addEventListener('input', () => {
      if (outroValor.value) {
        valorBtns.forEach(b => b.classList.remove('active'));
      }
    });
  }

  /* ──────────────────────────────────────
     5. DONATION FORM — type buttons (única / mensal)
  ────────────────────────────────────── */
  const typeBtns = document.querySelectorAll('.type-btn');

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ──────────────────────────────────────
     6. FORMS — submit handlers
  ────────────────────────────────────── */
  const doeForm     = document.getElementById('doeForm');
  const contatoForm = document.getElementById('contatoForm');

  function showToast(message) {
    const toast   = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  if (doeForm) {
    doeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeValor = doeForm.querySelector('.valor-btn.active');
      const valorInput  = outroValor ? outroValor.value : null;
      const valorFinal  = valorInput || (activeValor ? activeValor.dataset.valor : null);

      if (!valorFinal) {
        showToast('⚠️ Escolha ou insira um valor para a doação.');
        return;
      }

      // Simulate submission
      const submitBtn = doeForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Processando…';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast(`✅ Doação de R$${valorFinal} registrada! Obrigado ❤️`);
        doeForm.reset();
        valorBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
        submitBtn.textContent = 'Fazer Doação ❤️';
        submitBtn.disabled = false;
      }, 1400);
    });
  }

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

  /* ──────────────────────────────────────
     7. NEWSLETTER — inline submit
  ────────────────────────────────────── */
  const newsletterBtn = document.querySelector('.newsletter-form button');
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

  /* ──────────────────────────────────────
     8. SMOOTH SCROLL — for # anchor links
  ────────────────────────────────────── */
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

  /* ──────────────────────────────────────
     9. PET CARDS — staggered entrance
  ────────────────────────────────────── */
  const petCards = document.querySelectorAll('.pet-adopt-card');
  petCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  /* ──────────────────────────────────────
     10. ACTIVE NAV HIGHLIGHT on scroll
  ────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav__links a');

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

  // Active link style
  const style = document.createElement('style');
  style.textContent = `.nav__links a.active-link { color: var(--green); }
    .nav__links a.active-link::after { width: 100%; }`;
  document.head.appendChild(style);

});
