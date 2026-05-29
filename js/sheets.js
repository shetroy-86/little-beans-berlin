// sheets.js — Google Sheets integration for Little Beans Berlin
// Reads announcement bar text, weekly hours, and blocked open play slots
// from a published Google Apps Script web app.
// Falls back to hardcoded defaults silently if fetch fails.

(function () {

  // ── CONFIGURE: paste the Apps Script web app URL here after deployment ──
  var SHEETS_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
  // ────────────────────────────────────────────────────────────────────────

  var CACHE_KEY = 'lbb_sheets_v1';

  var DEFAULT_HOURS = {
    mon: '9:00am – 4:00pm',
    tue: '9:00am – 4:00pm',
    wed: '9:00am – 4:00pm',
    thu: '9:00am – 4:00pm',
    fri: '9:00am – 4:00pm',
    sat: '9:00am – 2:00pm',
    sun: 'Closed'
  };

  // Expose blocked slots globally so booking.js can read them
  window.LBB_BLOCKED_SLOTS = {};

  // ── Fetch with sessionStorage cache ─────────────────────────────────────
  function fetchSheetData() {
    if (!SHEETS_URL || SHEETS_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      return Promise.resolve(null);
    }
    try {
      var cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return Promise.resolve(JSON.parse(cached));
    } catch (_) {}

    return fetch(SHEETS_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (_) {}
        return data;
      });
  }

  // ── Announcement bar — update all pages ─────────────────────────────────
  function updateAnnouncement(text) {
    if (!text || !text.trim()) return;
    document.querySelectorAll('.announce span').forEach(function (el) {
      el.textContent = text.trim();
    });
  }

  // ── Hours rows — update index.html and open-play.html ───────────────────
  function updateHours(weeklyHours) {
    if (!weeklyHours) return;
    var keyMap = { Mon:'mon', Tue:'tue', Wed:'wed', Thu:'thu', Fri:'fri', Sat:'sat', Sun:'sun' };
    document.querySelectorAll('.hours-row').forEach(function (row) {
      var dayEl = row.querySelector('.day');
      var timeEl = row.querySelector('.time');
      if (!dayEl || !timeEl) return;
      var key = keyMap[dayEl.textContent.trim()];
      if (!key) return;
      var val = weeklyHours[key];
      if (val && val.trim()) timeEl.textContent = val.trim();
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    fetchSheetData()
      .then(function (data) {
        if (!data) return;
        if (data.announcement_bar) updateAnnouncement(data.announcement_bar);
        if (data.weekly_hours)    updateHours(data.weekly_hours);
        if (data.blocked_slots)   window.LBB_BLOCKED_SLOTS = data.blocked_slots;
      })
      .catch(function () {
        // Silently fall back — hardcoded defaults remain in place
      });
  });

})();
