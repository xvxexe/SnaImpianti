document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const themeConfig = window.SNATheme || {};
  const assetUrl = (themeConfig.assetsUrl || 'assets').replace(/\/$/, '');
  const homeUrl = (themeConfig.homeUrl || '/').replace(/\/?$/, '/');
  const staticPageMap = {
    'index.html': '',
    'chi-siamo.html': 'chi-siamo/',
    'presentazione-aziendale.html': 'presentazione-aziendale/',
    'certificazioni.html': 'certificazioni/',
    'ingegneria.html': 'ingegneria/',
    'prodotti.html': 'prodotti/',
    'galleria.html': 'galleria/',
    'posizioni-aperte.html': 'posizioni-aperte/',
    'contatti.html': 'contatti/',
    'processi-saldatura-industriale.html': 'processi-saldatura-industriale/'
  };

  const buildSiteUrl = (slug, hash = '') => `${homeUrl}${slug}${hash || ''}`;

  const normalizeToStaticPage = (value) => {
    if (!value) return '';
    if (value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('#')) return value;

    let pathname = value;
    let hash = '';

    try {
      const parsed = new URL(value, window.location.origin);
      if (parsed.origin !== window.location.origin) return value;
      pathname = parsed.pathname;
      hash = parsed.hash || '';
    } catch (error) {
      const parts = value.split('#');
      pathname = parts[0];
      hash = parts[1] ? `#${parts[1]}` : '';
    }

    const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
    if (!cleanPath) return `index.html${hash}`;

    const lastSegment = cleanPath.split('/').filter(Boolean).pop() || '';
    if (!lastSegment) return `index.html${hash}`;
    if (lastSegment.endsWith('.html')) return `${lastSegment.toLowerCase()}${hash}`;

    return `${lastSegment.toLowerCase()}.html${hash}`;
  };

  const rewriteInternalLink = (href) => {
    if (!href) return null;
    if (/^(mailto|tel|sms|fax|javascript):/i.test(href) || href.startsWith('#')) return null;

    const staticPage = normalizeToStaticPage(href);
    const [file, hashPart] = staticPage.split('#');
    if (!staticPageMap[file]) {
      if (file === 'index.html') return buildSiteUrl('', hashPart ? `#${hashPart}` : '');
      return null;
    }

    return buildSiteUrl(staticPageMap[file], hashPart ? `#${hashPart}` : '');
  };

  document.querySelectorAll('a[href]').forEach(link => {
    const fixedHref = rewriteInternalLink(link.getAttribute('href'));
    if (fixedHref) link.setAttribute('href', fixedHref);
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.main-nav') || document.querySelector('.nav');
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      navPanel.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  const currentPage = (themeConfig.currentPage || normalizeToStaticPage(window.location.href) || 'index.html').split('#')[0];
  document.querySelectorAll('.main-nav a, .nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const linkPage = (link.getAttribute('data-page') || normalizeToStaticPage(href)).split('#')[0];
    if (linkPage === currentPage) {
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

  const partnerTrack = document.querySelector('.partners-track');
  if (partnerTrack) {
    const partnerLogos = [
      { name: 'azienda partner', src: `${assetUrl}/partners/56890283_2679614972055059_2291732478278238208_n-2.jpg.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/742c8833-00ab-498f-93ac-4274e2bf5299-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/GhH_-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/logo_2019-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/logo_gate-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/logo_gie_2020-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/logoherambiente-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/timthumb-removebg-preview-2.png.webp` },
      { name: 'azienda partner', src: `${assetUrl}/partners/unnamed-2.jpg.webp` }
    ];

    const logoMarkup = partnerLogos.map((partner) => {
      const safeName = partner.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `<div class="partner-logo"><img loading="lazy" decoding="async" src="${partner.src}" alt="Logo ${safeName}"><span hidden>${safeName}</span></div>`;
    }).join('');

    const duplicateMarkup = partnerLogos.map((partner) => {
      const safeName = partner.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `<div class="partner-logo" aria-hidden="true"><img loading="lazy" decoding="async" src="${partner.src}" alt=""><span hidden>${safeName}</span></div>`;
    }).join('');

    partnerTrack.innerHTML = logoMarkup + duplicateMarkup;
  }

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

  if (currentPage === 'chi-siamo.html') {
    const companyImages = document.querySelectorAll('.image-stack img');
    const replacements = [
      {
        src: `${assetUrl}/Immagini/Officina/IMG_20200527_093147.jpg`,
        alt: 'Officina S.N.A. Impianti con lavorazioni metalmeccaniche e componenti industriali'
      },
      {
        src: `${assetUrl}/Immagini/Officina/IMG_20200707_121751.jpg`,
        alt: 'Area produttiva S.N.A. Impianti per carpenteria e piping industriale'
      }
    ];

    companyImages.forEach((image, index) => {
      if (!replacements[index]) return;
      image.src = replacements[index].src;
      image.alt = replacements[index].alt;
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});