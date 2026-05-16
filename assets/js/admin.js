/* ============================================================
   blog.ahnafakil.com — Admin / Stream layer (Supabase-powered)
   Save this file as: assets/js/admin.js
   ============================================================ */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/* ===== CONFIG ===== */
const SUPABASE_URL = 'https://idlfwyiidpkbafmzusqq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cZ6SeM2sJZ4pSha_lnJSQQ_ngjTZqk-';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let pendingImage = null;
let fragments = [];

/* ===== Styles (matches main.css glassmorphism tokens) ===== */
const css = `
.stream-section{margin-bottom:var(--s-6)}
.stream-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:var(--s-3);padding:0 var(--s-1)}
.stream-head h2{font-family:var(--font-serif);font-size:1.5rem;font-style:italic;color:var(--text-primary);margin:0;letter-spacing:-.01em}
.stream-head .stream-meta{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text-tertiary)}
.compose-card{display:none;padding:var(--s-4);margin-bottom:var(--s-4);background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border-strong);border-radius:20px;box-shadow:var(--glass-shadow)}
.compose-card.is-visible{display:block}
.compose-card .row-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-2)}
.compose-card .row-top .who{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cadet)}
.compose-card .row-top .who .dot{display:inline-block;width:6px;height:6px;background:#7DD8A8;border-radius:50%;margin-right:6px;vertical-align:middle;box-shadow:0 0 8px rgba(125,216,168,.6)}
.compose-card .row-top .logout{background:none;border:none;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-tertiary);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.compose-card .row-top .logout:hover{color:var(--cadet)}
.compose-card textarea{width:100%;background:transparent;border:none;outline:none;resize:none;color:var(--text-primary);font-family:var(--font-sans);font-size:1rem;line-height:1.55;min-height:3.5rem}
.compose-card textarea::placeholder{color:var(--text-tertiary);font-style:italic;font-family:var(--font-serif)}
.compose-card .img-preview{position:relative;margin-top:var(--s-2);display:none}
.compose-card .img-preview.is-visible{display:block}
.compose-card .img-preview img{width:100%;max-height:360px;object-fit:cover;border-radius:12px;border:1px solid var(--glass-border)}
.compose-card .img-remove{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;border:none;cursor:pointer;display:grid;place-items:center;font-size:16px}
.compose-card .row-bot{display:flex;justify-content:space-between;align-items:center;margin-top:var(--s-3);padding-top:var(--s-3);border-top:1px solid var(--glass-border);gap:var(--s-2);flex-wrap:wrap}
.compose-card .tools{display:flex;gap:var(--s-2);align-items:center}
.compose-card .tool{width:34px;height:34px;border-radius:10px;background:transparent;border:1px solid var(--glass-border);color:var(--text-secondary);cursor:pointer;display:grid;place-items:center;transition:all .2s var(--ease-out)}
.compose-card .tool:hover{color:var(--cadet);border-color:var(--glass-border-strong);background:var(--glass-bg-strong)}
.compose-card .tool svg{width:16px;height:16px}
.compose-card .cat-select{font-family:var(--font-mono);font-size:.7rem;background:transparent;border:1px solid var(--glass-border);color:var(--text-secondary);border-radius:10px;padding:6px 10px;cursor:pointer;outline:none}
.compose-card .publish{background:var(--cadet);color:var(--deepspc);border:none;padding:9px 20px;border-radius:100px;font-family:var(--font-sans);font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s var(--ease-out)}
.compose-card .publish:hover{background:var(--text-primary)}
.compose-card .publish:disabled{opacity:.5;cursor:not-allowed}
.fragments{display:flex;flex-direction:column;gap:var(--s-3)}
.fragment{padding:var(--s-4);background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);border-radius:20px;box-shadow:var(--glass-shadow);position:relative;transition:border-color .3s var(--ease-out)}
.fragment:hover{border-color:var(--glass-border-strong)}
.fragment .frag-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-2);font-family:var(--font-mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-tertiary)}
.fragment .frag-meta .left{display:flex;gap:var(--s-2);align-items:center}
.fragment .frag-meta .cat{color:var(--cadet);padding:2px 10px;border:1px solid var(--glass-border);border-radius:100px;background:var(--glass-bg-strong)}
.fragment .frag-meta .actions{display:flex;gap:var(--s-2);opacity:0;transition:opacity .2s}
.fragment:hover .frag-meta .actions{opacity:1}
@media(max-width:720px){.fragment .frag-meta .actions{opacity:1}}
.fragment .frag-meta .actions button{background:none;border:none;color:var(--text-tertiary);font-family:var(--font-mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
.fragment .frag-meta .actions button:hover{color:var(--text-primary)}
.fragment .frag-meta .actions button.danger:hover{color:#C97064}
.fragment .frag-body{font-family:var(--font-sans);font-size:1.0625rem;line-height:1.6;color:var(--text-primary);white-space:pre-wrap;word-break:break-word;margin:0}
.fragment .frag-body a{color:var(--cadet);border-bottom:1px solid var(--glass-border-strong)}
.fragment .frag-image{margin-top:var(--s-3);width:100%;max-height:540px;object-fit:cover;border-radius:14px;border:1px solid var(--glass-border);display:block}
.fragment-empty{padding:var(--s-5);text-align:center;font-family:var(--font-serif);font-style:italic;color:var(--text-tertiary);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:20px;font-size:1rem}
.login-modal{position:fixed;inset:0;background:rgba(24,31,34,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:200;display:none;place-items:center;padding:var(--s-3)}
.login-modal.is-open{display:grid}
.login-modal .panel{background:var(--glass-bg-strong);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border-strong);border-radius:20px;padding:var(--s-5);width:100%;max-width:380px;box-shadow:0 24px 80px rgba(0,0,0,.5)}
.login-modal h3{font-family:var(--font-serif);font-style:italic;font-size:1.6rem;color:var(--text-primary);margin-bottom:var(--s-1)}
.login-modal .sub{font-family:var(--font-mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:var(--s-4)}
.login-modal .field{margin-bottom:var(--s-3)}
.login-modal .field label{display:block;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px}
.login-modal .field input{width:100%;padding:11px 14px;font-family:var(--font-sans);font-size:.95rem;color:var(--text-primary);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;outline:none;transition:border-color .2s}
.login-modal .field input:focus{border-color:var(--cadet);background:var(--glass-bg-strong)}
.login-modal .err{color:#C97064;font-size:.85rem;margin:8px 0;display:none}
.login-modal .err.is-visible{display:block}
.login-modal .actions{display:flex;gap:var(--s-2);margin-top:var(--s-4)}
.login-modal .actions button{flex:1;padding:11px 18px;border-radius:100px;font-family:var(--font-sans);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s var(--ease-out)}
.login-modal .actions .cancel{background:transparent;border:1px solid var(--glass-border);color:var(--text-secondary)}
.login-modal .actions .submit{background:var(--cadet);border:1px solid var(--cadet);color:var(--deepspc);font-weight:600}
.login-modal .actions .submit:hover{background:var(--text-primary);border-color:var(--text-primary)}
`;
const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

