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

// Carrusel del hero: cambia de imagen cada 4 segundos
const slides = document.querySelectorAll('#heroCarousel .carousel__slide');
let currentSlide = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[currentSlide].classList.remove('is-active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('is-active');
  }, 4000);
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
