// nav.js — shared navigation: mobile menu + booking modal trigger

(function () {
  // Set active nav link based on current page
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const hpage = href.split('/').pop().split('#')[0];
    if (hpage === page || (page === '' && hpage === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.mobile-backdrop');
  const mclose = document.querySelector('.mobile-menu .mclose');

  function openMenu() {
    mobileMenu && mobileMenu.classList.add('open');
    backdrop && (backdrop.style.display = 'block');
  }
  function closeMenu() {
    mobileMenu && mobileMenu.classList.remove('open');
    backdrop && (backdrop.style.display = 'none');
  }

  hamburger && hamburger.addEventListener('click', openMenu);
  mclose && mclose.addEventListener('click', closeMenu);
  backdrop && backdrop.addEventListener('click', closeMenu);

  // Close mobile menu when a link is clicked
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Wire all booking trigger buttons
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof openBookingModal === 'function') {
        openBookingModal();
      }
    });
  });
})();
