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

  function setupPartnersCarousel() {
    const section = document.querySelector('.partners-section');
    const track = document.querySelector('[data-partners-track]');
    if (!section || !track) return;

    const style = document.createElement('style');
    style.textContent = `
      .partners-section {
        padding: clamp(2.4rem, 4vw, 3.6rem) 0 !important;
        overflow: hidden !important;
        background: #f6f7fb !important;
      }
      .partners-shell {
        width: min(100% - 32px, var(--max)) !important;
        margin: 0 auto !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
      }
      .partners-head {
        display: grid !important;
        gap: .45rem !important;
        margin-bottom: 1.05rem !important;
        max-width: 760px !important;
      }
      .partners-head .kicker {
        border: 0 !important;
        background: transparent !important;
        padding: 0 !important;
        color: var(--accent) !important;
        font-size: .72rem !important;
        font-weight: 850 !important;
        letter-spacing: .14em !important;
      }
      .partners-head h2 {
        max-width: 720px !important;
        margin: 0 !important;
        color: var(--navy) !important;
        font-size: clamp(1.35rem, 2vw, 2rem) !important;
        line-height: 1.08 !important;
        letter-spacing: -.035em !important;
        font-weight: 850 !important;
      }
      .partners-head p {
        display: none !important;
      }
      .partners-controls {
        display: none !important;
      }
      .partners-viewport {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
        border-radius: 999px !important;
        padding-block: .2rem !important;
        mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent) !important;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent) !important;
      }
      .partners-track {
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        width: max-content !important;
        gap: .65rem !important;
        will-change: transform !important;
        animation: partners-marquee 86s linear infinite !important;
      }
      .partners-viewport:hover .partners-track,
      .partners-viewport:focus-within .partners-track {
        animation-play-state: running !important;
      }
      .partner-card {
        width: auto !important;
        min-width: 0 !important;
        min-height: 0 !important;
        height: 42px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 auto !important;
        padding: 0 .92rem !important;
        border: 1px solid rgba(29, 36, 64, .13) !important;
        border-radius: 999px !important;
        background: rgba(255,255,255,.86) !important;
        box-shadow: 0 10px 28px rgba(21, 29, 52, .06) !important;
        transform: none !important;
      }
      .partner-card:hover {
        transform: none !important;
        box-shadow: 0 10px 28px rgba(21, 29, 52, .06) !important;
        border-color: rgba(29, 36, 64, .2) !important;
      }
      .partner-card img {
        display: none !important;
      }
      .partner-fallback {
        display: inline-flex !important;
        align-items: center !important;
        gap: .42rem !important;
        color: var(--navy) !important;
        font-size: .78rem !important;
        font-weight: 850 !important;
        letter-spacing: .06em !important;
        text-transform: uppercase !important;
        white-space: nowrap !important;
      }
      .partner-fallback::before {
        content: '' !important;
        width: .42rem !important;
        height: .42rem !important;
        border-radius: 999px !important;
        background: linear-gradient(135deg, var(--navy), var(--accent)) !important;
        opacity: .8 !important;
      }
      @keyframes partners-marquee {
        from { transform: translate3d(0, 0, 0); }
        to { transform: translate3d(-50%, 0, 0); }
      }
      @media (max-width: 820px) {
        .partners-section { padding: 2.1rem 0 !important; }
        .partners-shell { width: min(100% - 22px, var(--max)) !important; }
        .partners-head { margin-bottom: .85rem !important; }
        .partner-card { height: 38px !important; padding-inline: .76rem !important; }
        .partner-fallback { font-size: .72rem !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .partners-track { animation: none !important; transform: none !important; }
      }
    `;
    document.head.appendChild(style);

    const labels = [
      'Collaborazione 01',
      'Collaborazione 02',
      'Collaborazione 03',
      'Collaborazione 04',
      'Collaborazione 05',
      'Collaborazione 06',
      'Collaborazione 07',
      'Collaborazione 08',
      'Collaborazione 09',
      'Collaborazione 10',
    ];

    const cards = [...track.querySelectorAll('.partner-card')];
    cards.forEach((card, index) => {
      const img = card.querySelector('img');
      const fallback = card.querySelector('.partner-fallback');
      const label = labels[index % labels.length];
      card.classList.remove('logo-error');
      card.setAttribute('aria-label', label);
      if (img) img.setAttribute('aria-hidden', 'true');
      if (fallback) fallback.textContent = label;
    });
  }

  setupPartnersCarousel();

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
