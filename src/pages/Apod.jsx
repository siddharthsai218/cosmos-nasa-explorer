// ============================================================
// pages/Apod.jsx — Astronomy Picture of the Day
//
// Fetches today's NASA APOD and shows:
//   - Full image (left panel) with scan-line animation
//   - Title, date, explanation, copyright (right panel)
// ============================================================

import useFetch from '../hooks/useFetch';
import { API }  from '../utils/constants';
import SectionHeader from '../components/SectionHeader';
import Loader from '../components/Loader';
import './Apod.css';

function Apod() {
  const { data, loading, error } = useFetch(API.APOD);

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_01 // APOD"
          title="ASTRONOMY PICTURE OF THE DAY"
          sourceUrl="api.nasa.gov/planetary/apod"
          status={loading ? 'FETCHING...' : error ? 'ERROR' : 'RECEIVED'}
        />

        {/* Loading state */}
        {loading && <Loader message="FETCHING FROM NASA SERVERS..." />}

        {/* Error state */}
        {error && (
          <div className="apod-error">
            SIGNAL LOST — {error}. Check your API key in utils/constants.js
          </div>
        )}

        {/* Success state */}
        {data && (
          <div className="apod-wrap">

            {/* Left — image panel */}
            <div className="apod-img-panel">
              {/* Animated scan line overlay */}
              <div className="apod-scan-line" />

              {data.media_type === 'image' ? (
                <img
                  src={data.url}
                  alt={data.title}
                  className="apod-img"
                />
              ) : (
                // Video fallback
                <div className="apod-video-fallback">
                  <div className="apod-vid-label">VIDEO CONTENT</div>
                  <a href={data.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                    OPEN FEED ↗
                  </a>
                </div>
              )}

              {/* Corner badges */}
              <div className="apod-badge top-left">NASA // APOD</div>
              <div className="apod-badge bottom-right">{data.date}</div>
            </div>

            {/* Right — data panel */}
            <div className="apod-data">
              <div className="apod-data-header">
                <span className="apod-date-tag">{data.date}</span>
                <span className="apod-type-tag">{data.media_type?.toUpperCase()}</span>
              </div>

              <h2 className="apod-photo-title">{data.title}</h2>

              <p className="apod-explanation">{data.explanation}</p>

              {data.copyright && (
                <div className="apod-copyright">COPYRIGHT: {data.copyright}</div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

export default Apod;
