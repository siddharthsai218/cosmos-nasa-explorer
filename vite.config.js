// ============================================================
// vite.config.js — Vite dev server with API proxies
//
// WHY THIS EXISTS:
// NASA APIs and open-notify.org block direct browser requests
// due to CORS. Third-party proxies like allorigins are
// unreliable. The correct solution is Vite's built-in proxy:
// requests go  browser → Vite dev server → real API
// Since it's server-to-server, CORS doesn't apply at all.
//
// How it works:
//   Browser fetches  /nasa/planetary/apod?api_key=...
//   Vite forwards to https://api.nasa.gov/planetary/apod?api_key=...
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // All /nasa/* → https://api.nasa.gov/*
      '/nasa': {
        target:       'https://api.nasa.gov',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/nasa/, ''),
        secure:       true,
      },

      // /iss/* → http://api.open-notify.org/*
      '/iss': {
        target:       'http://api.open-notify.org',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/iss/, ''),
        secure:       false, // allow HTTP target
      },

      // /spacenews/* → https://api.spaceflightnewsapi.net/*
      '/spacenews': {
        target:       'https://api.spaceflightnewsapi.net',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/spacenews/, ''),
        secure:       true,
      },
    },
  },
});