/* ===== Stream section DOM ===== */
const streamSection = document.createElement('div');
streamSection.className = 'stream-section reveal';
streamSection.innerHTML = `
  <div class="stream-head">
    <h2>Stream</h2>
    <span class="stream-meta" id="stream-count">— posts</span>
  </div>
  <div class="compose-card" id="compose-card">
    <div class="row-top">
      <span class="who"><span class="dot"></span>Posting as admin</span>
      <button class="logout" id="logout-btn">Log out</button>
    </div>
    <textarea id="compose-text" placeholder="What's on your mind?" rows="2"></textarea>
    <div class="img-preview" id="img-preview">
      <img id="preview-img" alt="" />
      <button class="img-remove" id="img-remove" aria-label="Remove image">×</button>
    </div>
    <div class="row-bot">
      <div class="tools">
        <input type="file" id="image-input" accept="image/*" style="display:none" />
        <button class="tool" id="add-image-btn" title="Add image" aria-label="Add image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        </button>
        <select class="cat-select" id="cat-select" title="Category">
          <option value="Vibes">Vibes</option>
          <option value="Travel">Travel</option>
          <option value="Code">Code</option>
          <option value="Agency">Agency</option>
          <option value="Setup">Setup</option>
        </select>
      </div>
      <button class="publish" id="publish-btn">Publish</button>
    </div>
  </div>
  <div class="fragments" id="fragments-list">
    <div class="fragment-empty">Loading stream…</div>
  </div>
`;

