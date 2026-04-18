/* ================================================
   SISTER'S CREATION — main.js
   Shared animations & interactions for all pages
   ================================================ */

(function () {
  'use strict';

  // ── NAVBAR SCROLL EFFECT ──
  const navbar = document.querySelector('.sc-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── SCROLL REVEAL ──
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal-up, .reveal-right').forEach((el) => {
    revealObserver.observe(el);
  });

  // ── COUNTER ANIMATION ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num[data-target]').forEach((el) => {
    counterObserver.observe(el);
  });

  // ── HAMBURGER ANIMATION ──
  const toggler = document.querySelector('.sc-toggler');
  const navCollapse = document.querySelector('.navbar-collapse');

  if (toggler && navCollapse) {
    navCollapse.addEventListener('show.bs.collapse', () => {
      const lines = toggler.querySelectorAll('.toggler-line');
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    });

    navCollapse.addEventListener('hide.bs.collapse', () => {
      const lines = toggler.querySelectorAll('.toggler-line');
      lines[0].style.transform = '';
      lines[1].style.opacity = '';
      lines[2].style.transform = '';
    });
  }

  // ── SMOOTH PRODUCT CARD STAGGER ──
  const productCards = document.querySelectorAll('.product-card');
  if (productCards.length) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 60);
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    productCards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity .5s ease, transform .5s ease';
      cardObserver.observe(card);
    });
  }

  // ── PAGE TRANSITION FADE ──
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .35s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('tel:') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('https://wa.me')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 280);
      });
    }
  });

  // ── FORM INPUT FOCUS EFFECT ──
  document.querySelectorAll('.sc-input').forEach((inp) => {
    inp.addEventListener('focus', () => {
      inp.closest('.form-group, .row')?.querySelectorAll('.sc-label').forEach((l) => {
        l.style.color = 'var(--primary)';
      });
    });
    inp.addEventListener('blur', () => {
      inp.closest('.form-group, .row')?.querySelectorAll('.sc-label').forEach((l) => {
        l.style.color = '';
      });
    });
  });

  // ── RIPPLE EFFECT ON BUTTONS ──
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        width: ${size}px;
        height: ${size}px;
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        transform: scale(0);
        animation: ripple-anim .5s linear;
        pointer-events: none;
      `;
      const existingStyle = document.getElementById('ripple-style');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `@keyframes ripple-anim { to { transform: scale(2.5); opacity: 0; } }`;
        document.head.appendChild(style);
      }
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // ── ACTIVE NAV HIGHLIGHT ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sc-nav-link').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

})();