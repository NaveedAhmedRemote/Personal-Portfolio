/** Constellation star canvas — reads CSS custom properties for theme-aware colours. */

export function initConstellation() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const stars = [];
  const mouse = { x: 0, y: 0 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * 2000,
      y: Math.random() * 1000,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random(),
    });
  }

  function getStarColor() {
    const s = getComputedStyle(document.documentElement);
    return [
      s.getPropertyValue('--star-r').trim(),
      s.getPropertyValue('--star-g').trim(),
      s.getPropertyValue('--star-b').trim(),
    ];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const [sr, sg, sb] = getStarColor();

    for (let i = 0; i < stars.length; i++) {
      // connections
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(${sr},${sg},${sb},${0.07 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // mouse proximity glow
      const mdx = stars[i].x - mouse.x;
      const mdy = stars[i].y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 180) {
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${0.5 * (1 - md / 180)})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${sr},${sg},${sb},${stars[i].a * 0.6 + 0.1})`;
      ctx.fill();

      stars[i].x += stars[i].vx;
      stars[i].y += stars[i].vy;
      stars[i].a += 0.005;
      if (stars[i].x < 0) stars[i].x = W;
      if (stars[i].x > W) stars[i].x = 0;
      if (stars[i].y < 0) stars[i].y = H;
      if (stars[i].y > H) stars[i].y = 0;
    }
    requestAnimationFrame(draw);
  }

  draw();
}
