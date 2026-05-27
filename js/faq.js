// faq.js — accordion behavior for .faq-item elements

(function () {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item, idx) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });


})();
