document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.main-nav') || document.querySelector('.nav');
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      navPanel.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href === path) {
      link.classList.add('active');
      const group = link.closest('.nav-group');
      if (group) group.classList.add('active');
    }
  });

  document.querySelectorAll('.nav-group').forEach(group => {
    group.addEventListener('toggle', () => {
      if (!group.open) return;
      document.querySelectorAll('.nav-group[open]').forEach(other => {
        if (other !== group) other.open = false;
      });
    });
  });

  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = document.querySelector(btn.getAttribute('data-scroll'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const revealTargets = document.querySelectorAll('.section, .section-tight, .page-hero, .hero-panel, .card, .mini-card, .process-card, .info-card, .gallery-item, .album-card, .band');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-mail-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = form.getAttribute('data-mail-form');
      const fields = Object.fromEntries(new FormData(form).entries());
      const subject = type === 'careers'
        ? `Candidatura SNA Impianti - ${fields.posizione || 'Posizione aperta'}`
        : 'Richiesta informazioni dal sito SNA Impianti';
      const body = Object.entries(fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join('%0D%0A');
      window.location.href = `mailto:info@snaimpianti.it?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  });

  const albumCards = document.querySelectorAll('[data-album-target]');
  const albumPanels = document.querySelectorAll('.album-panel');
  if (albumCards.length && albumPanels.length) {
    const closeAlbums = () => {
      albumPanels.forEach(panel => { panel.hidden = true; });
      albumCards.forEach(card => card.setAttribute('aria-expanded', 'false'));
    };

    albumCards.forEach(card => {
      card.addEventListener('click', () => {
        const target = document.getElementById(card.dataset.albumTarget);
        if (!target) return;
        const isOpen = !target.hidden;
        closeAlbums();
        if (isOpen) return;
        target.hidden = false;
        card.setAttribute('aria-expanded', 'true');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    document.querySelectorAll('[data-album-close]').forEach(button => {
      button.addEventListener('click', () => {
        closeAlbums();
        document.querySelector('.album-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(10,14,24,.84);display:none;align-items:center;justify-content:center;padding:24px;z-index:2000;';
    lightbox.innerHTML = '<button aria-label="Chiudi" style="position:absolute;top:18px;right:18px;width:48px;height:48px;border-radius:999px;border:none;background:white;font-size:22px;cursor:pointer;">×</button><img alt="" style="max-width:min(96vw,1200px);max-height:90vh;border-radius:20px;box-shadow:0 18px 50px rgba(0,0,0,.4);" />';
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector('img');
    const lightboxBtn = lightbox.querySelector('button');

    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const img = item.querySelector('img');
        lightboxImg.src = item.dataset.full || (img ? img.src : '');
        lightboxImg.alt = img ? img.alt : '';
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightboxBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
