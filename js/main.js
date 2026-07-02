/* ============================================================
   Roofing Rehab — main.js
   ============================================================ */

document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {

  /* --- Nav scroll behavior --- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Mobile hamburger --- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* --- Stagger: add .reveal to children BEFORE observer is set up --- */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    parent.querySelectorAll(':scope > *').forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.staggerIndex = i;
    });
  });

  /* --- Scroll reveal (runs after stagger so all .reveal elements exist) --- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.staggerIndex ? parseInt(el.dataset.staggerIndex) * 100 : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* --- Stats counter --- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  /* --- FAB show on scroll --- */
  const fab = document.querySelector('.fab');
  if (fab) {
    window.addEventListener('scroll', () => {
      fab.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });
  }

  /* --- Tilt effect on service cards --- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* --- FAQ accordion --- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question && question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

});
