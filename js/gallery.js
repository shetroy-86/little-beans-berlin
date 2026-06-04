// gallery.js — filter tabs + lightbox for gallery.html

(function () {
  // Gallery photo data — categories: space, action, events
  const PHOTOS = [
    // The Space (28 photos)
    { id: 's01', cat: 'space', label: 'The Space', src: 'assets/gallery/space-01.jpg' },
    { id: 's02', cat: 'space', label: 'The Space', src: 'assets/gallery/space-02.jpg' },
    { id: 's03', cat: 'space', label: 'The Space', src: 'assets/gallery/space-03.jpg' },
    { id: 's04', cat: 'space', label: 'The Space', src: 'assets/gallery/space-04.jpg' },
    { id: 's05', cat: 'space', label: 'The Space', src: 'assets/gallery/space-05.jpg' },
    { id: 's06', cat: 'space', label: 'The Space', src: 'assets/gallery/space-06.jpg' },
    { id: 's07', cat: 'space', label: 'The Space', src: 'assets/gallery/space-07.jpg' },
    { id: 's08', cat: 'space', label: 'The Space', src: 'assets/gallery/space-08.jpg' },
    { id: 's09', cat: 'space', label: 'The Space', src: 'assets/gallery/space-09.jpg' },
    { id: 's10', cat: 'space', label: 'The Space', src: 'assets/gallery/space-10.jpg' },
    { id: 's11', cat: 'space', label: 'The Space', src: 'assets/gallery/space-11.jpg' },
    { id: 's12', cat: 'space', label: 'The Space', src: 'assets/gallery/space-12.jpg' },
    { id: 's13', cat: 'space', label: 'The Space', src: 'assets/gallery/space-13.jpg' },
    { id: 's14', cat: 'space', label: 'The Space', src: 'assets/gallery/space-14.jpg' },
    { id: 's15', cat: 'space', label: 'The Space', src: 'assets/gallery/space-15.jpg' },
    { id: 's16', cat: 'space', label: 'The Space', src: 'assets/gallery/space-16.jpg' },
    { id: 's17', cat: 'space', label: 'The Space', src: 'assets/gallery/space-17.jpg' },
    { id: 's18', cat: 'space', label: 'The Space', src: 'assets/gallery/space-18.jpg' },
    { id: 's19', cat: 'space', label: 'The Space', src: 'assets/gallery/space-19.jpg' },
    { id: 's20', cat: 'space', label: 'The Space', src: 'assets/gallery/space-20.jpg' },
    { id: 's21', cat: 'space', label: 'The Space', src: 'assets/gallery/space-21.jpg' },
    { id: 's22', cat: 'space', label: 'The Space', src: 'assets/gallery/space-22.jpg' },
    { id: 's23', cat: 'space', label: 'The Space', src: 'assets/gallery/space-23.jpg' },
    { id: 's24', cat: 'space', label: 'The Space', src: 'assets/gallery/space-24.jpg' },
    { id: 's25', cat: 'space', label: 'The Space', src: 'assets/gallery/space-25.jpg' },
    { id: 's26', cat: 'space', label: 'The Space', src: 'assets/gallery/space-26.jpg' },
    { id: 's27', cat: 'space', label: 'The Space', src: 'assets/gallery/space-27.jpg' },
    { id: 's28', cat: 'space', label: 'The Space', src: 'assets/gallery/space-28.jpg' },
    // Beans in Action (17 photos)
    { id: 'a01', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-01.jpg' },
    { id: 'a02', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-02.jpg' },
    { id: 'a03', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-03.jpg' },
    { id: 'a04', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-04.jpg' },
    { id: 'a05', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-05.jpg' },
    { id: 'a06', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-06.jpg' },
    { id: 'a07', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-07.jpg' },
    { id: 'a08', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-08.jpg' },
    { id: 'a09', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-09.jpg' },
    { id: 'a10', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-10.jpg' },
    { id: 'a11', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-11.jpg' },
    { id: 'a12', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-12.jpg' },
    { id: 'a13', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-13.jpg' },
    { id: 'a14', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-14.jpg' },
    { id: 'a15', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-15.jpg' },
    { id: 'a16', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-16.jpg' },
    { id: 'a17', cat: 'action', label: 'Little Beans in Action', src: 'assets/gallery/action-17.jpg' },
    // Events (7 photos — events-02 is .png)
    { id: 'e01', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-01.jpg' },
    { id: 'e02', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-02.png' },
    { id: 'e03', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-03.jpg' },
    { id: 'e04', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-04.jpg' },
    { id: 'e05', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-05.jpg' },
    { id: 'e06', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-06.jpg' },
    { id: 'e07', cat: 'events', label: 'Special Events', src: 'assets/gallery/events-07.jpg' },
  ];

  const TABS = [
    { id: 'all', label: 'All' },
    { id: 'space', label: 'The Space' },
    { id: 'action', label: 'In Action' },
    { id: 'events', label: 'Events' },
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

    // Pre-select a filter tab if ?filter= is in the URL
    const urlFilter = new URLSearchParams(location.search).get('filter');
    if (urlFilter && TABS.some(t => t.id === urlFilter)) activeTab = urlFilter;

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

    // Hide filter bar on scroll down, show on scroll up
    const filterWrap = document.querySelector('.filter-tabs-wrap');
    if (filterWrap) {
      let lastScrollY = window.scrollY;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < 80) {
          filterWrap.classList.remove('filter-hidden');
        } else if (y > lastScrollY) {
          filterWrap.classList.add('filter-hidden');
        } else {
          filterWrap.classList.remove('filter-hidden');
        }
        lastScrollY = y;
      }, { passive: true });
    }
  });
})();
