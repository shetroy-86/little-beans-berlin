// carousel.js — homepage photo carousel with Ken Burns effect

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-arrow[data-dir="-1"]');
    const nextBtn = document.querySelector('.carousel-arrow[data-dir="1"]');
    const counterCurrent = document.getElementById('carouselCurrent');
    const counterTotal = document.getElementById('carouselTotal');

    if (!slides.length) return;

    let active = 0;
    let interval;

    function go(idx) {
      slides[active].classList.remove('active');
      dots[active]?.classList.remove('active');
      active = (idx + slides.length) % slides.length;
      slides[active].classList.add('active');
      dots[active]?.classList.add('active');
      if (counterCurrent) counterCurrent.textContent = String(active + 1).padStart(2, '0');
    }

    function startAuto() {
      clearInterval(interval);
      interval = setInterval(() => go(active + 1), 6500);
    }

    // Wire dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { go(i); startAuto(); });
    });

    // Wire arrows
    prevBtn?.addEventListener('click', () => { go(active - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { go(active + 1); startAuto(); });

    // Init
    go(0);
    startAuto();
  });
})();
