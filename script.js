// Al abrir la página (o un link compartido) siempre se empieza arriba, sin saltar a una sección
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo(0, 0);

// Los enlaces del menú bajan a la sección sin ensuciar la dirección (así el link que se copia es siempre el limpio)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Abre y cierra el menú en pantallas de celular
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});

// Cierra el menú al hacer clic en un enlace (útil en móvil)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
  });
});

// Video del hero: se reproduce siempre, en bucle y sin pausa
const heroVideo = document.querySelector('#heroVideo video');
if (heroVideo) {
  const keepPlaying = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); };
  keepPlaying();
  heroVideo.addEventListener('pause', () => { if (!document.hidden) keepPlaying(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) keepPlaying(); });
}

// Visor de fotos: al hacer clic en una foto de la galería se abre en grande
const galleryItems = Array.from(document.querySelectorAll('.galeria__item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let lbIndex = 0;

function showPhoto(index) {
  lbIndex = (index + galleryItems.length) % galleryItems.length; // da la vuelta al llegar al final
  const item = galleryItems[lbIndex];
  lbImg.src = item.dataset.full;
  lbImg.alt = item.querySelector('img').alt;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden'; // evita que la página se mueva de fondo
}

function closeLightbox() {
  lightbox.hidden = true;
  lbImg.src = '';
  document.body.style.overflow = '';
}

if (galleryItems.length > 0 && lightbox) {
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => showPhoto(lbIndex - 1));
  document.getElementById('lbNext').addEventListener('click', () => showPhoto(lbIndex + 1));

  // Clic en el fondo oscuro también cierra
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado: Esc cierra, flechas cambian de foto
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
  });

  // Celular: deslizar el dedo a izquierda o derecha cambia de foto
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) showPhoto(diff > 0 ? lbIndex - 1 : lbIndex + 1);
  }, { passive: true });
}

// Carrusel de paquetes: las flechas mueven una tarjeta a la vez
const pkTrack = document.getElementById('pkTrack');
const pkPrev = document.getElementById('pkPrev');
const pkNext = document.getElementById('pkNext');

if (pkTrack && pkPrev && pkNext) {
  const stepSize = () => {
    const card = pkTrack.querySelector('.paquete');
    const gap = parseFloat(getComputedStyle(pkTrack).columnGap) || 24;
    return card.offsetWidth + gap;
  };

  // Apaga la flecha cuando ya no hay más tarjetas hacia ese lado
  const updateArrows = () => {
    const max = pkTrack.scrollWidth - pkTrack.clientWidth;
    pkPrev.disabled = pkTrack.scrollLeft <= 4;
    pkNext.disabled = pkTrack.scrollLeft >= max - 4;
  };

  pkPrev.addEventListener('click', () => pkTrack.scrollBy({ left: -stepSize(), behavior: 'smooth' }));
  pkNext.addEventListener('click', () => pkTrack.scrollBy({ left: stepSize(), behavior: 'smooth' }));
  // Puntos indicadores: uno por paquete; se iluminan los que se ven en pantalla
  const pkDots = document.getElementById('pkDots');
  const cards = Array.from(pkTrack.querySelectorAll('.paquete'));
  const dots = cards.map((card, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'paquetes__dot';
    dot.setAttribute('aria-label', 'Ver paquete ' + (i + 1) + ': ' + card.querySelector('.paquete__nombre').textContent);
    dot.addEventListener('click', () => {
      const delta = card.getBoundingClientRect().left - pkTrack.getBoundingClientRect().left;
      pkTrack.scrollTo({ left: pkTrack.scrollLeft + delta, behavior: 'smooth' });
    });
    pkDots.appendChild(dot);
    return dot;
  });

  const updateDots = () => {
    const t = pkTrack.getBoundingClientRect();
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const visible = Math.min(r.right, t.right) - Math.max(r.left, t.left);
      dots[i].classList.toggle('is-visible', visible > r.width * 0.5);
    });
  };

  const refresh = () => { updateArrows(); updateDots(); };
  pkTrack.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('resize', refresh);
  refresh();
}

// Cierra el menú "Cómo llegar" al tocar fuera de él
document.addEventListener("click", function (e) {
  document.querySelectorAll("details.ruta[open]").forEach(function (d) {
    if (!d.contains(e.target)) d.removeAttribute("open");
  });
});
