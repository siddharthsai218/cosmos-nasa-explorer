// ============================================================
// components/SectionHeader.jsx — Reusable section title block
//
// Used at the top of every page section.
// Props:
//   moduleId  — e.g. "MODULE_01 // APOD"
//   title     — big display font heading
//   sourceUrl — shown in the right meta column
//   status    — live status string (optional)
// ============================================================

import './SectionHeader.css';

function SectionHeader({ moduleId, title, sourceUrl, status }) {
  return (
    <div className="sec-header">
      {/* Left — module ID + big title */}
      <div>
        <div className="sec-id">{moduleId}</div>
        <div className="sec-title">{title}</div>
      </div>

      {/* Right — API source + status */}
      <div className="sec-meta">
        SOURCE: <span>{sourceUrl}</span>
        STATUS: <span>{status || 'ACTIVE'}</span>
      </div>
    </div>
  );
}

export default SectionHeader;
