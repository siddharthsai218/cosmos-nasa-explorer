// ============================================================
// utils/constants.js
// ============================================================

export const NASA_KEY = '64qgnfxsuLEoGKdGHFgvhObM0L6YKATxdghEeGae';

export const API = {

  // NASA APIs
  APOD:
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,

  MARS: (rover, sol) =>
    `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_KEY}`,

  ASTEROIDS: (start, end) =>
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_KEY}`,

  // ISS API
  ISS:
    'https://api.wheretheiss.at/v1/satellites/25544',

  // Space News API
  NEWS:
    'https://api.spaceflightnewsapi.net/v4/articles/?limit=12',
};

export const ROVERS = [
  'curiosity',
  'opportunity',
  'spirit',
];

export const SAVED_KEY = 'cosmos_saved';