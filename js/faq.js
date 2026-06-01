// faq.js — accordion behavior for .faq-item elements

(function () {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item, idx) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
      btn.blur();
      // Restore scroll position after iOS Chrome/Safari repositions on focus
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      });
    });
  });


})();
