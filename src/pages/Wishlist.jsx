// ============================================================
// pages/Wishlist.jsx — Saved Articles Reading List
//
// Reads saved articles from localStorage via useWishlist hook.
// Users can remove individual articles or clear all.
// ============================================================

import useWishlist   from '../hooks/useWishlist';
import SectionHeader from '../components/SectionHeader';
import './Wishlist.css';

function Wishlist() {
  const { saved, remove } = useWishlist();

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_06 // ARCHIVE"
          title="SAVED ARTICLES"
          sourceUrl="localStorage"
          status={`${saved.length} ENTRIES`}
        />

        {/* Empty state */}
        {saved.length === 0 && (
          <div className="wl-empty">
            &gt; NO ARCHIVED ARTICLES — SAVE FROM NEWS FEED
          </div>
        )}

        {/* Saved article cards */}
        {saved.length > 0 && (
          <div className="wl-grid">
            {saved.map(article => (
              <div key={article.id} className="wl-card">
                {/* Top accent line colour + source label */}
                <div className="wl-source">// {article.source}</div>

                <div className="wl-title">{article.title}</div>

                <div className="wl-actions">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="wl-read"
                  >
                    READ ↗
                  </a>
                  <button
                    className="wl-remove"
                    onClick={() => remove(article.id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
