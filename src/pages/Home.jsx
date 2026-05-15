// ============================================================
// pages/Home.jsx — Hero landing page
// ============================================================

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { API } from '../utils/constants';
import Newsletter from './Newsletter';

import './Home.css';

// Helper — get today and +7 days as YYYY-MM-DD strings
function getDateRange() {
  const today = new Date().toISOString().split('T')[0];
  const end = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split('T')[0];

  return { today, end };
}

function Home() {
  const { today, end } = getDateRange();
  const { data: neoData } = useFetch(API.ASTEROIDS(today, end));

  const neoCount = neoData
    ? Object.values(neoData.near_earth_objects).flat().length
    : '—';

  const stats = [
    { val: neoCount, label: 'NEOs THIS WEEK' },
    { val: '408', label: 'ISS ALTITUDE KM' },
    { val: '5', label: 'LIVE APIs' },
    { val: '3', label: 'ACTIVE ROVERS' },
  ];

  return (
    <div className="home">
      {/* Background is now handled by index.css globally */}
      <div className="home-inner">
        <div className="boot-header">
          <div>COSMOS MISSION CONTROL v2.0 | <span> NASA API INTEGRATION ACTIVE</span></div>
          <div>INITIALIZING DATA FEEDS... <span> [ OK ]</span></div>
          <div>UPLINK STATUS: <span> NOMINAL</span></div>
        </div>

        <h1 className="hero-title">COSMOS<span className="cursor-blink" /></h1>
        <p className="hero-subtitle">// NASA SPACE EXPLORER — REAL-TIME DATA</p>

        <div className="hero-stats">
          {stats.map(({ val, label }) => (
            <div key={label} className="hero-stat">
              <div className="hero-stat-val">{val}</div>
              <div className="hero-stat-key">{label}</div>
            </div>
          ))}
        </div>

        <div className="hero-cta">
          <Link to="/apod" className="btn btn-primary">ENTER SYSTEM</Link>
          <Link to="/news" className="btn btn-ghost">LATEST DISPATCH</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;