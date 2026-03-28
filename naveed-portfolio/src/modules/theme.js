/** Theme toggle — persists to localStorage, exposes current theme for other modules. */

const toggle = document.getElementById('themeToggle');
const icon   = document.getElementById('themeIcon');

export function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

export function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  icon.textContent = t === 'light' ? '☾' : '☀';
  localStorage.setItem('theme', t);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: t } }));
}

export function initTheme() {
  applyTheme(getTheme());
  toggle.addEventListener('click', () => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}
