import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url);

        // Check if request failed
        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status} ${res.statusText}`
          );
        }

        // Check response type
        const contentType =
          res.headers.get('content-type');

        if (
          !contentType ||
          !contentType.includes('application/json')
        ) {
          throw new Error(
            'API did not return valid JSON'
          );
        }

        const json = await res.json();

        if (!cancelled) {
          setData(json);
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;