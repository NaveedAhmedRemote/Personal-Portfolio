/** Contact form — submits via Web3Forms. */

export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('fsendBtn');
    const msg = document.getElementById('fmsg');
    btn.querySelector('span').textContent = 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '.65';
    msg.style.display = 'none';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(this),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        msg.textContent = '✓ Message sent — I\'ll be in touch soon.';
        msg.style.color = '#a8d5b5';
        msg.style.borderColor = '#2a5f3a';
        msg.style.background = 'rgba(42,95,58,.15)';
        msg.style.display = 'block';
        this.reset();
      } else {
        throw new Error(data.message || 'failed');
      }
    } catch {
      msg.textContent = '✗ Error — please email me directly at NaveedAhmedbeetech@gmail.com';
      msg.style.color = '#d5a8a8';
      msg.style.borderColor = '#5f2a2a';
      msg.style.background = 'rgba(95,42,42,.15)';
      msg.style.display = 'block';
    } finally {
      btn.querySelector('span').textContent = 'Send Message →';
      btn.disabled = false;
      btn.style.opacity = '';
    }
  });
}
