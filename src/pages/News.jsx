// ============================================================
// pages/News.jsx — Space News Feed
//
// Fetches latest space news from Spaceflight News API.
// Features:
//   - Filter by source (All / NASA / SpaceX / ESA)
//   - Save articles to wishlist (useWishlist hook)
//   - Row-based layout like a terminal dispatch feed
// ============================================================

import { useState, useMemo } from 'react';
import useFetch      from '../hooks/useFetch';
import useWishlist   from '../hooks/useWishlist';
import { API }       from '../utils/constants';
import SectionHeader from '../components/SectionHeader';
import Loader        from '../components/Loader';
import './News.css';

const FILTERS = ['ALL', 'NASA', 'SPACEX', 'ESA'];

function News() {
  const [filter, setFilter] = useState('ALL');
  const { data, loading, error } = useFetch(API.NEWS);
  const { toggleSave, isSaved }  = useWishlist();

  const articles = data?.results || [];

  // Filter articles by selected source
  const filtered = useMemo(() => {
    if (filter === 'ALL') return articles;
    return articles.filter(a =>
      a.news_site.toLowerCase().includes(filter.toLowerCase()) ||
      a.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [articles, filter]);

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_05 // DISPATCH"
          title="SPACE NEWS FEED"
          sourceUrl="spaceflightnewsapi.net"
          status={loading ? 'FETCHING...' : `${filtered.length} ARTICLES`}
        />

        {/* Filter buttons */}
        <div className="news-toolbar">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`news-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? 'ALL SOURCES' : f}
            </button>
          ))}
          <div className="news-count">
            SHOWING <span>{filtered.length}</span> ARTICLES
          </div>
        </div>

        {loading && <Loader message="FETCHING LATEST DISPATCH..." />}
        {error   && <div className="news-error">FEED UNAVAILABLE — {error}</div>}

        {/* Article rows */}
        {!loading && filtered.length > 0 && (
          <div className="news-list">
            {filtered.map(article => {
              const saved = isSaved(article.id);
              return (
                <div key={article.id} className="news-row">

                  {/* Thumbnail */}
                  <div className="news-img-cell">
                    <img
                      className="news-row-img"
                      src={article.image_url || 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400'}
                      alt=""
                      loading="lazy"
                      onError={e => {
                        e.target.src = 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400';
                      }}
                    />
                  </div>

                  {/* Text body */}
                  <div className="news-body">
                    <div className="news-source">// {article.news_site}</div>
                    <div className="news-headline">{article.title}</div>
                    <div className="news-date">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="news-actions">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="news-read-btn"
                    >
                      READ ↗
                    </a>
                    <button
                      className={`news-save-btn ${saved ? 'saved' : ''}`}
                      onClick={() => toggleSave({
                        id:     article.id,
                        title:  article.title,
                        url:    article.url,
                        source: article.news_site,
                      })}
                    >
                      {saved ? '★ SAVED' : '☆ SAVE'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="news-empty">&gt; NO RESULTS FOR FILTER: {filter}</div>
        )}
      </div>
    </main>
  );
}

export default News;
