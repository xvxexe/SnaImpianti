
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.main-nav');
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      navPanel.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = document.querySelector(btn.getAttribute('data-scroll'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
