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
    const track = document.querySelector('.partners-track');
    if (!section || !track) return;

    const logos = [
      { name: 'RINA', src: 'https://logo.clearbit.com/rina.org' },
      { name: 'Bureau Veritas', src: 'https://logo.clearbit.com/bureauveritas.com' },
      { name: 'Istituto Italiano Saldatura', src: 'https://logo.clearbit.com.iis.it' },
      { name: 'ENI', src: 'https://logo.clearbit.com/eni.com' },
      { name: 'Snam', src: 'https://logo.clearbit.com/snam.it' },
      { name: 'Saipem', src: 'https://logo.clearbit.com/saipem.com' },
      { name: 'Baker Hughes', src: 'https://logo.clearbit.com/bakerhughes.com' },
      { name: 'Enel', src: 'https://logo.clearbit.com/enel.com' },
      { name: 'Solvay', src: 'https://logo.clearbit.com/solvay.com' },
      { name: 'Edison', src: 'https://logo.clearbit.com/edison.it' }
    ];

    const row = [...logos, ...logos].map((logo, index) => `
      <article class="partner-card" ${index >= logos.length ? 'aria-hidden="true"' : ''}>
        <img loading="lazy" decoding="async" src="${logo.src}" alt="Logo ${logo.name}" onerror="this.closest('.partner-card').remove()">
      </article>
    `).join('');

    track.innerHTML = row;

    const style = document.createElement('style');
    style.textContent = `
      .partners-section {
        padding: clamp(44px, 5.5vw, 72px) 0 !important;
        overflow: hidden !important;
        background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(246,248,252,.96)) !important;
      }
      .partners-shell {
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }
      .partners-head {
        display: grid !important;
        gap: 8px !important;
        max-width: 780px !important;
        margin-bottom: 24px !important;
      }
      .partners-head .kicker {
        border: 0 !important;
        background: transparent !important;
        padding: 0 !important;
        color: var(--accent) !important;
        font-size: .74rem !important;
        font-weight: 850 !important;
        letter-spacing: .14em !important;
      }
      .partners-head h2 {
        margin: 0 !important;
        color: var(--navy) !important;
        font-size: clamp(1.55rem, 2.35vw, 2.35rem) !important;
        line-height: 1.08 !important;
        letter-spacing: -.035em !important;
      }
      .partners-head p,
      .partners-controls,
      .partners-arrow {
        display: none !important;
      }
      .partners-viewport {
        overflow: hidden !important;
        width: 100% !important;
        border-radius: 28px !important;
        padding: 8px 0 !important;
        mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent) !important;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent) !important;
      }
      .partners-track {
        display: flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        width: max-content !important;
        gap: 22px !important;
        animation: snaPartnersScroll 48s linear infinite !important;
        will-change: transform !important;
      }
      .partners-viewport:hover .partners-track,
      .partners-viewport:focus-within .partners-track {
        animation-play-state: running !important;
      }
      .partner-card {
        flex: 0 0 auto !important;
        width: clamp(180px, 18vw, 260px) !important;
        height: clamp(92px, 9vw, 122px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 22px 28px !important;
        border: 1px solid rgba(29,36,64,.1) !important;
        border-radius: 26px !important;
        background: #fff !important;
        box-shadow: 0 16px 40px rgba(21,29,52,.08) !important;
        transform: none !important;
      }
      .partner-card img {
        display: block !important;
        width: 100% !important;
        height: 72px !important;
        object-fit: contain !important;
        filter: none !important;
        opacity: 1 !important;
      }
      .partner-fallback {
        display: none !important;
      }
      @keyframes snaPartnersScroll {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-50% - 11px)); }
      }
      @media (max-width: 820px) {
        .partners-section { padding: 38px 0 !important; }
        .partners-track { gap: 14px !important; animation-duration: 38s !important; }
        .partner-card { width: 168px !important; height: 86px !important; padding: 18px !important; border-radius: 22px !important; }
        .partner-card img { height: 54px !important; }
      }
    `;
    document.head.appendChild(style);
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
