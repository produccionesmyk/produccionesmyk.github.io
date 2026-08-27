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
