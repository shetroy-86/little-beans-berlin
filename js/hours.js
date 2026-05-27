// hours.js — dynamically highlights today's row in the hours card

(function () {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = days[new Date().getDay()];

  document.querySelectorAll('.hours-row').forEach(row => {
    const dayEl = row.querySelector('.day');
    if (!dayEl) return;
    const dayText = dayEl.textContent.trim().toLowerCase().slice(0, 3);
    row.classList.toggle('today', dayText === today);
  });
})();