const highlights = document.querySelector('.highlights');
const viewToggle = document.querySelector('.view-toggle');
if (highlights && viewToggle) {
  viewToggle.parentNode.insertBefore(streamSection, viewToggle);
} else if (highlights) {
  highlights.parentNode.insertBefore(streamSection, highlights.nextSibling);
}

/* ===== Login modal ===== */
const loginModal = document.createElement('div');
loginModal.className = 'login-modal';
loginModal.id = 'login-modal';
loginModal.innerHTML = `
  <div class="panel">
    <h3>Sign in</h3>
    <p class="sub">Admin only</p>
    <div class="field">
      <label for="email-in">Email</label>
      <input type="email" id="email-in" autocomplete="email" />
    </div>
    <div class="field">
      <label for="pass-in">Password</label>
      <input type="password" id="pass-in" autocomplete="current-password" />
    </div>
    <div class="err" id="login-err"></div>
    <div class="actions">
      <button class="cancel" id="login-cancel">Cancel</button>
      <button class="submit" id="login-submit">Continue</button>
    </div>
  </div>
`;
document.body.appendChild(loginModal);

/* ===== Refs ===== */
const $ = id => document.getElementById(id);
const composeCard = $('compose-card');
const composeText = $('compose-text');
const imgPreview = $('img-preview');
const previewImg = $('preview-img');
const imageInput = $('image-input');
const fragmentsList = $('fragments-list');
const streamCount = $('stream-count');

/* ===== "New" highlight triggers login ===== */
const newHighlight = document.querySelector('.hl-add');
if (newHighlight) {
  newHighlight.style.cursor = 'pointer';
  newHighlight.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
      composeText.focus();
      composeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      openLogin();
    }
  });
}
if (new URLSearchParams(location.search).has('admin')) openLogin();

function openLogin() {
  loginModal.classList.add('is-open');
  setTimeout(() => $('email-in').focus(), 50);
}
function closeLogin() {
  loginModal.classList.remove('is-open');
  $('email-in').value = '';
  $('pass-in').value = '';
  $('login-err').classList.remove('is-visible');
}
$('login-cancel').addEventListener('click', closeLogin);
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLogin(); });
$('pass-in').addEventListener('keydown', e => { if (e.key === 'Enter') $('login-submit').click(); });

$('login-submit').addEventListener('click', async () => {
  const err = $('login-err');
  err.classList.remove('is-visible');
  const { error } = await supabase.auth.signInWithPassword({
    email: $('email-in').value.trim(),
    password: $('pass-in').value
  });
  if (error) {
    err.textContent = 'Invalid credentials.';
    err.classList.add('is-visible');
    return;
  }
  closeLogin();
});

$('logout-btn').addEventListener('click', () => supabase.auth.signOut());

/* ===== Auth state ===== */
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  setUser(session?.user || null);
  supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
})();

function setUser(u) {
  currentUser = u;
  composeCard.classList.toggle('is-visible', !!u);
  renderFragments();
}

/* ===== Image picker ===== */
$('add-image-btn').addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  pendingImage = file;
  const reader = new FileReader();
  reader.onload = ev => { previewImg.src = ev.target.result; imgPreview.classList.add('is-visible'); };
  reader.readAsDataURL(file);
});
$('img-remove').addEventListener('click', () => {
  pendingImage = null;
  imageInput.value = '';
  imgPreview.classList.remove('is-visible');
});

