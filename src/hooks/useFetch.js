// ============================================================
// hooks/useFetch.js — Generic reusable data-fetching hook
//
// Usage:
//   const { data, loading, error } = useFetch(url)
//
// Returns:
//   data    — the parsed JSON response (null until loaded)
//   loading — true while request is in flight
//   error   — error message string if request failed
// ============================================================

import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Don't fetch if no URL given
    if (!url) return;

    let cancelled = false; // prevents setting state after unmount

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res  = await fetch(url);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    // Cleanup: if component unmounts before fetch completes, ignore result
    return () => { cancelled = true; };
  }, [url]); // re-fetch whenever URL changes

  return { data, loading, error };
}

export default useFetch;
