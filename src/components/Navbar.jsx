// ============================================================
// components/Navbar.jsx — Top navigation bar
//
// Shared component rendered on every page via App.jsx.
// Shows: logo, nav links, live UTC clock, system status.
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// Nav links config — path + label
const NAV_LINKS = [
  { path: '/',            label: 'HOME' },
  { path: '/newsletter',  label: 'NEWSLETTER' },
  { path: '/apod',        label: 'APOD' },
  { path: '/mars',        label: 'MARS' },
  { path: '/asteroids',   label: 'NEO' },
  { path: '/iss',         label: 'ISS' },
  { path: '/news',        label: 'NEWS' },
  { path: '/wishlist',    label: 'SAVED' },
  { path: '/about',       label: 'ABOUT' },
];

function Navbar() {
  const location = useLocation();           // to highlight active link
  const [time, setTime] = useState('');     // live UTC clock

  // Update clock every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh  = now.getUTCHours()  .toString().padStart(2, '0');
      const mm  = now.getUTCMinutes().toString().padStart(2, '0');
      const ss  = now.getUTCSeconds().toString().padStart(2, '0');
      setTime(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  return (
    <nav className="navbar">
      {/* Left — logo + mission status */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">COSMOS</Link>
        <div className="navbar-mission">
          <span>MISSION:</span> NASA PUBLIC DATA FEED — ACTIVE
        </div>
      </div>

      {/* Centre — page links */}
      <ul className="navbar-links">
        {NAV_LINKS.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={`navbar-link ${location.pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right — system status + clock */}
      <div className="navbar-right">
        <div className="navbar-status">
          <div className="status-dot" />
          SYS ONLINE
        </div>
        <div className="navbar-clock">{time}</div>
      </div>
    </nav>
  );
}

export default Navbar;
