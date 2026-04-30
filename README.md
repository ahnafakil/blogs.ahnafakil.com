# blogs.ahnafakil.com

Blog subdomain for Ahnaf Akil — notes from the bridge between IT Support and Software Engineering.

**Stack:** Vanilla HTML / CSS / JS · GitHub Pages · Decap CMS · Marked.js
**Aesthetic:** Slate glassmorphism (same design system as ahnafakil.com)
**Domain:** [blogs.ahnafakil.com](https://blogs.ahnafakil.com)

---

## File Structure

```
blogs-site/
├── index.html              ← Blog home (featured post + grid + sidebar)
├── post.html               ← Single post viewer (Marked.js)
├── 404.html
│
├── /assets
│   ├── /css/blog.css       ← Full blog design system
│   ├── /js/app.js          ← Nav, scroll reveals
│   ├── /js/blog.js         ← Blog engine (featured, grid, categories)
│   └── /img                ← Image uploads from CMS
│
├── /posts
│   ├── posts.json          ← Manifest read by blog.js
│   └── from-tickets-to-code.md
│
├── /admin
│   ├── index.html          ← Decap CMS shell
│   └── config.yml          ← Decap CMS config (with categories)
│
├── CNAME                   ← blogs.ahnafakil.com
├── .nojekyll
├── robots.txt
└── README.md
```

---

## Setup — Step by Step

### 1. Create a NEW GitHub repository

This blog lives in its own repo, separate from ahnafakil.com:

```bash
cd blogs-site
git init
git add .
git commit -m "Initial blog site"
git branch -M main
git remote add origin https://github.com/AhnafAkil/blogs.ahnafakil.com.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to the new repo's **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` / `(root)`
4. Save.

### 3. Add the DNS record for the subdomain

At your domain registrar, add a **CNAME record**:

```
blogs  →  ahnafakil.github.io
```

(Or `AhnafAkil.github.io` — whatever your GitHub username resolves to.)

After DNS propagates (usually 1–24 hours), go to **Settings → Pages** in the new repo and:
- Enter `blogs.ahnafakil.com` as the custom domain
- Check **Enforce HTTPS** once the certificate is issued

### 4. Set up Decap CMS authentication

You have two options:

**Option A — Use your existing Netlify Identity setup (easiest)**

If you already have Netlify Identity set up for ahnafakil.com, you can create a second Netlify site pointing to this new repo:

1. In Netlify, create a new site from the `blogs.ahnafakil.com` repo
2. Enable Identity on it
3. Enable Git Gateway
4. The `/admin` page will use this for auth

**Option B — Separate Netlify site just for auth**

1. Create a new Netlify site (can be blank — only using auth)
2. **Site settings → Identity → Enable Identity**
3. **Identity → Registration:** Invite only
4. **Identity → External providers:** add GitHub
5. **Identity → Services → Git Gateway:** Enable
6. Invite yourself

### 5. Update your main portfolio site

In your main `ahnafakil.com` repo, update the "Writing" nav links to point to the subdomain:

```html
<!-- In every page's nav -->
<li><a href="https://blogs.ahnafakil.com">Writing</a></li>
```

And in `index.html`, update the hero CTA:
```html
<a href="https://blogs.ahnafakil.com" class="btn">
  Read the Blog
</a>
```

You can also remove `blog.html`, `post.html`, `/posts/`, `/assets/js/blog.js`, and the `/admin/` folder from the main repo since everything blog-related now lives here.

---

## Writing a Post

### Via the CMS (recommended)

1. Go to `blogs.ahnafakil.com/admin`
2. Log in
3. Click "New Post"
4. Fill in: Title, Date, Excerpt, Category, Body
5. Hit Publish

Decap commits the markdown to `/posts/` and the manifest updates.

### Manually (without CMS)

1. Create `/posts/your-slug.md` with front-matter:

```markdown
---
title: "Your Post Title"
date: 2026-05-08T09:00:00-04:00
excerpt: "1-2 sentence summary."
category: "Learning"
---

Your post content in Markdown.
```

2. Add an entry to `/posts/posts.json`:

```json
{
  "slug": "your-slug",
  "title": "Your Post Title",
  "date": "2026-05-08T09:00:00-04:00",
  "excerpt": "1-2 sentence summary.",
  "category": "Learning",
  "file": "your-slug.md"
}
```

3. Commit and push.

---

## Categories

Posts support these categories (configured in `admin/config.yml`):

- **Career** — Career path, goals, transitions
- **Learning** — What you're studying and how
- **Projects** — Build logs, post-mortems
- **IT & Ops** — Lessons from IT Support
- **Web Dev** — HTML, CSS, JS, web fundamentals
- **Travel** — Travel agency, industry insights
- **General** — Everything else

To add new categories, edit the `options` list in `admin/config.yml` under the `category` field.

---

## Local Development

```bash
python3 -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000`.

---

## Design System

Same palette and type system as ahnafakil.com — see the main repo's README for the full reference. The blog adds:

- Featured post hero card with accent gradient top border
- Post grid (2-column on desktop)
- Category filter bar with active-state pills
- Sidebar with author card, category links, and external links

---

— Built May 2026
