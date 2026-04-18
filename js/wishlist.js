'use strict';

const LS_KEY = 'cosmos_reading_list';

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function getSavedArticles() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function removeSavedArticle(id) {
  const updated = getSavedArticles().filter(a => String(a.id) !== String(id));
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  renderReadingList(); // Re-render immediately on deletion
}

function renderReadingList() {
  const readingListEl = document.getElementById('reading-list');
  if (!readingListEl) return;
  
  const saved = getSavedArticles();

  if (saved.length === 0) {
    readingListEl.innerHTML = '<div class="reading-list-empty">📚 Your reading list is empty. Explore the News page to save articles.</div>';
    return;
  }

  readingListEl.innerHTML = '';
  
  saved.forEach(article => {
    const item = el(`
      <div class="saved-article" data-id="${article.id}">
        <div>
          <div class="saved-article-title">
            <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
          </div>
          <div class="saved-source">${article.source || 'Space News'}</div>
        </div>
        <button class="btn-danger">✕ Remove</button>
      </div>`);

    item.querySelector('.btn-danger').addEventListener('click', () => {
      removeSavedArticle(article.id);
    });

    readingListEl.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', renderReadingList);
