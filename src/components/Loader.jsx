// ============================================================
// components/Loader.jsx — Reusable loading spinner
//
// Used in every page while API data is being fetched.
// Props:
//   message — optional string shown under spinner
// ============================================================

import './Loader.css';

function Loader({ message = 'FETCHING DATA...' }) {
  return (
    <div className="loader-wrap">
      <div className="t-spinner" />
      <span className="loader-msg">{message}</span>
    </div>
  );
}

export default Loader;
