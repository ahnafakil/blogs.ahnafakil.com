/* ============================================================
   blogs.ahnafakil.com  —  Blog engine (Instagram-style)
   Fetches /posts/posts.json, renders profile stats, category
   tabs, and a 3-column grid of post cells.
   ============================================================ */

(function () {
  'use strict';

  const gridEl     = document.getElementById('post-grid');
  const tabsEl     = document.getElementById('profile-tabs');
  const postCountEl = document.getElementById('post-count');
  const catCountEl  = document.getElementById('category-count');

  if (!gridEl) return;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const esc = (str) => {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };

  // Gradient class based on index for visual variety
  const gradClass = (i) => `grad-${(i % 6) + 1}`;

  // ─── Render a grid cell ───────────────────────────────────
  const renderCell = (p, i) => {
    const hasCover = p.cover && p.cover.trim() !== '';
    const bg = hasCover
      ? `<img class="cell-bg" src="${esc(p.cover)}" alt="" loading="lazy" />`
      : `<div class="cell-gradient ${gradClass(i)}"></div>`;

    return `
      <a href="post.html?slug=${encodeURIComponent(p.slug)}"
         class="grid-cell"
         data-category="${esc(p.category || 'General')}"
         aria-label="Read: ${esc(p.title)}"
         style="animation-delay: ${i * 0.06}s">
        ${bg}
        <div class="cell-overlay">
          <span class="cell-category">${esc(p.category || 'General')}</span>
          <span class="cell-title">${esc(p.title)}</span>
          <span class="cell-date">${formatDate(p.date)}</span>
        </div>
        <span class="cell-read">Read <span aria-hidden="true">→</span></span>
      </a>
    `;
  };

  // ─── Build category tabs ──────────────────────────────────
  const renderTabs = (posts) => {
    if (!tabsEl) return;

    const counts = {};
    posts.forEach(p => {
      const cat = p.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Update category count stat
    if (catCountEl) catCountEl.textContent = Object.keys(counts).length;

    const gridIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`;

    let html = `<button class="tab-btn is-active" data-cat="all">${gridIcon} All</button>`;

    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat]) => {
        html += `<button class="tab-btn" data-cat="${esc(cat)}">${esc(cat)}</button>`;
      });

    tabsEl.innerHTML = html;

    // Filter handler
    tabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const cat = btn.dataset.cat;
      gridEl.querySelectorAll('.grid-cell').forEach(cell => {
        if (cat === 'all' || cell.dataset.category === cat) {
          cell.style.display = '';
        } else {
          cell.style.display = 'none';
        }
      });
    });
  };

  // ─── Fetch and render ─────────────────────────────────────
  fetch('posts/posts.json', { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error('Failed to load posts manifest');
      return r.json();
    })
    .then(posts => {
      if (!Array.isArray(posts) || posts.length === 0) {
        gridEl.innerHTML = `
          <div class="empty-state">
            <p>No posts yet — first one coming soon</p>
          </div>`;
        return;
      }

      // Sort newest first
      const sorted = posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Update post count stat
      if (postCountEl) postCountEl.textContent = sorted.length;

      // Render grid
      gridEl.innerHTML = sorted.map(renderCell).join('');

      // Render tabs
      renderTabs(sorted);
    })
    .catch(err => {
      console.error(err);
      gridEl.innerHTML = `
        <div class="empty-state">
          <p>Couldn't load posts right now. Please try again later.</p>
        </div>`;
    });
})();
