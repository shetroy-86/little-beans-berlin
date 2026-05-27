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

  // iOS Safari: keep bottom bar pinned to visual viewport bottom.
  // When the browser chrome (address bar + tab bar) is visible, the layout
  // viewport extends behind it, so position:fixed bottom:0 ends up hidden.
  // The Visual Viewport API fires on every chrome resize so we can compensate.
  const bottomBar = document.querySelector('.mobile-bottom-bar');
  if (bottomBar && window.visualViewport) {
    function pinBar() {
      const vv = window.visualViewport;
      const gap = Math.round(Math.max(0, window.innerHeight - (vv.offsetTop + vv.height)));
      bottomBar.style.bottom = gap + 'px';
    }
    window.visualViewport.addEventListener('resize', pinBar);
    window.visualViewport.addEventListener('scroll', pinBar);
    // Chrome iOS fires window.resize when its toolbar shows/hides
    window.addEventListener('resize', pinBar, { passive: true });
    pinBar();
  }
})();
