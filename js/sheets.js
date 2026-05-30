// sheets.js — Google Sheets integration for Little Beans Berlin
// Reads announcement bar text, weekly hours, and blocked open play slots
// from a published Google Apps Script web app.
// Falls back to hardcoded defaults silently if fetch fails.

(function () {

  // ── CONFIGURE: paste the Apps Script web app URL here after deployment ──
  var SHEETS_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
  // ────────────────────────────────────────────────────────────────────────

  var CACHE_KEY = 'lbb_sheets_v1';

  // Expose sheet data globally so booking.js can read them at modal-open time
  window.LBB_BLOCKED_SLOTS    = {};
  window.LBB_WEEKLY_HOURS_ALL = {};

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

  // ── Hours table — update index.html and open-play.html ──────────────────
  // allWeeklyHours is { "YYYY-MM-DD": { mon, tue, ... } } keyed by Monday.
  // We find the current week's row and apply it to the .hours-row elements.
  function updateHours(allWeeklyHours) {
    if (!allWeeklyHours || typeof allWeeklyHours !== 'object') return;

    var now  = new Date();
    var dow  = now.getDay();
    var diff = (dow === 0) ? -6 : 1 - dow;
    var mon  = new Date(now.getTime() + diff * 86400000);
    var monStr = mon.getFullYear() + '-' +
      String(mon.getMonth() + 1).padStart(2, '0') + '-' +
      String(mon.getDate()).padStart(2, '0');

    var weekRow = allWeeklyHours[monStr];
    if (!weekRow) return; // No override this week — hardcoded defaults stay

    var keyMap = { Mon:'mon', Tue:'tue', Wed:'wed', Thu:'thu', Fri:'fri', Sat:'sat', Sun:'sun' };
    document.querySelectorAll('.hours-row').forEach(function (row) {
      var dayEl  = row.querySelector('.day');
      var timeEl = row.querySelector('.time');
      if (!dayEl || !timeEl) return;
      var key = keyMap[dayEl.textContent.trim()];
      if (!key) return;
      var val = weekRow[key];
      if (val && val.trim()) timeEl.textContent = val.trim();
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    fetchSheetData()
      .then(function (data) {
        if (!data) return;
        if (data.announcement_bar) updateAnnouncement(data.announcement_bar);
        if (data.weekly_hours)     updateHours(data.weekly_hours);
        if (data.blocked_slots)    window.LBB_BLOCKED_SLOTS    = data.blocked_slots;
        if (data.weekly_hours)     window.LBB_WEEKLY_HOURS_ALL = data.weekly_hours;
      })
      .catch(function () {
        // Silently fall back — hardcoded defaults remain in place
      });
  });

})();
