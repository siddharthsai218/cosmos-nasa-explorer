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
  container.innerHTML = '<div class="spinner" style="margin: 40px auto; width: 40px; height: 40px; border: 3px solid rgba(79,142,247,0.15); border-top-color: #4f8ef7; border-radius: 50%; animation: spin 0.7s linear infinite;"></div><style>@keyframes spin { to { transform: rotate(360deg); } }</style>';
}

function showEmpty(container, msg) {
  container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted);">${msg}</div>`;
}

function showError(container, msg) {
  container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-secondary);">⚠️ ${msg}</div>`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

// Mars Core Logic
function initMars() {
  const roverSelect  = document.getElementById('rover-select');
  const solInput     = document.getElementById('sol-input');
  const fetchBtn     = document.getElementById('fetch-mars-btn');
  const marsGrid     = document.getElementById('mars-grid');
  const marsCount    = document.getElementById('mars-count');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbCaption    = document.getElementById('lightbox-caption');
  const lbClose      = document.getElementById('lightbox-close');

  if (!roverSelect) return;

  fetchBtn.addEventListener('click', fetchMarsPhotos);

  solInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') fetchMarsPhotos();
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  fetchMarsPhotos();

  async function fetchMarsPhotos() {
    const rover = roverSelect.value;
    const sol   = parseInt(solInput.value) || 1000;

    fetchBtn.disabled = true;
    fetchBtn.textContent = '⏳ Loading…';
    showSpinner(marsGrid);
    if (marsCount) marsCount.style.display = 'none';

    try {
      const data = await fetchJSON(
        `${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_KEY}&page=1`
      );
      const photos = data.photos || [];

      if (photos.length === 0) {
        showEmpty(marsGrid, `No photos found for ${capitalize(rover)} on Sol ${sol}. Try a different Sol (e.g. 1000, 500, 200).`);
      } else {
        renderMarsPhotos(photos.slice(0, 48), rover, sol);
      }

      if (marsCount) {
        marsCount.style.display = 'inline-flex';
        marsCount.innerHTML = `🛸 &nbsp;Showing <strong>${Math.min(photos.length, 48)}</strong> of <strong>${photos.length}</strong> photos — Sol ${sol}`;
      }
    } catch (err) {
      console.error('Mars error:', err);
      showError(marsGrid, `Could not fetch photos from ${capitalize(rover)}. Check your API key or try again.`);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = '🔍 Fetch Photos';
    }
  }

  function renderMarsPhotos(photos, rover, sol) {
    marsGrid.innerHTML = '';
    photos.forEach((photo, i) => {
      const card = el(`
        <div class="mars-card glass-card" tabindex="0" role="button" aria-label="View photo">
          <img src="${photo.img_src}" alt="Mars photo by ${photo.camera.name}" loading="lazy" />
          <div class="mars-card-info">
            <div class="mars-card-rover">${capitalize(rover)}</div>
            <div class="mars-card-camera">${photo.camera.full_name}</div>
            <div class="mars-card-sol">Sol ${photo.sol} &nbsp;·&nbsp; ${formatDate(photo.earth_date)}</div>
          </div>
        </div>`);

      const openLightbox = () => {
        lbImg.src = photo.img_src;
        lbCaption.textContent = `${capitalize(rover)} · ${photo.camera.full_name} · Sol ${photo.sol}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      card.addEventListener('click', openLightbox);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
      });

      marsGrid.appendChild(card);
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }
}

document.addEventListener('DOMContentLoaded', initMars);
