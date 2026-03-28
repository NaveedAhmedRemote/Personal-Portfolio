/** Scroll reveal, nav background toggle, and active nav link tracking. */

export function initScroll() {
  // Nav scroll background
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Intersection Observer reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('in'), +delay);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  document.querySelectorAll('.exp-card').forEach((el, i) => {
    el.dataset.delay = i * 120;
    io.observe(el);
  });
  document.querySelectorAll('.proj-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
    io.observe(el);
  });

  // Active nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--amber)' : '';
    });
  });
}
