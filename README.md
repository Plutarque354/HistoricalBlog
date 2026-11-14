# The Long View — static history blog

A small, responsive **HTML + CSS + JavaScript** personal history blog. No build step, no npm, no framework.

## Included pages

- `index.html` — editorial homepage, featured essays, curated history-news links.
- `archive.html` — searchable, category-filtered essays.
- `essay.html?story=roman-republic` — reading layout; works for all three demo essays.
- `about.html` — editable About page.

## Open in WebStorm

1. Unzip the folder and **Open** it as a project in WebStorm.
2. Right-click `index.html` and select **Open in Browser**, or use WebStorm's built-in preview/local server.
3. Navigate with the site menu. Try the theme switcher, mobile layout, search filters, and sample articles.

**Important:** Use a local HTTP server (WebStorm's built-in server is fine). ES modules may be blocked by browsers when you double-click an HTML file and open it with a `file://` URL.

## JavaScript CDN import

`assets/js/main.js` imports Lucide icons using a **static ESM URL**:

```js
import { createIcons, ArrowRight, ArrowUpRight /* ... */ }
  from 'https://cdn.jsdelivr.net/npm/lucide@0.468.0/+esm';
```

The site uses no JavaScript framework, bundler, or `node_modules`. An internet connection is required for the icon module and Google Fonts. Images are bundled as original SVG illustrations, so they work offline.

## Customize

- **Blog name, layout, navigation, homepage copy:** edit `index.html` (and shared header/footer blocks in the other `.html` files).
- **About page:** edit `about.html`; its copy is deliberately generic starter text, not a real person's biography.
- **Design and colors:** edit CSS variables at the top of `assets/css/styles.css`.
- **Posts:** add/edit entries in `assets/js/data.js` under `essays`. Each entry requires a unique `slug`, some metadata, and content `sections`. Links use `essay.html?story=YOUR-SLUG`.
- **Curated external news:** update `readingLinks` in `assets/js/data.js`. The homepage has pre-rendered backup links, so update the matching links in `index.html` too if you want content without JavaScript.
- **Adding a category:** add it to a new article in `data.js` and add a corresponding `data-filter` button in `archive.html`.
- **Graphics:** replace `assets/img/*.svg` with your own images and update the file references in `data.js` / `index.html`.

## What works

- Responsive desktop/tablet/mobile menu
- Light/dark theme persisted with `localStorage`
- Live search and category filtering
- Three readable sample articles selected by query parameter
- Article reading-progress indicator and table of contents
- Real, curated external reading links (open in a new tab)
- Keyboard-friendly controls and a skip link

## News/source notes

The curated links were checked **November 13, 2026**. They are *not* an automatically updated news feed. Links lead to the original publishers, including **Smithsonian Magazine** and **JSTOR Daily**. You can also browse [The New York Times Science section](https://www.nytimes.com/section/science) for science/archaeology coverage. Publishers may apply paywalls, and external URLs may change over time.

Demo essays are original example editorial content, **not publication-ready academic research**. Add citations, a byline, and your own revisions before publishing them as factual commentary.

## Deploy with GitHub Pages (optional)

Push the contents to your existing repository. If using GitHub Pages, in your repo navigate to **Settings → Pages**, and choose deployment from the relevant branch/folder. Because every link is relative (`./`), this project also works under a repository subpath (for example, `username.github.io/my-repo/`).

## License and artwork

The included SVG artwork is original, created for this demo. External article titles and publication names belong to their respective publishers; this site links to them and does not copy the articles.
