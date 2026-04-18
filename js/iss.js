'use strict';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function initISS() {
  const latEl  = document.getElementById('iss-lat');
  const lonEl  = document.getElementById('iss-lon');
  
  if (!latEl) return;

  let map, issMarker;

  try {
    map = L.map('iss-map', {
      center: [0, 0],
      zoom: 3,
      zoomControl: true,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    const issIcon = L.divIcon({
      html: '<div class="iss-marker">🛸</div>',
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
  } catch (e) {
    console.error('Leaflet init error:', e);
  }

  async function updateISS() {
    try {
      const data = await fetchJSON('https://api.wheretheiss.at/v1/satellites/25544');
      const lat = parseFloat(data.latitude).toFixed(4);
      const lon = parseFloat(data.longitude).toFixed(4);

      if (latEl) latEl.textContent = lat + '°';
      if (lonEl) lonEl.textContent = lon + '°';

      if (issMarker) {
        issMarker.setLatLng([lat, lon]);
        map.panTo([lat, lon], { animate: true, duration: 1.0 });
      }
    } catch (err) {
      console.error('ISS position error:', err);
    }
  }

  updateISS();
  const issInterval = setInterval(updateISS, 5000);

  window.addEventListener('pagehide', () => clearInterval(issInterval));
}

document.addEventListener('DOMContentLoaded', initISS);
