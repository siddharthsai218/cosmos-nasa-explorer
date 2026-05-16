// ============================================================
// pages/Asteroids.jsx — Near Earth Object Tracker
// Fix: memoize the URL so useFetch doesn't loop infinitely
// ============================================================

import { useMemo } from 'react';
import useFetch      from '../hooks/useFetch';
import { API }       from '../utils/constants';
import SectionHeader from '../components/SectionHeader';
import Loader        from '../components/Loader';
import './Asteroids.css';

const fmt = n => parseInt(n).toLocaleString();

function Asteroids() {
  // useMemo with [] = computed once on mount, stable URL for useFetch
  const { today, end, url } = useMemo(() => {
    const t = new Date().toISOString().split('T')[0];
    const e = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    return { today: t, end: e, url: API.ASTEROIDS(t, e) };
  }, []);

  const { data, loading, error } = useFetch(url);

  const asteroids = useMemo(() => {
    if (!data?.near_earth_objects) return [];
    return Object.values(data.near_earth_objects)
      .flat()
      .sort((a, b) =>
        parseFloat(a.close_approach_data[0].miss_distance.kilometers) -
        parseFloat(b.close_approach_data[0].miss_distance.kilometers)
      )
      .slice(0, 20);
  }, [data]);

  const totalCount = data?.near_earth_objects
    ? Object.values(data.near_earth_objects).flat().length
    : 0;

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_03 // NEO TRACKER"
          title="NEAR EARTH OBJECTS"
          sourceUrl="api.nasa.gov/neo/rest"
          status={loading ? 'QUERYING...' : error ? 'ERROR' : `${today} → ${end}`}
        />

        {!loading && !error && (
          <div className="ast-header-row">
            <div>
              <div className="ast-bignum">{totalCount || '—'}</div>
              <div className="ast-bignum-label">NEAR-EARTH OBJECTS DETECTED THIS WEEK</div>
            </div>
            <div className="ast-legend">
              <div className="ast-leg-item"><div className="ast-leg-dot danger" /><span>POTENTIALLY HAZARDOUS</span></div>
              <div className="ast-leg-item"><div className="ast-leg-dot safe" /><span>NO THREAT</span></div>
            </div>
          </div>
        )}

        {loading && <Loader message="QUERYING NASA NEOWS DATABASE..." />}
        {error   && <div className="ast-error">SIGNAL ERROR — {error}</div>}

        {!loading && asteroids.length > 0 && (
          <div className="ast-table-wrap">
            <table className="ast-table">
              <thead>
                <tr>
                  <th>DESIGNATION</th><th>EST. DIAMETER (M)</th>
                  <th>VELOCITY (KM/H)</th><th>MISS DISTANCE (KM)</th>
                  <th>APPROACH DATE</th><th>THREAT LEVEL</th>
                </tr>
              </thead>
              <tbody>
                {asteroids.map(ast => {
                  const ca        = ast.close_approach_data[0];
                  const hazardous = ast.is_potentially_hazardous_asteroid;
                  return (
                    <tr key={ast.id} className={hazardous ? 'row-hazardous' : ''}>
                      <td><div className="ast-name">{ast.name.replace(/[()]/g, '')}</div><div className="ast-id">#{ast.id}</div></td>
                      <td><span className="ast-val">{fmt(ast.estimated_diameter.meters.estimated_diameter_max)}</span></td>
                      <td><span className="ast-val">{fmt(ca.relative_velocity.kilometers_per_hour)}</span></td>
                      <td><span className="ast-val">{fmt(ca.miss_distance.kilometers)}</span></td>
                      <td>{ca.close_approach_date}</td>
                      <td><span className={`ast-badge ${hazardous ? 'badge-danger' : 'badge-safe'}`}>{hazardous ? 'HAZARDOUS' : 'NOMINAL'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default Asteroids;