/* ===== Publish ===== */
$('publish-btn').addEventListener('click', async () => {
  const text = composeText.value.trim();
  if (!text && !pendingImage) return;
  const btn = $('publish-btn');
  btn.disabled = true; btn.textContent = 'Publishing…';
  try {
    let imageUrl = null, imagePath = null;
    if (pendingImage) {
      const ext = (pendingImage.name.split('.').pop() || 'jpg').toLowerCase();
      imagePath = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('stream-images').upload(imagePath, pendingImage);
      if (upErr) throw upErr;
      imageUrl = supabase.storage.from('stream-images').getPublicUrl(imagePath).data.publicUrl;
    }
    const { error: insErr } = await supabase.from('fragments').insert({
      text,
      image_url: imageUrl,
      image_path: imagePath,
      category: $('cat-select').value,
      author_id: currentUser.id
    });
    if (insErr) throw insErr;
    composeText.value = '';
    pendingImage = null;
    imageInput.value = '';
    imgPreview.classList.remove('is-visible');
    await loadFragments();
  } catch (err) {
    alert('Failed to publish: ' + (err.message || err));
  } finally {
    btn.disabled = false; btn.textContent = 'Publish';
  }
});

/* ===== Fetch + render ===== */
async function loadFragments() {
  const { data, error } = await supabase
    .from('fragments').select('*').order('created_at', { ascending: false });
  if (error) {
    fragmentsList.innerHTML = `<div class="fragment-empty">Couldn't load stream.</div>`;
    return;
  }
  fragments = data || [];
  streamCount.textContent = `${fragments.length} ${fragments.length === 1 ? 'post' : 'posts'}`;
  renderFragments();
}

function renderFragments() {
  if (!fragments.length) {
    fragmentsList.innerHTML = `<div class="fragment-empty">Nothing in the stream yet.</div>`;
    return;
  }
  fragmentsList.innerHTML = fragments.map(f => {
    const when = f.created_at ? relTime(new Date(f.created_at)) : 'just now';
    const cat = f.category ? `<span class="cat">${esc(f.category)}</span>` : '';
    const actions = currentUser ? `
      <div class="actions">
        <button data-act="edit" data-id="${f.id}">Edit</button>
        <button data-act="del" data-id="${f.id}" class="danger">Delete</button>
      </div>` : '';
    const img = f.image_url ? `<img class="frag-image" src="${esc(f.image_url)}" alt="" loading="lazy" />` : '';
    return `
      <article class="fragment">
        <div class="frag-meta">
          <div class="left">${cat}<span>${when}</span></div>
          ${actions}
        </div>
        <p class="frag-body">${linkify(esc(f.text || ''))}</p>
        ${img}
      </article>`;
  }).join('');
}

fragmentsList.addEventListener('click', async e => {
  const btn = e.target.closest('[data-act]');
  if (!btn || !currentUser) return;
  const id = btn.dataset.id;
  const frag = fragments.find(x => x.id === id);
  if (!frag) return;
  if (btn.dataset.act === 'del') {
    if (!confirm('Delete this post?')) return;
    if (frag.image_path) await supabase.storage.from('stream-images').remove([frag.image_path]);
    await supabase.from('fragments').delete().eq('id', id);
    await loadFragments();
  } else if (btn.dataset.act === 'edit') {
    const next = prompt('Edit post:', frag.text || '');
    if (next === null) return;
    await supabase.from('fragments').update({ text: next.trim() }).eq('id', id);
    await loadFragments();
  }
});

loadFragments();

supabase.channel('fragments-rt')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'fragments' }, loadFragments)
  .subscribe();

/* ===== Helpers ===== */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function linkify(t) {
  return t.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}
function relTime(d) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm';
  if (s < 86400) return Math.floor(s/3600) + 'h';
  if (s < 604800) return Math.floor(s/86400) + 'd';
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
