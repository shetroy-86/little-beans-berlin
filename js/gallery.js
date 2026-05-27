// gallery.js — filter tabs + lightbox for gallery.html

(function () {
  // Gallery photo data — categories: space, action, events, parties
  const PHOTOS = [
    // The Space
    { id: 's01', cat: 'space', label: 'The Space', src: 'gallery/space/baby-beans.png' },
    { id: 's02', cat: 'space', label: 'The Space', src: 'gallery/space/baby-beans-2.png' },
    { id: 's03', cat: 'space', label: 'The Space', src: 'gallery/space/baby-beans-3.png' },
    { id: 's04', cat: 'space', label: 'The Space', src: 'gallery/space/baby-beans-4.png' },
    { id: 's05', cat: 'space', label: 'The Space', src: 'gallery/space/climbing-1.png' },
    { id: 's06', cat: 'space', label: 'The Space', src: 'gallery/space/climbing-2.png' },
    { id: 's07', cat: 'space', label: 'The Space', src: 'gallery/space/climbing-3.png' },
    { id: 's08', cat: 'space', label: 'The Space', src: 'gallery/space/climbing-4.png' },
    { id: 's09', cat: 'space', label: 'The Space', src: 'gallery/space/climbing-6.png' },
    { id: 's10', cat: 'space', label: 'The Space', src: 'gallery/space/climbing-7.png' },
    { id: 's11', cat: 'space', label: 'The Space', src: 'gallery/space/ball-pit-close-up.png' },
    { id: 's12', cat: 'space', label: 'The Space', src: 'gallery/space/drum-set.png' },
    { id: 's13', cat: 'space', label: 'The Space', src: 'gallery/space/fort.png' },
    { id: 's14', cat: 'space', label: 'The Space', src: 'gallery/space/magnet-wall-3.png' },
    { id: 's15', cat: 'space', label: 'The Space', src: 'gallery/space/market-food.png' },
    { id: 's16', cat: 'space', label: 'The Space', src: 'gallery/space/puzzle-corner.png' },
    { id: 's17', cat: 'space', label: 'The Space', src: 'gallery/space/bible-storyboard-2.png' },
    // Beans in Action
    { id: 'a01', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/ball-pit.png' },
    { id: 'a02', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/blow-dry.png' },
    { id: 'a03', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/climbing-5.png' },
    { id: 'a04', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/cozy-fort-enhanced.png' },
    { id: 'a05', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/girls-playing.png' },
    { id: 'a06', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/jumpin-1.png' },
    { id: 'a07', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/jumping-2.png' },
    { id: 'a08', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/jungle-gym-fun.png' },
    { id: 'a09', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/kids-playing.png' },
    { id: 'a10', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/magnet-wall-2.png' },
    { id: 'a11', cat: 'action', label: 'Little Beans in Action', src: 'gallery/action/magnet-wall-4.png' },
    // Events
    { id: 'e01', cat: 'events', label: 'Special Events', src: 'gallery/events/hair.png' },
    // Parties
    { id: 'p01', cat: 'parties', label: 'Birthday Party', src: 'gallery/parties/birthday-boy.png' },
    { id: 'p02', cat: 'parties', label: 'Birthday Party', src: 'gallery/parties/birthday-party-family.png' }
  ];

  const TABS = [
    { id: 'all', label: 'All Photos' },
    { id: 'space', label: 'The Space' },
    { id: 'action', label: 'Little Beans in Action' },
    { id: 'events', label: 'Special Events' },
    { id: 'parties', label: 'Birthday Parties' }
  ];

  let activeTab = 'all';
  let lightboxIdx = -1;
  let filteredPhotos = [...PHOTOS];

  const svgArrowUpRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="9 7 17 7 17 15"/></svg>`;
  const svgChevLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>`;
  const svgChevRight = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;
  const svgX = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`;

  function getFiltered() {
    return activeTab === 'all' ? PHOTOS : PHOTOS.filter(p => p.cat === activeTab);
  }

  function renderTabs() {
    const container = document.getElementById('filterTabs');
    if (!container) return;

    const counts = { all: PHOTOS.length };
    PHOTOS.forEach(p => { counts[p.cat] = (counts[p.cat] || 0) + 1; });

    container.innerHTML = TABS.map(t => `
      <button class="filter-tab${activeTab === t.id ? ' active' : ''}" data-tab="${t.id}">
        ${t.label}
        <span class="count">${counts[t.id] || 0}</span>
      </button>`).join('');

    container.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        filteredPhotos = getFiltered();
        lightboxIdx = -1;
        renderTabs();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const container = document.getElementById('galleryGrid');
    if (!container) return;

    if (!filteredPhotos.length) {
      container.innerHTML = `
        <div class="gallery-empty">
          <div class="emoji">📷</div>
          <h3>Nothing here yet</h3>
          <p>Photos from this category coming soon.</p>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="masonry">` +
      filteredPhotos.map((p, i) => `
        <button class="masonry-item" data-photo-idx="${i}" aria-label="View ${p.label}">
          <img src="${p.src}" alt="${p.label}" loading="lazy"/>
          <span class="img-label" style="color:var(--purple)">${p.label}</span>
          <span class="img-hover-btn">${svgArrowUpRight}</span>
        </button>`).join('') +
      `</div>`;

    container.querySelectorAll('.masonry-item').forEach(btn => {
      btn.addEventListener('click', () => {
        lightboxIdx = parseInt(btn.dataset.photoIdx);
        renderLightbox();
      });
    });
  }

  function renderLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;

    if (lightboxIdx === -1) {
      overlay.classList.add('hidden');
      return;
    }

    const photo = filteredPhotos[lightboxIdx];
    overlay.classList.remove('hidden');
    document.getElementById('lightboxImg').src = photo.src;
    document.getElementById('lightboxImg').alt = photo.label;
    document.getElementById('lightboxLabel').textContent = photo.label;
    document.getElementById('lightboxCount').textContent = `${lightboxIdx + 1} / ${filteredPhotos.length}`;
  }

  function navLightbox(dir) {
    if (!filteredPhotos.length) return;
    lightboxIdx = (lightboxIdx + dir + filteredPhotos.length) % filteredPhotos.length;
    renderLightbox();
  }

  function buildLightboxHTML() {
    return `
<div class="lightbox-overlay hidden" id="lightboxOverlay" role="dialog" aria-modal="true">
  <button class="lightbox-close" id="lightboxClose" aria-label="Close">${svgX}</button>
  <button class="lightbox-prev" id="lightboxPrev" aria-label="Previous">${svgChevLeft}</button>
  <button class="lightbox-next" id="lightboxNext" aria-label="Next">${svgChevRight}</button>
  <div class="lightbox-content" id="lightboxContent">
    <div class="lightbox-img-wrap">
      <img id="lightboxImg" src="" alt=""/>
    </div>
    <div class="lightbox-caption">
      <span class="lb-label" id="lightboxLabel"></span>
      <span class="lb-count" id="lightboxCount"></span>
    </div>
  </div>
</div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inject lightbox
    if (!document.getElementById('lightboxOverlay')) {
      document.body.insertAdjacentHTML('beforeend', buildLightboxHTML());
    }

    filteredPhotos = getFiltered();
    renderTabs();
    renderGrid();

    // Lightbox controls
    document.getElementById('lightboxClose')?.addEventListener('click', () => {
      lightboxIdx = -1;
      renderLightbox();
    });
    document.getElementById('lightboxPrev')?.addEventListener('click', e => { e.stopPropagation(); navLightbox(-1); });
    document.getElementById('lightboxNext')?.addEventListener('click', e => { e.stopPropagation(); navLightbox(1); });

    document.getElementById('lightboxOverlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) { lightboxIdx = -1; renderLightbox(); }
    });

    document.addEventListener('keydown', e => {
      if (lightboxIdx === -1) return;
      if (e.key === 'Escape') { lightboxIdx = -1; renderLightbox(); }
      if (e.key === 'ArrowRight') navLightbox(1);
      if (e.key === 'ArrowLeft') navLightbox(-1);
    });
  });
})();
