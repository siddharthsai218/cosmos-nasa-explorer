'use strict';

const LS_KEY = 'cosmos_reading_list';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function showSpinner(container) {
  container.innerHTML = '<div style="margin: 40px auto; width: 40px; height: 40px; border: 3px solid rgba(79,142,247,0.15); border-top-color: #4f8ef7; border-radius: 50%; animation: spin 0.7s linear infinite;"></div><style>@keyframes spin { to { transform: rotate(360deg); } }</style>';
}

function showError(container, msg) {
  container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-secondary);">⚠️ ${msg}</div>`;
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function getSavedArticles() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function isArticleSaved(id) {
  return getSavedArticles().some(a => String(a.id) === String(id));
}

function saveArticle(article) {
  const saved = getSavedArticles();
  if (!isArticleSaved(article.id)) {
    saved.unshift(article);
    localStorage.setItem(LS_KEY, JSON.stringify(saved));
  }
}

function removeSavedArticle(id) {
  const updated = getSavedArticles().filter(a => String(a.id) !== String(id));
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

async function initNews() {
  const newsFeed = document.getElementById('news-feed');
  if (!newsFeed) return;

  showSpinner(newsFeed);

  try {
    const data = await fetchJSON('https://api.spaceflightnewsapi.net/v4/articles/?limit=20&ordering=-published_at');
    const articles = data.results || [];
    renderNews(articles, newsFeed);
  } catch (err) {
    console.error('News error:', err);
    showError(newsFeed, 'Could not load space news. Please try again later.');
  }
}

function renderNews(articles, container) {
  container.innerHTML = '';
  
  articles.forEach((article, i) => {
    const pubDate = new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isSaved = isArticleSaved(article.id);

    const card = el(`
      <div class="news-article" data-id="${article.id}">
        <div class="news-source-date">
          <span class="news-source">${article.news_site || 'Space News'}</span>
          <span>·</span>
          <span>${pubDate}</span>
        </div>
        <div class="news-title">
          <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
        </div>
        ${article.summary ? `<div class="news-summary">${article.summary}</div>` : ''}
        <div class="news-actions">
          <a href="${article.url}" target="_blank" rel="noopener" style="font-size:0.85rem;color:var(--accent-blue);font-weight:600;">Read Full Article →</a>
          <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${article.id}">
            ${isSaved ? '✓ Saved to Wishlist' : '🔖 Save to Wishlist'}
          </button>
        </div>
      </div>`);

    card.style.animationDelay = `${i * 50}ms`;

    card.querySelector('.btn-save').addEventListener('click', function () {
      const id = this.dataset.id;
      if (isArticleSaved(id)) {
        removeSavedArticle(id);
        this.textContent = '🔖 Save to Wishlist';
        this.classList.remove('saved');
      } else {
        saveArticle({ id: article.id, title: article.title, url: article.url, source: article.news_site });
        this.textContent = '✓ Saved to Wishlist';
        this.classList.add('saved');
      }
    });

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', initNews);
