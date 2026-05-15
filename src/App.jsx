// ============================================================
// App.jsx — Root component
//
// Sets up React Router routes. Every page shares:
//   - <Navbar /> at the top (fixed)
//   - <Footer /> at the bottom
//   - The page component in between
//
// Routes:
//   /            → Home (hero landing page)
//   /apod        → APOD page
//   /mars        → Mars Rover Gallery
//   /asteroids   → Asteroid Tracker
//   /iss         → ISS 3D Globe Tracker
//   /news        → Space News Feed
//   /wishlist    → Saved Articles
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import Home      from './pages/Home';
import Apod      from './pages/Apod';
import Mars      from './pages/Mars';
import Asteroids from './pages/Asteroids';
import ISS       from './pages/ISS';
import News      from './pages/News';
import Wishlist  from './pages/Wishlist';
import About from './pages/About';
import NewsletterPage from './pages/Newsletter';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is fixed at top — always visible across all pages */}
      <Navbar />

      {/* Page content changes based on route */}
      <Routes>
        <Route path="/"           element={<Home />}      />
        <Route path="/apod"       element={<Apod />}      />
        <Route path="/mars"       element={<Mars />}      />
        <Route path="/asteroids"  element={<Asteroids />} />
        <Route path="/iss"        element={<ISS />}       />
        <Route path="/news"       element={<News />}      />
        <Route path="/wishlist"   element={<Wishlist />}  />
        <Route path="/about"      element={<About />} />
        <Route path="/newsletter" element={<NewsletterPage />} 

        

         />
      </Routes>

      {/* Footer is always at the bottom */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
