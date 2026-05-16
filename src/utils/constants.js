// ============================================================
// utils/constants.js — API URLs using Vite proxy paths
//
// All URLs here use local proxy paths (/nasa, /iss, /spacenews)
// Vite's dev server forwards them to the real APIs server-side
// so there are zero CORS issues in the browser.
//
// See vite.config.js for the proxy rules.
// For production build, you'd need a backend or deploy proxy.
// ============================================================

export const NASA_KEY = '64qgnfxsuLEoGKdGHFgvhObM0L6YKATxdghEeGae'; // get a free key at https://api.nasa.gov

export const API = {
  // /nasa/* → https://api.nasa.gov/*
  APOD: `/nasa/planetary/apod?api_key=${NASA_KEY}`,

  MARS: (rover, sol) =>
    `/nasa/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_KEY}`,

  ASTEROIDS: (start, end) =>
    `/nasa/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_KEY}`,

  // /iss/* → http://api.open-notify.org/*
  ISS: `/iss/iss-now.json`,

  // /spacenews/* → https://api.spaceflightnewsapi.net/*
  NEWS: `/spacenews/v4/articles/?limit=12`,
};

export const ROVERS    = ['curiosity', 'opportunity', 'spirit'];
export const SAVED_KEY = 'cosmos_saved';
