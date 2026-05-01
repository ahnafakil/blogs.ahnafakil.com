/* ============================================================
   ahnafakil.com  —  Blog engine (v3)
   Renders posts in three views: Grid (cards), Flow (list), Map (timeline).
   ============================================================ */

(function () {
  'use strict';

  var container = document.getElementById('post-list');
  var postCountEl = document.getElementById('post-count');
  if (!container) return;

  var postsData = [];
  var currentView = 'grid';

  var formatDate = function (iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  var escapeHtml = function (str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };

  var coverGradients = [
    'linear-gradient(135deg, #1a2a30 0%, #2a3a42 40%, #181F22 100%)',
    'linear-gradient(135deg, #1e2832 0%, #283844 40%, #181F22 100%)',
    'linear-gradient(150deg, #222e34 0%, #1a2830 50%, #181F22 100%)',
    'linear-gradient(120deg, #1c2e36 0%, #243440 40%, #181F22 100%)',
    'linear-gradient(135deg, #202c34 0%, #2c3c44 40%, #181F22 100%)',
    'linear-gradient(140deg, #1e2a34 0%, #26363e 45%, #181F22 100%)'
  ];

  /* ── GRID VIEW ── */
  function renderGrid(posts) {
    var wrapper = document.createElement('div');
    wrapper.className = 'blog-grid';

    if (!posts.length) {
      wrapper.innerHTML = '<div class="blog-empty glass"><p>No posts yet  ·  First one coming May 1</p></div>';
      return wrapper;
    }

    wrapper.innerHTML = posts.map(function (p, i) {
      var gradient = coverGradients[i % coverGradients.length];
      var coverImg = p.cover ? '<img src="' + escapeHtml(p.cover) + '" alt="" loading="lazy" />' : '';
      var category = p.category || 'Career';

      return '<a href="post.html?slug=' + encodeURIComponent(p.slug) + '" class="blog-card reveal" aria-label="Read ' + escapeHtml(p.title) + '">' +
        '<div class="blog-card-cover" style="background:' + gradient + ';">' +
          coverImg +
          '<div class="blog-card-overlay">' +
            '<span class="blog-card-category">' + escapeHtml(category) + '</span>' +
            '<h2>' + escapeHtml(p.title) + '</h2>' +
            '<time datetime="' + escapeHtml(p.date) + '">' + formatDate(p.date) + '</time>' +
          '</div>' +
        '</div>' +
        '<div class="blog-card-body">' +
          '<p class="excerpt">' + escapeHtml(p.excerpt || '') + '</p>' +
          '<div class="blog-card-footer">' +
            '<span class="read-label">Read <span class="arr" aria-hidden="true">\u2192</span></span>' +
            '<span class="reading-time">4 min read</span>' +
          '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    return wrapper;
  }

  /* ── FLOW VIEW ── */
  function renderFlow(posts) {
    var wrapper = document.createElement('div');
    wrapper.className = 'blog-flow';

    if (!posts.length) {
      wrapper.innerHTML = '<div class="blog-empty glass"><p>No posts yet</p></div>';
      return wrapper;
    }

    wrapper.innerHTML = posts.map(function (p) {
      return '<a href="post.html?slug=' + encodeURIComponent(p.slug) + '" class="glass flow-card reveal">' +
        '<time datetime="' + escapeHtml(p.date) + '">' + formatDate(p.date) + '</time>' +
        '<div>' +
          '<h2>' + escapeHtml(p.title) + '</h2>' +
          '<p class="excerpt">' + escapeHtml(p.excerpt || '') + '</p>' +
        '</div>' +
        '<span class="read-more">Read <span aria-hidden="true">\u2192</span></span>' +
      '</a>';
    }).join('');

    return wrapper;
  }

  /* ── MAP VIEW (timeline) ── */
  function renderMap(posts) {
    var wrapper = document.createElement('div');
    wrapper.className = 'blog-map';

    if (!posts.length) {
      wrapper.innerHTML = '<div class="blog-empty glass" style="margin-left:-40px"><p>No posts yet</p></div>';
      return wrapper;
    }

    wrapper.innerHTML = posts.map(function (p) {
      return '<div class="map-entry reveal">' +
        '<div class="map-date">' + formatDate(p.date) + '</div>' +
        '<a href="post.html?slug=' + encodeURIComponent(p.slug) + '" class="glass map-card">' +
          '<h2>' + escapeHtml(p.title) + '</h2>' +
          '<p class="excerpt">' + escapeHtml(p.excerpt || '') + '</p>' +
          '<span class="read-more">Read \u2192</span>' +
        '</a>' +
      '</div>';
    }).join('');

    return wrapper;
  }

  /* ── RENDER ── */
  function render(view) {
    currentView = view || currentView;
    container.innerHTML = '';

    var el;
    switch (currentView) {
      case 'flow': el = renderFlow(postsData); break;
      case 'map':  el = renderMap(postsData);  break;
      default:     el = renderGrid(postsData); break;
    }

    container.appendChild(el);

    // Trigger reveals
    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-visible'); }, i * 100);
      });
    });
  }

  // Expose for view toggle
  window.renderBlogView = render;

  /* ── FETCH ── */
  fetch('posts/posts.json', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('Failed to load posts manifest');
      return r.json();
    })
    .then(function (posts) {
      if (!Array.isArray(posts) || posts.length === 0) {
        postsData = [];
        if (postCountEl) postCountEl.textContent = '0';
        render('grid');
        return;
      }

      if (postCountEl) postCountEl.textContent = String(posts.length);

      postsData = posts.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      render('grid');
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML = '<div class="blog-grid"><div class="blog-empty glass"><p>Couldn\'t load posts. Please try again later.</p></div></div>';
    });
})();
