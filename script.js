
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a[data-page]').forEach(link => {
  if (link.getAttribute('data-page') === path) link.classList.add('active');
});

document.querySelectorAll('[data-mail-form]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = form.getAttribute('data-mail-form');
    const fields = Object.fromEntries(new FormData(form).entries());
    const subject = type === 'careers'
      ? `Candidatura SNA Impianti - ${fields.posizione || 'Posizione aperta'}`
      : `Richiesta informazioni dal sito SNA Impianti`;
    const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('%0D%0A');
    window.location.href = `mailto:info@snaimpianti.it?subject=${subject}&body=${body}`;
  });
});

const lightbox = document.createElement('div');
lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(10,14,24,.84);display:none;align-items:center;justify-content:center;padding:24px;z-index:2000;';
lightbox.innerHTML = '<button aria-label="Chiudi" style="position:absolute;top:18px;right:18px;width:48px;height:48px;border-radius:999px;border:none;background:white;font-size:22px;cursor:pointer;">×</button><img alt="" style="max-width:min(96vw,1200px);max-height:90vh;border-radius:20px;box-shadow:0 18px 50px rgba(0,0,0,.4);" />';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');
const lightboxBtn = lightbox.querySelector('button');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.full || item.querySelector('img').src;
    lightboxImg.alt = item.querySelector('img').alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
lightboxBtn.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

document.getElementById('year')?.append(new Date().getFullYear());
