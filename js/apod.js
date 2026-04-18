'use strict';

// Shared config duplicated strictly per requested file structure
const NASA_KEY = 'DEMO_KEY'; 
const NASA_BASE = 'https://api.nasa.gov';

// Utility functions
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function showSpinner(container) {
  container.innerHTML = '<div class="spinner"></div>';
}

function showError(container, msg) {
  container.innerHTML = `
    <div class="state-error" style="text-align:center; padding: 40px;">
      <div style="font-size:2rem; margin-bottom:10px;">⚠️</div>
      <div style="color:var(--text-secondary);">${msg}</div>
    </div>`;
}

// APOD Core Logic
async function initAPOD() {
  const wrapper = document.getElementById('apod-wrapper');
  if (!wrapper) return;

  showSpinner(wrapper);

  try {
    const data = await fetchJSON(`${NASA_BASE}/planetary/apod?api_key=${NASA_KEY}`);
    renderAPOD(data, wrapper);
  } catch (err) {
    console.error('APOD error:', err);
    showError(wrapper, 'Could not fetch today\'s Astronomy Picture of the Day. The API may be temporarily unavailable.');
  }
}

function renderAPOD(data, wrapper) {
  const isVideo = data.media_type === 'video';

  const mediaHTML = isVideo
    ? `<iframe src="${data.url}" title="${data.title}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
    : `<img src="${data.hdurl || data.url}" alt="${data.title}" loading="lazy" />
       <span class="apod-date-badge">${formatDate(data.date)}</span>`;

  wrapper.innerHTML = `
    <div class="apod-grid">
      <div class="apod-media-wrap">${mediaHTML}</div>
      <div class="apod-info glass-card" style="padding:36px">
        <p class="eyebrow">📡 Astronomy Picture of the Day</p>
        <h1 class="apod-title">${data.title}</h1>
        <p class="apod-description">${data.explanation}</p>
        <div class="apod-meta-grid">
          <div class="apod-meta-item">
            <div class="apod-meta-label">Date</div>
            <div class="apod-meta-value">${formatDate(data.date)}</div>
          </div>
          <div class="apod-meta-item">
            <div class="apod-meta-label">Media Type</div>
            <div class="apod-meta-value" style="text-transform:capitalize">${data.media_type}</div>
          </div>
          ${data.copyright ? `
          <div class="apod-meta-item" style="grid-column:1/-1">
            <div class="apod-meta-label">Copyright</div>
            <div class="apod-meta-value">© ${data.copyright}</div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', initAPOD);
