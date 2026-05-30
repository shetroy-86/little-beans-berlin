// booking.js — vanilla JS booking modal for Netlify Forms
// Slot availability can be overridden by sheets.js via window.LBB_BLOCKED_SLOTS

(function () {
  const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Default time slots — sheets.js can block individual slots per date
  const WEEKDAY_SLOTS  = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM or later'];
  const SATURDAY_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM or later'];

  // ── Date helpers ──────────────────────────────────────────────────────────

  // Returns YYYY-MM-DD for any Date object
  function toDateKey(dateObj) {
    return dateObj.getFullYear() + '-' +
      String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
      String(dateObj.getDate()).padStart(2, '0');
  }

  // Returns YYYY-MM-DD for the Monday of the given date's week
  function getMondayKey(dateObj) {
    const dow  = dateObj.getDay();
    const diff = (dow === 0) ? -6 : 1 - dow;
    const mon  = new Date(dateObj.getTime() + diff * 86400000);
    return toDateKey(mon);
  }

  // Returns true if the given date should show as Closed in the modal.
  // Default: Sunday is closed. Weekly Hours sheet can close any day.
  function isDateClosed(dateObj) {
    const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][dateObj.getDay()];
    const defaultClosed = (dateObj.getDay() === 0);
    const allHours = window.LBB_WEEKLY_HOURS_ALL;
    if (!allHours) return defaultClosed;
    const weekRow = allHours[getMondayKey(dateObj)];
    if (!weekRow) return defaultClosed;
    const val = weekRow[dayKey];
    if (val && val.trim()) return val.trim().toLowerCase() === 'closed';
    return defaultClosed;
  }

  // Always generates exactly 8 calendar days (today + next 7) so the
  // date grid fills a tidy 2×4 layout. Closed days appear but are disabled.
  function generateDates() {
    const dates = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    for (let i = 0; i < 8; i++) {
      dates.push({
        date:   new Date(d),
        dow:    DAYS[d.getDay()],
        num:    d.getDate(),
        month:  MONTHS[d.getMonth()],
        isSat:  d.getDay() === 6,
        closed: isDateClosed(new Date(d))
      });
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let dates = [];
  let state = { dateIdx: 0, slotIdx: 0, kids: 1, babies: 0, optIn: true, submitted: false };

  function getSlots() {
    return dates[state.dateIdx]?.isSat ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
  }

  function getBlockedForDate(dateObj) {
    if (!dateObj) return {};
    const key = toDateKey(dateObj);
    return (window.LBB_BLOCKED_SLOTS || {})[key] || {};
  }

  function calcTotal() {
    const k = state.kids;
    return k > 0 ? 9 + (k - 1) * 8 : 0;
  }

  // ── SVG icons ─────────────────────────────────────────────────────────────
  const icons = {
    x:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`,
    check:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>`,
    check20: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>`,
    minus:   `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    plus:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2.2" stroke-linecap="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M19 14l.8 2L22 17l-2.2.8L19 20l-.8-2-2.2-1 2.2-.8z"/></svg>`
  };

  // ── Modal HTML ────────────────────────────────────────────────────────────
  function buildModalHTML() {
    return `
<div class="modal-overlay hidden" id="bookingModalOverlay" role="dialog" aria-modal="true" aria-label="Book Open Play">
  <div class="modal" id="bookingModal">
    <button class="modal-close" id="modalClose" aria-label="Close">${icons.x}</button>
    <aside class="modal-side">
      <div>
        <span class="pill-mini">Open Play</span>
        <h3>Let's pick a time for the wild ones.</h3>
        <p>Let us know you're coming so we can save your spot. Play until you're ready to leave — no time limits. Grown-ups are always free.</p>
      </div>
      <div class="modal-side-dots"></div>
    </aside>
    <div class="modal-body" id="modalBody">
      <!-- rendered by renderModal() -->
    </div>
  </div>
</div>`;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function renderModal() {
    const body = document.getElementById('modalBody');
    if (!body) return;

    if (state.submitted) {
      body.innerHTML = `
        <div class="modal-success">
          <div class="success-icon">${icons.check20}</div>
          <h3>Count us in! 🌱</h3>
          <p>We've got your spot. See you soon at Little Beans!</p>
          <button class="btn btn-secondary" id="modalSuccessClose">Done</button>
        </div>`;
      document.getElementById('modalSuccessClose')?.addEventListener('click', closeBookingModal);
      return;
    }

    const slots       = getSlots();
    const selectedDate = dates[state.dateIdx];
    const blocked     = getBlockedForDate(selectedDate?.date);

    // If the currently-selected slot is blocked, find the first available one
    if (blocked[slots[state.slotIdx]]) {
      const firstAvail = slots.findIndex(s => !blocked[s]);
      state.slotIdx = firstAvail >= 0 ? firstAvail : 0;
    }
    const selectedSlot = slots[Math.min(state.slotIdx, slots.length - 1)];
    const total = calcTotal();

    body.innerHTML = `
      <form id="bookingForm" name="open-play-booking" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" novalidate>
        <input type="hidden" name="form-name" value="open-play-booking"/>
        <input name="bot-field" style="display:none"/>
        <input type="hidden" name="date"            id="hiddenDate"  value="${selectedDate.dow} ${selectedDate.num} ${selectedDate.month}"/>
        <input type="hidden" name="time"            id="hiddenTime"  value="${selectedSlot}"/>
        <input type="hidden" name="kids"            id="hiddenKids"  value="${state.kids}"/>
        <input type="hidden" name="babies"          id="hiddenBabies" value="${state.babies}"/>
        <input type="hidden" name="estimated-total" id="hiddenTotal" value="$${total}"/>

        <span class="step-label">Step 1 · Pick a day</span>
        <div class="date-grid" id="dateGrid"></div>

        <span class="step-label">Step 2 · Estimated arrival time</span>
        <div class="slot-grid" id="slotGrid"></div>

        <span class="step-label">Step 3 · Who's coming?</span>
        <div class="kids-counter">
          <span>Walking Beans <small>($9 first · $8 each sibling)</small></span>
          <div class="counter-ctrl">
            <button type="button" id="kidsDown">${icons.minus}</button>
            <span class="val" id="kidsVal">${state.kids}</span>
            <button type="button" id="kidsUp">${icons.plus}</button>
          </div>
        </div>
        <div class="kids-counter">
          <span>Baby Beans <small>(non-walkers · free)</small></span>
          <div class="counter-ctrl">
            <button type="button" id="babiesDown">${icons.minus}</button>
            <span class="val" id="babiesVal">${state.babies}</span>
            <button type="button" id="babiesUp">${icons.plus}</button>
          </div>
        </div>

        <div class="field-row-2">
          <div class="form-row">
            <label for="bookName">Your name</label>
            <input id="bookName" name="name" placeholder="e.g. Hannah W." required autocomplete="name"/>
          </div>
          <div class="form-row">
            <label for="bookEmail">Email</label>
            <input id="bookEmail" name="email" type="email" placeholder="you@email.com" required autocomplete="email"/>
          </div>
        </div>

        <label class="opt-in-row">
          <input type="checkbox" name="email-opt-in" id="optIn" ${state.optIn ? 'checked' : ''}/>
          <span><strong>Add me to the email list</strong> for events &amp; promotions. <small>We will never share your information with any 3rd parties.</small></span>
        </label>

        <div class="summary" id="priceSummary"></div>
        <p style="font-size:12px;color:var(--ink-soft);margin:4px 2px 14px;line-height:1.45;display:flex;align-items:flex-start;gap:8px;">
          ${icons.sparkle}
          <span><strong style="color:var(--ink);">Estimated total due at the door.</strong> Amount may vary if you use or purchase a punch card or monthly pass.</span>
        </p>

        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;">
          ${icons.check20} Count us in
        </button>
      </form>`;

    renderDates();
    renderSlots();
    renderSummary();
    bindFormEvents();
  }

  function renderDates() {
    const grid = document.getElementById('dateGrid');
    if (!grid) return;
    grid.innerHTML = dates.map((d, i) => `
      <button type="button"
        class="date-pill${state.dateIdx === i ? ' selected' : ''}${d.closed ? ' closed' : ''}"
        data-date-idx="${i}"
        ${d.closed ? 'disabled' : ''}>
        <span class="dow">${d.dow}</span>
        <span class="num">${d.num}</span>
        ${d.closed ? '<small>Closed</small>' : ''}
      </button>`).join('');
    grid.querySelectorAll('.date-pill:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        state.dateIdx = parseInt(btn.dataset.dateIdx);
        state.slotIdx = 0;
        renderDates();
        renderSlots();
        updateHidden();
        renderSummary();
      });
    });
  }

  function renderSlots() {
    const grid = document.getElementById('slotGrid');
    if (!grid) return;
    if (dates[state.dateIdx]?.closed) {
      grid.innerHTML = '';
      return;
    }
    const slots   = getSlots();
    const blocked = getBlockedForDate(dates[state.dateIdx]?.date);

    // Ensure selected index points to an available slot
    if (blocked[slots[state.slotIdx]]) {
      const firstAvail = slots.findIndex(s => !blocked[s]);
      state.slotIdx = firstAvail >= 0 ? firstAvail : 0;
    }
    const idx = Math.min(state.slotIdx, slots.length - 1);

    grid.innerHTML = slots.map((s, i) => {
      const isBlocked  = !!blocked[s];
      const isSelected = !isBlocked && idx === i;
      return `
        <button type="button"
          class="slot${isSelected ? ' selected' : ''}${isBlocked ? ' full' : ''}"
          data-slot-idx="${i}"
          ${isBlocked ? 'disabled' : ''}>
          ${s}
          ${isBlocked ? '<small>Unavailable</small>' : ''}
        </button>`;
    }).join('');

    grid.querySelectorAll('.slot:not(.full)').forEach(btn => {
      btn.addEventListener('click', () => {
        state.slotIdx = parseInt(btn.dataset.slotIdx);
        renderSlots();
        updateHidden();
        renderSummary();
      });
    });
  }

  function renderSummary() {
    const el = document.getElementById('priceSummary');
    if (!el) return;
    const slots = getSlots();
    const slot  = slots[Math.min(state.slotIdx, slots.length - 1)];
    const d     = dates[state.dateIdx];
    const total = calcTotal();
    const walkingCost = state.kids > 0 ? 9 + (state.kids - 1) * 8 : 0;

    el.innerHTML = `
      <div class="summary-row"><span>${state.kids} walking bean${state.kids !== 1 ? 's' : ''}</span><span>$${walkingCost}.00</span></div>
      ${state.babies > 0 ? `<div class="summary-row"><span>${state.babies} baby bean${state.babies !== 1 ? 's' : ''}</span><span style="color:var(--teal);font-weight:800;">free</span></div>` : ''}
      <div class="summary-row"><span>${d.dow} ${d.num} · ${slot}</span></div>
      <div class="summary-row total"><span>Estimated total</span><span>$${total}.00</span></div>`;
  }

  function updateHidden() {
    const slots = getSlots();
    const slot  = slots[Math.min(state.slotIdx, slots.length - 1)];
    const d     = dates[state.dateIdx];
    const el    = id => document.getElementById(id);
    if (el('hiddenDate'))   el('hiddenDate').value   = `${d.dow} ${d.num} ${d.month}`;
    if (el('hiddenTime'))   el('hiddenTime').value   = slot;
    if (el('hiddenKids'))   el('hiddenKids').value   = state.kids;
    if (el('hiddenBabies')) el('hiddenBabies').value = state.babies;
    if (el('hiddenTotal'))  el('hiddenTotal').value  = `$${calcTotal()}`;
    if (el('kidsVal'))      el('kidsVal').textContent  = state.kids;
    if (el('babiesVal'))    el('babiesVal').textContent = state.babies;
  }

  function bindFormEvents() {
    const el = id => document.getElementById(id);

    el('kidsUp')?.addEventListener('click',    () => { state.kids    = Math.min(8, state.kids    + 1); updateHidden(); renderSummary(); });
    el('kidsDown')?.addEventListener('click',  () => { state.kids    = Math.max(1, state.kids    - 1); updateHidden(); renderSummary(); });
    el('babiesUp')?.addEventListener('click',  () => { state.babies  = Math.min(8, state.babies  + 1); updateHidden(); });
    el('babiesDown')?.addEventListener('click',() => { state.babies  = Math.max(0, state.babies  - 1); updateHidden(); });
    el('optIn')?.addEventListener('change', e => { state.optIn = e.target.checked; });

    el('bookingForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
      } catch (_) {
        // Still show success — Netlify handles it server-side
      }
      state.submitted = true;
      renderModal();
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.openBookingModal = function () {
    const overlay = document.getElementById('bookingModalOverlay');
    if (!overlay) return;
    dates = generateDates();
    const firstOpen = dates.findIndex(d => !d.closed);
    state = { dateIdx: firstOpen >= 0 ? firstOpen : 0, slotIdx: 0, kids: 1, babies: 0, optIn: true, submitted: false };
    overlay.classList.remove('hidden');
    renderModal();
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function () {
    const overlay = document.getElementById('bookingModalOverlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('bookingModalOverlay')) {
      document.body.insertAdjacentHTML('beforeend', buildModalHTML());
    }
    const overlay  = document.getElementById('bookingModalOverlay');
    const closeBtn = document.getElementById('modalClose');

    closeBtn?.addEventListener('click', closeBookingModal);
    overlay?.addEventListener('click', e => {
      if (e.target === overlay) closeBookingModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeBookingModal();
    });
    document.querySelectorAll('[data-book]').forEach(btn => {
      btn.addEventListener('click', openBookingModal);
    });
  });
})();
