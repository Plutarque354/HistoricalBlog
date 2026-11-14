/* Static ESM CDN import — no build step, no npm, no framework. */
import {
  createIcons, ArrowRight, ArrowUpRight, ArrowLeft, BookOpen, Compass, Menu,
  X, Sun, Moon, Search, Feather, ExternalLink, CalendarDays, ScrollText
} from 'https://cdn.jsdelivr.net/npm/lucide@0.468.0/+esm';
import { essays, readingLinks } from './data.js';

const ICONS = { ArrowRight, ArrowUpRight, ArrowLeft, BookOpen, Compass, Menu, X, Sun, Moon, Search, Feather, ExternalLink, CalendarDays, ScrollText };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const icons = () => createIcons({ icons: ICONS, attrs: { 'stroke-width': 1.7 } });

function initializeTheme() {
  try {
    const saved = localStorage.getItem('tlv-theme');
    if (saved === 'dark' || saved === 'light') document.body.dataset.theme = saved;
  } catch { /* Browsers may restrict storage on file: URLs. */ }
  $$('.theme-toggle').forEach(button => button.addEventListener('click', () => {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    button.setAttribute('aria-label', isDark ? 'Switch to dark theme' : 'Switch to light theme');
    try { localStorage.setItem('tlv-theme', document.body.dataset.theme); } catch {}
  }));
}

function initializeMobileMenu() {
  const toggle = $('.mobile-toggle');
  const nav = $('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  });
  $$('a', nav).forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
}

function storyCard(story) {
  const url = `./essay.html?story=${encodeURIComponent(story.slug)}`;
  return `<article class="story-card">
    <a class="story-media" href="${url}" aria-label="Read ${escapeHTML(story.title)}">
      <img src="${story.image}" alt="${escapeHTML(story.imageAlt)}" loading="lazy" />
      <span class="story-label">${escapeHTML(story.category)}</span>
    </a>
    <div class="story-meta"><span>${escapeHTML(story.date)}</span><span class="dot"></span><span>${escapeHTML(story.readTime)}</span></div>
    <h3 class="story-title"><a href="${url}">${escapeHTML(story.shortTitle)}</a></h3>
    <p class="story-summary">${escapeHTML(story.excerpt)}</p>
    <a class="story-link" href="${url}">Read the essay <i data-lucide="arrow-up-right"></i></a>
  </article>`;
}

function initializeHomepage() {
  const cards = $('#featured-stories');
  if (cards) { cards.innerHTML = essays.map(storyCard).join(''); icons(); }
  const reading = $('#reading-list');
  if (reading) {
    reading.innerHTML = readingLinks.map((item, index) => `
      <a class="reading-item" href="${item.url}" target="_blank" rel="noopener noreferrer">
        <span class="reading-index">0${index + 1}</span>
        <span><span class="reading-title">${escapeHTML(item.title)}</span><span class="reading-meta">${escapeHTML(item.publication)} &nbsp;·&nbsp; ${escapeHTML(item.date)}</span></span>
        <i data-lucide="arrow-up-right" class="reading-arrow"></i>
      </a>`).join('');
    icons();
  }
}

function initializeArchive() {
  const cards = $('#archive-stories');
  if (!cards) return;
  const buttons = $$('.filter-chip');
  const search = $('#story-search');
  const count = $('#archive-count');
  let activeFilter = 'All stories';
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const results = essays.filter(story =>
      (activeFilter === 'All stories' || story.category === activeFilter) &&
      `${story.title} ${story.category} ${story.excerpt} ${story.period}`.toLocaleLowerCase().includes(query)
    );
    count.textContent = `${results.length} ${results.length === 1 ? 'essay' : 'essays'} found`;
    cards.innerHTML = results.length ? results.map(storyCard).join('') :
      '<div class="empty-state"><h3>No stories found.</h3><p>Try a different search or select another topic.</p></div>';
    icons();
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    buttons.forEach(chip => { chip.classList.toggle('is-active', chip === button); chip.setAttribute('aria-pressed', String(chip === button)); });
    render();
  }));
  search.addEventListener('input', render);
  render();
}

function initializeEssay() {
  const mount = $('#essay-content');
  if (!mount) return;
  const slug = new URLSearchParams(window.location.search).get('story') || 'roman-republic';
  const story = essays.find(item => item.slug === slug);
  if (!story) {
    document.title = 'Story not found | The Long View';
    mount.innerHTML = '<div class="article-error"><h1>That story is missing.</h1><p>It may have been moved or renamed.</p><a class="btn btn-primary" href="./archive.html">Back to the archive <i data-lucide="arrow-right"></i></a></div>';
    icons(); return;
  }
  document.title = `${story.title} | The Long View`;
  const toc = story.sections.map((section, index) =>
    `<a href="#section-${index + 1}">${escapeHTML(section.heading)}</a>`).join('');
  const content = story.sections.map((section, index) => `
    <section id="section-${index + 1}"><h2>${escapeHTML(section.heading)}</h2>
    ${section.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('')}</section>`).join('');
  mount.innerHTML = `<header class="article-head container">
      <span class="eyebrow">${escapeHTML(story.category)} &nbsp; / &nbsp; ${escapeHTML(story.period)}</span>
      <h1>${escapeHTML(story.title)}</h1>
      <p class="article-deck">${escapeHTML(story.excerpt)}</p>
      <div class="article-meta"><span>${escapeHTML(story.date)}</span><span class="sep">✦</span><span>${escapeHTML(story.readTime)}</span><span class="sep">✦</span><span>By the editor</span></div>
    </header>
    <figure class="article-visual container"><img src="${story.image}" alt="${escapeHTML(story.imageAlt)}" /><figcaption>Original illustration for The Long View · Sample editorial essay</figcaption></figure>
    <div class="article-layout container">
      <aside class="article-side"><span class="section-kicker">In this essay</span>${toc}<a class="back-link" href="./archive.html"><i data-lucide="arrow-left"></i> All essays</a></aside>
      <article class="article-body"><p class="lead">${escapeHTML(story.lead)}</p>${content}<div class="article-end">An independent notebook on history & ideas. This is demonstration content; replace it with your own research and sources before publishing.</div></article>
    </div>`;
  const progress = $('#read-progress');
  if (progress) {
    const update = () => {
      const remaining = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${remaining > 0 ? Math.min(100, Math.max(0, window.scrollY / remaining * 100)) : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  icons();
}

initializeTheme();
initializeMobileMenu();
initializeHomepage();
initializeArchive();
initializeEssay();
$$('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
icons();
