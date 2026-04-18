'use strict';

const NASA_KEY = 'DEMO_KEY';
const NASA_BASE = 'https://api.nasa.gov';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatNumber(n, decimals = 0) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function showSpinner(container) {
  container.innerHTML = '<div style="margin: 40px auto; width: 40px; height: 40px; border: 3px solid rgba(79,142,247,0.15); border-top-color: #4f8ef7; border-radius: 50%; animation: spin 0.7s linear infinite;"></div><style>@keyframes spin { to { transform: rotate(360deg); } }</style>';
}

function showEmpty(container, msg) {
  container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted);">${msg}</div>`;
}

function showError(container, msg) {
  container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-secondary);">⚠️ ${msg}</div>`;
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

async function initAsteroids() {
  const grid      = document.getElementById('asteroid-grid');
  const statTotal = document.getElementById('stat-total');
  const statSafe  = document.getElementById('stat-safe');
  const statHaz   = document.getElementById('stat-hazard');

  if (!grid) return;

  showSpinner(grid);

  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await fetchJSON(`${NASA_BASE}/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_KEY}`);

    const neoObj = data.near_earth_objects || {};
    const dayKey = Object.keys(neoObj)[0];
    const neos   = neoObj[dayKey] || [];

    if (neos.length === 0) {
      showEmpty(grid, 'No near-Earth objects found for today.');
      return;
    }

    neos.sort((a, b) => (b.is_potentially_hazardous_asteroid ? 1 : 0) - (a.is_potentially_hazardous_asteroid ? 1 : 0));

    const hazCount  = neos.filter(n => n.is_potentially_hazardous_asteroid).length;
    const safeCount = neos.length - hazCount;

    if (statTotal) statTotal.textContent = neos.length;
    if (statSafe)  statSafe.textContent  = safeCount;
    if (statHaz)   statHaz.textContent   = hazCount;

    renderAsteroids(neos, grid);
  } catch (err) {
    console.error('Asteroid error:', err);
    showError(grid, 'Could not fetch near-Earth object data. Please try again later.');
  }
}

function renderAsteroids(neos, grid) {
  grid.innerHTML = '';
  neos.forEach((neo) => {
    const hazardous = neo.is_potentially_hazardous_asteroid;
    const cls       = hazardous ? 'hazardous' : 'safe-asteroid';
    const label     = hazardous ? '⚠ Hazardous' : '✓ Safe';

    const dMin = neo.estimated_diameter?.meters?.estimated_diameter_min;
    const dMax = neo.estimated_diameter?.meters?.estimated_diameter_max;
    const diamStr = (dMin != null && dMax != null) ? `${formatNumber(dMin, 1)} – ${formatNumber(dMax, 1)} m` : 'N/A';

    const approach = neo.close_approach_data?.[0];
    const velocity = approach?.relative_velocity?.kilometers_per_hour ? `${formatNumber(parseFloat(approach.relative_velocity.kilometers_per_hour), 0)} km/h` : 'N/A';
    const missDistance = approach?.miss_distance?.kilometers ? `${formatNumber(parseFloat(approach.miss_distance.kilometers), 0)} km` : 'N/A';

    const card = el(`
      <div class="asteroid-card ${cls}">
        <span class="asteroid-badge ${cls}">${label}</span>
        <div class="asteroid-name">${neo.name.replace(/[()]/g, '')}</div>
        <div class="asteroid-data-row">
          <span class="asteroid-data-label">Est. Diameter</span>
          <span class="asteroid-data-value">${diamStr}</span>
        </div>
        <div class="asteroid-data-row">
          <span class="asteroid-data-label">Relative Velocity</span>
          <span class="asteroid-data-value">${velocity}</span>
        </div>
        <div class="asteroid-data-row">
          <span class="asteroid-data-label">Miss Distance</span>
          <span class="asteroid-data-value">${missDistance}</span>
        </div>
        <div class="asteroid-vis ${cls}"></div>
      </div>`);
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', initAsteroids);
