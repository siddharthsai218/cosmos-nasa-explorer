// ============================================================
// components/Footer.jsx — Bottom footer bar
//
// Shared across all pages. Shows logo, credits, API list.
// ============================================================

import './Footer.css';

const APIS = ['NASA APOD', 'MARS ROVERS', 'NEOWS', 'OPEN NOTIFY', 'SPACEFLIGHT NEWS'];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">COSMOS</div>

      <div className="footer-center">
        NASA PUBLIC API INTEGRATION &nbsp;//&nbsp; UID END SEM 2025–2026
      </div>

      <div className="footer-apis">
        {APIS.map(api => (
          <span key={api} className="footer-api-tag">{api}</span>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
